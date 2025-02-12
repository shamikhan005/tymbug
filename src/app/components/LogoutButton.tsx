"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { logout } from "../actions/logout";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const result = await logout();

    if (result && result.success) {
      router.push("/login");
      router.refresh();
    } else {
      console.error("Logout failed on the server");
    }
  };

  return <button onClick={handleLogout}
    className="px-4 py-4 bg-green-500 hover:bg-green-600 text-black font-bold rounded-full transition-colors duration-300"
  >
    Sign Out
  </button>;
}
