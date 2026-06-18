import React from 'react';

interface CurvedTrackProps {
  children: React.ReactNode;
}

export function CurvedTrack({ children }: CurvedTrackProps) {
  return (
    <div className="relative w-full h-screen bg-[var(--background)] overflow-hidden select-none hero-track-container">
      {children}

      {/* ── Mobile-Only Top Curved Ellipse Overlay ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-[150%] bg-[var(--background)] z-20
                   block sm:hidden
                   top-[-40%] w-[200%] h-[68%]
                   border-b border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.01)]
                   hero-arch-top"
      />

      {/* ── Mobile-Only Bottom Curved Ellipse Overlay ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-[150%] bg-[var(--background)] z-20
                   block sm:hidden
                   bottom-[-45%] w-[200%] h-[68%]
                   border-t border-[#E5E7EB] shadow-[0_-4px_20px_rgba(0,0,0,0.01)]
                   hero-arch-bottom"
      />

      {/* ── Tablet/Desktop Top Curved Ellipse Overlay ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-[50%] bg-[var(--background)] z-20
                   hidden sm:block
                   sm:top-[-50%] sm:w-[200%] sm:h-[72%]
                   md:top-[-55%] md:w-[170%] md:h-[76%]
                   lg:top-[-56%] lg:w-[160%] lg:h-[84%]
                   xl:top-[-70%] xl:w-[140%] xl:h-[92%]
                   border-b border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.01)]
                   hero-arch-top"
      />

      {/* ── Tablet/Desktop Bottom Curved Ellipse Overlay ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-[50%] bg-[var(--background)] z-20
                   hidden sm:block
                   sm:bottom-[-48%] sm:w-[200%] sm:h-[72%]
                   md:bottom-[-52%] md:w-[170%] md:h-[76%]
                   lg:bottom-[-72%] lg:w-[160%] lg:h-[84%]
                   xl:bottom-[-78%] xl:w-[140%] xl:h-[92%]
                   border-t border-[#E5E7EB] shadow-[0_-4px_20px_rgba(0,0,0,0.01)]
                   hero-arch-bottom"
      />
    </div>
  );
}
