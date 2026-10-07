# Build Prompt — Andreea Halip, Architecture Portfolio

You are building a portfolio website for Andreea Halip, a fifth-year architecture student at the Technical University of Cluj-Napoca, Romania. The visual design and interactions are already prototyped in a single file: **`reference/icon-grid-mockup.html`**. Open it in a browser first and read its source. Where this brief and the mockup disagree about how something looks or moves, **the mockup wins**. This brief covers what the mockup does not: structure, routing, content, SEO and accessibility.

The prototype is deliberately plain HTML/CSS/JS. Rebuild it faithfully in Next.js. Don't redesign it, don't add decoration, and don't "improve" the spacing or motion.

---

## 1. Design principles

- White page, black text, a lot of empty space. It should look almost too simple until you interact with it.
- One yellow accent, used only for the cursor and the small square in the header. Nothing else on the site is yellow.
- Soft pastel colors appear **only on hover**, one per project (see section 6). At rest everything is black line art on white.
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
- Over a project icon, a header menu link, or the back arrow: the ring **fills solid yellow** and scales to .85 (~120ms). **There is no text label** (no "VIEW"); the fill is the only hover signal.
- On mouse down: scale to .6, release on mouse up.
- It follows the pointer directly with no easing lag.

### Header (sticky)
- `position: fixed` at the top, full width, white background, so it stays visible while the page scrolls. Page content sits below it. When the Projects page has been scrolled, a 1px `--line` hairline appears under the header (fade in ~300ms); otherwise there is no border.
- Everything in the header is **vertically centered in the header bar**: the name, the yellow square and the menu all share the same horizontal center line, with equal space above and below.
- Left: `ANDREEA HALIP` (12px, letter-spacing .08em, 40px from the left edge).
- Center: a 10×10px solid yellow square at true horizontal center (`left:50%`).
- Right: a vertical stack of links: `PROJECTS`, `RESUME`, `CONTACT` (three links; there is no Info or Photos page). 12px, line-height 16px, letter-spacing .1em, **14px gap** (a tight stack), right-aligned, 40px from the right edge, centered vertically in the header. The current page's link stays black.
- The header has two heights, both CSS variables: **home = 132px** (the 3-link stack plus equal padding above and below) and **compact = 84px** (used on the Projects page, where the menu has collapsed to just the title). The header height animates between them over 0.7s with `cubic-bezier(.22,1,.36,1)`.
- In the compact state the name sits at top 22px and the page title directly below it (top 46px), so the two-line block is centered in the 84px bar; the yellow square stays centered in the bar. In the home state the name is centered in the 132px bar.

## 5. Home page

The landing page. Below the header, one block centered in the remaining viewport (both horizontally and vertically):
- **Two columns, 1/3 and 2/3** (`grid-template-columns: 1fr 2fr`, gap 64px, container max-width 1200px, 40px side padding), vertically centered against each other.
- Left (1/3): her photo, centered in its column and capped at **265px wide** (the file's native width, so it isn't enlarged and blurred). Once a higher-resolution original is supplied, raise the cap toward the full column width (~350px). Shown at the photo's natural portrait ratio (265:431) and cropped with `object-fit: cover` if the viewport is short (max height = viewport − header − 80px). The photo is `reference/home-photo.png`; move it to `public/` and use `next/image`. It is only 265×431 px, so it will look soft on large and retina screens: **ask for the original, higher-resolution file** (at least ~1000px wide) before launch. Write a proper `alt` text (the mockup uses a neutral placeholder description).
- Right (2/3): two paragraphs of 13px / line-height 1.8 text, max-width 560px, left-aligned, with **no label or heading above them**. Use her real text, exactly:

  > I am a fifth-year architecture student at the Technical University of Cluj-Napoca, Romania. During my studies, I had the opportunity to take part in two Erasmus exchanges, at Roma Tre University in Rome, Italy and at the Polytechnic University of Cartagena, in Spain, experiences that introduced me to different approaches to architecture.
  >
  > What interests me most is the relationship between architecture and human behaviour. Whether working at the scale of a city, a building, or a piece of furniture, we are ultimately designing for people. For me, understanding how they live, move, interact, and perceive space is an essential part of designing responsibly. I believe architecture should not begin with assumptions, but with observation, communication, and a genuine effort to understand.
- On mobile (<820px) stack: photo (max 260px wide) above the text.
- This page has real text content, which also helps SEO (see section 9).

## 6. Projects page (the core of the site)

### Layout
- **Rows of 3, one row per screen.** Only one row of three projects is visible at a time, centered both horizontally and vertically in the space below the header. Scrolling moves to the next row (CSS scroll-snap: `scroll-snap-type: y mandatory` on `html`, `scroll-snap-align: start` on each row, `scroll-padding-top` equal to the compact header height). Each row has `min-height: calc(100vh - 84px)` and `align-items: center`.
- Within a row: 3 columns, container max-width 1100px, 40px side padding, 40px column gap. With 6 projects that is 2 rows; 9 projects would be 3 rows, and so on.
- On tablet (<820px) there is no snap and no full-height rows: a normal 2-column grid (48px row gap, 28px column gap). On mobile (<520px) 1 column.
- No footer or extra content below the last row, so the last row snaps cleanly.
- Each item is centered and consists of, from top to bottom:
  1. A square icon box, max 130px wide, 1px `--line` border, containing a hand-sketched SVG.
  2. The project name in Special Elite, 16px, uppercase, 12px below the box.
  3. A metadata line: `TYPOLOGY · YEAR`, 10px, `--muted`.
  4. A 2px accent rule beneath (hidden at rest).
- No description text on this page. Keep it this minimal.

### Hover
- A flat wash of the project's accent color fades in behind the icon (opacity .16, 200ms).
- The 2px accent rule under the metadata line grows from 0 to 36px (250ms).
- Cursor switches to the filled ring (only while over the icon box, not the whole column).
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

## 7. The menu transition (prototype this exactly)

On load the page shows the **Home page** (section 5) under the tall header with the full menu. The project grid is not visible.

**Clicking `PROJECTS` in the right-hand menu:**
1. The word `PROJECTS` travels from its menu position to the **left, directly below `ANDREEA HALIP`** (top 46px, left 40px). It stays the **same size and weight** the whole way (12px, no scale-up), in black.
2. At the same time the other two links (`RESUME`/`CONTACT`, whichever were not clicked) slide ~120px to the right and fade out, staggered 40ms apart, 0.5s with `cubic-bezier(.22,1,.36,1)`.
3. The title's travel takes 0.7s with the same easing. The header shrinks from its home height (132px) to its compact height (84px) over the same 0.7s, and the name glides up with it.
4. A small `←` arrow (12px, black) fades in right next to the title (left 22px, same vertical position), after a ~0.35s delay.
5. The Home content fades out (~0.3s), then the Projects rows fade in (opacity 0→1, translateY 10px→0, ~0.45s).

**Clicking the `←` arrow** reverses everything: the title travels back to the menu, the other links slide back in, the header grows back to its home height, the Projects rows fade out and the Home content fades back in.

The title must end exactly where it was measured to start: compute the PROJECTS link's home-state position analytically (viewport width − 40px − link width; top = (home header height − menu height) / 2), not from the DOM mid-transition, otherwise the reverse animation lands in the wrong place. Also reset the title's transform before measuring on every replay.

Implementation notes:
- Use Framer Motion `layoutId="projects-title"` shared between the menu link and the page title.
- When a visitor lands **directly on `/projects`** (e.g. from Google), start in the already-selected state: compact header, title at left, arrow visible, first row visible, no animation.
- Use a different CSS class for the cursor's hover state than for page views. (In the mockup an early name clash made the cursor hide itself on hover.)
- Hidden menu links must also be non-interactive (`pointer-events: none`), not just invisible.

## 8. Other pages

These are not prototyped yet. Follow the same system (white, black, Space Mono, tiny uppercase labels, hairline `--line` rules, yellow only in the cursor and header square), and ask before inventing new visual ideas.

- **Resume (`/resume`):** same compact header and title-travel transition as Projects (no scroll-snap). Content is a centered column, max-width 900px, of hairline-separated rows (grid: 200px label column + 1fr body, 40px gap, top border 1px `--line`, 64px top / 120px bottom padding). Row labels are small muted uppercase (EDUCATION, ERASMUS, EXPERIENCE, SKILLS, LANGUAGES, FULL CV). Real content so far: Education: Technical University of Cluj-Napoca, Romania, Architecture, fifth year. Erasmus: Roma Tre University, Rome, Italy; Polytechnic University of Cartagena, Spain. Languages: Romanian, Italian, Spanish, English. EXPERIENCE: Maiatec (name only, no role or dates). SKILLS: AutoCAD, Revit, SketchUp, Rhinoceros, Adobe Photoshop, Illustrator and InDesign, hand drawing and model making (confirm with her before launch). FULL CV is an underlined `DOWNLOAD PDF` link to `/andreea-halip-cv.pdf` in `public/` (placeholder until she provides it). Single column below 620px.
- **Project detail (`/projects/[slug]`):** an editorial page: a title and metadata line, one large hero image, then mixed drawings and photos at varied sizes (full width, small, offset), and a short text block. Clicking a project on the grid should flood the screen with that project's accent color as a flat panel (no gradient) before the detail page appears.
- **Contact (`/contact`):** same row layout as Resume with rows EMAIL (`andreeahalip5@gmail.com`, `mailto:` link), PHONE (`0743 895 806`, `tel:+40743895806`). Email and phone are real; no social links for now; keep them in `content/site.ts`. Link hover: border color cyan to yellow, and the custom cursor fills. (No Info page; her introduction lives on Home.)

## 9. SEO (important — she wants to rank first for her own name)

The domain will be her exact name. To make Google index and rank it well:

- **Server-render everything.** All project names and text must be present in the initial HTML, not injected after a click. The grid being visually hidden until the animation is fine as long as it's in the DOM.
- The homepage `<h1>` must be her real name, `Andreea Halip`, even if it's visually styled as the small header text. Use proper `<h2>`/`<h3>` for sections and projects. The animated "PROJECTS" label must not be the page's only heading.
- Unique `<title>` and meta description for every page, with her name, "architecture student" and "Cluj-Napoca", e.g. `Andreea Halip — Architecture student, Cluj-Napoca`. Add Open Graph tags and an OG image. (She is a student, so don't call her "architect" in titles or schema.)
- Add **JSON-LD `Person` schema** on the homepage: `name`, `jobTitle: "Architecture student"`, `alumniOf` / `affiliation` set to the Technical University of Cluj-Napoca, `url`, and `sameAs` links to her Instagram, LinkedIn, Behance (leave placeholders).
- Descriptive `alt` text on every image and drawing.
- Generate `sitemap.xml` and `robots.txt` (Next.js metadata routes).
- Clean readable URLs: `/projects/cibin`, not IDs.
- After launch (done manually, not in code): submit the sitemap and request indexing in Google Search Console, and link the site from her Instagram bio and LinkedIn.

## 10. Accessibility and responsiveness

- Respect `prefers-reduced-motion`: replace the travel/slide animations with a simple crossfade, and turn the custom cursor off.
- All interactive elements are real links or buttons, keyboard-focusable with a visible focus style (a 1px black outline offset 3px is fine). The back arrow needs `aria-label="Back to menu"`.
- Mobile: the header keeps the same structure with smaller gaps, the grid collapses to one column, the custom cursor is off, and there is no hover state, so show the accent color briefly on tap.
- Check contrast: `--muted` text must stay readable on white.

## 11. Suggested structure

```
app/
├── layout.tsx            (header, cursor, global styles, metadata)
├── page.tsx              (home: photo 1/3 + intro text 2/3)
├── projects/
│   ├── page.tsx
│   └── [slug]/page.tsx
├── resume/page.tsx
├── contact/page.tsx
├── sitemap.ts
└── robots.ts

components/
├── Cursor/
├── Header/
├── ProjectsTitle/        (the shared-layout title + back arrow)
├── IndexGrid/            (3-col grid, used by Projects)
├── ProjectIcon/          (one SVG per project)
└── PageTransition/       (accent-color wash)

content/projects/         (typed data: slug, title, typology, year, accent, iconId, images[])
reference/icon-grid-mockup.html
reference/home-photo.png    (must sit next to the mockup HTML so it loads)
```

## 12. Build order

1. Tokens, fonts, layout shell, `Header` (with the centered yellow square).
2. `Cursor`: ring, filled state (no text), click pulse, touch/reduced-motion off.
3. Home page (photo 1/3, text 2/3) and the `/projects` rows (one row of three per screen, snap-scroll) with the six placeholder projects and hover behavior. Compare side-by-side with the mockup until they match.
4. The menu transition (section 7) and the direct-landing state.
5. Project detail template and the accent-wash transition.
6. Resume page (row layout, shared `DocRow` component).
7. Contact (reuses `DocRow`). Generalize the menu transition so any menu link travels to the title position.
8. SEO pass (section 9), accessibility pass (section 10), Lighthouse check, then deploy to Vercel.

## 13. Definition of done

- Placed next to `reference/icon-grid-mockup.html`, the Home page, the Projects page, the sticky header and the menu transition look and feel the same: same sizes, spacing, colors, easing and cursor.
- Works with keyboard only, and with reduced motion on.
- Lighthouse Performance and SEO scores are 90 or higher on mobile.
- Placeholder content is isolated in `content/` and easy to replace.
