import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

const WebhookSchema = z.object({
  headers: z.record(z.string()),
  body: z.record(z.any())
});

export async function POST(request: Request, { params }: { params: { provider: string[] } }) {

  try {
    const provider = params.provider.join('/');

    const headers = Object.fromEntries(request.headers.entries());

    const body = await request.json();

    const validation = WebhookSchema.safeParse({
      headers,
      body: body,
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: "invalid webhook format", details: validation.error },
        { status: 400 }
      )
    }

    const webhook = await prisma.webhook.create({
      data: {
        provider,
        path: `/api/webhooks/${provider}`,
        method: 'POST',
        headers: validation.data.headers,
        body: validation.data.body,
        responseStatus: 200,
      },
    });

    return NextResponse.json({ id: webhook.id }, { status: 200 });

  } catch (error) {

    console.log("webhook error:", error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    )

  }
}
