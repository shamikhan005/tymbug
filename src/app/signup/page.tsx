"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";

export default function SignupPage() {
  const router = useRouter();

  const initialState = {
    email: "",
    password: "",
    error: null as string | null,
    message: null as string | null,
    loading: false,
  };

  const signupAction = async (
    prevState: typeof initialState,
    formData: FormData
  ) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          ...prevState,
          error: data.error || "Signup failed",
          loading: false,
        };
      } else {
        router.push("/login");
        return {
          ...prevState,
          message: data.message || "Signup successful!",
          loading: false,
        };
      }
    } catch (err) {
      return {
        ...prevState,
        error: "An unexpected error occurred",
        loading: false,
      };
    }
  };

  const [state, formAction] = useActionState(signupAction, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        action={formAction}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>

        {state.error && (
          <p className="mb-4 text-red-500 text-center">{state.error}</p>
        )}

        {state.message && (
          <p className="mb-4 text-green-500 text-center">{state.message}</p>
        )}

        <label className="block mb-2">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            name="email"
            className="mt-1 block w-full border p-2 rounded"
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Password</span>
          <input
            type="password"
            name="password"
            className="mt-1 block w-full border p-2 rounded"
            required
          />
        </label>

        <button
          type="submit"
          disabled={state.loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {state.loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
