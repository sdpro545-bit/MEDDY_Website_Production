# Project-Wide Agent Operating Rules

## Master specification

This file is the complete operating standard for this project. There is no separate specification document to locate. Read this file in full before planning or modifying anything, and re-read it for each substantial task. It covers design quality, reference fidelity, writing, implementation, security, accessibility, responsive behavior, verification, and handoff.

Do not assume you have followed these rules merely because this file is loaded. If a task brief (for example `MEDDY_GLOBAL_SOLUTIONS_MASTER_WEBSITE_PROMPT.md`) adds project-specific requirements, follow both. Where they conflict, the task brief's client directives win on project content, and this file wins on process, honesty, and verification.

## Non-negotiable execution rules

1. **Inspect before editing.** Read the repository structure, existing code, package manifests, scripts, framework versions, project instructions, design tokens, components, routes, tests, and relevant assets. Inspect the current implementation before proposing a rewrite.
2. **Understand the task and evidence.** Convert the user's request into explicit requirements and acceptance criteria. Inspect every supplied reference image, URL, document, and asset that is relevant. Distinguish observed facts from assumptions. Never invent missing copy, data, brand rules, interactions, or reference details.
3. **Preserve what works.** Make the smallest complete set of changes that satisfies the task. Do not redesign unrelated areas, replace architecture, delete data, change APIs, or introduce dependencies without a clear reason and authorization.
4. **Design deliberately.** Create or follow a coherent system for brand, typography, color, spacing, layout, components, icons, imagery, motion, and content. Avoid generic template output, fabricated details, visual inconsistency, decorative clutter, dead controls, placeholder copy, and unearned claims. A visual style is not automatically “AI slop”; judge whether it serves the brief and is executed consistently.
5. **Match references with evidence.** Measure and compare layout, proportions, alignment, typography, color, imagery/crop, borders, shadows, radii, iconography, and states. Recreate only what is evidenced. Do not claim pixel-perfect fidelity without screenshot-based comparison at the relevant viewport sizes. When a reference omits responsive or interactive states, infer conservatively and label the inference.
6. **Write truthfully.** Keep copy specific, useful, audience-appropriate, and consistent. Do not fabricate testimonials, statistics, awards, clients, policies, product capabilities, legal statements, or citations. Remove generic filler and awkward repetitive punctuation. Preserve factual meaning unless the user authorizes changes.
7. **Implement robustly.** Follow the existing stack and installed versions. Use semantic markup, accessible interactions, typed and validated data where appropriate, maintainable components, safe error handling, and progressive enhancement. Do not invent APIs, package names, files, scripts, or tool capabilities.
8. **Secure the actual attack surface.** Review relevant risks such as injection/XSS, authorization, authentication, CSRF, secrets, unsafe file handling, SSRF, dependency vulnerabilities, abuse/rate limiting, security headers, CORS, cookies, and sensitive logging. Apply controls appropriate to the architecture; do not claim a security audit that was not performed.
9. **Verify, do not assume.** Discover and run the project's actual relevant checks: tests, lint, typecheck, build, browser checks, accessibility checks, and visual comparisons. Test primary flows and important responsive states. Never report a check as passed unless it actually ran and passed. Fix failures introduced by the change and investigate pre-existing failures.
10. **Do not declare completion prematurely.** Do not call the work done while critical/high-severity defects, broken primary flows, material visual mismatches, unresolved factual uncertainty, or required checks remain. If verification is blocked, state exactly what was and was not verified and why.

## Task execution sequence

For every substantial task, follow this order:

1. **Intake:** restate the objective internally; identify deliverables, constraints, reference sources, affected routes/components, and acceptance criteria.
2. **Reconnaissance:** inspect project instructions, code, assets, dependencies, design system, scripts, and current behavior. Do not edit yet.
3. **Reference analysis:** document observable visual and behavioral properties; identify missing information and uncertainty. Ask only when a genuinely blocking decision cannot be resolved safely.
4. **Plan:** propose a concise implementation and verification plan proportionate to risk. Identify files likely to change and what must remain untouched.
5. **Implement:** work in small, coherent steps; reuse established patterns; keep copy, styling, interactions, and responsive behavior consistent.
6. **Review:** inspect changed files and the rendered result; challenge the work for generic design patterns, made-up content, visual drift, broken affordances, accessibility defects, and unnecessary complexity.
7. **Verify:** run applicable project checks and inspect screenshots/flows at relevant desktop, tablet, and mobile widths. Check keyboard operation, focus, contrast, overflow, links, forms, empty/loading/error/success states, and browser console/network errors where available.
8. **Report:** summarize what changed, key design/engineering decisions, files affected, checks actually run and their outcomes, known limitations, and unresolved issues. Include evidence rather than unsupported assurances.

## Reference and assets supplied by the user

- Treat user-provided references as the visual and content source of truth for the requested scope, unless they conflict with explicit written requirements or legal/safety constraints.
- Ask the user to provide the highest-quality available screenshot or source asset when the reference is too small, cropped, blurred, or incomplete to inspect reliably.
- For a website reference, inspect the page at the intended URL and relevant viewport sizes when browsing is available; do not assume a screenshot reveals hidden states or behavior.
- Preserve logo proportions, clear space, colors, and supplied brand assets. Do not redraw or distort a logo when the source asset is available.
- Use only assets the user supplied, assets already authorized in the project, or assets with an appropriate license. Do not imply affiliation with another brand.

## Completion report format

At the end of the task, provide:

- **Outcome:** what was completed and what was intentionally not changed.
- **Design/content:** significant visual, brand, typography, layout, and writing changes.
- **Engineering:** relevant implementation changes and dependencies added/avoided.
- **Verification:** exact commands and checks run, with pass/fail/blocked status. Never invent command output.
- **Known limitations:** untested browsers/devices/states, unavailable references, unresolved assumptions, and pre-existing failures.
- **Remaining issues:** prioritized by severity, with the next concrete action.

These rules guide the agent; they do not guarantee zero defects. Quality must be established through inspection, evidence, and verification on the actual project.
