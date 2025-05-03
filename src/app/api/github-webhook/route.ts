import { NextResponse } from "next/server";

export async function POST(request: Request) {
  return NextResponse.json({
    error: "Invalid GitHub webhook URL format",
    message: "Please use either /api/github-webhook/[userId] or /api/webhooks/github/[userId]",
    documentation: "See documentation for setting up GitHub webhooks"
  }, { status: 400 });
}

export async function GET(request: Request) {
  return NextResponse.json({
    message: "GitHub webhook endpoint",
    usage: "Configure your GitHub repository to send webhooks to /api/github-webhook/[userId] or the new format /api/webhooks/github/[userId]",
    documentation: "See documentation for setting up GitHub webhooks"
  }, { status: 200 });
}
