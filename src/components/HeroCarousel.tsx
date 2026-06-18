import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeroImage } from '@/lib/mockData';

export default function HeroCarousel({ images = [] }: { images: HeroImage[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // If images are provided, use them; otherwise, default to 7 blank slots
  const items = images && images.length > 0 ? images : Array.from({ length: 7 });
  const itemsCount = items.length;

  // Render 3 copies to support seamless infinite scrolling
  const virtualItems = [...items, ...items, ...items];

  // Scroll to the center copy on mount
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const centerScroll = () => {
        const firstChild = container.children[0] as HTMLElement;
        const itemWidth = firstChild ? firstChild.offsetWidth : 0;
        const gap = 5;
        const loopWidth = itemWidth > 0 ? itemsCount * (itemWidth + gap) : container.scrollWidth / 3;
        const middleOffset = Math.floor(itemsCount / 2);

        if (itemWidth > 0) {
          const targetIndex = itemsCount + middleOffset;
          const computedPadding = parseFloat(window.getComputedStyle(container).paddingLeft) || 0;
          const leftEdge = computedPadding + targetIndex * (itemWidth + gap);
          container.scrollLeft = leftEdge + (itemWidth / 2) - (container.clientWidth / 2);
        } else {
          const estimatedItemWidth = loopWidth / itemsCount;
          container.scrollLeft = loopWidth + (middleOffset * estimatedItemWidth);
        }
      };

      centerScroll();
      const rafId = requestAnimationFrame(centerScroll);
      const timeoutId = setTimeout(centerScroll, 100);
      return () => {
        cancelAnimationFrame(rafId);
        clearTimeout(timeoutId);
      };
    }
  }, [itemsCount]);

  // Handle scroll boundaries to loop infinitely and silently
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const firstChild = container.children[0] as HTMLElement;
    const itemWidth = firstChild ? firstChild.offsetWidth : 0;
    const gap = 5;
    const loopWidth = itemWidth > 0 ? itemsCount * (itemWidth + gap) : container.scrollWidth / 3;
    const scrollLeft = container.scrollLeft;

    if (scrollLeft < loopWidth) {
      // Crossed left boundary: jump to the middle copy
      container.scrollLeft = scrollLeft + loopWidth;
    } else if (scrollLeft >= 2 * loopWidth) {
      // Crossed right boundary: jump to the middle copy
      container.scrollLeft = scrollLeft - loopWidth;
    }
  };

  return (
    <section className="w-full bg-background relative flex flex-col pt-8 sm:pt-10 md:pt-12 pb-0 overflow-hidden select-none hero-section">
      {/* Hero Content */}
      <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-4 sm:gap-6 z-30">
        <span className="text-accent tracking-[0.25em] text-[10px] sm:text-xs uppercase font-semibold">
          Stories. Raw. Timeless.
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#070708] font-light leading-tight tracking-wide">
          We Don't Take Photos,<br className="hidden sm:inline" /> We Preserve Moments.
        </h1>
        <p className="max-w-lg sm:max-w-xl text-gray-500 font-light text-xs sm:text-sm md:text-base leading-relaxed">
          Aura Studio captures honest emotions and timeless stories through elegant, cinematic imagery.
        </p>
        <div className="mt-2 sm:mt-4">
          <Link
            href="/contact"
            className="px-6 py-3 sm:px-8 sm:py-3.5 rounded-full border border-accent text-accent hover:bg-accent hover:text-black transition-all duration-300 text-[10px] sm:text-xs uppercase tracking-widest font-semibold inline-block"
          >
            Book a Session
          </Link>
        </div>
      </div>

      {/* Carousel & Arch Composition */}
      {/* Hero ↔ Carousel spacing controls */}
<div className="carousel-wrapper w-full relative z-10 hero-track-container overflow-hidden">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="absolute inset-0 flex items-start gap-[5px] overflow-x-auto px-[10vw] sm:px-[5vw] md:px-[5vw] snap-x snap-mandatory translate-y-0 sm:translate-y-0 md:translate-y-0 lg:translate-y-0 z-10 hero-scroll-container"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {virtualItems.map((item, idx) => {
            const isPlaceholder = !item || typeof item !== 'object' || !('image_url' in item);
            return (
              <div
                key={idx}
                className="flex-shrink-0 w-[312px] sm:w-[384px] md:w-[380px] lg:w-[456px] h-[42vh] sm:h-[58vh] md:h-[60vh] lg:h-[72vh] 
                           bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg sm:rounded-xl md:rounded-2xl 
                           shadow-sm flex items-center justify-center
                           snap-center relative overflow-hidden hero-carousel-card"
              >
                {!isPlaceholder ? (
                  <Image
                    src={(item as HeroImage).image_url}
                    alt={(item as HeroImage).alt_text || 'Hero Image'}
                    fill
                    sizes="(max-width: 640px) 312px, (max-width: 768px) 384px, (max-width: 1024px) 380px, 456px"
                    className="object-cover"
                    priority={idx === itemsCount + Math.floor(itemsCount / 2)}
                  />
                ) : (
                  <span className="text-gray-400 text-xs font-mono">Slot {(idx % itemsCount) + 1}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Mobile-Only Top Curved Ellipse Overlay ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-[150%] bg-[#FFFFFF] z-20
                     block sm:hidden
                     top-[-20%] w-[200%] h-[68%]
                     border-b border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.01)]
                     hero-arch-top"
        />

        {/* ── Mobile-Only Bottom Curved Ellipse Overlay ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-[150%] bg-[#FFFFFF] z-20
                     block sm:hidden
                     bottom-[-45%] w-[200%] h-[68%]
                     border-t border-[#E5E7EB] shadow-[0_-4px_20px_rgba(0,0,0,0.01)]
                     hero-arch-bottom"
        />

        {/* ── Tablet/Desktop Top Curved Ellipse Overlay ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-[50%] bg-[#FFFFFF] z-20
                     hidden sm:block
                     sm:top-[-30%] sm:w-[200%] sm:h-[72%]
                     md:top-[-35%] md:w-[170%] md:h-[76%]
                     lg:top-[-46%] lg:w-[160%] lg:h-[84%]
                     xl:top-[-48%] xl:w-[140%] xl:h-[92%]
                     border-b border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.01)]
                     hero-arch-top"
        />

        {/* ── Tablet/Desktop Bottom Curved Ellipse Overlay ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-[50%] bg-[#FFFFFF] z-20
                     hidden sm:block
                     sm:bottom-[-48%] sm:w-[200%] sm:h-[72%]
                     md:bottom-[-52%] md:w-[170%] md:h-[76%]
                     lg:bottom-[-72%] lg:w-[160%] lg:h-[84%]
                     xl:bottom-[-78%] xl:w-[140%] xl:h-[92%]
                     border-t border-[#E5E7EB] shadow-[0_-4px_20px_rgba(0,0,0,0.01)]
                     hero-arch-bottom"
        />
      </div>
    </section>
  );
}
