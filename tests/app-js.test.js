'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { ROOT } = require('./helpers');

const APP_JS = path.join(ROOT, 'js/app.js');
const INDEX_HTML = path.join(ROOT, 'index.html');

test('app.js is syntactically valid JavaScript', () => {
  const src = fs.readFileSync(APP_JS, 'utf8');
  assert.doesNotThrow(() => new vm.Script(src), 'app.js failed to parse');
});

test('every element ID referenced by app.js exists in index.html', () => {
  const js = fs.readFileSync(APP_JS, 'utf8');
  const html = fs.readFileSync(INDEX_HTML, 'utf8');
  const ids = [...js.matchAll(/getElementById\('([^']+)'\)/g)].map((m) => m[1]);
  assert.ok(ids.length >= 5, `expected several getElementById calls, found ${ids.length}`);
  for (const id of ids) {
    assert.ok(html.includes(`id="${id}"`), `index.html missing #${id} referenced by app.js`);
  }
});

test('app.js implements dark mode, mobile nav, scroll reveal, and footer year', () => {
  const js = fs.readFileSync(APP_JS, 'utf8');
  assert.match(js, /localStorage/, 'dark mode must persist to localStorage');
  assert.match(js, /data-theme/, 'dark mode must toggle data-theme');
  assert.match(js, /nav-burger/, 'mobile nav must reference #nav-burger');
  assert.match(js, /IntersectionObserver/, 'scroll reveal must use IntersectionObserver');
  assert.match(js, /getElementById\('year'\)/, 'footer year logic missing');
});

test('index.html contains the interactive hooks app.js depends on', () => {
  const html = fs.readFileSync(INDEX_HTML, 'utf8');
  for (const id of ['theme-toggle', 'theme-icon', 'nav-burger', 'nav-links', 'navbar', 'year']) {
    assert.ok(html.includes(`id="${id}"`), `index.html missing #${id}`);
  }
  assert.match(html, /class="[^"]*\breveal\b[^"]*"/, 'index.html missing .reveal elements');
  assert.ok(html.includes('nav-link'), 'index.html missing .nav-link elements');
});