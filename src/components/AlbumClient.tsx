'use strict';

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, ChevronLeft, ChevronRight, Calendar, Tag } from 'lucide-react';
import { Album } from '@/lib/mockData';

interface AlbumClientProps {
  album: Album;
}

export default function AlbumClient({ album }: AlbumClientProps) {
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);

  const openLightbox = (idx: number) => {
    setActivePhotoIdx(idx);
  };

  const closeLightbox = () => {
    setActivePhotoIdx(null);
  };

  const navigateNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activePhotoIdx === null) return;
    setActivePhotoIdx((prev) => (prev! + 1) % album.photos.length);
  };

  const navigatePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activePhotoIdx === null) return;
    setActivePhotoIdx((prev) => (prev! - 1 + album.photos.length) % album.photos.length);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIdx === null) return;
      if (e.key === 'ArrowRight') navigateNext();
      if (e.key === 'ArrowLeft') navigatePrev();
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIdx]);

  // Prevent page scroll when lightbox is open
  useEffect(() => {
    if (activePhotoIdx !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activePhotoIdx]);

  // Helpers to extract couple name and location
  const getCoupleName = (title: string) => {
    return title
      .replace(/\s+(Wedding|Pre-Wedding|Engagement|Maternity|Session|Portraits|Corporate|TEDx).*/i, '')
      .trim();
  };

  const getAlbumLocation = (album: Album) => {
    const slug = album.slug.toLowerCase();
    if (slug.includes('mahabalipuram')) return 'MAHABALIPURAM, INDIA';
    if (slug.includes('chennai')) return 'CHENNAI, INDIA';
    
    const desc = (album.description || '').toLowerCase();
    if (desc.includes('mahabalipuram')) return 'MAHABALIPURAM, INDIA';
    if (desc.includes('chennai')) return 'CHENNAI, INDIA';
    
    return 'CHENNAI, INDIA';
  };

  const formattedDate = new Date(album.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="w-full min-h-screen bg-background">
      
      {/* 1. Fullscreen Hero Section */}
      <div className="w-full h-screen relative flex flex-col items-center justify-center overflow-hidden select-none">
        {/* Background Image */}
        <Image
          src={album.cover_image}
          alt={album.title}
          fill
          priority
          className="object-cover"
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/45 z-10" />

        {/* Floating Back Button */}
        <Link
          href="/portfolio"
          className="fixed top-6 left-6 sm:top-8 sm:left-8 z-50 flex items-center gap-2 text-white/70 hover:text-white uppercase tracking-widest text-xs font-semibold glass px-4 py-2 rounded-full border border-white/10 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Galleries
        </Link>

        {/* Centered Couple Name & Location */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-20 flex flex-col items-center gap-4 text-center px-6 max-w-4xl"
        >
          <h1 className="font-sans text-5xl sm:text-7xl md:text-8xl text-white font-bold tracking-tight uppercase leading-tight">
            {getCoupleName(album.title)}
          </h1>
          <div className="h-[1px] w-16 bg-white/40 my-2" />
          <p className="text-xs sm:text-sm tracking-[0.4em] text-white/90 uppercase font-semibold">
            {getAlbumLocation(album)}
          </p>
        </motion.div>

        {/* Animated Scroll Down Indicator */}
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          onClick={() => {
            const element = document.getElementById('gallery-section');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/60 text-[10px] sm:text-xs uppercase tracking-[0.3em] flex flex-col items-center gap-2 cursor-pointer hover:text-white transition-colors duration-300"
        >
          <span>view gallery</span>
          <span className="text-sm">↓</span>
        </motion.div>
      </div>

      {/* 2. Gallery Fold */}
      <div id="gallery-section" className="w-full py-24 px-6 md:px-12 bg-background scroll-mt-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Album description and metadata */}
          <div className="flex flex-col gap-6 max-w-3xl mb-16">
            <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500 font-mono">
              <span className="flex items-center gap-1.5 capitalize">
                <Tag className="w-4 h-4 text-accent" /> {album.category}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-accent" /> {formattedDate}
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-foreground font-light leading-tight">
              {album.title}
            </h2>

            <p className="text-[#414538]/85 font-light leading-relaxed text-sm sm:text-base md:text-lg">
              {album.description || 'Welcome to our client showcase gallery. Experience the moments frame-by-frame.'}
            </p>
            <div className="h-[1px] w-20 bg-accent/45 mt-2" />
          </div>

          {/* Gallery Grid (Masonry Layout) */}
          {album.photos.length > 0 ? (
            <div className="columns-1 sm:columns-2 md:columns-3 gap-3 [column-fill:_balance]">
              {album.photos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  onClick={() => openLightbox(index)}
                  className="break-inside-avoid mb-3 relative overflow-hidden border border-border/5 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 group rounded-none"
                >
                  <img
                    src={photo.image_url}
                    alt={`${album.title} - shot ${index + 1}`}
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-102"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="px-5 py-2 rounded-none glass border border-border/10 text-xs uppercase tracking-widest text-foreground font-semibold">
                      Expand Image
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500 font-serif">
              No photos uploaded to this album yet.
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {activePhotoIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/98 flex items-center justify-center p-4 md:p-8"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-2 rounded-full glass text-foreground hover:text-accent border border-border/10 transition-colors z-55"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Arrows */}
            {album.photos.length > 1 && (
              <>
                <button
                  onClick={navigatePrev}
                  className="absolute left-6 p-3 rounded-full glass text-foreground hover:text-accent border border-border/10 transition-colors z-55"
                  aria-label="Previous Photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={navigateNext}
                  className="absolute right-6 p-3 rounded-full glass text-foreground hover:text-accent border border-border/10 transition-colors z-55"
                  aria-label="Next Photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Photo Container */}
            <div className="relative w-full h-[80vh] max-w-5xl flex items-center justify-center select-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePhotoIdx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={album.photos[activePhotoIdx].image_url}
                    alt={`${album.title} - shot ${activePhotoIdx + 1}`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full glass text-xs text-gray-400 font-mono border border-border/5">
              {activePhotoIdx + 1} / {album.photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
