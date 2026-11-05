# MEDDY GLOBAL SOLUTIONS LTD — Corporate Website

Official corporate website for **MEDDY GLOBAL SOLUTIONS LTD**, presenting industrial engineering, plant maintenance, structural fabrication, rotating equipment servicing, and specialized procurement from Lekki, Lagos, Nigeria.

---

## 1. Quick Start & Local Development

### Prerequisites
- Node.js 18.18+ or 20+
- npm, pnpm, or yarn

### Installation & Run
```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the website in your browser.

### Production Build
```bash
# Build optimized production bundle
npm run build

# Start production server
npm run start
```

---

## 2. Design System & Brand Identity

The site layout, typography, proportions, and staggered card hierarchy faithfully reproduce the architectural composition of the supplied Conzone reference, re-skinned in MEDDY's authoritative corporate blue:

- **Primary Blue (`--meddy-blue`):** `#0CA3DC`
- **Deep Blue (`--meddy-blue-deep`):** `#087FB5`
- **Soft Blue (`--meddy-blue-light`):** `#CBEBFA`
- **Charcoal (`--meddy-charcoal`):** `#292D32`
- **Ink / Typography (`--meddy-ink`):** `#20262B`
- **Surfaces:** Pure White `#FFFFFF` & Off-white `#F5FAFC` with hairline `#E4EDF2`
- **Headings:** Manrope (Clean geometric sans-serif)
- **Body & Interface:** Inter (Highly legible neutral sans-serif)

---

## 3. Image Replacement via Manifest

All imagery is cataloged in [`content/image-manifest.ts`](content/image-manifest.ts).

To replace any visual slot with real company photography without touching React code:
1. Save your photograph in `/public/images/` with the designated slot filename (e.g. `hero.webp`, `about.webp`, `pumps.webp`).
2. Alternatively, update the path, alt text, and dimensions in `content/image-manifest.ts`.

---

## 4. Content Architecture & Verified Information

Site content is centralized in [`content/siteContent.ts`](content/siteContent.ts):
- **Verified Facts:** Company legal name (`MEDDY GLOBAL SOLUTIONS LTD`), registered office address (`5B, Olushola Agbaje Street, Off Road 13, beside Ascon Fueling, Lekki, Lagos, Nigeria`), and email channel (`info@meddyglobalsolutions.com`).
- **Deliberate Omissions (Client Directives):** No telephone numbers, no WhatsApp, no tagline, no fake client logos, no fake certifications, no unverified statistics.
- **Draft Services (Appendix A):** All 15 core and other services are marked with `status: "draft"` and can be toggled via the single switch `SHOW_DRAFT_SERVICES`.
- **Client Action Items:** See [`CONTENT-REQUIRED.md`](CONTENT-REQUIRED.md) for outstanding items before live launch.

---

## 5. Contact Form Integration Boundary

Enquiries submitted through `/contact` post to `/api/contact`:
- Honeypot anti-spam protection is integrated.
- Server-side validation enforces clean email, name, and message format.
- To enable live email delivery via Resend, configure `RESEND_API_KEY` and `CONTACT_RECIPIENT=info@meddyglobalsolutions.com` in your production environment variables.

