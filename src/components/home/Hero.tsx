"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { siteContent } from "@/content/siteContent";
import { ArrowRight, ChevronRight } from "lucide-react";
import { HeroVideoBackground } from "@/components/home/HeroVideoBackground";

// ============================================================================
// CINEMATIC HERO ZOOM CONFIGURATION TOKENS
// Tweak these constants to adjust zoom factor, blur, track distance, and origin.
// ============================================================================
export const HERO_ZOOM_MAX_DESKTOP = 1.55;
export const HERO_ZOOM_MAX_MOBILE = 1.25;
export const HERO_BLUR_MAX_DESKTOP = 10; // px
export const HERO_BLUR_MAX_MOBILE = 4; // px
export const HERO_DARKEN_MAX = 0.85; // opacity of deep navy overlay at p=1
export const HERO_PIN_DISTANCE_DESKTOP_VH = 120; // extra scroll distance in vh
export const HERO_PIN_DISTANCE_MOBILE_VH = 70; // extra scroll distance in vh
export const HERO_TRANSFORM_ORIGIN = "75% 45%"; // tallest tower cluster coordinates
export const HERO_SMOOTH_LAG = 0.12; // smooth scrub lerp factor (~0.6s physical lag)

// Smooth power2.inOut easing curve for scrubbed zoom
function easeInOutPower2(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function Hero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const imageLayerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const [activeDot, setActiveDot] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isIntroRunning, setIsIntroRunning] = useState(false);
  const [isIntroArmed, setIsIntroArmed] = useState(false);

  // Animation values stored in refs for 60fps rAF rendering without React re-renders
  const targetPRef = useRef(0);
  const currentPRef = useRef(0);
  const rAFRef = useRef<number | null>(null);

  // Detect Mobile & Reduced Motion
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    const checkMotion = () => {
      setPrefersReducedMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    };

    checkViewport();
    checkMotion();

    window.addEventListener("resize", checkViewport, { passive: true });
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // Intro load animation (scale 1.12 to 1.0 over 1.6s) triggered after preloader exits
  useEffect(() => {
    if (prefersReducedMotion) {
      setIsIntroRunning(false);
      setIsIntroArmed(true);
      return;
    }

    const startHeroIntro = () => {
      setIsIntroRunning(true);
      setTimeout(() => {
        setIsIntroRunning(false);
        setIsIntroArmed(true);
      }, 1600);
    };

    // If intro was already seen in session, start immediately
    try {
      if (sessionStorage.getItem("meddy_intro_seen")) {
        startHeroIntro();
      }
    } catch {
      startHeroIntro();
    }

    // Listen for preloader exit event
    window.addEventListener("meddy-hero-start", startHeroIntro);

    // Failsafe: arm scroll zoom within 3.5s if no preloader event
    const fallbackArmTimer = setTimeout(() => {
      setIsIntroArmed(true);
    }, 3500);

    return () => {
      window.removeEventListener("meddy-hero-start", startHeroIntro);
      clearTimeout(fallbackArmTimer);
    };
  }, [prefersReducedMotion]);

  // Main 60fps Scrubbed Render Loop (Active on desktop and mobile)
  const renderFrame = useCallback(() => {
    if (prefersReducedMotion || !isIntroArmed) return;

    // Smooth lerp for scrubbed lag (~0.6s smooth momentum)
    const pDiff = targetPRef.current - currentPRef.current;
    if (Math.abs(pDiff) > 0.0005) {
      currentPRef.current += pDiff * HERO_SMOOTH_LAG;
    } else {
      currentPRef.current = targetPRef.current;
    }

    const p = Math.max(0, Math.min(1, currentPRef.current));
    const maxZoom = isMobile ? HERO_ZOOM_MAX_MOBILE : HERO_ZOOM_MAX_DESKTOP;
    const maxBlur = isMobile ? HERO_BLUR_MAX_MOBILE : HERO_BLUR_MAX_DESKTOP;

    // 1. Image / Video Wrapper Zoom
    if (imageLayerRef.current) {
      const easedP = easeInOutPower2(p);
      const currentScale = 1.0 + (maxZoom - 1.0) * easedP;
      imageLayerRef.current.style.transform = `scale(${currentScale.toFixed(4)})`;

      // 2. Depth Blur
      if (p >= 0.35) {
        const blurProgress = (p - 0.35) / 0.65;
        const blurAmount = blurProgress * maxBlur;
        imageLayerRef.current.style.filter = `blur(${blurAmount.toFixed(1)}px)`;
      } else {
        imageLayerRef.current.style.filter = "blur(0px)";
      }

      imageLayerRef.current.style.willChange =
        p > 0.01 && p < 0.99 ? "transform, filter" : "auto";
    }

    // 2b. Navy Darken Overlay (sinks into brand navy up to HERO_DARKEN_MAX)
    if (overlayRef.current) {
      if (p >= 0.35) {
        const darkenProgress = (p - 0.35) / 0.65;
        const opacity = 0.4 + (HERO_DARKEN_MAX - 0.4) * darkenProgress;
        overlayRef.current.style.opacity = opacity.toFixed(3);
      } else {
        overlayRef.current.style.opacity = "0.4";
      }
    }

    // 3. Headline Exit (p = 0 to 0.45)
    const exitProgress = Math.min(1, p / 0.45);
    const exitEase = Math.pow(exitProgress, 1.15);

    if (headlineRef.current) {
      const h1Opacity = Math.max(0, 1 - exitEase);
      const h1Y = -exitEase * 40;
      const h1Scale = 1 - 0.04 * exitEase;
      const h1Blur = exitEase * 6;
      headlineRef.current.style.opacity = h1Opacity.toFixed(3);
      headlineRef.current.style.transform = `translateY(${h1Y.toFixed(1)}px) scale(${h1Scale.toFixed(3)})`;
      headlineRef.current.style.filter = `blur(${h1Blur.toFixed(1)}px)`;
    }

    if (paragraphRef.current) {
      const pExit = Math.min(1, exitProgress * 1.1);
      const pOpacity = Math.max(0, 1 - pExit);
      const pY = -pExit * 35;
      const pBlur = pExit * 5;
      paragraphRef.current.style.opacity = pOpacity.toFixed(3);
      paragraphRef.current.style.transform = `translateY(${pY.toFixed(1)}px)`;
      paragraphRef.current.style.filter = `blur(${pBlur.toFixed(1)}px)`;
    }

    if (buttonsRef.current) {
      const btnExit = Math.min(1, exitProgress * 1.25);
      const btnOpacity = Math.max(0, 1 - btnExit);
      const btnY = -btnExit * 30;
      buttonsRef.current.style.opacity = btnOpacity.toFixed(3);
      buttonsRef.current.style.transform = `translateY(${btnY.toFixed(1)}px)`;
      buttonsRef.current.style.pointerEvents = btnExit > 0.85 ? "none" : "auto";
    }

    // 4. Coverage Strip (Bottom: slides down from p = 0.8 to 1.0)
    if (stripRef.current) {
      if (p >= 0.8) {
        const stripProgress = (p - 0.8) / 0.2;
        const stripY = stripProgress * 100;
        const stripOpacity = Math.max(0, 1 - stripProgress);
        stripRef.current.style.transform = `translateY(${stripY.toFixed(1)}%)`;
        stripRef.current.style.opacity = stripOpacity.toFixed(3);
      } else {
        stripRef.current.style.transform = "translateY(0%)";
        stripRef.current.style.opacity = "1";
      }
    }

    // 5. Side Progress Rail Dots & Fadeout
    if (railRef.current) {
      if (p >= 0.88) {
        const railFade = Math.max(0, 1 - (p - 0.88) / 0.12);
        railRef.current.style.opacity = railFade.toFixed(3);
      } else {
        railRef.current.style.opacity = "1";
      }

      if (p < 0.33) {
        setActiveDot(0);
      } else if (p < 0.66) {
        setActiveDot(1);
      } else {
        setActiveDot(2);
      }
    }

    // Loop until lerp settles
    if (Math.abs(pDiff) > 0.0005 || Math.abs(targetPRef.current - currentPRef.current) > 0.0005) {
      rAFRef.current = requestAnimationFrame(renderFrame);
    } else {
      currentPRef.current = targetPRef.current;
      rAFRef.current = null;
    }
  }, [isMobile, prefersReducedMotion, isIntroArmed]);

  // Scroll Listener calculating progress p
  useEffect(() => {
    if (prefersReducedMotion || !isIntroArmed) return;

    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;

      if (totalScrollable > 0) {
        const progress = Math.max(0, Math.min(1, -rect.top / totalScrollable));
        targetPRef.current = progress;

        // Start rAF render loop if not already running
        if (!rAFRef.current) {
          rAFRef.current = requestAnimationFrame(renderFrame);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    };
  }, [prefersReducedMotion, isIntroArmed, renderFrame]);

  // Track height based on device pinned distance (cinematic scrubbed zoom on both mobile and desktop)
  const isPinnedHero = !prefersReducedMotion;
  const extraVh = isMobile ? HERO_PIN_DISTANCE_MOBILE_VH : HERO_PIN_DISTANCE_DESKTOP_VH;
  const trackHeight = isPinnedHero ? `calc(100vh + ${extraVh}vh)` : "auto";

  return (
    <div
      ref={trackRef}
      className="relative w-full"
      style={{ height: trackHeight }}
    >
      {/* Pinned Sticky Hero Frame with Scrubbed Cinematic Zoom */}
      <section
        className={`${
          isPinnedHero ? "sticky top-0 h-[100dvh]" : "relative"
        } min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden bg-[#06121F] pt-16 md:pt-20 lg:pt-24 select-none`}
        aria-label="Homepage Hero Overview"
      >
        {/* =====================================================================
            1. ZOOMABLE BACKGROUND LAYER (Hero Video + Poster Fallback)
            ===================================================================== */}
        <div
          className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
          style={{ overflow: "hidden" }}
        >
          <div
            ref={imageLayerRef}
            className={`absolute inset-0 w-full h-full transition-all ${
              isIntroRunning
                ? "scale-[1.12] duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                : ""
            }`}
            style={{
              transformOrigin: HERO_TRANSFORM_ORIGIN,
            }}
          >
            {/* Native Video Background with Lazy Buffer & Poster Fallback */}
            <HeroVideoBackground />
          </div>

          {/* Base cinematic navy gradient (preserves high contrast for left text) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#06121F]/95 via-[#06121F]/70 to-transparent/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06121F] via-transparent to-black/40 pointer-events-none" />

          {/* Sinking Depth Darken Overlay (animated dynamically via ref from p=0.35 to 1.0) */}
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-[#06121F] pointer-events-none opacity-40 transition-opacity duration-150"
          />
        </div>

        {/* =====================================================================
            2. SIDE PROGRESS RAIL (Desktop Only, 3 slim dots on left edge)
            ===================================================================== */}
        {!prefersReducedMotion && (
          <div
            ref={railRef}
            className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-3 transition-opacity duration-300 pointer-events-none"
            aria-hidden="true"
          >
            {[0, 1, 2].map((idx) => {
              const isActive = activeDot === idx;
              return (
                <div
                  key={idx}
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? "h-7 bg-[#0EA5E0] shadow-[0_0_10px_rgba(14,165,224,0.8)]"
                      : "h-2 bg-white/30"
                  }`}
                />
              );
            })}
          </div>
        )}

        {/* =====================================================================
            3. MAIN HERO CONTENT CONTAINER (Drifts and fades out as p rises)
            ===================================================================== */}
        <div
          ref={contentRef}
          className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 w-full flex-1 flex flex-col justify-start pt-4 sm:pt-6 md:pt-10 lg:pt-14 pb-4 sm:pb-6 md:pb-8"
        >
          <div className="max-w-3xl lg:max-w-4xl xl:max-w-5xl">
            {/* Bold Headline with Primary EPICM Header and Tagline Highlight */}
            <h1
              ref={headlineRef}
              className={`font-extrabold text-white tracking-tight transition-transform outline-none focus:outline-none focus-visible:outline-none focus:ring-0 ${
                isIntroRunning ? "page-hero-stagger-title" : ""
              }`}
            >
              <span className="block text-xl sm:text-2xl md:text-3xl lg:text-[2.25rem] xl:text-[2.5rem] font-bold text-white/95 leading-[1.28] tracking-tight">
                Engineering, Procurement, Installation, Commissioning &amp; Management
              </span>
              <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-[2.85rem] xl:text-[3.25rem] font-extrabold text-[#0EA5E0] leading-[1.2] tracking-tight mt-3 sm:mt-4 md:mt-5">
                Engineering Excellence. Integrated Solutions. Operational Success.
              </span>
            </h1>

            {/* Supporting Paragraph with Professional Spacing & Line Height */}
            <p
              ref={paragraphRef}
              className={`mt-5 sm:mt-6 md:mt-8 text-sm sm:text-base md:text-lg text-white/85 font-normal leading-[1.68] max-w-xl lg:max-w-3xl transition-transform ${
                isIntroRunning ? "page-hero-stagger-description" : ""
              }`}
            >
              {siteContent.hero.paragraph}
            </p>

            {/* Action Buttons: Positioned lower down with generous breathing space */}
            <div
              ref={buttonsRef}
              className={`mt-6 sm:mt-8 md:mt-10 flex flex-wrap items-center gap-3.5 sm:gap-4 transition-transform ${
                isIntroRunning ? "page-hero-stagger-actions" : ""
              }`}
            >
              <Link
                href={siteContent.hero.primaryCta.href}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-3.5 rounded-full bg-[#0EA5E0] hover:bg-[#087FB5] text-white font-semibold text-sm sm:text-base transition-all duration-200 shadow-lg shadow-[#0EA5E0]/25 hover:shadow-[#0EA5E0]/45 active:scale-[0.98]"
              >
                <span>{siteContent.hero.primaryCta.label}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={siteContent.hero.secondaryCta.href}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-7 sm:py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold text-sm sm:text-base transition-all duration-200 active:scale-[0.98]"
              >
                <span>{siteContent.hero.secondaryCta.label}</span>
                <ChevronRight className="w-4 h-4 text-white/70" />
              </Link>
            </div>
          </div>
        </div>

        {/* =====================================================================
            4. CREDIBILITY / CAPABILITY COVERAGE STRIP (Fixed bottom until p=0.8)
            ===================================================================== */}
        <div
          ref={stripRef}
          className="relative z-10 w-full border-t border-white/15 bg-black/40 backdrop-blur-md py-4 transition-transform"
        >
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-white/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E0]" />
              <span>Capability Coverage</span>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 sm:gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-white/90">
              {siteContent.hero.capabilityKeywords.map((keyword) => (
                <div key={keyword} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                  <span className="hover:text-[#0EA5E0] transition-colors">
                    {keyword}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
