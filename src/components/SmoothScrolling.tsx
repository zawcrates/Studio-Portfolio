"use client";

import React, { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

// Register ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

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
  }, [lenis]);

  return (
    <ReactLenis root autoRaf={false}>
      {children}
    </ReactLenis>
  );
}
