import axios from "axios";
import { timeStamp } from "console";
import { json } from "stream/consumers";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getAuthToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
}

async function sendTestWebhook() {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('no authentication token available - please sign in first');
    }

    const response = await axios.post('http://localhost:3000/api/webhooks/test', {
      event: 'test_event',
      timeStamp: new Date().toISOString(),
      data: {
        id: Math.random().toString(36).substring(7),
        value: Math.floor(Math.random() * 100)
      }
    }, {
      headers: {
        'X-Test-Header': 'test-value',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('webhook sent successfully:', {
      status: response.status,
      data: response.data
    })

  } catch (error: any) {

    console.error('error sending webhook:', error.response?.data || error.message);

  }
}

async function signIn() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'khanshami202@gmail.com',
    password: '123456789'
  });

  if (error) {
    throw error;
  }

  const prismaUser = await prisma.user.findUnique({
    where: { id: data.user?.id }
  });

  if (!prismaUser) {
    await prisma.user.create({
      data: {
        id: data.user?.id!,
        email: data.user?.email!,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  return data.session?.access_token;
}

// to send test webhooks

async function runTests() {

  await signIn();

  for (let i = 0; i < 3; i++) {
    console.log(`\nsending test webhook ${i + 1}...`);
    await sendTestWebhook();
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

runTests();