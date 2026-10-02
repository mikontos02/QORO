/* ==========================================================================
   QORO — Work archive
   Renders work.html's project index and archive from window.QORO_PROJECTS
   (work/data.js), so the Work page, the case studies and "Next project"
   all share one source. Loaded before ../script.js, which animates it.
   ========================================================================== */
(() => {
  'use strict';

  const projects = window.QORO_PROJECTS || [];
  const list = document.querySelector('[data-archive-root]');
  const index = document.querySelector('[data-archive-index]');
  const count = document.querySelector('[data-archive-count]');
  if (!list || !projects.length) return;

  // Composition rhythm. A sixth project starts the cycle again.
  const LAYOUTS = ['full', 'duo', 'side', 'vertical', 'overlay'];

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const arrow = '<svg viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';

  // Image widths available on disk for each kind of asset
  const SIZES = {
    hero: { widths: [1200, 2400], w: 2400, h: 1500 },
    screen: { widths: [1200, 2400], w: 2400, h: 1500 },
    study: { widths: [900, 1800], w: 1800, h: 2250 },
    mobile: { widths: [780], w: 780, h: 1688 }
  };

  const img = (base, kind, sizes) => {
    const k = SIZES[kind];
    const srcset = k.widths.map((wd) => `${base}-${wd}.webp ${wd}w`).join(', ');
    return `<img src="${base}-${k.widths[0]}.webp" srcset="${srcset}" sizes="${sizes}"
      width="${k.w}" height="${k.h}" loading="lazy" decoding="async" alt="">`;
  };

  // A revealed, parallaxed figure. Images are decorative here: the link carries the name.
  const figure = (cls, base, kind, sizes, speed = 0.06) => `
    <figure class="wp__fig ${cls}" data-img-reveal>
      <div class="wp__fig-inner" data-parallax="${speed}">${img(base, kind, sizes)}</div>
    </figure>`;

  const figures = (p, layout) => {
    const im = p.images;
    switch (layout) {
      case 'duo':
        return figure('wp__fig--main', im.hero, 'hero', '(min-width: 1024px) 64vw, 100vw') +
               figure('wp__fig--second', im.study, 'study', '(min-width: 1024px) 30vw, 56vw', -0.08);
      case 'side':
        return figure('wp__fig--main', im.screens[0], 'screen', '(min-width: 1024px) 64vw, 100vw');
      case 'vertical':
        return figure('wp__fig--main', im.study, 'study', '(min-width: 1024px) 40vw, 100vw') +
               figure('wp__fig--second wp__fig--phone', im.mobile[0], 'mobile', '(min-width: 1024px) 18vw, 48vw', -0.1);
      case 'overlay':
      case 'full':
      default:
        return figure('wp__fig--main', im.hero, 'hero', '100vw', 0.05);
    }
  };

  const article = (p, i) => {
    const layout = LAYOUTS[i % LAYOUTS.length];
    return `
      <li class="wp wp--${layout}" id="${p.slug}">
        <a class="wp__link" href="work/${p.slug}.html" data-transition="${esc(p.name)}" data-cursor-target="View case"
           aria-label="${esc(p.name)} — ${esc(p.category)}, ${p.year}. View case study">
          ${figures(p, layout)}
          <div class="wp__heading" data-reveal>
            <span class="wp__num">${p.number}</span>
            <h2 class="wp__title">${esc(p.name)}</h2>
          </div>
          <div class="wp__meta" data-reveal data-delay="0.12">
            <p class="wp__row"><span>${esc(p.category)}</span><span>${p.year}</span></p>
            <p class="wp__desc">${esc(p.description)}</p>
            <span class="wp__cta">Explore project <span class="wp__arrow" aria-hidden="true">${arrow}${arrow}</span></span>
          </div>
        </a>
      </li>`;
  };

  // Optional subset, e.g. <ol data-archive-root data-archive-pick="halden,solace,shift">
  const pick = (list.dataset.archivePick || '').split(',').map((x) => x.trim()).filter(Boolean);
  const shown = pick.length ? pick.map((slug) => projects.find((p) => p.slug === slug)).filter(Boolean) : projects;

  list.innerHTML = shown.map(article).join('');

  if (index) {
    index.innerHTML = projects.map((p) => `
      <li>
        <a class="wk-index__row" href="#${p.slug}">
          <span class="wk-index__num">${p.number}</span>
          <span class="wk-index__name">${esc(p.name)}</span>
          <span class="wk-index__cat">${esc(p.category)}</span>
          <span class="wk-index__year">${p.year}</span>
        </a>
      </li>`).join('');
  }

  if (count) count.textContent = `(${String(projects.length).padStart(2, '0')})`;
})();
