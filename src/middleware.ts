import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(request: NextRequest) {

  const path = request.nextUrl.pathname;

  if (path.startsWith('/dashboard')) {
    const accessToken = request.cookies.get('sb-access-token');
    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (path.startsWith('/api/webhooks')) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json( { error: 'unauthorized - no token provided' }, { status: 401 });
    }

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return NextResponse.json( { error: 'invalid token' }, { status: 401 });
      }
    } catch (error) {
      return NextResponse.json( { error: 'invalid token' }, { status: 401 })
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/api/webhooks/:path*']
}