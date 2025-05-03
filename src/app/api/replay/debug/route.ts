import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from 'next/headers';
import { supabase } from "@/app/utils/supabase";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('sb-access-token')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized - No access token'}, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      console.error('Error getting user from access token:', authError);
      return NextResponse.json({ error: 'Unauthorized - Invalid access token' }, { status: 401 });
    }

    const userId = user.id;

    const requestBody = await request.json();
    const { 
      webhookId, 
      targetUrl, 
      headers: customHeaders, 
      body: customBody 
    } = requestBody;

    if (!webhookId) {
      return NextResponse.json({ error: 'Webhook ID is required' }, { status: 400 });
    }

    if (!targetUrl) {
      return NextResponse.json({ error: 'Target URL is required' }, { status: 400 });
    }

    const webhook = await prisma.webhook.findUnique({
      where: {
        id: webhookId,
        userId: userId
      },
    });

    if (!webhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    const headersToSend = { ...customHeaders };
    
    const headersToRemove = [
      'content-length', 
      'host', 
      'connection', 
      'transfer-encoding'
    ];
    
    headersToRemove.forEach(header => {
      if (headersToSend[header]) delete headersToSend[header];
      if (headersToSend[header.toLowerCase()]) delete headersToSend[header.toLowerCase()];
    });

    if (!headersToSend['content-type'] && !headersToSend['Content-Type']) {
      headersToSend['Content-Type'] = 'application/json';
    }

    let fullUrl = targetUrl;
    
    if (targetUrl.startsWith('/') && !targetUrl.match(/^https?:\/\//)) {
      let host = request.headers.get('host') || 'tymbug.vercel.app';
      
      if (host.includes('localhost')) {
        host = 'tymbug.vercel.app';
      }
      
      const protocol = request.headers.get('x-forwarded-proto') || 'https';
      fullUrl = `${protocol}://${host}${targetUrl}`;
    }
    
    try {
      console.log(`Sending webhook to: ${fullUrl}`);
      
      const response = await axios({
        method: webhook.method,
        url: fullUrl,
        headers: headersToSend,
        data: customBody,
        timeout: 30000, 
        validateStatus: () => true, 
      });

      const replay = await prisma.replay.create({
        data: {
          originalId: webhook.id,
          responseStatus: response.status,
          userId: userId
        }
      });

      return NextResponse.json({
        success: true,
        replayId: replay.id,
        responseStatus: response.status,
        responseBody: response.data,
        responseHeaders: response.headers,
      });
    } catch (error) {
      console.error('Error during webhook replay:', error);
      return NextResponse.json({
        success: false,
        error: 'Network error during replay',
        details: error instanceof Error ? error.message : 'Unknown error',
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in debug replay API:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook replay', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 