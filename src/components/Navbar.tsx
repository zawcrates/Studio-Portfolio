'use strict';

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'home', href: '/' },
  { name: 'portfolio', href: '/portfolio' },
  { name: 'services', href: '/services' },
  { name: 'about', href: '/about' },
  { name: 'contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle body scroll locking
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Circle overlay animation variants
  const circleVariants = {
    closed: {
      scale: 1,
      opacity: 0,
      transition: {
        duration: 0.75,
        delay: 0.15, // Wait for menu items to fade out first
        ease: [0.76, 0, 0.24, 1] as any,
      },
    },
    open: {
      scale: 50, // Large scale factor to cover the entire viewport
      opacity: 1,
      transition: {
        duration: 0.85,
        ease: [0.76, 0, 0.24, 1] as any,
      },
    },
  };

  // Nav content overlay container variants
  const contentVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.25,
        ease: 'easeInOut' as any,
      },
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeInOut' as any,
      },
    },
  };

  // Staggered list variants
  const listVariants = {
    closed: {
      transition: {
        staggerChildren: 0.04,
        staggerDirection: -1,
      },
    },
    open: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.35, // Wait for circular scale expansion to cover most of the screen
      },
    },
  };

  // Individual link animation variants
  const linkVariants = {
    closed: {
      opacity: 0,
      y: 40,
      transition: {
        duration: 0.35,
        ease: [0.76, 0, 0.24, 1] as any,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: [0.215, 0.61, 0.355, 1] as any, // premium cubic-out easing
      },
    },
  };



  const isGalleryPage = pathname?.startsWith('/portfolio/') && pathname !== '/portfolio';
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <>
      {!isGalleryPage && !isAdminPage && (
        <>
          {/* 1. Mobile-only Sticky Header */}
          <div className="md:hidden fixed top-0 left-0 w-full h-18 bg-background/85 backdrop-blur-md border-b border-border/10 flex items-center justify-between px-6 z-50">
            {/* Logo */}
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="select-none h-14 w-44 overflow-hidden flex items-center justify-start"
            >
              <Image
                src="/Varnam_svg3.png"
                alt="Varnam Invites"
                width={176}
                height={96}
                className={`h-24 w-auto object-contain -my-5 transition-all duration-500 ${
                  isOpen ? 'invert' : ''
                }`}
                priority
              />
            </Link>

            {/* Visible Mobile Hamburger Trigger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-11 h-11 flex items-center justify-center border transition-all duration-300 focus:outline-none"
              style={{
                borderColor: isOpen ? 'rgba(254, 233, 255, 0.15)' : 'rgba(78, 34, 15, 0.15)',
                backgroundColor: isOpen ? 'transparent' : 'rgba(78, 34, 15, 0.85)',
                borderRadius: '8px',
              }}
              aria-label="Toggle Navigation Menu"
            >
              <div className="relative w-8 h-8 flex flex-col justify-center items-center">
                {/* Top Line */}
                <motion.span
                  animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="absolute w-5 h-[1.5px]"
                  style={{
                    backgroundColor: isOpen ? 'var(--foreground)' : 'var(--background)',
                  }}
                />
                {/* Middle Line */}
                <motion.span
                  animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute w-5 h-[1.5px]"
                  style={{
                    backgroundColor: 'var(--background)',
                  }}
                />
                {/* Bottom Line */}
                <motion.span
                  animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
                  transition={{ duration: 0.3 }}
                  className="absolute w-5 h-[1.5px]"
                  style={{
                    backgroundColor: isOpen ? 'var(--foreground)' : 'var(--background)',
                  }}
                />
              </div>
            </button>
          </div>

          {/* 2. Desktop-only Floating Brand Logo (z-50) */}
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="hidden md:flex fixed top-[10px] left-[0px] sm:top-[5px] sm:left-[5px] lg:top-[0px] lg:left-[30px] z-50 select-none transition-opacity duration-500 hover:opacity-80 h-32 w-64 overflow-hidden items-center justify-start"
          >
            <Image
              src="/Varnam_svg3.png"
              alt="Varnam Invites"
              width={320}
              height={128}
              className={`h-56 w-auto object-contain -my-12 transition-all duration-500 ${
                isOpen ? 'invert' : ''
              }`}
              priority
            />
          </Link>

          {/* 3. Circular Morphing Overlay Circle (z-40) */}
          <motion.div
            variants={circleVariants}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            className="fixed -top-[45px] -right-[45px] w-[130px] h-[130px] sm:-top-[60px] sm:-right-[60px] sm:w-[170px] sm:h-[170px] lg:-top-[70px] lg:-right-[70px] lg:w-[200px] lg:h-[200px] rounded-full bg-accent z-40 pointer-events-none origin-center"
            style={{
              willChange: 'transform',
            }}
          />

          {/* 4a. First Layered Circle Outline (Desktop Only, z-50, pointer-events-none) */}
          <motion.div
            animate={isOpen ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="hidden md:block fixed -top-[35px] -right-[55px] w-[130px] h-[130px] sm:-top-[40px] sm:-right-[75px] sm:w-[170px] sm:h-[170px] lg:-top-[50px] lg:-right-[95px] lg:w-[200px] lg:h-[200px] rounded-full border border-accent/20 pointer-events-none z-50 transition-all duration-500"
          />

          {/* 4b. Second Layered Circle Outline (Desktop Only, z-50, pointer-events-none) */}
          <motion.div
            animate={isOpen ? { opacity: 0, scale: 0.85 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: 'easeInOut', delay: 0.03 }}
            className="hidden md:block fixed -top-[25px] -right-[65px] w-[130px] h-[130px] sm:-top-[30px] sm:-right-[95px] sm:w-[170px] sm:h-[170px] lg:-top-[30px] lg:-right-[120px] lg:w-[200px] lg:h-[200px] rounded-full border border-accent/15 pointer-events-none z-50 transition-all duration-500"
          />

          {/* 5. Desktop-only Interactive Hamburger / Close Button (z-50) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden md:flex fixed -top-[45px] -right-[45px] w-[130px] h-[130px] sm:-top-[60px] sm:-right-[60px] sm:w-[170px] sm:h-[170px] lg:-top-[70px] lg:-right-[70px] lg:w-[200px] lg:h-[200px] rounded-full z-50 flex items-end justify-start pb-[33px] pl-[33px] sm:pb-[35px] sm:pl-[35px] lg:pb-[50px] lg:pl-[50px] border transition-all duration-500 cursor-pointer focus:outline-none"
            style={{
              borderColor: isOpen ? 'rgba(254, 233, 255, 0.12)' : 'rgba(78, 34, 15, 0.1)',
              backgroundColor: isOpen ? 'transparent' : 'rgba(78, 34, 15, 0.7)',
              backdropFilter: isOpen ? 'none' : 'blur(12px)',
            }}
            aria-label="Toggle Navigation Menu"
          >
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex flex-col justify-center items-center">
              {/* Top Line */}
              <motion.span
                animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: "var(--line-y-top)" }}
                transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] as any }}
                className="absolute w-6 sm:w-8 h-[1.5px]"
                style={{
                  backgroundColor: 'var(--background)',
                }}
              />
              {/* Middle Line */}
              <motion.span
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute w-6 sm:w-8 h-[1.5px]"
                style={{
                  backgroundColor: 'var(--background)',
                }}
              />
              {/* Bottom Line */}
              <motion.span
                animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: "var(--line-y-bottom)" }}
                transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] as any }}
                className="absolute w-6 sm:w-8 h-[1.5px]"
                style={{
                  backgroundColor: 'var(--background)',
                }}
              />
            </div>
          </button>

          {/* 3. Fullscreen Navigation Content (z-45) */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                variants={contentVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="fixed inset-0 z-45 flex items-center justify-center overflow-hidden"
              >
                {/* Split Grid Layout: Left Info, Right Menu */}
                <div className="w-full max-w-7xl mx-auto px-8 sm:px-12 md:px-20 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
                  
                  {/* Left Column: Brand Details (Hidden or smaller on mobile) */}
                  <div className="hidden lg:flex lg:col-span-5 flex-col gap-10 text-background/80 font-sans border-r border-background/10 pr-16 h-full justify-center">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] tracking-[0.3em] uppercase text-background/40 font-semibold">
                        Studio Office
                      </span>
                      <p className="text-sm font-light leading-relaxed">
                        12, Khader Nawaz Khan Rd,<br />
                        Nungambakkam, Chennai 600006
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] tracking-[0.3em] uppercase text-background/40 font-semibold">
                        Bookings & Inquiries
                      </span>
                      <a href="mailto:hello@aurastudio.in" className="text-sm font-light hover:text-background transition-colors">
                        hello@aurastudio.in
                      </a>
                      <a href="tel:+919876543210" className="text-sm font-light hover:text-background transition-colors">
                        +91 98765 43210
                      </a>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] tracking-[0.3em] uppercase text-background/40 font-semibold">
                        Follow Our Story
                      </span>
                      <div className="flex gap-6 text-xs uppercase tracking-wider">
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-background transition-colors">instagram</a>
                        <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:text-background transition-colors">pinterest</a>
                        <a href="https://behance.net" target="_blank" rel="noreferrer" className="hover:text-background transition-colors">behance</a>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Main Links */}
                  <div className="lg:col-span-7 flex flex-col justify-center">
                    <motion.nav
                      variants={listVariants}
                      className="flex flex-col gap-4 sm:gap-6"
                    >
                      {NAV_LINKS.map((link, idx) => {
                        const isActive = pathname === link.href;
                        return (
                          <motion.div
                            key={link.href}
                            variants={linkVariants}
                            className="overflow-hidden"
                          >
                            <Link
                              href={link.href}
                              onClick={() => setIsOpen(false)}
                              className="group flex items-baseline select-none"
                            >
                              {/* Item Index */}
                              <span className="font-sans text-xs sm:text-sm tracking-widest text-background/35 mr-4 sm:mr-6">
                                0{idx + 1}
                              </span>
                              
                              {/* Link Text */}
                              <span className="relative font-serif font-light text-5xl sm:text-7xl lg:text-8xl tracking-tight text-background hover:italic transition-all duration-300">
                                {link.name}
                                
                                {/* Dot indicator for active route */}
                                {isActive && (
                                  <span className="absolute -right-6 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-background/60" />
                                )}
                              </span>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </motion.nav>

                    {/* Mobile Info Footer: display under nav links on small viewports */}
                    <div className="flex lg:hidden flex-wrap gap-x-8 gap-y-4 mt-16 pt-8 border-t border-background/10 text-background/60 text-[10px] sm:text-xs uppercase tracking-widest">
                      <a href="mailto:hello@aurastudio.in" className="hover:text-background transition-colors">
                        hello@aurastudio.in
                      </a>
                      <a href="tel:+919876543210" className="hover:text-background transition-colors">
                        +91 98765 43210
                      </a>
                      <div className="flex gap-4 w-full mt-2">
                        <a href="https://instagram.com" className="hover:text-background transition-colors">instagram</a>
                        <a href="https://pinterest.com" className="hover:text-background transition-colors">pinterest</a>
                      </div>
                    </div>

                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
}
