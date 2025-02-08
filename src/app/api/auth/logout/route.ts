import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('sb-access-token');
    cookieStore.delete('sb-refresh-token');

    return NextResponse.json({ message: 'logged out' }, { status: 200 });
  } catch (error: any) {
    console.error('logout error:', error.message);
    return NextResponse.json({ error: 'logout failed' }, { status: 500 });
  }
}
