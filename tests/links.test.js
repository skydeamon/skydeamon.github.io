'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, htmlFiles, isLocalRef, resolveRef } = require('./helpers');

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

/* ---------- new setup: external link security ---------- */

test('every external link has target="_blank" and rel containing noopener', () => {
  const offenders = [];
  for (const file of htmlFiles()) {
    const content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(ROOT, file);
    const re = /<a\s[^>]*?href="(https?:\/\/[^"]+)"[^>]*>/g;
    let m;
    while ((m = re.exec(content))) {
      const tag = m[0];
      if (!/target="_blank"/.test(tag)) {
        offenders.push(`${rel}: ${m[1]} missing target="_blank"`);
      }
      if (!/rel="[^"]*noopener/.test(tag)) {
        offenders.push(`${rel}: ${m[1]} missing rel="noopener"`);
      }
    }
  }
  assert.deepStrictEqual(offenders, [], 'External links missing target/rel attributes');
});