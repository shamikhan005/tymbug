import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/utils/supabase";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {

    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'email and password are required' }, { status: 400 })
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${request.nextUrl.origin}/api/auth/callback`
      }
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: error.status || 400 })
    }

    return NextResponse.json({
      user: data.user,
      session: data.session,
      message: 'Signup successful - Please check your email!'
    }, {
      status: 201,
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'internal server error' }, { status: 500 })
  }
}