"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

// Media Asset Constants
const MEDIA_DESKTOP = {
  video: "/media/intro-1080.mp4",
  poster: "/media/intro-poster.webp",
  lastFrame: "/media/intro-last-frame.webp",
};

const MEDIA_MOBILE = {
  video: "/media/intro-mobile.mp4",
  poster: "/media/intro-mobile-poster.webp",
  lastFrame: "/media/intro-mobile-last-frame.webp",
};

export function CinematicPreloader() {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(true);
  const [showSkip, setShowSkip] = useState(false);
  const [showLastFrame, setShowLastFrame] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [needsUserTap, setNeedsUserTap] = useState(false);

  // Initial source and still selection decided synchronously in JS before setting src and poster
  const [videoSrc, setVideoSrc] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(max-width: 768px), (orientation: portrait)").matches
        ? MEDIA_MOBILE.video
        : MEDIA_DESKTOP.video;
    }
    return MEDIA_DESKTOP.video;
  });
  const [posterSrc, setPosterSrc] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(max-width: 768px), (orientation: portrait)").matches
        ? MEDIA_MOBILE.poster
        : MEDIA_DESKTOP.poster;
    }
    return MEDIA_DESKTOP.poster;
  });
  const [lastFrameSrc, setLastFrameSrc] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(max-width: 768px), (orientation: portrait)").matches
        ? MEDIA_MOBILE.lastFrame
        : MEDIA_DESKTOP.lastFrame;
    }
    return MEDIA_DESKTOP.lastFrame;
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const hasTriggeredExitRef = useRef(false);
  const exitTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isVideoLoadedRef = useRef(false);

  // Helper: check if viewport is <= 768px OR in portrait orientation
  const isPortraitOrMobile = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 768px), (orientation: portrait)").matches;
  }, []);

  // Focus transfer to main heading on exit
  const transferFocus = useCallback(() => {
    requestAnimationFrame(() => {
      const h1 = document.querySelector("h1");
      if (h1) {
        h1.setAttribute("tabindex", "-1");
        h1.focus({ preventScroll: true });
        setTimeout(() => h1.blur(), 80);
      } else {
        const main = document.querySelector("main");
        if (main) {
          main.setAttribute("tabindex", "-1");
          main.focus({ preventScroll: true });
          setTimeout(() => main.blur(), 80);
        }
      }
    });
  }, []);

  // Main exit choreography
  const triggerExit = useCallback(() => {
    if (hasTriggeredExitRef.current) return;
    hasTriggeredExitRef.current = true;

    // Use the correct still for current orientation at exit
    const portraitNow = isPortraitOrMobile();
    const finalStill = portraitNow ? MEDIA_MOBILE.lastFrame : MEDIA_DESKTOP.lastFrame;
    setLastFrameSrc(finalStill);
    setShowLastFrame(true);

    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch {}
    }

    // Hold final frame momentarily so the logo breathes
    setTimeout(() => {
      setIsExiting(true);

      // Signal hero that intro exit is starting so hero zoom/reveal initializes
      window.dispatchEvent(new CustomEvent("meddy-hero-start"));

      // Complete dissolve after 900ms
      setTimeout(() => {
        setIsActive(false);
        document.body.classList.remove("preloader-scroll-locked");
        try {
          sessionStorage.setItem("meddy_spa_internal_nav", "true");
        } catch {}

        transferFocus();

        if (videoRef.current) {
          videoRef.current.removeAttribute("src");
          videoRef.current.load();
        }
      }, 900);
    }, 450);
  }, [isPortraitOrMobile, transferFocus]);

  // Attempt playback with error and policy recovery
  const attemptPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setNeedsUserTap(false);
          window.dispatchEvent(new CustomEvent("meddy-preload-hero-video"));
        })
        .catch(() => {
          // Autoplay blocked by browser policy: show gentle tap prompt
          setNeedsUserTap(true);
        });
    }
  }, []);

  // Direct tap anywhere on overlay triggers playback
  const handleOverlayClick = () => {
    const video = videoRef.current;
    if (video && video.paused) {
      attemptPlay();
    }
  };

  // Initialization, Source Selection, and Constraints Check
  useEffect(() => {
    if (pathname !== "/") {
      setIsActive(false);
      return;
    }

    // Check if this was an internal SPA link navigation from another page within the same session
    try {
      const isInternalNav = sessionStorage.getItem("meddy_spa_internal_nav");
      const hasTransitionPending = sessionStorage.getItem("meddy_transition_pending");
      if (isInternalNav && hasTransitionPending) {
        setIsActive(false);
        window.dispatchEvent(new CustomEvent("meddy-hero-start"));
        window.dispatchEvent(new CustomEvent("meddy-preload-hero-video"));
        return;
      }
    } catch {}

    // Decide mobile vs desktop in JS BEFORE setting src and poster
    const isPortrait = isPortraitOrMobile();
    const activeMedia = isPortrait ? MEDIA_MOBILE : MEDIA_DESKTOP;

    setVideoSrc(activeMedia.video);
    setPosterSrc(activeMedia.poster);
    setLastFrameSrc(activeMedia.lastFrame);

    // Check low-bandwidth / low-power / reduced-motion constraints
    const nav = navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } };
    const isSaveData = nav.connection?.saveData === true;
    const isSlowNetwork = nav.connection?.effectiveType === "2g" || nav.connection?.effectiveType === "slow-2g";
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isSaveData || isSlowNetwork || prefersReducedMotion) {
      // Still fallback: display the matching last frame immediately, then exit
      document.body.classList.add("preloader-scroll-locked");
      setShowLastFrame(true);
      window.dispatchEvent(new CustomEvent("meddy-preload-hero-video"));
      setTimeout(() => {
        triggerExit();
      }, 800);
      return;
    }

    // Lock body scroll during preloader
    document.body.classList.add("preloader-scroll-locked");

    const video = videoRef.current;
    if (video && !isVideoLoadedRef.current) {
      isVideoLoadedRef.current = true;
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;

      // Assign decided src and load
      video.src = activeMedia.video;
      video.load();

      const handleCanPlay = () => {
        attemptPlay();
      };

      video.addEventListener("canplay", handleCanPlay, { once: true });
      video.addEventListener("loadeddata", handleCanPlay, { once: true });

      attemptPlay();
    }

    // Orientation / Resize listener: update lastFrameSrc on orientation change without restarting video
    const handleOrientationOrResize = () => {
      const portraitNow = isPortraitOrMobile();
      setLastFrameSrc(portraitNow ? MEDIA_MOBILE.lastFrame : MEDIA_DESKTOP.lastFrame);
    };

    window.addEventListener("resize", handleOrientationOrResize, { passive: true });
    window.addEventListener("orientationchange", handleOrientationOrResize, { passive: true });

    // Show Skip button after 1.5 seconds
    const skipTimer = setTimeout(() => {
      setShowSkip(true);
    }, 1500);

    // Absolute failsafe maximum timeout: 9 seconds
    exitTimerRef.current = setTimeout(() => {
      triggerExit();
    }, 9000);

    // Keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        triggerExit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(skipTimer);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleOrientationOrResize);
      window.removeEventListener("orientationchange", handleOrientationOrResize);
    };
  }, [pathname, isPortraitOrMobile, attemptPlay, triggerExit]);

  // Only render on homepage
  if (pathname !== "/" || !isActive) {
    return null;
  }

  return (
    <div
      className={`preloader-overlay ${isExiting ? "preloader-exiting" : ""}`}
      role="status"
      aria-label="Loading MEDDY Global Solutions"
      onClick={handleOverlayClick}
      style={{
        zIndex: 99999,
        backgroundImage: posterSrc ? `url(${posterSrc})` : undefined,
      }}
    >
      <div className="preloader-video-container">
        {/* Native HTML5 Video Element with Selected Source */}
        <video
          ref={videoRef}
          src={videoSrc || undefined}
          poster={posterSrc || undefined}
          className="preloader-video"
          muted
          playsInline
          autoPlay
          preload="auto"
          onEnded={triggerExit}
          onTimeUpdate={() => {
            const video = videoRef.current;
            if (video && video.duration > 0 && video.currentTime >= video.duration - 0.25) {
              triggerExit();
            }
          }}
          aria-hidden="true"
        />

        {/* Final Frame Still Image Overlay */}
        <div
          className={`preloader-last-frame ${showLastFrame ? "is-visible" : ""}`}
          style={{
            backgroundImage: lastFrameSrc ? `url(${lastFrameSrc})` : undefined,
          }}
          aria-hidden="true"
        />
      </div>

      {/* Tap to Play prompt if autoplay is restricted by browser */}
      {needsUserTap && (
        <div className="absolute inset-0 flex items-center justify-center z-[100000] pointer-events-none">
          <div className="px-5 py-2.5 rounded-full bg-[#06121F]/85 backdrop-blur-md border border-[#0EA5E0]/50 text-white text-xs font-semibold tracking-wide flex items-center gap-2 animate-pulse shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#0EA5E0]" />
            Tap anywhere to view intro
          </div>
        </div>
      )}

      {/* Accessible Skip Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          triggerExit();
        }}
        className={`preloader-skip-btn ${showSkip ? "is-visible" : ""}`}
        aria-label="Skip introduction video"
      >
        Skip
      </button>
    </div>
  );
}
