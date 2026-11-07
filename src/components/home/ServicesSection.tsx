import React from "react";
import Link from "next/link";
import Image from "next/image";
import { siteContent, SHOW_DRAFT_SERVICES } from "@/content/siteContent";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export function ServicesSection() {
  if (!SHOW_DRAFT_SERVICES) return null;

  // First three core services for homepage staggered showcase
  const featuredServices = siteContent.services.items.slice(0, 3);

  // Exact image mappings for the featured three
  const serviceImages: Record<string, string> = {
    "global-maintenance-contracts": "/images/maintenance.webp",
    "epic-epcm-services": "/images/epic.webp",
    "manpower-technical-staffing": "/images/staffing.webp",
  };

  return (
    <section className="py-24 md:py-32 bg-[#F5FAFC] border-y border-[#E4EDF2] text-[#20262B]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Centred Section Header matching reference */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#64727C] block">
            {siteContent.services.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-[#20262B] tracking-tight leading-tight">
            {siteContent.services.heading}
          </h2>
          <p className="text-sm sm:text-base text-[#64727C] pt-1">
            Planned and responsive technical scopes engineered for industrial operations and rotating plant equipment.
          </p>
        </div>

        {/* Staggered Portrait Card Grid matching Conzone Reference (Appendix D) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-8 items-start pb-8">
          {featuredServices.map((service, index) => {
            const staggerClasses = [
              "md:translate-y-0",
              "md:translate-y-8",
              "md:translate-y-16",
            ][index];

            const imageSrc = serviceImages[service.slug] || `/images/${service.imageSlot}.webp`;

            return (
              <div
                key={service.id}
                className={`transition-transform duration-300 ${staggerClasses}`}
              >
                <Link
                  href={`/services/${service.slug}`}
                  className="group relative block w-full aspect-[3/4] rounded-[22px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#E4EDF2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0CA3DC]"
                >
                  {/* Service Card Background Image */}
                  <Image
                    src={imageSrc}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Dark gradient overlay protecting contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101E2B]/95 via-[#101E2B]/50 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

                  {/* Top Action Icon (Diagonal Arrow) */}
                  <div className="absolute top-5 right-5 flex justify-end items-center z-10">
                    <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#0CA3DC] transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Bottom Text Content */}
                  <div className="absolute bottom-6 left-6 right-6 z-10 space-y-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#CBEBFA] transition-colors leading-snug">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/80 line-clamp-2 leading-relaxed">
                      {service.summary}
                    </p>
                    <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-[#0CA3DC] group-hover:text-white transition-colors">
                      <span>View technical capabilities</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Central CTA to All Services */}
        <div className="mt-16 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-[#F5FAFC] border border-[#E4EDF2] hover:border-[#0CA3DC] text-[#20262B] font-semibold text-sm transition-all shadow-sm hover:shadow"
          >
            <span>Explore all 15 services</span>
            <ArrowRight className="w-4 h-4 text-[#0CA3DC]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
