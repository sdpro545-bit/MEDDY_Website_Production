"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteContent } from "@/../content/siteContent";
import { Menu, X, Mail, MapPin, ArrowRight } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTransitionIce, setIsTransitionIce] = useState(false);
  const pathname = usePathname();
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Frosted glass activates after 40px
      if (currentScrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hide on scroll down, show on scroll up (never hide while mobile menu is open)
      if (currentScrollY > 80 && currentScrollY > lastScrollY.current && !mobileMenuOpen) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen]);

  // Observer for transition theme attribute (adapts colors when ice panel is open)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute("data-transition-theme");
      setIsTransitionIce(theme === "ice");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-transition-theme"],
    });

    return () => observer.disconnect();
  }, []);

  // Close mobile menu on route change or Escape key
  useEffect(() => {
    setMobileMenuOpen(false);
    setHeaderVisible(true);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isHome = pathname === "/";

  // Glass styling values matching requirement
  const glassStyles: React.CSSProperties = isScrolled || !isHome
    ? {
        background: isTransitionIce ? "rgba(234, 246, 253, 0.85)" : "rgba(6, 18, 31, 0.65)",
        backdropFilter: "blur(18px) saturate(140%)",
        WebkitBackdropFilter: "blur(18px) saturate(140%)",
        borderBottom: isTransitionIce
          ? "1px solid rgba(6, 18, 31, 0.12)"
          : "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.3)",
      }
    : {
        background: isTransitionIce
          ? "rgba(234, 246, 253, 0.9)"
          : "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
      };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[100] transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{
        transform: headerVisible || mobileMenuOpen ? "translateY(0)" : "translateY(-100%)",
      }}
    >
      {/* Main Frosted Glass Navigation Bar */}
      <nav
        className="transition-all duration-300 py-3.5 px-6"
        style={glassStyles}
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link
            href="/"
            className="flex items-center gap-3.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E0] rounded-lg p-1"
          >
            <div className="relative w-10 h-10 md:w-11 md:h-11 flex-shrink-0">
              <Image
                src="/brand/logo-footer.png"
                alt="MEDDY Global Solutions Emblem"
                width={44}
                height={44}
                className="object-contain w-full h-full"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span
                className={`font-bold tracking-tight text-base md:text-lg leading-tight transition-colors ${
                  isTransitionIce ? "text-[#06121F]" : "text-white"
                }`}
              >
                MEDDY
              </span>
              <span
                className={`text-[10px] md:text-[11px] font-semibold tracking-widest uppercase transition-colors ${
                  isTransitionIce ? "text-[#06121F]/70" : "text-white/80"
                }`}
              >
                Global Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-[13.5px] lg:text-[14.5px] font-medium">
            {siteContent.navigation.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-1 transition-colors ${
                    active
                      ? "text-[#0EA5E0] font-semibold"
                      : isTransitionIce
                      ? "text-[#06121F]/80 hover:text-[#0EA5E0]"
                      : "text-white/85 hover:text-white"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0EA5E0] rounded-full shadow-[0_0_8px_rgba(14,165,224,0.6)]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Header Action CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 lg:px-6 py-2.5 rounded-full bg-[#0EA5E0] hover:bg-[#087FB5] text-white text-xs lg:text-sm font-semibold transition-all shadow-sm hover:shadow-[0_0_16px_rgba(14,165,224,0.4)] active:scale-[0.98]"
            >
              <span>Request a Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Animated Mobile Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E0] transition-transform active:scale-90 ${
              isTransitionIce ? "text-[#06121F]" : "text-white"
            }`}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <span
              className={`w-6 h-0.5 rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] ${
                mobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] ${
                mobileMenuOpen ? "opacity-0 scale-x-0" : "opacity-100"
              }`}
            />
            <span
              className={`w-6 h-0.5 rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] ${
                mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Animated Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[64px] bottom-0 h-[calc(100dvh-64px)] bg-[#06121F]/98 backdrop-blur-2xl z-40 flex flex-col p-6 overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300 ease-out">
          <div className="flex flex-col gap-2.5 pt-4 flex-1">
            {siteContent.navigation.map((item, idx) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-lg font-semibold py-3 px-4 rounded-xl transition-all duration-200 active:scale-[0.97] flex items-center justify-between ${
                    active
                      ? "bg-[#0EA5E0]/15 text-[#0EA5E0] border border-[#0EA5E0]/20"
                      : "text-white/90 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{item.label}</span>
                  <ArrowRight className="w-4 h-4 opacity-50" />
                </Link>
              );
            })}
          </div>

          <div className="pt-6 pb-4 border-t border-white/10 flex flex-col gap-4 mt-auto">
            <div className="text-xs text-white/65 space-y-1">
              <p className="font-semibold text-white/90">{siteContent.company.legalName}</p>
              <p>{siteContent.company.address.formatted}</p>
              <a href={`mailto:${siteContent.company.email}`} className="text-[#0EA5E0] block mt-1 font-medium">
                {siteContent.company.email}
              </a>
            </div>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3.5 rounded-full bg-[#0EA5E0] hover:bg-[#087FB5] active:scale-[0.97] text-white font-semibold text-sm transition-all shadow-[0_0_20px_rgba(14,165,224,0.35)]"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
