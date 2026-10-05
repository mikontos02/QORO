/* ==========================================================================
   QORO — Pricing page
   "Which option fits?" helper: points to a starting option, never a quote.
   Tiers, details toggles, reveals and transitions come from ../script.js.
   ========================================================================== */
(() => {
  'use strict';

  const result = document.querySelector('[data-fit-result]');
  const options = Array.from(document.querySelectorAll('[data-fit-option]'));
  if (!result || !options.length) return;

  const TIERS = {
    starter: {
      name: 'Starter', price: 'from €2,500',
      why: 'A focused website with a strong design and a solid build usually starts here.'
    },
    signature: {
      name: 'Signature', price: 'from €5,000',
      why: 'Brand and website together need strategy, UX/UI and motion working as one, which is where Signature begins.'
    },
    custom: {
      name: 'Custom', price: 'scoped together',
      why: 'Products, platforms and experimental work are scoped from scratch around what they need to do.'
    }
  };

  const arrow = '<svg viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';

  const render = (key) => {
    const t = TIERS[key];
    result.innerHTML = `
      <p class="pr-fit__eyebrow">A good starting point</p>
      <p class="pr-fit__tier">${t.name} <span>${t.price}</span></p>
      <p class="pr-fit__why">${t.why}</p>
      <div class="pr-fit__links">
        <a class="pill magnetic" href="contact.html?plan=${key}" data-transition="${t.name}">
          <span class="pill__label">Start a ${t.name} brief</span>
          <span class="pill__icon" aria-hidden="true">${arrow}${arrow}</span>
        </a>
        <a class="link pr-fit__see" href="#${key}">See what ${t.name} includes</a>
      </div>`;
    result.classList.remove('is-shown');
    // restart the entrance so each change is noticeable
    requestAnimationFrame(() => requestAnimationFrame(() => result.classList.add('is-shown')));
  };

  options.forEach((input) => {
    input.addEventListener('change', () => { if (input.checked) render(input.dataset.tier); });
  });
})();
