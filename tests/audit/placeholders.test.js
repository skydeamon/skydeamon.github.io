'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, htmlFiles } = require('../helpers');

// Square-bracket placeholders such as [Company Name], [Position Title], [Date].
const PLACEHOLDER_RE = /\[[A-Za-z][^\]\n]*\]/g;

/* ---------- audit ---------- */

test('square-bracket placeholders only appear in portfolio/cover-letters/', () => {
  // Arrange / Act
  const offenders = [];
  for (const file of htmlFiles()) {
    const rel = path.relative(ROOT, file);
    // Cover letters are intentionally templated.
    if (rel.startsWith('portfolio/cover-letters/')) continue;
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(PLACEHOLDER_RE) || [];
    if (matches.length > 0) {
      offenders.push(`${rel}: ${matches.join(', ')}`);
    }
  }
  // Assert
  assert.deepStrictEqual(offenders, [], 'Placeholders outside portfolio/cover-letters/');
});