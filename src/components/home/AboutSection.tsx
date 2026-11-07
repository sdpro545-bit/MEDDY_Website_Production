"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteContent } from "@/content/siteContent";
import { CountUpNumber } from "@/components/common/CountUpNumber";
import { ArrowRight, Wrench, PackageCheck } from "lucide-react";

const ABOUT_SLIDES = [
  {
    src: "/images/about.webp",
    alt: "Nigerian engineering specialists inspecting rotating turbine machinery with diagnostic tablet",
    tag: "Verified Operations",
    caption: "Active field deployment and maintenance infrastructure across industrial operations.",
  },
  {
    src: "/images/about-2.webp",
    alt: "Nigerian maintenance technician in branded workwear inspecting high-pressure manifold valves",
    tag: "Plant Maintenance",
    caption: "Precision mechanical overhaul, torque verification, and rotating equipment diagnostics.",
  },
  {
    src: "/images/about-3.webp",
    alt: "Nigerian engineering personnel in branded safety coveralls deployed to industrial plant site",
    tag: "Technical Staffing",
    caption: "Certified engineering specialists deployed for onshore and offshore facility support.",
  },
  {
    src: "/images/about-4.webp",
    alt: "Precision mechanical servicing and alignment on industrial pumps and drives",
    tag: "EPICM & Field Support",
    caption: "Full lifecycle engineering execution from pre-commissioning through maintenance.",
  },
];

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-switching multi-image state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % ABOUT_SLIDES.length);
  }, []);

  // Auto-switch timer with pause on hover (2s delay)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 2000);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Silky dissolve handoff from hero zoom
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let ticking = false;

    const handleScroll = () => {
      if (!sectionRef.current || !containerRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;

      // Entrance window: when section top is between 100vh and 70vh
      if (rect.top <= vh && rect.top > vh * 0.7) {
        const entranceProgress = (vh - rect.top) / (vh * 0.3);
        const p = Math.max(0, Math.min(1, entranceProgress));
        const blur = (1 - p) * 10;
        containerRef.current.style.opacity = p.toFixed(3);
        containerRef.current.style.filter = `blur(${blur.toFixed(1)}px)`;
      } else if (rect.top <= vh * 0.7) {
        containerRef.current.style.opacity = "1";
        containerRef.current.style.filter = "blur(0px)";
      } else {
        containerRef.current.style.opacity = "0";
        containerRef.current.style.filter = "blur(10px)";
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-28 bg-white text-[#20262B] relative z-10"
      aria-label="About MEDDY Global Solutions"
    >
      <div
        ref={containerRef}
        className="max-w-7xl mx-auto px-6 transition-all duration-150 ease-out"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column (about 48-52% width) */}
          <div className="md:col-span-7 lg:col-span-6 space-y-7">
            <div className="space-y-3">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#64727C] block">
                {siteContent.about.eyebrow}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-[#20262B] leading-[1.18] tracking-tight">
                {siteContent.about.heading}
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#64727C] leading-relaxed max-w-xl">
              {siteContent.about.paragraph}
            </p>

            <div className="pt-1">
              <Link
                href={siteContent.about.cta.href}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#0EA5E0] hover:bg-[#087FB5] text-white font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]"
              >
                <span>{siteContent.about.cta.label}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Lower Area: Two Soft-Toned Feature Cards (Appendix D) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {siteContent.about.cards.map((card, i) => {
                const IconComponent = i === 0 ? Wrench : PackageCheck;
                return (
                  <div
                    key={card.title}
                    className="p-5 rounded-[20px] bg-[#F5FAFC] border border-[#E4EDF2] flex flex-col justify-between space-y-4 hover:border-[#0EA5E0]/40 transition-colors duration-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-[#0EA5E0] border border-[#E4EDF2]">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#20262B] text-sm mb-1">
                        {card.title}
                      </h3>
                      <p className="text-xs text-[#64727C] leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#E4EDF2]">
              <div>
                <span className="text-2xl font-bold text-[#20262B] block">
                  <CountUpNumber end={15} />
                </span>
                <span className="text-[11px] font-semibold text-[#64727C] uppercase tracking-wider">Services</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-[#0CA3DC] block">
                  <CountUpNumber end={100} suffix="%" />
                </span>
                <span className="text-[11px] font-semibold text-[#64727C] uppercase tracking-wider">Compliance</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-[#20262B] block">
                  <CountUpNumber end={0} />
                </span>
                <span className="text-[11px] font-semibold text-[#64727C] uppercase tracking-wider">Incidents</span>
              </div>
            </div>
          </div>

          {/* Right Column: Multi-Image Auto-Switching Showcase (Phase 2 dynamic animation) */}
          <div className="md:col-span-5 lg:col-span-6 flex justify-center">
            <div
              className="group relative w-full max-w-[460px] aspect-[4/5] rounded-[24px] overflow-hidden shadow-xl border border-[#E4EDF2]/80 bg-[#1A2026] select-none"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              aria-label="MEDDY Global Solutions Operations Image Gallery"
            >
              {/* Stack of Rotating Images */}
              {ABOUT_SLIDES.map((slide, index) => {
                const isActive = index === currentSlide;
                return (
                  <div
                    key={slide.src}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 460px"
                      priority={index === 0}
                      className={`object-cover transition-transform duration-7000 ease-out ${
                        isActive ? "scale-105" : "scale-100"
                      }`}
                    />
                  </div>
                );
              })}

              {/* Gradient Vignette for Text Contrast */}
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

              {/* Lower Text Content: Dynamic Caption */}
              <div className="absolute bottom-6 left-6 right-6 z-30 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-white text-xs shadow-lg transition-all duration-500">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-[#0CA3DC] uppercase tracking-wider text-[11px]">
                    {ABOUT_SLIDES[currentSlide].tag}
                  </span>
                  <span className="text-[10px] text-white/50 font-mono">
                    0{currentSlide + 1} / 0{ABOUT_SLIDES.length}
                  </span>
                </div>
                <p className="text-white/90 leading-relaxed text-[11px] sm:text-xs">
                  {ABOUT_SLIDES[currentSlide].caption}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
