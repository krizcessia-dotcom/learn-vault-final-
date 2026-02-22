"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="flex-1 flex flex-col min-h-[calc(100vh-100px)]">
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-between px-4 sm:px-8 lg:px-16 py-12 lg:py-0">
        <div className="flex-1 flex flex-col justify-center mb-8 lg:mb-0 lg:pr-12">
          <h1
            className="text-lv-lime text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "var(--font-press-start), monospace" }}
          >
            Learn Vault
          </h1>
          <h2
            className="text-lv-lime text-2xl md:text-3xl font-bold"
            style={{ fontFamily: "var(--font-press-start), monospace" }}
          >
            LOG IN
          </h2>
        </div>

        <div className="w-full max-w-md rounded-2xl p-8 bg-gradient-to-br from-pink-500/70 to-purple-700/70 backdrop-blur-sm">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-600 rounded-lg bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-600 rounded-lg bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors"
            >
              {loading ? "Logging in..." : "LOG IN"}
            </button>
          </form>
          <p className="text-sm text-center text-gray-800 mt-4">
            Dont have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              sign up
            </Link>
          </p>
        </div>
      </div>

      <footer className="py-6 text-center text-gray-500 text-sm">
        © 2026 Learn Vault. All rights reserved.
      </footer>
    </div>
  );
}
