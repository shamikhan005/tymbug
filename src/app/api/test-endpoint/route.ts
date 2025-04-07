import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const headers = Object.fromEntries(request.headers.entries());
  const url = request.url;
  const method = request.method;
  
  const searchParams = new URL(request.url).searchParams;
  const forceStatus = searchParams.get('status');
  const delay = searchParams.get('delay');
  const shouldFail = searchParams.get('fail') === 'true';
  
  let body;
  try {
    body = await request.json();
  } catch (e) {
    body = { error: "Could not parse JSON body" };
  }
  
  console.log('Test endpoint received webhook:', {
    timestamp: new Date().toISOString(),
    method,
    url,
    headers,
    body
  });

  if (delay) {
    const delayMs = parseInt(delay);
    if (!isNaN(delayMs) && delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  let statusCode = 200;
  
  if (forceStatus) {
    const forcedStatus = parseInt(forceStatus);
    if (!isNaN(forcedStatus) && forcedStatus >= 100 && forcedStatus < 600) {
      statusCode = forcedStatus;
    }
  } else if (shouldFail) {
    const errorCodes = [400, 401, 403, 404, 500, 502, 503];
    statusCode = errorCodes[Math.floor(Math.random() * errorCodes.length)];
  }
  
  const responseBody = {
    message: "Test endpoint response",
    received: {
      method,
      headers: {
        ...headers,
        authorization: headers.authorization ? '[REDACTED]' : undefined,
        cookie: headers.cookie ? '[REDACTED]' : undefined
      },
      body,
      timestamp: new Date().toISOString(),
    },
    testParams: {
      forcedStatus: forceStatus ? parseInt(forceStatus) : null,
      delay: delay ? parseInt(delay) : null,
      shouldFail
    }
  };
  
  return NextResponse.json(responseBody, { status: statusCode });
}

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function PUT(request: NextRequest) {
  return handleRequest(request);
}

export async function PATCH(request: NextRequest) {
  return handleRequest(request);
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request);
}

function handleRequest(request: NextRequest) {
  return POST(request);
}