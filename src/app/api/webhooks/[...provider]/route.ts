import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { NextResponse } from "next/server";
import { supabase } from "@/app/utils/supabase";

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

const WebhookSchema = z.object({
  headers: z.record(z.string()),
  body: z.record(z.any())
});

export async function POST(request: Request, context: { params: { provider: string[] } }) {
  const params = await Promise.resolve(context.params);

  try {
    await prisma.$connect();

    // extract authentication token from headers
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split('Bearer ')[1];

    if (!token) {
      return NextResponse.json({ error: 'No authentication token provided' }, { status: 401 });
    }

    // verify supabase user from token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid or expired authentication token' }, { status: 401 });
    }

    const provider = params.provider.join('/');

    const headers = Object.fromEntries(
      Array.from(request.headers.entries())
        .filter(([key]) => !['authorization', 'content-length'].includes(key.toLowerCase()))
    );

    const body = await request.json().catch(() => ({}));


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
        user: {
          connect: {
            id: user.id
          }
        }
      },
    });

    return NextResponse.json({ id: webhook.id }, { status: 200 });

  } catch (error) {

    console.error("Webhook error:", error instanceof Error ? error.message : "Unknown error");

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unexpected error format"
      },
      { status: 500 }
    );

  }
}
