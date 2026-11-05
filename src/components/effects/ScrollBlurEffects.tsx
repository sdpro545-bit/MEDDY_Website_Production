"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export function ScrollBlurEffects() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(0);
  const velocityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Scroll Progress Bar & Velocity Blur Engine
  useEffect(() => {
    let ticking = false;
    const isMobile = window.innerWidth < 768;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const handleScroll = () => {
      const now = performance.now();
      const currentScrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Progress bar calculation
      if (docHeight > 0) {
        const progress = Math.min(1, Math.max(0, currentScrollY / docHeight));
        setScrollProgress(progress);
      }

      // Velocity blur (Desktop only, no reduced motion)
      if (!isMobile && !reducedMotion) {
        const deltaY = Math.abs(currentScrollY - lastScrollY.current);
        const deltaTime = Math.max(1, now - lastScrollTime.current);
        const velocity = deltaY / deltaTime; // pixels per ms

        const mainEl = document.querySelector("main");
        if (mainEl && velocity > 1.2) {
          // Calculate subtle blur capped at 2px
          const blurAmount = Math.min(2, Math.max(0, (velocity - 1.2) * 0.8));
          if (blurAmount > 0.3) {
            mainEl.style.filter = `blur(${blurAmount.toFixed(1)}px)`;

            if (velocityTimeoutRef.current) clearTimeout(velocityTimeoutRef.current);
            velocityTimeoutRef.current = setTimeout(() => {
              if (mainEl) {
                mainEl.style.filter = "blur(0px)";
              }
            }, 180);
          }
        }
      }

      lastScrollY.current = currentScrollY;
      lastScrollTime.current = now;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (velocityTimeoutRef.current) clearTimeout(velocityTimeoutRef.current);
    };
  }, [pathname]);

  // 2. Blur-to-Sharp Section Reveal Observer
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    // Discover target elements: only top-level cards and primary section containers
    // NEVER target nested parameter boxes, inner grids, or card children
    const targetSelectors = [
      "main > section",
      "main .animate-reveal",
      "main section > div > .grid > div",
      "main article",
    ];

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.classList.add("is-revealed");
            obs.unobserve(target); // Trigger once only
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px 50px 0px",
      }
    );

    const scanAndObserve = () => {
      const elements = document.querySelectorAll(targetSelectors.join(", "));

      elements.forEach((el) => {
        // Avoid tagging header/nav, overlays, or any nested elements inside existing cards/grids
        if (
          el.closest("header") ||
          el.closest("footer") ||
          el.closest("[aria-hidden='true']") ||
          el.closest("[data-no-reveal]")
        ) {
          return;
        }

        // If this element is nested inside another grid item or card, do NOT tag it
        const parentGridItem = el.parentElement?.closest(".grid > div");
        if (parentGridItem && parentGridItem !== el) {
          return;
        }

        const htmlEl = el as HTMLElement;
        if (!htmlEl.classList.contains("scroll-reveal")) {
          // If already visible in the viewport, reveal immediately without flicker
          const rect = htmlEl.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.85) {
            htmlEl.classList.add("scroll-reveal", "is-revealed");
          } else {
            htmlEl.classList.add("scroll-reveal");
            observer.observe(htmlEl);
          }

          // Stagger sibling elements inside grids
          const parent = htmlEl.parentElement;
          if (parent && (parent.classList.contains("grid") || parent.classList.contains("flex"))) {
            const siblingIndex = Array.from(parent.children).indexOf(htmlEl);
            const staggerIndex = (siblingIndex % 6) + 1;
            htmlEl.classList.add(`scroll-reveal-stagger-${staggerIndex}`);
          }
        }
      });
    };

    // Scan immediately and after a short paint delay for smooth route transitions
    scanAndObserve();
    const timeoutId = setTimeout(scanAndObserve, 120);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [pathname]);

  return (
    <>
      {/* Scroll Progress Bar: 2px Brand Cyan, glass-backed, scaleX driven */}
      <div
        className="fixed top-0 left-0 right-0 h-[2.5px] z-[101] pointer-events-none"
        aria-hidden="true"
        style={{
          background: "rgba(6, 18, 31, 0.4)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
      >
        <div
          className="h-full bg-[#0EA5E0] origin-left"
          style={{
            transform: `scaleX(${scrollProgress})`,
            transition: "transform 75ms linear",
            boxShadow: "0 0 10px rgba(14, 165, 224, 0.8)",
          }}
        />
      </div>
    </>
  );
}

