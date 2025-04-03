import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from 'next/headers';
import { supabase } from "@/app/utils/supabase";

export async function GET() {
  try {
    const cookieStore = cookies();
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

    const uniqueProviders = await prisma.webhook.findMany({
      where: {
        userId: userId
      },
      select: {
        provider: true
      },
      distinct: ['provider']
    });

    const providers = uniqueProviders.map(item => item.provider);
    
    return NextResponse.json({ providers });
  } catch (error) {
    console.error('Error fetching providers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch providers' },
      { status: 500 }
    );
  }
}