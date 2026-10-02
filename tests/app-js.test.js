'use strict';

/**
 * Executable behaviour tests for the theme consumers.
 *
 * These replace source-regex assertions, which could not distinguish a working
 * call from a comment that mentioned the same word — the previous
 * /localStorage/ check passed because app.js carried a comment saying it does
 * no localStorage access.
 *
 * Each test runs the real file in a fake DOM and asserts on observable results:
 * the data-theme attribute, what reached storage, and what the icon shows.
 */

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT } = require('./helpers');
const { createHarness } = require('./helpers/dom-harness');

const APP = 'js/app.js';
const THEME = 'js/theme.js';

/** index.html's real interactive surface, so a missing hook fails here too. */
const APP_IDS = [
  'theme-toggle',
  'theme-icon',
  'nav-burger',
  'nav-links',
  'navbar',
  'year',
];

function appHarness(overrides = {}) {
  return createHarness({
    ids: APP_IDS,
    classes: ['reveal', 'nav-link'],
    // Real markup nests the links inside the menu, and app.js closes the menu
    // via `navLinks.querySelectorAll('.nav-link')`, so they have to be children.
    children: { 'nav-links': ['nav-link', 'nav-link'] },
    // Mirrors index.html: the burger ships collapsed and already labelled, so
    // the label assertions test app.js's updates rather than missing markup.
    attrs: { 'nav-burger': { 'aria-label': 'Open menu', 'aria-expanded': 'false' } },
    htmlAttrs: { 'data-theme': 'light' },
    ...overrides,
  });
}

/* ---------- app.js: theme toggle ---------- */

test('app.js renders the moon icon on load in light mode', () => {
  const h = appHarness();
  h.run(APP);
  assert.strictEqual(h.themeIcon.className, 'fas fa-moon');
  // Loading must not write anything: the pre-paint store already decided.
  assert.strictEqual(h.storedTheme(), undefined);
});

test('app.js renders the sun icon on load in dark mode', () => {
  // Seed storage, not the attribute: ThemeStore resolves and applies the theme
  // when it loads, so it would overwrite an attribute seeded up front.
  const h = appHarness({ storage: { theme: 'dark' } });
  h.run(APP);
  assert.strictEqual(h.currentTheme(), 'dark', 'store should have applied dark pre-paint');
  assert.strictEqual(h.themeIcon.className, 'fas fa-sun');
});

test('app.js toggles to dark, persists it, and updates the icon', () => {
  const h = appHarness();
  h.run(APP);

  h.fire(h.themeToggle, 'click');

  assert.strictEqual(h.currentTheme(), 'dark', 'data-theme did not flip to dark');
  assert.strictEqual(h.storedTheme(), 'dark', 'the choice was not persisted');
  assert.strictEqual(h.themeIcon.className, 'fas fa-sun', 'icon did not follow the theme');
});

test('app.js toggles back to light and persists that too', () => {
  const h = appHarness();
  h.run(APP);

  h.fire(h.themeToggle, 'click');
  h.fire(h.themeToggle, 'click');

  assert.strictEqual(h.currentTheme(), 'light');
  assert.strictEqual(h.storedTheme(), 'light');
  assert.strictEqual(h.themeIcon.className, 'fas fa-moon');
});

test('app.js derives the next theme from the attribute, not a hardcoded target', () => {
  // From a dark start, a hardcoded "set dark" implementation would be a no-op
  // the reader could never escape.
  const h = appHarness({ storage: { theme: 'dark' } });
  h.run(APP);

  h.fire(h.themeToggle, 'click');

  assert.strictEqual(h.currentTheme(), 'light');
  assert.strictEqual(h.storedTheme(), 'light');
});

test('app.js repairs an invalid data-theme rather than persisting it', () => {
  // A hand-edited or stale value must not be echoed back into storage. Set the
  // attribute after the store has run, to isolate app.js from the store's own
  // validation.
  const h = appHarness();
  h.run(APP);
  h.html.setAttribute('data-theme', 'neon');

  assert.strictEqual(h.storedTheme(), undefined, 'an invalid theme was written to storage');

  h.fire(h.themeToggle, 'click');

  assert.ok(
    h.currentTheme() === 'light' || h.currentTheme() === 'dark',
    `toggle produced an invalid theme: ${h.currentTheme()}`
  );
  assert.ok(
    ['light', 'dark'].includes(h.storedTheme()),
    `an invalid theme reached storage: ${h.storedTheme()}`
  );
});

test('app.js does not touch localStorage directly', () => {
  // The store owns persistence. Assert on behaviour, not on the word
  // "localStorage", which the old regex matched inside a comment.
  const h = appHarness();
  h.run(APP);
  h.fire(h.themeToggle, 'click');

  // The write must have happened through the store's own key handling.
  assert.deepStrictEqual(Object.keys(h.localStorage._dump()), ['theme']);
});

test('app.js still toggles when storage throws', () => {
  const h = appHarness({ storageThrows: true });
  h.run(APP);
  h.fire(h.themeToggle, 'click');
  assert.strictEqual(h.currentTheme(), 'dark');
});

test('app.js keeps the burger accessible name in step with the nav state', () => {
  const h = appHarness();
  h.run(APP);
  const burger = h.byId.get('nav-burger');

  // The icon flips to an X, so a name that still says "Open menu" describes the
  // opposite of what the button does.
  assert.strictEqual(burger.getAttribute('aria-label'), 'Open menu');

  h.fire(burger, 'click');
  assert.strictEqual(burger.getAttribute('aria-label'), 'Close menu');

  h.fire(burger, 'click');
  assert.strictEqual(burger.getAttribute('aria-label'), 'Open menu');
});

test('app.js closes the mobile nav on Escape and returns focus to the burger', () => {
  const h = appHarness();
  h.run(APP);
  const burger = h.byId.get('nav-burger');
  const links = h.byId.get('nav-links');

  h.fire(burger, 'click');
  assert.ok(links.classList.contains('open'));

  h.document.dispatch('keydown', { key: 'Escape' });

  assert.ok(!links.classList.contains('open'), 'Escape did not close the nav');
  assert.strictEqual(burger.getAttribute('aria-expanded'), 'false');
  assert.match(burger.innerHTML, /fa-bars/, 'Escape left the close icon in place');
  assert.strictEqual(
    h.document.activeElement,
    burger,
    'focus was not returned to the control that opened the menu'
  );
});

test('app.js ignores Escape while the nav is already closed', () => {
  const h = appHarness();
  h.run(APP);
  const burger = h.byId.get('nav-burger');

  h.document.dispatch('keydown', { key: 'Escape' });

  // No focus theft: a reader who is somewhere else on the page must stay there.
  assert.strictEqual(h.document.activeElement, h.document.body);
  assert.strictEqual(burger.getAttribute('aria-expanded'), 'false');
});

test('app.js closes the mobile nav when a link is chosen, without stealing focus', () => {
  const h = appHarness();
  h.run(APP);
  const burger = h.byId.get('nav-burger');
  const links = h.byId.get('nav-links');
  const link = links.querySelectorAll('.nav-link')[0];

  h.fire(burger, 'click');
  assert.ok(links.classList.contains('open'));

  h.fire(link, 'click');

  assert.ok(!links.classList.contains('open'), 'choosing a destination left the nav open');
  assert.strictEqual(burger.getAttribute('aria-expanded'), 'false');
  // The click is navigating; focus must not be yanked back to the burger.
  assert.strictEqual(h.document.activeElement, h.document.body);
});

test('app.js closes the mobile nav on the legacy Esc key name', () => {
  // Older engines and some assistive tech still send "Esc".
  const h = appHarness();
  h.run(APP);
  const burger = h.byId.get('nav-burger');

  h.fire(burger, 'click');
  h.document.dispatch('keydown', { key: 'Esc' });

  assert.ok(!h.byId.get('nav-links').classList.contains('open'));
});

/* ---------- app.js: the rest of its surface ---------- */

test('app.js burger opens the nav and sets aria-expanded', () => {
  const h = appHarness();
  h.run(APP);
  const burger = h.byId.get('nav-burger');
  const links = h.byId.get('nav-links');

  h.fire(burger, 'click');

  assert.ok(links.classList.contains('open'), 'nav did not open');
  assert.strictEqual(burger.getAttribute('aria-expanded'), 'true');
  assert.match(burger.innerHTML, /fa-times/, 'burger did not switch to a close icon');
});

test('app.js burger toggles closed again and resets aria-expanded', () => {
  const h = appHarness();
  h.run(APP);
  const burger = h.byId.get('nav-burger');
  const links = h.byId.get('nav-links');

  h.fire(burger, 'click');
  h.fire(burger, 'click');

  assert.ok(!links.classList.contains('open'), 'nav did not close');
  assert.strictEqual(burger.getAttribute('aria-expanded'), 'false');
  assert.match(burger.innerHTML, /fa-bars/);
});

test('app.js adds the scrolled class to the navbar once past the threshold', () => {
  const h = appHarness();
  h.run(APP);
  const navbar = h.byId.get('navbar');

  assert.ok(
    !navbar.classList.contains('scrolled'),
    'navbar should not be scrolled at the top of the page'
  );

  h.window.scrollY = 50;
  h.window._listeners.scroll.forEach((fn) => fn({ type: 'scroll' }));

  assert.ok(navbar.classList.contains('scrolled'), 'navbar did not gain .scrolled on scroll');

  h.window.scrollY = 0;
  h.window._listeners.scroll.forEach((fn) => fn({ type: 'scroll' }));

  assert.ok(!navbar.classList.contains('scrolled'), 'navbar kept .scrolled back at the top');
});

test('app.js reflects scroll state already present when it loads', () => {
  // onScroll() runs once at load, so a page restored mid-scroll is correct
  // without waiting for the first scroll event.
  const h = createHarness({
    ids: APP_IDS,
    classes: ['reveal', 'nav-link'],
  });
  h.window.scrollY = 200;
  h.run(APP);

  assert.ok(
    h.byId.get('navbar').classList.contains('scrolled'),
    'app.js did not apply scroll state on load'
  );
});

test('app.js writes the current year into the footer', () => {
  const h = appHarness();
  h.run(APP);
  assert.strictEqual(h.byId.get('year').textContent, String(new Date().getFullYear()));
});

test('app.js reveals content without IntersectionObserver', () => {
  const h = appHarness({ intersectionObserver: false });
  h.run(APP);
  const revealed = h.body.querySelectorAll('.reveal');
  assert.ok(revealed.length > 0, 'harness should contain a .reveal element');
  for (const el of revealed) {
    assert.ok(el.classList.contains('visible'), 'no-JS fallback did not reveal the element');
  }
});

/* ---------- theme.js: portfolio pages ---------- */

test('theme.js renders the moon glyph and Dark label on load', () => {
  const h = createHarness({ ids: ['theme-toggle', 'theme-icon'] });
  h.run(THEME);
  assert.strictEqual(h.themeIcon.textContent, '\uD83C\uDF19');
});

test('theme.js toggles to dark, persists it, and updates glyph and label', () => {
  const h = createHarness({ ids: ['theme-toggle', 'theme-icon'] });
  h.run(THEME);

  h.fire(h.themeToggle, 'click');

  assert.strictEqual(h.currentTheme(), 'dark');
  assert.strictEqual(h.storedTheme(), 'dark');
  assert.strictEqual(h.themeIcon.textContent, '\u2600\uFE0F', 'glyph did not update');
  assert.strictEqual(h.byId.get('__theme-toggle-holder').childNodes[1].textContent, ' Light');
});

test('theme.js toggles back to light', () => {
  const h = createHarness({ ids: ['theme-toggle', 'theme-icon'], storage: { theme: 'dark' } });
  h.run(THEME);
  assert.strictEqual(h.currentTheme(), 'dark', 'store should have applied dark pre-paint');

  h.fire(h.themeToggle, 'click');

  assert.strictEqual(h.currentTheme(), 'light');
  assert.strictEqual(h.storedTheme(), 'light');
  assert.strictEqual(h.themeIcon.textContent, '\uD83C\uDF19');
});

test('theme.js wires the print button when one exists', () => {
  const h = createHarness({ ids: ['theme-toggle', 'theme-icon', 'print-btn'] });
  h.run(THEME);
  h.fire(h.byId.get('print-btn'), 'click');
  assert.strictEqual(h.window._printed, true, 'print button did not call window.print()');
});

test('theme.js is inert without a toggle, not a crash', () => {
  const h = createHarness({ ids: [] });
  assert.doesNotThrow(() => h.run(THEME));
});

/* ---------- cv-render.js ---------- */

test('cv-render.js applies the profile accent to body, not the mode to html', () => {
  // cv-render splits the two concerns: the accent palette lives on <body>,
  // the light/dark mode on <html>. Conflating them is a real historical bug.
  const h = createHarness({
    ids: ['cv-root', 'theme-toggle', 'theme-icon', 'print-btn'],
    storage: { theme: 'dark' },
  });
  h.context.window.CV_DATA = require(path.join(ROOT, 'js', 'cv-data.js'));
  h.run('js/cv-render.js');

  CVRendererFor(h).initCV('ai_engineer');

  assert.strictEqual(
    h.body.getAttribute('data-theme'),
    'ai-engineer',
    'profile accent was not applied to body'
  );
  assert.strictEqual(
    h.currentTheme(),
    'dark',
    'cv-render clobbered the light/dark mode on <html>'
  );
});

test('cv-render.js toggle flips the mode, persists it, and leaves the accent alone', () => {
  const h = createHarness({
    ids: ['cv-root', 'theme-toggle', 'theme-icon', 'print-btn'],
  });
  h.context.window.CV_DATA = require(path.join(ROOT, 'js', 'cv-data.js'));
  h.run('js/cv-render.js');

  CVRendererFor(h).initCV('data_engineer');
  const accentBefore = h.body.getAttribute('data-theme');

  h.fire(h.themeToggle, 'click');

  assert.strictEqual(h.currentTheme(), 'dark', 'mode did not flip to dark');
  assert.strictEqual(h.storedTheme(), 'dark', 'mode was not persisted');
  assert.strictEqual(h.themeIcon.textContent, '\u2600\uFE0F', 'icon did not update');
  assert.strictEqual(
    h.body.getAttribute('data-theme'),
    accentBefore,
    'toggling the mode overwrote the profile accent'
  );

  h.fire(h.themeToggle, 'click');
  assert.strictEqual(h.currentTheme(), 'light');
  assert.strictEqual(h.storedTheme(), 'light');
});

test('cv-render.js returns early for an unknown profile instead of throwing', () => {
  const h = createHarness({ ids: ['cv-root'] });
  h.context.window.CV_DATA = require(path.join(ROOT, 'js', 'cv-data.js'));
  h.run('js/cv-render.js');

  assert.doesNotThrow(() => CVRendererFor(h).initCV('no-such-profile'));
  assert.strictEqual(h.body.getAttribute('data-theme'), null, 'an unknown profile set a theme');
});

/** cv-render.js is UMD; run it in the harness context and return its export. */
function CVRendererFor(h) {
  return h.context.window.CVRenderer || h.context.CVRenderer;
}

/* ---------- structural guards worth keeping ---------- */

test('app.js is syntactically valid', () => {
  const src = fs.readFileSync(path.join(ROOT, APP), 'utf8');
  assert.doesNotThrow(() => new (require('node:vm').Script)(src));
});

test('every element ID app.js touches exists in index.html', () => {
  const js = fs.readFileSync(path.join(ROOT, APP), 'utf8');
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const ids = [...js.matchAll(/getElementById\('([^']+)'\)/g)].map((m) => m[1]);
  assert.ok(ids.length >= 5, `expected several getElementById calls, found ${ids.length}`);
  for (const id of ids) {
    assert.ok(html.includes(`id="${id}"`), `index.html missing #${id} referenced by app.js`);
  }
});

test('index.html carries the interactive hooks app.js depends on', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  for (const id of APP_IDS) {
    assert.ok(html.includes(`id="${id}"`), `index.html missing #${id}`);
  }
  assert.match(html, /class="[^"]*\breveal\b[^"]*"/, 'index.html missing .reveal elements');
  assert.ok(html.includes('nav-link'), 'index.html missing .nav-link elements');
});
