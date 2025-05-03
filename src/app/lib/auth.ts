import { supabase } from "@/app/utils/supabase";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Authenticates a request using a Bearer token from the authorization header
 * @param request The incoming request
 * @returns The user ID if authenticated, null otherwise
 */
export async function authenticateRequestWithToken(request: Request | NextRequest): Promise<string | null> {
  // Extract authentication token from headers
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split('Bearer ')[1];

  if (!token) {
    return null;
  }

  // Verify supabase user from token
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    return user.id;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Finds a user by identifier in path (used for GitHub webhooks)
 * @param userIdentifier User ID or identifier from webhook URL
 * @returns The user ID if found, null otherwise
 */
export async function findUserByIdentifier(userIdentifier: string): Promise<string | null> {
  if (!userIdentifier) {
    return null;
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: userIdentifier },
          { email: `${userIdentifier}@tymbug.user` }
        ]
      },
      select: { id: true }
    });

    return user?.id || null;
  } catch (error) {
    console.error('Error finding user by identifier:', error);
    return null;
  }
} 