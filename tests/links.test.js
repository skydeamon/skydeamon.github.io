'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { htmlFiles, isLocalRef, resolveRef } = require('./helpers');

test('every internal href resolves to an existing file', () => {
  const missing = [];
  for (const file of htmlFiles()) {
    const content = fs.readFileSync(file, 'utf8');
    const re = /href="([^"]*)"/g;
    let m;
    while ((m = re.exec(content))) {
      const ref = m[1];
      if (!isLocalRef(ref)) continue;
      const target = resolveRef(file, ref);
      if (target && !fs.existsSync(target)) missing.push(`${path.relative(process.cwd(), file)} -> ${ref}`);
    }
  }
  assert.deepStrictEqual(missing, [], 'Broken internal hrefs');
});

test('every #anchor target exists in its destination page', () => {
  const missing = [];
  for (const file of htmlFiles()) {
    const content = fs.readFileSync(file, 'utf8');
    const re = /href="([^"]*#[^"]*)"/g;
    let m;
    while ((m = re.exec(content))) {
      const [pathPart, anchor] = m[1].split('#');
      if (!anchor) continue;
      const targetFile = pathPart ? resolveRef(file, pathPart) : file;
      if (!targetFile || !fs.existsSync(targetFile)) continue;
      const targetContent = fs.readFileSync(targetFile, 'utf8');
      if (!targetContent.includes(`id="${anchor}"`)) {
        missing.push(`${path.relative(process.cwd(), file)} -> #${anchor} (in ${pathPart || 'same page'})`);
      }
    }
  }
  assert.deepStrictEqual(missing, [], 'Anchors pointing at missing ids');
});