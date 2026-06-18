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
                    ? 'text-black bg-accent font-semibold shadow-md shadow-gold/15'
                    : 'text-gray-400 hover:text-foreground hover:bg-background/[0.03]'
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
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredAlbums.map((album) => (
                  <motion.div
                    layout
                    key={album.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="group relative h-[420px] rounded-2xl overflow-hidden border border-border/5 flex flex-col justify-end p-6 shadow-xl portfolio-grid-card"
                  >
                    {/* Cover Photo */}
                    <Image
                      src={album.cover_image}
                      alt={album.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-w-768px) 100vw, 33vw"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                    <div className="absolute inset-0 border border-transparent group-hover:border-accent/30 rounded-2xl transition-all duration-500 m-3 pointer-events-none" />

                    {/* Information */}
                    <div className="relative z-10 flex flex-col gap-2 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                        {album.category}
                      </span>
                      <h2 className="font-serif text-2xl text-foreground font-light leading-tight">
                        {album.title}
                      </h2>
                      <p className="text-xs text-gray-400 font-light line-clamp-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {album.description || 'Open gallery to view all photos and details.'}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <Link
                          href={`/portfolio/${album.slug}`}
                          className="text-xs font-semibold text-accent uppercase tracking-widest flex items-center gap-1.5 hover:text-foreground transition-colors duration-300"
                        >
                          View Gallery <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                          <ImageIcon className="w-3.5 h-3.5" /> {album.photos.length} Photos
                        </span>
                      </div>
                    </div>
                  </motion.div>
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
