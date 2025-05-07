import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import axios, { Method } from "axios";
import { supabase } from "@/app/utils/supabase";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    // extract authentication token from headers
    let token = request.headers.get('authorization')?.split('Bearer ')[1];

    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get('sb-access-token')?.value
    }

    if (!token) {
      return NextResponse.json({ error: 'no authentication token provided' }, { status: 401 })
    }

    // verify supabase user from token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'invalid or expired authentication token' }, { status: 401 });
    }

    const original = await prisma.webhook.findUnique({
      where: { id }
    });

    if (!original) {
      return NextResponse.json({ error: "webhook not found" }, { status: 404 });
    }

    const retry = async (attempt = 0): Promise<any> => {
      try {
        let updateHeaders: Record<string, string | string[]> = {};
        if (original.headers && typeof original.headers === 'object') {
          updateHeaders = {
            ...original.headers as Record<string, string | string[]>,
            Authorization: `Bearer ${token}`
          }
        } else {
          updateHeaders = { Authorization: `Bearer ${token}` }
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.headers.get('origin') || 'http://localhost:3000';
        const targetUrl = new URL(original.path, baseUrl).toString();

        console.log(`Attempting replay to: ${targetUrl} (attempt ${attempt + 1})`);

        const response = await axios({
          method: original.method as Method,
          url: targetUrl,
          headers: updateHeaders,
          data: original.body,
          validateStatus: (status) => true 
        });

        console.log(`Replay response status: ${response.status}`);
        return response;
      } catch (error) {
        console.error(`Replay attempt ${attempt + 1} failed:`, error);
        if (attempt >= 2) throw error;
        const delay = 1000 * (attempt + 1);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return retry(attempt + 1);
      }
    };

    const response = await retry();

    const replay = await prisma.replay.create({
      data: {
        originalId: original.id,
        responseStatus: response.status,
        userId: user.id
      }
    });

    return NextResponse.json({
      ...replay,
      message: 'Webhook replayed successfully'
    });
  } catch (error) {
    console.error("Replay error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { 
        error: "replay failed after 3 attempts",
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
