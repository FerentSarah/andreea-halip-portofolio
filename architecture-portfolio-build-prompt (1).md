# Build Prompt — Andreea Halip, Architecture Portfolio

You are building a portfolio website for an architect, Andreea Halip. The visual design and interactions are already prototyped in a single file: **`reference/icon-grid-mockup.html`**. Open it in a browser first and read its source. Where this brief and the mockup disagree about how something looks or moves, **the mockup wins**. This brief covers what the mockup does not: structure, routing, content, SEO and accessibility.

The prototype is deliberately plain HTML/CSS/JS. Rebuild it faithfully in Next.js. Don't redesign it, don't add decoration, and don't "improve" the spacing or motion.

---

## 1. Design principles

- White page, black text, a lot of empty space. It should look almost too simple until you interact with it.
- One yellow accent, used only for the cursor and the small square in the header. Nothing else on the site is yellow.
- Soft pastel colors appear **only on hover**, one per project (see section 5). At rest everything is black line art on white.
- Motion is smooth and quiet: no bounce, no big scale-ups, no bold or oversized text. Most transitions are 0.3–0.7s with an ease-out curve.
- Avoid: dark mode, glassmorphism, gradients, glows, shadows, 3D, cursor trails, parallax, anything loud.

## 2. Tech stack

- Next.js (App Router) + TypeScript, deployed on Vercel.
- Plain CSS modules or minimal Tailwind. Design tokens live as CSS variables (section 3).
- Framer Motion for animation. The shared-element "PROJECTS travels to the left" effect should use `layoutId`. GSAP is not needed.
- Content in typed files (`content/projects/*.ts`), no CMS for now. Structure it so Sanity could replace it later without touching components.
- Images through `next/image`, served as WebP/AVIF. Do not ship raw multi-MB JPEGs.
- No dark mode, ever. Set `color-scheme: light` on the root.

## 3. Tokens (copy exactly from the mockup)

```
--bg:     #FFFFFF
--ink:    #111111
--muted:  #777777
--line:   #E2E2E2
--cursor: #F2C641
```

Fonts (Google Fonts):
- **Space Mono** for all UI text, nav, metadata.
- **Special Elite** for project names only (the hand-lettered look). This is the only place it is used.

Type is small and quiet: nav and header 12px, letter-spacing .08–.1em, uppercase. Metadata 10px, letter-spacing .06em, `--muted`.

## 4. Global components

### Cursor
- Replaces the native cursor on desktop (`cursor: none`). Disable entirely on touch devices and when `prefers-reduced-motion` is set; fall back to the normal cursor.
- At rest: a **hollow ring**, 7px, 1px yellow border, transparent fill, centered on the pointer.
- Over a project icon, a header menu link, or the back arrow: the ring **fills solid yellow**, scales to .85, and a small yellow **"VIEW"** label (8px, letter-spacing .14em) slides in 11px to the right of it (opacity 0→1, translateX −3px→0, ~120ms).
- On mouse down: scale to .6, release on mouse up.
- It follows the pointer directly with no easing lag.

### Header
- Left: `ANDREEA HALIP` (12px, letter-spacing .08em).
- Center: a 10×10px solid yellow square, positioned at true horizontal center (`left:50%`), independent of the other header items.
- Right: a vertical stack of links: `PROJECTS`, `PHOTOS`, `CONTACT`, `INFO`. 12px, letter-spacing .1em, 38px gap, right-aligned. The stack is `position:absolute` (top 28px, right 40px) so it never affects the header's height. The current page's link stays black, not greyed out.
- Page padding is 28px top, 40px sides.

## 5. Projects page (the core of the site)

### Layout
- Grid of **3 columns** on desktop, 2 on tablet (<820px), 1 on mobile (<520px). Gap 56px (rows) × 40px (columns), 44px row gap on mobile.
- Container max-width 1100px, padding 56px 40px 100px. The grid sits close under the page title, not far down the page.
- Each item is centered and consists of, from top to bottom:
  1. A square icon box, max 130px wide, 1px `--line` border, containing a hand-sketched SVG.
  2. The project name in Special Elite, 16px, uppercase, 12px below the box.
  3. A metadata line: `TYPOLOGY · YEAR`, 10px, `--muted`.
  4. A 2px accent rule beneath (hidden at rest).
- No description text on this page. Keep it this minimal.

### Hover
- A flat wash of the project's accent color fades in behind the icon (opacity .16, 200ms).
- The 2px accent rule under the metadata line grows from 0 to 36px (250ms).
- Cursor switches to the filled ring + "VIEW" (only while over the icon box, not the whole column).
- Nothing scales, nothing else dims or blurs.

### Accent colors
| Project | Typology | Year | Accent |
|---|---|---|---|
| Cibin | Residential | 2023 | #B7D7E8 |
| Mureș | Cultural | 2024 | #E8B69B |
| Tulcea | Landscape | 2022 | #BFD3B2 |
| Sibiu | Housing | 2024 | #C9B9D9 |
| Oradea | Pavilion | 2021 | #E9D9A0 |
| Brașov | School | 2025 | #E3A9A6 |

**These project names, typologies and years are placeholders.** Put them in `content/projects/` so they're trivial to replace with the real ones.

### Icons
- Each icon is an inline SVG on a 160×160 viewBox, line art only (strokes between .5 and 1.1, `stroke="currentColor"`, no fills except tiny figure/tree dots). They are meant to look like small fragments of architectural drawings: contour lines, a facade bay, a site plan.
- The six in the mockup are **placeholders**. Reuse them for now, structured as one component per project (`components/ProjectIcon/`) so they can be swapped. Eventually they should be redrawn from Andreea's own drawings.

## 6. The menu transition (prototype this exactly)

On load the page shows only the header. The project grid is not visible.

**Clicking `PROJECTS` in the right-hand menu:**
1. The word `PROJECTS` travels from its menu position to the **left, directly below `ANDREEA HALIP`** (top ≈ 52px, left 40px). It stays the **same size and weight** the whole way (12px, no scale-up), in black.
2. At the same time `PHOTOS`, `CONTACT`, `INFO` slide ~120px to the right and fade out, staggered 40ms apart, 0.5s with `cubic-bezier(.22,1,.36,1)`.
3. The title's travel takes 0.7s with the same easing.
4. A small `←` arrow (12px, black) fades in right next to the title (left ≈ 22px, same vertical position), after a ~0.35s delay.
5. The project grid fades in (opacity 0→1, translateY 10px→0, 0.5s), starting ~200ms into the transition.

**Clicking the `←` arrow** reverses everything: the title travels back to the menu, the other links slide back in, the arrow and the grid fade out.

Implementation notes:
- Use Framer Motion `layoutId="projects-title"` shared between the menu link and the page title.
- When a visitor lands **directly on `/projects`** (e.g. from Google), start in the already-selected state: title at left, arrow visible, grid visible, no animation.
- Hidden menu links must also be non-interactive (`pointer-events: none`), not just invisible.

## 7. Other pages

These are not prototyped yet. Follow the same system (white, black, Space Mono, tiny uppercase labels, hairline `--line` rules, yellow only in the cursor and header square), and ask before inventing new visual ideas.

- **Photos (`/photos`):** the same 3-column grid and spacing as Projects, with a small cropped photo thumbnail in place of the sketch icon and a caption (location · year) beneath. Same hover rules: accent underline, no scaling. Clicking opens a clean full-screen viewer with only a counter (`03 / 24`) and a close mark.
- **Project detail (`/projects/[slug]`):** an editorial page: a title and metadata line, one large hero image, then mixed drawings and photos at varied sizes (full width, small, offset), and a short text block. Clicking a project on the grid should flood the screen with that project's accent color as a flat panel (no gradient) before the detail page appears.
- **Contact** and **Info:** minimal text pages, left-aligned, generous whitespace.

## 8. SEO (important — she wants to rank first for her own name)

The domain will be her exact name. To make Google index and rank it well:

- **Server-render everything.** All project names and text must be present in the initial HTML, not injected after a click. The grid being visually hidden until the animation is fine as long as it's in the DOM.
- The homepage `<h1>` must be her real name, `Andreea Halip`, even if it's visually styled as the small header text. Use proper `<h2>`/`<h3>` for sections and projects. The animated "PROJECTS" label must not be the page's only heading.
- Unique `<title>` and meta description for every page, with her name, "architect", and location, e.g. `Andreea Halip — Architect, <city>`. Add Open Graph tags and an OG image.
- Add **JSON-LD `Person` schema** on the homepage: `name`, `jobTitle: "Architect"`, `url`, and `sameAs` links to her Instagram, LinkedIn, Behance (leave placeholders).
- Descriptive `alt` text on every image and drawing.
- Generate `sitemap.xml` and `robots.txt` (Next.js metadata routes).
- Clean readable URLs: `/projects/cibin`, not IDs.
- After launch (done manually, not in code): submit the sitemap and request indexing in Google Search Console, and link the site from her Instagram bio and LinkedIn.

## 9. Accessibility and responsiveness

- Respect `prefers-reduced-motion`: replace the travel/slide animations with a simple crossfade, and turn the custom cursor off.
- All interactive elements are real links or buttons, keyboard-focusable with a visible focus style (a 1px black outline offset 3px is fine). The back arrow needs `aria-label="Back to menu"`.
- Mobile: the header keeps the same structure with smaller gaps, the grid collapses to one column, the custom cursor is off, and there is no hover state, so show the accent color briefly on tap.
- Check contrast: `--muted` text must stay readable on white.

## 10. Suggested structure

```
app/
├── layout.tsx            (header, cursor, global styles, metadata)
├── page.tsx              (home: header only, landing state)
├── projects/
│   ├── page.tsx
│   └── [slug]/page.tsx
├── photos/page.tsx
├── contact/page.tsx
├── info/page.tsx
├── sitemap.ts
└── robots.ts

components/
├── Cursor/
├── Header/
├── ProjectsTitle/        (the shared-layout title + back arrow)
├── IndexGrid/            (3-col grid, reused by Projects and Photos)
├── ProjectIcon/          (one SVG per project)
└── PageTransition/       (accent-color wash)

content/projects/         (typed data: slug, title, typology, year, accent, iconId, images[])
reference/icon-grid-mockup.html
```

## 11. Build order

1. Tokens, fonts, layout shell, `Header` (with the centered yellow square).
2. `Cursor`: ring, filled+VIEW state, click pulse, touch/reduced-motion off.
3. `/projects` grid with the six placeholder projects and hover behavior. Compare side-by-side with the mockup until they match.
4. The menu transition (section 6) and the direct-landing state.
5. Project detail template and the accent-wash transition.
6. Photos page reusing `IndexGrid`.
7. Contact and Info.
8. SEO pass (section 8), accessibility pass (section 9), Lighthouse check, then deploy to Vercel.

## 12. Definition of done

- Placed next to `reference/icon-grid-mockup.html`, the Projects page and the menu transition look and feel the same: same sizes, spacing, colors, easing and cursor.
- Works with keyboard only, and with reduced motion on.
- Lighthouse Performance and SEO scores are 90 or higher on mobile.
- Placeholder content is isolated in `content/` and easy to replace.
