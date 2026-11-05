import React from "react";
import Link from "next/link";
import Image from "next/image";
import { siteContent } from "@/content/siteContent";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A2026] text-white border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-14 border-b border-white/10">
          {/* Brand & Address Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3.5 group">
              <div className="relative w-11 h-11 flex-shrink-0">
                <Image
                  src="/brand/logo-footer.png"
                  alt="MEDDY Global Solutions Logo"
                  width={44}
                  height={44}
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-xl text-white">
                  MEDDY
                </span>
                <span className="text-xs font-semibold tracking-widest text-[#0CA3DC] uppercase">
                  Global Solutions Ltd
                </span>
              </div>
            </Link>

            <p className="text-white/70 text-sm max-w-md leading-relaxed">
              {siteContent.footer.summary}
            </p>

            <div className="pt-2 space-y-3 text-sm text-white/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#0CA3DC] flex-shrink-0 mt-1" />
                <span className="leading-snug text-white/70">
                  {siteContent.company.address.formatted}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#0CA3DC] flex-shrink-0" />
                <a
                  href={`mailto:${siteContent.company.email}`}
                  className="text-white/80 hover:text-[#0CA3DC] transition-colors"
                >
                  {siteContent.company.email}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-white/50">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              {siteContent.navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/70 hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-[#0CA3DC] transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Services Menu */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-white/50">
              Core Technical Scope
            </h3>
            <ul className="space-y-2.5 text-sm">
              {siteContent.services.items.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="text-[#0CA3DC] hover:text-[#087FB5] font-medium text-xs tracking-wide uppercase pt-1 inline-block"
                >
                  View All 15 Services →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip: Copyright & Verified Status */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-white/50 gap-4">
          <p>© {currentYear} {siteContent.company.legalName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/hsse" className="hover:text-white/80 transition-colors">
              HSSE Policy
            </Link>
            <Link href="/contact" className="hover:text-white/80 transition-colors">
              Contact & Enquiries
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

