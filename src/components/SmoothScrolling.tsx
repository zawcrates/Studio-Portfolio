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

  // Scroll to top and manage ScrollTrigger on route change
  useEffect(() => {
    // Log active ScrollTriggers for debugging
    console.log("Active ScrollTriggers:", ScrollTrigger.getAll().length);

    // Refresh ScrollTriggers after layout paint
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    if (isAdminPage || !lenis) return;

    // Immediately reset scroll position to prevent old page scroll states from carrying over
    lenis.scrollTo(0, { immediate: true });
  }, [pathname, lenis, isAdminPage]);

  // Refresh ScrollTriggers after all images have loaded to handle layout shifts
  useEffect(() => {
    const handleLoad = () => {
      ScrollTrigger.refresh();
      console.log('ScrollTrigger refreshed after images load');
    };
    window.addEventListener('load', handleLoad);
    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  // Ensure any critical sections start visible to avoid hidden state leakage
  // This is a defensive pattern; actual refs should replace 'sectionRef' with specific element refs
  // gsap.set(sectionRef.current, { autoAlpha: 1 });

  useEffect(() => {
    if (isAdminPage || !lenis) return;

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
