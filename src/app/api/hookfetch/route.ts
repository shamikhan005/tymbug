import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from 'next/headers';
import { supabase } from "@/app/utils/supabase";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = (await cookieStore).get('sb-access-token')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized - No access token'}, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      console.error('Error getting user from access token:', authError);
      return NextResponse.json({ error: 'Unauthorized - Invalid access token' }, { status: 401 });
    }

    const userId = user.id;

    const webhooks = await prisma.webhook.findMany({
      where: {
        userId: userId
      },
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