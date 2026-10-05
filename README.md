# Qoro

**Qoro** is a website for a design and engineering studio. It uses warm cream-on-black, framed cinematic panels, film grain and oversized type paired with serif italics.

It features a letter-by-letter hero reveal, stacked scroll-driven project cards, text that brightens as you scroll, magnetic buttons and a custom cursor. Built with plain HTML, CSS and vanilla JavaScript plus [Lenis](https://github.com/darkroomengineering/lenis) for smooth scrolling. It runs straight from `index.html` and supports reduced motion and keyboard navigation.

## Run

Open `index.html` in a browser. No build step.

## Structure

```
index.html      homepage
work.html       Work archive — all projects
about.html      About page: studio, philosophy, principles, people
services.html   Services page: capabilities, process and work
pricing.html    Pricing page: starting points, comparison, scope, FAQ
contact.html    Contact page with the project brief form
style.css       shared design system, components and motion
script.js       shared behaviour: nav, menu, reveals, transitions, cursor
about/
  about.js      TEAM list, pinned "How we think" strip, design/code demo
  about.css     about page layouts
services/
  services.js   service disclosures, hover previews, project rows
  services.css  services page layouts
pricing/
  pricing.js    "Which option fits?" helper
  pricing.css   pricing page layouts
contact/
  contact.js    brief form: custom selects, validation, submission
  contact.css   form and contact layouts
work/
  data.js       all project content (one entry per project)
  archive.js    renders the Work archive from data.js
  archive.css   Work archive compositions
  project.js    renders a case study from data.js
  project.css   case-study layouts (extends style.css)
  <slug>.html   thin case-study shells (halden, solace, ferro, mono, shift)
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
4. It appears on `work.html` automatically.

## Contact form

The site has no backend, so the form is not connected yet. Until it is, a
valid brief is handed to the visitor's email app, and the page says plainly
that nothing was sent. To connect a service, set `endpoint` in the
`CONTACT_CONFIG` block at the top of `contact/contact.js` (Formspree,
Web3Forms or your own API). Use public keys only; keep secrets server-side.
The "Enquiry sent" state appears only after the endpoint returns a 2xx.

## Team

The About page shows a studio statement until real people are added. Add
team members to the `TEAM` list at the top of `about/about.js` (name, role,
bio and an optional 4:5 portrait in `assets/team/`). Never add fictional people.

## Design system

All pages share the tokens at the top of `style.css`. Use them for new pages
instead of hard-coded values:

- **Type roles:** `--text-h1` (inner-page heroes, with `.page-title`),
  `--text-h2` (full-width section titles), `--text-h2-sm` (side-column titles),
  `--text-h3`, `--text-h3-sm`, `--text-h4`, `--text-statement`,
  `--text-display` (manifesto moments), `--text-project` (project names),
  `--text-body-lg`, `--text-body`, `--text-small`, `--text-label`.
  Labels are 14px below 1024px and 12px above, tracked at `--tracking-label`.
- **Spacing:** `--space-2xs` … `--space-4xl`, `--head-gap` (eyebrow → title),
  `--head-space` (section heading → content) and `--section-pad`. Every
  `main > section` gets `--section-pad` top and bottom automatically, so the
  gap between sections is always the same.
- **Layout:** `.container` with `--container` / `--gutter`; the gutter equals
  `--frame`, so content lines up with the framed panels.
- **Components:** `.pill` (primary), `.btn-outline` (secondary), `.row-cta`
  (full-width link row), `.section-head`, `.eyebrow`.

Deliberate exceptions: the homepage and Work wordmarks, the homepage intro and
services headings (from the original reference), project-name titles and the
CTA headline.
