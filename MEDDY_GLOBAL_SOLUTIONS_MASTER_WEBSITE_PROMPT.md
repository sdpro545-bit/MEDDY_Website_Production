# MEDDY GLOBAL SOLUTIONS LTD — MASTER WEBSITE DESIGN & DEVELOPMENT PROMPT

> **Purpose:** Use this specification in Antigravity as the primary project brief for designing, building, testing and preparing the official website for MEDDY GLOBAL SOLUTIONS LTD.
>
> **Working rule:** Build the website, not just a concept or a static mockup. Inspect the existing project before changing anything. Preserve working functionality and use the project's existing framework and conventions unless there is a clear technical reason to change them.

---

## 0A. CLIENT DIRECTIVES — THESE OVERRIDE ANY CONFLICTING STATEMENT BELOW

These directives were issued by the person commissioning the site after the first draft of this brief. Where a later section says "do not publish X until supplied" and this section supplies X, **this section wins**. Every other accuracy rule in this document stays fully in force.

### 0A.1 Pre-flight (do this before anything else)

1. Read `AGENTS.md` in the project root in full. It is the complete operating standard; there is no other specification file to look for.
2. Follow the task sequence and the completion-report format in `AGENTS.md`.

### 0A.2 Supplied files and where they must live

| Asset | Expected project path |
|---|---|
| Visual reference (Conzone screenshot) | `/references/conzone-reference.png` |
| MEDDY logo / emblem | `/public/brand/logo.png` (also used to derive the favicon) |
| Letterhead | `/references/meddy-global-letterhead.docx` |
| Services copy | `/content/services.md` (text in Appendix A) |
| Image prompts | `/content/image-prompts.md` (text in Appendix B) |

If a file is not at its expected path, search the project for it. If it truly is absent, say so and continue with clearly stated limitations; never invent its contents. Wherever this brief mentions `/references/conzone-reference.png`, it means the Conzone reference file above.

### 0A.3 Newly confirmed facts and deliberate omissions

- **Email (confirmed):** `info@meddyglobalsolutions.com`. Use it as the only contact channel: top bar, contact page, footer, `mailto:` links and the enquiry-form recipient (read from an environment variable, defaulting to this address).
- **No phone number and no WhatsApp number anywhere.** This is deliberate, not an omission. Do not add click-to-call.
- **No tagline anywhere.** A descriptive hero headline is allowed (see Appendix E); a slogan is not.
- No opening hours and no social links until supplied.

### 0A.2b Business direction (client-directed draft)

The client has directed that the site be presented to them as an **industrial engineering and technical services company** and has asked for a service menu modelled on the *kind* of services shown on https://de-coon.com/. Therefore:

- Use the services in **Appendix A** on the Home page, Services index and Services detail pages.
- All Appendix A content is status **`draft`** (client review pending). Keep it in the central content file with `status: "draft"` and a single switch `SHOW_DRAFT_SERVICES` (default `true`) so it can be hidden or edited in one place after the client reviews it.
- The wording is original. Do not copy, closely paraphrase or import any text, project, client, figure, certification or claim from de-coon.com or any other company.
- Do not add anything beyond Appendix A that asserts facts about MEDDY: no years in business, no counters, no client or partner names or logos, no ISO or other certifications, no awards, no testimonials, no named past projects, no team profiles.

### 0A.4 Layout and design directive

The finished site must **look like the supplied Conzone reference**: same section order, composition, proportions, rounded-card language, type hierarchy and photographic presence, re-skinned in MEDDY blue. **Appendix D is binding** and describes what to reproduce, section by section. Build the hero and About sections first, compare them to the reference by screenshot, and correct before continuing.

### 0A.5 Imagery directive

- **Generate every image** with the available image-generation tool, using Appendix B. Save as WebP in `/public/images/` with the exact filenames given.
- **Do not add any "AI generated", "illustrative" or similar labels, badges or watermarks to the interface.**
- Reference images only through `/content/image-manifest.ts` (slot name → file path, alt text, aspect ratio) so the client can replace any picture later by dropping a new file at the same path without touching code. Add a short README note explaining this.
- Public copy must never claim the generated pictures show MEDDY's own team, premises or completed work: captions and alt text describe the scene ("Technician servicing an industrial pump") and never name a client, site, date or project.
- Section 7.3's defect checklist (deformed hands, garbled text, fake logos, cloned people, impossible geometry) still applies. Regenerate any image that fails it.

### 0A.6 Motion directive

The client wants a premium, animated site: masked text reveals, smooth page transitions on every route, scroll reveals and polished hover states. **Appendix C** replaces the restrained-motion limits in Section 9.5.

---

## 0. YOUR ROLE AND STANDARD OF EXECUTION

Act as a senior multidisciplinary digital team consisting of:

- Brand and digital-art director
- Senior UI/UX designer
- Corporate website strategist
- Senior frontend engineer
- Backend/integration engineer where the existing stack requires one
- Accessibility and responsive-design specialist
- Technical SEO specialist
- Performance, security and quality-assurance engineer

Your assignment is to deliver a credible, distinctive, polished corporate website for **MEDDY GLOBAL SOLUTIONS LTD**.

The standard is premium agency work: intentional composition, disciplined typography, excellent photography, precise spacing, a coherent design system, robust responsive behaviour, clean implementation and careful final QA.

Do not settle for a generic AI-generated business website. Do not simply install a template, change its logo and colours, and call the work complete. Study the reference, understand its composition, then recreate its design logic using MEDDY's own identity.

**Build for quality, accuracy, usability and credibility—not for visual effects alone.**

## 1. SOURCE FILES, SOURCE PRECEDENCE AND FACTUAL ACCURACY

First inspect all supplied project files and assets. The source material supplied for this assignment includes:

1. **MEDDY GLOBAL SOLUTIONS LTD letterhead** — `meddy_global_letterhead.docx` (note: the header image in it still shows an older Port Harcourt address and phone number; **ignore those**; the confirmed address is the Lekki address below)
2. **MEDDY logo/emblem** — `Favicon.png`
3. **Website visual reference screenshot** — `/references/conzone-reference.png`
4. **Reference website** — `https://de-coon.com/`

The supplied letterhead is the source of truth for the company details currently confirmed. It is a letterhead, not a full company profile. It confirms the company identity and address only. Do not pretend that it contains a company history, service catalogue, mission, vision, certifications or project portfolio.

### 1.1 Confirmed company information

Use the following details exactly:

- **Company name:** MEDDY GLOBAL SOLUTIONS LTD
- **Address:** 5B, Olushola Agbaje Street, Off Road 13, beside Ascon Fueling, Lekki, Lagos, Nigeria
- **Logo:** The supplied MEDDY emblem showing the stylised MG mark inside a blue circular form with a flame above it.
- **Email:** info@meddyglobalsolutions.com (confirmed by the client; see Section 0A.3)

The company name and address may be displayed on the website. Preserve the address wording. Minor typographic capitalisation may be normalised for presentation, but do not change the actual location.

### 1.2 Important information that has NOT been supplied

The current source material does not establish:

- The company's industry or exact business activities
- Its products or services
- Its mission, vision, values or founding story
- Its incorporation year or registration number
- Its directors, leadership, staff or qualifications
- Its certifications, licences, memberships or regulatory approvals
- Its clients, partners, suppliers or testimonials
- Its project history, locations, contract values or performance statistics
- Its telephone and WhatsApp numbers (deliberately not published; email is now confirmed in 0A.3)
- Its opening hours or social-media accounts
- Its website domain name

**Never invent any of these details.** (Items the client has since supplied or directed are listed in Section 0A and override this list; the draft services in Appendix A are the only business description permitted.) Do not borrow information from DE COON, Conzone, another company, a stock-image caption, search results or a generic template. Do not infer MEDDY's industry from its name, logo, flame symbol or the visual reference.

Do not publish fake statistics, sample client logos, fabricated testimonials, invented case studies, invented staff profiles, placeholder contact details or unverified certifications. Do not create false claims such as “industry leader”, “over 20 years of experience”, “trusted by 100+ clients”, “globally recognised”, “ISO certified” or “serving all of Africa”.

### 1.3 Missing-content handling

Proceed with design and development using the confirmed facts. Keep all copy in a central, clearly named content/data file so that approved information can be added without rebuilding the design.

Use these rules:

- If a content section has no verified information, do not fabricate its contents.
- Do not display square-bracket placeholders such as `[ADD SERVICES]` on the public website.
- Do not render fake cards to fill empty space.
- Hide optional sections until real content is supplied, or create a neutral, visually complete transition to the next section.
- Where a copy concept is needed to test the layout, mark it internally as **DRAFT — CLIENT APPROVAL REQUIRED**. Never mistake draft copy for a confirmed company fact.
- Keep an internal `CONTENT-REQUIRED.md` or equivalent file listing every missing fact, image and integration needed before launch.
- **Exception (Section 0A.2b):** the draft services in Appendix A may be displayed publicly, flagged `draft` in the content file and controlled by `SHOW_DRAFT_SERVICES`.
- Do not interrupt implementation to ask questions that are not essential to building the site. Continue with safe, neutral choices and record the outstanding items for approval.

### 1.4 How to use the reference URL

Use the supplied screenshot (`/references/conzone-reference.png`) as the primary reference for the visible visual direction and first-fold composition.

Use `https://de-coon.com/` only as a secondary reference for the organisation of a fuller corporate website and the types of inner pages/sections a business site may contain. It is a separate business. Do not reuse its wording, service catalogue, clients, claims, contact details, certifications, logos or company identity.

The Conzone screenshot and the live DE COON website are not evidence of what MEDDY does. The client has directed an industrial engineering and technical services presentation (Section 0A.2b), delivered only through the draft content in Appendix A. Do not add sector claims, figures or proof beyond it, and do not portray MEDDY as a construction contractor or any business that Appendix A does not describe.

---

## 2. PROJECT OBJECTIVE

Create a complete, responsive corporate website for MEDDY GLOBAL SOLUTIONS LTD that:

1. Introduces the company clearly and professionally.
2. Makes the company's identity and verified information easy to understand.
3. Uses premium, relevant visual storytelling rather than generic stock imagery.
4. Gives visitors an obvious route to make an enquiry.
5. Presents approved company information in a structured, attractive and credible way.
6. Works exceptionally well on desktop, tablet and mobile.
7. Is technically sound, accessible, search-friendly and maintainable.
8. Can grow when the client supplies the complete company profile, service details, contact information, projects and approved photography.

The final product must be a working website in the existing project—not a Figma-only proposal, screenshot, static HTML preview or design description.

## 3. VISUAL REFERENCE: WHAT TO RECREATE

Study the supplied Conzone reference screenshot carefully. Reproduce its visual principles and section rhythm without copying its company identity or exact copy.

### 3.1 First screen / hero composition

The reference opens with a full-width cinematic hero. Its principal elements are:

- A slim navigation row overlaid at the top of the hero.
- A compact brand mark and wordmark on the left.
- A restrained navigation menu across the upper centre/right.
- A prominent rounded call-to-action at the far right.
- A large two-line headline, aligned left and positioned in the open area of the photograph.
- A short supporting paragraph directly below the headline.
- Two clear action buttons beneath the paragraph.
- A carefully selected, high-resolution hero photograph occupying the majority of the visual field.
- A subtle overlay that protects text legibility without making the photograph muddy.

The screenshot places the main subject on the right and the text on the left. Preserve this compositional logic where the chosen image allows it: **leave a clean text-safe area and position the visual subject opposite the headline**.

For MEDDY, replace the reference's orange buttons with the brand's blue. The hero photograph must be a generated image from Appendix B (`hero.webp`: an industrial facility at golden hour with the subject on the right and open sky on the left for text). Do not use excavators, building sites or other scenes that Appendix A does not support.

### 3.2 Credibility strip below the hero

The reference has a narrow dark strip beneath the hero with a trust statement and a row of client marks.

For MEDDY:

- Keep the transition from hero to credibility strip.
- Use client/partner logos only after they are supplied and approved.
- Never invent a “trusted by” number or put unrelated brand marks in this strip.
- With no approved logos, replace the logo row with a row of capability keywords taken from Appendix A (for example: Maintenance, Fabrication, Pumps & Compressors, Pipelines, Marine, Procurement) in white, evenly spaced, occupying the same space and gradient-over-photo position as the reference's logo row. Replace the "Trusted by" caption with **Lekki, Lagos, Nigeria**.
- Do not leave fake logo placeholders visible in production.

### 3.3 About/company introduction section

Recreate the reference's spacious white, two-column section:

- Left column: small eyebrow label, strong headline, concise company introduction and a clear button.
- Lower area of the left column: two compact feature blocks/cards, only when their content can be supported by approved information.
- Right column: a large, professionally art-directed photograph with subtle corner rounding.

Keep the layout generous and balanced. Use real company photography when available. Do not use a fabricated employee/team photo and present it as MEDDY's actual staff.

### 3.4 Capabilities/service cards

The screenshot then introduces a centred section title and three large photographic cards.

For MEDDY:

- Build the card system so it can support the real service categories when supplied.
- Use the first three Core Services in Appendix A as the initial three large cards, followed by a "View all services" link to the full Services page.
- On desktop, stagger the three cards vertically exactly as the reference does (each card's top edge a little lower than the previous one, differing by roughly 25–30px at 1440px) and use tall portrait cards with large rounded corners. On mobile, stack them without the stagger.
- Each card should use one relevant, high-quality image, a concise title, a short factual description and a clear detail link where a detail page exists.
- Do not put long paragraphs over busy photographs. Use carefully controlled bottom overlays or a caption area with sufficient contrast.

### 3.5 Overall visual qualities to preserve

- Strong, confident, highly legible typography.
- Clear hierarchy between navigation, eyebrow labels, headings, body copy and calls to action.
- Spacious white sections.
- Large photographic moments with intentional crops.
- Carefully aligned columns and consistent content widths.
- Rounded image corners and restrained card treatment.
- A clear visual rhythm between full-width sections and contained content sections.
- Consistent CTA placement and shape.
- Premium simplicity: no decorative clutter, unnecessary gradients, excessive shadows or random animations.

Do not reproduce the orange accent colour from the reference. The reference guides the composition; the MEDDY logo guides the brand identity.

---

## 4. MEDDY BRAND SYSTEM

### 4.1 Logo usage

Use the supplied logo asset as the authoritative logo. Inspect the asset and preserve its original geometry, proportions, colour relationships and flame shape.

- Never redraw, reinterpret, distort, stretch, skew, crop or rotate the emblem.
- Never replace the MG mark with typed letters.
- Never use AI to recreate the logo.
- Do not add an outline, bevel, glow or shadow that changes its identity.
- Preserve clear space around the logo.
- Make sure it remains legible at navigation size and on high-density screens.
- Use the full supplied logo in the main header where practical; use the same approved emblem for the favicon/app icon.
- If the supplied image contains transparent pixels, preserve transparency. Do not introduce a black background accidentally.
- If the asset is too large or unsuitable for web delivery, create optimised web formats from the original without changing the artwork.
- Do not create a white or monochrome logo variant unless an official variant is supplied or the client approves it.

### 4.2 Logo-derived colour palette

Use these as the initial design tokens. They are approximate digital samples from the supplied logo; preserve the logo asset itself rather than recolouring it.

```css
:root {
  --meddy-blue: #0CA3DC;
  --meddy-blue-deep: #087FB5;
  --meddy-blue-light: #CBEBFA;
  --meddy-charcoal: #292D32;
  --meddy-ink: #20262B;
  --meddy-white: #FFFFFF;
  --meddy-off-white: #F5FAFC;
  --meddy-border: #E4EDF2;
  --meddy-muted: #64727C;
}
```

Colour application:

- **Primary blue:** main action buttons, selected navigation states, links, small brand accents and selected icon strokes.
- **Deep blue:** hover/focus states and dark-blue overlays.
- **Light blue:** restrained background panels, subtle separators and secondary accents.
- **Charcoal/ink:** headings, navigation and body text.
- **White/off-white:** primary surfaces and breathing space.
- **Muted grey:** secondary text and metadata.

Avoid making every section blue. The site should remain mainly white, with blue used deliberately to create hierarchy and recognition.

Do not introduce the reference's orange or another unrelated accent colour as a competing brand colour. Functional status colours may be used sparingly where required for form validation.

### 4.3 Typography

Choose a contemporary, clean, geometric sans-serif family that supports excellent corporate readability. Preferred direction:

- **Headings:** Manrope or a visually comparable modern geometric sans.
- **Body/UI:** Inter or a visually comparable neutral sans.

If the current project already uses an excellent, properly loaded font family, evaluate it before adding another. Avoid loading unnecessary font families or weights.

Typography rules:

- Use a controlled type scale with clear desktop, tablet and mobile sizes.
- Use strong but not excessively heavy headings.
- Avoid thin body text, over-tight tracking, awkward line breaks and excessively wide paragraph measures.
- Use sentence case for most interface labels; avoid unnecessary all-caps headings.
- Keep paragraph line length comfortable, generally around 55–75 characters where practical.
- Use deliberate heading widths so each headline wraps into balanced lines.
- Do not use a different font on every section.

### 4.4 Buttons and controls

Create a reusable button system:

- Primary: filled MEDDY blue with white text.
- Secondary: white/transparent or soft-blue treatment with a clear border and dark text.
- Text link: minimal, with a subtle directional cue where useful.
- All buttons need visible hover, focus, pressed and disabled states.
- Use a consistent radius and padding system.
- Ensure buttons have usable touch targets on mobile.
- Do not use the orange button treatment from the reference.

---

## 5. INFORMATION ARCHITECTURE AND PAGE PLAN

Build a coherent site structure. Keep navigation simple and make every visible link functional.

### 5.1 Recommended primary navigation

Use a restrained navigation such as:

- Home
- About
- Services (from Appendix A, draft)
- Capabilities (the "Capabilities in Action" page, see 5.5)
- HSSE & Quality (commitments only, no certification claims)
- Contact
- Primary CTA: **Make an Enquiry** or **Contact Us**

Header top bar (above the main nav): show the email address and "Lekki, Lagos" only. No phone, no hours. Do not display empty pages or menu items that lead to unfinished content. If a section is not supported yet, omit it from the public navigation until populated.

### 5.2 Home page

Recommended order:

1. Hero / first impression
2. Credibility or company-location strip
3. Company introduction / About teaser
4. Key capabilities or services (only when verified)
5. Company differentiators / approved value points (only when supplied)
6. Projects / selected work (only when genuine records and images exist)
7. A concise enquiry CTA
8. Footer with confirmed company identity and address

The homepage should tell visitors what they can confidently know about MEDDY, make the brand memorable, and guide them toward an enquiry. Do not fill the homepage with generic filler sections.

### 5.3 About page

Build a polished page framework for:

- Company overview
- Background/history
- Mission and vision
- Values
- Leadership/team
- Accreditations or memberships, if applicable

Only publish subsections supported by approved company material. Until those materials arrive, keep the underlying content structure ready but do not show false facts or empty content blocks.

### 5.4 Services page and service detail pages

Create a reusable service architecture only when the company supplies its actual service list. Each real service detail page may include:

- Service title and short factual summary
- Relevant supporting image
- Scope/capabilities
- Process or delivery approach
- Appropriate project evidence (if available)
- Related services (if available)
- Enquiry CTA

Do not invent service titles, technical specifications, guarantees, service coverage or industries served.

### 5.5 Projects / portfolio page

Because no real project records exist, build this page as **"Capabilities in Action"**: image-led cards, one per capability from Appendix A, each with a scene image, a capability title and a one-line description of the *type* of work. Never show a client, project name, location, completion date, contract value, quantity or outcome. When real projects are supplied later, convert the cards into project records without changing the layout.

### 5.6 Contact page

The address is confirmed and must be included:

**5B, Olushola Agbaje Street, Off Road 13, beside Ascon Fueling, Lekki, Lagos, Nigeria**

Create:

- A clear contact heading.
- The confirmed office address.
- A working enquiry form.
- A map/directions link based on the exact supplied address.
- The confirmed email with a `mailto:` link. No phone, WhatsApp or hours.

Do not put a fabricated phone number, email, WhatsApp link or opening hours on the site.

### 5.7 Footer

The footer should include:

- Correct MEDDY logo and company name.
- A concise, approved description only when available.
- Useful page links that actually work.
- The confirmed office address.
- Contact channels only when verified.
- Social links only when supplied.
- A functional copyright year generated dynamically, not hardcoded to an old year.

Do not place unrelated partner logos, fake review badges or certification seals in the footer.

---

## 6. HOMEPAGE DESIGN SPECIFICATION

### 6.1 Header/navigation

Desktop:

- Transparent/overlay header over the hero image where contrast permits.
- MEDDY logo aligned left.
- Compact menu with consistent spacing.
- One high-visibility blue CTA aligned right.
- Header must remain clear and legible against the hero background.
- When scrolling, transition to a clean solid or lightly translucent surface only if it improves usability; keep the change subtle and stable.

Mobile:

- Compact brand mark on the left.
- Accessible menu toggle on the right.
- Menu opens/closes predictably and can be used by keyboard and screen readers.
- No navigation overflow, overlapping logo or tiny tap targets.
- The CTA must remain accessible within the opened menu or mobile header.

### 6.2 Hero

Use the reference proportions and composition as a strong starting point:

- Full-width visual area with a premium, carefully cropped photograph or neutral brand-led visual.
- Desktop hero should feel substantial, generally around 70–85vh depending on viewport and content.
- Keep the main text inside a consistent page container.
- Put the strongest text in the cleanest part of the hero image.
- Use a gradient overlay only as strong as needed for readability.
- Avoid excessive darkening, artificial haze, obvious cut-outs or noisy effects.
- The hero must adapt elegantly to mobile; do not simply shrink the desktop crop.

The final hero wording must use approved company information. While that information is missing, use the company name and a neutral, non-claim-based introduction or leave the headline/copy in a clearly identified draft content field. Do not publish unapproved performance claims.

### 6.3 Feature/credibility strip

Make a tight transition below the hero. Use a simple dark charcoal/deep-blue surface or a visually connected image-to-dark transition. Do not invent clients or statistics. The confirmed location may be featured if a short factual line is needed.

### 6.4 About section

Use a strong asymmetric two-column layout. Keep the heading and copy on the left and a large image on the right. Use two feature cards only when there are two real, approved points to communicate. Do not write generic, unsupported feature descriptions simply to fill the cards.

### 6.5 Services/capabilities section

Create reusable cards with a consistent image ratio, predictable title placement, restrained overlay, and hover/focus behaviour. The layout must support one, two, three or more real service items without looking broken. Do not hardwire exactly three fake items.

### 6.6 Enquiry CTA

Add one clear conversion section near the bottom. Keep the copy short and purposeful. The action should lead to the contact form or a verified contact channel. Do not add a fake “Call now” link when no number has been supplied.

---

## 7. PHOTOGRAPHY AND VISUAL ASSET DIRECTION

The reference depends heavily on photography. Image quality is therefore a core design requirement, not a finishing detail.

### 7.1 Image selection

The sector direction is set in Section 0A.2b and imagery comes from Appendix B. The following applies to any additional image beyond Appendix B:

- Do not assume construction, oil and gas, energy, real estate, manufacturing, technology or any other sector.
- Do not use excavators, hard-hat workers, offshore rigs, factories, laboratories or other sector-specific imagery as if it represents MEDDY.
- Use a neutral brand-led treatment or a non-misleading corporate environment visual until relevant photography is approved.

Once the sector is confirmed, select authentic, relevant images that communicate the company's actual work and audience.

### 7.2 Image quality requirements

- Use high-resolution, clean, professionally art-directed photography.
- Prefer natural, believable lighting and realistic proportions.
- Match image colour temperature and contrast across the website.
- Ensure subjects are composed for the intended crop and leave adequate space for text where needed.
- Never stretch an image to fit a container.
- Use `object-fit: cover` with deliberate `object-position` values.
- Use responsive image sizes and modern formats such as WebP/AVIF when supported.
- Lazy-load below-the-fold imagery; prioritise the hero asset appropriately.
- Write useful alt text for informative images; use empty alt text for purely decorative visuals.

### 7.3 Avoid AI-generated visual defects

Reject any image with:

- Deformed hands, faces, limbs, tools, equipment or architecture.
- Impossible geometry or inconsistent perspective.
- Garbled text, fake logos, invented signage or watermarks.
- Repeated cloned people or objects.
- Incorrect safety equipment or impossible work scenes.
- Plastic-looking skin, overprocessed HDR, excessive sharpness or synthetic textures.
- Visual elements that imply a business activity MEDDY has not confirmed.

Generated images are approved for this build (Section 0A.5) and carry no on-screen labels. They must remain non-deceptive in context: no caption, heading or alt text may present them as MEDDY's own team, premises, equipment or completed projects. Keep them swappable through the image manifest so real photography can replace them.

### 7.4 Asset management

- Keep media in a clearly named asset directory.
- Use descriptive filenames.
- Do not hotlink random image URLs from untrusted sources.
- Record asset source/licensing information.
- Optimise image file sizes without visible quality loss.
- Keep the original supplied MEDDY logo unchanged in the source assets.

---

## 8. CONTENT AND COPYWRITING RULES

Write in clear, natural, professional English. The voice should feel confident, human and specific—not robotic, exaggerated or filled with generic marketing phrases.

### 8.1 Writing style

- Short, meaningful headings.
- Concise body paragraphs.
- Concrete language.
- No repetitive claims across every section.
- No inflated language such as “revolutionary”, “world-class”, “unparalleled”, “best-in-class” or “industry-leading” unless the client supports and approves the claim.
- No awkward keyword stuffing.
- No placeholder Latin text.
- No generic testimonials.
- No fabricated first-person company history.

### 8.2 Content model

Centralise the site content in a well-structured data source (for example `siteContent.ts`, `content.json` or the project's existing CMS). Separate confirmed facts from draft copy and missing content.

Suggested internal content status fields:

- `verified`: confirmed by supplied or client-approved source.
- `draft`: proposed wording requiring client approval.
- `missing`: not supplied; do not display as fact.

Do not show these status labels on the public website. They are for content management and QA.

### 8.3 No fabricated proof

Never create placeholder testimonials, client logos, performance metrics, case studies, awards, badges, certifications, registration numbers or staff biographies. Empty proof is better than false proof.

---

## 9. INTERACTION AND FUNCTIONAL REQUIREMENTS

Every visible interactive element must work.

### 9.1 Navigation

- All menu links must resolve to real pages or valid section anchors.
- Active page state must be clear.
- Mobile menu must work with touch, mouse and keyboard.
- Escape should close an open menu where appropriate.
- Maintain visible keyboard focus.

### 9.2 Enquiry form

Build a professional, accessible contact form with appropriate fields, for example:

- Full name — required
- Email address — required
- Phone number — optional until client preference is confirmed
- Subject or enquiry category — optional; do not populate it with invented service categories
- Message — required

Requirements:

- Validate fields on both client and server where a backend exists.
- Show clear inline validation messages.
- Preserve the visitor's input when a non-destructive validation error occurs.
- Provide a clear loading state and success/error feedback.
- Protect against spam using an appropriate honeypot, rate limiting and/or a reputable anti-spam method.
- Never claim that an enquiry has been sent unless it has actually been accepted by the configured endpoint.
- Do not hardcode credentials or email API keys in frontend code.
- Recipient: `info@meddyglobalsolutions.com`, read from an environment variable (e.g. `CONTACT_RECIPIENT`) with a mail provider such as Resend or SMTP configured through env vars. If the provider key or mailbox is not yet set up, build the integration boundary, keep the form honest (never show success unless the provider accepted the message), and document exactly what must be configured before launch.

### 9.3 Contact/location actions

- Use the exact confirmed address.
- Add a directions link based on the address.
- Use a map embed only if it resolves to the correct location and does not expose a misleading pin.
- Add a `mailto:` action for the confirmed email. Do not add click-to-call or WhatsApp; no numbers are published.

### 9.4 Cards and CTAs

- Make interactive cards keyboard accessible.
- Do not make a whole card clickable if it contains nested links that create confusing behaviour.
- Use meaningful link text, not repeated “Click here”.
- Ensure every CTA leads somewhere useful.

### 9.5 Motion

Motion is a core part of the premium feel. Follow **Appendix C** in full. In summary: masked text reveals, one consistent page transition on every route, scroll-triggered image reveals, refined hover states, one shared easing curve, transform and opacity only, and full `prefers-reduced-motion` support. Still forbidden: scroll-jacking that takes control from the user, bouncing buttons, spinning logos, continuous looping background animation and motion that delays access to content.

---

## 10. RESPONSIVE DESIGN — NO COMPROMISE

Design and test for at least these viewport classes:

- Large desktop: 1440px and above
- Standard desktop/laptop: 1280px and 1366px
- Tablet: 768px and 834px
- Mobile: 390px and 430px
- Narrow mobile: 320px–360px

Requirements:

- No horizontal scrolling.
- No clipped headings or buttons.
- No unreadably small navigation.
- No overlapping hero text and image subjects.
- No images with incorrect focal points.
- No oversized mobile hero that pushes all useful content too far down.
- Cards must reflow logically, not simply shrink.
- Use sensible spacing and fluid typography.
- Contact forms must be comfortable to use on touchscreens.
- Footer must stack cleanly on mobile.

Do not treat responsive design as a final CSS patch. Design the responsive behaviour as part of each component.

---

## 11. ACCESSIBILITY, SEO AND SEMANTIC QUALITY

### 11.1 Accessibility

Target WCAG 2.2 AA practices where applicable:

- Semantic HTML landmarks and heading order.
- Sufficient text/background contrast.
- Keyboard-operable menus, forms and controls.
- Visible focus styles.
- Labels for every form input.
- Helpful validation and error announcements.
- Appropriate alternative text.
- No information communicated by colour alone.
- Reduced-motion support.
- Adequate touch target sizes.

### 11.2 SEO

Implement the technical foundations:

- Unique, accurate page titles and meta descriptions.
- One clear H1 per page.
- Logical H2/H3 hierarchy.
- Human-readable URLs.
- Canonical tags once the production domain is known.
- XML sitemap and robots configuration appropriate to the framework.
- Open Graph and social sharing metadata using approved assets.
- Descriptive image filenames and alt text.
- Internal links between relevant pages.
- Structured data using only verified company information.

Do not invent a business category, opening hours, phone number, price range, founding year, service area or other structured-data field. Do not publish a made-up canonical domain.

### 11.3 Local SEO

The confirmed address may be used accurately. Do not claim multiple office locations or service coverage across cities/states/countries unless verified. Do not add unverified map coordinates.

---

## 12. PERFORMANCE AND TECHNICAL ENGINEERING

Inspect the existing repository before implementation. Identify the framework, build tools, routes, components, styles, dependencies and any existing integrations. Preserve useful work.

Engineering expectations:

- Use the existing framework and established conventions unless there is a strong reason not to.
- Create reusable, maintainable components.
- Keep content separate from layout.
- Avoid unnecessary dependencies.
- Avoid duplicated components and styling rules.
- Use responsive image sources and proper image dimensions to prevent layout shifts.
- Avoid unnecessary client-side JavaScript.
- Lazy-load non-critical media and components.
- Prioritise the first-screen visual assets.
- Minimise layout shift and blocking resources.
- Ensure errors are handled gracefully.
- Keep secrets in environment variables.
- Never commit API keys or credentials.

Aim for strong Core Web Vitals and a fast, stable experience on typical Nigerian mobile networks as well as high-speed desktop connections. Do not sacrifice visual quality to chase a score with broken or misleading optimisations.

If a third-party integration is not configured, document the requirement. Do not pretend it works.

---

## 13. SECURITY AND PRIVACY

- Validate and sanitise all user-submitted data.
- Protect server endpoints against spam and abuse.
- Apply rate limits to form submissions where the stack supports it.
- Do not expose credentials or private configuration in browser code.
- Avoid unnecessary collection of personal data.
- Do not add tracking pixels, analytics or third-party scripts without a legitimate project requirement and appropriate consent/configuration.
- If analytics or cookie consent is added, make the implementation accurate and functional; do not add decorative consent popups that do nothing.
- Do not create fake legal policies. Flag any required privacy, data-retention or terms content for client/legal review.

---

## 14. DESIGN SYSTEM AND COMPONENT ARCHITECTURE

Create a documented and reusable design system including:

- Colour tokens
- Typography scale
- Spacing scale
- Container widths
- Grid rules
- Button variants
- Input and form states
- Navigation states
- Card patterns
- Image aspect ratios
- Border radii
- Divider and border styles
- Responsive breakpoints
- Motion/transition tokens

Use a consistent content container. Keep alignments exact across the header, hero text, section headings, card grids and footer columns.

Do not use the same three-card grid for every section. Vary composition intentionally where the content warrants it: asymmetric two-column layouts, editorial text/image blocks, photographic cards and restrained full-width CTA sections. The visual result should feel designed, not mechanically assembled.

### Visual anti-patterns to avoid

- Generic gradient blobs behind every heading.
- Excessive glassmorphism.
- Unnecessary neon effects.
- Random abstract 3D icons.
- Inconsistent border radii.
- Too many shadows or floating cards.
- Dense sections with no breathing room.
- Tiny grey copy on white backgrounds.
- Oversized rounded pills everywhere.
- Generic dashboard layouts on a corporate marketing website.
- Repeated filler sections that add no information.
- Arbitrary decorative line patterns.
- Stock photographs that do not match the actual business.
- Fake client logos or trust badges.
- Emoji used as a substitute for professional icons.
- AI-generated placeholder text or nonsensical labels.

---

## 15. BUILD WORKFLOW — EXECUTE IN THIS ORDER

### Phase 1 — Audit and understand

1. Complete the pre-flight in Section 0A.1 (read `AGENTS.md`), then inspect the entire existing project and its structure.
2. Locate all supplied company files and image assets.
3. Read the letterhead and extract only the confirmed information.
4. Inspect the logo at full resolution and note its proportions, transparency and colours.
5. Inspect the reference screenshot carefully: hero, navigation, spacing, imagery, card layout, section transitions and footer direction where visible.
6. Review the reference URL for structural inspiration only.
7. Record the missing content and integration details.
8. Do not start by blindly replacing the existing codebase.

### Phase 2 — Define the design system

1. Establish logo-safe usage.
2. Define the MEDDY colour tokens.
3. Select and implement the typography system.
4. Define container widths, spacing, grids and breakpoints.
5. Define buttons, navigation, cards, forms and image treatments.
6. Create a small set of reusable components.

### Phase 3 — Design the page composition

1. Build the header and hero first.
2. Match the supplied reference's balance of image, text and CTA placement.
3. Build the credibility/location strip.
4. Build the company introduction section.
5. Build conditional service/project components that can accept verified content.
6. Build the enquiry section and footer.
7. Extend the design to About, Services/Service Details and Contact only where the project content supports those pages.

### Phase 4 — Implement functionality

1. Wire every navigation item and CTA.
2. Implement mobile navigation.
3. Implement the enquiry form and its real submission boundary.
4. Add the verified address and correct directions link.
5. Connect any approved integrations.
6. Add accessible states and error handling.

### Phase 5 — Content and asset integration

1. Use only approved company information.
2. Add real company images or approved, correctly licensed supporting imagery.
3. Do not invent project or employee photography.
4. Ensure every image crop works at desktop and mobile sizes.
5. Keep content fields easy to update when the client sends the full company profile.

### Phase 6 — QA and visual back-check

Do not declare the website complete immediately after the first successful build.

1. Run the project and inspect every page.
2. Check the design against the supplied screenshot at comparable desktop proportions.
3. Compare hero composition, text hierarchy, section spacing, image scale, card proportions and section rhythm.
4. Inspect desktop, tablet and mobile layouts.
5. Test every link, menu, form state and CTA.
6. Check browser console and terminal for errors and warnings.
7. Check missing assets, broken routes, layout shifts and horizontal overflow.
8. Check accessibility basics with keyboard navigation and form labels.
9. Check performance and image optimisation.
10. Fix all visible defects and repeat the inspection.

Where available, capture screenshots at 1440px desktop, 1024px tablet and 390px mobile. Review the screenshots visually; do not rely solely on automated test output.

### Phase 7 — Handover

Provide:

- A working, runnable website project.
- Clear instructions to run/build/deploy it.
- A list of pages and implemented features.
- A concise list of remaining client-supplied information.
- A list of integrations/credentials still required.
- A list of image assets and their sources/licensing status.
- A note of anything intentionally hidden because supporting content is missing.

Do not claim that deployment, email delivery, analytics, map accuracy or any third-party integration is complete unless it has actually been configured and tested.

---

## 16. ACCEPTANCE CRITERIA — WHAT “DONE” MEANS

The project is complete only when all applicable criteria are met:

### Brand accuracy

- Correct MEDDY GLOBAL SOLUTIONS LTD identity is visible.
- Supplied logo is used accurately and never distorted.
- Colour system is recognisably derived from the logo.
- Orange from the reference is not introduced as a competing brand colour.
- Layout follows Appendix D and has been compared to the reference by screenshot.
- No phone number, WhatsApp number or tagline appears anywhere.

### Visual quality

- Hero has the same level of visual presence and compositional discipline as the supplied reference.
- Main text is readable and carefully positioned.
- Photography is high quality, relevant and non-deceptive.
- Typography is consistent and well balanced.
- Spacing and alignment are deliberate and consistent.
- Sections feel cohesive and premium.
- No visible AI slop, broken imagery, awkward crops, placeholder copy or generic template residue remains.

### Content accuracy

- Company name and address are correct.
- No invented history, team, certifications, projects, clients, testimonials or statistics are present. Services appear only as the Appendix A draft content.
- Draft content is separated from verified content.
- Missing content is documented for client approval.

### Functionality

- Navigation works on all target devices.
- CTAs lead to useful destinations.
- Contact form validates and has a real, tested submission path or a clearly documented configuration requirement.
- Address/directions link uses the correct address.
- No dead buttons or placeholder links remain.

### Technical quality

- No broken routes or missing assets.
- No significant console errors.
- No horizontal overflow at tested widths.
- Accessible labels, focus states and keyboard behaviour are implemented.
- Images are optimised.
- Secrets are not exposed in frontend code.
- Build and run instructions are included.

---

## 17. CLIENT INFORMATION REQUIRED TO COMPLETE THE FINAL CONTENT

Create `CONTENT-REQUIRED.md` and list the following items without inventing answers:

1. A full company profile or approved description of what MEDDY GLOBAL SOLUTIONS LTD does.
2. Confirmed service/product categories and short descriptions.
3. Mission, vision and company values, if the client wants them published.
4. Year of establishment and registration details, if approved for publication.
5. Leadership/team names, positions and approved photographs, if applicable.
6. Genuine project/portfolio records and approved photographs, if applicable.
7. Client/partner names and logos with permission to display them.
8. Certifications, licences, memberships and supporting proof, if applicable.
9. Telephone/WhatsApp: deliberately omitted by the client; add only if the client later asks.
10. Confirmation that the `info@meddyglobalsolutions.com` mailbox exists and the form provider key is configured.
11. Office hours, if the client wants them published.
12. Official social-media links.
13. Preferred production domain name.
14. Email recipient and/or form-service credentials for enquiry delivery.
15. Any approved brand tagline or specific message the client wants in the hero (none requested for now).
16. Client review of the draft services in Appendix A: confirm, edit or remove each one.
17. Real photography to replace the generated images in `/public/images/`.

Only request information that is relevant to the actual business. If an item does not apply, leave it out.

---

## 18. FINAL DIRECTIVE

Now execute the project from the current repository state.

Do not respond with only a plan, a list of recommendations, a static mockup or a generic template. Inspect, design, implement, test and refine the actual website.

Use the reference screenshot to guide the visual hierarchy and premium photographic presentation. Use the supplied MEDDY logo to guide the brand system. Use the letterhead as the authority for the confirmed company name and address. Use the linked website only as secondary structural inspiration.

**Do not fabricate information to make the website look complete. Do not compromise the visual quality to make the implementation easier. Do not claim functionality that has not been tested.**

The desired result is a precise, elegant, responsive, high-quality corporate website that feels deliberately designed for MEDDY GLOBAL SOLUTIONS LTD and is ready to receive the company's approved business profile and contact information.

---

## APPENDIX A — DRAFT SERVICES CONTENT (status: `draft`, CLIENT REVIEW PENDING)

Save as `/content/services.md` and load it into the central content file. Use it exactly; do not shorten it or add claims. Each service gets a detail page built from its summary and capability list, the matching image from Appendix B, and an enquiry CTA.

### Core Services

**Global Maintenance Contracts** (slug: `global-maintenance-contracts`)
Planned and responsive maintenance for plant and rotating equipment under a single agreement.
- Scheduled preventive maintenance programmes
- Breakdown response and fault diagnosis
- Condition monitoring and reporting
- Spare parts planning and lifecycle tracking

**EPIC & EPCM Services** (`epic-epcm-services`)
Engineering, procurement, installation and commissioning, managed as one coordinated scope.
- Front-end engineering and design support
- Equipment and materials procurement
- Mechanical and electrical installation
- Testing, commissioning and handover documentation

**Manpower & Technical Staffing** (`manpower-technical-staffing`)
Qualified engineers, technicians and project crews supplied for site and workshop work.
- Mechanical, electrical and instrumentation technicians
- Supervisors and project engineers
- Short-term and long-term deployment
- Onboarding to site safety requirements

**Construction & Fabrication** (`construction-fabrication`)
Structural and mechanical fabrication, built to drawing and installed on site.
- Skids, frames, platforms and supports
- Pipe spooling and pressure-part fabrication
- Welding to approved procedures
- Inspection and quality records

**OEM Services** (`oem-services`)
Supply and support for original-equipment parts, tooling and technical documentation.
- Sourcing of genuine spares
- Technical data and manual coordination
- Equipment upgrades and retrofits
- Support through the equipment lifecycle

**Load Bank Services** (`load-bank-services`)
Load testing that proves generators and power systems perform before they go into service.
- Resistive and reactive load testing
- Commissioning and acceptance tests
- Periodic performance checks
- Test reports for operations teams

**Pumps & Compressors** (`pumps-compressors`)
Installation, overhaul and diagnostics for centrifugal and positive displacement pumps and compressors.
- Dismantling, inspection and rebuild
- Seal, bearing and wear-part replacement
- Alignment and vibration checks
- Workshop testing before return to service

**Turbines & Generators** (`turbines-generators`)
Maintenance and support for gas, steam and diesel-driven power generation equipment.
- Routine servicing and inspections
- Overhaul planning and execution
- Control and protection system checks
- Performance testing after repair

**Motors & Drives** (`motors-drives`)
Servicing of AC and DC motors, variable frequency drives and control panels.
- Motor rewinding, repair and testing
- VFD installation and configuration
- Control panel assembly and fault finding
- Insulation and thermal testing

### Other Services

**Procurement & Logistics** (`procurement-logistics`)
Sourcing, purchasing and delivering industrial equipment and materials to site.
- Vendor identification and quotation
- Import and customs coordination
- Warehousing and transport
- Delivery tracking and documentation

**Pipeline & Flowline Services** (`pipeline-flowline-services`)
Installation, repair and maintenance of pipelines and flowlines.
- Pipe laying and tie-ins
- Flowline repair and replacement
- Pressure testing and flushing
- Coating and integrity support

**Marine Services** (`marine-services`)
Vessel and marine equipment support for offshore and coastal operations.
- Marine equipment supply and repair
- Crew and technical support
- Logistics for offshore sites
- Equipment mobilisation by water

**Electrical Submersible Pumps** (`electrical-submersible-pumps`)
Supply, installation and servicing of submersible pumping systems.
- Pump and motor assembly
- Surface equipment and controls
- Performance monitoring
- Pull, inspection and rerun support

**Filtration & Fluid Management** (`filtration-fluid-management`)
Systems that keep fluids clean and equipment protected.
- Filter supply and replacement programmes
- Lubrication system servicing
- Fluid sampling and analysis coordination
- Flushing and contamination control

**Consultancy Services** (`consultancy-services`)
Practical technical advice for operators planning, running or improving facilities.
- Equipment reliability reviews
- Maintenance strategy planning
- Project scoping and cost review
- Technical support for tenders

---

## APPENDIX B — IMAGE GENERATION PROMPTS

Save as `/content/image-prompts.md`. Append this suffix to every prompt: *"photorealistic documentary photography, natural light, shallow depth of field, high resolution, no text, no logos, no watermark, no recognisable brands, faces not visible, natural hands."* Export as WebP at the stated ratio into `/public/images/`, register each in `/content/image-manifest.ts` with alt text, and review each against Section 7.3.

| File | Ratio | Scene |
|---|---|---|
| `hero.webp` | 16:9 | Wide industrial facility at golden hour, steel pipework and storage tanks on the RIGHT, soft haze, deep blue sky; keep the LEFT 45% calm and open for headline text |
| `about.webp` | 4:5 | Two engineers in hard hats and hi-vis seen from behind, reviewing a tablet beside machinery; portrait, rounded-corner crop |
| `maintenance.webp` | 3:4 | Technician's gloved hands tightening a bolt on an industrial pump |
| `epic.webp` | 3:4 | Process plant construction with steel structure rising, crane in background |
| `staffing.webp` | 3:4 | Technicians in PPE walking toward a facility entrance, seen from behind |
| `fabrication.webp` | 3:4 | Welding sparks in a fabrication workshop, face hidden by the angle |
| `oem.webp` | 3:4 | Neatly arranged industrial spare parts and bearings on a workbench |
| `load-bank.webp` | 3:4 | Generator set with a load bank unit beside it, overcast light |
| `pumps.webp` | 3:4 | Clean centrifugal pump on a workshop floor, cool lighting |
| `turbines.webp` | 3:4 | Generator hall interior, symmetrical, blue-grey tones |
| `motors.webp` | 3:4 | Electric motor on a test bench with control panel behind |
| `procurement.webp` | 3:4 | Warehouse shelves with industrial crates and a forklift in soft light |
| `pipeline.webp` | 3:4 | Pipeline crossing flat tropical terrain at dusk |
| `marine.webp` | 3:4 | Offshore support vessel on calm water at dawn |
| `esp.webp` | 3:4 | Submersible pump components laid out on a clean workshop table |
| `filtration.webp` | 3:4 | Industrial filter housings and fluid lines, close-up, shallow focus |
| `consultancy.webp` | 3:4 | Engineers around a table reviewing technical drawings, faces turned away |
| `hsse.webp` | 3:2 | Rack of safety helmets and hi-vis vests, shallow focus |
| `contact.webp` | 16:9 | Modern Lagos office exterior with palm trees, late afternoon |

Cards use the 3:4 files so they match the tall portrait cards in the reference. Colour grade all images consistently (cool, slightly desaturated, natural contrast) so the set looks like one shoot.

---

## APPENDIX C — MOTION AND TRANSITIONS SPECIFICATION

**Stack (only if the project has no existing animation setup):** Next.js (App Router), TypeScript, Tailwind CSS, Motion (framer-motion), Lenis for smooth scrolling. Otherwise use the project's existing stack.

**Global rules**
- One easing curve across the whole site, for example `cubic-bezier(0.22, 1, 0.36, 1)`. Durations 400–900ms. Animate `transform` and `opacity` (and `clip-path` for image reveals) only.
- No layout shift: reserve space for everything that animates in.
- Reveals trigger once, when about 15–20% of the element enters the viewport.
- Honour `prefers-reduced-motion`: replace movement with simple fades or no animation, and turn off smooth scrolling.
- Content must always remain reachable by keyboard and screen readers while it animates.

**Components**
1. **Text reveals:** split H1/H2 headings into lines (not individual letters) inside overflow-hidden masks; each line slides up from 100% with a 60–90ms stagger. Body paragraphs fade up with a small offset.
2. **Page transitions:** one consistent transition on every route change (a short fade plus a slight vertical shift, or a clip-path wipe in MEDDY blue). Same duration and easing everywhere. No flash of unstyled content; scroll position resets correctly.
3. **Hero:** on load, sequence the nav, headline lines, paragraph and buttons; subtle slow scale-down (1.06 → 1.0) of the hero photo and gentle parallax on scroll (max about 40px).
4. **Image reveals:** clip-path or scale-in on scroll for About and card images.
5. **Service cards:** staggered entrance; on hover the image scales about 1.04 and the card lifts a few pixels; the title row shows an arrow cue. Keyboard focus shows the same state.
6. **Buttons:** sliding-fill hover (blue fills from the left, text colour inverts as needed), visible pressed and focus states.
7. **Navigation:** animated underline on hover and on the active route; header changes subtly to a solid surface after scrolling; mobile menu opens with a staggered link entrance and closes with Escape.
8. **Capabilities page and Services index:** card grid reveals with stagger; filter or tab changes cross-fade without layout jumps.
9. **Footer and CTA band:** simple fade-up; no looping animation.

---

## APPENDIX D — REFERENCE BREAKDOWN (BINDING LAYOUT SPEC)

Source: `/references/conzone-reference.png`, a full-page capture about 1000px wide. Values below are approximate readings from that capture; confirm them by overlaying a screenshot of the build on the reference at the same width, and correct drift. Where the reference does not show tablet or mobile, infer conservatively and note the inference in the final report.

1. **Hero (about 37% of the capture height, roughly 1000 × 560, near 16:9).** Full-bleed photograph, subject (the machine) on the right, open sky on the left. Dark gradient rising from the bottom edge. Nav row overlaid: small brand mark and wordmark at left, four centred text links, filled pill button at right. H1 is two lines, white, bold, left-aligned, starting around x = 65 of 1000 and about 20% down the hero; roughly 4.5–5% of the capture width in size. A two-line white paragraph (about 1.3% of width) sits below it. Under that: a filled pill button and a ghost/outlined pill button with a small icon, side by side. At the bottom of the hero, over the gradient, a small centred caption and a row of five logos spaced evenly.
2. **About section (white, about 620–1050 on the capture).** Two columns with the left column about 48% wide. Left: tiny grey eyebrow label, very large bold black H2 on two lines, a filled pill button beneath it. Lower left: two soft-toned cards side by side, each with a circular white badge holding a small line icon, a bold title and one small grey line. Right: one large portrait photograph (roughly 380 × 425, about 8:9) with about 18–20px rounded corners, top-aligned with the heading block.
3. **Services/"vision" section.** Centred small eyebrow and a large centred bold H2. Below, three tall portrait cards with about 20px radii, **staggered**: the left card sits highest, the middle slightly lower, the right lowest (differences of roughly 25–55px on the capture). Each card has a dark gradient at the bottom with a white title and a one-line white description overlaid.
4. **Rhythm:** hero (dark, photographic) → white about section with generous padding (about 60px top and bottom on the capture) → white centred title section with cards. Whitespace is generous; there is one geometric sans family throughout; weights are heavy for headings and regular for body; shadows are soft and rare; a single accent colour is used only on buttons and small icons.

**Mapping to MEDDY**
- Orange → MEDDY blue `#0CA3DC` (hover `#087FB5`). Warm beige card fill → `#F5FAFC` with a `#E4EDF2` hairline.
- Conzone brand mark and name → MEDDY logo and "MEDDY GLOBAL SOLUTIONS LTD".
- Hero logo row → capability keyword row (Section 3.2).
- Two feature cards in About → two statements drawn only from Appendix A (for example "Maintenance and technical support" and "Procurement and logistics"), each with a simple line icon in a white circle. Icons come from one consistent line-icon set; no emoji.
- Three staggered image cards → the first three Core Services from Appendix A.
- Sections beyond the reference (full services grid, capabilities, HSSE, values, CTA, contact, footer) must reuse the same radii, type scale, spacing, buttons and card language so the whole site reads as one system.

---

## APPENDIX E — DRAFT HOME-PAGE COPY (status: `draft`, CLIENT REVIEW PENDING)

Keep in the central content file. This is wording for layout and review, not a set of verified facts. It contains no tagline, years, figures, clients or certifications.

- **Hero H1:** Engineering and technical services for industry
- **Hero paragraph:** Maintenance, fabrication, procurement and technical staffing, delivered from our office in Lekki, Lagos.
- **Hero buttons:** Request a quote (to the contact form) / View services
- **Credibility strip:** Lekki, Lagos, Nigeria, plus the capability keyword row
- **About eyebrow:** About us
- **About H2:** Practical engineering support, from planning to handover
- **About paragraph:** MEDDY Global Solutions Ltd provides engineering, maintenance and procurement services for industrial operations. Our office is in Lekki, Lagos.
- **About cards:** "Maintenance and technical support" / "Procurement and logistics" (one short line each, taken from the Appendix A summaries)
- **Services section eyebrow and H2:** Our services / What we can do for your operations
- **Values (no statistics):** Safety first, Clear communication, Quality in every job, Reliable delivery, each with one plain sentence and no performance claims
- **HSSE statement:** Commitments only (for example: plan work to protect people, equipment and the environment; keep records of inspections and tests). No standards or certifications named.
- **CTA band:** Ready to discuss your requirements? Send us an enquiry at info@meddyglobalsolutions.com or use the form.
- **Footer:** Logo, company name, short links, the confirmed address and the email. No phone, no social icons.
