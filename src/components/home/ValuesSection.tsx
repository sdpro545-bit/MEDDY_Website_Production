import React from "react";
import Link from "next/link";
import { siteContent } from "@/content/siteContent";
import { Shield, MessageSquare, Award, ClockCheck, ArrowRight } from "lucide-react";

export function ValuesSection() {
  const icons = [Shield, MessageSquare, Award, ClockCheck];

  return (
    <section className="py-24 bg-white text-[#20262B]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl space-y-3">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#64727C] block">
              Operational Standards
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#20262B] tracking-tight">
              Values guiding our engineering delivery
            </h2>
          </div>
          <Link
            href="/hsse"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0CA3DC] hover:text-[#087FB5] group transition-colors"
          >
            <span>Read our HSSE commitments</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteContent.values.map((val, idx) => {
            const Icon = icons[idx] || Shield;
            return (
              <div
                key={val.title}
                className="p-7 rounded-[22px] bg-[#F5FAFC] border border-[#E4EDF2] flex flex-col justify-between space-y-5 hover:border-[#0CA3DC]/40 hover:bg-white hover:shadow-sm transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-full bg-white border border-[#E4EDF2] flex items-center justify-center text-[#0CA3DC] shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-[#20262B]">{val.title}</h3>
                  <p className="text-xs sm:text-sm text-[#64727C] leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

