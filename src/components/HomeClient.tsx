'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, Heart, Calendar, Award, Compass, ChevronLeft, ChevronRight } from 'lucide-react';
import { Album, HeroImage, Service, Testimonial } from '@/lib/mockData';
import HeroCarousel from '@/components/hero/HeroCarousel';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HomeClientProps {
  heroImages: HeroImage[];
  featuredAlbums: Album[];
  services: Service[];
  testimonials: Testimonial[];
}

export default function HomeClient({
  heroImages,
  featuredAlbums,
  services,
  testimonials,
}: HomeClientProps) {
  const [currentTestimonialIdx, setCurrentTestimonialIdx] = useState(0);
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const nextTestimonial = () => {
    setCurrentTestimonialIdx((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useGSAP(() => {
    // Reveal text elements in the intro section
    gsap.from(".intro-animate-text", {
      scrollTrigger: {
        trigger: ".intro-section-trigger",
        start: "top 80%",
        toggleActions: "play none none none",
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
    });

    // Reveal collage container in the intro section
    gsap.from(".intro-collage-animate", {
      scrollTrigger: {
        trigger: ".intro-section-trigger",
        start: "top 80%",
        toggleActions: "play none none none",
      },
      x: 40,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    });

    // Reveal portfolio section header
    gsap.from(".portfolio-header-animate", {
      scrollTrigger: {
        trigger: ".portfolio-section-trigger",
        start: "top 85%",
        toggleActions: "play none none none",
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
    });
  }, { scope: containerRef });

  return (
    <div className="w-full" ref={containerRef}>
      {/* 1. Curved Hero Carousel */}
      <HeroCarousel images={heroImages} />

      {/* 2. Studio Introduction Section */}
      <section className="py-24 bg-background relative overflow-hidden home-section intro-section-trigger">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <span className="text-accent tracking-[0.2em] text-xs uppercase font-semibold intro-animate-text">
              Behind the Lens
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-foreground font-light leading-tight intro-animate-text">
              We Don't Just Take Photos. <br />
              <span className="italic text-foreground/75 font-serif">We Tell Stories.</span>
            </h2>
            <p className="text-foreground font-light leading-relaxed text-base intro-animate-text">
              Aura Studio was founded with a singular purpose: to elevate photography into an immersive, premium art form. Based in Chennai, we document life's milestones—from spectacular weddings to corporate visual identities—with a distinctive cinematic style.
            </p>
            <p className="text-foreground font-light leading-relaxed text-base intro-animate-text">
              We look for the authentic, unscripted in-between moments: the subtle squeeze of a hand, the quiet tear of a mother, the shared laughter of old friends. Our approach is unobtrusive, allowing your genuine emotions to shine through while we masterfully capture the lighting, composition, and aesthetic details.
            </p>
            <div className="grid grid-cols-3 gap-6 mt-6 border-t border-border/5 pt-8 intro-animate-text">
              <div className="flex flex-col">
                <span className="font-serif text-3xl text-accent font-light">10+</span>
                <span className="text-xs uppercase tracking-widest text-gray-500 mt-1">Years Experience</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-3xl text-accent font-light">300+</span>
                <span className="text-xs uppercase tracking-widest text-gray-500 mt-1">Weddings Captured</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-3xl text-accent font-light">100%</span>
                <span className="text-xs uppercase tracking-widest text-gray-500 mt-1">Happy Clients</span>
              </div>
            </div>
          </div>          {/* Intro Side Collage */}
          <div className="lg:col-span-5 relative h-[500px] w-full rounded-2xl overflow-hidden border border-border/5 shadow-2xl group intro-collage-container intro-collage-animate">
            <Image
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1000&auto=format&fit=crop"
              alt="Photographer at work"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          </div>
        </div>
      </section>

      {/* 3. Featured Portfolio Section */}
      <section className="py-24 bg-card border-y border-border/5 home-section portfolio-section-trigger">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-accent tracking-[0.2em] text-xs uppercase font-semibold portfolio-header-animate">
                Curated Gallery
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-foreground font-light portfolio-header-animate">
                Featured Love Stories
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="text-sm uppercase tracking-widest text-accent hover:text-foreground transition-colors duration-300 flex items-center gap-2 group font-semibold portfolio-header-animate"
            >
              View All Albums <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>          {/* Widescreen Portfolio Showcase Card */}
          {featuredAlbums[0] && (
            <Link
              href={`/portfolio/${featuredAlbums[0].slug}`}
              className="block focus:outline-none"
            >
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-full h-[350px] sm:h-[450px] md:h-[500px] rounded-none overflow-hidden border border-border/5 shadow-2xl group portfolio-card cursor-pointer"
              >
                {/* Responsive Background Cover Image - Desktop (Hidden on Mobile) */}
                <div className="hidden md:block absolute inset-0">
                  <Image
                    src={featuredAlbums[0].desktop_cover_image || featuredAlbums[0].mobile_cover_image || featuredAlbums[0].cover_image}
                    alt={featuredAlbums[0].title}
                    fill
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-103"
                    sizes="100vw"
                    priority
                  />
                </div>
                {/* Responsive Background Cover Image - Mobile (Hidden on Desktop) */}
                <div className="block md:hidden absolute inset-0">
                  <Image
                    src={featuredAlbums[0].mobile_cover_image || featuredAlbums[0].desktop_cover_image || featuredAlbums[0].cover_image}
                    alt={featuredAlbums[0].title}
                    fill
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-103"
                    sizes="100vw"
                    priority
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/95 via-black/55 to-transparent transition-opacity duration-300" />
                <div className="absolute inset-0 border border-transparent group-hover:border-accent/35 rounded-2xl transition-all duration-700 m-3 sm:m-4 pointer-events-none" />

                {/* Text Content */}
                <div className="absolute inset-0 z-10 flex flex-col justify-end md:justify-center p-8 sm:p-12 md:p-16 max-w-2xl gap-3 sm:gap-4 text-left">
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold animate-pulse">
                    Featured Album — {featuredAlbums[0].category}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-4xl md:text-5xl text-white font-light leading-tight">
                    {featuredAlbums[0].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 font-light line-clamp-3 leading-relaxed max-w-lg mt-1">
                    {featuredAlbums[0].description || 'Discover a cinematic narrative of love, emotion, and elegant fine art imagery.'}
                  </p>
                  <div className="mt-2 sm:mt-4">
                    <span
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white bg-white/5 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300 text-xs uppercase tracking-widest font-semibold"
                    >
                      <span>explore gallery</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          )}
        </div>
      </section>

      {/* 4. Services Overview Section */}
      <section className="py-24 bg-background home-section relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-16">
          {/* Header */}
          <div className="text-center flex flex-col items-center gap-3">
            <span className="text-accent tracking-[0.2em] text-xs uppercase font-semibold">
              Our Expertise
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-foreground font-light">
              Crafted Services for Every Milestone
            </h2>
            <div className="h-[1px] w-20 bg-accent/45 mt-4" />
          </div>

          {/* Desktop Switcher: Hidden on mobile/tablet */}
          <div className="hidden lg:grid grid-cols-12 gap-12 items-center">
            {/* Left Side: Services List Tabs (5 Columns) */}
            <div className="col-span-5 flex flex-col gap-4">
              {services.map((service, index) => {
                const isActive = activeServiceIdx === index;
                return (
                  <div
                    key={service.id}
                    onMouseEnter={() => setActiveServiceIdx(index)}
                    onClick={() => setActiveServiceIdx(index)}
                    className="relative p-6 rounded-xl cursor-pointer transition-all duration-300 group flex items-start gap-5 select-none"
                  >
                    {/* Animated Tab Background capsule using Framer Motion layoutId */}
                    {isActive && (
                      <motion.div
                        layoutId="activeServiceIndicator"
                        className="absolute inset-0 bg-cardbg/80 border border-border/10 shadow-sm rounded-xl -z-10"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    
                    {/* Number Indicator */}
                    <span className={`font-serif text-3xl font-light transition-colors duration-300 mt-0.5 ${
                      isActive ? 'text-accent' : 'text-foreground/30 group-hover:text-foreground/50'
                    }`}>
                      0{index + 1}
                    </span>

                    {/* Content */}
                    <div className="flex flex-col gap-1.5">
                      <h3 className={`font-serif text-xl font-light transition-colors duration-300 ${
                        isActive ? 'text-accent' : 'text-foreground group-hover:text-accent/70'
                      }`}>
                        {service.title}
                      </h3>
                      <p className="text-xs text-foreground/60 font-light leading-relaxed max-w-sm line-clamp-1">
                        {service.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Side: Showcase Frame (7 Columns) */}
            <div className="col-span-7 relative h-[500px] w-full rounded-2xl overflow-hidden border border-border/5 shadow-2xl flex items-end">
              <AnimatePresence mode="wait">
                {services[activeServiceIdx] && (
                  <motion.div
                    key={services[activeServiceIdx].id}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <Image
                      src={services[activeServiceIdx].coverImage}
                      alt={services[activeServiceIdx].title}
                      fill
                      className="object-cover"
                      sizes="(max-w-1024px) 100vw, 50vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Floating glass card */}
              {services[activeServiceIdx] && (
                <div className="absolute bottom-6 left-6 right-6 p-6 glass-light rounded-xl flex flex-col gap-4 text-foreground z-10 border border-border/10 shadow-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-serif text-2xl text-accent font-light">
                        {services[activeServiceIdx].title}
                      </h4>
                      <p className="text-[10px] text-foreground/50 uppercase tracking-[0.15em] font-semibold mt-1">
                        Signature Deliverables
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center text-accent">
                      {activeServiceIdx === 0 && <Heart className="w-4 h-4" />}
                      {activeServiceIdx === 1 && <Compass className="w-4 h-4" />}
                      {activeServiceIdx === 2 && <Calendar className="w-4 h-4" />}
                      {activeServiceIdx === 3 && <Award className="w-4 h-4" />}
                    </div>
                  </div>

                  <p className="text-xs text-foreground/80 font-light leading-relaxed">
                    {services[activeServiceIdx].description}
                  </p>

                  <div className="border-t border-border/10 pt-4 flex justify-between items-center gap-4">
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-foreground/70 font-light flex-grow">
                      {services[activeServiceIdx].features.slice(0, 2).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 line-clamp-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/services#${services[activeServiceIdx].slug}`}
                      className="px-5 py-2.5 rounded-full bg-accent text-white hover:bg-accent-hover transition-all duration-300 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5 shrink-0 shadow-md"
                    >
                      <span>Explore service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Layout: Stack of premium interactive cards (visible on < lg) */}
          <div className="lg:hidden flex flex-col gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="relative h-[320px] w-full rounded-2xl overflow-hidden border border-border/5 shadow-xl flex items-end group"
              >
                {/* Background Image */}
                <Image
                  src={service.coverImage}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-103"
                  sizes="(max-w-768px) 100vw, 80vw"
                />
                
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                
                {/* Floating Content */}
                <div className="relative p-6 w-full flex flex-col gap-3 text-white z-10">
                  <span className="text-[#d4af37] text-[10px] uppercase tracking-[0.2em] font-semibold flex items-center gap-1.5">
                    {index === 0 && <Heart className="w-3.5 h-3.5" />}
                    {index === 1 && <Compass className="w-3.5 h-3.5" />}
                    {index === 2 && <Calendar className="w-3.5 h-3.5" />}
                    {index === 3 && <Award className="w-3.5 h-3.5" />}
                    0{index + 1}
                  </span>
                  
                  <h3 className="font-serif text-2xl font-light text-white leading-tight">
                    {service.title}
                  </h3>
                  
                  <p className="text-xs text-gray-300 font-light line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="flex justify-between items-center border-t border-white/10 pt-3 mt-1">
                    <span className="text-[10px] text-gray-400 font-light">
                      Includes {service.features.length} core deliverables
                    </span>
                    <Link
                      href={`/services#${service.slug}`}
                      className="text-[10px] font-semibold text-[#d4af37] uppercase tracking-widest flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Testimonials Section */}
      <section className="py-24 bg-cardbg/40 relative overflow-hidden border-t border-border/5 home-section">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-glow-sage rounded-full pointer-events-none blur-[100px] opacity-60" />

        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-12 relative z-10">
          {/* Header */}
          <div className="text-center flex flex-col items-center gap-3">
            <span className="text-accent tracking-[0.2em] text-xs uppercase font-semibold">
              Kind Words
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground font-light">
              Loved by Couples & Brands
            </h2>
            <div className="h-[1px] w-20 bg-accent/45 mt-4" />
          </div>

          {/* Testimonial Display Card */}
          <div className="w-full max-w-3xl glass-light rounded-3xl p-8 sm:p-12 border border-border/10 shadow-2xl relative overflow-hidden">
            {/* Background Decorative Quote Mark */}
            <span className="absolute -top-4 -left-2 font-serif text-[180px] text-accent/5 leading-none select-none pointer-events-none">
              “
            </span>

            <div className="relative min-h-[220px] w-full flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonialIdx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center text-center gap-6"
                >
                  {/* Star Rating */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>

                  <p className="font-serif text-base sm:text-xl md:text-2xl text-foreground/90 italic font-light leading-relaxed max-w-2xl">
                    "{testimonials[currentTestimonialIdx]?.text}"
                  </p>

                  <div className="flex flex-col items-center gap-2 mt-2">
                    <h4 className="text-sm font-semibold text-accent font-serif tracking-wide uppercase">
                      {testimonials[currentTestimonialIdx]?.name}
                    </h4>
                    <p className="text-[11px] text-foreground/50 tracking-wider font-light uppercase">
                      {testimonials[currentTestimonialIdx]?.role}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Testimonial Nav Arrows inside Card (on sides) */}
            {testimonials.length > 1 && (
              <>
                <button
                  onClick={prevTestimonial}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full border border-border/10 hover:border-accent hover:text-accent hover:bg-accent/5 text-foreground/50 transition-all duration-300 hidden md:flex"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full border border-border/10 hover:border-accent hover:text-accent hover:bg-accent/5 text-foreground/50 transition-all duration-300 hidden md:flex"
                  aria-label="Next Testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Interactive Client Face Avatars as Switchers */}
          {testimonials.length > 1 && (
            <div className="flex items-center gap-5 mt-2">
              {testimonials.map((testimonial, idx) => {
                const isActive = currentTestimonialIdx === idx;
                return (
                  <button
                    key={testimonial.id}
                    onClick={() => setCurrentTestimonialIdx(idx)}
                    className="group relative flex flex-col items-center focus:outline-none"
                    aria-label={`Show testimonial from ${testimonial.name}`}
                  >
                    <div className={`relative w-12 h-12 rounded-full overflow-hidden transition-all duration-500 cursor-pointer border ${
                      isActive 
                        ? 'border-accent scale-110 shadow-lg ring-4 ring-accent/10' 
                        : 'border-border/20 opacity-55 hover:opacity-100 hover:scale-105'
                    }`}>
                      <Image
                        src={testimonial.image || '/placeholder-profile.jpg'}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Simple Mobile Navigation Arrows (Visible only on small viewports) */}
          {testimonials.length > 1 && (
            <div className="flex gap-4 md:hidden mt-2">
              <button
                onClick={prevTestimonial}
                className="p-2.5 rounded-full border border-border/10 hover:border-accent hover:text-accent text-[#414538]/70 transition-colors"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-2.5 rounded-full border border-border/10 hover:border-accent hover:text-accent text-[#414538]/70 transition-colors"
                aria-label="Next Testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 6. Contact CTA Section */}
      <section className="py-28 relative overflow-hidden bg-gradient-to-br from-[#1c0f0b] to-[#0c0503] border-t border-border/5 text-center text-white home-section">
        {/* Background glow and radial gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(157,102,56,0.12),transparent_60%)] pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-glow-sage rounded-full pointer-events-none blur-[100px] opacity-20" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center gap-8">
          <span className="text-[#d4af37] tracking-[0.25em] text-[10px] sm:text-xs uppercase font-semibold">
            Co-create Art
          </span>

          <h2 className="font-serif text-4xl sm:text-6xl text-white font-light leading-tight">
            Let's Co-create Something <br />
            <span className="text-shine italic font-serif">Unforgettable</span>
          </h2>

          <p className="max-w-lg text-gray-300 font-light text-sm sm:text-base leading-relaxed">
            Whether it's a grand destination wedding, a pre-wedding seaside portrait session, or brand marketing campaigns, let's capture it exquisitely.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-full bg-accent text-white hover:bg-accent-hover transition-all duration-300 text-xs uppercase tracking-widest font-semibold shadow-lg"
            >
              Contact the Studio
              </Link>
            <a
              href="https://wa.me/919876543210?text=Hi%20Aura%20Studio!%20I'm%20interested%20in%20booking%20a%20photography%20session."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-full border border-white/10 hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 bg-white/5"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
