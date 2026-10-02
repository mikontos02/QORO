/* ==========================================================================
   QORO — About page
   Team list (from TEAM below), the pinned horizontal "How we think" strip,
   and the design ↔ code demo. Everything else comes from ../script.js.
   ========================================================================== */
(() => {
  'use strict';

  /* ------------------------------------------------------------------------
     TEAM — add real people here. Leave empty to show the studio statement.
     Never add fictional people.

     {
       name: 'Full Name',
       role: 'Creative Director',
       bio: 'One or two sentences in your own words.',
       photo: 'assets/team/full-name.webp'   // optional, portrait 4:5
     }
     ------------------------------------------------------------------------ */
  const TEAM = [];

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ------------------------------------------------------------------------
     People
     ------------------------------------------------------------------------ */
  const teamList = $('[data-team]');
  const fallback = $('[data-team-fallback]');
  if (teamList && TEAM.length) {
    teamList.innerHTML = TEAM.map((m, i) => `
      <li class="ab-member" data-reveal ${m.photo ? `data-photo="${esc(m.photo)}"` : ''}>
        <span class="ab-member__num">${String(i + 1).padStart(2, '0')}</span>
        <h3 class="ab-member__name">${esc(m.name)}</h3>
        <p class="ab-member__role">${esc(m.role)}</p>
        ${m.bio ? `<p class="ab-member__bio">${esc(m.bio)}</p>` : ''}
        ${m.photo ? `<span class="ab-member__photo"><img src="${esc(m.photo)}" alt="Portrait of ${esc(m.name)}" loading="lazy" decoding="async"></span>` : ''}
      </li>`).join('');
    teamList.hidden = false;
    if (fallback) fallback.hidden = true;

    // Fine pointers: the portrait follows the cursor over each name
    const preview = $('[data-ab-preview]');
    if (preview && finePointer && !reduceMotion) {
      const img = $('[data-ab-preview-img]', preview);
      const s = { x: 0, y: 0, tx: 0, ty: 0, raf: 0, started: false };
      const tick = () => {
        s.x += (s.tx - s.x) * 0.16; s.y += (s.ty - s.y) * 0.16;
        preview.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
        s.raf = Math.abs(s.tx - s.x) > 0.1 || Math.abs(s.ty - s.y) > 0.1 ? requestAnimationFrame(tick) : 0;
      };
      const move = (x, y) => {
        s.tx = x; s.ty = y;
        if (!s.started) { s.x = x; s.y = y; s.started = true; }
        if (!s.raf) s.raf = requestAnimationFrame(tick);
      };
      addEventListener('pointermove', (e) => { if (preview.classList.contains('is-on')) move(e.clientX, e.clientY); }, { passive: true });
      $$('[data-photo]', teamList).forEach((el) => {
        el.addEventListener('pointerenter', (e) => {
          img.src = el.dataset.photo; move(e.clientX, e.clientY); preview.classList.add('is-on');
        });
        el.addEventListener('pointerleave', () => preview.classList.remove('is-on'));
      });
      addEventListener('scroll', () => preview.classList.remove('is-on'), { passive: true });
    }
  }

  /* ------------------------------------------------------------------------
     How we think — vertical scroll drives a horizontal strip (desktop only)
     ------------------------------------------------------------------------ */
  const section = $('[data-hscroll]');
  const track = $('[data-hscroll-track]');
  const desktop = matchMedia('(min-width: 1024px)');
  let distance = 0;
  let enabled = false;
  let ticking = false;

  const apply = () => {
    ticking = false;
    if (!enabled) return;
    const r = section.getBoundingClientRect();
    const p = clamp(-r.top / (section.offsetHeight - innerHeight), 0, 1);
    track.style.transform = `translate3d(${(-p * distance).toFixed(1)}px, 0, 0)`;
  };

  const measure = () => {
    enabled = Boolean(section && track) && desktop.matches && !reduceMotion;
    if (!section || !track) return;
    section.classList.toggle('is-pinned', enabled);
    if (!enabled) {
      section.style.height = '';
      track.style.transform = '';
      return;
    }
    distance = Math.max(0, track.scrollWidth - innerWidth);
    section.style.height = `${distance + innerHeight}px`;
    apply();
  };

  if (section && track) {
    addEventListener('scroll', () => { if (enabled && !ticking) { ticking = true; requestAnimationFrame(apply); } }, { passive: true });
    addEventListener('resize', measure, { passive: true });
    desktop.addEventListener('change', measure);
    addEventListener('load', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    measure();

    // Keyboard: bring a focused link inside the strip into view
    const sticky = track.parentElement;
    track.addEventListener('focusin', (e) => {
      if (!enabled) return;
      sticky.scrollLeft = 0; // undo any focus-driven scroll on the clipped container
      const left = e.target.getBoundingClientRect().left - track.getBoundingClientRect().left;
      const p = clamp((left - innerWidth * 0.3) / distance, 0, 1);
      const top = section.getBoundingClientRect().top + scrollY + p * (section.offsetHeight - innerHeight);
      const lenis = window.QORO && window.QORO.lenis;
      if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
      else scrollTo({ top, behavior: 'auto' });
      apply();
    });
  }

  /* ------------------------------------------------------------------------
     Design ↔ code — the hover rule lights up while the button is active
     ------------------------------------------------------------------------ */
  const demo = $('[data-code-demo]');
  if (demo) {
    const trigger = $('[data-code-trigger]', demo);
    const on = () => demo.classList.add('is-hover');
    const off = () => demo.classList.remove('is-hover');
    trigger.addEventListener('pointerenter', on);
    trigger.addEventListener('pointerleave', off);
    trigger.addEventListener('focus', on);
    trigger.addEventListener('blur', off);
  }
})();
