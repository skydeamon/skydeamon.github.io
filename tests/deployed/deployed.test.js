'use strict';

// Live-deployment smoke tests against https://skydeamon.github.io.
// Skips gracefully when the network is unavailable.

const { test } = require('node:test');
const assert = require('node:assert');

const BASE = 'https://skydeamon.github.io';

async function fetchStatus(url) {
  const res = await fetch(url);
  return { status: res.status, text: await res.text() };
}

test('deployed homepage serves the new build', async (t) => {
  let result;
  try {
    result = await fetchStatus(`${BASE}/`);
  } catch {
    t.skip('network unavailable');
    return;
  }
  assert.strictEqual(result.status, 200, 'homepage status');
  assert.match(result.text, /Jade Makwela/, 'homepage title content');
  assert.match(result.text, /css\/main\.css/, 'homepage links main.css');
});

test('deployed consolidated CSS assets and portfolio pages return 200', async (t) => {
  const paths = [
    '/css/main.css',
    '/css/portfolio.css',
    '/css/themes.css',
    '/css/portfolio-hub.css',
    '/css/cv-minimal.css',
    '/portfolio/index.html',
    '/portfolio/audience/ai-engineer.html',
    '/portfolio/cv_modern.html',
    '/portfolio/cv_minimal.html',
  ];
  for (const p of paths) {
    let result;
    try {
      result = await fetchStatus(`${BASE}${p}`);
    } catch {
      t.skip(`network unavailable while checking ${p}`);
      return;
    }
    assert.strictEqual(result.status, 200, `${p} -> ${result.status}`);
  }
});