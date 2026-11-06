"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteContent, ServiceItem } from "@/content/siteContent";
import { CountUpNumber } from "@/components/common/CountUpNumber";
import {
  ArrowRight,
  Shield,
  Wrench,
  CheckCircle2,
  SlidersHorizontal,
  Compass,
  FileCheck,
  Building2,
  Anchor,
  Zap,
} from "lucide-react";

type CapabilityFilter = "rotating" | "infrastructure" | "marine-logistics";

interface CapabilityMeta {
  environment: string;
  equipmentType: string;
  fieldDeliverable: string;
  documentation: string;
  filterGroup: "rotating" | "infrastructure" | "marine-logistics";
}

const capabilityMetadataMap: Record<string, CapabilityMeta> = {
  "global-maintenance-contracts": {
    environment: "Onshore Plant & Refinery",
    equipmentType: "Rotating Equipment & Turbomachinery",
    fieldDeliverable: "Preventive servicing & emergency overhaul",
    documentation: "Condition reports & vibration logs",
    filterGroup: "rotating",
  },
  "epic-epcm-services": {
    environment: "Industrial Facilities & Process Units",
    equipmentType: "Structural Skids, Piping & Electrical",
    fieldDeliverable: "Engineering, installation & commissioning",
    documentation: "Testing & handover dossiers",
    filterGroup: "infrastructure",
  },
  "manpower-technical-staffing": {
    environment: "Field Sites & Workshops",
    equipmentType: "Multi-Discipline Engineering Crews",
    fieldDeliverable: "Qualified technicians & project engineers",
    documentation: "Safety onboarding & competence records",
    filterGroup: "marine-logistics",
  },
  "construction-fabrication": {
    environment: "Fabrication Yards & Field Sites",
    equipmentType: "Structural Frames, Platforms & Spools",
    fieldDeliverable: "Weld assembly & structural erection",
    documentation: "NDT & weld inspection certificates",
    filterGroup: "infrastructure",
  },
  "oem-services": {
    environment: "Plant Warehouses & Workshops",
    equipmentType: "OEM Spares, Bearings & Tooling",
    fieldDeliverable: "Genuine component supply & retrofits",
    documentation: "Manufacturer certificates of origin",
    filterGroup: "infrastructure",
  },
  "load-bank-services": {
    environment: "Power Stations & Commercial Hubs",
    equipmentType: "Diesel & Gas Power Generators",
    fieldDeliverable: "Resistive & reactive load testing",
    documentation: "Full load test performance reports",
    filterGroup: "rotating",
  },
  "pumps-compressors": {
    environment: "Mechanical Overhaul Workshops",
    equipmentType: "Centrifugal & Reciprocating Units",
    fieldDeliverable: "Dismantling, seal/bearing rebuild & testing",
    documentation: "Dynamic balancing & vibration checks",
    filterGroup: "rotating",
  },
  "turbines-generators": {
    environment: "Turbine Machinery Halls",
    equipmentType: "Gas, Steam & Diesel Driven Turbines",
    fieldDeliverable: "Major inspections & control tune-ups",
    documentation: "Overhaul sign-off & performance data",
    filterGroup: "rotating",
  },
  "motors-drives": {
    environment: "Electrical Switchgear Rooms",
    equipmentType: "AC/DC Motors & Variable Frequency Drives",
    fieldDeliverable: "Motor rewinding, VFD panel commissioning",
    documentation: "Insulation & thermal test logs",
    filterGroup: "rotating",
  },
  "procurement-logistics": {
    environment: "Global Supply Chain & Warehousing",
    equipmentType: "Industrial Valves, Piping & Heavy Spares",
    fieldDeliverable: "Vendor vetting, import & site delivery",
    documentation: "Shipping manifests & material test reports",
    filterGroup: "marine-logistics",
  },
  "pipeline-flowline-services": {
    environment: "Onshore & Swamp Right-of-Ways",
    equipmentType: "Carbon Steel & Alloy Pipelines",
    fieldDeliverable: "Pipe laying, tie-ins & hydrotesting",
    documentation: "Hydrotest charts & integrity logs",
    filterGroup: "infrastructure",
  },
  "marine-services": {
    environment: "Offshore Terminals & Coastal Waters",
    equipmentType: "Offshore Supply Vessels & Marine Gear",
    fieldDeliverable: "Marine transport & vessel maintenance",
    documentation: "Vessel survey & safety certifications",
    filterGroup: "marine-logistics",
  },
  "electrical-submersible-pumps": {
    environment: "Downhole & Production Wellheads",
    equipmentType: "ESP Motor, Pump & Intake Assemblies",
    fieldDeliverable: "Installation, pull, inspect & rerun",
    documentation: "Electrical runlife & flow records",
    filterGroup: "infrastructure",
  },
  "filtration-fluid-management": {
    environment: "Lube Oil & Fluid Processing Skids",
    equipmentType: "Industrial Filter Housings & Manifolds",
    fieldDeliverable: "System flushing & contamination control",
    documentation: "Fluid particle counts & lab certificates",
    filterGroup: "infrastructure",
  },
  "consultancy-services": {
    environment: "Client Engineering Offices",
    equipmentType: "Facility Scopes & Reliability Plans",
    fieldDeliverable: "Engineering reviews & tender support",
    documentation: "Technical evaluation reports",
    filterGroup: "marine-logistics",
  },
};

export default function CapabilitiesPage() {
  const [filter, setFilter] = useState<CapabilityFilter>("rotating");

  const filteredItems = siteContent.services.items.filter((item) => {
    const meta = capabilityMetadataMap[item.slug];
    return meta?.filterGroup === filter;
  });

  return (
    <div className="pt-28 pb-20 bg-[#F5FAFC]">
      {/* Capabilities Cinematic Hero */}
      <section className="bg-[#06121F] text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.webp"
            alt="Capabilities Banner"
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
            Technical Operations
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.12]">
            Capabilities in Action
          </h1>

          <p className="text-base sm:text-lg text-white/80 max-w-2xl leading-relaxed">
            Detailed operational scopes across rotating equipment, plant construction, pipeline systems, and marine logistics delivered across Nigeria.
          </p>

          {/* Quick Metrics Strip */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl border-t border-white/10">
            <div>
              <span className="text-2xl font-bold text-white block">
                <CountUpNumber end={15} />
              </span>
              <span className="text-xs text-white/60 uppercase tracking-wider">Technical Disciplines</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-[#0CA3DC] block">Nigeria</span>
              <span className="text-xs text-white/60 uppercase tracking-wider">Field Coverage</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-white block">
                <CountUpNumber end={100} suffix="%" />
              </span>
              <span className="text-xs text-white/60 uppercase tracking-wider">Documented QA</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-[#0CA3DC] block">Turnkey</span>
              <span className="text-xs text-white/60 uppercase tracking-wider">Execution Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Field Filter Bar - Standard Non-Sticky Flow */}
      <section className="bg-white border-b border-[#E4EDF2] py-4 shadow-xs relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#64727C]">
            <SlidersHorizontal className="w-4 h-4 text-[#0CA3DC]" />
            <span>Filter Operational Field:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "rotating", label: "Plant & Rotating Machinery", count: 5 },
              { id: "infrastructure", label: "Fabrication & Infrastructure", count: 5 },
              { id: "marine-logistics", label: "Marine & Technical Logistics", count: 5 },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setFilter(btn.id as CapabilityFilter)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  filter === btn.id
                    ? "bg-[#0CA3DC] text-white shadow-xs"
                    : "bg-[#F5FAFC] text-[#64727C] hover:text-[#20262B] border border-[#E4EDF2]"
                }`}
              >
                {btn.label} (<CountUpNumber end={btn.count} />)
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Dossier: Horizontal Editorial Cards Layout */}
      <section className="py-16 md:py-20">
        <div key={filter} className="max-w-7xl mx-auto px-6 space-y-8 animate-zoom-reveal">
          {filteredItems.map((item, idx) => {
            const meta = capabilityMetadataMap[item.slug] || {
              environment: "Industrial Plant Site",
              equipmentType: "Specialized Mechanical Systems",
              fieldDeliverable: "Comprehensive maintenance & overhaul",
              documentation: "Detailed quality & inspection records",
              filterGroup: "rotating",
            };

            const isEven = idx % 2 === 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-[26px] border border-[#E4EDF2] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 animate-reveal"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 items-stretch ${
                  !isEven ? "lg:flex-row-reverse" : ""
                }`}>
                  {/* Photo Column (5 cols) */}
                  <div className={`relative min-h-[300px] lg:min-h-full lg:col-span-5 bg-[#101E2B] ${
                    !isEven ? "lg:order-2" : "lg:order-1"
                  }`}>
                    <Image
                      src={`/images/${item.imageSlot}.webp`}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent lg:hidden" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold tracking-wider uppercase text-white border border-white/20">
                        {meta.environment}
                      </span>
                    </div>
                  </div>

                  {/* Operational Data Column (7 cols) */}
                  <div className={`p-8 lg:p-10 lg:col-span-7 flex flex-col justify-between space-y-6 ${
                    !isEven ? "lg:order-1" : "lg:order-2"
                  }`}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0CA3DC]">
                          Discipline 0{idx + 1}
                        </span>
                        <span className="text-xs text-[#64727C] font-medium hidden sm:inline">
                          Technical Operations Roster
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-bold text-[#20262B] leading-snug">
                        {item.title}
                      </h2>

                      <p className="text-sm text-[#64727C] leading-relaxed">
                        {item.summary}
                      </p>

                      {/* Technical Parameter Matrix */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3" data-no-reveal="true">
                        <div className="p-3.5 rounded-xl bg-[#F5FAFC] border border-[#E4EDF2]">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64727C] block mb-0.5">
                            Equipment Scope
                          </span>
                          <span className="text-xs font-semibold text-[#20262B]">
                            {meta.equipmentType}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#F5FAFC] border border-[#E4EDF2]">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64727C] block mb-0.5">
                            Field Deliverable
                          </span>
                          <span className="text-xs font-semibold text-[#20262B]">
                            {meta.fieldDeliverable}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#F5FAFC] border border-[#E4EDF2]">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64727C] block mb-0.5">
                            QA Verification
                          </span>
                          <span className="text-xs font-semibold text-[#20262B]">
                            {meta.documentation}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#F5FAFC] border border-[#E4EDF2]">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64727C] block mb-0.5">
                            Mobilization Base
                          </span>
                          <span className="text-xs font-semibold text-[#20262B]">
                            Central Operational Base
                          </span>
                        </div>
                      </div>

                      {/* Capability checklist */}
                      <div className="pt-2" data-no-reveal="true">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#20262B] block mb-2">
                          Specific Field Activities
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#64727C]">
                          {item.capabilities.map((cap, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#0CA3DC] flex-shrink-0" />
                              <span className="line-clamp-1">{cap}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#E4EDF2] flex flex-wrap items-center justify-between gap-4">
                      <Link
                        href={`/services/${item.slug}`}
                        className="inline-flex items-center gap-2 text-xs font-bold text-[#0CA3DC] hover:text-[#087FB5] group transition-colors"
                      >
                        <span>View Complete Service Specification</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </Link>

                      <Link
                        href={`/contact?service=${encodeURIComponent(item.title)}`}
                        className="px-5 py-2 rounded-full bg-[#101E2B] hover:bg-[#0CA3DC] text-white text-xs font-semibold transition-all"
                      >
                        Request Mobilization
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pt-8 pb-16 bg-white border-t border-[#E4EDF2]">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl font-bold text-[#20262B]">
            Need to Evaluate a Plant Scope or Maintenance Contract?
          </h2>
          <p className="text-sm sm:text-base text-[#64727C] max-w-xl mx-auto">
            Our technical operations team reviews equipment drawings, schedules, and mobilization requirements.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0CA3DC] hover:bg-[#087FB5] text-white font-semibold text-sm transition-all"
            >
              <span>Submit Scope of Work</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
