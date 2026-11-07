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
    alt: "Nigerian engineering specialists inspecting rotating turbine machinery with diagnostic tablet",
    aspectRatio: "4:5",
    width: 960,
    height: 1200,
  },
  "about-2": {
    slot: "about-2",
    path: "/images/about-2.webp",
    alt: "Nigerian maintenance technician in branded workwear inspecting high-pressure manifold valves",
    aspectRatio: "4:5",
    width: 960,
    height: 1200,
  },
  "about-3": {
    slot: "about-3",
    path: "/images/about-3.webp",
    alt: "Nigerian engineering crew in safety coveralls advancing to site facility operations",
    aspectRatio: "4:5",
    width: 960,
    height: 1200,
  },
  "about-4": {
    slot: "about-4",
    path: "/images/about-4.webp",
    alt: "Precision mechanical servicing and alignment on industrial pumps and drives",
    aspectRatio: "4:5",
    width: 960,
    height: 1200,
  },
  maintenance: {
    slot: "maintenance",
    path: "/images/maintenance.webp",
    alt: "Rotating equipment maintenance and overhaul station with MEDDY asset tag",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  epic: {
    slot: "epic",
    path: "/images/epic.webp",
    alt: "Industrial process plant installation site with MEDDY EPCM project signboard",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  staffing: {
    slot: "staffing",
    path: "/images/staffing.webp",
    alt: "Nigerian engineering and technical personnel in MEDDY navy workwear and white safety helmets",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  fabrication: {
    slot: "fabrication",
    path: "/images/fabrication.webp",
    alt: "Precision structural fabrication and heavy welding workshop with MEDDY certification tag",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  oem: {
    slot: "oem",
    path: "/images/oem.webp",
    alt: "Precision machinery components and replacement bearings on a workbench with MEDDY placard",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  "load-bank": {
    slot: "load-bank",
    path: "/images/load-bank.webp",
    alt: "Resistive and reactive load bank power verification facility with MEDDY testing placard",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  loadBank: {
    slot: "loadBank",
    path: "/images/load-bank.webp",
    alt: "Resistive and reactive load bank power verification facility with MEDDY testing placard",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  pumps: {
    slot: "pumps",
    path: "/images/pumps.webp",
    alt: "Industrial centrifugal pump unit undergoing workshop alignment with MEDDY nameplate",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  turbines: {
    slot: "turbines",
    path: "/images/turbines.webp",
    alt: "Power generation machinery hall with heavy turbine units and MEDDY facility banner",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  motors: {
    slot: "motors",
    path: "/images/motors.webp",
    alt: "Electric motor on a test bench with instrumentation and MEDDY control cabinet badge",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  procurement: {
    slot: "procurement",
    path: "/images/procurement.webp",
    alt: "Industrial warehouse storage with logistics staging and MEDDY crate signage",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  pipeline: {
    slot: "pipeline",
    path: "/images/pipeline.webp",
    alt: "Flowline and pipeline infrastructure with MEDDY flowline tag",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  marine: {
    slot: "marine",
    path: "/images/marine.webp",
    alt: "Offshore support vessel fleet operating in Nigerian waters with MEDDY GLOBAL fleet markings",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  esp: {
    slot: "esp",
    path: "/images/esp.webp",
    alt: "Submersible pump system components and diagnostics bench with MEDDY equipment plate",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  filtration: {
    slot: "filtration",
    path: "/images/filtration.webp",
    alt: "Industrial fluid filtration vessels and pressure manifold skid with MEDDY label",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  consultancy: {
    slot: "consultancy",
    path: "/images/consultancy.webp",
    alt: "Engineering design office with technical CAD schematics and MEDDY project title block",
    aspectRatio: "3:4",
    width: 900,
    height: 1200,
  },
  hsse: {
    slot: "hsse",
    path: "/images/hsse.webp",
    alt: "Safety helmets with MEDDY emblem and personal protective equipment compliant with ISO standards",
    aspectRatio: "3:2",
    width: 1200,
    height: 800,
  },
  contact: {
    slot: "contact",
    path: "/images/contact.webp",
    alt: "MEDDY GLOBAL SOLUTIONS LTD engineering headquarters and operational base exterior",
    aspectRatio: "16:9",
    width: 1920,
    height: 1080,
  },
};

