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

  const formattedDate = new Date(album.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="w-full min-h-screen pt-32 pb-24 bg-background page-container">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Back Button */}
        <Link
          href="/portfolio"
          className="text-xs uppercase tracking-widest text-gray-400 hover:text-accent transition-colors duration-300 flex items-center gap-2 mb-8 group inline-flex font-semibold"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Galleries
        </Link>

        {/* Album Headers */}
        <div className="flex flex-col gap-6 max-w-3xl mb-16">
          <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500 font-mono">
            <span className="flex items-center gap-1.5 capitalize">
              <Tag className="w-4 h-4 text-accent" /> {album.category}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-accent" /> {formattedDate}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl text-foreground font-light leading-tight">
            {album.title}
          </h1>

          <p className="text-gray-300 font-light leading-relaxed text-sm sm:text-base md:text-lg">
            {album.description || 'Welcome to our client showcase gallery. Experience the moments frame-by-frame.'}
          </p>
          <div className="h-[1px] w-20 bg-accent/45 mt-2" />
        </div>

        {/* Gallery Grid */}
        {album.photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {album.photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                onClick={() => openLightbox(index)}
                className="relative h-[300px] sm:h-[350px] md:h-[400px] rounded-2xl overflow-hidden border border-border/5 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 group portfolio-grid-card"
              >
                <Image
                  src={photo.image_url}
                  alt={`${album.title} - shot ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-102"
                  sizes="(max-w-768px) 100vw, 33vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="px-5 py-2 rounded-full glass border border-border/10 text-xs uppercase tracking-widest text-foreground font-semibold">
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
