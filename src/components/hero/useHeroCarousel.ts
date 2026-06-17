import React, { useState, useEffect, useRef, useCallback } from 'react';

interface UseHeroCarouselProps {
  imagesCount: number;
  autoplayDelay?: number;
}

export function useHeroCarousel({ imagesCount, autoplayDelay = 5000 }: UseHeroCarouselProps) {
  const [centerIndex, setCenterIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveredRef = useRef(false);

  const stopAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  const triggerAnimationLock = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 600); // Throttles animations for 0.6 seconds (600ms matching Framer Motion transition duration)
  }, []);

  const startAutoplay = useCallback(() => {
    if (imagesCount <= 1 || isHoveredRef.current) return;
    stopAutoplay();
    autoplayTimerRef.current = setInterval(() => {
      setCenterIndex((prev) => prev + 1);
      triggerAnimationLock();
    }, autoplayDelay);
  }, [imagesCount, autoplayDelay, stopAutoplay, triggerAnimationLock]);

  const handleNext = useCallback(() => {
    if (isAnimating || imagesCount <= 1) return;
    setCenterIndex((prev) => prev + 1);
    triggerAnimationLock();
  }, [isAnimating, imagesCount, triggerAnimationLock]);

  const handlePrev = useCallback(() => {
    if (isAnimating || imagesCount <= 1) return;
    setCenterIndex((prev) => prev - 1);
    triggerAnimationLock();
  }, [isAnimating, imagesCount, triggerAnimationLock]);

  const handleSetIndex = useCallback((index: number) => {
    if (isAnimating || imagesCount <= 1 || index < 0 || index >= imagesCount) return;
    
    // Find the nearest virtual index congruent to 'index' modulo 'imagesCount'
    const currentVirtual = centerIndex;
    const currentRem = ((currentVirtual % imagesCount) + imagesCount) % imagesCount;
    let diff = index - currentRem;
    
    if (diff > imagesCount / 2) {
      diff -= imagesCount;
    } else if (diff < -imagesCount / 2) {
      diff += imagesCount;
    }
    
    setCenterIndex(currentVirtual + diff);
    triggerAnimationLock();
  }, [isAnimating, centerIndex, imagesCount, triggerAnimationLock]);

  // Pause on hover
  const onMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
    stopAutoplay();
  }, [stopAutoplay]);

  const onMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    startAutoplay();
  }, [startAutoplay]);

  // Touch Swipe handlers for mobile
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  }, [handleNext, handlePrev]);

  // Handle autoplay reset on index changes/mounts
  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay, centerIndex]);

  return {
    centerIndex,
    isAnimating,
    next: handleNext,
    prev: handlePrev,
    setIndex: handleSetIndex,
    hoverProps: {
      onMouseEnter,
      onMouseLeave,
    },
    touchHandlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  };
}
