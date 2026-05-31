# UX Review — Jawad Khmaysa Portfolio Site

## Overview

Reviewed: `index.html`, `projects.html`, `samples.html`, `style.css`, `main.js`
Date: May 2026

The visual design foundation is strong — color system, typography pairing, bento-grid layout, and bilingual i18n are well-executed. The issues below are UX problems, not design opinion. Fix them in priority order.

---

## P0 — Usability-Breaking (Fix First)

### 1. Custom cursor hides the real cursor

`body { cursor: none }` makes the site unusable for keyboard users, people with motor impairments, and anyone whose mouse briefly leaves the window. The play button also has `cursor: none`.

**Fix:** Remove `cursor: none` from `body` in `style.css` (line ~116). Remove `cursor: none` from `.pbtn` (line ~1235). The custom decorative cursor divs can remain — they already hide on touch via `@media (pointer: coarse)` — but the native cursor must always be visible underneath.

### 2. Project cards are dead-ends

Every project card on `projects.html` links to `index.html#contact`. A visitor clicking "Grafly" expects to see the project, not jump to a contact form. This breaks the information scent UX principle.

**Fix:** For now, since individual project pages don't exist, make the project cards non-link `<div>` elements instead of `<a>` tags, and add a "Get in Touch" button inside each card that links to contact. Alternatively, add a small CTA within the card body like `<a href="index.html#contact" class="btn-outline">Inquire</a>`. Remove the `<a>` wrapper so the whole card isn't a misleading link.

### 3. Circular link — "More on Request" card

On `index.html`, project card #06 "More on Request" links to `projects.html`, which then… also doesn't show more projects. It's a circular dead-end.

**Fix:** Change the link on card #06 to `index.html#contact` or `mailto:jawad.kh.vo@gmail.com` since "on request" implies contacting Jawad. Update both English and Arabic label to make the action clear: "Request Portfolio ↗".

### 4. Voice Sample 02 has no audio source

In `main.js`, the audio source map only assigns files to indices 0, 2, and 4. The homepage's Sample 02 uses `audio1`, which has no `src`. The player simulates a fake waveform playback via `startSimulation()` — this is deceptive UX.

**Fix:** Either assign a real audio file to index 1 in the source map, or remove Sample 02 from the homepage and show only one sample until the English narration file is ready. If removed, change `.featured-samples` grid to `grid-template-columns: 1fr` temporarily.

### 5. Empty hero paragraph tag

`<p class="hero-sub r d2"></p>` (index.html line ~78) renders an empty reveal-animated element that takes up space and delays subsequent animation timings.

**Fix:** Delete this empty `<p>` tag entirely. The `hero.sub` value in the i18n resources is also empty string — remove both.

---

## P1 — Accessibility

### 6. No skip-to-content link

Screen reader and keyboard users have no way to skip the nav and jump to main content.

**Fix:** Add as the first element inside `<body>`:
```html
<a href="#about" class="skip-link">Skip to content</a>
```
CSS:
```css
.skip-link {
  position: absolute;
  top: -100%;
  left: 16px;
  z-index: 9999;
  background: var(--m);
  color: #fff;
  padding: 12px 24px;
  border-radius: 0 0 12px 12px;
  font-weight: 700;
  text-decoration: none;
}
.skip-link:focus {
  top: 0;
}
```

### 7. No prefers-reduced-motion handling

The reveal animations, marquee, cursor follower, and waveform transitions all run regardless of user motion preferences. This can cause vestibular issues.

**Fix:** Add to `style.css`:
```css
@media (prefers-reduced-motion: reduce) {
  .r { opacity: 1; transform: none; transition: none; }
  .mq-track { animation: none; }
  .sk-bar { transition: none; }
  .card { transition: none; }
  #cur, #cur2 { display: none; }
}
```
And in `main.js`, wrap the cursor animation loop in:
```js
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) { ... }
```

### 8. Low contrast text

Several text elements use very low opacity that fail WCAG AA:
- `.pc-label` on dark backgrounds: `rgba(255,255,255,.38)` — contrast ratio ~2.4:1 (needs 4.5:1)
- `.social-kicker`: `rgba(255,255,255,.42)`
- `.wf-big .wn`: `rgba(255,255,255,.35)`

**Fix:** Raise all `rgba(255,255,255,.3x)` label colors to at least `rgba(255,255,255,.62)` on dark backgrounds. Check each against the specific background color with a contrast checker.

### 9. Missing landmark and semantic elements

`index.html` has no `<main>` element. Sections don't use `aria-labelledby`.

**Fix:** Wrap everything between `</nav>` and `<footer>` in `<main>`. Add `aria-labelledby` to each section pointing to its heading's `id`.

---

## P2 — Performance

### 10. Unused font weights loaded

The CSS declares `@font-face` for 4 weights (400, 500, 600, 700) of IBM Plex Sans Arabic, but the `/assets/Fonts/body/` directory contains 7 weight files including Thin (100), ExtraLight (200), and Light (300) which are never referenced.

**Fix:** Delete these 3 unused font files from the project to reduce bundle size:
- `IBMPlexSansArabic-Thin.ttf`
- `IBMPlexSansArabic-ExtraLight.ttf`
- `IBMPlexSansArabic-Light.ttf`

### 11. No responsive images for hero photo

The hero image is 1536×2752px served at full resolution on all devices. On mobile this is massive overkill.

**Fix:** Create resized versions (e.g., 768w, 1024w, 1536w) and use `srcset`:
```html
<img class="hero-photo"
  src="assets/images/Main%20Photo2.png"
  srcset="assets/images/Main-Photo2-768.webp 768w,
          assets/images/Main-Photo2-1024.webp 1024w,
          assets/images/Main-Photo2-1536.webp 1536w"
  sizes="(max-width: 760px) 100vw, 55vw"
  alt="Jawad Khmaysa, voice artist and graphic designer"
  width="1536" height="2752" decoding="async" fetchpriority="high" />
```
Convert to WebP for significantly smaller file sizes.

### 12. i18next is overkill

A 40KB library for a 2-language static site with no dynamic content loading. The entire translation object is already in `main.js`.

**Fix (optional, lower priority):** Replace i18next with a simple function:
```js
function t(key) {
  return key.split('.').reduce((obj, k) => obj?.[k], resources[currentLocale].translation);
}
```
This removes the CDN dependency and ~40KB of JavaScript.

---

## P3 — SEO & Social

### 13. No meta description or OG tags

The site has no `<meta name="description">`, no Open Graph tags, and no Twitter card meta. Any link shared on social media will show a blank preview.

**Fix:** Add to `<head>` of all three HTML files:
```html
<meta name="description" content="Jawad Khmaysa — Voice artist and graphic designer based in Palestine. Commercial, documentary, and e-learning voice-over in Arabic and English." />
<meta property="og:title" content="Jawad Khmaysa — Voice Artist & Graphic Designer" />
<meta property="og:description" content="Voice-over, brand design, and creative direction. Based in Palestine, working everywhere." />
<meta property="og:image" content="assets/images/Main%20Photo2.png" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
```

### 14. No favicon

No favicon or web manifest. The tab shows a generic browser icon.

**Fix:** Add a favicon (use the maroon single logo):
```html
<link rel="icon" type="image/png" href="assets/My%20LOGO/PNG/maroon%20single.png" />
```
Ideally create a proper 32×32 favicon.ico and 180×180 apple-touch-icon.

---

## P4 — Interaction Polish

### 15. Non-interactive cards have hover lift

Every `.card` gets `transform: translateY(-5px)` on hover, including static cards like the Skills card, Studio Setup card, and stat cards. This creates a false affordance — the user expects a click will do something.

**Fix:** Add `.nolift` class to all non-link, non-button cards. The CSS for `.card.nolift` already exists (line ~392) and disables the hover lift. Apply it to: `.skills-card`, `.vstudio-card`, `.vstat-card`, `.lang-card`, `.format-card`, `.cb-card` (contact bottom).

### 16. Skill percentage bars are a UX anti-pattern

Self-assessed skill bars (93%, 91%, etc.) are widely recognized as a portfolio anti-pattern — they're subjective, unverifiable, and raise more questions than they answer ("93% compared to what?").

**Fix:** Replace the percentage bars with a simpler format. Options:
- Remove percentages entirely and list skills as tags/chips
- Use categories like "Primary" and "Secondary" skills
- Show years of experience instead of percentages

### 17. Mobile nav needs focus trap

When the hamburger menu is open on mobile, keyboard focus can escape the menu into the page behind it.

**Fix:** In the `menuToggle` click handler in `main.js`, when opening:
- Set `tabindex="-1"` on all focusable elements outside the nav
- Focus the first nav link
When closing:
- Restore tabindex
- Return focus to the menu toggle button

### 18. RTL incomplete — social sub margin

`.social-sub { margin-left: auto }` doesn't flip in RTL mode.

**Fix:** Add:
```css
html[dir='rtl'] .social-sub {
  margin-left: 0;
  margin-right: auto;
}
```
Or use `margin-inline-start: auto` instead of `margin-left: auto` to handle both directions automatically.

---

## Summary Checklist

| # | Issue | Priority | Files |
|---|-------|----------|-------|
| 1 | cursor: none on body + .pbtn | P0 | style.css |
| 2 | Project cards all link to #contact | P0 | projects.html |
| 3 | Circular "More on Request" link | P0 | index.html |
| 4 | Sample 02 has no audio source | P0 | main.js, index.html |
| 5 | Empty hero `<p>` tag | P0 | index.html, main.js |
| 6 | No skip-to-content link | P1 | all HTML, style.css |
| 7 | No prefers-reduced-motion | P1 | style.css, main.js |
| 8 | Low contrast labels | P1 | style.css |
| 9 | No `<main>` landmark | P1 | index.html |
| 10 | Unused font files | P2 | assets/Fonts/ |
| 11 | No responsive hero image | P2 | index.html |
| 12 | i18next overhead | P2 | main.js, all HTML |
| 13 | No meta/OG tags | P3 | all HTML |
| 14 | No favicon | P3 | all HTML |
| 15 | False hover affordance | P4 | index.html |
| 16 | Skill percentage bars | P4 | index.html, style.css |
| 17 | Mobile focus trap | P4 | main.js |
| 18 | RTL margin flip | P4 | style.css |
