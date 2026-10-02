/* ==========================================================================
   QORO — project data
   All case-study content lives here. To add a project:
     1. Add an entry below (order = Work order + "Next project" order).
     2. Add its images to assets/projects/<slug>/
     3. Copy any work/<slug>.html shell and change data-case="<slug>".
   Paths are relative to the site root.

   Fonts: list the fonts the project actually uses. `family` must match an
   @font-face that is loaded on the page (see style.css). If unknown, set
   `placeholder: true` and the specimen will be labelled as a placeholder.

   Results: never invent metrics. Use `metrics` only for real, verified
   numbers; otherwise use qualitative `outcomes`.
   ========================================================================== */
window.QORO_PROJECTS = [
  {
    slug: 'halden',
    number: '01',
    name: 'Halden',
    category: 'Brand & Website',
    year: '2026',
    tone: '#1a1815',
    description: 'A gallery-quiet website for an Oslo architecture practice that draws buildings from the ground they stand on.',
    client: 'Halden Arkitekter',
    industry: 'Architecture',
    location: 'Oslo, Norway',
    services: ['Strategy', 'Art Direction', 'UX/UI Design', 'Web Design', 'Development'],
    intro: 'Twenty-eight years of buildings, <em>finally given room to breathe.</em>',
    story: {
      challenge: {
        lead: 'A celebrated practice hidden behind a cluttered, dated portfolio.',
        text: 'Halden’s work spoke of restraint and material honesty. Their website spoke of neither: dense grids, small images and no sense of scale.'
      },
      approach: {
        lead: 'Design the site the way Halden designs a building — from the ground up.',
        text: 'We built a strict facade-like grid, a single light weight of type and a warm stone palette taken directly from their materials.'
      },
      solution: {
        lead: 'A calm, image-led site where every project gets a full room.',
        text: 'A project index that reads like a drawing register, long-form project pages and a journal for the practice’s thinking.'
      },
      result: {
        lead: 'The practice now has a presence as considered as its architecture.',
        text: 'The site gives the work scale, silence and context, and gives the team one place to tell its story.'
      }
    },
    contribution: [
      { name: 'Strategy', note: 'what the practice stands for' },
      { name: 'Art Direction', note: 'stone, light and silence' },
      { name: 'UX/UI Design', note: 'an index like a drawing register' },
      { name: 'Web Design', note: 'a facade-like grid' },
      { name: 'Development', note: 'fast, accessible, CMS-driven' }
    ],
    palette: [
      { hex: '#EFEBE4', name: 'Limestone', role: 'Background' },
      { hex: '#1B1A18', name: 'Basalt', role: 'Type' },
      { hex: '#B38457', name: 'Oak', role: 'Accent' },
      { hex: '#DDD6CA', name: 'Mortar', role: 'Surface' }
    ],
    fonts: {
      display: { family: 'Almarai', weight: 300, style: 'normal', tracking: '-0.06em', label: 'Almarai Light' },
      body: { family: 'Almarai', weight: 400, style: 'normal', tracking: '0', label: 'Almarai Regular' }
    },
    language: 'One light weight of type, a grid borrowed from facades, and warm oak used only where light falls.',
    outcomes: [
      { title: 'Stronger digital presence', text: 'Projects shown at the scale they deserve.' },
      { title: 'Clearer brand positioning', text: 'Restraint made visible in every screen.' },
      { title: 'Easier to maintain', text: 'A CMS the team updates without developers.' }
    ],
    statement: 'A website built the way Halden builds — <em>from the ground it stands on.</em>',
    images: {
      hero: 'assets/images/work-halden',
      gallery: 'assets/projects/halden/gallery/brand',
      screens: ['assets/projects/halden/screens/home', 'assets/projects/halden/screens/index', 'assets/projects/halden/screens/detail'],
      mobile: ['assets/projects/halden/mobile/home', 'assets/projects/halden/mobile/list', 'assets/projects/halden/mobile/detail'],
      ui: 'assets/projects/halden/details/ui',
      study: 'assets/projects/halden/details/study'
    },
    alt: {
      hero: 'Halden website on desktop and mobile: an off-white page with a facade grid and a large Halden wordmark.',
      gallery: 'Halden brand composition: a large light wordmark beside a stone facade grid with two warm oak windows.',
      screens: ['Halden homepage with the headline Built from the ground.', 'Halden project index showing four projects as facade studies.', 'Fjordhus project page with specifications.'],
      mobile: ['Halden homepage on mobile.', 'Halden project list on mobile.', 'Fjordhus project page on mobile.'],
      ui: 'Halden interface components: buttons, navigation, fields and a project card in hover state.',
      study: 'Close-up facade study of the Halden window grid.'
    }
  },

  {
    slug: 'solace',
    number: '02',
    name: 'Solace',
    category: 'Digital Experience',
    year: '2025',
    tone: '#1c120d',
    description: 'A slow booking journey for a cliffside retreat on Folegandros that sells silence: light-led imagery, soft motion and nothing loud.',
    client: 'Solace Folegandros',
    industry: 'Hospitality',
    location: 'Folegandros, Greece',
    services: ['Strategy', 'Creative Direction', 'UX/UI Design', 'Web Design', 'Development', 'Motion'],
    intro: 'Twelve rooms, one view, and a website <em>that refuses to hurry.</em>',
    story: {
      challenge: {
        lead: 'A retreat about stillness, sold through a noisy booking engine.',
        text: 'Guests arrived expecting quiet but booked through pop-ups, countdowns and stock photography that said the opposite.'
      },
      approach: {
        lead: 'Slow everything down, then let light carry the story.',
        text: 'We paced the journey like a day on the island — dawn to dusk — with an italic serif voice and a palette taken from the cliff at sunset.'
      },
      solution: {
        lead: 'A calm, image-first experience with booking woven in, not bolted on.',
        text: 'Room pages that read like postcards, soft scroll-led motion and a three-step reservation flow without a single pop-up.'
      },
      result: {
        lead: 'The experience now begins long before guests arrive.',
        text: 'The site finally feels like the place: unhurried, warm and confident enough to stay quiet.'
      }
    },
    contribution: [
      { name: 'Strategy', note: 'what stillness looks like online' },
      { name: 'Creative Direction', note: 'dawn to dusk, in one scroll' },
      { name: 'UX/UI Design', note: 'a booking flow without pressure' },
      { name: 'Web Design', note: 'rooms as postcards' },
      { name: 'Development', note: 'booking engine integration' },
      { name: 'Motion', note: 'soft, light-led transitions' }
    ],
    palette: [
      { hex: '#F4E9DC', name: 'Lime wash', role: 'Background' },
      { hex: '#3B2015', name: 'Cliff', role: 'Type' },
      { hex: '#C4643A', name: 'Terracotta', role: 'Accent' },
      { hex: '#F3A15F', name: 'Dusk', role: 'Highlight' }
    ],
    fonts: {
      display: { family: 'Instrument Serif', weight: 400, style: 'italic', tracking: '-0.01em', label: 'Instrument Serif Italic' },
      body: { family: 'Almarai', weight: 400, style: 'normal', tracking: '0', label: 'Almarai Regular' }
    },
    language: 'A single italic voice, horizons instead of boxes, and colour that changes with the time of day.',
    outcomes: [
      { title: 'More immersive experience', text: 'Guests feel the place before they book it.' },
      { title: 'A calmer booking journey', text: 'Three steps, no pressure tactics.' },
      { title: 'One consistent voice', text: 'From first visit to arrival email.' }
    ],
    statement: 'A booking site that feels like the first quiet hour <em>of a long holiday.</em>',
    images: {
      hero: 'assets/images/work-solace',
      gallery: 'assets/projects/solace/gallery/brand',
      screens: ['assets/projects/solace/screens/home', 'assets/projects/solace/screens/index', 'assets/projects/solace/screens/detail'],
      mobile: ['assets/projects/solace/mobile/home', 'assets/projects/solace/mobile/list', 'assets/projects/solace/mobile/detail'],
      ui: 'assets/projects/solace/details/ui',
      study: 'assets/projects/solace/details/study'
    },
    alt: {
      hero: 'Solace website in terracotta tones, a setting sun over layered hills and the italic line Stay still.',
      gallery: 'Solace brand composition: an italic wordmark beside a dusk landscape.',
      screens: ['Solace homepage with a sunset and the headline Stay still.', 'Solace rooms index with four sunset studies.', 'Cave Suite room page with booking details.'],
      mobile: ['Solace homepage on mobile.', 'Solace rooms list on mobile.', 'Cave Suite room page on mobile with a reservation button.'],
      ui: 'Solace interface components: buttons, navigation, fields and a room card in hover state.',
      study: 'Light study of dusk over the Solace terrace.'
    }
  },

  {
    slug: 'ferro',
    number: '03',
    name: 'Ferro',
    category: 'E-commerce Platform',
    year: '2025',
    tone: '#131416',
    description: 'A headless storefront for a Milanese steel furniture maker, where every product page reads like a spread from a printed catalogue.',
    client: 'Ferro Milano',
    industry: 'Furniture & Retail',
    location: 'Milan, Italy',
    services: ['Strategy', 'UX/UI Design', 'Web Design', 'Development'],
    intro: 'Hand-bent steel deserved better than <em>a template checkout.</em>',
    story: {
      challenge: {
        lead: 'Objects made to last decades, sold through a shop built in a weekend.',
        text: 'Ferro’s pieces are bent and brushed by hand, but online they sat in a generic theme next to discount banners.'
      },
      approach: {
        lead: 'Treat the shop as a catalogue first and a checkout second.',
        text: 'Heavy grotesk headlines, cool steel neutrals and generous product photography framed like museum objects.'
      },
      solution: {
        lead: 'A fast headless storefront with editorial product pages.',
        text: 'Each object gets a spread: material, dimensions, lead time and the story of how it is made, with checkout one tap away.'
      },
      result: {
        lead: 'The shop now feels as solid as the furniture.',
        text: 'Ferro has a storefront it owns completely, ready for new collections without a redesign.'
      }
    },
    contribution: [
      { name: 'Strategy', note: 'catalogue first, checkout second' },
      { name: 'UX/UI Design', note: 'product pages as spreads' },
      { name: 'Web Design', note: 'steel, weight and white space' },
      { name: 'Development', note: 'headless commerce, built for speed' }
    ],
    palette: [
      { hex: '#E6E6E3', name: 'Zinc', role: 'Background' },
      { hex: '#141414', name: 'Forged', role: 'Type' },
      { hex: '#9A9CA0', name: 'Brushed', role: 'Accent' },
      { hex: '#D4D4D0', name: 'Primer', role: 'Surface' }
    ],
    fonts: {
      display: { family: 'Almarai', weight: 800, style: 'normal', tracking: '-0.06em', label: 'Almarai ExtraBold' },
      body: { family: 'Almarai', weight: 400, style: 'normal', tracking: '0', label: 'Almarai Regular' }
    },
    language: 'Heavy type set tight like stamped metal, a strict product grid and steel gradients used only on the objects themselves.',
    outcomes: [
      { title: 'A premium shopping experience', text: 'Products presented like objects, not stock.' },
      { title: 'Full platform ownership', text: 'A headless stack Ferro controls.' },
      { title: 'Ready to grow', text: 'New collections without a redesign.' }
    ],
    statement: 'A storefront with the weight, <em>and the patience, of steel.</em>',
    images: {
      hero: 'assets/images/work-ferro',
      gallery: 'assets/projects/ferro/gallery/brand',
      screens: ['assets/projects/ferro/screens/home', 'assets/projects/ferro/screens/index', 'assets/projects/ferro/screens/detail'],
      mobile: ['assets/projects/ferro/mobile/home', 'assets/projects/ferro/mobile/list', 'assets/projects/ferro/mobile/detail'],
      ui: 'assets/projects/ferro/details/ui',
      study: 'assets/projects/ferro/details/study'
    },
    alt: {
      hero: 'Ferro online store on a graphite backdrop, showing a tubular steel chair and a grid of furniture products.',
      gallery: 'Ferro brand composition: a heavy FERRO wordmark beside a steel mirror outline.',
      screens: ['Ferro homepage featuring the Tube No.4 chair.', 'Ferro collection page with chair, lamp, table and mirror.', 'Tube No.4 product page with specifications.'],
      mobile: ['Ferro homepage on mobile.', 'Ferro collection list on mobile.', 'Halo lamp product page on mobile.'],
      ui: 'Ferro interface components: buttons, navigation, fields and a product card in hover state.',
      study: 'Product study of the Plate table in steel.'
    }
  },

  {
    slug: 'mono',
    number: '04',
    name: 'Mono',
    category: 'Brand Identity',
    year: '2024',
    tone: '#171611',
    description: 'Identity, specimen system and a live type tester for an independent type foundry that prizes restraint.',
    client: 'Mono Type Foundry',
    industry: 'Typography',
    location: 'London, United Kingdom',
    services: ['Strategy', 'Creative Direction', 'Brand Identity', 'Web Design', 'Development'],
    intro: 'A foundry whose typefaces whisper needed <em>an identity that could, too.</em>',
    story: {
      challenge: {
        lead: 'A new foundry with beautiful type and no voice of its own.',
        text: 'Mono’s typefaces were quiet and precise, but the launch plan relied on loud colour and trend-led visuals that hid the letters.'
      },
      approach: {
        lead: 'Let the letters be the brand.',
        text: 'Two colours, one serif and the glyphs themselves at enormous scale. Nothing else competes with the type.'
      },
      solution: {
        lead: 'An identity system, printed specimens and a live online tester.',
        text: 'Business cards, specimen books and a website where every typeface can be tried, compared and licensed in one place.'
      },
      result: {
        lead: 'The foundry launched with a voice as precise as its type.',
        text: 'Every touchpoint now shows the work instead of decorating around it.'
      }
    },
    contribution: [
      { name: 'Strategy', note: 'let the letters lead' },
      { name: 'Creative Direction', note: 'two colours, one voice' },
      { name: 'Brand Identity', note: 'cards, specimens, signage' },
      { name: 'Web Design', note: 'a specimen you can scroll' },
      { name: 'Development', note: 'a live type tester' }
    ],
    palette: [
      { hex: '#E1E0CC', name: 'Proof', role: 'Background' },
      { hex: '#0C0C0B', name: 'Ink', role: 'Type' },
      { hex: '#F6F5EA', name: 'Paper', role: 'Surface' },
      { hex: '#6D6C60', name: 'Graphite', role: 'Secondary' }
    ],
    fonts: {
      display: { family: 'Instrument Serif', weight: 400, style: 'normal', tracking: '-0.03em', label: 'Instrument Serif Regular' },
      body: { family: 'Almarai', weight: 400, style: 'normal', tracking: '0', label: 'Almarai Regular' }
    },
    language: 'Glyphs as images, two colours only, and specimen layouts borrowed from metal-type proofs.',
    outcomes: [
      { title: 'Clearer brand positioning', text: 'Restraint as a point of view.' },
      { title: 'A consistent system', text: 'One identity from print to screen.' },
      { title: 'Type you can try', text: 'Live testing before licensing.' }
    ],
    statement: 'An identity that steps aside <em>so the letters can speak.</em>',
    images: {
      hero: 'assets/images/work-mono',
      gallery: 'assets/projects/mono/gallery/brand',
      screens: ['assets/projects/mono/screens/home', 'assets/projects/mono/screens/index', 'assets/projects/mono/screens/detail'],
      mobile: ['assets/projects/mono/mobile/home', 'assets/projects/mono/mobile/list', 'assets/projects/mono/mobile/detail'],
      ui: 'assets/projects/mono/details/ui',
      study: 'assets/projects/mono/details/study'
    },
    alt: {
      hero: 'Mono type foundry identity: a giant serif M on cream beside a black business card and a type specimen card.',
      gallery: 'Mono brand composition: a serif wordmark beside a large ampersand on black.',
      screens: ['Mono homepage with the headline Quiet form.', 'Mono typefaces index with four large glyphs.', 'Grotesk typeface page with a type tester.'],
      mobile: ['Mono homepage on mobile.', 'Mono typefaces list on mobile.', 'Grotesk typeface page on mobile.'],
      ui: 'Mono interface components: buttons, navigation, fields and a typeface card in hover state.',
      study: 'Glyph study of a serif capital M.'
    }
  },

  {
    slug: 'shift',
    number: '05',
    name: 'Shift',
    category: 'Interactive Experience',
    year: '2024',
    tone: '#130d09',
    description: 'A real-time configurator and launch experience that lets drivers feel an electric car long before they sit in it.',
    client: 'Shift Mobility',
    industry: 'Automotive',
    location: 'Munich, Germany',
    services: ['Creative Direction', 'UX/UI Design', 'Web Design', 'Development', 'Motion'],
    intro: 'A car you can’t test drive yet, <em>made to be felt anyway.</em>',
    story: {
      challenge: {
        lead: 'Launching a car months before anyone could sit in it.',
        text: 'Shift needed early reservations, but a spec sheet and a few renders could not convey how the car feels.'
      },
      approach: {
        lead: 'Sell the sensation, not the specification.',
        text: 'Dark, cinematic and lit by a single ember-orange light — the charge ring — that follows the visitor through the story.'
      },
      solution: {
        lead: 'A WebGL launch story and a configurator that renders every change live.',
        text: 'Scroll-driven chapters for range, charging and performance, ending in a configurator that leads straight to reservation.'
      },
      result: {
        lead: 'The car became tangible long before the first delivery.',
        text: 'Visitors explore, configure and reserve in one continuous experience.'
      }
    },
    contribution: [
      { name: 'Creative Direction', note: 'one light, one story' },
      { name: 'UX/UI Design', note: 'configure to reserve, uninterrupted' },
      { name: 'Web Design', note: 'cinematic, dark, precise' },
      { name: 'Development', note: 'real-time WebGL rendering' },
      { name: 'Motion', note: 'scroll-driven chapters' }
    ],
    palette: [
      { hex: '#060606', name: 'Night', role: 'Background' },
      { hex: '#F2E8DC', name: 'Bone', role: 'Type' },
      { hex: '#FF7A2E', name: 'Ember', role: 'Accent' },
      { hex: '#FFD2A1', name: 'Glow', role: 'Highlight' }
    ],
    fonts: {
      display: { family: 'Almarai', weight: 800, style: 'normal', tracking: '-0.06em', label: 'Almarai ExtraBold' },
      body: { family: 'Almarai', weight: 400, style: 'normal', tracking: '0', label: 'Almarai Regular' }
    },
    language: 'Near-black space, one ember light source and heavy type that cuts through the dark like headlights.',
    outcomes: [
      { title: 'More immersive experience', text: 'The car felt before it is driven.' },
      { title: 'A direct path to reservation', text: 'Configure and reserve in one flow.' },
      { title: 'A launch platform to grow', text: 'Built to welcome future models.' }
    ],
    statement: 'A launch that let people feel the drive <em>before the doors ever opened.</em>',
    images: {
      hero: 'assets/images/work-shift',
      gallery: 'assets/projects/shift/gallery/brand',
      screens: ['assets/projects/shift/screens/home', 'assets/projects/shift/screens/index', 'assets/projects/shift/screens/detail'],
      mobile: ['assets/projects/shift/mobile/home', 'assets/projects/shift/mobile/list', 'assets/projects/shift/mobile/detail'],
      ui: 'assets/projects/shift/details/ui',
      study: 'assets/projects/shift/details/study'
    },
    alt: {
      hero: 'Shift launch experience: the word SHIFT glowing above an ember-orange light ring with range and charge readouts.',
      gallery: 'Shift brand composition: a heavy SHIFT wordmark beside the ember charge ring.',
      screens: ['Shift homepage with the headline Feel it first.', 'Shift models index with four light rings.', 'Shift One configurator page with specifications.'],
      mobile: ['Shift homepage on mobile.', 'Shift models list on mobile.', 'Shift One configurator on mobile.'],
      ui: 'Shift interface components: buttons, navigation, fields and a model card in hover state.',
      study: 'Light study of the ember charge ring.'
    }
  }
];
