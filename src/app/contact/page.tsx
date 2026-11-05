import React from "react";
import Image from "next/image";
import { siteContent } from "@/../content/siteContent";
import { ContactForm } from "@/components/contact/ContactForm";
import { MapPin, Mail, ArrowUpRight, ShieldCheck, Clock } from "lucide-react";

export const metadata = {
  title: "Contact Us — MEDDY GLOBAL SOLUTIONS LTD",
  description:
    "Get in touch with MEDDY Global Solutions Ltd in Lekki, Lagos, Nigeria for industrial maintenance contracts, engineering scopes, and technical tenders.",
};

export default function ContactPage() {
  return (
    <div className="pt-28 pb-20">
      {/* Header Banner */}
      <section className="bg-[#06121F] text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/contact.webp"
            alt="Lagos office exterior"
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
            Official Contact Channel
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Connect With Our Engineering Team
          </h1>
          <p className="text-lg text-white/80 max-w-2xl leading-relaxed">
            Reach out regarding planned maintenance agreements, fabrication tenders, rotating equipment overhauls, or procurement scopes.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Contact Information & Map Card */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <span className="text-xs font-semibold tracking-widest uppercase text-[#64727C] block">
                  Office Location
                </span>
                <h2 className="text-3xl font-bold text-[#20262B]">
                  Lekki Operational Base
                </h2>
                <p className="text-sm text-[#64727C] leading-relaxed">
                  Our central administrative and technical coordination office is located in Lekki, Lagos, providing responsive communication for client projects across the region.
                </p>
              </div>

              {/* Address Card */}
              <div className="p-7 rounded-[22px] bg-[#F5FAFC] border border-[#E4EDF2] space-y-5">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-white border border-[#E4EDF2] flex items-center justify-center text-[#0CA3DC] flex-shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#20262B]">
                      Physical Address
                    </span>
                    <p className="text-sm text-[#64727C] leading-snug">
                      {siteContent.company.address.formatted}
                    </p>
                    <a
                      href={siteContent.company.address.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0CA3DC] hover:text-[#087FB5] pt-2"
                    >
                      <span>Get Directions on Google Maps</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E4EDF2] flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-white border border-[#E4EDF2] flex items-center justify-center text-[#0CA3DC] flex-shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#20262B]">
                      Official Email Channel
                    </span>
                    <p className="text-sm">
                      <a
                        href={`mailto:${siteContent.company.email}`}
                        className="text-[#0CA3DC] font-semibold hover:underline"
                      >
                        {siteContent.company.email}
                      </a>
                    </p>
                    <p className="text-xs text-[#64727C]">
                      Enquiries and technical tender packages are monitored and acknowledged promptly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Google Maps Embed / Visual Reference */}
              <div className="rounded-[22px] overflow-hidden border border-[#E4EDF2] shadow-xs relative aspect-[16/10] bg-[#101E2B]">
                <iframe
                  title="MEDDY Global Solutions Lekki Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.739770519106!2d3.4735!3d6.4402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf4532b2b1155%3A0x6b4ef8212134267!2sOlushola%20Agbaje%20St%2C%20Lekki%20Phase%20I%2C%20Lekki%2C%20Lagos!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Right Contact Form Column */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

