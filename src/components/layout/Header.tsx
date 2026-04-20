"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { NAV_LINKS, COMPANY } from "@/lib/constants";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-dark-bg sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo-dark.jpeg"
              alt={COMPANY.fullName}
              width={48}
              height={48}
              className="rounded-lg"
            />
            <div className="hidden sm:block">
              <p className="text-white font-bold text-lg leading-tight">
                {COMPANY.name}
              </p>
              <p className="text-primary-gold text-xs font-medium">
                {COMPANY.tagline}
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-primary-gold transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/agendar" className="btn-primary text-sm !py-2 !px-5">
              Agendar Serviço
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-700 pt-4">
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-300 hover:text-primary-gold transition-colors text-base font-medium px-2"
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
