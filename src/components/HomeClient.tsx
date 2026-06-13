'use strict';

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, Heart, Calendar, Award, Compass, ChevronLeft, ChevronRight } from 'lucide-react';
import { Album, HeroImage, Service, Testimonial } from '@/lib/mockData';

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
  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);
  const [currentTestimonialIdx, setCurrentTestimonialIdx] = useState(0);

  // Auto-play hero slider
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroIdx((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroImages]);

  const nextTestimonial = () => {
    setCurrentTestimonialIdx((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="w-full">
      {/* 1. Cinematic Hero Section */}
      <section className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center">
        {/* Background Slider */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHeroIdx}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.6, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={heroImages[currentHeroIdx]?.image_url || '/placeholder-hero.jpg'}
                alt="Cinematic Portfolio Shot"
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </motion.div>
          </AnimatePresence>
          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/60 z-10" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-6 mt-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-gold tracking-[0.3em] text-xs uppercase font-semibold"
          >
            Premium Photography & Cinematography
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1.0 }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wide text-white leading-tight font-light"
          >
            Capturing the <br />
            <span className="text-shine italic font-normal font-serif">Poetry of Light</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.0 }}
            className="max-w-xl text-gray-300 font-light text-sm sm:text-base md:text-lg leading-relaxed mt-2"
          >
            We frame the fleeting moments, authentic emotions, and raw elegance of your lives in cinematic art.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 mt-6"
          >
            <Link
              href="/portfolio"
              className="px-8 py-3.5 rounded-full bg-gold text-black hover:bg-gold-hover transition-all duration-300 text-xs uppercase tracking-widest font-semibold flex items-center gap-2 shadow-lg hover:shadow-gold/20"
            >
              Explore Portfolio <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-full border border-white/20 text-white hover:border-gold hover:text-gold transition-all duration-300 text-xs uppercase tracking-widest font-semibold"
            >
              Discuss Your Project
            </Link>
          </motion.div>
        </div>

        {/* Hero Slider Indicators */}
        {heroImages.length > 1 && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentHeroIdx(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  currentHeroIdx === idx ? 'w-8 bg-gold' : 'w-2 bg-white/30'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* 2. Studio Introduction Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <span className="text-gold tracking-[0.2em] text-xs uppercase font-semibold">
              Behind the Lens
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-white font-light leading-tight">
              We Don't Just Take Photos. <br />
              <span className="italic text-gray-400 font-serif">We Tell Stories.</span>
            </h2>
            <p className="text-gray-400 font-light leading-relaxed text-base">
              Aura Studio was founded with a singular purpose: to elevate photography into an immersive, premium art form. Based in Chennai, we document life's milestones—from spectacular weddings to corporate visual identities—with a distinctive cinematic style.
            </p>
            <p className="text-gray-400 font-light leading-relaxed text-base">
              We look for the authentic, unscripted in-between moments: the subtle squeeze of a hand, the quiet tear of a mother, the shared laughter of old friends. Our approach is unobtrusive, allowing your genuine emotions to shine through while we masterfully capture the lighting, composition, and aesthetic details.
            </p>
            <div className="grid grid-cols-3 gap-6 mt-6 border-t border-white/5 pt-8">
              <div className="flex flex-col">
                <span className="font-serif text-3xl text-gold font-light">10+</span>
                <span className="text-xs uppercase tracking-widest text-gray-500 mt-1">Years Experience</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-3xl text-gold font-light">300+</span>
                <span className="text-xs uppercase tracking-widest text-gray-500 mt-1">Weddings Captured</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-3xl text-gold font-light">100%</span>
                <span className="text-xs uppercase tracking-widest text-gray-500 mt-1">Happy Clients</span>
              </div>
            </div>
          </div>

          {/* Intro Side Collage */}
          <div className="lg:col-span-5 relative h-[500px] w-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl group">
            <Image
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1000&auto=format&fit=crop"
              alt="Photographer at work"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-6 glass rounded-xl border border-white/10 flex items-center gap-4">
              <div className="p-2.5 rounded-lg bg-gold/10 text-gold">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gold uppercase tracking-widest font-semibold">Award Winning</p>
                <p className="text-sm text-white font-serif mt-0.5">Top 10 Photographers in South India</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Portfolio Section */}
      <section className="py-24 bg-card border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-gold tracking-[0.2em] text-xs uppercase font-semibold">
                Curated Gallery
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-white font-light">
                Featured Love Stories
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="text-sm uppercase tracking-widest text-gold hover:text-white transition-colors duration-300 flex items-center gap-2 group font-semibold"
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
                className="group relative h-[450px] rounded-2xl overflow-hidden border border-white/5 flex flex-col justify-end p-6 shadow-xl"
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
                <div className="absolute inset-0 border border-transparent group-hover:border-gold/30 rounded-2xl transition-all duration-500 m-3 pointer-events-none" />

                {/* Info Content */}
                <div className="relative z-10 flex flex-col gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">
                    {album.category}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-white font-light">
                    {album.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-light line-clamp-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {album.description || 'View client gallery and cinematic photo series.'}
                  </p>
                  <Link
                    href={`/portfolio/${album.slug}`}
                    className="text-xs font-semibold text-gold uppercase tracking-widest mt-2 flex items-center gap-1 hover:text-white transition-colors duration-300"
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
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-16">
          {/* Header */}
          <div className="text-center flex flex-col items-center gap-3">
            <span className="text-gold tracking-[0.2em] text-xs uppercase font-semibold">
              Our Expertise
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-white font-light">
              Crafted Services for Every Milestone
            </h2>
            <div className="h-[1px] w-20 bg-gold/45 mt-4" />
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
                className="glass rounded-2xl p-8 border border-white/5 flex flex-col gap-6 justify-between group hover:border-gold/20 hover:bg-white/[0.02] transition-all duration-500"
              >
                <div className="flex flex-col gap-4">
                  {/* Icon Selection */}
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all duration-500">
                    {index === 0 && <Heart className="w-5 h-5" />}
                    {index === 1 && <Compass className="w-5 h-5" />}
                    {index === 2 && <Calendar className="w-5 h-5" />}
                    {index === 3 && <Award className="w-5 h-5" />}
                  </div>
                  <h3 className="font-serif text-xl text-white font-light group-hover:text-gold transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-400 font-light leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <Link
                  href={`/services#${service.slug}`}
                  className="text-xs font-semibold text-white group-hover:text-gold uppercase tracking-widest flex items-center gap-1.5 mt-2 transition-colors duration-300"
                >
                  Learn More <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Testimonials Section */}
      <section className="py-24 bg-card relative overflow-hidden border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-8">
          <span className="text-gold tracking-[0.2em] text-xs uppercase font-semibold">
            Kind Words
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-light">
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
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>

                <div className="flex items-center gap-3.5 mt-2">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gold/30">
                    <Image
                      src={testimonials[currentTestimonialIdx]?.image || '/placeholder-profile.jpg'}
                      alt={testimonials[currentTestimonialIdx]?.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-semibold text-white font-serif tracking-wide">
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
                className="p-2.5 rounded-full border border-white/10 hover:border-gold hover:text-gold text-gray-400 transition-colors"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-2.5 rounded-full border border-white/10 hover:border-gold hover:text-gold text-gray-400 transition-colors"
                aria-label="Next Testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 6. Contact CTA Section */}
      <section className="py-28 bg-background relative overflow-hidden">
        {/* Background Radial Light */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-8 relative z-10">
          <h2 className="font-serif text-4xl sm:text-6xl text-white font-light leading-tight">
            Let's Co-create Something <br />
            <span className="text-shine italic font-serif">Unforgettable</span>
          </h2>
          <p className="max-w-lg text-gray-400 font-light text-sm sm:text-base leading-relaxed">
            Whether it's a grand destination wedding, a pre-wedding seaside portrait session, or brand marketing campaigns, let's capture it exquisitely.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-full bg-gold text-black hover:bg-gold-hover transition-all duration-300 text-xs uppercase tracking-widest font-semibold"
            >
              Contact the Studio
            </Link>
            <a
              href="https://wa.me/919876543210?text=Hi%20Aura%20Studio!%20I'm%20interested%20in%20booking%20a%20photography%20session."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-full border border-white/10 hover:border-gold hover:text-gold transition-all duration-300 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
