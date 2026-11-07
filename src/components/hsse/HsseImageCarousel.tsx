"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const HSSE_SLIDES = [
  {
    src: "/images/hsse.webp",
    alt: "Offshore marine and safety operations",
  },
  {
    src: "/images/hsse-2.webp",
    alt: "Marine technical logistics vessel",
  },
  {
    src: "/images/hsse-3.webp",
    alt: "Pipeline infrastructure and mechanical maintenance",
  },
];

export function HsseImageCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HSSE_SLIDES.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden shadow-sm border border-[#E4EDF2] bg-[#101E2B] select-none">
      {HSSE_SLIDES.map((slide, index) => {
        const isActive = currentSlide === index;
        return (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={index === 0}
              className="object-cover object-center"
            />
          </div>
        );
      })}
    </div>
  );
}

