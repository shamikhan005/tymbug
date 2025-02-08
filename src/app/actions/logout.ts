'use server';

import { redirect } from 'next/navigation';
import axios from 'axios';

export async function logout() {
  try {
    const baseURL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await axios.post(`${baseURL}/api/auth/logout`);

    if (res.status === 200) {
      return { success: true };
    } else {
      console.error('logout failed');
      return { success: false };
    }
  } catch (error: any) {
    console.error('logout failed:', error.message);
    return { success: false };
  }
}
