import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteContent, ServiceItem } from "@/content/siteContent";
import { ArrowRight, ChevronRight, CheckCircle2, Shield, Wrench, FileText } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return siteContent.services.items.map((svc) => ({
    slug: svc.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = siteContent.services.items.find((s) => s.slug === slug);
  if (!service) return { title: "Service Not Found" };

  return {
    title: `${service.title} — MEDDY GLOBAL SOLUTIONS LTD`,
    description: service.summary,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = siteContent.services.items.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  // Related services (other services in the same category)
  const relatedServices = siteContent.services.items
    .filter((s) => s.slug !== slug && s.category === service.category)
    .slice(0, 3);

  return (
    <div className="pt-28 pb-20">
      {/* Service Detail Header */}
      <section className="bg-[#06121F] text-white py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={`/images/${service.imageSlot}.webp`}
            alt={service.title}
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        {/* Dark Blue / Navy Rich Dual Gradients for Pristine Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#06121F]/95 via-[#06121F]/85 to-[#0B2239]/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06121F] via-[#06121F]/60 to-black/60" />

        <div className="relative max-w-7xl mx-auto px-6 space-y-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-white/60 mb-3" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#0CA3DC]">{service.title}</span>
          </nav>

          <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-semibold tracking-wider uppercase text-[#0CA3DC] border border-white/20">
            {service.category === "core" ? "Core Engineering Scope" : "Specialist Technical Scope"}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-3xl">
            {service.title}
          </h1>

          <p className="text-base sm:text-lg text-white/85 max-w-2xl leading-relaxed">
            {service.summary}
          </p>
        </div>
      </section>

      {/* Main Technical Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Technical Scope */}
            <div className="lg:col-span-7 space-y-10">
              <div className="space-y-4">
                <span className="text-xs font-semibold tracking-widest uppercase text-[#64727C] block">
                  Detailed Scope of Capabilities
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#20262B]">
                  Engineering Capabilities & Deliverables
                </h2>
                <p className="text-sm sm:text-base text-[#64727C] leading-relaxed">
                  Under our {service.title} scope, MEDDY GLOBAL SOLUTIONS LTD provides disciplined field execution, verified inspection records, and comprehensive lifecycle support for plant operators.
                </p>
              </div>

              {/* Capabilities Detailed List */}
              <div className="space-y-4">
                {service.capabilities.map((cap, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-[18px] bg-[#F5FAFC] border border-[#E4EDF2] flex items-start gap-4 hover:border-[#0CA3DC]/40 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#0CA3DC]/10 text-[#0CA3DC] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base text-[#20262B] mb-1">
                        {cap}
                      </h3>
                      <p className="text-xs text-[#64727C] leading-relaxed">
                        Executed to industry standard mechanical and electrical codes with documented sign-off.
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Approach Highlights */}
              <div className="p-8 rounded-[24px] bg-[#101E2B] text-white space-y-5">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#0CA3DC]" />
                  <h3 className="text-lg font-bold">Standard Delivery Protocol</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-white/80">
                  <div className="space-y-1">
                    <span className="font-semibold text-white block">Pre-Job Inspection</span>
                    <p className="text-white/60">Condition assessment, safety hazard review, and tool calibration check.</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-semibold text-white block">Execution & Quality</span>
                    <p className="text-white/60">Adherence to manufacturer procedures and calibrated measurement tools.</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-semibold text-white block">Commissioning & Test</span>
                    <p className="text-white/60">Load tests, vibration checks, and pressure tests prior to turnover.</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-semibold text-white block">Documentation Handover</span>
                    <p className="text-white/60">Detailed inspection sheets, part serial numbers, and sign-off certificates.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sticky Sidebar: Image & Enquiry Action */}
            <div className="lg:col-span-5 space-y-6">
              {/* Service Feature Image */}
              <div className="relative aspect-[4/3] rounded-[22px] overflow-hidden shadow-sm border border-[#E4EDF2]">
                <Image
                  src={`/images/${service.imageSlot}.webp`}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Action Card */}
              <div className="p-8 rounded-[24px] bg-[#F5FAFC] border border-[#E4EDF2] space-y-5">
                <h3 className="text-xl font-bold text-[#20262B]">
                  Request a Scope Quote
                </h3>
                <p className="text-xs sm:text-sm text-[#64727C] leading-relaxed">
                  Send your equipment specifications, plant location, or maintenance enquiry to our technical team in Lekki, Lagos.
                </p>
                <div className="space-y-3 pt-2">
                  <Link
                    href={`/contact?service=${encodeURIComponent(service.title)}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#0CA3DC] hover:bg-[#087FB5] text-white text-sm font-semibold transition-all shadow-sm"
                  >
                    <span>Request Quotation</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href={`mailto:${siteContent.company.email}?subject=Enquiry:%20${encodeURIComponent(service.title)}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-white hover:bg-[#F5FAFC] border border-[#E4EDF2] text-[#20262B] text-xs font-semibold transition-all"
                  >
                    <span>Email Direct: {siteContent.company.email}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-16 bg-[#F5FAFC] border-t border-[#E4EDF2]">
          <div className="max-w-7xl mx-auto px-6 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#20262B]">
                Related Technical Scopes
              </h2>
              <Link
                href="/services"
                className="text-xs font-semibold text-[#0CA3DC] hover:text-[#087FB5] transition-colors"
              >
                View all services →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedServices.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/services/${rel.slug}`}
                  className="p-6 rounded-[20px] bg-white border border-[#E4EDF2] hover:border-[#0CA3DC]/40 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0CA3DC]">
                      {rel.category === "core" ? "Core Service" : "Specialist Service"}
                    </span>
                    <h3 className="text-lg font-bold text-[#20262B] group-hover:text-[#0CA3DC] transition-colors">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-[#64727C] line-clamp-2">
                      {rel.summary}
                    </p>
                  </div>
                  <div className="pt-4 flex items-center gap-1.5 text-xs font-semibold text-[#0CA3DC]">
                    <span>View scope</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

