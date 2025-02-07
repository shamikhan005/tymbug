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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        action={formAction}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Log In</h1>

        {state.error && (
          <p className="mb-4 text-red-500 text-center">{state.error}</p>
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
          {state.loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}
