import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
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
    <div className="w-full bg-[#FFFFFF] relative">
      <CurvedTrack>
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="absolute inset-0 flex items-center gap-[5px] overflow-x-auto px-[10vw] sm:px-[5vw] md:px-[5vw] snap-x snap-mandatory translate-y-[90px] sm:translate-y-[90px] md:translate-y-[70px] lg:translate-y-[110px]"
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
                           snap-center relative overflow-hidden"
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
      </CurvedTrack>
    </div>
  );
}
