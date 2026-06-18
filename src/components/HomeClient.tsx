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
          </div>

          {/* Intro Side Collage */}
          <div className="lg:col-span-5 relative h-[500px] w-full rounded-2xl overflow-hidden border border-border/5 shadow-2xl group intro-collage-container intro-collage-animate">
            <Image
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1000&auto=format&fit=crop"
              alt="Photographer at work"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-6 glass rounded-xl border border-border/10 flex items-center gap-4">
              <div className="p-2.5 rounded-lg bg-accent/10 text-accent">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-accent uppercase tracking-widest font-semibold">Award Winning</p>
                <p className="text-sm text-foreground font-serif mt-0.5">Top 10 Photographers in South India</p>
              </div>
            </div>
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
          </div>

          {/* Albums Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredAlbums.slice(0, 3).map((album, index) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative h-[450px] rounded-2xl overflow-hidden border border-border/5 flex flex-col justify-end p-6 shadow-xl portfolio-card"
              >
                {/* Cover Image */}
                <Image
                  src={album.cover_image}
                  alt={album.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-w-768px) 100vw, 33vw"
                />
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300" />
                <div className="absolute inset-0 border border-transparent group-hover:border-accent/30 rounded-2xl transition-all duration-500 m-3 pointer-events-none" />

                {/* Info Content */}
                <div className="relative z-10 flex flex-col gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                    {album.category}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-foreground font-light">
                    {album.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-light line-clamp-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {album.description || 'View client gallery and cinematic photo series.'}
                  </p>
                  <Link
                    href={`/portfolio/${album.slug}`}
                    className="text-xs font-semibold text-accent uppercase tracking-widest mt-2 flex items-center gap-1 hover:text-foreground transition-colors duration-300"
                  >
                    Open Album <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Services Overview Section */}
      <section className="py-24 bg-background home-section">
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

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="glass rounded-2xl p-8 border border-border/5 flex flex-col gap-6 justify-between group hover:border-accent/20 hover:bg-background/[0.02] transition-all duration-500"
              >
                <div className="flex flex-col gap-4">
                  {/* Icon Selection */}
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all duration-500">
                    {index === 0 && <Heart className="w-5 h-5" />}
                    {index === 1 && <Compass className="w-5 h-5" />}
                    {index === 2 && <Calendar className="w-5 h-5" />}
                    {index === 3 && <Award className="w-5 h-5" />}
                  </div>
                  <h3 className="font-serif text-xl text-foreground font-light group-hover:text-accent transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-400 font-light leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <Link
                  href={`/services#${service.slug}`}
                  className="text-xs font-semibold text-foreground group-hover:text-accent uppercase tracking-widest flex items-center gap-1.5 mt-2 transition-colors duration-300"
                >
                  Learn More <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Testimonials Section */}
      <section className="py-24 bg-card relative overflow-hidden border-t border-border/5 home-section">
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-8">
          <span className="text-accent tracking-[0.2em] text-xs uppercase font-semibold">
            Kind Words
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground font-light">
            Loved by Couples & Brands
          </h2>

          <div className="relative min-h-[200px] w-full flex items-center justify-center mt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonialIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-6"
              >
                <p className="font-serif text-lg sm:text-xl md:text-2xl text-gray-300 italic font-light leading-relaxed max-w-2xl">
                  "{testimonials[currentTestimonialIdx]?.text}"
                </p>

                {/* Star Rating */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-accent" />
                  ))}
                </div>

                <div className="flex items-center gap-3.5 mt-2">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-accent/30">
                    <Image
                      src={testimonials[currentTestimonialIdx]?.image || '/placeholder-profile.jpg'}
                      alt={testimonials[currentTestimonialIdx]?.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-semibold text-foreground font-serif tracking-wide">
                      {testimonials[currentTestimonialIdx]?.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5 font-light">
                      {testimonials[currentTestimonialIdx]?.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Testimonial Nav Arrows */}
          {testimonials.length > 1 && (
            <div className="flex gap-4 mt-4">
              <button
                onClick={prevTestimonial}
                className="p-2.5 rounded-full border border-border/10 hover:border-accent hover:text-accent text-gray-400 transition-colors"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-2.5 rounded-full border border-border/10 hover:border-accent hover:text-accent text-gray-400 transition-colors"
                aria-label="Next Testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 6. Contact CTA Section */}
      <section className="py-28 bg-background relative overflow-hidden home-section">
        {/* Background Radial Light */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-8 relative z-10">
          <h2 className="font-serif text-4xl sm:text-6xl text-foreground font-light leading-tight">
            Let's Co-create Something <br />
            <span className="text-shine italic font-serif">Unforgettable</span>
          </h2>
          <p className="max-w-lg text-gray-400 font-light text-sm sm:text-base leading-relaxed">
            Whether it's a grand destination wedding, a pre-wedding seaside portrait session, or brand marketing campaigns, let's capture it exquisitely.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-full bg-accent text-black hover:bg-accent-hover transition-all duration-300 text-xs uppercase tracking-widest font-semibold"
            >
              Contact the Studio
            </Link>
            <a
              href="https://wa.me/919876543210?text=Hi%20Aura%20Studio!%20I'm%20interested%20in%20booking%20a%20photography%20session."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-full border border-border/10 hover:border-accent hover:text-accent transition-all duration-300 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
