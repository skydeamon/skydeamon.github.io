'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, htmlFiles } = require('../helpers');

// Any <script> without a src= attribute is an inline script.
// JSON-LD structured data (type="application/ld+json") is data, not JavaScript,
// so it is exempt from the "all JS must be external files" rule.
const INLINE_SCRIPT_RE = /<script(?![^>]*src=)(?![^>]*type=["']application\/ld\+json["'])/g;

/* ---------- audit ---------- */

test('no inline <script> blocks — all JS must be external files', () => {
  // Arrange / Act
  const offenders = [];
  for (const file of htmlFiles()) {
    const content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(ROOT, file);
    const matches = content.match(INLINE_SCRIPT_RE) || [];
    if (matches.length > 0) {
      offenders.push(`${rel}: ${matches.length} inline <script> block(s)`);
    }
  }
  // Assert
  assert.deepStrictEqual(offenders, [], 'Inline <script> blocks found');
});