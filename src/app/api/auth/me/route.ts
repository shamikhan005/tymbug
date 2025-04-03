import { NextResponse, NextRequest } from "next/server";
import { cookies } from 'next/headers';
import { supabase } from "@/app/utils/supabase";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('sb-access-token')?.value;

    if (!accessToken) {
      console.log('No access token found in cookies');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
      const { data, error } = await supabase.auth.getUser(accessToken);

      if (error) {
        console.error('Supabase auth error:', error.message);
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }

      if (!data.user) {
        console.error('No user found with the provided token');
        return NextResponse.json({ error: 'User not found' }, { status: 401 });
      }

      return NextResponse.json({
        id: data.user.id,
        email: data.user.email
      });
    } catch (supabaseError) {
      console.error('Supabase API error:', supabaseError);
      return NextResponse.json({ error: 'Authentication service error' }, { status: 500 });
    }
  } catch (error) {
    console.error('General error in /api/auth/me:', error);
    return NextResponse.json({
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
