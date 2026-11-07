"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteContent, ServiceItem } from "@/content/siteContent";
import { CountUpNumber } from "@/components/common/CountUpNumber";
import { ArrowRight, ArrowUpRight, Search, CheckCircle2 } from "lucide-react";

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<"core" | "other">("core");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = siteContent.services.items.filter((svc) => {
    const matchesCategory = svc.category === selectedCategory;
    const matchesSearch =
      svc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.capabilities.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-28 pb-20">
      {/* Services Header */}
      <section className="bg-[#06121F] text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.webp"
            alt="Engineering services background"
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
            Scope of Work
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Industrial Engineering & Technical Services
          </h1>
          <p className="text-lg text-white/80 max-w-2xl leading-relaxed">
            Coordinated maintenance services, fabrication, rotating equipment support, and specialized procurement delivered to exacting technical standards.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="py-10 bg-white border-b border-[#E4EDF2]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Category Tabs: Core and Other only */}
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#F5FAFC] border border-[#E4EDF2] w-full md:w-auto">
            <button
              type="button"
              onClick={() => setSelectedCategory("core")}
              className={`flex-1 md:flex-none px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${selectedCategory === "core"
                ? "bg-[#0CA3DC] text-white shadow-xs"
                : "text-[#64727C] hover:text-[#20262B]"
                }`}
            >
              Core Services (<CountUpNumber end={9} />)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("other")}
              className={`flex-1 md:flex-none px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${selectedCategory === "other"
                ? "bg-[#0CA3DC] text-white shadow-xs"
                : "text-[#64727C] hover:text-[#20262B]"
                }`}
            >
              Other Services (<CountUpNumber end={6} />)
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#64727C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search services or capabilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-full bg-[#F5FAFC] border border-[#E4EDF2] focus:border-[#0CA3DC] text-xs text-[#20262B] outline-none transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-[#F5FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          {filteredServices.length === 0 ? (
            <div className="text-center py-20 text-[#64727C]">
              <p className="text-lg">No services match your search criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("core");
                }}
                className="mt-4 text-xs font-semibold text-[#0CA3DC] underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div
              key={`${selectedCategory}-${searchQuery}`}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-zoom-reveal"
            >
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="rounded-[24px] bg-white border border-[#E4EDF2] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Service Card Top Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#101E2B]">
                      <Image
                        src={`/images/${service.imageSlot}.webp`}
                        alt={service.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-bold text-[#20262B] group-hover:text-[#0CA3DC] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#64727C] leading-relaxed line-clamp-3">
                        {service.summary}
                      </p>

                      {/* Capabilities Preview List */}
                      <div className="pt-2 border-t border-[#E4EDF2] space-y-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#20262B] block">
                          Key Capabilities
                        </span>
                        <ul className="space-y-1.5 text-xs text-[#64727C]">
                          {service.capabilities.slice(0, 3).map((cap, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0CA3DC] mt-1.5 flex-shrink-0" />
                              <span className="line-clamp-1">{cap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA Link */}
                  <div className="p-6 pt-0">
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center justify-between w-full py-3 px-4 rounded-xl bg-[#F5FAFC] group-hover:bg-[#0CA3DC] text-[#20262B] group-hover:text-white text-xs font-semibold transition-all duration-200"
                    >
                      <span>Explore Full Scope</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl font-bold text-[#20262B]">
            Need a Custom Service Scope or Technical Proposal?
          </h2>
          <p className="text-base text-[#64727C]">
            Our engineering team reviews specific plant requirements, equipment datasheets, and maintenance schedules to provide detailed technical proposals.
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

