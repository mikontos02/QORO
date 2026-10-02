/* ==========================================================================
   QORO — interactions
   One rAF-throttled scroll pass drives every scroll-linked effect; pointer
   effects only run a lerp loop while they are still settling.
   ========================================================================== */
(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const $ = (sel, ctx = doc) => ctx.querySelector(sel);
  const $$ = (sel, ctx = doc) => Array.from(ctx.querySelectorAll(sel));
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  let vh = innerHeight;

  /* ------------------------------------------------------------------------
     Text splitting
     ------------------------------------------------------------------------ */

  // Words (keeps <em> styling). Screen readers get one clean sr-only copy.
  function splitWords(el) {
    const label = el.textContent.replace(/\s+/g, ' ').trim();
    const frag = doc.createDocumentFragment();
    let i = 0;

    const walk = (node, isEm) => {
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          child.textContent.split(/\s+/).filter(Boolean).forEach((word) => {
            const span = doc.createElement('span');
            span.className = isEm ? 'w w--em' : 'w';
            span.textContent = word;
            span.style.setProperty('--i', i++);
            span.setAttribute('aria-hidden', 'true');
            frag.append(span, ' ');
          });
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          walk(child, isEm || child.tagName === 'EM');
        }
      });
    };
    walk(el, false);

    const sr = doc.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = label;

    el.textContent = '';
    el.append(sr, frag);
    if (el.dataset.stagger) el.style.setProperty('--stagger', `${el.dataset.stagger}s`);
  }

  // Letters for the hero wordmark mask reveal
  function splitLetters(el) {
    const chars = Array.from(el.textContent.trim());
    el.textContent = '';
    chars.forEach((ch, i) => {
      const span = doc.createElement('span');
      span.className = 'char';
      span.textContent = ch;
      span.style.setProperty('--i', i);
      el.append(span);
    });
  }

  // Letters for the scroll-scrubbed paragraph (reference: offset start 0.8 → end 0.2)
  function splitScrub(el) {
    const text = el.textContent.replace(/\s+/g, ' ').trim();
    const total = text.length;
    const frag = doc.createDocumentFragment();
    let index = 0;

    text.split(' ').forEach((word, wi, words) => {
      const w = doc.createElement('span');
      w.className = 'scrub-word';
      w.setAttribute('aria-hidden', 'true');
      Array.from(word).forEach((ch) => {
        const c = doc.createElement('span');
        c.className = 'ch';
        c.textContent = ch;
        c.style.setProperty('--c', (index / total).toFixed(4));
        index++;
        w.append(c);
      });
      frag.append(w);
      if (wi < words.length - 1) { frag.append(' '); index++; }
    });

    const sr = doc.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = text;
    el.textContent = '';
    el.append(sr, frag);
  }

  $$('[data-split]').forEach(splitWords);
  $$('[data-split-letters]').forEach(splitLetters);
  const scrubEls = $$('[data-scrub]');
  scrubEls.forEach(splitScrub);

  // Per-element delays / indices from data attributes
  $$('[data-delay]').forEach((el) => el.style.setProperty('--delay', `${el.dataset.delay}s`));
  $$('[data-index]').forEach((el) => el.style.setProperty('--index', el.dataset.index));

  /* ------------------------------------------------------------------------
     Smooth scrolling (Lenis) — skipped for reduced motion
     ------------------------------------------------------------------------ */
  let lenis = null;
  if (!reduceMotion && typeof window.Lenis === 'function') {
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true, autoRaf: true });
  }

  const scrollToTarget = (target) => {
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.4 });
    } else {
      const y = typeof target === 'number' ? target : target.getBoundingClientRect().top + scrollY;
      window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  };

  /* ------------------------------------------------------------------------
     Reveal on view
     ------------------------------------------------------------------------ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      cardObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -100px 0px' });

  const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      projectObserver.unobserve(entry.target);
    });
  }, { threshold: 0.35 });

  const startReveals = () => {
    // Hero content is part of the load sequence, not the scroll sequence
    $$('#top [data-reveal]').forEach((el) => el.classList.add('is-in'));
    $$('[data-reveal], [data-split], [data-footer-mark]').forEach((el) => {
      if (!el.closest('#top')) revealObserver.observe(el);
    });
    $$('[data-scale-in]').forEach((el) => cardObserver.observe(el));
    $$('[data-project]').forEach((el) => projectObserver.observe(el));
  };

  // Page-load: wait for fonts so the wordmark mask never jumps
  const ready = () => {
    if (root.classList.contains('is-ready')) return;
    requestAnimationFrame(() => {
      root.classList.add('is-ready');
      startReveals();
      liftCurtain();
    });
  };
  if (doc.fonts && doc.fonts.ready) {
    doc.fonts.ready.then(ready);
    setTimeout(ready, 1200);
  } else {
    ready();
  }

  /* ------------------------------------------------------------------------
     Scroll-linked effects
     ------------------------------------------------------------------------ */
  const nav = $('[data-nav]');
  const heroFrame = $('[data-hero-frame]');
  const projects = $$('[data-project]');
  const disciplines = $$('[data-discipline]');
  const asterisk = $('[data-asterisk]');

  projects.forEach((p, i) => p.style.setProperty('--i', i));

  let projectStickTops = [];
  const measure = () => {
    vh = innerHeight;
    projectStickTops = projects.map((p) => parseFloat(getComputedStyle(p).top) || 0);
  };
  measure();

  let ticking = false;

  function update() {
    ticking = false;
    const y = scrollY;

    // Navigation: dock inside the hero frame at the very top, float afterwards
    nav.classList.toggle('is-floating', y > 8);

    if (reduceMotion) return;

    // Hero recedes as it leaves
    if (heroFrame && y < vh * 1.2) {
      heroFrame.style.setProperty('--hp', clamp(y / vh, 0, 1).toFixed(4));
    }

    // Scrubbed intro letters
    scrubEls.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -vh * 0.2 || r.top > vh) return;
      const p = clamp((vh * 0.8 - r.top) / (vh * 0.6 + r.height), 0, 1);
      el.style.setProperty('--p', p.toFixed(4));
    });

    // Stacked project frames: read everything first, then write
    if (projects.length) {
      const tops = projects.map((p) => p.getBoundingClientRect().top);
      projects.forEach((p, i) => {
        const stick = projectStickTops[i];
        const enter = clamp(1 - (tops[i] - stick) / (vh - stick), 0, 1);
        let cover = 0;
        if (i < projects.length - 1) {
          const nextStick = projectStickTops[i + 1];
          cover = clamp(1 - (tops[i + 1] - nextStick) / (vh - nextStick), 0, 1);
        }
        p.style.setProperty('--e', enter.toFixed(4));
        p.style.setProperty('--p', cover.toFixed(4));
      });
    }

    // Studio disciplines light up as they rise, and stay lit (like the reference scrub)
    if (disciplines.length) {
      const centers = disciplines.map((d) => {
        const r = d.getBoundingClientRect();
        return r.top + r.height / 2;
      });
      disciplines.forEach((d, i) => {
        const a = clamp((vh * 0.82 - centers[i]) / (vh * 0.22), 0, 1);
        d.style.setProperty('--a', a.toFixed(3));
      });
    }

    // Services asterisk turns with scroll
    if (asterisk) {
      const r = asterisk.parentElement.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) {
        asterisk.style.setProperty('--rot', `${((vh - r.top) * 0.12).toFixed(2)}deg`);
      }
    }
  }

  const requestUpdate = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  addEventListener('scroll', requestUpdate, { passive: true });
  addEventListener('resize', () => { measure(); requestUpdate(); }, { passive: true });
  update();

  /* ------------------------------------------------------------------------
     Active section in the nav
     ------------------------------------------------------------------------ */
  const navLinks = $$('[data-nav-link]');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.id;
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('[data-section]').forEach((s) => sectionObserver.observe(s));

  // Clear the indicator when back on the hero
  const heroObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) navLinks.forEach((l) => l.removeAttribute('aria-current'));
  }, { rootMargin: '-45% 0px -50% 0px' });
  if (heroFrame) heroObserver.observe($('#top'));

  /* ------------------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------------------ */
  const menu = $('[data-menu]');
  const toggle = $('[data-menu-toggle]');
  const toggleLabel = $('[data-menu-label]');
  const main = $('#main');
  const footer = $('.footer');
  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggleLabel.textContent = 'Close';
    main.inert = true;
    footer.inert = true;
    if (lenis) lenis.stop(); else root.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-open')));
    setTimeout(() => { const first = $('[data-menu-link]', menu); if (first) first.focus(); }, 300);
  }

  function closeMenu({ restoreFocus = true } = {}) {
    if (!menuOpen) return;
    menuOpen = false;
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggleLabel.textContent = 'Menu';
    main.inert = false;
    footer.inert = false;
    if (lenis) lenis.start(); else root.style.overflow = '';
    const hide = () => { if (!menuOpen) menu.hidden = true; };
    if (reduceMotion) hide(); else setTimeout(hide, 800);
    if (restoreFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) closeMenu(); });
  // Close if the viewport grows past the mobile breakpoint
  matchMedia('(min-width: 640px)').addEventListener('change', (e) => { if (e.matches) closeMenu({ restoreFocus: false }); });

  /* ------------------------------------------------------------------------
     Page transitions — a curtain rises over the page, the next page lifts it
     ------------------------------------------------------------------------ */
  const curtainLabel = $('[data-curtain-label]');
  const TRANSITION_KEY = 'qoro:transition';
  const LEAVE_MS = 560;

  // Same-site page navigations only (not hashes on this page, new tabs or downloads)
  function isPageLink(link, e) {
    if (reduceMotion || e.defaultPrevented || e.button !== 0) return false;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
    if (link.target && link.target !== '_self') return false;
    if (link.hasAttribute('download')) return false;
    if (link.protocol !== location.protocol || link.host !== location.host) return false;
    return link.pathname !== location.pathname;
  }

  function leaveTo(url, label) {
    try { sessionStorage.setItem(TRANSITION_KEY, label); } catch (err) { /* storage unavailable */ }
    if (curtainLabel) curtainLabel.textContent = label;
    if (menuOpen) closeMenu({ restoreFocus: false });
    root.classList.remove('is-arriving', 'is-lifting');
    root.classList.add('is-leaving');
    const cursorEl = $('[data-cursor]');
    if (cursorEl) cursorEl.classList.remove('is-active');
    setTimeout(() => { location.href = url; }, LEAVE_MS);
  }

  function liftCurtain() {
    if (!root.classList.contains('is-arriving')) return;
    requestAnimationFrame(() => {
      root.classList.add('is-lifting');
      root.classList.remove('is-arriving');
      setTimeout(() => root.classList.remove('is-lifting'), 1000);
    });
  }

  // Returning via the back button restores a frozen page — drop the curtain
  addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    root.classList.remove('is-leaving', 'is-arriving', 'is-lifting');
    const cursorEl = $('[data-cursor]');
    if (cursorEl) cursorEl.classList.remove('is-active');
  });

  /* ------------------------------------------------------------------------
     In-page anchors (smooth + focus management)
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const hash = link.getAttribute('href');
    if (!hash.startsWith('#')) {
      if (isPageLink(link, e)) {
        e.preventDefault();
        leaveTo(link.href, link.dataset.transition || '');
      }
      return;
    }
    e.preventDefault();
    if (hash === '#') return; // placeholder links

    const target = hash === '#top' ? $('#top') : $(hash);
    if (!target) return;

    const go = () => {
      scrollToTarget(hash === '#top' ? 0 : target);
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      history.replaceState(null, '', hash);
    };

    if (menuOpen) {
      closeMenu({ restoreFocus: false });
      setTimeout(go, reduceMotion ? 0 : 350);
    } else {
      go();
    }
  });

  /* ------------------------------------------------------------------------
     Pointer interactions (fine pointers only)
     ------------------------------------------------------------------------ */
  if (finePointer && !reduceMotion) {
    // Lerp helper that stops itself once settled
    const follower = (apply, ease = 0.14) => {
      const s = { x: 0, y: 0, tx: 0, ty: 0, raf: 0, started: false };
      const tick = () => {
        s.x += (s.tx - s.x) * ease;
        s.y += (s.ty - s.y) * ease;
        apply(s.x, s.y);
        if (Math.abs(s.tx - s.x) > 0.1 || Math.abs(s.ty - s.y) > 0.1) s.raf = requestAnimationFrame(tick);
        else s.raf = 0;
      };
      return (x, y) => {
        s.tx = x; s.ty = y;
        if (!s.started) { s.x = x; s.y = y; s.started = true; }
        if (!s.raf) s.raf = requestAnimationFrame(tick);
      };
    };

    // Hero light follows the pointer
    const hero = $('#top');
    const light = $('[data-hero-light]');
    if (hero && light && heroFrame) {
      const moveLight = follower((x, y) => { light.style.transform = `translate3d(${x}px, ${y}px, 0)`; }, 0.07);
      hero.addEventListener('pointermove', (e) => {
        const r = heroFrame.getBoundingClientRect();
        light.classList.add('is-on');
        moveLight(e.clientX - r.left, e.clientY - r.top);
      });
      hero.addEventListener('pointerleave', () => light.classList.remove('is-on'));
    }

    // Contextual cursor over project frames
    const cursor = $('[data-cursor]');
    const cursorLabel = $('[data-cursor-label]');
    const moveCursor = follower((x, y) => { cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`; }, 0.2);
    addEventListener('pointermove', (e) => moveCursor(e.clientX, e.clientY), { passive: true });
    $$('[data-cursor-target]').forEach((el) => {
      el.addEventListener('pointerenter', (e) => {
        moveCursor(e.clientX, e.clientY); // first position, in case the pointer hasn't moved yet
        cursorLabel.textContent = el.dataset.cursorTarget || 'View';
        cursor.classList.add('is-active');
      });
      el.addEventListener('pointerleave', () => cursor.classList.remove('is-active'));
    });

    // Magnetic pills
    $$('.magnetic').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate3d(${dx * 0.18}px, ${dy * 0.3}px, 0)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });

    // Spotlight on service cards
    $$('[data-spotlight]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  /* ------------------------------------------------------------------------
     Copy email
     ------------------------------------------------------------------------ */
  const copyBtn = $('[data-copy]');
  if (copyBtn) {
    const label = $('[data-copy-label]', copyBtn);
    const status = $('[data-copy-status]');
    let timer;
    copyBtn.addEventListener('click', async () => {
      const value = copyBtn.dataset.copy;
      try {
        await navigator.clipboard.writeText(value);
        label.textContent = 'Copied';
        status.textContent = 'Email address copied to clipboard';
      } catch {
        label.textContent = 'Press ⌘C';
        const range = doc.createRange();
        range.selectNodeContents($('.cta__email-link'));
        const sel = getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
      clearTimeout(timer);
      timer = setTimeout(() => { label.textContent = 'Copy'; status.textContent = ''; }, 2200);
    });
  }

  /* ------------------------------------------------------------------------
     Pricing: expandable tier details
     ------------------------------------------------------------------------ */
  $$('[data-tier-toggle]').forEach((btn) => {
    const panel = doc.getElementById(btn.getAttribute('aria-controls'));
    const label = $('[data-tier-toggle-label]', btn);
    if (!panel) return;
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      panel.classList.toggle('is-open', open);
      label.textContent = open ? 'Hide details' : 'View details';
    });
  });

  /* ------------------------------------------------------------------------
     Footer: live London time + year
     ------------------------------------------------------------------------ */
  const clock = $('[data-clock]');
  if (clock) {
    const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' });
    const tick = () => { clock.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 30000);
  }
  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
