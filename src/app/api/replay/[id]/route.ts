import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import axios, { Method } from "axios";
import { supabase } from "@/app/utils/supabase";
import { cookies } from "next/headers";
import type { IdRouteHandler } from "@/app/types/route";

const prisma = new PrismaClient();

export const POST: IdRouteHandler = async (request, context) => {

  try {
    const { id } = context.params;
    // extract authentication token from headers
    let token = request.headers.get('authorization')?.split('Bearer ')[1];

    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get('sb-access-token')?.value
    }

    if (!token) {
      return NextResponse.json({ error: 'no authentication token provided' }, { status: 401 })
    }

    // verify supabase user from token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'invalid or expired authentication token' }, { status: 401 });
    }

    const original = await prisma.webhook.findUnique({
      where: { id }
    });

    if (!original) {
      return NextResponse.json({ error: "webhook not found" }, { status: 404 });
    }

    const retry = async (attempt = 0): Promise<any> => {
      try {
        let updateHeaders: Record<string, string | string[]> = {};
        if (original.headers && typeof original.headers === 'object') {
          updateHeaders = {
            ...original.headers as Record<string, string | string[]>,
            Authorization: `Bearer ${token}`
          }
        } else {
          updateHeaders = { Authorization: `Bearer ${token}` }
        }

        return await axios({
          method: original.method as Method,
          url: `http://localhost:3000${original.path}`,
          headers: updateHeaders,
          data: original.body,
        });
      } catch (error) {
        if (attempt >= 2) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        return retry(attempt + 1);
      }
    };

    const response = await retry();

    const replay = await prisma.replay.create({
      data: {
        originalId: original.id,
        responseStatus: response.status,
        userId: user.id
      }
    });

    return NextResponse.json(replay);
  } catch (error) {
    console.log("replay error:", error);
    return NextResponse.json(
      { error: "replay failed after 3 attempts" },
      { status: 500 }
    );
  }
}