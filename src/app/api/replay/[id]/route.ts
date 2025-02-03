import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import axios, { Method } from "axios";

import { supabase } from "@/app/utils/supabase";

const prisma = new PrismaClient();

export async function POST(request: Request, context: { params: { id: string }}) {
  const params = await Promise.resolve(context.params);
  
  try {
    // extract authentication token from headers
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split('Bearer ')[1];

    if (!token) {
      return NextResponse.json({ error: 'no authentication token provided' }, { status: 401 })
    }

    // verify supabase user from token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'invalid or expired authentication token' }, { status: 401 });
    }

    const original = await prisma.webhook.findUnique({
      where: { id: params.id }
    });

    if (!original) {
      return NextResponse.json( {error: "webhook not found"}, { status: 404} );
    }

    const retry = async (attempt = 0): Promise<any> => {
      try {
        return await axios({
          method: original.method as Method,
          url: `http://localhost:3000${original.path}`,
          headers: original.headers as Record<string, string | string[]>,
          data: original.body,
        });
      } catch (error) {
        if (attempt >= 2)  throw error;
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