'use strict';

const { test, expect } = require('@playwright/test');
const path = require('node:path');
const { ROOT, htmlFiles } = require('../helpers');

// Every page of the site, derived from disk: each .html file becomes a URL.
// ROOT/index.html maps to '/', everything else to '/' + repo-relative path.
// This reuses the same walk/skip logic as tests/helpers.js (.git, .opencode,
// node_modules, testenv are excluded), so new pages are picked up automatically.
const PAGES = htmlFiles().map((file) => {
  const rel = path.relative(ROOT, file);
  return rel === 'index.html' ? '/' : '/' + rel.split(path.sep).join('/');
});

for (const url of PAGES) {
  test(`no console errors or failed requests on ${url}`, async ({ page }) => {
    const problems = [];
    page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`));
    page.on('requestfailed', (req) =>
      problems.push(`requestfailed: ${req.url()} ${req.failure()?.errorText ?? ''}`)
    );
    page.on('response', (res) => {
      if (res.status() >= 400) problems.push(`http ${res.status()}: ${res.url()}`);
    });

    await page.goto(url, { waitUntil: 'networkidle' });
    expect(problems).toEqual([]);
  });
}