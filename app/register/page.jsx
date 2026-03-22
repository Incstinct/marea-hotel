"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.name }
        }
      });
      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-[#faf7f2]">
        <div className="w-full max-w-sm text-center flex flex-col gap-6">
          <div className="w-12 h-px bg-[#c4845a] mx-auto" />
          <h2 className="text-2xl font-light text-[#1a1a1a]">Check Your Email</h2>
          <p className="text-[#8a7e6e] font-light leading-relaxed">
            We sent a confirmation link to <span className="text-[#1a1a1a]">{form.email}</span>. Please confirm your email before signing in.
          </p>
          <Link
            href="/login"
            className="text-xs tracking-[0.3em] uppercase bg-[#c4845a] text-white px-8 py-3 hover:bg-[#a86b44] transition-all duration-300 inline-block"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[#faf7f2]">
      <div className="w-full max-w-sm">

        <div className="text-center mb-12">
          <Link href="/" className="text-2xl tracking-[0.4em] uppercase text-[#1a1a1a] font-light mb-2 block">
            Marea
          </Link>
          <p className="text-xs tracking-[0.3em] uppercase text-[#8a7e6e]">Create Account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-2 block">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-white border border-[#e0d8cc] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#c4845a] transition-colors"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-2 block">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-white border border-[#e0d8cc] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#c4845a] transition-colors"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-2 block">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-white border border-[#e0d8cc] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#c4845a] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-2 block">Confirm Password</label>
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              className="w-full bg-white border border-[#e0d8cc] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#c4845a] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-xs tracking-wide">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 text-xs tracking-[0.3em] uppercase transition-all duration-300 mt-2 cursor-pointer ${
              loading
                ? "bg-[#e0d8cc] text-[#8a7e6e] cursor-not-allowed"
                : "bg-[#c4845a] text-white hover:bg-[#a86b44]"
            }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-xs text-center text-[#8a7e6e] font-light">
            Already have an account?{" "}
            <Link href="/login" className="text-[#c4845a] hover:text-[#a86b44] transition-colors">
              Sign In
            </Link>
          </p>
        </form>

      </div>
    </main>
  );
}