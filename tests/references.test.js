'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { htmlFiles, cssFiles, extractLocalRefs, isLocalRef, resolveRef } = require('./helpers');

test('every local href/src/srcset in HTML files resolves to an existing file', () => {
  const missing = [];
  for (const file of htmlFiles()) {
    for (const ref of extractLocalRefs(file)) {
      if (!isLocalRef(ref)) continue;
      const target = resolveRef(file, ref);
      if (target && !fs.existsSync(target)) missing.push(`${path.relative(process.cwd(), file)} -> ${ref}`);
    }
  }
  assert.deepStrictEqual(missing, [], 'Missing referenced files');
});

test('every url() in CSS files resolves to an existing file', () => {
  const missing = [];
  for (const file of cssFiles()) {
    const content = fs.readFileSync(file, 'utf8');
    const re = /url\(([^)]*)\)/g;
    let m;
    while ((m = re.exec(content))) {
      let ref = m[1].trim().replace(/^["']|["']$/g, '');
      ref = ref.split('?')[0].split('#')[0];
      if (!ref || /^(https?:|data:)/.test(ref)) continue;
      const target = path.resolve(path.dirname(file), ref);
      if (!fs.existsSync(target)) missing.push(`${path.relative(process.cwd(), file)} -> ${ref}`);
    }
  }
  assert.deepStrictEqual(missing, [], 'Missing CSS url() targets');
});