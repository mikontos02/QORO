/* ==========================================================================
   QORO — Contact page: project brief form
   Custom selects (ARIA select-only combobox), validation, progress and an
   honest submission flow. Everything else (reveals, cursor, transitions,
   copy button, clock) comes from ../script.js.
   ========================================================================== */
(() => {
  'use strict';

  /* ------------------------------------------------------------------------
     CONFIGURATION — connect a form service here.

     The site has no backend yet, so `endpoint` is empty. While it is empty,
     a valid brief is handed to the visitor's email app instead and the page
     says plainly that nothing was sent. The "Enquiry sent" state is shown
     only after the endpoint confirms delivery (HTTP 2xx).

     Examples (use PUBLIC keys only — never put secret API keys here):
       Formspree:  endpoint: 'https://formspree.io/f/your-form-id'
       Web3Forms:  endpoint: 'https://api.web3forms.com/submit',
                   extraFields: { access_key: 'your-public-access-key' }
       Own API / Resend: point `endpoint` at your server route, which holds
                   any secret keys and sends the email server-side.
     ------------------------------------------------------------------------ */
  const CONTACT_CONFIG = {
    endpoint: '',
    format: 'json',          // 'json' or 'form' (multipart FormData)
    extraFields: {},         // merged into every submission
    timeoutMs: 15000,
    email: 'hello@qoro.studio'
  };

  const form = document.querySelector('[data-brief]');
  if (!form) return;

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const FIELD_LABELS = {
    name: 'Name', email: 'Email', company: 'Company', service: 'What do you need',
    budget: 'Budget', message: 'Project', source: 'Found us via', plan: 'Package'
  };
  const PROGRESS_FIELDS = ['name', 'email', 'company', 'service', 'budget', 'message', 'source'];

  /* ------------------------------------------------------------------------
     Custom select — ARIA select-only combobox pattern
     ------------------------------------------------------------------------ */
  const selects = {};

  function createSelect(root) {
    const button = $('[data-select-button]', root);
    const list = $('[data-select-list]', root);
    const input = $('[data-select-input]', root);
    const valueEl = $('[data-select-value]', root);
    const options = $$('[role="option"]', list);
    let isOpen = false;
    let active = -1;
    let typed = '';
    let typedTimer;

    const selectedIndex = () => options.findIndex((o) => o.getAttribute('aria-selected') === 'true');

    function setActive(i) {
      active = Math.max(0, Math.min(options.length - 1, i));
      options.forEach((o, k) => o.classList.toggle('is-active', k === active));
      button.setAttribute('aria-activedescendant', options[active].id);
      const o = options[active];
      if (o.offsetTop < list.scrollTop) list.scrollTop = o.offsetTop;
      else if (o.offsetTop + o.offsetHeight > list.scrollTop + list.clientHeight) {
        list.scrollTop = o.offsetTop + o.offsetHeight - list.clientHeight;
      }
    }

    function open() {
      if (isOpen) return;
      Object.values(selects).forEach((s) => s !== api && s.close());
      isOpen = true;
      root.classList.add('is-open');
      button.setAttribute('aria-expanded', 'true');
      setActive(selectedIndex() >= 0 ? selectedIndex() : 0);
    }

    function close() {
      if (!isOpen) return;
      isOpen = false;
      root.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
      button.removeAttribute('aria-activedescendant');
    }

    function choose(i, { focus = true, silent = false } = {}) {
      options.forEach((o, k) => o.setAttribute('aria-selected', String(k === i)));
      input.value = options[i].dataset.value;
      valueEl.textContent = options[i].textContent;
      root.classList.add('is-filled');
      close();
      if (focus) button.focus();
      if (!silent) input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function setValue(value) {
      const i = options.findIndex((o) => o.dataset.value === value);
      if (i >= 0) choose(i, { focus: false });
    }

    function reset() {
      options.forEach((o) => o.setAttribute('aria-selected', 'false'));
      input.value = '';
      valueEl.textContent = valueEl.dataset.placeholder;
      root.classList.remove('is-filled');
    }

    // Type-to-select, like a native select
    function typeahead(char) {
      clearTimeout(typedTimer);
      typed += char.toLowerCase();
      typedTimer = setTimeout(() => { typed = ''; }, 600);
      const start = isOpen ? active + 1 : 0;
      const order = options.slice(start).concat(options.slice(0, start));
      const match = order.find((o) => o.textContent.toLowerCase().startsWith(typed)) ||
                    order.find((o) => o.textContent.toLowerCase().startsWith(char.toLowerCase()));
      if (!match) return;
      const i = options.indexOf(match);
      if (isOpen) setActive(i); else choose(i);
    }

    button.addEventListener('click', () => (isOpen ? close() : open()));

    button.addEventListener('keydown', (e) => {
      const { key } = e;
      if (!isOpen) {
        if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) { e.preventDefault(); open(); return; }
        if (key === 'Home' || key === 'End') { e.preventDefault(); open(); setActive(key === 'Home' ? 0 : options.length - 1); return; }
      } else {
        switch (key) {
          case 'ArrowDown': e.preventDefault(); setActive(active + 1); return;
          case 'ArrowUp': e.preventDefault(); if (e.altKey) { choose(active); } else { setActive(active - 1); } return;
          case 'Home': e.preventDefault(); setActive(0); return;
          case 'End': e.preventDefault(); setActive(options.length - 1); return;
          case 'PageDown': e.preventDefault(); setActive(active + 5); return;
          case 'PageUp': e.preventDefault(); setActive(active - 5); return;
          case 'Enter': case ' ': e.preventDefault(); choose(active); return;
          case 'Escape': e.preventDefault(); close(); return;
          case 'Tab': choose(active, { focus: false }); return; // select and move on
          default: break;
        }
      }
      if (key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && key !== ' ') typeahead(key);
    });

    options.forEach((o, i) => {
      // pointerdown keeps focus on the combobox while choosing
      o.addEventListener('pointerdown', (e) => e.preventDefault());
      o.addEventListener('click', () => choose(i));
      o.addEventListener('pointermove', () => { if (active !== i) setActive(i); });
    });

    root.addEventListener('focusout', (e) => { if (!root.contains(e.relatedTarget)) close(); });
    document.addEventListener('pointerdown', (e) => { if (!root.contains(e.target)) close(); });

    const api = { open, close, setValue, reset, button, input, root };
    return api;
  }

  $$('[data-select]', form).forEach((root) => {
    const s = createSelect(root);
    selects[s.input.name] = s;
  });

  /* ------------------------------------------------------------------------
     Field states, auto-growing textarea, counter, progress
     ------------------------------------------------------------------------ */
  const textarea = $('[data-autogrow]', form);
  const counter = $('[data-count]', form);
  const progressCount = $('[data-progress-count]');
  const progressBar = $('[data-progress-bar]');

  const grow = () => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const updateProgress = () => {
    const done = PROGRESS_FIELDS.filter((n) => (form.elements[n].value || '').trim()).length;
    if (progressCount) progressCount.textContent = String(done).padStart(2, '0');
    if (progressBar) progressBar.style.transform = `scaleX(${done / PROGRESS_FIELDS.length})`;
  };

  $$('.field__input:not([data-select-button])', form).forEach((el) => {
    const field = el.closest('[data-field]');
    const sync = () => field.classList.toggle('is-filled', el.value.trim() !== '');
    el.addEventListener('input', sync);
    sync();
  });

  if (textarea) {
    textarea.addEventListener('input', () => { grow(); counter.textContent = textarea.value.length; });
    grow();
  }
  form.addEventListener('input', updateProgress);
  form.addEventListener('change', updateProgress);

  /* ------------------------------------------------------------------------
     Arriving from Pricing: contact.html?plan=starter|signature|custom
     ------------------------------------------------------------------------ */
  const PLANS = {
    starter: { label: 'Starter', note: 'Starter package, from €2,500', budget: '€2,500 — €5,000' },
    signature: { label: 'Signature', note: 'Signature package, from €5,000', budget: '€5,000 — €10,000' },
    custom: { label: 'Custom', note: 'Custom project, scope-led' }
  };
  const params = new URLSearchParams(location.search);
  const service = params.get('service');
  if (service && selects.service) selects.service.setValue(service);

  const plan = PLANS[params.get('plan')];
  if (plan) {
    form.elements.plan.value = plan.label;
    if (plan.budget && selects.budget) selects.budget.setValue(plan.budget);
    const note = $('[data-plan-note]');
    if (note) { note.textContent = `Enquiring about: ${plan.note}`; note.hidden = false; }
  }
  updateProgress();

  /* ------------------------------------------------------------------------
     Validation — inline, field by field, no browser alerts
     ------------------------------------------------------------------------ */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const RULES = {
    name: (v) => (v.trim().length >= 2 ? '' : 'Please tell us your name.'),
    email: (v) => {
      if (!v.trim()) return 'Please enter your email address.';
      return EMAIL_RE.test(v.trim()) ? '' : 'Please enter a valid email address.';
    },
    service: (v) => (v ? '' : 'Please choose what you need.'),
    message: (v) => {
      if (!v.trim()) return 'Please tell us a little about the project.';
      return v.trim().length >= 20 ? '' : 'Please add a little more detail (at least 20 characters).';
    }
  };

  const controlFor = (name) => (selects[name] ? selects[name].button : form.elements[name]);

  function setError(name, message) {
    const control = controlFor(name);
    const field = control.closest('[data-field]');
    const error = $(`#f-${name}-error`, form);
    field.classList.toggle('is-invalid', Boolean(message));
    control.setAttribute('aria-invalid', message ? 'true' : 'false');
    error.textContent = message;
  }

  function validate(name) {
    const message = RULES[name](form.elements[name].value || '');
    setError(name, message);
    return !message;
  }

  let attempted = false;
  // After the first submit attempt, re-check fields as people fix them
  const recheck = (e) => {
    const name = e.target.name;
    if (attempted && RULES[name]) validate(name);
  };
  form.addEventListener('input', recheck);
  form.addEventListener('change', recheck);
  ['name', 'email'].forEach((n) => form.elements[n].addEventListener('blur', () => {
    if (form.elements[n].value.trim()) validate(n);
  }));

  /* ------------------------------------------------------------------------
     Submission
     ------------------------------------------------------------------------ */
  const button = $('[data-submit]', form);
  const submitLabel = $('[data-submit-label]', form);
  const submitHint = $('[data-submit-hint]', form);
  const states = {
    sent: $('[data-state="sent"]'),
    offline: $('[data-state="offline"]'),
    error: $('[data-state="error"]')
  };
  let submitting = false;

  function collect() {
    const data = {};
    ['name', 'email', 'company', 'service', 'budget', 'message', 'source', 'plan'].forEach((n) => {
      data[n] = (form.elements[n].value || '').trim();
    });
    return data;
  }

  function composeEmail(data) {
    const lines = ['name', 'email', 'company', 'service', 'budget', 'source', 'plan']
      .filter((n) => data[n])
      .map((n) => `${FIELD_LABELS[n]}: ${data[n]}`);
    const body = `${lines.join('\n')}\n\n${data.message}`;
    const subject = `Project enquiry — ${data.company || data.name}`;
    return `mailto:${CONTACT_CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function setBusy(busy) {
    submitting = busy;
    form.classList.toggle('is-sending', busy);
    form.setAttribute('aria-busy', String(busy));
    button.disabled = busy;
    submitLabel.textContent = busy ? 'Sending…' : 'Send enquiry';
    submitHint.textContent = busy ? 'One moment' : 'Takes about three minutes';
  }

  function show(state) {
    Object.entries(states).forEach(([k, el]) => { el.hidden = k !== state; });
    form.hidden = Boolean(state);
    if (state) {
      const el = states[state];
      requestAnimationFrame(() => {
        el.focus({ preventScroll: true });
        el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
      });
    }
  }

  $$('[data-edit]').forEach((b) => b.addEventListener('click', () => {
    show(null);
    button.focus();
  }));

  async function send(data) {
    const payload = { ...data, ...CONTACT_CONFIG.extraFields, _subject: `Project enquiry — ${data.company || data.name}` };
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CONTACT_CONFIG.timeoutMs);
    try {
      const init = { method: 'POST', headers: { Accept: 'application/json' }, signal: controller.signal };
      if (CONTACT_CONFIG.format === 'form') {
        const fd = new FormData();
        Object.entries(payload).forEach(([k, v]) => fd.append(k, v));
        init.body = fd;
      } else {
        init.headers['Content-Type'] = 'application/json';
        init.body = JSON.stringify(payload);
      }
      const res = await fetch(CONTACT_CONFIG.endpoint, init);
      return res.ok;
    } catch (err) {
      return false;
    } finally {
      clearTimeout(timer);
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitting) return; // no duplicate submissions

    attempted = true;
    const valid = Object.keys(RULES).map(validate);
    if (valid.includes(false)) {
      const first = Object.keys(RULES).find((n, i) => !valid[i]);
      controlFor(first).focus();
      return;
    }

    // Spam trap filled: stop quietly, and never claim success
    if (form.elements.website.value) return;

    const data = collect();

    if (!CONTACT_CONFIG.endpoint) {
      $('[data-mailto]', states.offline).href = composeEmail(data);
      show('offline');
      return;
    }

    setBusy(true);
    const ok = await send(data);
    setBusy(false);
    if (ok) {
      form.reset();
      Object.values(selects).forEach((s) => s.reset());
      $$('[data-field]', form).forEach((f) => f.classList.remove('is-filled'));
      updateProgress();
      show('sent');
    } else {
      show('error');
    }
  });
})();
