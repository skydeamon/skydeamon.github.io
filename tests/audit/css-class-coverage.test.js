'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, htmlFiles } = require('../helpers');

/**
 * Class-coverage guard.
 *
 * Every class referenced in markup must resolve to at least one real CSS rule,
 * and the navbar logo lockup must stay a TOP-LEVEL rule (column-1 selector),
 * NOT grafted inside another selector block. This is the permanent guard for
 * the Batch-1 regression where `.nav-logo` was nested inside `.nav-brand:hover`
 * (rendering the logo at natural 800x200 size — "too big").
 */

const GUARDED_CLASSES = [
  'nav-brand', // HIGH: navbar lockup
  'nav-logo', // HIGH: logo lockup — must stay top-level + sized
  'hero-content', // HIGH: hero lockup
  'impact-stat', // HIGH: impact stat
  'project-top', // HIGH: project head
];

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/** Every `.name` token in the CSS (used as the set of "resolves" rules). */
function classSelectors(css) {
  const set = new Set();
  for (const m of css.matchAll(/\.([a-zA-Z][\w-]*)/g)) set.add(m[1]);
  return set;
}

test('every guarded class resolves to a CSS rule in css/main.css', () => {
  const css = stripComments(fs.readFileSync(path.join(ROOT, 'css/main.css'), 'utf8'));
  const covered = classSelectors(css);
  const missing = GUARDED_CLASSES.filter((c) => !covered.has(c));
  assert.deepStrictEqual(missing, [], 'guarded classes with no CSS rule');
});

test('.nav-logo is sized from a fixed height, never an auto/intrinsic height', () => {
  const css = stripComments(fs.readFileSync(path.join(ROOT, 'css/main.css'), 'utf8'));
  const rule = css.match(/\.nav-logo \{([\s\S]*?)\}/);

  assert.ok(rule, '.nav-logo rule must exist');

  const body = rule[1];

  // The source PNG is 800x200. `height: auto` renders it at its full 200px
  // intrinsic height; `max-height` alone only caps it, so the rendered size
  // depends on the asset rather than on a declared value. Require a fixed
  // pixel height as the sizing mechanism.
  const height = body.match(/(?:^|;)\s*height\s*:\s*([^;]+);/);
  assert.ok(height, '.nav-logo must declare an explicit height');
  assert.match(
    height[1].trim(),
    /^\d+px$/,
    `.nav-logo height must be a fixed px value, got "${height[1].trim()}" (auto/intrinsic sizing is the regression)`
  );
});

test('.nav-logo lockup is a top-level rule (not nested inside .nav-brand:hover)', () => {
  const css = stripComments(fs.readFileSync(path.join(ROOT, 'css/main.css'), 'utf8'));
  const lines = css.split('\n');

  const idx = lines.findIndex((l) => l.trim() === '.nav-logo {');
  assert.notStrictEqual(idx, -1, '.nav-logo rule must exist');

  // Selector must start at column 1 (top level), never indented (nested).
  assert.match(lines[idx], /^\.nav-logo \{/, '.nav-logo selector must start at column 1');

  // Everything above the rule must be brace-balanced (net 0) -> the rule is top-level.
  let net = 0;
  for (let i = 0; i < idx; i++) {
    net += (lines[i].match(/\{/g) || []).length;
    net -= (lines[i].match(/\}/g) || []).length;
  }
  assert.strictEqual(net, 0, 'rules above .nav-logo must be brace-balanced (logo is top-level)');

  // Exactly one copy of the lockup rule.
  const matches = css.match(/\.nav-logo \{[\s\S]*?\}/g) || [];
  assert.strictEqual(matches.length, 1, 'exactly one .nav-logo rule');
});
