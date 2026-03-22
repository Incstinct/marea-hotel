"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

const types = ["All", "Standard", "Suite", "Villa"];

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("All");

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from("marea_rooms")
        .select("*")
        .eq("available", true)
        .order("price", { ascending: true });

      if (error) console.error(error);
      else setRooms(data);
      setLoading(false);
    };

    fetchRooms();
  }, []);

  const filtered = activeType === "All"
    ? rooms
    : rooms.filter((r) => r.type === activeType);

  return (
    <main className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.5em] uppercase text-[#c4845a] mb-4">Accommodations</p>
          <h1 className="text-5xl md:text-6xl font-light text-[#1a1a1a] tracking-wide mb-6">
            Our Rooms
          </h1>
          <div className="w-16 h-px bg-[#e0d8cc] mx-auto mb-6" />
          <p className="text-[#8a7e6e] max-w-md mx-auto leading-relaxed font-light text-lg">
            Every room at Marea is designed to bring the outside in. Wake up to the sound of the sea.
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap justify-center mb-16">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`text-xs tracking-[0.2em] uppercase px-6 py-2.5 transition-all duration-300 ${
                activeType === type
                  ? "bg-[#c4845a] text-white"
                  : "border border-[#e0d8cc] text-[#8a7e6e] hover:border-[#c4845a] hover:text-[#c4845a]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Rooms grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-[#e0d8cc] mb-4" />
                <div className="h-3 bg-[#e0d8cc] rounded w-1/3 mb-2" />
                <div className="h-4 bg-[#e0d8cc] rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[#8a7e6e] font-light">No rooms available in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((room) => (
              <Link key={room.id} href={`/rooms/${room.id}`} className="group">
                <div className="aspect-[4/3] overflow-hidden bg-[#e0d8cc] mb-5 relative">
                  <div className="w-full h-full bg-[#e0d8cc] flex flex-col items-center justify-center gap-2">
                    <div className="w-8 h-8 border border-[#8a7e6e]/30 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a7e6e" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="m21 15-5-5L5 21" />
                      </svg>
                    </div>
                    <p className="text-xs text-[#8a7e6e]/60 tracking-[0.2em] uppercase">Your photo here</p>
                  </div>
                  <div className="absolute inset-0 bg-[#1a1a1a]/0 group-hover:bg-[#1a1a1a]/10 transition-all duration-300 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100">
                    <span className="text-white text-xs tracking-[0.3em] uppercase bg-[#1a1a1a]/50 px-4 py-2">
                      View Room →
                    </span>
                  </div>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-1">{room.type} · {room.capacity} guests</p>
                    <h3 className="text-xl font-light text-[#1a1a1a]">{room.name}</h3>
                    {room.size_sqm && (
                      <p className="text-xs text-[#8a7e6e] mt-1">{room.size_sqm} m²</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-xl font-light text-[#c4845a]">${room.price}</p>
                    <p className="text-xs text-[#8a7e6e]">per night</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}