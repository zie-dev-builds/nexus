import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7fb,_#fdf2f8_40%,_#eef7ff)] px-6 py-12 text-slate-800">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-pink-100 bg-white/80 shadow-[0_30px_80px_rgba(236,72,153,0.15)] backdrop-blur-xl">
        <div className="grid md:grid-cols-2">
          <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-700 p-10 text-white">
            <div className="mb-10 flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-2xl bg-white/20 ring-1 ring-white/20">
                <div className="absolute inset-2 rounded-xl bg-white/25" />
                <div className="absolute left-3 top-3 h-5 w-5 rounded-full bg-white/90" />
              </div>
              <div>
                <div className="text-xl font-black tracking-[0.28em]">NEXUS</div>
                <div className="text-[10px] tracking-[0.22em] text-white/70">YOUR PEOPLE, IN SYNC</div>
              </div>
            </div>
            <h1 className="text-4xl font-black leading-tight">Connect with the ideas and people that move you.</h1>
            <p className="mt-5 max-w-sm text-sm text-white/80">
              Share moments, start conversations, and discover your people in one beautifully designed social space.
            </p>
          </div>

          <div className="p-8 md:p-12">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-pink-500">Welcome back</p>
              <h2 className="mt-2 text-3xl font-black">Login to NEXUS</h2>
            </div>

            <LoginForm />

            <div className="mt-6 text-center text-sm text-slate-500">
              Need an account? <a className="font-semibold text-pink-600" href="/signup">Create one</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@nexus.dev");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@example.com"
          className="w-full rounded-2xl border border-pink-100 bg-slate-50 px-4 py-3 outline-none ring-0 transition focus:border-pink-400"
          type="email"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          className="w-full rounded-2xl border border-pink-100 bg-slate-50 px-4 py-3 outline-none transition focus:border-pink-400"
          type="password"
          required
        />
      </div>

      {error ? <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</div> : null}

      <button
        disabled={loading}
        type="submit"
        className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-pink-400/30 transition hover:brightness-110 disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
