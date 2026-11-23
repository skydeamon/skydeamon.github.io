'use strict';

// Live-deployment smoke tests against https://skydeamon.github.io.
//
// Two properties matter here, and the previous version had neither:
//
//  1. A network failure mid-run must not discard the checks that already
//     passed. The old loop called t.skip() and returned on the first fetch
//     error, so a blip on the third URL silently "passed" the other eight.
//     Reachability is now probed once, and then every URL is checked and the
//     failures reported together.
//
//  2. The deployed build must match the working tree. Serving a stale bundle is
//     the failure mode these tests exist to catch, and nothing asserted it.

const { test, before } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT } = require('../helpers');

const CV_DATA = require(path.join(ROOT, 'js', 'cv-data.js'));

const BASE = process.env.DEPLOY_BASE || 'https://skydeamon.github.io';

/** Probe once so a genuine outage skips the suite instead of half-running it. */
let reachable = false;
let unreachableReason = null;

before(async () => {
  try {
    const res = await fetch(`${BASE}/`, { signal: AbortSignal.timeout(15000) });
    reachable = res.ok;
    if (!res.ok) unreachableReason = `${BASE}/ responded ${res.status}`;
  } catch (err) {
    unreachableReason = err.message;
  }
});

function requireNetwork(t) {
  if (!reachable) {
    t.skip(`network unavailable: ${unreachableReason}`);
    return false;
  }
  return true;
}

async function getStatus(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  // Drain the body so the connection is not left open.
  await res.arrayBuffer();
  return res.status;
}

async function getResponse(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  const body = Buffer.from(await res.arrayBuffer());
  return { res, body };
}

/**
 * Every deployable file the working tree actually contains. Deriving the list
 * means a new asset cannot ship without being smoke-tested, and a deleted one
 * cannot linger in the expectations.
 *
 * The old walker only covered HTML and CSS under portfolio/, which is why the
 * certificate PDFs — the exact assets added by the platform-engineering
 * branch — were invisible to the deployed suite. JS, images, fonts, PDFs, and
 * the root-level robots/sitemap files are all part of the deployed surface.
 */
const ASSET_EXTENSIONS = /\.(?:html|css|js|pdf|png|jpe?g|webp|gif|svg|ico|woff2?|ttf|eot|xml|txt)$/i;
const ASSET_DIRS = ['css', 'portfolio', 'js', 'images', 'fontawesome', 'certificates'];
const ROOT_ASSETS = ['index.html', '404.html', 'robots.txt', 'sitemap.xml'];

function declaredAssetPaths() {
  const paths = new Set();

  const add = (full) => {
    const rel = `/${path.relative(ROOT, full).split(path.sep).join('/')}`;
    paths.add(rel);
  };

  for (const rel of ROOT_ASSETS) {
    const full = path.join(ROOT, rel);
    if (fs.existsSync(full)) add(full);
  }

  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (ASSET_EXTENSIONS.test(entry.name)) add(full);
    }
  };

  for (const dir of ASSET_DIRS) {
    const full = path.join(ROOT, dir);
    if (fs.existsSync(full)) walk(full);
  }

  return [...paths].sort();
}

test('deployed homepage serves the new build', async (t) => {
  if (!requireNetwork(t)) return;

  const res = await fetch(`${BASE}/`);
  const text = await res.text();

  assert.strictEqual(res.status, 200, 'homepage status');
  assert.match(text, /Jade Makwela/, 'homepage title content');
  assert.match(text, /css\/main\.css/, 'homepage links main.css');
});

test('deployed serves every asset and page the working tree declares', async (t) => {
  if (!requireNetwork(t)) return;

  const paths = declaredAssetPaths();
  assert.ok(paths.length > 50, `expected a real asset inventory, found ${paths.length}`);

  // Check everything, then assert. A failure on one URL must not mask the
  // status of the rest.
  const failures = await Promise.all(
    paths.map(async (p) => ({ p, status: await getStatus(`${BASE}${p}`) }))
  );

  const broken = failures.filter((f) => f.status !== 200);
  assert.deepStrictEqual(
    broken.map((f) => `${f.p} -> ${f.status}`),
    [],
    'Deployed assets returning a non-200 status'
  );
});

test('deployed certificate PDFs are live, downloadable, and served as PDFs', async (t) => {
  if (!requireNetwork(t)) return;

  const certifications = CV_DATA.certifications.filter((cert) => cert.link);
  assert.ok(certifications.length > 0, 'no linked certificates in the CV data');

  const failures = [];

  for (const cert of certifications) {
    const url = `${BASE}/${cert.link}`;
    const { res, body } = await getResponse(url);
    const contentType = res.headers.get('content-type') || '';

    if (res.status !== 200) {
      failures.push(`${url}: status ${res.status}`);
      continue;
    }
    if (!/^application\/pdf\b/i.test(contentType)) {
      failures.push(`${url}: content-type "${contentType}"`);
    }
    if (body.subarray(0, 5).toString('ascii') !== '%PDF-') {
      failures.push(`${url}: body is not a PDF`);
    }
    if (body.length < 1024) {
      failures.push(`${url}: only ${body.length} bytes`);
    }
  }

  assert.deepStrictEqual(failures, [], 'Certificate PDF deployment failures');
});

test('deployed .js, .css, .pdf, and .xml assets use the expected content types', async (t) => {
  if (!requireNetwork(t)) return;

  const checks = [
    { path: '/js/theme-store.js', match: /(?:javascript|ecmascript)/i },
    { path: '/css/main.css', match: /text\/css/i },
    { path: '/sitemap.xml', match: /(?:application|text)\/xml/i },
  ];

  for (const cert of CV_DATA.certifications.filter((entry) => entry.link)) {
    checks.push({ path: `/${cert.link}`, match: /application\/pdf/i });
  }

  const failures = [];

  for (const { path: assetPath, match } of checks) {
    const { res } = await getResponse(`${BASE}${assetPath}`);
    const contentType = res.headers.get('content-type') || '';
    if (res.status !== 200) failures.push(`${assetPath}: status ${res.status}`);
    else if (!match.test(contentType)) failures.push(`${assetPath}: content-type "${contentType}"`);
  }

  assert.deepStrictEqual(failures, [], 'Deployed content-type failures');
});

test('deployed build is the consolidated theme architecture', async (t) => {
  if (!requireNetwork(t)) return;

  // The pre-paint entry point must exist on the live site...
  assert.strictEqual(
    await getStatus(`${BASE}/js/theme-store.js`),
    200,
    'js/theme-store.js is not deployed'
  );

  // ...and the files it replaced must be gone, or a stale page could still
  // load the old, unvalidated implementation.
  for (const removed of ['/js/theme-init.js', '/js/site-logic.js']) {
    assert.strictEqual(
      await getStatus(`${BASE}${removed}`),
      404,
      `${removed} is still deployed; the consolidation did not ship`
    );
  }

  const home = await (await fetch(`${BASE}/`)).text();
  assert.match(home, /js\/theme-store\.js/, 'deployed homepage does not load theme-store.js');
  assert.doesNotMatch(home, /js\/theme-init\.js/, 'deployed homepage still loads theme-init.js');
});

test('deployed pages load theme-store before any stylesheet', async (t) => {
  if (!requireNetwork(t)) return;

  // The pre-paint ordering that prevents the light flash, checked against the
  // bytes the server actually sends.
  const pages = ['/', '/portfolio/index.html', '/portfolio/cv/modern.html'];
  const wrong = [];

  for (const p of pages) {
    const text = await (await fetch(`${BASE}${p}`)).text();
    const storeAt = text.indexOf('theme-store.js');
    const cssAt = text.search(/<link[^>]+stylesheet/i);
    if (storeAt === -1) {
      wrong.push(`${p}: theme-store.js is not referenced`);
    } else if (cssAt !== -1 && storeAt > cssAt) {
      wrong.push(`${p}: first stylesheet precedes theme-store.js`);
    }
  }

  assert.deepStrictEqual(wrong, [], 'Deployed pages lost pre-paint theme ordering');
});
