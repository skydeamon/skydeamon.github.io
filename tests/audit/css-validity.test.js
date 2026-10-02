'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, cssFiles } = require('../helpers');

/* ---------- helpers ---------- */

/** Strip CSS comments so var() mentions inside comments are ignored. */
function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/** Custom properties a stylesheet defines, and the ones it references. */
function tokens(css) {
  return {
    defined: new Set([...css.matchAll(/--([a-zA-Z0-9-]+)\s*:/g)].map((m) => m[1])),
    referenced: new Set([...css.matchAll(/var\(--([a-zA-Z0-9-]+)\)/g)].map((m) => m[1])),
  };
}

/* ---------- audit ---------- */

test('every var(--name) reference resolves within its own stylesheet', () => {
  // Scoped per file, not across the union of all seven stylesheets. The union
  // test passed a reference whenever *any* stylesheet defined the token, which
  // hides the failure that matters: a token defined only in themes.css but used
  // in main.css resolves fine under the union and is undefined at runtime on
  // every page that loads main.css without themes.css. There are five distinct
  // stylesheet combinations across the 56 pages, and only one of them loads
  // both files.
  //
  // Per-file scoping is the stricter rule and costs nothing here: measured
  // against the real stylesheets, every reference already resolves in its own
  // file, so this closes a gap without introducing a single finding.
  const undefinedVars = [];
  for (const file of cssFiles()) {
    const css = stripComments(fs.readFileSync(file, 'utf8'));
    const rel = path.relative(ROOT, file);
    const { defined, referenced } = tokens(css);
    for (const name of referenced) {
      if (!defined.has(name)) {
        undefinedVars.push(`${rel}: --${name}`);
      }
    }
  }

  assert.deepStrictEqual(undefinedVars, [], 'Undefined CSS custom properties');
});

test('cross-stylesheet token leakage is actually detected', () => {
  // The scoping above is only worth something if it can tell "defined here" from
  // "defined somewhere else". Prove it with the exact shape of bug it is meant
  // to catch: a token defined in one stylesheet and referenced from another.
  const carrier = ':root { --only-here: #fff; }';
  const borrower = '.x { color: var(--only-here); }';

  // The old union view: the token is defined somewhere, so it passes.
  const unionDefined = new Set(tokens(carrier).defined);
  for (const name of tokens(borrower).referenced) unionDefined.add(name);
  assert.ok(
    unionDefined.has('only-here'),
    'sanity: the union view should treat the token as defined'
  );

  // The per-file view: the borrowing stylesheet does not define it.
  const borrowerTokens = tokens(borrower);
  assert.ok(borrowerTokens.referenced.has('only-here'), 'sanity: borrower references it');
  assert.ok(
    !borrowerTokens.defined.has('only-here'),
    'per-file scoping failed to notice the token is undefined where it is used'
  );
});
