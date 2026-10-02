/* ==========================================================================
   QORO — case-study renderer
   Builds a project page from window.QORO_PROJECTS (work/data.js) using the
   site's existing components and hooks, then lets ../script.js animate it
   exactly like the homepage. Loaded before script.js (both deferred).
   ========================================================================== */
(() => {
  'use strict';

  const projects = window.QORO_PROJECTS || [];
  const slug = document.body.dataset.case;
  const index = projects.findIndex((p) => p.slug === slug);
  const mount = document.querySelector('[data-case-root]');
  if (index < 0 || !mount) return;

  const p = projects[index];
  const next = projects[(index + 1) % projects.length];
  const total = String(projects.length).padStart(2, '0');
  const ROOT = '../';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.title = `${p.name} — ${p.category} | Qoro`;
  document.documentElement.style.setProperty('--case-tone', p.tone);

  /* ---------- helpers ---------- */
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Responsive <img>. `base` has no size suffix; `widths` are the files on disk.
  const img = (base, widths, sizes, alt, { eager = false, w = 2400, h = 1500 } = {}) => {
    const src = `${ROOT}${base}-${widths[0]}.webp`;
    const srcset = widths.map((wd) => `${ROOT}${base}-${wd}.webp ${wd}w`).join(', ');
    return `<img src="${src}" srcset="${srcset}" sizes="${sizes}" width="${w}" height="${h}"
      ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" alt="${esc(alt)}">`;
  };
  const W_SCREEN = [1200, 2400];
  const W_DETAIL = [900, 1800];
  const W_MOBILE = [780];

  const arrow = '<svg viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
  const arrowUp = '<svg viewBox="0 0 16 16"><path d="M4 12 12 4M5.5 4H12v6.5"/></svg>';
  const pill = (href, label, icon = arrow, attrs = '') => `
    <a class="pill magnetic" href="${href}" ${attrs}>
      <span class="pill__label">${label}</span>
      <span class="pill__icon" aria-hidden="true">${icon}${icon}</span>
    </a>`;

  // Light or dark text for a swatch, from its luminance
  const ink = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
      v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.35 ? '#0c0c0b' : '#e1e0cc';
  };

  const fontStyle = (f) => `font-family:'${f.family}';font-weight:${f.weight};font-style:${f.style};letter-spacing:${f.tracking}`;

  /* ---------- shared chrome (same markup as the homepage) ---------- */
  const navLinks = [['Work', 'work'], ['Services', 'services'], ['Studio', 'studio'], ['Pricing', 'pricing'], ['Contact', 'contact']];

  const nav = `
  <header class="nav nav--brand" data-nav>
    <nav class="nav__tab" aria-label="Primary">
      <a class="nav__brand" href="${ROOT}index.html" aria-label="Qoro — home" data-transition="Qoro">Qoro<sup>*</sup></a>
      <ul class="nav__list">
        ${navLinks.map(([l, id]) => `<li><a class="nav__link" href="${ROOT}index.html#${id}" ${id === 'work' ? 'aria-current="page"' : ''} data-transition="${l}">${l}</a></li>`).join('')}
      </ul>
      <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="menu" data-menu-toggle>
        <span class="nav__toggle-label" data-menu-label>Menu</span>
        <span class="nav__toggle-icon" aria-hidden="true"><i></i><i></i></span>
      </button>
    </nav>
  </header>

  <div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Site menu" hidden data-menu>
    <div class="menu__frame">
      <div class="cinematic" aria-hidden="true"><div class="cinematic__blob"></div><div class="cinematic__vignette"></div></div>
      <div class="noise noise--overlay" aria-hidden="true"></div>
      <ol class="menu__list">
        ${navLinks.map(([l, id], i) => `<li><a href="${ROOT}index.html#${id}" data-menu-link data-transition="${l}"><span class="menu__num">0${i + 1}</span>${id === 'contact' ? `<em>${l}</em>` : l}</a></li>`).join('')}
      </ol>
      <div class="menu__foot">
        <a href="mailto:hello@qoro.studio">hello@qoro.studio</a>
        <div class="menu__social">
          <a href="#" aria-label="Qoro on Instagram">Instagram</a>
          <a href="#" aria-label="Qoro on LinkedIn">LinkedIn</a>
        </div>
      </div>
    </div>
  </div>

  <div class="cursor" aria-hidden="true" data-cursor><span class="cursor__ball"><span data-cursor-label>View</span></span></div>`;

  const footer = `
  <footer class="footer">
    <div class="noise noise--bg" aria-hidden="true"></div>
    <div class="container">
      <div class="footer__lead">
        <p class="footer__statement" data-reveal>Independent design &amp; engineering studio. <em>Digital experiences, built with intent.</em></p>
        <a class="footer__top" href="#top">Back to top <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3M4 7l4-4 4 4"/></svg></a>
      </div>
      <nav class="footer__nav" aria-label="Footer">
        <div class="footer__col">
          <h3 class="footer__heading">Studio</h3>
          <ul>${navLinks.map(([l, id]) => `<li><a class="link" href="${ROOT}index.html#${id}" data-transition="${l}">${l}</a></li>`).join('')}</ul>
        </div>
        <div class="footer__col">
          <h3 class="footer__heading">Connect</h3>
          <ul>
            <li><a class="link" href="mailto:hello@qoro.studio">Email</a></li>
            <li><a class="link" href="#" aria-label="Qoro on Instagram">Instagram</a></li>
            <li><a class="link" href="#" aria-label="Qoro on LinkedIn">LinkedIn</a></li>
          </ul>
        </div>
        <div class="footer__col footer__col--wide">
          <h3 class="footer__heading">Visit</h3>
          <p>London, Athens and wherever the work is.<br><a class="link" href="mailto:hello@qoro.studio">hello@qoro.studio</a></p>
          <p class="footer__clock">London <time data-clock>--:--</time></p>
        </div>
      </nav>
      <div class="footer__mark" aria-hidden="true" data-footer-mark>
        <span>Q</span><span>o</span><span>r</span><span>o</span><sup>*</sup>
      </div>
      <div class="footer__base">
        <p>© <span data-year>2026</span> Qoro Studio. All rights reserved.</p>
        <div class="footer__legal"><a class="link" href="#">Privacy</a><a class="link" href="#">Imprint</a></div>
      </div>
    </div>
  </footer>`;

  /* ---------- sections ---------- */
  const hero = `
  <section class="cs-hero" id="top" aria-labelledby="cs-title">
    <div class="cs-hero__frame">
      <div class="cs-hero__info">
        <div class="cs-hero__top" data-reveal data-delay="0.6">
          <a class="cs-back" href="${ROOT}index.html#work" data-transition="Work">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8H3M7 4 3 8l4 4"/></svg>All work
          </a>
          <span class="cs-hero__count">${p.number} / ${total}</span>
        </div>
        <div class="cs-hero__body">
          <h1 class="cs-hero__title" id="cs-title" aria-label="${esc(p.name)}">
            <span class="hero__word" aria-hidden="true" data-split-letters>${esc(p.name)}</span>
          </h1>
          <p class="cs-hero__desc" data-reveal data-delay="0.5" data-rise-only>${esc(p.description)}</p>
          <dl class="cs-hero__facts" data-reveal data-delay="0.7">
            <div><dt>Project</dt><dd>${p.number}</dd></div>
            <div><dt>Category</dt><dd>${esc(p.category)}</dd></div>
            <div><dt>Year</dt><dd>${p.year}</dd></div>
          </dl>
        </div>
      </div>
      <div class="cs-hero__visual">
        <div class="cs-hero__media">${img(p.images.hero, W_SCREEN, '(min-width: 1024px) 62vw, 100vw', p.alt.hero, { eager: true })}</div>
      </div>
    </div>
  </section>`;

  const fact = (label, value) => `<div class="cs-fact"><dt>${label}</dt><dd>${value}</dd></div>`;
  const overview = `
  <section class="cs-overview" aria-labelledby="cs-overview-title">
    <div class="container cs-overview__grid">
      <div class="cs-overview__main">
        <span class="eyebrow" data-reveal>Overview</span>
        <h2 class="cs-overview__intro" id="cs-overview-title" data-split>${p.intro}</h2>
      </div>
      <dl class="cs-facts" data-reveal data-delay="0.15">
        ${fact('Client', esc(p.client))}
        ${fact('Industry', esc(p.industry))}
        ${fact('Year', p.year)}
        ${fact('Location', esc(p.location))}
        ${fact('Services', `<ul>${p.services.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>`)}
      </dl>
    </div>
  </section>`;

  const wide = (base, alt, cls = '') => `
  <figure class="cs-wide ${cls}" data-img-reveal>
    <div class="cs-wide__inner" data-parallax="0.08">${img(base, W_SCREEN, '100vw', alt, { w: 2400, h: 1200 })}</div>
  </figure>`;

  const chapters = [
    ['01', 'The challenge', p.story.challenge],
    ['02', 'The approach', p.story.approach],
    ['03', 'The solution', p.story.solution],
    ['04', 'The result', p.story.result]
  ];
  const chapter = ([num, label, c]) => `
    <article class="cs-chapter">
      <header class="cs-chapter__label" data-reveal>
        <span class="cs-chapter__num">${num}</span>
        <h3 class="eyebrow">${label}</h3>
      </header>
      <div class="cs-chapter__body">
        <p class="cs-chapter__lead" data-split data-stagger="0.04">${esc(c.lead)}</p>
        <p class="cs-chapter__text" data-reveal data-delay="0.15">${esc(c.text)}</p>
      </div>
    </article>`;

  const duo = `
  <div class="cs-duo container" aria-label="Project details">
    <figure class="cs-duo__a" data-img-reveal>
      <div class="cs-duo__inner" data-parallax="0.06">${img(p.images.study, W_DETAIL, '(min-width: 1024px) 34vw, 70vw', p.alt.study, { w: 1800, h: 2250 })}</div>
    </figure>
    <figure class="cs-duo__b" data-img-reveal data-parallax="-0.08">
      <div class="cs-duo__inner">${img(p.images.screens[2], W_SCREEN, '(min-width: 1024px) 60vw, 100vw', p.alt.screens[2])}</div>
    </figure>
  </div>`;

  const story = `
  <section class="cs-story" aria-label="Project story">
    <div class="container">${chapters.slice(0, 2).map(chapter).join('')}</div>
    ${duo}
    <div class="container">${chapters.slice(2).map(chapter).join('')}</div>
  </section>`;

  const did = `
  <section class="cs-did" aria-labelledby="cs-did-title">
    <div class="cs-panel">
      <div class="cs-did__intro">
        <span class="eyebrow" data-reveal>What we did</span>
        <h2 class="cs-did__title" id="cs-did-title" data-split>Our part <em>in the work.</em></h2>
        <p class="cs-did__text" data-reveal data-delay="0.15">Qoro led ${p.contribution.length} disciplines on ${esc(p.name)}, carried by one small team from first conversation to launch.</p>
      </div>
      <ol class="disciplines" aria-label="Qoro's contribution">
        ${p.contribution.map((c, i) => `
          <li class="discipline" data-discipline>
            <span class="discipline__num">${String(i + 1).padStart(2, '0')}</span>
            <span class="discipline__name">${esc(c.name)}</span>
            <em class="discipline__note">${esc(c.note)}</em>
          </li>`).join('')}
      </ol>
    </div>
  </section>`;

  const swatches = p.palette.map((c, i) => `
    <button class="cs-swatch" type="button" style="--c:${c.hex};--ink:${ink(c.hex)}" data-copy-hex="${c.hex}"
      data-scale-in data-index="${i}" aria-label="Copy ${c.name} ${c.hex}">
      <span class="cs-swatch__role">${esc(c.role)}</span>
      <span class="cs-swatch__name">${esc(c.name)}</span>
      <span class="cs-swatch__hex"><span data-hex-label>${c.hex}</span></span>
    </button>`).join('');

  const specimen = (label, f, i) => `
    <div class="cs-specimen" data-scale-in data-index="${i}">
      <div class="cs-specimen__head">
        <span class="eyebrow">${label}</span>
        <span class="cs-specimen__font">${f.placeholder ? 'Placeholder — replace in data.js' : esc(f.label)}</span>
      </div>
      <p class="cs-specimen__aa" style="${fontStyle(f)}" aria-hidden="true">Aa</p>
      <div class="cs-specimen__sets" style="${fontStyle(f)}" aria-label="${esc(f.label)} character set">
        <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
        <p>abcdefghijklmnopqrstuvwxyz</p>
        <p>0123456789 &amp;?!</p>
      </div>
    </div>`;

  const system = `
  <section class="cs-system" aria-labelledby="cs-system-title">
    <div class="container">
      <header class="section-head">
        <div class="section-head__main">
          <span class="eyebrow" data-reveal>Design system</span>
          <h2 class="section-head__title" id="cs-system-title" data-split>Colour <em>&amp; type.</em></h2>
        </div>
        <p class="section-head__note" data-reveal data-delay="0.2">The palette and typefaces behind ${esc(p.name)}. Tap a colour to copy its value.</p>
      </header>
      <div class="cs-palette">${swatches}</div>
      <span class="sr-only" aria-live="polite" data-hex-status></span>
      <div class="cs-type">
        ${specimen('Display', p.fonts.display, 0)}
        ${specimen('Body', p.fonts.body, 1)}
      </div>
    </div>
  </section>`;

  const [bg, fg, accent] = p.palette.map((c) => c.hex);
  const language = `
  <section class="cs-language" aria-labelledby="cs-language-title">
    <div class="container">
      <header class="cs-language__head">
        <span class="eyebrow" data-reveal>Visual language</span>
        <h2 class="cs-language__title" id="cs-language-title" data-split data-stagger="0.04">${esc(p.language)}</h2>
      </header>
      <div class="cs-board">
        <figure class="cs-board__ui" data-img-reveal>
          <div class="cs-board__inner" data-parallax="0.05">${img(p.images.ui, W_DETAIL, '(min-width: 1024px) 40vw, 100vw', p.alt.ui, { w: 1800, h: 2250 })}</div>
        </figure>
        <div class="cs-board__type" style="--bg:${bg};--fg:${fg}" data-scale-in>
          <span class="cs-board__cap">Wordmark</span>
          <p class="cs-board__word" style="${fontStyle(p.fonts.display)}">${esc(p.name)}</p>
          <div class="cs-board__dots" aria-hidden="true">${p.palette.map((c) => `<i style="background:${c.hex}"></i>`).join('')}</div>
        </div>
        <div class="cs-board__live" style="--bg:${bg};--fg:${fg};--accent:${accent}" data-scale-in data-index="1">
          <span class="cs-board__cap">Interaction — try it</span>
          <div class="cs-board__buttons">
            <button class="cs-demo-btn" type="button" style="${fontStyle(p.fonts.body)}">Primary <span aria-hidden="true">→</span></button>
            <button class="cs-demo-btn cs-demo-btn--ghost" type="button" style="${fontStyle(p.fonts.body)}">Secondary</button>
          </div>
        </div>
        <figure class="cs-board__study" data-img-reveal>
          <div class="cs-board__inner" data-parallax="-0.06">${img(p.images.study, W_DETAIL, '(min-width: 1024px) 26vw, 100vw', p.alt.study, { w: 1800, h: 2250 })}</div>
        </figure>
      </div>
    </div>
  </section>`;

  const screens = `
  <section class="cs-screens" aria-labelledby="cs-screens-title">
    <div class="container">
      <header class="section-head">
        <div class="section-head__main">
          <span class="eyebrow" data-reveal>The website</span>
          <h2 class="section-head__title" id="cs-screens-title" data-split>Designed and built <em>in the browser.</em></h2>
        </div>
        <p class="section-head__note" data-reveal data-delay="0.2">Homepage, index and inner pages, designed as one system across desktop and mobile.</p>
      </header>
      <figure class="cs-screen cs-screen--full" data-img-reveal>
        ${img(p.images.screens[0], W_SCREEN, '(min-width: 1480px) 1448px, 100vw', p.alt.screens[0])}
      </figure>
      <div class="cs-screens__pair">
        <figure class="cs-screen cs-screen--left" data-img-reveal data-parallax="0.04">
          ${img(p.images.screens[1], W_SCREEN, '(min-width: 1024px) 58vw, 100vw', p.alt.screens[1])}
        </figure>
        <figure class="cs-screen cs-screen--right" data-img-reveal data-parallax="-0.07">
          ${img(p.images.screens[2], W_SCREEN, '(min-width: 1024px) 50vw, 100vw', p.alt.screens[2])}
        </figure>
      </div>
    </div>
    <div class="cs-mobile">
      <div class="cs-mobile__head container">
        <span class="eyebrow" data-reveal>On mobile</span>
        <p class="cs-mobile__note" data-reveal data-delay="0.1">Redesigned for the thumb, not shrunk from the desktop.</p>
      </div>
      <div class="cs-mobile__row" tabindex="0" aria-label="Mobile screens, scrollable">
        ${p.images.mobile.map((m, i) => `
          <figure class="cs-phone" data-img-reveal style="--n:${i}">
            <div class="cs-phone__float">${img(m, W_MOBILE, '(min-width: 1024px) 22vw, 70vw', p.alt.mobile[i], { w: 780, h: 1688 })}</div>
          </figure>`).join('')}
      </div>
    </div>
  </section>`;

  const results = `
  <section class="cs-results" aria-labelledby="cs-results-title">
    <div class="container">
      <span class="eyebrow" data-reveal id="cs-results-title">Outcome</span>
      ${p.metrics && p.metrics.length ? `
        <div class="cs-metrics">${p.metrics.map((m, i) => `
          <div class="cs-metric" data-reveal data-delay="${i * 0.1}"><p class="cs-metric__value">${esc(m.value)}</p><p class="cs-metric__label">${esc(m.label)}</p></div>`).join('')}
        </div>` : ''}
      <ol class="cs-outcomes">
        ${p.outcomes.map((o, i) => `
          <li class="cs-outcome" data-reveal data-delay="${i * 0.1}">
            <span class="cs-outcome__num">${String(i + 1).padStart(2, '0')}</span>
            <h3 class="cs-outcome__title">${esc(o.title)}</h3>
            <p class="cs-outcome__text">${esc(o.text)}</p>
          </li>`).join('')}
      </ol>
    </div>
  </section>`;

  const statement = `
  <section class="cs-statement" aria-label="Project statement">
    <div class="container">
      <span class="eyebrow" data-reveal>${esc(p.name)} — in one line</span>
      <p class="cs-statement__text" data-split data-stagger="0.05">${p.statement}</p>
    </div>
  </section>`;

  const nextHref = `${next.slug}.html`;
  const nextSection = `
  <section class="cs-next" aria-labelledby="cs-next-title">
    <a class="cs-next__card" href="${nextHref}" data-transition="${esc(next.name)}" data-cursor-target="Next"
       style="--tone:${next.tone}" aria-label="Next project: ${esc(next.name)}, ${esc(next.category)}, ${next.year}">
      <div class="cs-next__info">
        <div class="cs-next__top">
          <span class="eyebrow">Next project</span>
          <span class="cs-hero__count">${next.number} / ${total}</span>
        </div>
        <div class="cs-next__body">
          <h2 class="cs-next__title" id="cs-next-title">${esc(next.name)}</h2>
          <p class="cs-next__meta"><span>${esc(next.category)}</span><span>${next.year}</span></p>
          <span class="pill cs-next__pill" aria-hidden="true">
            <span class="pill__label">Explore project</span>
            <span class="pill__icon">${arrow}${arrow}</span>
          </span>
        </div>
      </div>
      <div class="cs-next__visual">
        <div class="cs-next__media">${img(next.images.hero, W_SCREEN, '(min-width: 1024px) 62vw, 100vw', '', {})}</div>
      </div>
    </a>
    <div class="cs-next__actions container">
      <a class="cs-outline magnetic" href="${ROOT}index.html#work" data-transition="Work">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8H3M7 4 3 8l4 4"/></svg>
        Back to work
      </a>
      <p class="cs-next__hint">${projects.map((q) => `<a href="${q.slug}.html" class="${q.slug === slug ? 'is-current' : ''}" ${q.slug === slug ? 'aria-current="page"' : ''} data-transition="${esc(q.name)}">${q.number}</a>`).join('')}</p>
    </div>
  </section>`;

  /* ---------- mount ---------- */
  mount.outerHTML = `${nav}
  <main id="main" class="cs">
    ${hero}
    ${overview}
    ${wide(p.images.gallery, p.alt.gallery)}
    ${story}
    ${did}
    ${system}
    ${language}
    ${screens}
    ${results}
    ${statement}
    ${nextSection}
  </main>
  ${footer}`;

  /* ==========================================================================
     Case-study-only behaviour (everything else comes from ../script.js)
     ========================================================================== */
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // Image reveal: clip opens and image settles, once
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      imgObserver.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -12% 0px' });
  $$('[data-img-reveal]').forEach((el) => imgObserver.observe(el));

  // Parallax (transform only, rAF-throttled, skipped off-screen)
  const parallax = $$('[data-parallax]');
  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = innerHeight;
    const rects = parallax.map((el) => el.getBoundingClientRect());
    parallax.forEach((el, i) => {
      const r = rects[i];
      if (r.bottom < -200 || r.top > vh + 200) return;
      const offset = (r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.parallax);
      el.style.setProperty('--py', `${offset.toFixed(1)}px`);
    });
  };
  if (!reduceMotion && parallax.length) {
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update, { passive: true });
    update();
  }

  // Copy colour values
  const hexStatus = document.querySelector('[data-hex-status]');
  $$('[data-copy-hex]').forEach((btn) => {
    let t;
    btn.addEventListener('click', async () => {
      const label = btn.querySelector('[data-hex-label]');
      const hex = btn.dataset.copyHex;
      try {
        await navigator.clipboard.writeText(hex);
        label.textContent = 'Copied';
        hexStatus.textContent = `${hex} copied to clipboard`;
      } catch {
        label.textContent = hex;
      }
      clearTimeout(t);
      t = setTimeout(() => { label.textContent = hex; hexStatus.textContent = ''; }, 1600);
    });
  });
})();
