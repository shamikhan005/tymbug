import { NextRequest, NextResponse } from 'next/server';

// Define correct types for route handlers in Next.js 15
export type RouteHandlerContext<T = Record<string, string>> = {
  params: T;
};

// Generic route handler types
export type RouteHandler<Params = Record<string, string>, Req = Request> = (
  request: Req,
  context: RouteHandlerContext<Params>
) => Promise<Response>;

// Specific route handler type based on parameters
export type UserIdRouteHandler = RouteHandler<{ userId: string }, NextRequest>;
export type IdRouteHandler = RouteHandler<{ id: string }, NextRequest>;
export type ProviderRouteHandler = RouteHandler<{ provider: string[] }, NextRequest>; 