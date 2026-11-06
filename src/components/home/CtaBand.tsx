import React from "react";
import Link from "next/link";
import { siteContent } from "@/content/siteContent";
import { ArrowRight, Mail } from "lucide-react";

export function CtaBand() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-[#101E2B] via-[#162738] to-[#1A2E42] text-white p-10 sm:p-14 md:p-16 border border-white/10 shadow-xl">
          {/* Subtle geometric background accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0CA3DC]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#0CA3DC]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#0CA3DC] block">
              Enquiries & Tenders
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {siteContent.ctaBand.heading}
            </h2>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed">
              {siteContent.ctaBand.paragraph}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#0CA3DC] hover:bg-[#087FB5] text-white font-semibold text-sm sm:text-base transition-all duration-200 shadow-md shadow-[#0CA3DC]/30 active:scale-[0.98]"
              >
                <span>{siteContent.ctaBand.primaryAction.label}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`mailto:${siteContent.company.email}`}
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-sm sm:text-base transition-all duration-200"
              >
                <Mail className="w-4 h-4 text-[#0CA3DC]" />
                <span>{siteContent.company.email}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

