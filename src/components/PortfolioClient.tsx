'use strict';

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';
import { Album } from '@/lib/mockData';
import { useSearchParams, useRouter } from 'next/navigation';

const CATEGORIES = [
  { id: 'all', name: 'All Galleries' },
  { id: 'weddings', name: 'Weddings' },
  { id: 'pre-weddings', name: 'Pre-Weddings' },
  { id: 'engagements', name: 'Engagements' },
  { id: 'maternity', name: 'Maternity' },
  { id: 'events', name: 'Events' },
  { id: 'corporate', name: 'Corporate' },
];

interface PortfolioClientProps {
  albums: Album[];
  initialCategory: string;
}

export default function PortfolioClient({ albums, initialCategory }: PortfolioClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');

  // Sync state with URL parameter if it changes
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory('all');
    }
  }, [searchParams]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      router.push('/portfolio', { scroll: false });
    } else {
      router.push(`/portfolio?category=${categoryId}`, { scroll: false });
    }
  };

  const filteredAlbums = selectedCategory === 'all'
    ? albums
    : albums.filter(album => album.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="w-full min-h-screen pt-32 pb-24 bg-background page-container">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Title Header */}
        <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-16">
          <span className="text-accent tracking-[0.3em] text-xs uppercase font-semibold">
            Portraits & Memories
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-foreground font-light">
            Portfolio Galleries
          </h1>
          <p className="text-gray-400 font-light leading-relaxed text-sm sm:text-base mt-2">
            Browse through our cinematic photography chapters. Each album represents a unique story of love, joy, or brand identity.
          </p>
          <div className="h-[1px] w-20 bg-accent/45 mx-auto mt-2" />
        </div>

        {/* Categories Tab Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-12 border-b border-border/5 pb-6">
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`relative px-5 py-2.5 rounded-full text-xs uppercase tracking-widest transition-all duration-300 font-medium ${
                  isActive
                    ? 'text-white bg-accent font-semibold shadow-md shadow-gold/15'
                    : 'text-[#414538]/70 hover:text-accent hover:bg-black/[0.03]'
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Albums Grid */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {filteredAlbums.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 gap-6 md:gap-8"
              >
                {filteredAlbums.map((album) => (
                  <Link
                    href={`/portfolio/${album.slug}`}
                    key={album.id}
                    className="block focus:outline-none"
                  >
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.6 }}
                      className="group relative w-full aspect-video rounded-none overflow-hidden border border-border/5 flex flex-col justify-end p-6 sm:p-10 md:p-12 lg:p-16 shadow-2xl portfolio-grid-card cursor-pointer"
                    >
                      {/* Cover Photo */}
                      <Image
                        src={album.cover_image}
                        alt={album.title}
                        fill
                        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-103"
                        sizes="100vw"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/90 via-black/40 to-transparent transition-opacity duration-300" />
                      <div className="absolute inset-0 border border-transparent group-hover:border-accent/35 rounded-none transition-all duration-700 m-2 sm:m-3 pointer-events-none" />

                      {/* Information */}
                      <div className="relative z-10 flex flex-col gap-2.5 w-full max-w-xl text-left transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl text-white font-light leading-tight">
                          {album.title}
                        </h2>
                        <div className="h-[1px] w-full max-w-sm bg-white/20 my-1" />
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#d4af37] uppercase tracking-widest group-hover:text-white transition-colors duration-300">
                          <span>View Gallery</span>
                          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 flex flex-col items-center justify-center gap-4 text-gray-500"
              >
                <ImageIcon className="w-12 h-12 text-gray-600 stroke-1" />
                <p className="text-base font-light font-serif">No albums found in this category.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
