'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, htmlFiles, resolveRef } = require('./helpers');

// The "every internal href resolves to an existing file" test that used to live
// here has been removed. It walked `href="..."` with a bare regex and then did
// the same isLocalRef/resolveRef/existsSync sequence as references.test.js,
// which covers href, src and srcset through one extractor. Being a strict subset,
// it could never fail when the superset passed, so it was paying maintenance cost
// for no coverage. references.test.js now owns this.

test('every #anchor target exists in its destination page', () => {
  const missing = [];
  const wrongType = [];

  for (const file of htmlFiles()) {
    const content = fs.readFileSync(file, 'utf8');
    const re = /href="([^"]*#[^"]*)"/g;
    let m;
    while ((m = re.exec(content))) {
      const href = m[1];

      // Split on the FIRST '#' only. `split('#')` plus array destructuring
      // silently discarded everything after a second hash, so a link like
      // `page.html#top#section` was checked against "top" and the rest was
      // never examined.
      const hash = href.indexOf('#');
      const pathPart = href.slice(0, hash);
      const anchor = href.slice(hash + 1);
      if (!anchor) continue;

      const targetFile = pathPart ? resolveRef(file, pathPart) : file;
      if (!targetFile || !fs.existsSync(targetFile)) continue;

      // An anchor only means something in a document that can carry ids. The old
      // test read any target as utf8 and searched it, so a link to `notes.pdf#p3`
      // was reported as a missing id.
      if (!/\.html?$/i.test(targetFile)) {
        wrongType.push(
          `${path.relative(ROOT, file)} -> ${href} (anchor on a non-HTML target)`
        );
        continue;
      }

      const targetContent = fs.readFileSync(targetFile, 'utf8');

      // The id has to start at an attribute boundary. A substring check for
      // `id="nav"` is satisfied by `data-id="nav"`, so an anchor pointing at an
      // element that does not exist could pass.
      const escaped = anchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const hasId = new RegExp(`(?:^|\\s)id="${escaped}"(?:\\s|>)`).test(targetContent);

      if (!hasId) {
        missing.push(
          `${path.relative(ROOT, file)} -> #${anchor} (in ${pathPart || 'same page'})`
        );
      }
    }
  }

  assert.deepStrictEqual(missing, [], 'Anchors pointing at missing ids');
  assert.deepStrictEqual(wrongType, [], 'Anchors pointing at ids that cannot exist');
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