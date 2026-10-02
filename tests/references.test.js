'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, htmlFiles, cssFiles, extractLocalRefs, isLocalRef, resolveRef } = require('./helpers');

/** The origin this site is published under, used to recognise self-references. */
const SITE_ORIGIN = 'https://skydeamon.github.io';

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

test('every og:image and twitter:image points at a file that exists', () => {
  // These are invisible to the href/src/srcset walk above, because they live in a
  // meta content attribute rather than a src, and they are absolute URLs to our
  // own origin, which isLocalRef skips as external. Nothing else checked them, so
  // images/profile/social.jpg — the one asset every social share preview depends
  // on — could be deleted and the whole suite would stay green.
  const missing = [];
  const seen = [];

  for (const file of htmlFiles()) {
    const content = fs.readFileSync(file, 'utf8');
    const re = /<meta[^>]+(?:property|name)\s*=\s*["'](og:image|twitter:image)["'][^>]*>/gi;
    let m;
    while ((m = re.exec(content))) {
      const tag = m[0];
      const kind = m[1].toLowerCase();
      const url = /content\s*=\s*["']([^"']+)["']/i.exec(tag);
      if (!url) {
        missing.push(`${path.relative(ROOT, file)}: ${kind} has no content attribute`);
        continue;
      }

      const ref = url[1].trim();
      seen.push(`${path.relative(ROOT, file)}: ${kind}`);

      // Only same-origin URLs name a file in this repository. A third-party
      // image (a CDN, a placeholder service) is somebody else's to keep.
      const isAbsolute = /^https?:\/\//i.test(ref);
      if (isAbsolute && !ref.toLowerCase().startsWith(`${SITE_ORIGIN}/`)) continue;

      const localRef = isAbsolute ? ref.slice(SITE_ORIGIN.length + 1) : ref.replace(/^\//, '');
      if (!localRef) continue;

      const target = path.join(ROOT, decodeURIComponent(localRef.split('?')[0].split('#')[0]));
      if (!fs.existsSync(target)) {
        missing.push(`${path.relative(ROOT, file)}: ${kind} -> ${ref} (no such file)`);
      }
    }
  }

  // Guard against the walk silently finding nothing, which is how this class of
  // check goes green while asserting nothing.
  assert.ok(seen.length > 0, 'no og:image/twitter:image tags found; is the extractor wrong?');
  assert.deepStrictEqual(missing, [], 'Social preview images that do not exist');
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