"use client";

import React, { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import "lenis/dist/lenis.css";

// Register ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  const lenis = useLenis();
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  // Scroll to top and refresh ScrollTriggers on route change
  useEffect(() => {
    if (!lenis || isAdminPage) return;

    // Immediately reset scroll position to prevent old page scroll states from carrying over
    lenis.scrollTo(0, { immediate: true });

    // Refresh ScrollTrigger to recalculate positions for the new page layout
    ScrollTrigger.refresh();
  }, [pathname, lenis, isAdminPage]);

  useEffect(() => {
    if (!lenis || isAdminPage) return;

    // Sync Lenis scroll events with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Bind Lenis scroll ticking to GSAP's ticker loop
    const update = (time: number) => {
      lenis.raf(time * 1000); // GSAP's ticker uses seconds, Lenis expects milliseconds
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0); // Prevents sudden jumps on frame drops

    return () => {
      gsap.ticker.remove(update);
    };
  }, [lenis, isAdminPage]);

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root autoRaf={false}>
      {children}
    </ReactLenis>
  );
}
