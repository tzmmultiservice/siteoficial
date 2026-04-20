"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { NAV_LINKS, COMPANY } from "@/lib/constants";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "glass shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/images/logo-dark.jpeg"
                alt={COMPANY.fullName}
                width={44}
                height={44}
                className="rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-lg ring-1 ring-white/10" />
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-bold text-lg leading-tight tracking-tight">
                {COMPANY.name}
              </p>
              <p className="text-primary-gold/80 text-xs font-medium tracking-wider uppercase">
                {COMPANY.tagline}
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-gray-300 hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/agendar"
              className="btn-primary text-sm !py-2 !px-5 ml-2"
            >
              Agendar Serviço
            </Link>
          </nav>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isOpen && (
          <nav className="md:hidden pb-4 pt-2 animate-fade-in">
            <div className="glass rounded-xl p-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-300 hover:text-white hover:bg-white/5 transition-all text-base font-medium px-4 py-3 rounded-lg"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/agendar"
                onClick={() => setIsOpen(false)}
                className="btn-primary text-center text-sm mt-2"
              >
                Agendar Serviço
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
