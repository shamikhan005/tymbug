import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const githubEvent = request.headers.get('x-github-event');
    const delivery = request.headers.get('x-github-delivery');

    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const userIdentifier = pathParts[pathParts.length - 1];

    if (!userIdentifier) {
      return NextResponse.json({ error: "Invalid webhook URL format" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: userIdentifier },
          { email: `${userIdentifier}@tymbug.user` }
        ]
      }
    });

    if (!user) {
      console.error(`User not found for identifier: ${userIdentifier}`);
      return NextResponse.json({ error: "Invalid webhook configuration" }, { status: 401 });
    }

    const payload = await request.text();
    const parsedBody = JSON.parse(payload);

    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const webhook = await prisma.webhook.create({
      data: {
        provider: "github",
        path: url.pathname,
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
