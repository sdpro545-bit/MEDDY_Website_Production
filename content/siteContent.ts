/**
 * MEDDY GLOBAL SOLUTIONS LTD — Central Site Content
 * 
 * Master content repository separating confirmed facts from draft content.
 * Status flags:
 * - verified: Confirmed facts from official company documentation.
 * - draft: Proposed wording requiring client review/approval.
 * - missing: Deliberately omitted until supplied.
 */

export const SHOW_DRAFT_SERVICES = true;

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  category: "core" | "other";
  summary: string;
  capabilities: string[];
  imageSlot: string;
  status: "draft" | "verified";
}

export interface ValueItem {
  title: string;
  description: string;
  status: "draft";
}

export interface HSSECommitment {
  title: string;
  description: string;
}

export const siteContent = {
  company: {
    legalName: "MEDDY GLOBAL SOLUTIONS LTD",
    shortName: "MEDDY",
    status: "verified" as const,
    address: {
      street: "5B, Olushola Agbaje Street, Off Road 13, beside Ascon Fueling",
      area: "Lekki",
      city: "Lagos",
      country: "Nigeria",
      formatted: "5B, Olushola Agbaje Street, Off Road 13, beside Ascon Fueling, Lekki, Lagos, Nigeria",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=5B+Olushola+Agbaje+Street+Lekki+Lagos+Nigeria",
    },
    email: "info@meddyglobalsolutions.com",
    // Deliberate omissions per client directives (Section 0A.3)
    // No phone number, no WhatsApp, no tagline, no unverified social profiles.
  },

  navigation: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Capabilities", href: "/capabilities" },
    { label: "HSSE & Quality", href: "/hsse" },
    { label: "Contact", href: "/contact" },
  ],

  hero: {
    headline: "Engineering and technical services for industry",
    paragraph: "Maintenance, fabrication, procurement and technical staffing, delivered from our office in Lekki, Lagos.",
    primaryCta: {
      label: "Request a quote",
      href: "/contact",
    },
    secondaryCta: {
      label: "View services",
      href: "/services",
    },
    locationLabel: "Lekki, Lagos, Nigeria",
    capabilityKeywords: [
      "Maintenance",
      "Fabrication",
      "Pumps & Compressors",
      "Pipelines",
      "Marine",
      "Procurement",
    ],
    status: "draft" as const,
  },

  about: {
    eyebrow: "About us",
    heading: "Practical engineering support, from planning to handover",
    paragraph: "MEDDY Global Solutions Ltd provides engineering, maintenance and procurement services for industrial operations. Our office is in Lekki, Lagos.",
    cta: {
      label: "Learn more about us",
      href: "/about",
    },
    cards: [
      {
        title: "Maintenance and technical support",
        description: "Planned and responsive maintenance for plant and rotating equipment.",
        icon: "Wrench",
        status: "draft" as const,
      },
      {
        title: "Procurement and logistics",
        description: "Sourcing, purchasing and delivering industrial equipment and materials to site.",
        icon: "PackageCheck",
        status: "draft" as const,
      },
    ],
    imageSlot: "about",
    status: "draft" as const,
  },

  services: {
    eyebrow: "Our services",
    heading: "What we can do for your operations",
    status: "draft" as const,
    items: [
      // Core Services (9)
      {
        id: "global-maintenance-contracts",
        slug: "global-maintenance-contracts",
        title: "Global Maintenance Contracts",
        category: "core",
        summary: "Planned and responsive maintenance for plant and rotating equipment under a single agreement.",
        capabilities: [
          "Scheduled preventive maintenance programmes",
          "Breakdown response and fault diagnosis",
          "Condition monitoring and reporting",
          "Spare parts planning and lifecycle tracking",
        ],
        imageSlot: "maintenance",
        status: "draft",
      },
      {
        id: "epic-epcm-services",
        slug: "epic-epcm-services",
        title: "EPIC & EPCM Services",
        category: "core",
        summary: "Engineering, procurement, installation and commissioning, managed as one coordinated scope.",
        capabilities: [
          "Front-end engineering and design support",
          "Equipment and materials procurement",
          "Mechanical and electrical installation",
          "Testing, commissioning and handover documentation",
        ],
        imageSlot: "epic",
        status: "draft",
      },
      {
        id: "manpower-technical-staffing",
        slug: "manpower-technical-staffing",
        title: "Manpower & Technical Staffing",
        category: "core",
        summary: "Qualified engineers, technicians and project crews supplied for site and workshop work.",
        capabilities: [
          "Mechanical, electrical and instrumentation technicians",
          "Supervisors and project engineers",
          "Short-term and long-term deployment",
          "Onboarding to site safety requirements",
        ],
        imageSlot: "staffing",
        status: "draft",
      },
      {
        id: "construction-fabrication",
        slug: "construction-fabrication",
        title: "Construction & Fabrication",
        category: "core",
        summary: "Structural and mechanical fabrication, built to drawing and installed on site.",
        capabilities: [
          "Skids, frames, platforms and supports",
          "Pipe spooling and pressure-part fabrication",
          "Welding to approved procedures",
          "Inspection and quality records",
        ],
        imageSlot: "fabrication",
        status: "draft",
      },
      {
        id: "oem-services",
        slug: "oem-services",
        title: "OEM Services",
        category: "core",
        summary: "Supply and support for original-equipment parts, tooling and technical documentation.",
        capabilities: [
          "Sourcing of genuine spares",
          "Technical data and manual coordination",
          "Equipment upgrades and retrofits",
          "Support through the equipment lifecycle",
        ],
        imageSlot: "oem",
        status: "draft",
      },
      {
        id: "load-bank-services",
        slug: "load-bank-services",
        title: "Load Bank Services",
        category: "core",
        summary: "Load testing that proves generators and power systems perform before they go into service.",
        capabilities: [
          "Resistive and reactive load testing",
          "Commissioning and acceptance tests",
          "Periodic performance checks",
          "Test reports for operations teams",
        ],
        imageSlot: "load-bank",
        status: "draft",
      },
      {
        id: "pumps-compressors",
        slug: "pumps-compressors",
        title: "Pumps & Compressors",
        category: "core",
        summary: "Installation, overhaul and diagnostics for centrifugal and positive displacement pumps and compressors.",
        capabilities: [
          "Dismantling, inspection and rebuild",
          "Seal, bearing and wear-part replacement",
          "Alignment and vibration checks",
          "Workshop testing before return to service",
        ],
        imageSlot: "pumps",
        status: "draft",
      },
      {
        id: "turbines-generators",
        slug: "turbines-generators",
        title: "Turbines & Generators",
        category: "core",
        summary: "Maintenance and support for gas, steam and diesel-driven power generation equipment.",
        capabilities: [
          "Routine servicing and inspections",
          "Overhaul planning and execution",
          "Control and protection system checks",
          "Performance testing after repair",
        ],
        imageSlot: "turbines",
        status: "draft",
      },
      {
        id: "motors-drives",
        slug: "motors-drives",
        title: "Motors & Drives",
        category: "core",
        summary: "Servicing of AC and DC motors, variable frequency drives and control panels.",
        capabilities: [
          "Motor rewinding, repair and testing",
          "VFD installation and configuration",
          "Control panel assembly and fault finding",
          "Insulation and thermal testing",
        ],
        imageSlot: "motors",
        status: "draft",
      },

      // Other Services (6)
      {
        id: "procurement-logistics",
        slug: "procurement-logistics",
        title: "Procurement & Logistics",
        category: "other",
        summary: "Sourcing, purchasing and delivering industrial equipment and materials to site.",
        capabilities: [
          "Vendor identification and quotation",
          "Import and customs coordination",
          "Warehousing and transport",
          "Delivery tracking and documentation",
        ],
        imageSlot: "procurement",
        status: "draft",
      },
      {
        id: "pipeline-flowline-services",
        slug: "pipeline-flowline-services",
        title: "Pipeline & Flowline Services",
        category: "other",
        summary: "Installation, repair and maintenance of pipelines and flowlines.",
        capabilities: [
          "Pipe laying and tie-ins",
          "Flowline repair and replacement",
          "Pressure testing and flushing",
          "Coating and integrity support",
        ],
        imageSlot: "pipeline",
        status: "draft",
      },
      {
        id: "marine-services",
        slug: "marine-services",
        title: "Marine Services",
        category: "other",
        summary: "Vessel and marine equipment support for offshore and coastal operations.",
        capabilities: [
          "Marine equipment supply and repair",
          "Crew and technical support",
          "Logistics for offshore sites",
          "Equipment mobilisation by water",
        ],
        imageSlot: "marine",
        status: "draft",
      },
      {
        id: "electrical-submersible-pumps",
        slug: "electrical-submersible-pumps",
        title: "Electrical Submersible Pumps",
        category: "other",
        summary: "Supply, installation and servicing of submersible pumping systems.",
        capabilities: [
          "Pump and motor assembly",
          "Surface equipment and controls",
          "Performance monitoring",
          "Pull, inspection and rerun support",
        ],
        imageSlot: "esp",
        status: "draft",
      },
      {
        id: "filtration-fluid-management",
        slug: "filtration-fluid-management",
        title: "Filtration & Fluid Management",
        category: "other",
        summary: "Systems that keep fluids clean and equipment protected.",
        capabilities: [
          "Filter supply and replacement programmes",
          "Lubrication system servicing",
          "Fluid sampling and analysis coordination",
          "Flushing and contamination control",
        ],
        imageSlot: "filtration",
        status: "draft",
      },
      {
        id: "consultancy-services",
        slug: "consultancy-services",
        title: "Consultancy Services",
        category: "other",
        summary: "Practical technical advice for operators planning, running or improving facilities.",
        capabilities: [
          "Equipment reliability reviews",
          "Maintenance strategy planning",
          "Project scoping and cost review",
          "Technical support for tenders",
        ],
        imageSlot: "consultancy",
        status: "draft",
      },
    ] as ServiceItem[],
  },

  values: [
    {
      title: "Safety first",
      description: "Planning and conducting all work with strict attention to personal safety, environmental care, and equipment protection.",
      status: "draft",
    },
    {
      title: "Clear communication",
      description: "Transparent coordination with clients, suppliers, and field personnel at every project phase.",
      status: "draft",
    },
    {
      title: "Quality in every job",
      description: "Adhering to strict engineering drawings, procedures, and documented inspection milestones.",
      status: "draft",
    },
    {
      title: "Reliable delivery",
      description: "Delivering practical solutions on schedule with dedicated follow-through.",
      status: "draft",
    },
  ] as ValueItem[],

  hsse: {
    eyebrow: "Health, Safety, Security & Environment",
    heading: "Commitment to safe and responsible operations",
    intro: "At MEDDY GLOBAL SOLUTIONS LTD, safeguarding people, assets, and the environment is integral to our work in industrial facilities and field operations.",
    commitments: [
      {
        title: "Operational safety planning",
        description: "We assess hazards before work commences, ensuring all personnel are equipped with required PPE and brief on site-specific safety protocols.",
      },
      {
        title: "Environmental stewardship",
        description: "We handle lubricants, fluids, and industrial waste with care to minimise environmental impact and maintain clean work areas.",
      },
      {
        title: "Quality documentation",
        description: "We maintain clear records of inspections, torque logs, pressure tests, and commissioning checklists for every maintenance activity.",
      },
      {
        title: "Continuous verification",
        description: "We regularly review field practices and tool calibrations to uphold high technical standards across all client assignments.",
      },
    ] as HSSECommitment[],
    imageSlot: "hsse",
  },

  ctaBand: {
    heading: "Ready to discuss your engineering requirements?",
    paragraph: "Contact our team in Lekki, Lagos to discuss maintenance contracts, fabrication scopes, or equipment support.",
    primaryAction: {
      label: "Send an enquiry",
      href: "/contact",
    },
    directEmail: "info@meddyglobalsolutions.com",
  },

  footer: {
    legalNotice: "MEDDY GLOBAL SOLUTIONS LTD. All rights reserved.",
    summary: "Engineering, maintenance, fabrication and procurement services for industrial facilities, based in Lekki, Lagos, Nigeria.",
  },
};

