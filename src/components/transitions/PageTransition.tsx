"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { siteContent } from "@/content/siteContent";

export const ROUTE_TITLE_MAP: Record<string, string> = {
  "/": "Home",
  "/about": "About",
  "/services": "Services",
  "/capabilities": "Capabilities",
  "/hsse": "HSSE & Quality",
  "/contact": "Contact",
};

export function getDestinationTitle(pathname: string): string {
  if (ROUTE_TITLE_MAP[pathname]) {
    return ROUTE_TITLE_MAP[pathname];
  }
  if (pathname.startsWith("/services/")) {
    const slug = pathname.replace("/services/", "").replace(/\/$/, "");
    const item = siteContent.services.items.find((s) => s.slug === slug);
    if (item) return item.title;
    return slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  // Remove leading slash and capitalize
  const clean = pathname.replace(/^\//, "").replace(/\/$/, "");
  if (!clean) return "Home";
  return clean
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

type TransitionPhase =
  | "idle"
  | "cover-in"     // 0.00s - 0.45s: navy overlay fades in, page scales to 0.985
  | "marquee-run"  // 0.30s - 1.10s: marquee travels across
  | "curtain-open" // 0.85s - 1.45s: ice-blue curtain opens from vertical center
  | "navigating"   // 1.10s: router.push executes
  | "reveal-hold"  // new page covered by ice-blue panel
  | "reveal-lift"  // marquee slides up, curtain lifts upward, hero staggers in
  | "popstate-run" // fast reverse fade for back/forward
  | "reduced-fade"; // 250ms crossfade for reduced motion

export function PageTransition() {
  const router = useRouter();
  const currentPathname = usePathname();
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [targetTitle, setTargetTitle] = useState("Home");
  const isTransitioningRef = useRef(false);
  const failsafeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Focus management on route reveal
  const focusPageHeading = useCallback(() => {
    requestAnimationFrame(() => {
      const h1 = document.querySelector("h1");
      if (h1) {
        h1.setAttribute("tabindex", "-1");
        h1.focus({ preventScroll: true });
      } else {
        const main = document.querySelector("main");
        if (main) {
          main.setAttribute("tabindex", "-1");
          main.focus({ preventScroll: true });
        }
      }
    });
  }, []);

  // Check if user has navigated previously and needs a reveal
  useEffect(() => {
    try {
      const pendingRaw = sessionStorage.getItem("meddy_transition_pending");
      if (pendingRaw) {
        const pending = JSON.parse(pendingRaw);
        sessionStorage.removeItem("meddy_transition_pending");

        // Validate timestamp within last 5 seconds to prevent stale overlay
        if (Date.now() - pending.timestamp < 5000) {
          setTargetTitle(pending.title || getDestinationTitle(currentPathname));
          setPhase("reveal-hold");

          // Start the reveal sequence
          requestAnimationFrame(() => {
            document.body.classList.add("transition-scroll-locked");
            document.documentElement.setAttribute("data-transition-theme", "ice");

            setTimeout(() => {
              setPhase("reveal-lift");
              focusPageHeading();

              setTimeout(() => {
                setPhase("idle");
                document.body.classList.remove("transition-scroll-locked");
                document.documentElement.removeAttribute("data-transition-theme");
                isTransitioningRef.current = false;
              }, 450); // lift animation duration
            }, 100);
          });
          return;
        }
      }
    } catch {
      // sessionStorage unavailable or parse error; fallback to idle
    }
  }, [currentPathname, focusPageHeading]);

  // Handle Browser Back / Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) {
        return;
      }
      setPhase("popstate-run");
      document.body.classList.add("transition-scroll-locked");
      setTimeout(() => {
        setPhase("idle");
        document.body.classList.remove("transition-scroll-locked");
      }, 950);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Global click delegator: intercepts every internal navigation link smoothly
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Ignore if transition already active
      if (isTransitioningRef.current) {
        e.preventDefault();
        return;
      }

      // Check for modified clicks (new tab, new window, etc.)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
        return;
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore external links, mailto, tel, hash anchors, javascript, target=_blank
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        href.startsWith("javascript:") ||
        anchor.getAttribute("target") === "_blank" ||
        anchor.getAttribute("download") !== null ||
        anchor.getAttribute("rel")?.includes("external")
      ) {
        return;
      }

      // Parse destination url
      try {
        const destUrl = new URL(href, window.location.href);
        // Compare pathname + search with current
        if (destUrl.pathname === window.location.pathname && destUrl.search === window.location.search) {
          // If hash is changing, let native browser hash jump take over
          if (destUrl.hash) return;
          e.preventDefault();
          return;
        }

        // It is an internal page transition
        e.preventDefault();
        startTransition(destUrl.pathname + destUrl.search);
      } catch {
        // Fallback to normal click
      }
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [currentPathname]);

  // Main cinematic sequence execution
  const startTransition = useCallback(
    (destPath: string) => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;

      const title = getDestinationTitle(destPath.split("?")[0]);
      setTargetTitle(title);

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile = window.innerWidth < 768;

      // Clear any previous failsafe
      if (failsafeTimerRef.current) clearTimeout(failsafeTimerRef.current);
      failsafeTimerRef.current = setTimeout(() => {
        // Emergency unlock if navigation stalls
        setPhase("idle");
        document.body.classList.remove("transition-scroll-locked");
        document.documentElement.removeAttribute("data-transition-theme");
        isTransitioningRef.current = false;
      }, 3500);

      // Reduced motion: clean 250ms opacity crossfade
      if (reducedMotion) {
        setPhase("reduced-fade");
        setTimeout(() => {
          router.push(destPath);
          setTimeout(() => {
            setPhase("idle");
            isTransitioningRef.current = false;
            focusPageHeading();
          }, 250);
        }, 150);
        return;
      }

      // Lock scrolling and main page scale down
      document.body.classList.add("transition-scroll-locked");
      document.documentElement.setAttribute("data-transition-theme", "navy");

      // Scale main page to 0.985
      const mainEl = document.querySelector("main");
      if (mainEl) {
        mainEl.style.transition = "transform 450ms cubic-bezier(0.65, 0, 0.35, 1), filter 450ms cubic-bezier(0.65, 0, 0.35, 1)";
        mainEl.style.transform = "scale(0.985)";
        mainEl.style.filter = "brightness(0.85)";
      }

      // Phase 1: 0.00s to 0.45s — COVER IN
      setPhase("cover-in");

      // Timing calculations (mobile ~1.4s, desktop ~1.9s)
      const tMarquee = isMobile ? 220 : 300;
      const tCurtain = isMobile ? 650 : 850;
      const tNav = isMobile ? 850 : 1100;

      // Phase 2: MARQUEE
      setTimeout(() => {
        setPhase("marquee-run");
      }, tMarquee);

      // Phase 3: LIGHT PANEL CURTAIN
      setTimeout(() => {
        setPhase("curtain-open");
        document.documentElement.setAttribute("data-transition-theme", "ice");
      }, tCurtain);

      // Phase 4: NAVIGATION POINT
      setTimeout(() => {
        try {
          sessionStorage.setItem(
            "meddy_transition_pending",
            JSON.stringify({
              title,
              to: destPath,
              timestamp: Date.now(),
            })
          );
        } catch {
          // ignore sessionStorage write error
        }

        // Reset main scale before page unmounts
        if (mainEl) {
          mainEl.style.transform = "";
          mainEl.style.filter = "";
          mainEl.style.transition = "";
        }

        router.push(destPath);
      }, tNav);
    },
    [router, focusPageHeading]
  );

  // If completely idle, render nothing to avoid any overhead
  if (phase === "idle") {
    return null;
  }

  // Reduced motion render
  if (phase === "reduced-fade") {
    return (
      <div
        className="fixed inset-0 z-[90] bg-[#06121F] pointer-events-none transition-opacity duration-250 ease-out"
        style={{ opacity: 0.85 }}
        aria-hidden="true"
      />
    );
  }

  // Popstate fast reverse render
  if (phase === "popstate-run") {
    return (
      <div
        className="fixed inset-0 z-[90] pointer-events-none flex items-center justify-center bg-gradient-to-br from-[#06121F] to-[#0B2239] transition-opacity duration-400 ease-out animate-popstateFade"
        aria-hidden="true"
      >
        <div className="w-10 h-10 border-2 border-[#0EA5E0] border-t-transparent rounded-full animate-spin opacity-80" />
      </div>
    );
  }

  // Marquee repeated segment
  const marqueeText = `${targetTitle} / ${targetTitle} / ${targetTitle} / ${targetTitle} / ${targetTitle} / ${targetTitle} /`;

  return (
    <div
      className="fixed inset-0 z-[90] pointer-events-auto select-none overflow-hidden"
      aria-hidden="true"
      style={{
        zIndex: 90, // Above main page, below header (z-100)
      }}
    >
      {/* =========================================================================
          LAYER 1: NAVY GRADIENT BASE (Phase 1 Cover In)
          ========================================================================= */}
      <div
        className={`absolute inset-0 transition-opacity duration-450 ${
          phase === "cover-in" || phase === "marquee-run" || phase === "curtain-open" || phase === "navigating"
            ? "opacity-100"
            : "opacity-0"
        }`}
        style={{
          background: "linear-gradient(135deg, #06121F 0%, #0B2239 100%)",
          transitionTimingFunction: "cubic-bezier(0.65, 0, 0.35, 1)",
        }}
      >
        {/* Faint cyan bloom top-right */}
        <div
          className="absolute -top-[10%] -right-[10%] w-[65vw] h-[65vw] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(14, 165, 224, 0.18) 0%, transparent 65%)",
          }}
        />

        {/* Marquee Layer A: Light on Dark (#F2F8FC, cyan separator) */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <div
            className={`whitespace-nowrap font-heading font-light tracking-tight transition-transform ${
              phase === "marquee-run" || phase === "curtain-open" || phase === "navigating"
                ? "transition-marquee-active"
                : ""
            }`}
            style={{
              fontSize: "clamp(54px, 11vw, 180px)",
              color: "#F2F8FC",
              transform:
                phase === "marquee-run" || phase === "curtain-open" || phase === "navigating"
                  ? "translateX(-14vw)"
                  : "translateX(0vw)",
              transition: "transform 1400ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {marqueeText.split("/").map((part, index, arr) => (
              <React.Fragment key={index}>
                <span>{part.trim()}</span>
                {index < arr.length - 1 && (
                  <span className="mx-6 text-[#0EA5E0] opacity-60">/</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          LAYER 2: ICE BLUE LIGHT PANEL CURTAIN (Phase 3 Curtain Open & Phase 5 Reveal)
          Opens from vertical center outward with clip-path, lifts upward on new page
          ========================================================================= */}
      <div
        className={`absolute inset-0 bg-[#EAF6FD] pointer-events-none transition-all ${
          phase === "reveal-lift" ? "curtain-lift-out" : ""
        }`}
        style={{
          transitionDuration: phase === "reveal-lift" ? "450ms" : "600ms",
          transitionTimingFunction: "cubic-bezier(0.76, 0, 0.24, 1)",
          clipPath:
            phase === "cover-in" || phase === "marquee-run"
              ? "inset(50% 0 50% 0)"
              : "inset(0% 0 0% 0)",
        }}
      >
        {/* Marquee Layer B: Dark on Light (#06121F, cyan separator) in perfect lockstep */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div
            className={`whitespace-nowrap font-heading font-light tracking-tight transition-all ${
              phase === "reveal-lift" ? "opacity-0 -translate-y-5" : "opacity-100"
            }`}
            style={{
              fontSize: "clamp(54px, 11vw, 180px)",
              color: "#06121F",
              transform:
                phase === "reveal-lift"
                  ? "translateY(-20px)"
                  : phase === "curtain-open" || phase === "navigating" || phase === "reveal-hold"
                  ? "translateX(-14vw)"
                  : "translateX(0vw)",
              transition:
                phase === "reveal-lift"
                  ? "opacity 300ms ease-out, transform 350ms cubic-bezier(0.16, 1, 0.3, 1)"
                  : "transform 1400ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {marqueeText.split("/").map((part, index, arr) => (
              <React.Fragment key={index}>
                <span>{part.trim()}</span>
                {index < arr.length - 1 && (
                  <span className="mx-6 text-[#0EA5E0] opacity-80">/</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
