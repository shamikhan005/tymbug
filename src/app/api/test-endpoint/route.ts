import { timeStamp } from "console";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const headers = Object.fromEntries(request.headers.entries());
  const body = await request.json();

  console.log('test endpoint received webhook:', {
    headers,
    body,
    timeStamp: new Date().toISOString
  });

  const statusCodes = [200, 201, 400, 500];
  const randomStatus = statusCodes[Math.floor(Math.random() * statusCodes.length)];

  return NextResponse.json(
    { message: "test endpoint response", received: body },
    { status: randomStatus }
  );
}