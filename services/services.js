/* ==========================================================================
   QORO — Services page
   Disclosure list for the six services, a cursor-following preview for
   service and project rows, and the "See it in action" list rendered from
   work/data.js. Loaded before ../script.js, which animates the result.
   ========================================================================== */
(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ------------------------------------------------------------------------
     "See it in action" — one row per project, from the shared project data
     ------------------------------------------------------------------------ */
  const list = $('[data-sv-projects]');
  const projects = window.QORO_PROJECTS || [];
  const arrow = '<svg viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';

  if (list && projects.length) {
    list.innerHTML = projects.map((p) => {
      const services = p.contribution.map((c) => c.name);
      const thumb = `${p.images.hero}-1200.webp`;
      return `
        <li class="sv-project" data-reveal>
          <a class="sv-project__link" href="work/${p.slug}.html" data-transition="${esc(p.name)}" data-preview="${thumb}"
             aria-label="${esc(p.name)} — ${esc(services.join(', '))}. View case study">
            <span class="sv-project__thumb" aria-hidden="true"><img src="${thumb}" width="1200" height="750" loading="lazy" decoding="async" alt=""></span>
            <span class="sv-project__num" aria-hidden="true">${p.number}</span>
            <span class="sv-project__name" aria-hidden="true">${esc(p.name)}</span>
            <span class="sv-project__services" aria-hidden="true">${services.map((s) => `<span>${esc(s)}</span>`).join('')}</span>
            <span class="sv-project__year" aria-hidden="true">${p.year}</span>
            <span class="sv-project__arrow" aria-hidden="true">${arrow}${arrow}</span>
          </a>
        </li>`;
    }).join('');
  }

  /* ------------------------------------------------------------------------
     Service disclosures
     ------------------------------------------------------------------------ */
  const items = $$('[data-svx]');
  const preview = $('[data-sv-preview]');

  const setOpen = (item, open) => {
    const btn = $('[data-svx-toggle]', item);
    btn.setAttribute('aria-expanded', String(open));
    item.classList.toggle('is-open', open);
    if (open && preview) preview.classList.remove('is-on');
  };

  items.forEach((item) => {
    const btn = $('[data-svx-toggle]', item);
    btn.addEventListener('click', () => setOpen(item, btn.getAttribute('aria-expanded') !== 'true'));
  });

  // Jumping to a service (hero index or a #hash in the URL) opens it
  const openFromHash = (hash) => {
    const item = hash && items.find((i) => `#${i.id}` === hash);
    if (item) setOpen(item, true);
  };
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) openFromHash(link.getAttribute('href'));
  });
  openFromHash(location.hash);

  /* ------------------------------------------------------------------------
     Floating preview — follows the cursor over collapsed services & projects
     ------------------------------------------------------------------------ */
  if (preview && finePointer && !reduceMotion) {
    const img = $('[data-sv-preview-img]', preview);
    const s = { x: 0, y: 0, tx: 0, ty: 0, raf: 0, started: false };

    const tick = () => {
      s.x += (s.tx - s.x) * 0.16;
      s.y += (s.ty - s.y) * 0.16;
      preview.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
      s.raf = Math.abs(s.tx - s.x) > 0.1 || Math.abs(s.ty - s.y) > 0.1 ? requestAnimationFrame(tick) : 0;
    };
    const move = (x, y) => {
      s.tx = x; s.ty = y;
      if (!s.started) { s.x = x; s.y = y; s.started = true; }
      if (!s.raf) s.raf = requestAnimationFrame(tick);
    };

    addEventListener('pointermove', (e) => { if (preview.classList.contains('is-on')) move(e.clientX, e.clientY); }, { passive: true });

    $$('[data-preview]').forEach((el) => {
      el.addEventListener('pointerenter', (e) => {
        if (el.getAttribute('aria-expanded') === 'true') return; // an open service already shows its visual
        if (img.getAttribute('src') !== el.dataset.preview) img.src = el.dataset.preview;
        move(e.clientX, e.clientY);
        preview.classList.add('is-on');
      });
      el.addEventListener('pointerleave', () => preview.classList.remove('is-on'));
    });
    addEventListener('scroll', () => preview.classList.remove('is-on'), { passive: true });
  }
})();
