import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Camera, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card text-gray-400 pt-16 pb-8 border-t border-border/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Branding & Bio */}
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="flex items-center select-none hover:opacity-80 transition-opacity duration-300"
          >
            <Image
              src="/Varnam_svg3.png"
              alt="Varnam Invites"
              width={140}
              height={56}
              className="h-10 w-auto object-contain"
            />
          </Link>
          <p className="text-sm text-gray-400 mt-2 leading-relaxed font-light">
            Capturing your most precious moments and turning them into timeless cinematic art. Based in Chennai, available worldwide.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-accent transition-colors duration-300"
              aria-label="Instagram"
            >
              <svg
                className="w-5 h-5"
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
              className="text-gray-400 hover:text-accent transition-colors duration-300"
              aria-label="Facebook"
            >
              <svg
                className="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          <h3 className="text-foreground text-xs uppercase tracking-widest font-semibold border-l-2 border-accent pl-3">
            Explore
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm font-light">
            <li>
              <Link href="/" className="hover:text-accent transition-colors duration-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="/portfolio" className="hover:text-accent transition-colors duration-300">
                Portfolio Galleries
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-accent transition-colors duration-300">
                Our Services
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-accent transition-colors duration-300">
                About the Studio
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-accent transition-colors duration-300">
                Book a Session
              </Link>
            </li>
          </ul>
        </div>

        {/* Portfolio Categories */}
        <div className="flex flex-col gap-4">
          <h3 className="text-foreground text-xs uppercase tracking-widest font-semibold border-l-2 border-accent pl-3">
            Portfolio
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm font-light">
            <li>
              <Link href="/portfolio?category=weddings" className="hover:text-accent transition-colors duration-300">
                Weddings
              </Link>
            </li>
            <li>
              <Link href="/portfolio?category=pre-weddings" className="hover:text-accent transition-colors duration-300">
                Pre-Weddings
              </Link>
            </li>
            <li>
              <Link href="/portfolio?category=engagements" className="hover:text-accent transition-colors duration-300">
                Engagements
              </Link>
            </li>
            <li>
              <Link href="/portfolio?category=events" className="hover:text-accent transition-colors duration-300">
                Events & Celebrations
              </Link>
            </li>
            <li>
              <Link href="/portfolio?category=corporate" className="hover:text-accent transition-colors duration-300">
                Corporate & Brands
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-4">
          <h3 className="text-foreground text-xs uppercase tracking-widest font-semibold border-l-2 border-accent pl-3">
            Get in Touch
          </h3>
          <ul className="flex flex-col gap-3.5 text-sm font-light">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <span>12, Khader Nawaz Khan Rd, Nungambakkam, Chennai, Tamil Nadu 600006</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-accent shrink-0" />
              <a href="tel:+919876543210" className="hover:text-accent transition-colors duration-300">
                +91 98765 43210
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-accent shrink-0" />
              <a href="mailto:hello@aurastudio.in" className="hover:text-accent transition-colors duration-300">
                hello@aurastudio.in
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-border/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-light">
        <p>© {currentYear} Varnam Invites. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-foreground transition-colors duration-300">
            Privacy Policy
          </Link>
          <Link href="/admin/login" className="hover:text-accent text-gray-500 font-normal transition-colors duration-300">
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
