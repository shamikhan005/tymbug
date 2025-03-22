import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from 'next/headers';
import { supabase } from "@/app/utils/supabase";

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
    const { webhookId, targetUrl } = await request.json();

    if (!webhookId) {
      return NextResponse.json({ error: 'Webhook ID is required' }, { status: 400 });
    }

    if (!targetUrl) {
      return NextResponse.json({ error: 'Target URL is required' }, { status: 400 });
    }

    // Get the original webhook
    const webhook = await prisma.webhook.findUnique({
      where: {
        id: webhookId,
        userId: userId
      },
    });

    if (!webhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    // Replay the webhook to the target URL
    const response = await fetch(targetUrl, {
      method: webhook.method,
      headers: webhook.headers as any,
      body: JSON.stringify(webhook.body)
    });

    const responseStatus = response.status;
    let responseBody;
    
    try {
      responseBody = await response.json();
    } catch (e) {
      responseBody = { text: await response.text() };
    }

    // Record the replay
    const replay = await prisma.replay.create({
      data: {
        originalId: webhook.id,
        responseStatus,
        userId: userId
      }
    });

    return NextResponse.json({
      success: true,
      replayId: replay.id,
      responseStatus,
      responseBody
    });
    
  } catch (error) {
    console.error('Error replaying webhook:', error);
    return NextResponse.json(
      { error: 'Failed to replay webhook', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
