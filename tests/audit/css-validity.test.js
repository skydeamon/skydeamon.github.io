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

/* ---------- audit ---------- */

test('every var(--name) reference resolves to a defined custom property', () => {
  // Arrange: collect every definition and every reference across all CSS files.
  const definitions = new Set();
  const references = new Map(); // var name -> Set of files referencing it
  for (const file of cssFiles()) {
    const css = stripComments(fs.readFileSync(file, 'utf8'));
    const rel = path.relative(ROOT, file);
    for (const m of css.matchAll(/--([a-zA-Z0-9-]+)\s*:/g)) {
      definitions.add(m[1]);
    }
    for (const m of css.matchAll(/var\(--([a-zA-Z0-9-]+)\)/g)) {
      if (!references.has(m[1])) references.set(m[1], new Set());
      references.get(m[1]).add(rel);
    }
  }

  // Act: find references with no definition anywhere in the CSS union.
  const undefinedVars = [];
  for (const [name, files] of references) {
    if (!definitions.has(name)) {
      undefinedVars.push(`${name} (referenced in ${[...files].join(', ')})`);
    }
  }

  // Assert
  assert.deepStrictEqual(undefinedVars, [], 'Undefined CSS custom properties');
});