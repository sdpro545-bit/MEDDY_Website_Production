"use client";

import React, { useEffect, useRef, useState } from "react";

export function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);

  // 1. Check Low-Power / Bandwidth Conditions & Listen for Lazy Preload Signal
  useEffect(() => {
    const nav = navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } };
    const isSaveData = nav.connection?.saveData === true;
    const isSlowNetwork = nav.connection?.effectiveType === "2g" || nav.connection?.effectiveType === "slow-2g";
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isSaveData || isSlowNetwork || prefersReducedMotion) {
      setIsLowPower(true);
      return;
    }

    // Check if intro was already seen in session
    try {
      if (sessionStorage.getItem("meddy_intro_seen")) {
        setShouldLoadVideo(true);
      }
    } catch {}

    // Listen for preloader event to begin buffering hero video
    const handlePreloadSignal = () => {
      setShouldLoadVideo(true);
    };

    window.addEventListener("meddy-preload-hero-video", handlePreloadSignal);

    // Failsafe: if no preloader signal arrives within 2.5s, start loading hero video
    const fallbackTimer = setTimeout(() => {
      setShouldLoadVideo(true);
    }, 2500);

    return () => {
      window.removeEventListener("meddy-preload-hero-video", handlePreloadSignal);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // 2. Select Source & Load Video
  useEffect(() => {
    if (!shouldLoadVideo || isLowPower || !videoRef.current) return;

    const isMobile = window.innerWidth <= 768;
    const video = videoRef.current;

    // Pick best source before setting src
    let selectedSrc = "/media/hero-1080.mp4";
    if (isMobile) {
      selectedSrc = "/media/hero-720.mp4";
    } else {
      // Check webm support
      const canPlayWebm = video.canPlayType('video/webm; codecs="vp9, vorbis"') || video.canPlayType("video/webm");
      if (canPlayWebm) {
        selectedSrc = "/media/hero-1080.webm";
      }
    }

    video.src = selectedSrc;
    video.load();

    const handleCanPlay = () => {
      setIsVideoLoaded(true);
      video.play().catch(() => {
        // Autoplay policy or battery saver blocked play
      });
    };

    video.addEventListener("canplaythrough", handleCanPlay);
    video.addEventListener("playing", handleCanPlay);

    return () => {
      video.removeEventListener("canplaythrough", handleCanPlay);
      video.removeEventListener("playing", handleCanPlay);
    };
  }, [shouldLoadVideo, isLowPower]);

  // 3. Pause When Tab Hidden or Hero Out of View (Battery & CPU Preservation)
  useEffect(() => {
    if (isLowPower || !videoRef.current) return;

    const video = videoRef.current;

    // Tab visibility listener
    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
      } else if (isVideoLoaded) {
        video.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Viewport intersection listener (pause when scrolled out of view)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            video.pause();
          } else if (isVideoLoaded && !document.hidden) {
            video.play().catch(() => {});
          }
        });
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();
    };
  }, [isVideoLoaded, isLowPower]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{
        backgroundImage: 'url("/media/hero-poster.webp")',
        backgroundSize: "cover",
        backgroundPosition: "70% center",
      }}
      aria-hidden="true"
    >
      {/* Native Video Element (fades in smoothly over poster once ready) */}
      {!isLowPower && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-800 ease-out"
          style={{
            objectPosition: typeof window !== "undefined" && window.innerWidth <= 768 ? "62% center" : "70% center",
            opacity: isVideoLoaded ? 1 : 0,
          }}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          disablePictureInPicture
          tabIndex={-1}
          controls={false}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

