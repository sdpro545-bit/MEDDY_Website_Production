/**
 * MEDDY GLOBAL SOLUTIONS LTD — Image Manifest
 * 
 * Central registry mapping each visual slot to its asset path, alt text, and aspect ratio.
 * To replace any generated image with real site photography later:
 * Drop the new image file at the specified path (or update the path here) without altering page components.
 */

export interface ImageSlot {
  slot: string;
  path: string;
  alt: string;
  aspectRatio: string;
  width: number;
  height: number;
}

export const imageManifest: Record<string, ImageSlot> = {
  hero: {
    slot: "hero",
    path: "/images/hero.webp",
    alt: "Industrial facility pipework and storage systems at golden hour",
    aspectRatio: "16:9",
    width: 1920,
    height: 1080,
  },
  about: {
    slot: "about",
    path: "/images/about.webp",
    alt: "Technical personnel reviewing engineering documentation on site",
    aspectRatio: "4:5",
    width: 960,
    height: 1200,
  },
  maintenance: {
    slot: "maintenance",
    path: "/images/maintenance.webp",
    alt: "Technician servicing rotating industrial equipment in a mechanical plant",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  epic: {
    slot: "epic",
    path: "/images/epic.webp",
    alt: "Process plant structure under installation with crane support",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  staffing: {
    slot: "staffing",
    path: "/images/staffing.webp",
    alt: "Technical personnel in protective gear at an industrial facility",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  fabrication: {
    slot: "fabrication",
    path: "/images/fabrication.webp",
    alt: "Precision structural fabrication and welding inside a workshop",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  oem: {
    slot: "oem",
    path: "/images/oem.webp",
    alt: "Precision machinery components and replacement bearings on a workbench",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  "load-bank": {
    slot: "load-bank",
    path: "/images/load-bank.webp",
    alt: "Power generation and electrical load testing unit in operation",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  loadBank: {
    slot: "loadBank",
    path: "/images/load-bank.webp",
    alt: "Power generation and electrical load testing unit in operation",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  pumps: {
    slot: "pumps",
    path: "/images/pumps.webp",
    alt: "Industrial centrifugal pump unit undergoing workshop alignment",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  turbines: {
    slot: "turbines",
    path: "/images/turbines.webp",
    alt: "Power generation machinery hall with heavy turbine units",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  motors: {
    slot: "motors",
    path: "/images/motors.webp",
    alt: "Electric motor on a test bench with instrumentation and control systems",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  procurement: {
    slot: "procurement",
    path: "/images/procurement.webp",
    alt: "Industrial warehouse storage with logistics staging and materials",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  pipeline: {
    slot: "pipeline",
    path: "/images/pipeline.webp",
    alt: "Flowline and pipeline infrastructure crossing field terrain",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  marine: {
    slot: "marine",
    path: "/images/marine.webp",
    alt: "Offshore support vessel operating in coastal waters",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  esp: {
    slot: "esp",
    path: "/images/esp.webp",
    alt: "Submersible pump system components laid out for mechanical inspection",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  filtration: {
    slot: "filtration",
    path: "/images/filtration.webp",
    alt: "Industrial fluid filtration vessels and high-pressure manifold lines",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  consultancy: {
    slot: "consultancy",
    path: "/images/consultancy.webp",
    alt: "Engineers conducting a technical drawing and layout evaluation",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  hsse: {
    slot: "hsse",
    path: "/images/hsse.webp",
    alt: "Safety helmets and high-visibility equipment ready for field operations",
    aspectRatio: "3:2",
    width: 1200,
    height: 800,
  },
  contact: {
    slot: "contact",
    path: "/images/contact.webp",
    alt: "Commercial office exterior",
    aspectRatio: "16:9",
    width: 1920,
    height: 1080,
  },
};

