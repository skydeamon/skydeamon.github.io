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

/**
 * Every stylesheet and page the working tree actually declares. Deriving the
 * list means a new asset cannot ship without being smoke-tested, and a deleted
 * one cannot linger in the expectations.
 */
function declaredAssetPaths() {
  const paths = new Set();
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (/\.(css|html)$/.test(entry.name)) {
        const rel = `/${path.relative(ROOT, full).split(path.sep).join('/')}`;
        if (!/index\.html$/.test(rel)) paths.add(rel);
      }
    }
  };
  for (const dir of ['css', 'portfolio']) walk(path.join(ROOT, dir));
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
  assert.ok(paths.length > 20, `expected a real asset inventory, found ${paths.length}`);

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
