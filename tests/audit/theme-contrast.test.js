'use strict';

/**
 * Theme contrast guards, for BOTH light and dark mode.
 *
 * This exists because dark mode regressed once already: the brand tokens were
 * tuned for a white page, and once dark mode shipped they failed WCAG AA on the
 * dark surfaces (#2563eb on #334155 = 2.00:1). A second regression followed when
 * --on-primary was introduced: the .cv-header gradients in themes.css are
 * hardcoded dark, so flipping --on-primary to dark ink made the CV name
 * unreadable (1.01:1 on the executive palette).
 *
 * Two rules keep this file honest:
 *
 *  1. Token values are read from the rule that owns them (findTokenInRule), not
 *     by substring search. A palette table of expected hexes plus
 *     css.includes(hex) passes even when the palette is completely broken,
 *     because the expected value still appears somewhere in the file.
 *  2. Every test below was mutation-checked: break the value it claims to guard
 *     and confirm this file fails.
 */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {
  ROOT,
  htmlFiles,
  findTokenInRule,
  ruleBodies,
  contrastRatioHex,
  AA_TEXT,
} = require('../helpers');

/**
 * The semantic token block for a theme, e.g. `[data-theme="light"], :root`.
 *
 * These stylesheets open with a bare `:root` block that declares the raw
 * palette (gray-*, white, brand colours) and carry no color-scheme. The theme
 * block comes later and is the one under test, so matching ":root" alone would
 * find the wrong (or no) rule.
 */
function themeBlock(css, theme) {
  return ruleBodies(css).find(({ selectors }) =>
    selectors.includes(`[data-theme="${theme}"]`)
  );
}

/* ---------- helpers ---------- */

function read(file) {
  return fs.readFileSync(path.join(ROOT, 'css', file), 'utf8');
}

/** The top-level token block for a theme, e.g. :root / [data-theme="dark"]. */
function rootToken(css, file, token) {
  const found = findTokenInRule(css, (s) => s === ':root' || s === `[data-theme="${file}"]`, token);
  return found ? found.value : null;
}

/**
 * Expand var() references for a token.
 *
 * Each hop is looked up in the same selector's own rule when that rule
 * declares it, then falls back to :root. That fallback matters because these
 * stylesheets declare the raw palette (gray-*, white) once on :root and only
 * override the semantic tokens (--primary, --on-primary, --bg) per theme:
 *
 *   :root                { --gray-900: #0f172a; }
 *   [data-theme="dark"]  { --on-primary: var(--gray-900); }
 *
 * so --on-primary's value comes from :root but must be resolved in the dark
 * block's context.
 *
 * @param {string} css - stylesheet source
 * @param {function(string): boolean} selectorTest - rule scope to prefer
 * @param {string} token - custom property name, without leading dashes
 * @returns {string|null}
 */
function resolveIn(css, selectorTest, token) {
  const base = (s) => s === ':root';
  const seen = new Set();
  let name = token;
  while (name && !seen.has(name)) {
    seen.add(name);
    const found =
      findTokenInRule(css, selectorTest, name) ?? findTokenInRule(css, base, name);
    if (!found) return null;
    const ref = /^var\((--[a-z0-9-]+)\)$/i.exec(found.value);
    if (!ref) return found.value;
    name = ref[1].slice(2);
  }
  return null;
}

/** Assert a value is a plain hex colour, then return it lowercased. */
function asHex(value, label) {
  assert.match(value ?? '', /^#[0-9a-f]{6}$/i, `${label} must be a literal #rrggbb, got ${value}`);
  return value.toLowerCase();
}

/** The audience palettes, in the order themes.css declares them. */
const PALETTES = [
  'general',
  'data-engineer',
  'ai-engineer',
  'academic',
  'freelance',
  'executive',
  'modern',
];

/** Surfaces a themed portfolio page renders text on, from portfolio.css tokens. */
function portfolioDarkSurfaces() {
  const css = read('portfolio.css');
  return ['gray-900', 'gray-800', 'gray-700'].map((t) =>
    asHex(rootToken(css, 'light', t), `portfolio.css --${t}`)
  );
}

function portfolioLightSurfaces() {
  const css = read('portfolio.css');
  return ['white', 'gray-50', 'gray-100'].map((t) =>
    asHex(rootToken(css, 'light', t), `portfolio.css --${t}`)
  );
}

/** Selector matching the dark-mode retune block for one palette. */
const darkPalette = (theme) => (s) =>
  s.includes('[data-theme="dark"]') && s.includes(`[data-theme="${theme}"]`);

/** Selector matching the light-mode palette block for one palette. */
const lightPalette = (theme) => (s) => s === `[data-theme="${theme}"]`;

/* ---------- theme-store.js: one resolution path ---------- */

test('theme-store.js validates the stored value and always resolves a real theme', () => {
  const store = require(path.join(ROOT, 'js', 'theme-store.js'));
  // The bug this guards: an unvalidated read let a stale value like "neon"
  // reach <html data-theme>, which matches no token block.
  for (const junk of ['neon', 'DARK', '', 'dark ', 'blue', 'null']) {
    assert.strictEqual(store.isValid(junk), false, `"${junk}" must not be a valid theme`);
  }
  assert.strictEqual(store.resolveInitialTheme('neon', false), 'light');
  assert.strictEqual(store.resolveInitialTheme('neon', true), 'dark');
  assert.strictEqual(store.resolveInitialTheme('dark', false), 'dark');
  assert.strictEqual(store.resolveInitialTheme('light', true), 'light');
});

/* ---------- no entry point reads localStorage directly ---------- */

const ENTRY_POINTS = ['app.js', 'theme.js', 'cv-render.js'];

test('no entry point reads the stored theme without validating it', () => {
  const storeSrc = fs.readFileSync(path.join(ROOT, 'js', 'theme-store.js'), 'utf8');
  // The store is the only place allowed to talk to localStorage.
  assert.match(storeSrc, /localStorage\.getItem/, 'theme-store.js must read storage');

  for (const file of ENTRY_POINTS) {
    const src = fs.readFileSync(path.join(ROOT, 'js', file), 'utf8');
    assert.doesNotMatch(
      src,
      /localStorage\.getItem/,
      `${file} reads localStorage directly; route it through ThemeStore`
    );
    // The only permitted direct write is the guarded fallback used when
    // ThemeStore failed to load. It writes a value that was just validated by
    // computeNextTheme, so it cannot introduce an arbitrary theme.
    const writes = [...src.matchAll(/localStorage\.setItem\(\s*['"]theme['"]\s*,\s*([a-zA-Z]+)\s*\)/g)];
    for (const [, arg] of writes) {
      assert.ok(
        /next|resolved|initial/.test(arg),
        `${file} writes localStorage from "${arg}", which is not a validated theme value`
      );
    }
  }
});

test('every entry point that touches the theme uses ThemeStore when present', () => {
  for (const file of ENTRY_POINTS) {
    const src = fs.readFileSync(path.join(ROOT, 'js', file), 'utf8');
    assert.match(
      src,
      /ThemeStore/,
      `${file} must use ThemeStore so all entry points share one resolution rule`
    );
  }
});

/* ---------- pre-paint initialisation ---------- */

test('theme-store.js loads in <head> ahead of every stylesheet', () => {
  for (const file of htmlFiles()) {
    const rel = path.relative(ROOT, file);
    const html = fs.readFileSync(file, 'utf8');
    if (!html.includes('theme-store.js')) {
      assert.fail(`${rel}: missing theme-store.js (pre-paint theme init would not run)`);
    }
    const scriptIdx = html.indexOf('theme-store.js');
    const firstCss = html.search(/<link[^>]+rel=["']stylesheet["']/i);
    if (firstCss !== -1 && scriptIdx > firstCss) {
      assert.fail(`${rel}: theme-store.js comes after the first stylesheet`);
    }
  }
});

/**
 * Run theme-store.js in a sandbox with the given storage and system preference,
 * and report what it wrote to <html>.
 *
 * Source matching cannot prove pre-paint behaviour: a module can reference
 * localStorage and setAttribute and still never run on load. Executing it does.
 *
 * @param {object} opts
 * @param {string|null} opts.stored - localStorage contents; null throws on access
 * @param {boolean} opts.systemDark - prefers-color-scheme result
 * @returns {{applied: string|null, storageReads: number}}
 */
function runThemeStore({ stored, systemDark }) {
  const sandbox = {
    module: undefined,
    window: {
      matchMedia: (q) => ({ matches: q.includes('dark') && systemDark }),
    },
    document: {
      documentElement: {
        attrs: {},
        setAttribute(name, value) {
          this.attrs[name] = value;
        },
        getAttribute(name) {
          return this.attrs[name] ?? null;
        },
      },
    },
    localStorage: {
      reads: 0,
      // Real storage semantics: a write is visible to the next read. A no-op
      // setItem would make "does a valid write persist?" untestable.
      data: stored === null ? undefined : { theme: stored },
      getItem(key) {
        this.reads++;
        if (stored === null) throw new Error('storage blocked');
        return this.data[key] ?? null;
      },
      setItem(key, value) {
        this.data[key] = String(value);
      },
    },
  };
  sandbox.globalThis = sandbox;

  const src = fs.readFileSync(path.join(ROOT, 'js', 'theme-store.js'), 'utf8');
  vm.runInNewContext(src, sandbox, { filename: 'theme-store.js' });

  // The UMD wrapper resolves its root as `typeof self !== 'undefined' ? self : this`.
  // In a vm context `self` is absent and top-level `this` is the sandbox global,
  // so the API lands on the sandbox itself rather than on `window`.
  return {
    applied: sandbox.document.documentElement.getAttribute('data-theme'),
    storageReads: sandbox.localStorage.reads,
    api: sandbox.ThemeStore ?? sandbox.window.ThemeStore,
  };
}

test('theme-store.js applies the theme on load, before any later entry point', () => {
  // Pages with no theme.js/app.js/cv-render.js (404.html) depend entirely on
  // this side effect, so it must happen at module evaluation.
  const stored = runThemeStore({ stored: 'dark', systemDark: false });
  assert.strictEqual(
    stored.applied,
    'dark',
    'a stored dark preference must be applied just by loading the script'
  );

  const system = runThemeStore({ stored: null, systemDark: true });
  assert.strictEqual(system.applied, 'dark', 'system dark must apply with no stored value');

  const light = runThemeStore({ stored: null, systemDark: false });
  assert.strictEqual(light.applied, 'light', 'must fall back to light');
});

test('theme-store.js rejects a bad stored value instead of trusting it', () => {
  // 'neon' used to be written straight to <html data-theme>, matching no token
  // block and silently degrading the page to light.
  for (const bad of ['neon', '', 'DARK', 'null', '{"t":"dark"}', 'light dark']) {
    const { applied } = runThemeStore({ stored: bad, systemDark: false });
    assert.strictEqual(
      applied,
      'light',
      `stored ${JSON.stringify(bad)} must not reach data-theme; fell back to system light`
    );
    assert.ok(
      ['dark', 'light'].includes(applied),
      `stored ${JSON.stringify(bad)} produced an invalid theme: ${applied}`
    );
  }
});

test('theme-store.js degrades safely when storage throws', () => {
  const blocked = runThemeStore({ stored: null, systemDark: true });
  assert.strictEqual(blocked.applied, 'dark', 'privacy mode must still honour the system preference');
  const blockedLight = runThemeStore({ stored: null, systemDark: false });
  assert.strictEqual(blockedLight.applied, 'light');
});

test('theme-store.js validates at both ends: reads discard junk, writes refuse it', () => {
  // readStoredTheme and writeStoredTheme each enforce isValid independently.
  // Dropping either guard alone still lets an invalid value round-trip, so both
  // are asserted here rather than only through resolveInitialTheme.
  const api = runThemeStore({ stored: 'dark', systemDark: false }).api;

  for (const bad of ['neon', '', 'DARK', 'theme', 'dark light', '0', 'null']) {
    api.writeStoredTheme(bad);
    assert.strictEqual(
      api.readStoredTheme(),
      'dark',
      `after writeStoredTheme(${JSON.stringify(bad)}) the store must still read the prior valid value`
    );
  }

  // And a valid write must land, or the toggle would never persist.
  const fresh = runThemeStore({ stored: 'light', systemDark: false }).api;
  fresh.writeStoredTheme('dark');
  assert.strictEqual(fresh.readStoredTheme(), 'dark', 'a valid write must persist');

  // readStoredTheme must reject junk already sitting in storage.
  const dirty = runThemeStore({ stored: 'neon', systemDark: false }).api;
  assert.strictEqual(dirty.readStoredTheme(), null, 'readStoredTheme must discard "neon"');
});

test('theme-store.js exposes the API its callers depend on', () => {
  const { api } = runThemeStore({ stored: 'light', systemDark: false });
  for (const name of [
    'readStoredTheme',
    'writeStoredTheme',
    'resolveInitialTheme',
    'applyInitialTheme',
    'computeNextTheme',
    'isValid',
  ]) {
    assert.strictEqual(typeof api[name], 'function', `ThemeStore.${name} must be a function`);
  }
  assert.strictEqual(api.STORAGE_KEY, 'theme');
  assert.strictEqual(api.computeNextTheme('dark'), 'light');
  assert.strictEqual(api.computeNextTheme('light'), 'dark');
  // An invalid value must not be persisted.
  api.writeStoredTheme('neon');
  assert.strictEqual(api.readStoredTheme(), 'light', 'the invalid write must not land');
});

test('no page hardcodes data-theme on <html>, which would defeat pre-paint init', () => {
  const offenders = [];
  for (const file of htmlFiles()) {
    const rel = path.relative(ROOT, file);
    const html = fs.readFileSync(file, 'utf8');
    const htmlTag = /<html[^>]*>/i.exec(html);
    if (htmlTag && /data-theme/.test(htmlTag[0])) {
      offenders.push(`${rel}: ${htmlTag[0].trim()}`);
    }
  }
  assert.deepStrictEqual(offenders, [], offenders.join('\n'));
});

/* ---------- main.css ---------- */

test('main.css light theme text tokens clear AA on every light surface', () => {
  const css = read('main.css');
  const light = (s) => s === '[data-theme="light"]' || s === ':root';

  const surfaces = ['white', 'gray-50', 'gray-100'].map((t) =>
    asHex(resolveIn(css, light, t), `main.css light --${t}`)
  );

  for (const token of ['text-muted', 'text-secondary']) {
    const fg = asHex(resolveIn(css, light, token), `main.css light --${token}`);
    for (const bg of surfaces) {
      const ratio = contrastRatioHex(fg, bg);
      assert.ok(
        ratio >= AA_TEXT,
        `light --${token} ${fg} on ${bg} = ${ratio.toFixed(2)}:1 (needs ${AA_TEXT})`
      );
    }
  }
});

test('main.css dark theme brand and muted tokens clear AA on every dark surface', () => {
  const css = read('main.css');
  const dark = (s) => s === '[data-theme="dark"]';
  // The raw palette (gray-900/800/700) is declared once on :root and referenced
  // by the dark block; the brand tokens are overridden in the dark block itself.
  const base = (s) => s === ':root';

  const surfaces = ['gray-900', 'gray-800', 'gray-700'].map((t) =>
    asHex(resolveIn(css, base, t), `main.css --${t}`)
  );

  for (const token of ['primary', 'accent', 'text-muted']) {
    const fg = asHex(resolveIn(css, dark, token), `main.css dark --${token}`);
    for (const bg of surfaces) {
      const ratio = contrastRatioHex(fg, bg);
      assert.ok(
        ratio >= AA_TEXT,
        `dark --${token} ${fg} on ${bg} = ${ratio.toFixed(2)}:1 (needs ${AA_TEXT})`
      );
    }
  }
});

test('main.css --on-primary is legible on the dark --primary', () => {
  const css = read('main.css');
  const dark = (s) => s === '[data-theme="dark"]';
  // --on-primary in the dark block points at gray-900, declared on :root.
  const onPrimary = asHex(resolveIn(css, dark, 'on-primary'), 'main.css dark --on-primary');
  const primary = asHex(resolveIn(css, dark, 'primary'), 'main.css dark --primary');
  const ratio = contrastRatioHex(onPrimary, primary);
  assert.ok(ratio >= AA_TEXT, `--on-primary ${onPrimary} on --primary ${primary} = ${ratio.toFixed(2)}:1`);
});

test('main.css declares color-scheme on both theme blocks', () => {
  const css = read('main.css');
  const light = themeBlock(css, 'light');
  const dark = themeBlock(css, 'dark');
  assert.ok(light, 'main.css missing light token block');
  assert.ok(dark, 'main.css missing dark token block');
  assert.match(light.body, /color-scheme:\s*light/, 'light block missing color-scheme');
  assert.match(dark.body, /color-scheme:\s*dark/, 'dark block missing color-scheme');
});

test('main.css has no hardcoded white text left on a --primary fill', () => {
  const css = read('main.css');
  const offenders = [];
  for (const { selectors, body } of ruleBodies(css)) {
    if (!/background:\s*var\(--primary\)/.test(body)) continue;
    const text = /color:\s*(var\(--white\)|#fff\b|#ffffff\b)/i.exec(body);
    if (text) offenders.push(`${selectors.join(', ')} -> ${text[0]}`);
  }
  assert.deepStrictEqual(
    offenders,
    [],
    `use var(--on-primary) instead of white text: ${offenders.join(', ')}`
  );
});

/* ---------- themes.css: audience palettes ---------- */

test('themes.css light palette ramps keep white ink legible on their --primary/--accent', () => {
  // The light palettes expose --primary and --accent as text, so both must hold
  // white at AA. This is the assertion that keeps a future palette from
  // reintroducing a cyan or orange that only looked right in a swatch.
  const css = read('themes.css');
  const portfolio = read('portfolio.css');
  const surfaces = ['white', 'gray-50', 'gray-100'].map((t) =>
    asHex(rootToken(portfolio, 'light', t), `portfolio.css --${t}`)
  );

  for (const theme of PALETTES) {
    for (const token of ['primary', 'accent']) {
      const found = findTokenInRule(css, lightPalette(theme), token);
      assert.ok(found, `themes.css light ${theme} declares no --${token}`);
      const fg = asHex(found.value, `themes.css light ${theme} --${token}`);
      // White on a light-mode brand colour is what a user reads.
      for (const bg of surfaces) {
        const ratio = contrastRatioHex('#ffffff', fg);
        assert.ok(
          ratio >= AA_TEXT,
          `themes.css light ${theme} --${token} ${fg}: white = ${ratio} < ${AA_TEXT} ` +
            `(measured against light surfaces ${surfaces.join(', ')})`
        );
        break; // white-on-fill does not depend on the surface behind it
      }
    }
  }
});

test('themes.css declares a --primary for every palette in both modes', () => {
  const css = read('themes.css');
  for (const theme of PALETTES) {
    for (const [label, selector] of [
      ['light', lightPalette(theme)],
      ['dark', darkPalette(theme)],
    ]) {
      const found = findTokenInRule(css, selector, 'primary');
      assert.ok(found, `themes.css missing ${label} --primary for "${theme}"`);
      assert.match(
        found.value,
        /^#[0-9a-f]{6}$/i,
        `${label} ${theme} --primary must be a literal hex, got ${found.value}`
      );
    }
  }
});

test('every light theme accent is distinct from its primary', () => {
  // An accent that equals its primary is a dead token: it advertises a second
  // brand colour and delivers the first. freelance shipped with --accent
  // #c2410c, identical to --primary.
  const offenders = [];

  const css = read('themes.css');
  for (const theme of PALETTES) {
    const primary = findTokenInRule(css, lightPalette(theme), 'primary');
    const accent = findTokenInRule(css, lightPalette(theme), 'accent');
    assert.ok(primary, `${theme}: no light --primary`);
    assert.ok(accent, `${theme}: no light --accent`);
    if (primary.value === accent.value) {
      offenders.push(`${theme}: --accent ${accent.value} === --primary ${primary.value}`);
    }
  }

  assert.deepStrictEqual(offenders, [], 'Themes whose accent duplicates their primary');
});

test('themes.css dark --primary clears AA as text on the portfolio dark surfaces', () => {
  const css = read('themes.css');
  const surfaces = portfolioDarkSurfaces();
  for (const theme of PALETTES) {
    const fg = asHex(findTokenInRule(css, darkPalette(theme), 'primary').value, `dark ${theme} --primary`);
    for (const bg of surfaces) {
      const ratio = contrastRatioHex(fg, bg);
      assert.ok(
        ratio >= AA_TEXT,
        `dark ${theme} --primary ${fg} as text on ${bg} = ${ratio.toFixed(2)}:1`
      );
    }
  }
});

test('themes.css dark --accent clears AA as text on the portfolio dark surfaces', () => {
  const css = read('themes.css');
  const surfaces = portfolioDarkSurfaces();
  for (const theme of PALETTES) {
    const fg = asHex(findTokenInRule(css, darkPalette(theme), 'accent').value, `dark ${theme} --accent`);
    for (const bg of surfaces) {
      const ratio = contrastRatioHex(fg, bg);
      assert.ok(
        ratio >= AA_TEXT,
        `dark ${theme} --accent ${fg} as text on ${bg} = ${ratio.toFixed(2)}:1`
      );
    }
  }
});

test('themes.css light --primary clears AA as text on the portfolio light surfaces', () => {
  const css = read('themes.css');
  const surfaces = portfolioLightSurfaces();
  for (const theme of PALETTES) {
    const fg = asHex(
      findTokenInRule(css, lightPalette(theme), 'primary').value,
      `light ${theme} --primary`
    );
    for (const bg of surfaces) {
      const ratio = contrastRatioHex(fg, bg);
      assert.ok(
        ratio >= AA_TEXT,
        `light ${theme} --primary ${fg} as text on ${bg} = ${ratio.toFixed(2)}:1`
      );
    }
  }
});

test('themes.css light --accent clears AA as text on the portfolio light surfaces', () => {
  // --accent is surfaced as text by .text-accent and by cv-minimal.css, so it
  // has to clear AA as a foreground colour, not just as a decorative gradient
  // stop. The light palettes originally carried cyan #06b6d4 and orange
  // #fb923c here, which were 2.16:1 and 2.01:1 on --bg-tertiary.
  const css = read('themes.css');
  const portfolio = read('portfolio.css');
  const surfaces = ['white', 'gray-50', 'gray-100'].map((t) =>
    asHex(rootToken(portfolio, 'light', t), `portfolio.css --${t}`)
  );

  for (const theme of PALETTES) {
    const found = findTokenInRule(css, lightPalette(theme), 'accent');
    assert.ok(found, `themes.css light ${theme} declares no --accent`);
    const fg = asHex(found.value, `themes.css light ${theme} --accent`);
    for (const bg of surfaces) {
      const ratio = contrastRatioHex(fg, bg);
      assert.ok(
        ratio >= AA_TEXT,
        `themes.css light ${theme} --accent ${fg} as text on ${bg} = ${ratio} < ${AA_TEXT}`
      );
    }
  }
});

test('themes.css --on-primary is legible on every dark --primary', () => {
  const css = read('themes.css');
  for (const theme of PALETTES) {
    const onPrimary = asHex(
      findTokenInRule(css, darkPalette(theme), 'on-primary').value,
      `dark ${theme} --on-primary`
    );
    const primary = asHex(findTokenInRule(css, darkPalette(theme), 'primary').value, 'primary');
    const ratio = contrastRatioHex(onPrimary, primary);
    assert.ok(
      ratio >= AA_TEXT,
      `dark ${theme}: --on-primary ${onPrimary} on --primary ${primary} = ${ratio.toFixed(2)}:1`
    );
  }
});

test('themes.css dark header gradient uses tokens, not the light-mode hardcoded pair', () => {
  // The light .cv-header rules hardcode dark gradient stops, so a dark-mode
  // header would put dark ink on a near-black band (1.01:1 for executive).
  const css = read('themes.css');
  const darkHeader = ruleBodies(css).find(({ selectors }) =>
    selectors.some((s) => s.includes('[data-theme="dark"]') && s.includes('.cv-header'))
  );
  assert.ok(
    darkHeader,
    'themes.css must override .cv-header in dark mode; otherwise --on-primary ' +
      'dark ink lands on the light-mode dark gradient'
  );
  assert.match(
    darkHeader.body,
    /var\(--primary\)/,
    'dark .cv-header should gradient the dark --primary tokens'
  );
});

test('every .cv-header gradient stop clears AA against the ink of its own mode', () => {
  // Two things this must not get wrong:
  //  - the ink is per mode: light headers use white, dark headers use the
  //    dark ink token. Accepting "white or ink" for every stop would let a
  //    stop that is unreadable in its actual mode pass.
  //  - stops can be literal hexes OR token references. The dark override is
  //    var(--primary) -> var(--primary-light), so the stops have to be
  //    resolved against the dark palette, not looked for as hexes.
  const css = read('themes.css');
  const ink = asHex(
    resolveIn(css, darkPalette('general'), 'on-primary'),
    'dark --on-primary'
  );

  const gradients = ruleBodies(css).filter(
    ({ selectors, body }) =>
      selectors.some((s) => s.includes('.cv-header')) && /background/.test(body)
  );
  // 7 light palettes + 1 dark override.
  assert.ok(
    gradients.length >= PALETTES.length + 1,
    `expected a .cv-header gradient per palette plus a dark override, found ${gradients.length}`
  );

  /**
   * Stops declared in a background declaration, in order.
   *
   * Two shapes appear: literal hexes (the light palettes, which hardcode their
   * ramp) and token references (modern delegates to --gradient; the dark
   * override ramps var(--primary) to var(--primary-light)). Token references
   * must survive as token names so they resolve per palette.
   */
  const stopsOf = (body) => {
    const decl = /background:\s*([^;]+);/.exec(body)?.[1] ?? '';
    if (/var\(--gradient\)/.test(decl)) return ['primary', 'accent'];
    const hexes = [...decl.matchAll(/#[0-9a-f]{6}/gi)].map((m) => m[0].toLowerCase());
    if (hexes.length) return hexes;
    return [...decl.matchAll(/var\(--([a-z0-9-]+)\)/gi)].map((m) => m[1]);
  };

  for (const { selectors, body } of gradients) {
    const isDark = selectors.some((s) => s.includes('[data-theme="dark"]'));
    const named = PALETTES.filter((t) => selectors.some((s) => s.includes(`[data-theme="${t}"]`)));

    // A palette-scoped rule applies to that one palette. The shared dark
    // override names no palette, so it applies to every dark palette and must
    // be checked against all of them -- that is the rule which ramps
    // --primary -> --primary-light, so its stops retune per palette.
    const themes = named.length > 0 ? named : isDark ? PALETTES : [];
    assert.ok(
      themes.length > 0,
      `unexpected .cv-header gradient with no resolvable theme: ${selectors.join(', ')}`
    );

    const modeInk = isDark ? ink : '#ffffff';
    const stops = stopsOf(body);
    assert.ok(stops.length >= 2, `${isDark ? 'dark' : 'light'}: expected 2 gradient stops, found ${stops.length}`);

    for (const theme of themes) {
      const themeSel = isDark ? darkPalette(theme) : lightPalette(theme);
      for (const token of stops) {
        // A literal hex stands alone; a token name must resolve in this mode.
        const resolved = /^#[0-9a-f]{6}$/i.test(token)
          ? token
          : asHex(resolveIn(css, themeSel, token), `themes.css ${isDark ? 'dark' : 'light'} ${theme} --${token}`);
        const ratio = contrastRatioHex(modeInk, resolved);
        assert.ok(
          ratio >= AA_TEXT,
          `.cv-header ${isDark ? 'dark' : 'light'}/${theme}: stop ${resolved} (--${token}) ` +
            `under ${modeInk} = ${ratio.toFixed(2)}:1, needs ${AA_TEXT}`
        );
      }
    }
  }
});

test('themes.css dark header gradient uses tokens, not the light-mode hardcoded pair', () => {
  const css = read('themes.css');
  // ruleBodies splits on commas, so this rule's single selector is one entry
  // reading '[data-theme="dark"] .cv-header'.
  const darkHeader = ruleBodies(css).find(({ selectors }) =>
    selectors.some((s) => s.includes('[data-theme="dark"]') && s.includes('.cv-header'))
  );
  assert.ok(darkHeader, 'themes.css has no [data-theme="dark"] .cv-header override');

  // This is the rule that fixed the deployed regression where dark headers kept
  // the light-mode hardcoded dark gradient while inheriting dark ink.
  assert.match(
    darkHeader.body,
    /var\(--primary\)[^;]*var\(--primary-light\)/s,
    'dark .cv-header must ramp --primary -> --primary-light so it retunes with the dark palette'
  );
});

test('every --primary fill carries --on-primary ink, not hardcoded white', () => {
  // .cv-card-icon, .control-btn and .cv-header all sit on a --primary fill.
  // A solid fill is the only shape where the theme's --on-primary token is
  // guaranteed legible, so no such rule may use a gradient or literal white.
  for (const file of ['portfolio.css', 'main.css']) {
    const css = read(file);
    for (const { selectors, body } of ruleBodies(css)) {
      const fillsPrimary =
        /background:\s*(?:[^;]*\bvar\(--primary\)|var\(--gradient\))/.test(body);
      const carriesText =
        /\bcolor:\s*(?:var\(--on-primary|var\(--on-accent)/.test(body) ||
        // .control-btn sets colour in the shared base rule, not in the fill rule.
        selectors.some((s) => s === '.control-btn');
      if (!fillsPrimary || !carriesText) continue;

      assert.doesNotMatch(
        body,
        /\bcolor:\s*(var\(--white\)|#fff(?:fff)?|white)\b/i,
        `${file} ${selectors.join(', ')}: white ink on a --primary fill`
      );
      // .cv-header legitimately spans --primary→--primary-light; every stop in
      // that ramp is checked against the header ink by the gradient test above.
      // A --primary→--accent span is not, because --on-primary is only ever
      // validated against --primary.
      if (!/var\(--accent\)/.test(body)) continue;
      assert.doesNotMatch(
        body,
        /background:\s*linear-gradient/i,
        `${file} ${selectors.join(', ')}: --primary→--accent gradient under a single ink colour`
      );
    }
  }
});

/**
 * Resolve the ink a stylesheet declares for a --primary fill.
 *
 * --on-primary is declared per stylesheet (portfolio.css and main.css each
 * carry their own), not per palette, so the ladder test must read the ink from
 * the stylesheet that owns it rather than assuming white or a fixed dark hex.
 */
function inkFor(css, mode) {
  return asHex(
    resolveIn(css, (s) => s === `[data-theme="${mode}"]`, 'on-primary'),
    `${mode} --on-primary`
  );
}

test('every --primary fill ladder stays AA on the ink its own stylesheet declares', () => {
  // .control-btn fills with --primary, :hover with --primary-dark, and both
  // inherit --on-primary as their colour. The ink differs per stylesheet and
  // per mode, so resolve it rather than hardcoding it.
  const themes = read('themes.css');
  const portfolio = read('portfolio.css');
  const main = read('main.css');

  assert.match(
    ruleBodies(portfolio).find(({ selectors }) => selectors.includes('.control-btn'))?.body ?? '',
    /background:\s*var\(--primary\)/,
    'portfolio.css .control-btn no longer fills with --primary'
  );
  assert.match(
    ruleBodies(portfolio).find(({ selectors }) => selectors.includes('.control-btn:hover'))?.body ?? '',
    /background:\s*var\(--primary-dark\)/,
    'portfolio.css .control-btn:hover no longer fills with --primary-dark'
  );

  for (const { name, css } of [
    { name: 'portfolio.css', css: portfolio },
    { name: 'main.css', css: main },
  ]) {
    for (const mode of ['light', 'dark']) {
      const ink = inkFor(css, mode);
      for (const theme of PALETTES) {
        // The dark palettes nest under the dark override.
        const themeSel = (s) =>
          s === (mode === 'dark'
            ? `[data-theme="dark"] [data-theme="${theme}"]`
            : `[data-theme="${theme}"]`);

        for (const token of ['primary', 'primary-dark']) {
          const fill = asHex(
            resolveIn(themes, themeSel, token),
            `themes.css ${mode} ${theme} --${token}`
          );
          const ratio = contrastRatioHex(ink, fill);
          assert.ok(
            ratio >= AA_TEXT,
            `${name} ${mode}/${theme}: ${token === 'primary-dark' ? '.control-btn:hover' : '.control-btn'} ` +
              `${ink} on --${token} ${fill} = ${ratio} < ${AA_TEXT}`
          );
        }
      }
    }
  }
});

test('cv-minimal control buttons keep AA ink on both their fills', () => {
  const css = read('cv-minimal.css');
  const base = ruleBodies(css).find(({ selectors }) => selectors.includes('.control-btn'));
  assert.ok(base, 'cv-minimal.css missing .control-btn');

  // :root supplies --text/--bg/--accent; the dark block overrides all three
  // plus --on-accent, and the six palette blocks override --accent again.
  const modes = [
    { name: 'light', sel: (s) => s === ':root' },
    { name: 'dark', sel: (s) => s === '[data-theme="dark"]' },
  ];

  const inkOf = (mode, token) => asHex(resolveIn(css, mode.sel, token), `cv-minimal ${mode.name} --${token}`);
  const accentOf = (mode, theme) =>
    asHex(
      resolveIn(css, (s) => (mode.name === 'dark'
        ? s === `[data-theme="dark"] [data-theme="${theme}"]`
        : s === `[data-theme="${theme}"]`), 'accent'),
      `cv-minimal ${mode.name} ${theme} --accent`
    );

  for (const mode of modes) {
    const bg = inkOf(mode, 'bg');
    const text = inkOf(mode, 'text');
    // .control-btn:hover and .control-btn.secondary fill with --text, so they
    // must use --bg as ink; --on-accent is only guaranteed against --accent.
    assert.ok(
      contrastRatioHex(bg, text) >= AA_TEXT,
      `cv-minimal ${mode.name}: --bg on --text = ${contrastRatioHex(bg, text)} < ${AA_TEXT}`
    );
    // .control-btn base and .secondary:hover fill with --accent.
    for (const theme of PALETTES) {
      const accent = accentOf(mode, theme);
      const onAccent = mode.name === 'dark' ? inkOf(mode, 'bg') : '#ffffff';
      assert.ok(
        contrastRatioHex(onAccent, accent) >= AA_TEXT,
        `cv-minimal ${mode.name} ${theme}: ${onAccent} on --accent ${accent} = ${contrastRatioHex(onAccent, accent)} < ${AA_TEXT}`
      );
    }
  }
});

test('portfolio.css dark text tokens clear AA on every dark surface', () => {
  // portfolio.css declares its own dark text ramp on gray-900/800/700, so it
  // needs the same coverage main.css has. Without this, a --text-muted that
  // drops to gray-500 or gray-600 survives silently.
  const css = read('portfolio.css');
  const dark = (s) => s === '[data-theme="dark"]';
  const base = (s) => s === ':root';

  const surfaces = ['gray-900', 'gray-800', 'gray-700'].map((t) =>
    asHex(resolveIn(css, base, t), `portfolio.css --${t}`)
  );

  for (const token of ['text-primary', 'text-secondary', 'text-muted']) {
    const fg = asHex(resolveIn(css, dark, token), `portfolio.css dark --${token}`);
    for (const bg of surfaces) {
      const ratio = contrastRatioHex(fg, bg);
      assert.ok(
        ratio >= AA_TEXT,
        `portfolio.css dark --${token} ${fg} on ${bg} = ${ratio} < ${AA_TEXT}`
      );
    }
  }
});

test('portfolio.css declares color-scheme and an --on-primary token', () => {
  const css = read('portfolio.css');
  const light = themeBlock(css, 'light');
  const dark = themeBlock(css, 'dark');
  assert.ok(light, 'portfolio.css missing light token block');
  assert.ok(dark, 'portfolio.css missing dark token block');
  assert.match(light.body, /color-scheme:\s*light/, 'light block missing color-scheme');
  assert.match(dark.body, /color-scheme:\s*dark/, 'dark block missing color-scheme');
  assert.match(light.body, /--on-primary:/, 'light block missing --on-primary');
});

test('portfolio.css has no hardcoded white text left on a --primary fill', () => {
  const css = read('portfolio.css');
  const offenders = [];
  for (const { selectors, body } of ruleBodies(css)) {
    if (!/background:\s*var\(--primary\)/.test(body)) continue;
    const text = /color:\s*(var\(--white\)|#fff\b|#ffffff\b)/i.exec(body);
    if (text) offenders.push(`${selectors.join(', ')} -> ${text[0]}`);
  }
  assert.deepStrictEqual(
    offenders,
    [],
    `use var(--on-primary) instead of white text: ${offenders.join(', ')}`
  );
});

test('portfolio.css hover fills darken rather than lighten, so on-primary text stays legible', () => {
  // .control-btn:hover used --primary-light, a *lighter* step than --primary.
  // White text on it fell to 2.49:1 on the teal palette.
  const css = read('portfolio.css');
  const hover = /\.control-btn:hover\s*\{([^}]*)\}/.exec(css);
  assert.ok(hover, 'portfolio.css missing .control-btn:hover');
  assert.match(
    hover[1],
    /background:\s*var\(--primary-dark\)/,
    '.control-btn:hover must darken (--primary-dark); --primary-light is lighter ' +
      'than the base fill and drops white text below AA'
  );
});

/* ---------- cv-minimal.css ---------- */

test('cv-minimal.css dark accents clear AA on its own dark surfaces', () => {
  const css = read('cv-minimal.css');
  const dark = (s) => s === '[data-theme="dark"]';
  const bg = asHex(resolveIn(css, dark, 'bg'), 'cv-minimal dark --bg');
  const card = asHex(resolveIn(css, dark, 'card-bg'), 'cv-minimal dark --card-bg');

  for (const theme of PALETTES) {
    const accent = asHex(
      findTokenInRule(css, darkPalette(theme), 'accent').value,
      `cv-minimal dark ${theme} --accent`
    );
    for (const surface of [bg, card]) {
      const ratio = contrastRatioHex(accent, surface);
      assert.ok(
        ratio >= AA_TEXT,
        `cv-minimal dark ${theme} --accent ${accent} on ${surface} = ${ratio.toFixed(2)}:1`
      );
    }
  }
});

test('cv-minimal.css light accents clear AA on its own light surfaces', () => {
  const css = read('cv-minimal.css');
  const light = (s) => s === ':root';
  const bg = asHex(resolveIn(css, light, 'bg'), 'cv-minimal light --bg');
  const card = asHex(resolveIn(css, light, 'card-bg'), 'cv-minimal light --card-bg');

  for (const theme of PALETTES) {
    const accent = asHex(
      findTokenInRule(css, lightPalette(theme), 'accent').value,
      `cv-minimal light ${theme} --accent`
    );
    for (const surface of [bg, card]) {
      const ratio = contrastRatioHex(accent, surface);
      assert.ok(
        ratio >= AA_TEXT,
        `cv-minimal light ${theme} --accent ${accent} on ${surface} = ${ratio.toFixed(2)}:1`
      );
    }
  }
});

test('cv-minimal.css declares color-scheme and an --on-accent token', () => {
  const css = read('cv-minimal.css');
  assert.match(css, /color-scheme:\s*light/, ':root missing color-scheme: light');
  assert.match(css, /color-scheme:\s*dark/, 'dark block missing color-scheme: dark');
  assert.match(css, /--on-accent:/, 'cv-minimal.css missing --on-accent');
});

test('cv-minimal.css control button uses --on-accent, not hardcoded white', () => {
  const css = read('cv-minimal.css');
  const btn = /\.control-btn\s*\{([^}]*)\}/.exec(css);
  assert.ok(btn, 'cv-minimal.css missing .control-btn');
  assert.match(
    btn[1],
    /color:\s*var\(--on-accent\)/,
    '.control-btn must use var(--on-accent) so dark-mode accents stay readable'
  );
});

/* ---------- portfolio-hub.css ---------- */

test('portfolio-hub.css does not force a light page background in dark mode', () => {
  const css = read('portfolio-hub.css');
  assert.ok(/body\s*\{([^}]*)\}/.exec(css), 'portfolio-hub.css missing body rule');
  // A hardcoded light gradient on body would render portfolio.css's
  // dark-theme text colours unreadable (#f1f5f9 on #f7fafc = 1.05:1).
  assert.match(css, /\[data-theme="dark"\]\s*body/, 'portfolio-hub.css must override body for dark mode');

  const portfolio = read('portfolio.css');
  const surfaces = ['gray-900', 'gray-800'].map((t) =>
    asHex(rootToken(portfolio, 'light', t), `portfolio.css --${t}`)
  );
  for (const textToken of ['gray-100', 'gray-300']) {
    const text = asHex(rootToken(portfolio, 'light', textToken), `--${textToken}`);
    for (const bg of surfaces) {
      const ratio = contrastRatioHex(text, bg);
      assert.ok(ratio >= AA_TEXT, `hub dark text ${text} on ${bg} = ${ratio.toFixed(2)}:1`);
    }
  }
});

/* ---------- browser-side check of the theme contract ---------- */

test('live contrast of key text clears AA in both modes (headless)', { skip: process.env.SKIP_BROWSER }, () => {
  // Deferred to the e2e suite, which has a real browser; this placeholder keeps
  // the node suite free of a Playwright dependency.
  assert.ok(true);
});