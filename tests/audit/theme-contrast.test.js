'use strict';

/**
 * Theme contrast + pre-paint initialisation guards.
 *
 * These exist because dark mode regressed once already: the brand tokens were
 * tuned for a white page, and once dark mode shipped they failed WCAG AA on the
 * dark surfaces (#2563eb on #334155 = 2.00:1). The arithmetic below is computed
 * from the literal values in the stylesheets so any future drift fails here
 * rather than in a screen-reader/contrast audit.
 */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..', '..');

/* ---------- WCAG contrast maths ---------- */

function channelLuminance(c8bit) {
  const c = c8bit / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  );
}

function contrastRatio(fg, bg) {
  const a = relativeLuminance(fg);
  const b = relativeLuminance(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

const AA_TEXT = 4.5;

/* ---------- Stylesheet readers ---------- */

function read(file) {
  return fs.readFileSync(path.join(ROOT, 'css', file), 'utf8');
}

/** Resolve the var() chain for a token inside a single rule block. */
function tokenValue(css, token, scopeHint) {
  const scope = scopeHint
    ? css.slice(css.indexOf(scopeHint))
    : css;
  const match = new RegExp(`--${token}:\\s*([^;]+);`).exec(scope);
  return match ? match[1].trim() : null;
}

/** Expand --token references against the palette defined in the same block. */
function resolve(css, value, seen = new Set()) {
  if (!value) return null;
  const varRef = /^var\((--[a-z0-9-]+)\)$/i.exec(value.trim());
  if (!varRef) return value;
  const name = varRef[1].slice(2);
  if (seen.has(name)) return null;
  seen.add(name);
  return resolve(css, tokenValue(css, name), seen);
}

function readToken(css, token) {
  const resolved = resolve(css, tokenValue(css, token));
  return resolved && /^#[0-9a-f]{3,8}$/i.test(resolved) ? resolved : null;
}

/** Split a stylesheet into rules, with comma-separated selectors grouped. */
function ruleBodies(css) {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const out = [];
  for (const m of stripped.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selectors = m[1].split(',').map((s) => s.trim()).filter(Boolean);
    out.push({ selectors, body: m[2] });
  }
  return out;
}

function htmlFiles() {
  const out = [];
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.html')) out.push(full);
    }
  })(ROOT);
  return out;
}

/* ---------- main.css ---------- */

test('main.css dark theme brand and muted tokens clear AA on every dark surface', () => {
  const css = read('main.css');
  const dark = css.slice(css.indexOf('[data-theme="dark"]'));

  const surfaces = {
    'bg-primary': readToken(css, 'gray-900'),
    'bg-secondary': readToken(css, 'gray-800'),
    'bg-tertiary': readToken(css, 'gray-700'),
  };
  for (const [name, hex] of Object.entries(surfaces)) {
    assert.match(hex, /^#/, `--${name} must resolve to a hex colour`);
  }

  // Text-bearing tokens that sit directly on those surfaces.
  const foregrounds = {
    primary: tokenValue(dark, 'primary'),
    accent: tokenValue(dark, 'accent'),
    'text-muted': tokenValue(dark, 'text-muted'),
  };

  for (const [fgName, fgHex] of Object.entries(foregrounds)) {
    assert.match(fgHex, /^#[0-9a-f]{6}$/i, `dark --${fgName} must be a literal hex`);
    for (const [bgName, bgHex] of Object.entries(surfaces)) {
      const ratio = contrastRatio(fgHex, bgHex);
      assert.ok(
        ratio >= AA_TEXT,
        `dark --${fgName} ${fgHex} on --${bgName} ${bgHex} = ` +
          `${ratio.toFixed(2)}:1 (needs ${AA_TEXT})`
      );
    }
  }
});

test('main.css --on-primary is legible on the lightened dark --primary', () => {
  const css = read('main.css');
  const dark = css.slice(css.indexOf('[data-theme="dark"]'));
  const onPrimary = tokenValue(dark, 'on-primary');
  const primary = tokenValue(dark, 'primary');
  const resolved = resolve(css, onPrimary);
  assert.ok(
    contrastRatio(resolved, primary) >= AA_TEXT,
    `--on-primary ${resolved} on --primary ${primary} must clear ${AA_TEXT}:1`
  );
});

test('main.css declares color-scheme on both theme blocks', () => {
  const css = read('main.css');
  const light = css.slice(css.indexOf('[data-theme="light"], :root'));
  const dark = css.slice(css.indexOf('[data-theme="dark"]'));
  assert.match(light, /color-scheme:\s*light/, 'light block missing color-scheme');
  assert.match(dark, /color-scheme:\s*dark/, 'dark block missing color-scheme');
});

test('main.css has no hardcoded white text left on a --primary fill', () => {
  const css = read('main.css');
  const offenders = [];
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const [selector, body] = [m[1].trim(), m[2]];
    if (!/background:\s*var\(--primary\)/.test(body)) continue;
    if (selector.startsWith('/*')) continue;
    const text = /color:\s*(var\(--white\)|#fff\b|#ffffff\b)/i.exec(body);
    if (text) offenders.push(`${selector} -> ${text[0]}`);
  }
  assert.deepStrictEqual(
    offenders,
    [],
    `use var(--on-primary) instead of white text: ${offenders.join(', ')}`
  );
});

/* ---------- themes.css (audience palettes) ---------- */

const DARK_PALETTES = {
  general: { primary: '#93c5fd', accent: '#c4b5fd' },
  modern: { primary: '#93c5fd', accent: '#c4b5fd' },
  'data-engineer': { primary: '#5eead4', accent: '#67e8f9' },
  'ai-engineer': { primary: '#c4b5fd', accent: '#ddd6fe' },
  academic: { primary: '#cbd5e1', accent: '#d1d5db' },
  freelance: { primary: '#fdba74', accent: '#fed7aa' },
  executive: { primary: '#cbd5e1', accent: '#d1d5db' },
};

test('themes.css dark-mode accents clear AA on the portfolio.css dark surfaces', () => {
  const css = read('themes.css');
  const portfolio = read('portfolio.css');

  const surfaces = [
    readToken(portfolio, 'gray-900'),
    readToken(portfolio, 'gray-800'),
    readToken(portfolio, 'gray-700'),
  ];

  for (const [theme, tokens] of Object.entries(DARK_PALETTES)) {
    for (const [name, hex] of Object.entries(tokens)) {
      // The value must actually be present in the file, or the block is dead.
      assert.ok(
        css.includes(hex),
        `themes.css is missing dark ${theme} --${name} ${hex}`
      );
      for (const bg of surfaces) {
        const ratio = contrastRatio(hex, bg);
        assert.ok(
          ratio >= AA_TEXT,
          `dark ${theme} --${name} ${hex} on ${bg} = ` +
            `${ratio.toFixed(2)}:1 (needs ${AA_TEXT})`
        );
      }
    }
  }
});

test('themes.css dark block targets html[data-theme=dark] body[data-theme=...]', () => {
  const css = read('themes.css');
  for (const theme of Object.keys(DARK_PALETTES)) {
    const selector = `[data-theme="dark"] [data-theme="${theme}"]`;
    assert.ok(
      css.includes(selector),
      `missing dark-mode selector for "${theme}" (need ${selector})`
    );
  }
});

test('themes.css --on-primary is legible on every lightened dark --primary', () => {
  const css = read('themes.css');
  const onPrimary = tokenValue(css.slice(css.indexOf('[data-theme="dark"]')), 'on-primary');
  const resolved = resolve(css, onPrimary);
  assert.match(resolved, /^#/, '--on-primary must resolve to a hex colour');
  for (const [theme, tokens] of Object.entries(DARK_PALETTES)) {
    const ratio = contrastRatio(resolved, tokens.primary);
    assert.ok(
      ratio >= AA_TEXT,
      `--on-primary ${resolved} on ${theme} --primary ${tokens.primary} = ` +
        `${ratio.toFixed(2)}:1`
    );
  }
});

/* ---------- portfolio.css + cv-minimal.css ---------- */

test('portfolio.css declares color-scheme and an --on-primary token', () => {
  const css = read('portfolio.css');
  const light = css.slice(css.indexOf('[data-theme="light"], :root'));
  const dark = css.slice(css.indexOf('[data-theme="dark"]'));
  assert.match(light, /color-scheme:\s*light/, 'light block missing color-scheme');
  assert.match(dark, /color-scheme:\s*dark/, 'dark block missing color-scheme');
  assert.match(light, /--on-primary:/, 'light block missing --on-primary');
});

test('portfolio.css has no hardcoded white text left on a --primary fill', () => {
  const css = read('portfolio.css');
  const offenders = [];
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const [selector, body] = [m[1].trim(), m[2]];
    if (!/background:\s*var\(--primary\)/.test(body)) continue;
    if (selector.startsWith('/*')) continue;
    const text = /color:\s*(var\(--white\)|#fff\b|#ffffff\b)/i.exec(body);
    if (text) offenders.push(`${selector} -> ${text[0]}`);
  }
  assert.deepStrictEqual(
    offenders,
    [],
    `use var(--on-primary) instead of white text: ${offenders.join(', ')}`
  );
});

test('cv-minimal.css dark accents clear AA on its own dark surfaces', () => {
  const css = read('cv-minimal.css');
  const dark = css.slice(css.indexOf('[data-theme="dark"]'));
  // Read the surfaces from the dark block: the :root values are the light ones.
  const bg = resolve(css, tokenValue(dark, 'bg'));
  const card = resolve(css, tokenValue(dark, 'card-bg'));
  assert.match(bg, /^#/, 'cv-minimal dark --bg must resolve to a hex colour');
  assert.match(card, /^#/, 'cv-minimal dark --card-bg must resolve to a hex colour');

  for (const [theme, hex] of Object.entries(DARK_PALETTES)) {
    // Selectors are grouped in places, so parse each rule's selector list
    // rather than assuming "selector { --accent: ..." on one line.
    const found = ruleBodies(css).some(({ selectors, body }) => {
      const scoped = selectors.some(
        (s) =>
          s.includes('[data-theme="dark"]') &&
          s.includes(`[data-theme="${theme}"]`)
      );
      return scoped && /--accent:\s*#[0-9a-f]{6}/i.test(body);
    });
    assert.ok(found, `cv-minimal.css missing dark ${theme} --accent`);

    const match = new RegExp(`--accent:\\s*(#[0-9a-f]{6})`, 'i').exec(
      ruleBodies(css)
        .filter(({ selectors }) =>
          selectors.some(
            (s) =>
              s.includes('[data-theme="dark"]') &&
              s.includes(`[data-theme="${theme}"]`)
          )
        )
        .map(({ body }) => body)
        .join('')
    );
    for (const surface of [bg, card]) {
      const ratio = contrastRatio(match[1], surface);
      assert.ok(
        ratio >= AA_TEXT,
        `dark ${theme} --accent ${match[1]} on ${surface} = ` +
          `${ratio.toFixed(2)}:1 (needs ${AA_TEXT})`
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
  const body = /body\s*\{([^}]*)\}/.exec(css);
  assert.ok(body, 'portfolio-hub.css missing body rule');
  // A hardcoded light gradient on body would render portfolio.css's
  // dark-theme text colours unreadable (#f1f5f9 on #f7fafc = 1.05:1).
  assert.match(
    css,
    /\[data-theme="dark"\]\s*body/,
    'portfolio-hub.css must override body for dark mode'
  );
  const portfolio = read('portfolio.css');
  const surfaces = [
    readToken(portfolio, 'gray-900'),
    readToken(portfolio, 'gray-800'),
  ];
  for (const textToken of ['gray-100', 'gray-300']) {
    const text = readToken(portfolio, textToken);
    for (const bg of surfaces) {
      assert.ok(
        contrastRatio(text, bg) >= AA_TEXT,
        `hub dark text ${text} on ${bg} must clear ${AA_TEXT}:1`
      );
    }
  }
});

/* ---------- Pre-paint theme initialisation ---------- */

test('theme-init.js sets data-theme before paint, external to the page', () => {
  const src = fs.readFileSync(path.join(ROOT, 'js', 'theme-init.js'), 'utf8');
  assert.match(src, /setAttribute\(\s*'data-theme'/, 'must set data-theme');
  assert.match(src, /localStorage/, 'must read the stored preference');
  assert.match(src, /prefers-color-scheme/, 'must fall back to the system preference');
  assert.match(src, /try\s*{/, 'storage access must be guarded for privacy mode');
});

test('every page loads theme-init.js ahead of its stylesheets', () => {
  const offenders = [];
  for (const file of htmlFiles()) {
    const rel = path.relative(ROOT, file);
    const html = fs.readFileSync(file, 'utf8');
    if (!html.includes('theme-init.js')) {
      offenders.push(`${rel}: missing theme-init.js`);
      continue;
    }
    const scriptIdx = html.indexOf('theme-init.js');
    const firstCss = html.search(/<link[^>]+rel=["']stylesheet["']/i);
    if (firstCss !== -1 && scriptIdx > firstCss) {
      offenders.push(`${rel}: theme-init.js comes after the first stylesheet`);
    }
  }
  assert.deepStrictEqual(offenders, [], offenders.join('\n'));
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