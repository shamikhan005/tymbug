"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import Link from "next/link";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 font-mono">
      <form
        action={formAction}
        className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm space-y-6"
      >
        <h1 className="text-2xl font-bold mb-4 text-center animate-fade-in-down text-gray-400">Create your account</h1>

        {state.error && (
          <p className="text-red-500 text-center animate-shake">{state.error}</p>
        )}

        {state.message && (
          <p className="text-green-500 text-center">{state.message}</p>
        )}

        <label className="block">
          <span className="text-gray-400">Email</span>
          <input
            type="email"
            name="email"
            className="mt-1 block w-full border bg-gray-700 border-gray-600 p-2 rounded focus:outline-none focus:border-green-500 transition-colors duration-300"
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-400">Password</span>
          <input
            type="password"
            name="password"
            className="mt-1 block w-full bg-gray-700 text-gray-100 border border-gray-600 p-2 rounded focus:outline-none focus:border-green-500 transition-colors duration-300"
            required
          />
        </label>

        <button
          type="submit"
          disabled={state.loading}
          className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded transition-colors duration-300 disabled:opacity-50"
        >
          {state.loading ? "Signing up..." : "Sign Up"}
        </button>
        <p className="text-center text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-green-500 hover:text-green-600 font-medium transition-colors duration-300"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
