"use client";
export const dynamic = "force-dynamic";
import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-24">
          <p className="text-xs tracking-[0.5em] uppercase text-[#c4845a] mb-4">Our Story</p>
          <h1 className="text-5xl md:text-6xl font-light text-[#1a1a1a] tracking-wide mb-6">
            About Marea
          </h1>
          <div className="w-16 h-px bg-[#e0d8cc] mx-auto" />
        </div>

        {/* Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24 items-center">
          <div className="aspect-[3/4] bg-[#e0d8cc] flex flex-col items-center justify-center gap-3">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8a7e6e" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
            <p className="text-xs text-[#8a7e6e]/60 tracking-[0.2em] uppercase">Your photo here</p>
          </div>
          <div className="flex flex-col gap-6">
            <p className="text-xs tracking-[0.4em] uppercase text-[#c4845a]">The Beginning</p>
            <h2 className="text-3xl font-light text-[#1a1a1a] leading-relaxed">
              Built for those who travel slowly
            </h2>
            <p className="text-[#8a7e6e] leading-relaxed font-light text-lg">
              Marea was founded in 2012 by two friends who believed that a truly great stay requires nothing more than the right setting, genuine hospitality and the freedom to do nothing at all.
            </p>
            <p className="text-[#8a7e6e] leading-relaxed font-light">
              We chose the coast of Marbella deliberately. The light here is different. The pace is different. And we wanted to build something that reflected that — unhurried, warm, and always personal.
            </p>
          </div>
        </div>

        {/* Second section */}
        <div className="border-t border-[#e0d8cc] pt-24 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-6 md:order-1">
              <p className="text-xs tracking-[0.4em] uppercase text-[#c4845a]">The Experience</p>
              <h2 className="text-3xl font-light text-[#1a1a1a] leading-relaxed">
                Every detail considered
              </h2>
              <p className="text-[#8a7e6e] leading-relaxed font-light text-lg">
                From the thread count of our linen to the temperature of the pool at sunrise — nothing at Marea happens by accident. We obsess over the details so our guests never have to think about them.
              </p>
              <p className="text-[#8a7e6e] leading-relaxed font-light">
                Our team has been with us for years. Many of them grew up in the region. They know the best local restaurants, the quietest beaches, the most beautiful drives. They are the resort as much as the buildings are.
              </p>
            </div>
            <div className="aspect-[3/4] bg-[#e0d8cc] flex flex-col items-center justify-center gap-3 md:order-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8a7e6e" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
              <p className="text-xs text-[#8a7e6e]/60 tracking-[0.2em] uppercase">Your photo here</p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="border-t border-[#e0d8cc] pt-24 mb-24">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.4em] uppercase text-[#c4845a] mb-4">What We Believe</p>
            <h2 className="text-3xl font-light text-[#1a1a1a]">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#e0d8cc]">
            {[
              {
                number: "01",
                title: "Slowness",
                text: "We believe the best holidays have no itinerary. We create space for you to do nothing, and do it well."
              },
              {
                number: "02",
                title: "Authenticity",
                text: "Every recommendation we make, every dish we serve, every room we design comes from a genuine place."
              },
              {
                number: "03",
                title: "Presence",
                text: "No conference rooms. No business centers. Marea is a place to arrive, exhale, and be somewhere fully."
              }
            ].map((value) => (
              <div key={value.number} className="bg-[#faf7f2] p-10 flex flex-col gap-4">
                <span className="text-xs tracking-[0.3em] text-[#e0d8cc]">{value.number}</span>
                <h3 className="text-xl font-light text-[#1a1a1a]">{value.title}</h3>
                <p className="text-sm text-[#8a7e6e] leading-relaxed font-light">{value.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-[#8a7e6e] mb-8 leading-relaxed max-w-md mx-auto font-light text-lg">
            We would love to welcome you. Reserve your room and come see what we mean.
          </p>
          <Link
            href="/booking"
            className="text-xs tracking-[0.3em] uppercase border border-[#c4845a] text-[#c4845a] px-12 py-4 hover:bg-[#c4845a] hover:text-white transition-all duration-300 inline-block"
          >
            Book Your Stay
          </Link>
        </div>

      </div>
    </main>
  );
}