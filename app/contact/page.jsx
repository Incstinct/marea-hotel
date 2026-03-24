"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import Link from "next/link";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const contactEmail = "hello@marea.com";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/marea_messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            "Prefer": "return=minimal",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            message: form.message.trim(),
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to send");
      setSuccess(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-36 pb-24 px-6">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.5em] uppercase text-[#c4845a] mb-4">Get in Touch</p>
          <h1 className="text-5xl md:text-6xl font-light text-[#1a1a1a] tracking-wide mb-6">Contact</h1>
          <div className="w-16 h-px bg-[#e0d8cc] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

          <div className="flex flex-col gap-12">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[#c4845a] mb-4">Location</p>
              <p className="text-[#8a7e6e] leading-relaxed font-light">
                Calle del Mar 14<br />Marbella, Spain
              </p>
            </div>
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[#c4845a] mb-4">Hours</p>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between max-w-xs">
                  <span className="text-[#8a7e6e] font-light text-sm">Reception</span>
                  <span className="text-[#1a1a1a] font-light text-sm">24 hours</span>
                </div>
                <div className="flex justify-between max-w-xs">
                  <span className="text-[#8a7e6e] font-light text-sm">Check-in</span>
                  <span className="text-[#1a1a1a] font-light text-sm">From 15:00</span>
                </div>
                <div className="flex justify-between max-w-xs">
                  <span className="text-[#8a7e6e] font-light text-sm">Check-out</span>
                  <span className="text-[#1a1a1a] font-light text-sm">By 11:00</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[#c4845a] mb-4">Reach Us</p>
              <div className="flex flex-col gap-2">
                <span className="text-[#8a7e6e] font-light text-sm">+34 123 456 789</span>
                <span className="text-[#8a7e6e] font-light text-sm">{contactEmail}</span>
              </div>
            </div>
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[#c4845a] mb-4">Reservations</p>
              <p className="text-[#8a7e6e] text-sm font-light leading-relaxed mb-4">
                For room reservations we recommend booking directly through our website.
              </p>
              <Link href="/booking" className="text-xs tracking-[0.3em] uppercase border border-[#e0d8cc] text-[#8a7e6e] px-6 py-3 hover:border-[#c4845a] hover:text-[#c4845a] transition-all duration-300 inline-block">
                Book a Room
              </Link>
            </div>
          </div>

          <div>
            {success ? (
              <div className="border border-[#e0d8cc] p-12 text-center flex flex-col items-center justify-center gap-6 h-full">
                <div className="w-12 h-px bg-[#c4845a]" />
                <h2 className="text-2xl font-light text-[#1a1a1a]">Message Sent</h2>
                <p className="text-[#8a7e6e] leading-relaxed font-light">
                  Thank you for reaching out. We will get back to you shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="text-xs tracking-[0.3em] uppercase border border-[#e0d8cc] text-[#8a7e6e] px-8 py-3 hover:border-[#c4845a] hover:text-[#c4845a] transition-all duration-300 cursor-pointer"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-2 block">Name</label>
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
                  <label className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-2 block">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full bg-white border border-[#e0d8cc] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#c4845a] transition-colors resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                {error && <p className="text-red-400 text-xs">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 text-xs tracking-[0.3em] uppercase transition-all duration-300 cursor-pointer ${
                    loading ? "bg-[#e0d8cc] text-[#8a7e6e] cursor-not-allowed" : "bg-[#c4845a] text-white hover:bg-[#a86b44]"
                  }`}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}