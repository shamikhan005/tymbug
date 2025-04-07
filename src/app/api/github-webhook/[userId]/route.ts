import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { createHmac, timingSafeEqual } from "crypto";

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    
    if (!userId) {
      return NextResponse.json({ error: "Missing user identifier" }, { status: 400 });
    }

    const githubEvent = request.headers.get('x-github-event');
    const githubSignature = request.headers.get('x-hub-signature-256');
    const githubDelivery = request.headers.get('x-github-delivery');
    
    if (!githubEvent || !githubDelivery) {
      return NextResponse.json({ 
        error: "Invalid GitHub webhook request - missing headers" 
      }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: userId },
          { email: `${userId}@tymbug.user` }
        ]
      }
    });

    if (!user) {
      console.error(`User not found for identifier: ${userId}`);
      return NextResponse.json({ error: "Invalid webhook configuration" }, { status: 401 });
    }

    const payload = await request.text();
    
    let parsedBody;
    try {
      parsedBody = JSON.parse(payload);
    } catch (error) {
      return NextResponse.json({ 
        error: "Invalid JSON payload" 
      }, { status: 400 });
    }

    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const webhook = await prisma.webhook.create({
      data: {
        provider: "github",
        path: request.nextUrl.pathname,
        method: "POST",
        headers,
        body: parsedBody,
        responseStatus: 200,
        userId: user.id
      },
    });

    return NextResponse.json({
      success: true,
      id: webhook.id,
      event: githubEvent,
      message: "Webhook received successfully"
    }, { status: 200 });
  } catch (error) {
    console.error("GitHub webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
} 