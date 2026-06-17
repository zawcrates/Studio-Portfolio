import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

export type HeroImage = {
  id: string;
  image_url: string;
  title?: string;
  subtitle?: string;
  alt_text?: string;
};

export interface PanelStyleConfig {
  left: string;
  width: string;
  height: string;
  rotateY: number;
  scale: number;
  zIndex: number;
  opacity: number;
}

interface HeroPanelProps {
  image: HeroImage;
  styleConfig: PanelStyleConfig;
  isActive: boolean;
}

export function HeroPanel({ image, styleConfig, isActive }: HeroPanelProps) {
  const shouldReduceMotion = useReducedMotion();

  // Simplify transitions if user prefers reduced motion
  const animateConfig = shouldReduceMotion
    ? {
        left: styleConfig.left,
        width: styleConfig.width,
        height: styleConfig.height,
        scale: isActive ? 1.0 : 0.95,
        opacity: styleConfig.opacity,
        rotateY: 0,
      }
    : {
        left: styleConfig.left,
        width: styleConfig.width,
        height: styleConfig.height,
        scale: styleConfig.scale,
        rotateY: styleConfig.rotateY,
        opacity: styleConfig.opacity,
      };

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: '50%',
        y: '-50%',
        transformStyle: 'preserve-3d',
        zIndex: styleConfig.zIndex,
      }}
      initial={{ opacity: 0 }}
      animate={animateConfig}
      transition={{
        duration: 0.6,
        ease: 'easeInOut',
      }}
      className="overflow-hidden bg-white"
    >
      <div className="relative w-full h-full select-none pointer-events-none">
        <Image
          src={image.image_url}
          alt={image.alt_text || image.title || 'Photography Portfolio Shot'}
          fill
          priority={isActive}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
        
        {/* Elegant overlay to enhance text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-60" />

        {/* Text Details visible on the Active (Center) Panel */}
        {isActive && (image.title || image.subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4, ease: 'easeOut' }}
            className="absolute bottom-8 left-8 right-8 z-10 pointer-events-auto text-left"
          >
            {image.subtitle && (
              <p className="text-[#C6A969] text-xs uppercase tracking-[0.25em] font-semibold mb-1">
                {image.subtitle}
              </p>
            )}
            {image.title && (
              <h3 className="text-white font-serif text-2xl sm:text-3xl font-light tracking-wide leading-tight drop-shadow-sm">
                {image.title}
              </h3>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
