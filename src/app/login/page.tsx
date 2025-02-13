"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

export default function LoginPage() {
  const router = useRouter();

  const initialState = {
    email: "",
    password: "",
    error: null as string | null,
    loading: false,
  };

  const loginAction = async (
    prevState: typeof initialState,
    formData: FormData
  ) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          ...prevState,
          error: data.error || "Login failed",
          loading: false,
        };
      } else {
        router.push("/dashboard");
        return {
          ...prevState,
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

  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-400 font-mono px-4">
      <form
        action={formAction}
        className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm space-y-6"
      >
        <h1 className="text-2xl font-bold text-center animate-fade-in-down">Access Account</h1>

        {state.error && (
          <p className="text-red-500 text-center animate-shake">{state.error}</p>
        )}

        <label className="block">
          <span className="text-gray-400">Email</span>
          <input
            type="email"
            name="email"
            className="mt-1 block w-full bg-gray-700 text-gray-100 border border-gray-600 p-2 rounded focus:outline-none focus:border-green-500 transition-colors duration-300"
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
          {state.loading ? "Logging in..." : "Log In"}
        </button>

        <p className="text-center text-gray-400">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-green-500 hover:text-green-600 font-medium transition-colors duration-300"
          >
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
}
