import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const webhooks = await prisma.webhook.findMany({
      orderBy: { receivedAt: 'desc' },
      take: 50,
      include: {
        _count: {
          select: { Replay: true },
        },
      },
    });
    return NextResponse.json(webhooks);
  } catch (error) {
    console.error('error fetching webhooks:', error);
    return NextResponse.json(
      { error: 'failed to fetch webhooks' },
      {status: 500}
    )
  }
}