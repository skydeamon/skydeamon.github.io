'use strict';

/**
 * Tests for js/cv-init.js — the data-attribute bootstrap that runs from the
 * script tag and calls CVRenderer.initCV.
 *
 * The previous version of this file was named for cv-init.js but only tested
 * initCV() on cv-render.js, so the bootstrap itself — which decides whether
 * the CV renders at all — was never executed. initCV's own theme behaviour now
 * lives in tests/app-js.test.js, under the shared DOM harness.
 */

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT } = require('../helpers');
const { createHarness } = require('../helpers/dom-harness');

const CV_DATA = require(path.join(ROOT, 'js', 'cv-data.js'));

/** Every CV shell, including the engagement/ subdirectory. */
function cvShells() {
  const shells = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.html')) shells.push(full);
    }
  };
  walk(path.join(ROOT, 'portfolio', 'cv'));
  return shells;
}

/**
 * Copy a value out of the vm realm. An object built inside the context has
 * that context's Object.prototype, which deepStrictEqual rejects on identity
 * even when the contents match.
 */
function plain(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

/**
 * Run cv-init.js with `document.currentScript` reporting the given attributes,
 * and record what it asked CVRenderer to do.
 */
function bootstrap(scriptAttrs, { withRenderer = true } = {}) {
  const calls = [];
  const h = createHarness({ ids: ['cv-root'], withThemeStore: true });

  h.context.window.CV_DATA = CV_DATA;
  if (withRenderer) {
    h.context.window.CVRenderer = {
      initCV(profile, opts) {
        calls.push({ profile, opts });
      },
    };
  }

  h.context.document.currentScript =
    scriptAttrs === null
      ? null
      : { getAttribute: (name) => (name in scriptAttrs ? scriptAttrs[name] : null) };

  h.run('js/cv-init.js');
  return { calls, h };
}

test('cv-init.js calls initCV with the profile from data-profile', () => {
  const { calls } = bootstrap({ 'data-profile': 'data_engineer' });

  assert.strictEqual(calls.length, 1, 'initCV was not called exactly once');
  assert.strictEqual(calls[0].profile, 'data_engineer');
  assert.strictEqual(calls[0].opts, undefined, 'no options expected without data-format/base');
});

test('cv-init.js forwards data-format and data-base as options', () => {
  const { calls } = bootstrap({
    'data-profile': 'property_manager',
    'data-format': 'engagement',
    'data-base': '../../',
  });

  assert.deepStrictEqual(plain(calls[0].opts), { format: 'engagement', base: '../../' });
});

test('cv-init.js passes a lone data-base through', () => {
  // A base without a format is still a real option; it must not be dropped by
  // an all-or-nothing `if (format && base)`.
  const { calls } = bootstrap({ 'data-profile': 'cto', 'data-base': '../' });
  assert.deepStrictEqual(plain(calls[0].opts), { base: '../' });
});

test('cv-init.js passes a lone data-format through', () => {
  const { calls } = bootstrap({ 'data-profile': 'cto', 'data-format': 'engagement' });
  assert.deepStrictEqual(plain(calls[0].opts), { format: 'engagement' });
});

test('cv-init.js does nothing without a data-profile', () => {
  const { calls } = bootstrap({ 'data-base': '../../' });
  assert.deepStrictEqual(calls, [], 'initCV ran without a profile');
});

test('cv-init.js does nothing when currentScript is unavailable', () => {
  // document.currentScript is null in some async/deferred contexts. Rendering
  // nothing is correct; throwing is not.
  const { calls } = bootstrap(null);
  assert.deepStrictEqual(calls, []);
});

test('cv-init.js does nothing when CVRenderer has not loaded yet', () => {
  const { calls } = bootstrap({ 'data-profile': 'cto' }, { withRenderer: false });
  assert.deepStrictEqual(calls, [], 'initCV ran without CVRenderer');
});

test('every CV shell declares a data-profile that resolves to a real profile', () => {
  const shells = cvShells();
  assert.ok(shells.length > 0, 'no CV shells found');

  for (const shell of shells) {
    const html = fs.readFileSync(shell, 'utf8');
    const m = html.match(/js\/cv-init\.js"([^>]*)>/);
    assert.ok(m, `${path.relative(ROOT, shell)}: does not load cv-init.js`);

    const profile = /data-profile="([^"]+)"/.exec(m[1]);
    assert.ok(profile, `${path.relative(ROOT, shell)}: cv-init.js tag has no data-profile`);
    assert.ok(
      CV_DATA.cvProfiles[profile[1]],
      `${path.relative(ROOT, shell)}: data-profile "${profile[1]}" is not a known profile`
    );
  }
});

test('engagement-format shells declare both data-format and data-base', () => {
  // The engagement renderer builds relative links, so a missing data-base
  // silently produces broken hrefs rather than an error.
  const offenders = [];
  let engagementCount = 0;

  for (const shell of cvShells()) {
    const html = fs.readFileSync(shell, 'utf8');
    const tag = /js\/cv-init\.js"([^>]*)>/.exec(html);
    if (!tag || !/data-format="engagement"/.test(tag[1])) continue;
    engagementCount += 1;
    if (!/data-base="[^"]+"/.test(tag[1])) {
      offenders.push(`${path.relative(ROOT, shell)}: engagement format without data-base`);
    }
  }

  assert.ok(engagementCount > 0, 'expected at least one engagement-format shell');
  assert.deepStrictEqual(offenders, [], 'Engagement shells missing data-base');
});

test('non-engagement shells do not pass a stray data-format', () => {
  const offenders = [];
  for (const shell of cvShells()) {
    const html = fs.readFileSync(shell, 'utf8');
    const tag = /js\/cv-init\.js"([^>]*)>/.exec(html);
    if (!tag) continue;
    const format = /data-format="([^"]+)"/.exec(tag[1]);
    if (format && format[1] !== 'engagement') {
      offenders.push(`${path.relative(ROOT, shell)}: unknown data-format "${format[1]}"`);
    }
  }
  assert.deepStrictEqual(offenders, [], 'Shells with an unsupported data-format');
});
