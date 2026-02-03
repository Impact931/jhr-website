"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeAlt?: string;
  afterAlt?: string;
  caption?: string;
  aspectRatio?: "video" | "square" | "portrait";
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  beforeAlt = "Before image",
  afterAlt = "After image",
  caption,
  aspectRatio = "video",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(5, Math.min(95, percentage)));
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div
        ref={containerRef}
        className={`relative ${aspectClasses[aspectRatio]} rounded-xl overflow-hidden cursor-ew-resize select-none border border-jhr-black-lighter`}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* After Image (Full width, underneath) */}
        <div className="absolute inset-0">
          <Image
            src={afterImage}
            alt={afterAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
          />
          {/* After badge */}
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-jhr-gold text-jhr-black rounded text-xs font-display uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 bg-jhr-black rounded-full" />
            {afterLabel}
          </div>
        </div>

        {/* Before Image (Clipped by slider position) */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <Image
            src={beforeImage}
            alt={beforeAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
          />
          {/* Before badge */}
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-jhr-black-lighter text-jhr-white rounded text-xs font-display uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 bg-jhr-white-dim rounded-full" />
            {beforeLabel}
          </div>
        </div>

        {/* Slider Handle */}
        <motion.div
          className="absolute top-0 bottom-0 w-1 bg-jhr-gold cursor-ew-resize z-20"
          style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Handle Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-jhr-gold border-4 border-white shadow-lg flex items-center justify-center glow-gold-strong">
            <div className="flex gap-1">
              <div className="w-0.5 h-4 bg-jhr-black rounded" />
              <div className="w-0.5 h-4 bg-jhr-black rounded" />
            </div>
          </div>

          {/* Vertical Line Glow */}
          <div className="absolute inset-0 w-1 bg-jhr-gold glow-gold-strong" />
        </motion.div>

        {/* Bottom corner labels */}
        <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-jhr-black/80 backdrop-blur-sm rounded text-xs font-display uppercase tracking-wider text-jhr-white">
          Before
        </div>
        <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-jhr-gold/90 backdrop-blur-sm rounded text-xs font-display uppercase tracking-wider text-jhr-black">
          After
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isDragging ? 0 : 1 }}
          className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 glass rounded-full text-xs text-jhr-white/80"
        >
          ← Drag to compare →
        </motion.div>
      </div>

      {/* Caption */}
      {caption && (
        <p className="text-center text-jhr-white-dim mt-6 text-body-sm">
          {caption}
        </p>
      )}
    </div>
  );
}
