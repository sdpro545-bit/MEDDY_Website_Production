import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteContent } from "@/content/siteContent";
import { CountUpNumber } from "@/components/common/CountUpNumber";
import { Shield, CheckCircle2, Leaf, FileCheck, ArrowRight } from "lucide-react";

export const metadata = {
  title: "HSSE & Quality Commitments — MEDDY GLOBAL SOLUTIONS LTD",
  description:
    "Health, Safety, Security and Environmental commitments guiding our engineering field work and mechanical maintenance operations.",
};

export default function HSSEPage() {
  const commitmentIcons = [Shield, Leaf, FileCheck, CheckCircle2];

  return (
    <div className="pt-28 pb-20">
      {/* Header Banner */}
      <section className="bg-[#06121F] text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hsse.webp"
            alt="Safety equipment"
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
            Operational Standards
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Health, Safety, Security & Environment
          </h1>
          <p className="text-lg text-white/80 max-w-2xl leading-relaxed">
            Commitment to conducting engineering and maintenance operations with disciplined care for personnel, plant assets, and the natural environment.
          </p>

          {/* HSSE Key Metrics Strip */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl border-t border-white/10">
            <div>
              <span className="text-2xl font-bold text-white block">
                <CountUpNumber end={100} suffix="%" />
              </span>
              <span className="text-xs text-white/60 uppercase tracking-wider">Briefing Compliance</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-[#0CA3DC] block">
                <CountUpNumber end={0} />
              </span>
              <span className="text-xs text-white/60 uppercase tracking-wider">Preventable Incidents</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-white block">
                <CountUpNumber end={15} />
              </span>
              <span className="text-xs text-white/60 uppercase tracking-wider">Safety Protocols</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-[#0CA3DC] block">100%</span>
              <span className="text-xs text-white/60 uppercase tracking-wider">PPE Verification</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Commitments Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-16 space-y-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#64727C] block">
              Our Core Commitments
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#20262B] tracking-tight">
              Responsible Engineering Practice
            </h2>
            <p className="text-base text-[#64727C] leading-relaxed">
              At MEDDY GLOBAL SOLUTIONS LTD, safety and quality assurance are integral to every job from pre-mobilisation briefings to post-overhaul testing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {siteContent.hsse.commitments.map((item, index) => {
              const Icon = commitmentIcons[index] || Shield;
              return (
                <div
                  key={item.title}
                  className="p-8 rounded-[24px] bg-[#F5FAFC] border border-[#E4EDF2] space-y-4 hover:border-[#0CA3DC]/40 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-white border border-[#E4EDF2] flex items-center justify-center text-[#0CA3DC] shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#20262B]">{item.title}</h3>
                  <p className="text-sm text-[#64727C] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Field Inspection & Quality Verification Section */}
      <section className="py-20 bg-[#F5FAFC] border-y border-[#E4EDF2]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#64727C] block">
                Quality Verification
              </span>
              <h2 className="text-3xl font-bold text-[#20262B]">
                Documented Quality Verification for Every Overhaul
              </h2>
              <div className="space-y-4 text-sm text-[#64727C] leading-relaxed">
                <p>
                  We adhere strictly to engineering specifications, manufacturer tolerances, and approved testing procedures. All pump overhauls, turbine servicing, and electrical inspections are recorded in detail before handover.
                </p>
                <p>
                  Pre-job risk assessments, tool checklists, and hazardous energy control procedures are implemented on every site deployment to ensure zero preventable incidents.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden shadow-sm border border-[#E4EDF2]">
                <Image
                  src="/images/hsse.webp"
                  alt="Safety gear and equipment"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pt-20">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl font-bold text-[#20262B]">
            Work With a Safety-Focused Technical Partner
          </h2>
          <p className="text-base text-[#64727C]">
            Speak with our engineering coordinators regarding your operational safety requirements.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0CA3DC] hover:bg-[#087FB5] text-white font-semibold text-sm transition-all"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

