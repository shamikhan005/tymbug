import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const webhook = await prisma.webhook.findUnique({
      where: { id },
      include: {
        Replay: {
          orderBy: { replayedAt: 'desc' },
        },
      }
    })

    if (!webhook) {
      return NextResponse.json({ error: "webhook not found" }, { status: 404 })
    }

    return NextResponse.json(webhook);
  } catch (error) {
    console.error('error fetching webhook details:', error);
    return NextResponse.json(
      { error: 'failed to fetch webhook details' },
      { status: 500 }
    )
  }
}