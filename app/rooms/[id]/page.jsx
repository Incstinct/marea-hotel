"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function RoomPage({ params }) {
  const { id } = use(params);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      const { data, error } = await supabase
        .from("marea_rooms")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error(error);
      else setRoom(data);
      setLoading(false);
    };

    fetchRoom();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 px-6">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="aspect-[16/9] bg-[#e0d8cc] mb-8" />
          <div className="h-6 bg-[#e0d8cc] rounded w-1/3 mb-4" />
          <div className="h-4 bg-[#e0d8cc] rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center">
        <p className="text-[#8a7e6e] mb-4 font-light">Room not found.</p>
        <Link href="/rooms" className="text-xs tracking-[0.2em] uppercase text-[#c4845a]">
          ← Back to Rooms
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-24">

      {/* Images */}
      <div className="max-w-6xl mx-auto px-6 mb-16">

        {/* Main image */}
        <div className="aspect-[16/9] overflow-hidden bg-[#e0d8cc] mb-3">
          {room.images && room.images.length > 0 ? (
            <img
              src={room.images[activeImage]}
              alt={room.name}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
          ) : (
            <div className="w-full h-full bg-[#e0d8cc] flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 border border-[#8a7e6e]/30 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8a7e6e" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="m21 15-5-5L5 21" />
                </svg>
              </div>
              <p className="text-xs text-[#8a7e6e]/60 tracking-[0.2em] uppercase">Your photos here</p>
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {room.images && room.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {room.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`flex-shrink-0 w-20 h-16 overflow-hidden transition-all duration-200 ${
                  activeImage === i ? "ring-2 ring-[#c4845a]" : "opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`${room.name} ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">

          {/* Left — details */}
          <div className="md:col-span-2">
            <Link
              href="/rooms"
              className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] hover:text-[#c4845a] transition-colors mb-8 block"
            >
              ← Back to Rooms
            </Link>

            <p className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-2">
              {room.type} · {room.capacity} guests {room.size_sqm && `· ${room.size_sqm} m²`}
            </p>
            <h1 className="text-4xl md:text-5xl font-light text-[#1a1a1a] mb-6">
              {room.name}
            </h1>
            <div className="w-12 h-px bg-[#e0d8cc] mb-8" />
            <p className="text-[#8a7e6e] leading-relaxed font-light text-lg mb-12">
              {room.description}
            </p>

            {/* Amenities */}
            {room.amenities && room.amenities.length > 0 && (
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-[#c4845a] mb-6">Included</p>
                <div className="grid grid-cols-2 gap-3">
                  {room.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1 h-1 rounded-full bg-[#c4845a] flex-shrink-0" />
                      <span className="text-sm text-[#8a7e6e] font-light">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — booking card */}
          <div>
            <div className="border border-[#e0d8cc] p-8 sticky top-32">
              <div className="text-center mb-8">
                <p className="text-3xl font-light text-[#c4845a]">${room.price}</p>
                <p className="text-xs text-[#8a7e6e] tracking-wide">per night</p>
              </div>

              <div className="flex flex-col gap-3 mb-8 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#8a7e6e] font-light">Type</span>
                  <span className="text-[#1a1a1a] font-light">{room.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8a7e6e] font-light">Capacity</span>
                  <span className="text-[#1a1a1a] font-light">{room.capacity} guests</span>
                </div>
                {room.size_sqm && (
                  <div className="flex justify-between">
                    <span className="text-[#8a7e6e] font-light">Size</span>
                    <span className="text-[#1a1a1a] font-light">{room.size_sqm} m²</span>
                  </div>
                )}
                <div className="w-full h-px bg-[#e0d8cc] my-2" />
                <div className="flex justify-between">
                  <span className="text-[#8a7e6e] font-light">Check-in</span>
                  <span className="text-[#1a1a1a] font-light">From 15:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8a7e6e] font-light">Check-out</span>
                  <span className="text-[#1a1a1a] font-light">By 11:00</span>
                </div>
              </div>

              <Link
                href={`/booking?room=${room.id}&name=${encodeURIComponent(room.name)}`}
                className="w-full bg-[#c4845a] text-white py-4 text-xs tracking-[0.3em] uppercase hover:bg-[#a86b44] transition-colors block text-center"
              >
                Book This Room
              </Link>

              <Link
                href="/contact"
                className="w-full text-center text-xs text-[#8a7e6e] hover:text-[#c4845a] transition-colors tracking-wide uppercase mt-4 block"
              >
                Ask a Question
              </Link>
            </div>
          </div>

        </div>
      </div>

    </main>
  );
}