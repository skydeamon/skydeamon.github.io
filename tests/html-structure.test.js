'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, htmlFiles } = require('./helpers');

test('every HTML file has doctype, html, head, non-empty title, and body', () => {
  for (const file of htmlFiles()) {
    const content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(ROOT, file);
    assert.match(content, /<!DOCTYPE html>/i, `${rel}: missing doctype`);
    assert.match(content, /<html[\s>]/i, `${rel}: missing <html>`);
    assert.match(content, /<head[\s>]/i, `${rel}: missing <head>`);
    assert.match(content, /<title>[^<]+<\/title>/, `${rel}: missing non-empty <title>`);
    assert.match(content, /<body[\s>]/i, `${rel}: missing <body>`);
  }
});

test('root index.html contains all required page sections', () => {
  const content = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  for (const id of ['home', 'about', 'experience', 'projects', 'skills', 'audience', 'contact']) {
    assert.ok(content.includes(`id="${id}"`), `index.html missing section #${id}`);
  }
});

test('root index.html links the main stylesheet and app script', () => {
  const content = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  assert.match(content, /css\/main\.css/, 'index.html missing css/main.css');
  assert.match(content, /js\/app\.js/, 'index.html missing js/app.js');
});

/* ---------- meta completeness (new setup) ---------- */

test('every HTML file has charset, viewport, and description meta', () => {
  for (const file of htmlFiles()) {
    const content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(ROOT, file);
    assert.match(content, /<meta charset=["']UTF-8["']/i, `${rel}: missing charset meta`);
    assert.match(content, /<meta name="viewport"/, `${rel}: missing viewport meta`);
    assert.match(content, /<meta name="description" content="[^"]+"/, `${rel}: missing description meta`);
  }
});

test('every HTML file has lang="en" on the html element', () => {
  for (const file of htmlFiles()) {
    const content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(ROOT, file);
    assert.match(content, /<html[^>]*lang="en"/, `${rel}: missing lang="en"`);
  }
});

test('every HTML file has exactly one h1 (renderer pages get it via JS)', () => {
  for (const file of htmlFiles()) {
    const content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(ROOT, file);
    const h1s = content.match(/<h1[ >]/g) ?? [];
    const isRendererPage = content.includes('cv-render.js');
    if (isRendererPage) {
      assert.strictEqual(h1s.length, 0, `${rel}: renderer page should not hardcode h1`);
      assert.ok(content.includes('id="cv-root"'), `${rel}: renderer page missing #cv-root`);
    } else {
      assert.strictEqual(h1s.length, 1, `${rel}: expected 1 h1, found ${h1s.length}`);
    }
  }
});

test('every HTML file has a valid heading hierarchy (no level skips)', () => {
  for (const file of htmlFiles()) {
    const content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(ROOT, file);
    const levels = [...content.matchAll(/<h([1-6])[ >]/g)].map((m) => Number(m[1]));
    let prev = 0;
    for (const level of levels) {
      assert.ok(
        level <= prev + 1,
        `${rel}: heading skip h${prev} -> h${level}`
      );
      prev = level;
    }
  }
});

test('portfolio hub uses h2 category titles (no h1 -> h3 skip)', () => {
  const content = fs.readFileSync(path.join(ROOT, 'portfolio', 'index.html'), 'utf8');
  const levels = [...content.matchAll(/<h([1-6])[ >]/g)].map((m) => Number(m[1]));
  assert.deepStrictEqual(levels.slice(0, 3), [1, 2, 3], 'hub should start h1 -> h2 -> h3');
  assert.ok(content.includes('<h2 class="category-title">'), 'hub missing h2 category titles');
});