import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('sb-access-token')
  const path = request.nextUrl.pathname

  const protectedRoutes = ['/dashboard']

  if (protectedRoutes.includes(path)) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard']
}