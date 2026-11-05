"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

export function CinematicPreloader() {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(true);
  const [showSkip, setShowSkip] = useState(false);
  const [showLastFrame, setShowLastFrame] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [needsUserTap, setNeedsUserTap] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string>("/media/intro-1080.mp4");

  const videoRef = useRef<HTMLVideoElement>(null);
  const hasTriggeredExitRef = useRef(false);
  const exitTimerRef = useRef<NodeJS.Timeout | null>(null);

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
  }, [transferFocus]);

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
          // If browser policy blocks unmuted/gestureless autoplay, show gentle tap prompt
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

  // Device detection & Source Selection
  useEffect(() => {
    if (pathname !== "/") {
      setIsActive(false);
      return;
    }

    const isMobile = window.innerWidth <= 768;
    setVideoSrc(isMobile ? "/media/intro-720.mp4" : "/media/intro-1080.mp4");
  }, [pathname]);

  // Playback initialization
  useEffect(() => {
    if (pathname !== "/") return;

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

    // Lock body scroll during preloader
    document.body.classList.add("preloader-scroll-locked");

    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;

      const handleCanPlay = () => {
        attemptPlay();
      };

      video.addEventListener("canplay", handleCanPlay, { once: true });
      video.addEventListener("loadeddata", handleCanPlay, { once: true });

      attemptPlay();
    }

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
    };
  }, [pathname, videoSrc, attemptPlay, triggerExit]);

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
      style={{ zIndex: 99999 }}
    >
      <div className="preloader-video-container">
        {/* Native HTML5 Video Element */}
        <video
          ref={videoRef}
          src={videoSrc}
          className="preloader-video"
          muted
          playsInline
          autoPlay
          preload="auto"
          poster="/media/intro-poster.webp"
          onEnded={triggerExit}
          onTimeUpdate={() => {
            const video = videoRef.current;
            if (video && video.duration > 0 && video.currentTime >= video.duration - 0.25) {
              triggerExit();
            }
          }}
          aria-hidden="true"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Final Frame Still Image Overlay */}
        <div
          className={`preloader-last-frame ${showLastFrame ? "is-visible" : ""}`}
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
