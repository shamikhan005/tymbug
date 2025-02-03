import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/utils/supabase";
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json (
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email, 
      password
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: error.status || 401 })
    }

    const cookieStore = await cookies();

    if (data.session) {
      cookieStore.set('sb-access-token', data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: data.session.expires_in,
        path: '/'
      })

      cookieStore.set('sb-refresh-token', data.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: data.session.expires_in,
        path: '/'
      })
    }

    return NextResponse.json({
      user: data.user,
      message: 'Login successful'
    }, {
      status: 200, headers: { 'Cache-Control': 'no-store, max-age=0' }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}