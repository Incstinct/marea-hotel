"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const isHome = pathname === "/";

  useEffect(() => {
    setMenuOpen(false);
    setScrolled(window.scrollY > 20);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const transparent = isHome && !scrolled && !menuOpen;
  const navBg = transparent ? "bg-transparent" : "bg-[#faf7f2] border-b border-[#e0d8cc]";
  const textColor = transparent ? "text-white" : "text-[#1a1a1a]";
  const borderColor = transparent ? "border-white/50" : "border-[#c4845a]";
  const accentColor = transparent ? "text-white" : "text-[#c4845a]";

  const links = [
    { href: "/rooms", label: "Rooms" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${navBg}`}>

      {/* Top navbar */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Left — hamburger on mobile */}
          <div className="flex items-center gap-4 w-1/3">
            <button
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className={`block w-5 h-0.5 transition-all duration-300 ${transparent ? "bg-white" : "bg-[#1a1a1a]"} ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 transition-all duration-300 ${transparent ? "bg-white" : "bg-[#1a1a1a]"} ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 transition-all duration-300 ${transparent ? "bg-white" : "bg-[#1a1a1a]"} ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>

          {/* Center — Logo */}
          <div className="flex justify-center w-1/3">
            <Link href="/" className={`text-2xl tracking-[0.5em] uppercase font-light transition-colors duration-200 ${textColor}`}>
              Marea
            </Link>
          </div>

          {/* Right — actions */}
          <div className="hidden md:flex items-center gap-6 justify-end w-1/3">
            {!authLoading && (
              <>
                {user ? (
                  <Link href="/account" className={`text-xs tracking-[0.15em] uppercase transition-colors duration-200 ${textColor}`}>
                    My Account
                  </Link>
                ) : (
                  <Link href="/login" className={`text-xs tracking-[0.15em] uppercase transition-colors duration-200 ${textColor}`}>
                    Login
                  </Link>
                )}
              </>
            )}
            <Link
              href="/rooms"
              className={`text-xs tracking-[0.2em] uppercase border px-5 py-2 transition-all duration-200 ${borderColor} ${accentColor} hover:bg-[#c4845a] hover:text-white hover:border-[#c4845a]`}
            >
              Reserve
            </Link>
          </div>

          {/* Mobile right — reserve button */}
          <div className="flex md:hidden justify-end w-1/3">
            <Link
              href="/rooms"
              className={`text-xs tracking-[0.2em] uppercase border px-4 py-1.5 transition-all duration-200 ${borderColor} ${accentColor}`}
            >
              Reserve
            </Link>
          </div>

        </div>
      </div>

      {/* Divider */}
      <div className={`w-full h-px transition-colors duration-200 ${transparent ? "bg-white/20" : "bg-[#e0d8cc]"}`} />

      {/* Bottom navbar — desktop only */}
      <div className="hidden md:block max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-center gap-12 h-14">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs tracking-[0.2em] uppercase transition-colors duration-200 ${
                pathname === link.href ? accentColor : textColor
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#faf7f2] border-t border-[#e0d8cc] px-6 py-6 flex flex-col gap-5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs tracking-[0.2em] uppercase transition-colors ${
                pathname === link.href ? "text-[#c4845a]" : "text-[#8a7e6e]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="w-full h-px bg-[#e0d8cc]" />
          {!authLoading && (
            user ? (
              <Link href="/account" className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e]">
                My Account
              </Link>
            ) : (
              <Link href="/login" className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e]">
                Login
              </Link>
            )
          )}
        </div>
      )}

    </nav>
  );
}