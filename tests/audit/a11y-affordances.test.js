'use strict';

/**
 * Accessibility affordances that the contrast audit cannot see: motion
 * preferences, print output, keyboard focus, skip links, and the computed
 * `color-scheme` that tells the browser to render form controls and scrollbars
 * for the right mode.
 *
 * Each check is structural and runs in node:test. Anything that needs a real
 * layout engine lives in tests/e2e/ and tests/integration/ instead.
 */

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, htmlFiles, ruleBodies } = require('../helpers');

const STYLESHEETS = ['main.css', 'portfolio.css', 'cv-minimal.css', 'portfolio-hub.css'];

/** Every selector a stylesheet animates, ignoring the reduced-motion guard. */
function animatedSelectors(css) {
  const rules = ruleBodies(css);
  const animated = new Set();
  for (const rule of rules) {
    if (rule.atRules.some((a) => a.includes('prefers-reduced-motion'))) continue;
    if (!/transition(-duration)?\s*:|animation(-duration)?\s*:/.test(rule.body)) continue;
    for (const sel of rule.selectors) {
      if (sel === '*' || sel === '*::before' || sel === '*::after') continue;
      animated.add(sel);
    }
  }
  return animated;
}

function readStylesheet(name) {
  return fs.readFileSync(path.join(ROOT, 'css', name), 'utf8');
}

/** Does this stylesheet neutralize motion for every element, not just some? */
function hasUniversalMotionReset(css) {
  return ruleBodies(css).some(
    (rule) =>
      rule.atRules.some((a) => a.includes('prefers-reduced-motion')) &&
      rule.selectors.includes('*') &&
      /transition-duration\s*:\s*0\.0\d*ms\s*!important/.test(rule.body)
  );
}

test('every stylesheet that animates anything resets motion for reduced-motion readers', () => {
  // The defect this catches: main.css declared ~14 transitions but its
  // reduced-motion block suppressed only .reveal, so buttons, nav links, cards
  // and the skip link still animated. Suppressing one selector is not the same
  // as honoring the preference.
  const offenders = [];

  for (const name of STYLESHEETS) {
    const css = readStylesheet(name);
    const animated = animatedSelectors(css);
    if (animated.size === 0) continue;
    if (!hasUniversalMotionReset(css)) {
      offenders.push(
        `${name}: animates ${animated.size} selector(s) but has no universal reduced-motion reset`
      );
    }
  }

  assert.deepStrictEqual(offenders, [], 'Stylesheets animating without a reduced-motion reset');
});

test('reduced-motion sets scroll-behavior to auto everywhere it is animated', () => {
  // smooth scrolling is a vestibular trigger; a reduced-motion reader must not
  // get it from any stylesheet.
  const offenders = [];
  for (const name of STYLESHEETS) {
    const css = readStylesheet(name);
    if (!/scroll-behavior\s*:\s*smooth/.test(css)) continue;
    const reset = ruleBodies(css).some(
      (rule) =>
        rule.atRules.some((a) => a.includes('prefers-reduced-motion')) &&
        /scroll-behavior\s*:\s*auto\s*!important/.test(rule.body)
    );
    if (!reset) offenders.push(`${name}: smooth scrolling with no reduced-motion override`);
  }
  assert.deepStrictEqual(offenders, [], 'Smooth scrolling without a reduced-motion override');
});

test('reduced-motion still lands scroll-reveal content in its visible state', () => {
  // Suppressing the transition is not enough: at a 0.01ms duration the element
  // stays at its start value if nothing observes it. The start value is
  // opacity 0, which would hide the content entirely.
  for (const name of STYLESHEETS) {
    const css = readStylesheet(name);
    if (!/\.reveal\b/.test(css)) continue;

    const base = ruleBodies(css).find(
      (rule) => rule.selectors.includes('.reveal') && rule.atRules.length === 0
    );
    if (!base) continue;
    const startsHidden = /opacity\s*:\s*0\b/.test(base.body);
    assert.ok(startsHidden, `${name}: .reveal is expected to start hidden; update this test`);

    const guarded = ruleBodies(css).find(
      (rule) =>
        rule.selectors.includes('.reveal') &&
        rule.atRules.some((a) => a.includes('prefers-reduced-motion'))
    );
    assert.ok(guarded, `${name}: .reveal starts at opacity 0 with no reduced-motion override`);
    assert.match(
      guarded.body,
      /opacity\s*:\s*1/,
      `${name}: reduced-motion .reveal must be forced visible, not left at opacity 0`
    );
  }
});

test('every stylesheet provides a visible focus indicator', () => {
  // Removing the UA outline without replacing it makes a keyboard user unable
  // to see where they are.
  const offenders = [];
  for (const name of STYLESHEETS) {
    const css = readStylesheet(name);
    const hasFocusVisible = /:focus-visible/.test(css);
    const killsOutline = /outline\s*:\s*(none|0)\b/.test(css);

    if (killsOutline && !hasFocusVisible) {
      offenders.push(`${name}: removes the focus outline with no :focus-visible replacement`);
    }
  }
  assert.deepStrictEqual(offenders, [], 'Focus outline removed without a replacement');
});

test('every page that offers a skip link is styled to reveal it on focus', () => {
  // A skip link parked off-screen with no :focus rule is invisible and useless.
  const offenders = [];
  const styled = new Set();

  for (const name of STYLESHEETS) {
    const css = readStylesheet(name);
    for (const rule of ruleBodies(css)) {
      if (rule.selectors.includes('.skip-link:focus')) styled.add(name);
    }
  }
  assert.ok(styled.size > 0, 'no stylesheet reveals .skip-link on focus');

  for (const file of htmlFiles()) {
    const rel = path.relative(ROOT, file);
    const html = fs.readFileSync(file, 'utf8');
    if (!/class="[^"]*\bskip-link\b/.test(html)) continue;

    // Attribute order varies between pages, so locate the anchor and read both
    // attributes off it rather than assuming class-then-href.
    const anchor = /<a\b[^>]*class="[^"]*\bskip-link\b[^"]*"[^>]*>/.exec(html);
    assert.ok(anchor, `${rel}: skip link anchor could not be parsed`);
    const target = /href="#([^"]+)"/.exec(anchor[0]);
    assert.ok(target, `${rel}: skip link has no #target`);
    assert.ok(
      html.includes(`id="${target[1]}"`),
      `${rel}: skip link points at #${target[1]}, which does not exist`
    );

    const sheets = [...html.matchAll(/<link[^>]+href="([^"]+\.css)"/g)].map((m) =>
      m[1].split('/').pop()
    );
    if (!sheets.some((s) => styled.has(s))) {
      offenders.push(`${rel}: no loaded stylesheet reveals its skip link`);
    }
  }

  assert.deepStrictEqual(offenders, [], 'Skip links that never become visible');
});

test('every stylesheet declares color-scheme for both themes', () => {
  // Without it the browser paints scrollbars, form controls, and the canvas in
  // the light default while the page is dark.
  const offenders = [];
  for (const name of STYLESHEETS) {
    const css = readStylesheet(name);
    const schemes = [...css.matchAll(/color-scheme\s*:\s*(light|dark)\s*;/g)].map((m) => m[1]);
    if (schemes.length === 0) continue;
    if (!schemes.includes('light') || !schemes.includes('dark')) {
      offenders.push(`${name}: declares color-scheme [${schemes.join(', ')}] but not both modes`);
    }
  }
  assert.deepStrictEqual(offenders, [], 'color-scheme not declared for both modes');
});

test('print stylesheets hide interactive controls', () => {
  // A printed CV should not carry "Dark" / "Print / PDF" buttons.
  const offenders = [];
  for (const name of STYLESHEETS) {
    const css = readStylesheet(name);
    const printRules = ruleBodies(css).filter((r) =>
      r.atRules.some((a) => a.includes('@media print'))
    );
    if (printRules.length === 0) continue;

    // The control surface differs by stylesheet: portfolio/cv render a
    // .controls bar, main.css has its own .theme-toggle/.nav-burger chrome.
    // What matters is that whatever this stylesheet calls a control is hidden.
    const CONTROL_SELECTORS = [
      '.controls',
      '.control-btn',
      '.theme-toggle',
      '.nav-burger',
    ];
    const definedHere = new Set(
      ruleBodies(css)
        .flatMap((r) => r.selectors)
        .filter((sel) => CONTROL_SELECTORS.includes(sel))
    );
    assert.ok(definedHere.size > 0, `${name}: expected this stylesheet to define a control`);

    const hidden = new Set();
    for (const rule of printRules) {
      if (!/display\s*:\s*none/.test(rule.body)) continue;
      for (const sel of rule.selectors) hidden.add(sel);
    }

    const missed = [...definedHere].filter((sel) => !hidden.has(sel));
    if (missed.length > 0) {
      offenders.push(`${name}: @media print does not hide ${missed.join(', ')}`);
    }
  }
  assert.deepStrictEqual(offenders, [], 'Print stylesheets that print their controls');
});

test('the print blocks do not drop the page background', () => {
  // A print stylesheet that leaves the dark background in place wastes toner
  // and can render white-on-white text.
  for (const name of STYLESHEETS) {
    const css = readStylesheet(name);
    for (const rule of ruleBodies(css)) {
      if (!rule.atRules.some((a) => a.includes('@media print'))) continue;
      if (rule.selectors.includes('body') || rule.selectors.includes('html')) {
        assert.match(
          rule.body,
          /background[^:]*:\s*(#fff|white|transparent)/i,
          `${name}: print rule for ${rule.selectors.join()} does not use a light background`
        );
      }
    }
  }
});

/* ---------- no-JS fallback ---------- */

test('every JS-rendered CV page carries a noscript fallback', () => {
  const offenders = [];
  const pages = htmlFiles()
    .map((abs) => path.relative(ROOT, abs))
    .filter((rel) => rel.startsWith('portfolio/cv/'));
  assert.ok(pages.length > 0, 'expected to find CV pages');

  for (const rel of pages) {
    const html = fs.readFileSync(path.join(ROOT, rel), 'utf8');

    // The CV body is built by cv-render.js into #cv-root. A no-JS reader would
    // otherwise get an empty page, and the skip link would target nothing.
    if (!/id="cv-root"/.test(html)) {
      offenders.push(`${rel}: no #cv-root container`);
      continue;
    }
    if (!/<noscript[\s>]/i.test(html)) {
      offenders.push(`${rel}: #cv-root has no <noscript> fallback`);
      continue;
    }

    // The fallback must be reachable: an email link and a way back to the site.
    if (!/mailto:[^\s"'<>]+/.test(html)) {
      offenders.push(`${rel}: noscript fallback offers no email contact`);
    }
    const depth = rel.startsWith('portfolio/cv/engagement/') ? '../../../' : '../../';
    if (!html.includes(`href="${depth}index.html"`)) {
      offenders.push(`${rel}: noscript fallback has no link back to the main site`);
    }
  }

  assert.deepStrictEqual(offenders, [], 'CV pages that are blank without JavaScript');
});

test('noscript fallbacks are styled by the stylesheet the page already loads', () => {
  // A fallback that renders as unstyled body text is not really a fallback, so
  // derive the class list from the markup rather than hardcoding it. A class
  // that silently loses its rules should fail here.
  // These are modifiers that are styled in compound position (`.control-btn
  // .secondary`), so they are never the subject of their own rule. Everything
  // else must be styled as a subject, otherwise the fallback degrades to bare
  // text even though a descendant rule still mentions the class.
  const COMPOUND_MODIFIERS = new Set(['secondary', 'primary', 'cta-btn']);

  const pages = htmlFiles()
    .map((abs) => path.relative(ROOT, abs))
    .filter((rel) => rel.startsWith('portfolio/cv/'));

  const byStylesheet = new Map();
  for (const rel of pages) {
    const html = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    const block = /<noscript[\s>][\s\S]*?<\/noscript>/i.exec(html);
    if (!block) continue;

    const sheets = [...html.matchAll(/href="[^"]*css\/(portfolio|cv-minimal)\.css"/g)].map(
      (m) => `${m[1]}.css`
    );
    if (sheets.length === 0) {
      assert.fail(`${rel}: loads no stylesheet that can style its noscript fallback`);
    }

    const classes = new Set();
    for (const m of block[0].matchAll(/class="([^"]+)"/g)) {
      for (const cls of m[1].split(/\s+/)) {
        if (cls) classes.add(cls);
      }
    }
    for (const sheet of sheets) {
      if (!byStylesheet.has(sheet)) byStylesheet.set(sheet, new Set());
      for (const cls of classes) byStylesheet.get(sheet).add(cls);
    }
  }

  assert.ok(byStylesheet.size > 0, 'expected to find noscript fallbacks to check');

  const missing = [];
  for (const [sheet, classes] of byStylesheet) {
    const css = readStylesheet(sheet);
    // Split each selector into compounds at every combinator, including
    // descendant (whitespace). A class counts as styled when it is the subject
    // of a rule, which is what actually applies the declaration to it; merely
    // appearing as an ancestor does not style the element.
    const subjects = ruleBodies(css)
      .flatMap((r) => r.selectors)
      .map((sel) => (sel.split(/[\s>+~]+/).pop() ?? ''))
      .join('\n');

    for (const cls of [...classes].sort()) {
      const token = new RegExp(`\\.${cls}(?![\\w-])`);
      const styledDirectly = token.test(subjects);
      const styledAsModifier = COMPOUND_MODIFIERS.has(cls) && token.test(ruleBodies(css).flatMap((r) => r.selectors).join('\n'));
      if (!styledDirectly && !styledAsModifier) {
        missing.push(`${sheet}: .${cls} is used by a noscript fallback but never styled as a rule subject`);
      }
    }
  }

  assert.deepStrictEqual(missing, [], 'noscript fallback classes with no rules');
});

/* ---------- mobile nav reachability ---------- */

test('the closed mobile nav is removed from the tab order, not just moved', () => {
  // Hiding the menu with transform alone leaves every link focusable behind the
  // page: a keyboard user tabs into an invisible menu. `visibility` is what
  // takes it out of the tab order and the accessibility tree.
  const offenders = [];
  for (const name of ['main.css', 'portfolio.css']) {
    const css = readStylesheet(name);

    // Find rules for a mobile nav list that are transformed away when closed.
    const closedRules = ruleBodies(css).filter(
      (r) =>
        r.selectors.some((sel) => /nav-links|nav-menu|nav__links/.test(sel)) &&
        /translateY\(\s*-\d/.test(r.body)
    );
    if (closedRules.length === 0) continue;

    // The open state is expressed in the selector (.nav-links.open), not the body.
    const openRules = ruleBodies(css).filter((r) =>
      r.selectors.some((sel) => /nav-links|nav-menu|nav__links/.test(sel) && /\.open\b/.test(sel))
    );

    const closedVisible = closedRules.some((r) => /visibility\s*:\s*visible/.test(r.body));
    if (closedVisible) {
      offenders.push(`${name}: the closed mobile nav sets visibility: visible`);
    }
    if (!closedRules.some((r) => /visibility\s*:\s*hidden/.test(r.body))) {
      offenders.push(`${name}: the closed mobile nav is transform-only, so its links stay focusable`);
    }
    if (!openRules.some((r) => /visibility\s*:\s*visible/.test(r.body))) {
      offenders.push(`${name}: the open mobile nav never restores visibility`);
    }
  }

  assert.deepStrictEqual(offenders, [], 'mobile nav left focusable while hidden');
});

test('the burger label describes the action, not a fixed state', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const burger = /<button[^>]*id="nav-burger"[^>]*>/.exec(html);
  assert.ok(burger, 'index.html: no #nav-burger button');

  const label = /aria-label="([^"]*)"/.exec(burger[0]);
  assert.ok(label, 'index.html: #nav-burger has no aria-label');
  assert.match(label[1], /open menu/i);
  assert.match(burger[0], /aria-expanded="false"/, 'the burger should ship collapsed');
});
