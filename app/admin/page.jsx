"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Admin() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("rooms");
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [roomForm, setRoomForm] = useState({
    name: "", description: "", price: "",
    type: "Standard", capacity: "2",
    size_sqm: "", images: "", amenities: "",
    available: true,
  });

  const types = ["Standard", "Suite", "Villa"];

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (!profile?.is_admin) { router.push("/"); return; }

      setLoading(false);
      fetchAll();
    };

    checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") window.location.href = "/";
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchAll = async () => {
    const [rm, bk, mg] = await Promise.all([
      supabase.from("marea_rooms").select("*").order("created_at", { ascending: true }),
      supabase.from("marea_bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("marea_messages").select("*").order("created_at", { ascending: false }),
    ]);
    setRooms(rm.data || []);
    setBookings(bk.data || []);
    setMessages(mg.data || []);
  };

  const resetRoomForm = () => {
    setEditingId(null);
    setRoomForm({
      name: "", description: "", price: "",
      type: "Standard", capacity: "2",
      size_sqm: "", images: "", amenities: "",
      available: true,
    });
    setError(null);
    setSuccess(null);
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    if (!roomForm.name || !roomForm.price) {
      setError("Name and price are required.");
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);

    const imagesArray = roomForm.images
      ? roomForm.images.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    const amenitiesArray = roomForm.amenities
      ? roomForm.amenities.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      name: roomForm.name.trim(),
      description: roomForm.description.trim(),
      price: Number(roomForm.price),
      type: roomForm.type,
      capacity: Number(roomForm.capacity),
      size_sqm: roomForm.size_sqm ? Number(roomForm.size_sqm) : null,
      images: imagesArray,
      amenities: amenitiesArray,
      available: roomForm.available,
    };

    try {
      if (editingId) {
        const { error } = await supabase.from("marea_rooms").update(payload).eq("id", editingId);
        if (error) throw error;
        setSuccess("Room updated.");
      } else {
        const { error } = await supabase.from("marea_rooms").insert([payload]);
        if (error) throw error;
        setSuccess("Room added.");
      }
      resetRoomForm();
      fetchAll();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleRoomEdit = (room) => {
    setEditingId(room.id);
    setRoomForm({
      name: room.name,
      description: room.description || "",
      price: room.price,
      type: room.type,
      capacity: room.capacity,
      size_sqm: room.size_sqm || "",
      images: room.images ? room.images.join(", ") : "",
      amenities: room.amenities ? room.amenities.join(", ") : "",
      available: room.available,
    });
    setError(null);
    setSuccess(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRoomDelete = async (id) => {
    if (!confirm("Delete this room?")) return;
    const { error } = await supabase.from("marea_rooms").delete().eq("id", id);
    if (error) setError(error.message);
    else fetchAll();
  };

  const handleBookingStatus = async (id, status) => {
    await supabase.from("marea_bookings").update({ status }).eq("id", id);
    fetchAll();
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
    <div className="min-h-screen bg-[#faf7f2] pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-[#8a7e6e] mb-1">Marea</p>
            <h1 className="text-4xl font-light text-[#1a1a1a]">Admin</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] hover:text-[#c4845a] transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>

        <div className="w-full h-px bg-[#e0d8cc] mb-12" />

        {/* Tabs */}
        <div className="flex gap-8 mb-12 border-b border-[#e0d8cc] overflow-x-auto scrollbar-none">
          {[
            { id: "rooms", label: "Rooms" },
            { id: "bookings", label: `Bookings ${bookings.length > 0 ? `(${bookings.length})` : ""}` },
            { id: "messages", label: `Messages ${messages.length > 0 ? `(${messages.length})` : ""}` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setError(null); setSuccess(null); }}
              className={`text-xs tracking-[0.2em] uppercase pb-4 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "text-[#c4845a] border-b-2 border-[#c4845a]"
                  : "text-[#8a7e6e] hover:text-[#1a1a1a]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Rooms Tab */}
        {activeTab === "rooms" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-sm tracking-[0.2em] uppercase text-[#8a7e6e] mb-8">
                {editingId ? "Edit Room" : "Add Room"}
              </h2>
              <form onSubmit={handleRoomSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-2 block">Name</label>
                  <input type="text" value={roomForm.name}
                    onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                    className="w-full bg-white border border-[#e0d8cc] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#c4845a] transition-colors"
                    placeholder="Ocean Suite" />
                </div>

                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-2 block">Description</label>
                  <textarea value={roomForm.description}
                    onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                    rows={3}
                    className="w-full bg-white border border-[#e0d8cc] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#c4845a] transition-colors resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-2 block">Price ($/night)</label>
                    <input type="number" value={roomForm.price}
                      onChange={(e) => setRoomForm({ ...roomForm, price: e.target.value })}
                      className="w-full bg-white border border-[#e0d8cc] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#c4845a] transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-2 block">Type</label>
                    <div className="relative">
                      <select value={roomForm.type}
                        onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
                        className="appearance-none w-full bg-white border border-[#e0d8cc] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#c4845a] transition-colors cursor-pointer">
                        {types.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a7e6e] pointer-events-none text-xs">▾</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-2 block">Capacity</label>
                    <input type="number" value={roomForm.capacity}
                      onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                      className="w-full bg-white border border-[#e0d8cc] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#c4845a] transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-2 block">Size (m²)</label>
                    <input type="number" value={roomForm.size_sqm}
                      onChange={(e) => setRoomForm({ ...roomForm, size_sqm: e.target.value })}
                      className="w-full bg-white border border-[#e0d8cc] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#c4845a] transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-2 block">
                    Image URLs <span className="normal-case text-[#8a7e6e]/60">(comma separated)</span>
                  </label>
                  <textarea value={roomForm.images}
                    onChange={(e) => setRoomForm({ ...roomForm, images: e.target.value })}
                    rows={2}
                    className="w-full bg-white border border-[#e0d8cc] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#c4845a] transition-colors resize-none"
                    placeholder="https://images.unsplash.com/..." />
                  {roomForm.images && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {roomForm.images.split(",").map((url, i) => (
                        url.trim() && <img key={i} src={url.trim()} alt="preview" className="h-16 w-24 object-cover border border-[#e0d8cc]" />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-2 block">
                    Amenities <span className="normal-case text-[#8a7e6e]/60">(comma separated)</span>
                  </label>
                  <input type="text" value={roomForm.amenities}
                    onChange={(e) => setRoomForm({ ...roomForm, amenities: e.target.value })}
                    className="w-full bg-white border border-[#e0d8cc] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#c4845a] transition-colors"
                    placeholder="King bed, Sea view, Mini bar" />
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={roomForm.available}
                    onChange={(e) => setRoomForm({ ...roomForm, available: e.target.checked })}
                    className="w-3 h-3 accent-[#c4845a]" />
                  <span className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e]">Available</span>
                </label>

                {error && <p className="text-red-400 text-xs">{error}</p>}
                {success && <p className="text-[#c4845a] text-xs">{success}</p>}

                <div className="flex gap-4">
                  <button type="submit" disabled={saving}
                    className={`px-8 py-3 text-xs tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer ${
                      saving ? "bg-[#e0d8cc] text-[#8a7e6e] cursor-not-allowed" : "bg-[#c4845a] text-white hover:bg-[#a86b44]"
                    }`}>
                    {saving ? "Saving..." : editingId ? "Update Room" : "Add Room"}
                  </button>
                  {editingId && (
                    <button type="button" onClick={resetRoomForm}
                      className="px-8 py-3 text-xs tracking-[0.2em] uppercase border border-[#e0d8cc] text-[#8a7e6e] hover:border-[#c4845a] hover:text-[#c4845a] transition-all duration-300 cursor-pointer">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div>
              <h2 className="text-sm tracking-[0.2em] uppercase text-[#8a7e6e] mb-8">
                All Rooms ({rooms.length})
              </h2>
              <div className="flex flex-col gap-4">
                {rooms.length === 0 ? (
                  <p className="text-[#8a7e6e] text-sm font-light">No rooms yet.</p>
                ) : (
                  rooms.map((room) => (
                    <div key={room.id} className="flex gap-4 items-center p-4 border border-[#e0d8cc] hover:border-[#c4845a] transition-colors">
                      {room.images && room.images.length > 0 ? (
                        <img src={room.images[0]} alt={room.name} className="w-16 h-12 object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-16 h-12 bg-[#e0d8cc] flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#1a1a1a] truncate">{room.name}</p>
                        <p className="text-xs text-[#8a7e6e]">{room.type} · ${room.price}/night {!room.available && "· Unavailable"}</p>
                      </div>
                      <div className="flex gap-3 flex-shrink-0">
                        <button onClick={() => handleRoomEdit(room)}
                          className="text-xs text-[#8a7e6e] hover:text-[#c4845a] transition-colors uppercase tracking-wide cursor-pointer">
                          Edit
                        </button>
                        <button onClick={() => handleRoomDelete(room.id)}
                          className="text-xs text-[#8a7e6e] hover:text-red-400 transition-colors uppercase tracking-wide cursor-pointer">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="flex flex-col gap-4">
            {bookings.length === 0 ? (
              <p className="text-[#8a7e6e] text-sm font-light py-12 text-center">No bookings yet.</p>
            ) : (
              bookings.map((booking) => (
                <div key={booking.id} className="border border-[#e0d8cc] p-6 hover:border-[#c4845a] transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <p className="text-sm text-[#1a1a1a] font-medium mb-1">{booking.name}</p>
                      <p className="text-xs text-[#8a7e6e]">{booking.email} {booking.phone && `· ${booking.phone}`}</p>
                      {booking.notes && <p className="text-xs text-[#8a7e6e] mt-2 italic">{booking.notes}</p>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-[#c4845a]">{booking.check_in} → {booking.check_out}</p>
                      <p className="text-xs text-[#8a7e6e] mt-1">{booking.guests} guests</p>
                      <span className={`text-xs tracking-wide uppercase mt-1 block ${
                        booking.status === "confirmed" ? "text-green-500" :
                        booking.status === "cancelled" ? "text-red-400" :
                        "text-[#c4845a]"
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleBookingStatus(booking.id, "confirmed")}
                      className={`text-xs tracking-[0.15em] uppercase px-4 py-2 border transition-all duration-200 cursor-pointer ${
                        booking.status === "confirmed"
                          ? "border-green-500 text-green-500"
                          : "border-[#e0d8cc] text-[#8a7e6e] hover:border-green-500 hover:text-green-500"
                      }`}>
                      Confirm
                    </button>
                    <button onClick={() => handleBookingStatus(booking.id, "cancelled")}
                      className={`text-xs tracking-[0.15em] uppercase px-4 py-2 border transition-all duration-200 cursor-pointer ${
                        booking.status === "cancelled"
                          ? "border-red-400 text-red-400"
                          : "border-[#e0d8cc] text-[#8a7e6e] hover:border-red-400 hover:text-red-400"
                      }`}>
                      Cancel
                    </button>
                    <button onClick={() => handleBookingStatus(booking.id, "pending")}
                      className="text-xs tracking-[0.15em] uppercase px-4 py-2 border border-[#e0d8cc] text-[#8a7e6e] hover:border-[#c4845a] hover:text-[#c4845a] transition-all duration-200 cursor-pointer">
                      Reset
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div className="flex flex-col gap-4">
            {messages.length === 0 ? (
              <p className="text-[#8a7e6e] text-sm font-light py-12 text-center">No messages yet.</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="border border-[#e0d8cc] p-6 hover:border-[#c4845a] transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-[#1a1a1a]">{msg.name}</p>
                      <p className="text-xs text-[#8a7e6e]">{msg.email}</p>
                    </div>
                    <p className="text-xs text-[#8a7e6e]">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm text-[#8a7e6e] leading-relaxed font-light">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}