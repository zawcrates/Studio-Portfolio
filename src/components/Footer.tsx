'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const isAdminPage = pathname?.startsWith('/admin');
  if (isAdminPage) return null;

  return (
    <footer className="bg-[#0c0604] text-neutral-400 pt-20 pb-10 border-t border-white/5 relative overflow-hidden">
      {/* Background ambient glow inside footer */}
      <div className="absolute -top-40 right-0 w-96 h-96 bg-glow-accent rounded-full pointer-events-none blur-[120px] opacity-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 relative z-10">
        {/* Branding & Bio */}
        <div className="flex flex-col gap-5">
          <Link
            href="/"
            className="flex items-center select-none hover:opacity-95 transition-opacity duration-300 w-fit h-12 w-36 overflow-hidden justify-start"
          >
            <Image
              src="/Varnam_svg3.png"
              alt="Varnam Invites"
              width={160}
              height={64}
              className="h-20 w-auto object-contain -my-4 brightness-0 invert"
            />
          </Link>
          <p className="text-sm text-neutral-400 mt-2 leading-relaxed font-light">
            Capturing your most precious moments and turning them into timeless cinematic art. Based in Chennai, available worldwide.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 hover:text-[#d4af37] hover:bg-white/10 transition-all duration-300 border border-white/5"
              aria-label="Instagram"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 hover:text-[#d4af37] hover:bg-white/10 transition-all duration-300 border border-white/5"
              aria-label="Facebook"
            >
              <svg
                className="w-4 h-4 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-5">
          <h3 className="text-white text-xs uppercase tracking-widest font-semibold border-l-2 border-accent pl-3">
            Explore
          </h3>
          <ul className="flex flex-col gap-3 text-sm font-light">
            <li>
              <Link href="/" className="hover:text-[#d4af37] transition-colors duration-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="/portfolio" className="hover:text-[#d4af37] transition-colors duration-300">
                Portfolio Galleries
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-[#d4af37] transition-colors duration-300">
                Our Services
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[#d4af37] transition-colors duration-300">
                About the Studio
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#d4af37] transition-colors duration-300">
                Book a Session
              </Link>
            </li>
          </ul>
        </div>

        {/* Portfolio Categories */}
        <div className="flex flex-col gap-5">
          <h3 className="text-white text-xs uppercase tracking-widest font-semibold border-l-2 border-accent pl-3">
            Portfolio
          </h3>
          <ul className="flex flex-col gap-3 text-sm font-light">
            <li>
              <Link href="/portfolio?category=weddings" className="hover:text-[#d4af37] transition-colors duration-300">
                Weddings
              </Link>
            </li>
            <li>
              <Link href="/portfolio?category=pre-weddings" className="hover:text-[#d4af37] transition-colors duration-300">
                Pre-Weddings
              </Link>
            </li>
            <li>
              <Link href="/portfolio?category=engagements" className="hover:text-[#d4af37] transition-colors duration-300">
                Engagements
              </Link>
            </li>
            <li>
              <Link href="/portfolio?category=events" className="hover:text-[#d4af37] transition-colors duration-300">
                Events & Celebrations
              </Link>
            </li>
            <li>
              <Link href="/portfolio?category=corporate" className="hover:text-[#d4af37] transition-colors duration-300">
                Corporate & Brands
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-5">
          <h3 className="text-white text-xs uppercase tracking-widest font-semibold border-l-2 border-accent pl-3">
            Get in Touch
          </h3>
          <ul className="flex flex-col gap-4 text-sm font-light">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <span className="leading-relaxed">12, Khader Nawaz Khan Rd, Nungambakkam, Chennai, Tamil Nadu 600006</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-accent shrink-0" />
              <a href="tel:+919876543210" className="hover:text-[#d4af37] transition-colors duration-300">
                +91 98765 43210
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-accent shrink-0" />
              <a href="mailto:hello@aurastudio.in" className="hover:text-[#d4af37] transition-colors duration-300">
                hello@aurastudio.in
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-light relative z-10 text-neutral-500">
        <p>© {currentYear} Varnam Invites. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-neutral-300 transition-colors duration-300">
            Privacy Policy
          </Link>
          <Link href="/admin/login" className="hover:text-[#d4af37] text-neutral-500 font-normal transition-colors duration-300">
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
