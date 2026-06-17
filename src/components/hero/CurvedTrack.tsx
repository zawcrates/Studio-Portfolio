import React from 'react';

interface CurvedTrackProps {
  children: React.ReactNode;
}

export function CurvedTrack({ children }: CurvedTrackProps) {
  return (
    <div
      className="relative w-full h-screen bg-[#FFFFFF] overflow-hidden select-none"
      style={{
        perspective: '1200px',
        perspectiveOrigin: '50% 50%',
      }}
    >
      {/* 3D Preserving container for rendering children (HeroPanels) */}
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>

      {/* ── Mobile-Only Top Curved Ellipse Overlay ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-[150%] bg-[#FFFFFF] z-20
                   block sm:hidden
                   top-[-20%] w-[200%] h-[68%]
                   border-b border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
      />

      {/* ── Mobile-Only Bottom Curved Ellipse Overlay ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-[150%] bg-[#FFFFFF] z-20
                   block sm:hidden
                   bottom-[-45%] w-[200%] h-[68%]
                   border-t border-[#E5E7EB] shadow-[0_-4px_20px_rgba(0,0,0,0.01)]"
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
                   border-b border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
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
                   border-t border-[#E5E7EB] shadow-[0_-4px_20px_rgba(0,0,0,0.01)]"
      />
    </div>
  );
}
