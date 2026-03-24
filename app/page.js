"use client";
export const dynamic = "force-dynamic";
import Link from "next/link";

const amenities = [
  { number: "01", title: "Private Beach", text: "500 meters of pristine private beach, reserved exclusively for our guests." },
  { number: "02", title: "Infinity Pool", text: "Two temperature-controlled pools overlooking the Mediterranean sea." },
  { number: "03", title: "Spa & Wellness", text: "Full service spa with massages, treatments and a traditional hammam." },
  { number: "04", title: "Fine Dining", text: "Three restaurants serving fresh local seafood and Mediterranean cuisine." },
  { number: "05", title: "Water Sports", text: "Kayaking, paddleboarding, snorkeling and sailing available daily." },
  { number: "06", title: "Concierge", text: "24 hour personal concierge to arrange anything your stay requires." },
];

export default function Home() {
  return (
    <main>

      {/* Hero — full screen image, no text */}
      <section className="relative h-screen w-full overflow-hidden">
        <img
          src="/beach.png"
          alt="Marea beachside resort"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1a1a1a]/20" />

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs tracking-[0.3em] uppercase text-white/50">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-[#c4845a] mb-6">Our Philosophy</p>
        <h2 className="text-3xl md:text-5xl font-light text-[#1a1a1a] leading-relaxed mb-8">
          Some places you visit.<br />Others stay with you.
        </h2>
        <p className="text-lg text-[#8a7e6e] leading-relaxed max-w-xl mx-auto font-light">
          Marea was built on a simple belief — that the best luxury is space. Space to breathe, to think, to simply be present with the people you love and the sea that surrounds you.
        </p>
      </section>

      {/* Rooms preview */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-[#c4845a] mb-2">Accommodations</p>
            <h2 className="text-3xl md:text-4xl font-light text-[#1a1a1a]">Our Rooms</h2>
          </div>
          <Link
            href="/rooms"
            className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] hover:text-[#c4845a] transition-colors"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Sea View Room",
              type: "Standard",
              price: "$180",
              image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
            },
            {
              name: "Ocean Suite",
              type: "Suite",
              price: "$320",
              image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
            },
            {
              name: "Beach Villa",
              type: "Villa",
              price: "$580",
              image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
            },
          ].map((room) => (
            <Link key={room.name} href="/rooms" className="group">
              <div className="aspect-[4/3] overflow-hidden bg-[#e0d8cc] mb-5">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] mb-1">{room.type}</p>
                  <h3 className="text-xl font-light text-[#1a1a1a]">{room.name}</h3>
                </div>
                <div className="text-right">
                  <p className="text-lg font-light text-[#c4845a]">{room.price}</p>
                  <p className="text-xs text-[#8a7e6e]">per night</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Full width image strip */}
      <section className="w-full h-64 md:h-96 overflow-hidden relative">
        <img
          src="https://images.unsplash.com/photo-1439130490301-25e322d88054?w=1600&q=80"
          alt="Marea beach"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1a1a1a]/20 flex items-center justify-center">
          <p className="text-2xl md:text-4xl font-light text-white tracking-[0.2em] text-center px-6">
            The Mediterranean, at your doorstep
          </p>
        </div>
      </section>

      {/* Amenities */}
      <section className="bg-[#f0ebe1] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.4em] uppercase text-[#c4845a] mb-4">Included</p>
            <h2 className="text-3xl md:text-4xl font-light text-[#1a1a1a]">Resort Amenities</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-[#e0d8cc]">
            {amenities.map((item) => (
              <div key={item.number} className="bg-[#f0ebe1] p-8 md:p-10 flex flex-col gap-4">
                <span className="text-xs tracking-[0.3em] text-[#8a7e6e]">{item.number}</span>
                <h3 className="text-xl font-light text-[#1a1a1a]">{item.title}</h3>
                <p className="text-sm text-[#8a7e6e] leading-relaxed font-light">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick info */}
      <section className="border-t border-[#e0d8cc]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-px bg-[#e0d8cc]">
          {[
            {
              label: "Location",
              lines: ["Calle del Mar 14", "Marbella, Spain"],
              href: "https://maps.google.com/?q=Marbella+Spain",
            },
            {
              label: "Check In / Out",
              lines: ["Check-in from 15:00", "Check-out by 11:00"],
              href: null,
            },
            {
              label: "Phone",
              lines: ["+34 123 456 789"],
              href: "tel:+34123456789",
            },
            {
              label: "Email",
              lines: ["hello@marea.com"],
              href: "mailto:hello@marea.com",
            },
          ].map((item) => (
            <div key={item.label} className="bg-[#faf7f2] px-8 py-10 flex flex-col gap-4">
              <p className="text-xs tracking-[0.3em] uppercase text-[#8a7e6e]">{item.label}</p>
              {item.href ? (
                <a href={item.href} className="flex flex-col gap-1 group">
                  {item.lines.map((line, i) => (
                    <span key={i} className="text-sm text-[#8a7e6e] group-hover:text-[#1a1a1a] transition-colors font-light">
                      {line}
                    </span>
                  ))}
                </a>
              ) : (
                <div className="flex flex-col gap-1">
                  {item.lines.map((line, i) => (
                    <span key={i} className="text-sm text-[#8a7e6e] font-light">{line}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-24 text-center px-6">
        <p className="text-xs tracking-[0.4em] uppercase text-[#8a7e6e] mb-6">Ready?</p>
        <h2 className="text-3xl md:text-5xl font-light text-[#1a1a1a] mb-8">
          Begin your stay at Marea
        </h2>
        <p className="text-lg text-[#8a7e6e] mb-10 max-w-md mx-auto leading-relaxed font-light">
          Reserve your room directly with us for the best available rate and complimentary amenities.
        </p>
        <Link
          href="/rooms"
          className="text-xs tracking-[0.3em] uppercase border border-[#c4845a] text-[#c4845a] px-12 py-4 hover:bg-[#c4845a] hover:text-white transition-all duration-300 inline-block"
        >
          Book Now
        </Link>
      </section>

    </main>
  );
}