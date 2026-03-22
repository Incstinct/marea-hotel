import Link from "next/link";

export default function Footer() {
  const email = "hello@marea.com";

  return (
    <footer className="border-t border-[#e0d8cc] bg-[#f0ebe1]">
      <div className="max-w-6xl mx-auto px-6 py-16">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="md:col-span-2">
            <p className="text-xl tracking-[0.3em] uppercase text-[#1a1a1a] mb-4">Marea</p>
            <p className="text-sm text-[#8a7e6e] leading-relaxed max-w-xs">
              A beachside resort where the rhythm of the waves sets the pace of your day.
            </p>
            <div className="mt-6 flex flex-col gap-1">
              <p className="text-xs text-[#8a7e6e] tracking-wide">Open year round</p>
              <p className="text-xs text-[#8a7e6e] tracking-wide">Check-in 15:00 — Check-out 11:00</p>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#e0d8cc] mb-5">Navigate</p>
            <div className="flex flex-col gap-3">
              {[
                { href: "/rooms", label: "Rooms" },
                { href: "/gallery", label: "Gallery" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
                { href: "/booking", label: "Book Now" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#8a7e6e] hover:text-[#1a1a1a] transition-colors tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#e0d8cc] mb-5">Find Us</p>
            <div className="flex flex-col gap-3">
              <p className="text-sm text-[#8a7e6e] leading-relaxed">
                Calle del Mar 14
                <br />
                Marbella, Spain
              </p>
              <a href="tel:+34123456789" className="text-sm text-[#8a7e6e] hover:text-[#1a1a1a] transition-colors">
                +34 123 456 789
              </a>
              <a href={`mailto:${email}`} className="text-sm text-[#8a7e6e] hover:text-[#1a1a1a] transition-colors">
                {email}
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#e0d8cc] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#e0d8cc] tracking-wide">
            © 2026 Marea. All rights reserved.
          </p>
          <p className="text-xs text-[#e0d8cc] tracking-wide">
            Built by <span className="text-[#8a7e6e] hover:text-[#c4845a] transition-colors cursor-pointer">Incstinct X</span>
          </p>
        </div>

      </div>
    </footer>
  );
}