import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteContent } from "@/../content/siteContent";
import { CountUpNumber } from "@/components/common/CountUpNumber";
import { ArrowRight, MapPin, Shield, CheckCircle2, Building, Wrench } from "lucide-react";

export const metadata = {
  title: "About Us — MEDDY GLOBAL SOLUTIONS LTD",
  description:
    "Learn about MEDDY Global Solutions Ltd, providing engineering, maintenance and procurement services from Lekki, Lagos, Nigeria.",
};

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20">
      {/* Page Header / Hero Banner */}
      <section className="bg-[#06121F] text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.webp"
            alt="Engineering background"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        {/* Dark Blue / Navy Rich Dual Gradients for Pristine Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#06121F]/95 via-[#06121F]/85 to-[#0B2239]/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06121F] via-[#06121F]/60 to-black/60" />
        <div className="relative max-w-7xl mx-auto px-6 space-y-4">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#0CA3DC] block">
            Company Overview
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-3xl">
            Practical engineering support, from planning to handover
          </h1>
          <p className="text-lg text-white/80 max-w-2xl leading-relaxed">
            MEDDY Global Solutions Ltd provides engineering, maintenance and procurement services for industrial operations.
          </p>

          {/* Quick Metrics Strip */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl border-t border-white/10">
            <div>
              <span className="text-2xl font-bold text-white block">
                <CountUpNumber end={15} />
              </span>
              <span className="text-xs text-white/60 uppercase tracking-wider">Engineering Disciplines</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-[#0CA3DC] block">Lekki</span>
              <span className="text-xs text-white/60 uppercase tracking-wider">Lagos Hub</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-white block">
                <CountUpNumber end={100} suffix="%" />
              </span>
              <span className="text-xs text-white/60 uppercase tracking-wider">Quality Documented</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-[#0CA3DC] block">
                <CountUpNumber end={0} />
              </span>
              <span className="text-xs text-white/60 uppercase tracking-wider">Compromise on Safety</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Narrative & Location Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#64727C] block">
                Operating Base & Governance
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#20262B] tracking-tight">
                Headquartered in Lekki, Lagos
              </h2>
              <div className="space-y-4 text-base text-[#64727C] leading-relaxed">
                <p>
                  MEDDY GLOBAL SOLUTIONS LTD delivers technical services, equipment maintenance programmes, and procurement solutions to support industrial plant operations and rotating machinery reliability.
                </p>
                <p>
                  Our operational base in Lekki, Lagos provides coordinated technical oversight, engineering planning, and logistics routing for client facilities across Nigeria.
                </p>
              </div>

              {/* Verified Office Information Card */}
              <div className="p-6 rounded-[20px] bg-[#F5FAFC] border border-[#E4EDF2] space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#0CA3DC] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-[#20262B]">Official Registered Office</h3>
                    <p className="text-xs sm:text-sm text-[#64727C] mt-1">
                      {siteContent.company.address.formatted}
                    </p>
                    <a
                      href={siteContent.company.address.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0CA3DC] hover:text-[#087FB5] mt-2"
                    >
                      <span>View on Google Maps</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden shadow-md border border-[#E4EDF2]">
                <Image
                  src="/images/about.webp"
                  alt="Engineers reviewing plans on site"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Principles */}
      <section className="py-20 bg-[#F5FAFC] border-y border-[#E4EDF2]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#64727C] block">
              Core Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#20262B] tracking-tight">
              How We Approach Engineering Delivery
            </h2>
            <p className="text-sm text-[#64727C]">
              Every contract is executed with clear scope definition, verified inspection records, and disciplined safety standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {siteContent.values.map((v) => (
              <div
                key={v.title}
                className="p-6 rounded-[20px] bg-white border border-[#E4EDF2] space-y-3 shadow-xs hover:border-[#0CA3DC]/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#0CA3DC]/10 text-[#0CA3DC] flex items-center justify-center font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-[#20262B]">{v.title}</h3>
                <p className="text-xs sm:text-sm text-[#64727C] leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="pt-20">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl font-bold text-[#20262B]">
            Discuss Your Facility's Maintenance Strategy
          </h2>
          <p className="text-base text-[#64727C] max-w-xl mx-auto">
            Our engineering team in Lekki is available to review your equipment specs and planned overhaul schedule.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0CA3DC] hover:bg-[#087FB5] text-white font-semibold text-sm transition-all"
            >
              <span>Contact Us Today</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

