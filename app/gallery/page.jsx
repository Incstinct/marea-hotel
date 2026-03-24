"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";

const images = [
  { id: 1, src: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80", alt: "Resort beachfront" },
  { id: 2, src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80", alt: "Ocean view room" },
  { id: 3, src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80", alt: "Suite interior" },
  { id: 4, src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80", alt: "Villa pool" },
  { id: 5, src: "https://images.unsplash.com/photo-1439130490301-25e322d88054?w=800&q=80", alt: "Private beach" },
  { id: 6, src: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80", alt: "Sunset suite" },
  { id: 7, src: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80", alt: "Sandy Mountains" },
  { id: 8, src: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80", alt: "Beach villa" },
  { id: 9, src: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80", alt: "Resort garden" },
];

const ImageCard = ({ image, onClick }) => (
  <div
    onClick={onClick}
    className="relative overflow-hidden cursor-pointer group aspect-square bg-[#e0d8cc]"
  >
    <img
      src={image.src}
      alt={image.alt}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-90 group-hover:brightness-100"
    />
    <div className="absolute inset-0 bg-[#1a1a1a]/0 group-hover:bg-[#1a1a1a]/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
      <span className="text-xs tracking-[0.3em] uppercase text-white">View</span>
    </div>
  </div>
);

export default function Gallery() {
  const [selected, setSelected] = useState(null);

  const col1 = images.filter((_, i) => i % 3 === 0);
  const col2 = images.filter((_, i) => i % 3 === 1);
  const col3 = images.filter((_, i) => i % 3 === 2);
  const col1of2 = images.filter((_, i) => i % 2 === 0);
  const col2of2 = images.filter((_, i) => i % 2 === 1);

  return (
    <main className="min-h-screen pt-36 pb-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.5em] uppercase text-[#c4845a] mb-4">Visual</p>
          <h1 className="text-5xl md:text-6xl font-light text-[#1a1a1a] tracking-wide mb-6">
            Gallery
          </h1>
          <div className="w-16 h-px bg-[#e0d8cc] mx-auto" />
        </div>

        {/* Mobile — 2 columns */}
        <div className="grid grid-cols-2 gap-2 items-start md:hidden">
          <div className="flex flex-col gap-2">
            {col1of2.map((image) => (
              <ImageCard key={image.id} image={image} onClick={() => setSelected(image)} />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {col2of2.map((image) => (
              <ImageCard key={image.id} image={image} onClick={() => setSelected(image)} />
            ))}
          </div>
        </div>

        {/* Desktop — 3 columns */}
        <div className="hidden md:grid md:grid-cols-3 gap-2 items-start">
          <div className="flex flex-col gap-2">
            {col1.map((image) => (
              <ImageCard key={image.id} image={image} onClick={() => setSelected(image)} />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {col2.map((image) => (
              <ImageCard key={image.id} image={image} onClick={() => setSelected(image)} />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {col3.map((image) => (
              <ImageCard key={image.id} image={image} onClick={() => setSelected(image)} />
            ))}
          </div>
        </div>

      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors text-xs tracking-[0.3em] uppercase cursor-pointer"
            onClick={() => setSelected(null)}
          >
            Close
          </button>
          <img
            src={selected.src}
            alt={selected.alt}
            className="max-w-full max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

    </main>
  );
}