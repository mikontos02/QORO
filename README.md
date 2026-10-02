# Qoro

**Qoro** is a website for a design and engineering studio. It uses warm cream-on-black, framed cinematic panels, film grain and oversized type paired with serif italics.

It features a letter-by-letter hero reveal, stacked scroll-driven project cards, text that brightens as you scroll, magnetic buttons and a custom cursor. Built with plain HTML, CSS and vanilla JavaScript plus [Lenis](https://github.com/darkroomengineering/lenis) for smooth scrolling. It runs straight from `index.html` and supports reduced motion and keyboard navigation.

## Run

Open `index.html` in a browser. No build step.

## Structure

```
index.html
style.css
script.js
work/
  data.js       all case-study content (one entry per project)
  project.js    renders a case study from data.js
  project.css   case-study layouts (extends style.css)
  <slug>.html   thin page shells (halden, solace, ferro, mono, shift)
assets/
  fonts/        Almarai, Instrument Serif (self-hosted)
  images/       Work section visuals (WebP)
  projects/     per-project screens, mobile, details, gallery
  videos/       optional hero clip (assets/videos/hero.mp4)
```

## Adding a project

1. Add an entry to `work/data.js` (order sets the Work and "Next project" order).
2. Put its images in `assets/projects/<slug>/`.
3. Copy any `work/<slug>.html` and change `data-case="<slug>"`.
4. Add a card linking to `work/<slug>.html` in the Work section of `index.html`.
