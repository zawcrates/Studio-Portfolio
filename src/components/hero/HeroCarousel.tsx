import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CurvedTrack } from './CurvedTrack';

export type HeroImage = {
  id: string;
  image_url: string;
  title?: string;
  subtitle?: string;
  alt_text?: string;
};

interface HeroCarouselProps {
  images: HeroImage[];
}

export default function HeroCarousel({ images = [] }: HeroCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isWarpingRef = useRef(false);
  const isInteractingRef = useRef(false);

  // If images are provided, use them; otherwise, default to 7 blank slots
  const items = images && images.length > 0 ? images : Array.from({ length: 7 });
  const itemsCount = items.length;

  // Render 5 copies to support seamless infinite scrolling
  const virtualItems = [...items, ...items, ...items, ...items, ...items];

  // Scroll to the center copy on mount
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const centerScroll = () => {
        const firstChild = container.children[0] as HTMLElement;
        const itemWidth = firstChild ? firstChild.offsetWidth : 0;
        const gap = 5;
        const loopWidth = itemWidth > 0 ? itemsCount * (itemWidth + gap) : container.scrollWidth / 5;
        const middleOffset = Math.floor(itemsCount / 2);

        if (itemWidth > 0) {
          const targetIndex = 2 * itemsCount + middleOffset;
          const computedPadding = parseFloat(window.getComputedStyle(container).paddingLeft) || 0;
          const leftEdge = computedPadding + targetIndex * (itemWidth + gap);
          container.scrollLeft = leftEdge + (itemWidth / 2) - (container.clientWidth / 2);
        } else {
          const estimatedItemWidth = loopWidth / itemsCount;
          container.scrollLeft = 2 * loopWidth + (middleOffset * estimatedItemWidth);
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

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Handle scroll boundaries to loop infinitely and silently
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || isWarpingRef.current) return;

    const firstChild = container.children[0] as HTMLElement;
    const itemWidth = firstChild ? firstChild.offsetWidth : 0;
    const gap = 5;
    const loopWidth = itemWidth > 0 ? itemsCount * (itemWidth + gap) : container.scrollWidth / 5;
    const scrollLeft = container.scrollLeft;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Danger zone boundary check: if user scrolls too close to the absolute ends of the 5x loop,
    // we warp them immediately to keep them in the scrollable range.
    const dangerZoneLeft = 0.5 * loopWidth;
    const dangerZoneRight = 4.5 * loopWidth;

    if (scrollLeft < dangerZoneLeft) {
      isWarpingRef.current = true;
      container.style.scrollSnapType = 'none';
      container.scrollLeft = scrollLeft + 2 * loopWidth;
      requestAnimationFrame(() => {
        container.style.scrollSnapType = 'x mandatory';
        requestAnimationFrame(() => {
          isWarpingRef.current = false;
        });
      });
      return;
    } else if (scrollLeft >= dangerZoneRight) {
      isWarpingRef.current = true;
      container.style.scrollSnapType = 'none';
      container.scrollLeft = scrollLeft - 2 * loopWidth;
      requestAnimationFrame(() => {
        container.style.scrollSnapType = 'x mandatory';
        requestAnimationFrame(() => {
          isWarpingRef.current = false;
        });
      });
      return;
    }

    // Under normal scrolling (including fast momentum/drag), we do not warp immediately.
    // Instead, we wait until the user stops scrolling (idle) and is not touching the screen.
    scrollTimeoutRef.current = setTimeout(() => {
      if (isInteractingRef.current) {
        // Postpone warping if the user is actively dragging/touching
        return;
      }

      const currentCopyIndex = Math.floor(scrollLeft / loopWidth);
      if (currentCopyIndex !== 2) {
        const diff = 2 - currentCopyIndex;
        isWarpingRef.current = true;
        container.style.scrollSnapType = 'none';
        container.scrollLeft = scrollLeft + diff * loopWidth;
        requestAnimationFrame(() => {
          container.style.scrollSnapType = 'x mandatory';
          requestAnimationFrame(() => {
            isWarpingRef.current = false;
          });
        });
      }
    }, 150);
  };

  return (
    <section className="w-full bg-[var(--background)] relative flex flex-col pt-8 sm:pt-10 md:pt-12 pb-0 lg:pb-6 xl:pb-20 overflow-hidden select-none hero-section min-h-screen">

      {/* Center Tagline */}
      <div className="absolute top-[245px] sm:top-[305px] lg:top-[300px] xl:top-[280px] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-30 pointer-events-none flex flex-col items-center gap-3 sm:gap-4 px-6 w-full max-w-4xl">
        <h1 className="font-serif italic text-4xl sm:text-6xl lg:text-7xl xl:text-7xl font-light text-foreground leading-tight tracking-tight">
          Handcrafted stories, <br /> told in colors.
        </h1>
        <div className="h-[1px] w-12 sm:w-16 lg:w-20 xl:w-24 bg-accent/40 my-1" />
        <p className="font-sans text-[9px] sm:text-xs tracking-[0.3em] uppercase text-foreground/60 font-semibold mb-2">
          fine art photography & cinematic films
        </p>
        <Link
          href="/portfolio"
          className="pointer-events-auto group relative inline-flex items-center gap-2.5 py-1.5 text-foreground text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold select-none mt-2 transition-all duration-300"
        >
          <span>explore portfolio</span>
          <span className="text-[12px] sm:text-sm transform group-hover:translate-x-1.5 transition-transform duration-300 ease-out">
            →
          </span>
          <span className="absolute bottom-0 left-0 w-full h-[1px] bg-foreground/20 scale-x-100 group-hover:scale-x-0 group-hover:origin-right origin-left transition-transform duration-350 ease-in-out" />
          <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent scale-x-0 group-hover:scale-x-100 group-hover:origin-left origin-right transition-transform duration-350 ease-in-out delay-75" />
        </Link>
      </div>

      {/* Carousel & Arch Composition */}
      <div className="w-full relative mt-44 sm:mt-80 lg:mt-70 xl:mt-[320px] z-10">
        <CurvedTrack>
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            onTouchStart={() => { isInteractingRef.current = true; }}
            onTouchEnd={() => {
              isInteractingRef.current = false;
              handleScroll();
            }}
            onTouchCancel={() => {
              isInteractingRef.current = false;
              handleScroll();
            }}
            onMouseDown={() => { isInteractingRef.current = true; }}
            onMouseUp={() => {
              isInteractingRef.current = false;
              handleScroll();
            }}
            onMouseLeave={() => {
              isInteractingRef.current = false;
              handleScroll();
            }}
            className="absolute inset-0 flex items-center gap-[5px] overflow-x-auto overflow-y-hidden px-[10vw] sm:px-[5vw] md:px-[5vw] snap-x snap-mandatory z-10 hero-scroll-container no-scrollbar"
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
                  className="flex-shrink-0 w-[312px] sm:w-[384px] md:w-[380px] lg:w-[456px] h-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg sm:rounded-xl md:rounded-2xl shadow-sm flex items-center justify-center snap-center relative overflow-hidden hero-carousel-card"
                >
                  {!isPlaceholder ? (
                    <Image
                      src={(item as HeroImage).image_url}
                      alt={(item as HeroImage).alt_text || 'Hero Image'}
                      fill
                      sizes="(max-width: 640px) 312px, (max-width: 768px) 384px, (max-width: 1024px) 380px, 456px"
                      className="object-cover"
                      priority={idx === 2 * itemsCount + Math.floor(itemsCount / 2)}
                    />
                  ) : (
                    <span className="text-gray-400 text-xs font-mono">Slot {(idx % itemsCount) + 1}</span>
                  )}
                </div>
              );
            })}
          </div>
        </CurvedTrack>
      </div>
    </section>
  );
}
