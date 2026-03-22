"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [form, setForm] = useState({ full_name: "" });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [passwordForm, setPasswordForm] = useState({ current: "", password: "", confirm: "" });

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      setUser(user);
      setForm({ full_name: user.user_metadata?.full_name || "" });
      setLoading(false);
      fetchBookings(user.email);
    };
    init();
  }, []);

  const fetchBookings = async (email) => {
    setBookingsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/marea_bookings?email=eq.${encodeURIComponent(email)}&order=created_at.desc`,
        {
          headers: {
            "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
        }
      );
      const data = await res.json();
      setBookings(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: form.full_name }
      });
      if (error) throw error;
      setSuccess("Details updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    try {
      const { error } = await supabase.rpc("delete_user");
      if (error) throw error;
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
        <p className="text-[#8a7e6e] text-sm animate-pulse tracking-widest uppercase">Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 bg-[#faf7f2]">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-[#8a7e6e] mb-1">Welcome back</p>
          <h1 className="text-4xl font-light text-[#1a1a1a]">
            {user.user_metadata?.full_name || user.email}
          </h1>
        </div>

        <div className="w-full h-px bg-[#e0d8cc] mb-12" />

        {/* Tabs */}
        <div className="flex gap-8 mb-12 border-b border-[#e0d8cc] overflow-x-auto scrollbar-none">
          {["bookings", "details", "password", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setError(null); setSuccess(null); }}
              className={`text-xs tracking-[0.2em] uppercase pb-4 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab
                  ? "text-[#c4845a] border-b-2 border-[#c4845a]"
                  : "text-[#8a7e6e] hover:text-[#1a1a1a]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div>
            {bookingsLoading ? (
              <div className="flex flex-col gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border border-[#e0d8cc] p-6 animate-pulse">
                    <div className="h-3 bg-[#e0d8cc] rounded w-1/3 mb-3" />
                    <div className="h-3 bg-[#e0d8cc] rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-[#8a7e6e] font-light mb-6">No bookings yet.</p>
                <Link
                  href="/rooms"
                  className="text-xs tracking-[0.3em] uppercase bg-[#c4845a] text-white px-8 py-3 hover:bg-[#a86b44] transition-all duration-300 inline-block"
                >
                  Browse Rooms
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border border-[#e0d8cc] p-6 hover:border-[#c4845a] transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-[#1a1a1a] font-medium mb-1">
                          {booking.check_in} → {booking.check_out}
                        </p>
                        <p className="text-xs text-[#8a7e6e]">{booking.guests} guests</p>
                        {booking.notes && (
                          <p className="text-xs text-[#8a7e6e] mt-1 italic">{booking.notes}</p>
                        )}
                      </div>
                      <span className={`text-xs tracking-wide uppercase flex-shrink-0 ${
                        booking.status === "confirmed" ? "text-green-500" :
                        booking.status === "cancelled" ? "text-red-400" :
                        "text-[#c4845a]"
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Details Tab */}
        {activeTab === "details" && (
          <form onSubmit={handleUpdateDetails} className="max-w-md flex flex-col gap-6">
            <div>
              <label className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-2 block">Full Name</label>
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="w-full bg-white border border-[#e0d8cc] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#c4845a] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-2 block">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-[#f0ebe1] border border-[#e0d8cc] px-4 py-3 text-sm text-[#8a7e6e] cursor-not-allowed"
              />
              <p className="text-xs text-[#8a7e6e] mt-1 font-light">Email cannot be changed.</p>
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}
            {success && <p className="text-[#c4845a] text-xs">{success}</p>}

            <button
              type="submit"
              disabled={saving}
              className={`w-fit px-8 py-3 text-xs tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer ${
                saving ? "bg-[#e0d8cc] text-[#8a7e6e] cursor-not-allowed" : "bg-[#c4845a] text-white hover:bg-[#a86b44]"
              }`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
        <form onSubmit={async (e) => {
            e.preventDefault();
            setSaving(true);
            setError(null);
            setSuccess(null);

            if (!passwordForm.current || !passwordForm.password || !passwordForm.confirm) {
            setError("Please fill in all fields.");
            setSaving(false);
            return;
            }

            if (passwordForm.password !== passwordForm.confirm) {
            setError("Passwords don't match.");
            setSaving(false);
            return;
            }

            if (passwordForm.password.length < 6) {
            setError("Password must be at least 6 characters.");
            setSaving(false);
            return;
            }

            try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: passwordForm.current,
            });
            if (signInError) {
                setError("Current password is incorrect.");
                setSaving(false);
                return;
            }

            const { error } = await supabase.auth.updateUser({
                password: passwordForm.password
            });
            if (error) throw error;
            setSuccess("Password updated successfully.");
            setPasswordForm({ current: "", password: "", confirm: "" });
            } catch (err) {
            setError(err.message);
            } finally {
            setSaving(false);
            }
        }} className="max-w-md flex flex-col gap-6">

            <div>
            <label className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-2 block">Current Password</label>
            <input
                type="password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-white border border-[#e0d8cc] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#c4845a] transition-colors"
            />
            </div>

            <div>
            <label className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-2 block">New Password</label>
            <input
                type="password"
                value={passwordForm.password}
                onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-white border border-[#e0d8cc] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#c4845a] transition-colors"
            />
            </div>

            <div>
            <label className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-2 block">Confirm New Password</label>
            <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-white border border-[#e0d8cc] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#c4845a] transition-colors"
            />
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}
            {success && <p className="text-[#c4845a] text-xs">{success}</p>}

            <button
            type="submit"
            disabled={saving}
            className={`w-fit px-8 py-3 text-xs tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer ${
                saving ? "bg-[#e0d8cc] text-[#8a7e6e] cursor-not-allowed" : "bg-[#c4845a] text-white hover:bg-[#a86b44]"
            }`}
            >
            {saving ? "Updating..." : "Update Password"}
            </button>
        </form>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="max-w-md flex flex-col gap-12">

            {/* Notifications */}
            <div>
              <h3 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] font-medium mb-6">
                Notifications
              </h3>
              <div className="flex flex-col gap-4">
                {[
                  { id: "bookingConfirmed", label: "Email me when my booking is confirmed" },
                  { id: "specialOffers", label: "Notify me about special offers" },
                  { id: "newsletter", label: "Subscribe to newsletter" },
                ].map((item) => (
                  <label key={item.id} className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm text-[#8a7e6e] group-hover:text-[#1a1a1a] transition-colors font-light">
                      {item.label}
                    </span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        defaultChecked={item.id === "bookingConfirmed"}
                        className="sr-only peer"
                        id={item.id}
                      />
                      <label
                        htmlFor={item.id}
                        className="w-10 h-5 bg-[#e0d8cc] rounded-full cursor-pointer peer-checked:bg-[#c4845a] transition-colors block after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-transform peer-checked:after:translate-x-5"
                      />
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="w-full h-px bg-[#e0d8cc]" />

            {/* Preferences */}
            <div>
              <h3 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] font-medium mb-6">
                Preferences
              </h3>
              <div>
                <label className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-2 block">Language</label>
                <div className="relative">
                  <select
                    defaultValue="en"
                    className="appearance-none w-full bg-white border border-[#e0d8cc] pl-4 pr-10 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#c4845a] transition-colors cursor-pointer"
                  >
                    <option value="en">English</option>
                    <option value="pl">Polski</option>
                    <option value="ru">Русский</option>
                    <option value="nl">Nederlands</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a7e6e] pointer-events-none text-xs">▾</span>
                </div>
                <p className="text-xs text-[#8a7e6e] mt-2 font-light">Multi-language support coming soon.</p>
              </div>
            </div>

            <div className="w-full h-px bg-[#e0d8cc]" />

            {/* Privacy */}
            <div>
              <h3 className="text-xs tracking-[0.2em] uppercase text-[#1a1a1a] font-medium mb-6">
                Privacy
              </h3>
              <p className="text-sm text-[#8a7e6e] leading-relaxed font-light mb-6">
                Deleting your account is permanent. All your data including bookings and personal details will be removed.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="text-xs tracking-[0.2em] uppercase text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-6 py-3 transition-colors cursor-pointer"
              >
                Delete Account
              </button>
            </div>

          </div>
        )}

        <div className="w-full h-px bg-[#e0d8cc] mt-16 mb-8" />

        <button
          onClick={handleLogout}
          className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] hover:text-[#c4845a] transition-colors cursor-pointer"
        >
          Sign Out
        </button>

      </div>
    </main>
  );
}