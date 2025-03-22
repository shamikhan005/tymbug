import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('sb-access-token');

    if (!token) {
      return NextResponse.json({ error: 'No token found' }, { status: 401 });
    }

    return NextResponse.json({ token: token.value });
  } catch (error) {
    console.error('Error fetching token:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token' },
      { status: 500 }
    );
  }
}
