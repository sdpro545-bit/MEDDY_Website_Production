"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteContent } from "@/content/siteContent";
import { CountUpNumber } from "@/components/common/CountUpNumber";
import { ArrowRight, Wrench, PackageCheck } from "lucide-react";

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

          {/* Right Column (large portrait photography with badge matching reference) */}
          <div className="md:col-span-5 lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[460px] aspect-[4/5] rounded-[24px] overflow-hidden shadow-xl border border-[#E4EDF2]/80 bg-[#1A2026]">
              <Image
                src="/images/about.webp"
                alt="Engineering personnel on industrial site"
                fill
                sizes="(max-width: 768px) 100vw, 460px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs">
                <span className="font-bold text-[#0EA5E0] block uppercase tracking-wider text-[10px] mb-1">
                  Verified Operations
                </span>
                <span>Active field deployment and maintenance infrastructure in Lekki, Lagos.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
