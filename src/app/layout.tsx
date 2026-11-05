import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import "@/styles/transitions.css";
import "@/styles/preloader.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/transitions/PageTransition";
import { ScrollBlurEffects } from "@/components/effects/ScrollBlurEffects";
import { CinematicPreloader } from "@/components/media/CinematicPreloader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0CA3DC",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.meddyglobalsolutions.com"),
  title: "MEDDY GLOBAL SOLUTIONS LTD — Industrial Engineering & Technical Services",
  description:
    "Engineering, maintenance, fabrication, procurement and technical staffing delivered from Lekki, Lagos, Nigeria.",
  keywords: [
    "Industrial engineering Nigeria",
    "Plant maintenance Lagos",
    "Fabrication Lekki",
    "Turbines and generators service",
    "Pumps and compressors Nigeria",
    "MEDDY Global Solutions",
  ],
  authors: [{ name: "MEDDY GLOBAL SOLUTIONS LTD" }],
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "MEDDY GLOBAL SOLUTIONS LTD",
    title: "MEDDY GLOBAL SOLUTIONS LTD — Industrial Engineering & Technical Services",
    description:
      "Maintenance, fabrication, procurement and technical staffing, delivered from our office in Lekki, Lagos.",
    images: [
      {
        url: "/images/hero.webp",
        width: 1376,
        height: 768,
        alt: "MEDDY Global Solutions Facility Infrastructure",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} scroll-smooth`}>
      <head>
        {/* Preload critical initial poster asset */}
        <link rel="preload" as="image" href="/media/intro-poster.webp" />

        {/* Anti-FOUC transition safeguard */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var p = sessionStorage.getItem('meddy_transition_pending');
                if (p) {
                  var data = JSON.parse(p);
                  if (Date.now() - data.timestamp < 5000) {
                    document.documentElement.setAttribute('data-transition-theme', 'ice');
                  }
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-[#20262B] antialiased selection:bg-[#0EA5E0] selection:text-white">
        {/* Full Viewport Cinematic Preloader (First paint before Header) */}
        <CinematicPreloader />

        {/* Cinematic Page Transition Overlay */}
        <PageTransition />

        {/* Scroll Progress & Velocity Blur Engine */}
        <ScrollBlurEffects />

        {/* Sticky Smart Frosted Glass Header */}
        <Header />

        {/* Main Content with Scroll Velocity Blur Hook */}
        <main className="flex-1 w-full velocity-blur-target">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
