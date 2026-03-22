"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function BookingContent() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("room");
  const roomName = searchParams.get("name");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    check_in: "",
    check_out: "",
    guests: "2",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!form.name || !form.email || !form.check_in || !form.check_out) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (form.check_in >= form.check_out) {
      setError("Check-out must be after check-in.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/marea_bookings`,
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
            phone: form.phone.trim(),
            check_in: form.check_in,
            check_out: form.check_out,
            guests: Number(form.guests),
            notes: form.notes.trim(),
            room_id: roomId || null,
            status: "pending",
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to submit");
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", check_in: "", check_out: "", guests: "2", notes: "" });
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.5em] uppercase text-[#c4845a] mb-4">Reserve</p>
          <h1 className="text-5xl md:text-6xl font-light text-[#1a1a1a] tracking-wide mb-6">
            Book Your Stay
          </h1>
          <div className="w-16 h-px bg-[#e0d8cc] mx-auto mb-6" />
          {roomName && (
            <p className="text-[#8a7e6e] font-light">
              You are booking: <span className="text-[#1a1a1a]">{roomName}</span>
            </p>
          )}
          {!roomName && (
            <p className="text-[#8a7e6e] font-light">
              Not sure which room? <Link href="/rooms" className="text-[#c4845a] hover:text-[#a86b44] transition-colors">View all rooms →</Link>
            </p>
          )}
        </div>

        {/* Success */}
        {success ? (
          <div className="border border-[#e0d8cc] p-12 text-center flex flex-col items-center gap-6">
            <div className="w-12 h-px bg-[#c4845a]" />
            <h2 className="text-2xl font-light text-[#1a1a1a]">Booking Received</h2>
            <p className="text-[#8a7e6e] leading-relaxed font-light max-w-sm">
              Thank you. We will confirm your booking within 24 hours via email.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setSuccess(false)}
                className="text-xs tracking-[0.3em] uppercase border border-[#e0d8cc] text-[#8a7e6e] px-8 py-3 hover:border-[#c4845a] hover:text-[#c4845a] transition-all duration-300 cursor-pointer"
              >
                New Booking
              </button>
              <Link
                href="/"
                className="text-xs tracking-[0.3em] uppercase bg-[#c4845a] text-white px-8 py-3 hover:bg-[#a86b44] transition-all duration-300"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-2 block">
                  Full Name <span className="text-[#c4845a]">*</span>
                </label>
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
                <label className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-2 block">
                  Email <span className="text-[#c4845a]">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#e0d8cc] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#c4845a] transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Phone + Guests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-2 block">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#e0d8cc] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#c4845a] transition-colors"
                  placeholder="+34 123 456 789"
                />
              </div>
              <div>
                <label className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-2 block">
                  Guests <span className="text-[#c4845a]">*</span>
                </label>
                <div className="relative">
                  <select
                    name="guests"
                    value={form.guests}
                    onChange={handleChange}
                    className="appearance-none w-full bg-white border border-[#e0d8cc] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#c4845a] transition-colors cursor-pointer"
                  >
                    {[1,2,3,4,5,6].map((n) => (
                      <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a7e6e] pointer-events-none text-xs">▾</span>
                </div>
              </div>
            </div>

            {/* Check in + Check out */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-2 block">
                  Check-in <span className="text-[#c4845a]">*</span>
                </label>
                <input
                  type="date"
                  name="check_in"
                  value={form.check_in}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full bg-white border border-[#e0d8cc] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#c4845a] transition-colors appearance-none"
                />
              </div>
              <div>
                <label className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-2 block">
                  Check-out <span className="text-[#c4845a]">*</span>
                </label>
                <input
                  type="date"
                  name="check_out"
                  value={form.check_out}
                  onChange={handleChange}
                  min={form.check_in || new Date().toISOString().split("T")[0]}
                  className="w-full bg-white border border-[#e0d8cc] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#c4845a] transition-colors appearance-none"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-2 block">
                Special Requests
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={4}
                className="w-full bg-white border border-[#e0d8cc] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#c4845a] transition-colors resize-none"
                placeholder="Allergies, celebrations, accessibility needs..."
              />
            </div>

            {error && <p className="text-red-400 text-xs tracking-wide">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 text-xs tracking-[0.3em] uppercase transition-all duration-300 cursor-pointer ${
                loading
                  ? "bg-[#e0d8cc] text-[#8a7e6e] cursor-not-allowed"
                  : "bg-[#c4845a] text-white hover:bg-[#a86b44]"
              }`}
            >
              {loading ? "Submitting..." : "Request Booking"}
            </button>

            <p className="text-xs text-[#8a7e6e] text-center tracking-wide font-light">
              We will confirm your booking within 24 hours.
            </p>

          </form>
        )}

      </div>
    </main>
  );
}

export default function Booking() {
  return (
    <Suspense>
      <BookingContent />
    </Suspense>
  );
}