import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  isAnimating: boolean;
}

export function HeroNavigation({ onPrev, onNext, isAnimating }: HeroNavigationProps) {
  return (
    <div className="absolute inset-y-0 left-0 right-0 z-30 pointer-events-none hidden md:flex items-center justify-between px-6 lg:px-12">
      {/* Left Arrow Button */}
      <button
        onClick={onPrev}
        disabled={isAnimating}
        aria-label="Previous Slide"
        className="pointer-events-auto w-12 h-12 rounded-full border border-[#E5E7EB] bg-white text-[#111111] 
                   hover:text-[#C6A969] hover:border-[#C6A969] hover:scale-105 shadow-md flex items-center justify-center 
                   transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C6A969]/50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Right Arrow Button */}
      <button
        onClick={onNext}
        disabled={isAnimating}
        aria-label="Next Slide"
        className="pointer-events-auto w-12 h-12 rounded-full border border-[#E5E7EB] bg-white text-[#111111] 
                   hover:text-[#C6A969] hover:border-[#C6A969] hover:scale-105 shadow-md flex items-center justify-center 
                   transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C6A969]/50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
