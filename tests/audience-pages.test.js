'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const AUDIENCE_DIR = path.join(__dirname, '..', 'portfolio', 'audience');
const PAGES = fs
  .readdirSync(AUDIENCE_DIR)
  .filter((f) => f.endsWith('.html'))
  .sort();

function readPage(name) {
  return fs.readFileSync(path.join(AUDIENCE_DIR, name), 'utf-8');
}

/* ---------- heading validity ---------- */

test('every audience page has no h4 headings', () => {
  for (const name of PAGES) {
    const content = readPage(name);
    assert.ok(!/<h4[ >]/.test(content), `${name}: contains <h4> opening tag`);
    assert.ok(!/<\/h4>/.test(content), `${name}: contains </h4> closing tag`);
  }
});

test('every audience page has balanced heading tags', () => {
  for (const name of PAGES) {
    const content = readPage(name);
    const count = (re) => (content.match(re) ?? []).length;
    assert.strictEqual(count(/<h2[ >]/g), count(/<\/h2>/g), `${name}: unbalanced <h2>`);
    assert.strictEqual(count(/<h3[ >]/g), count(/<\/h3>/g), `${name}: unbalanced <h3>`);
  }
});

test('every audience page has no mismatched heading closures', () => {
  for (const name of PAGES) {
    const content = readPage(name);
    const mismatched = content.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/g) ?? [];
    for (const tag of mismatched) {
      const open = tag.match(/<h([1-6])/)[1];
      const close = tag.match(/<\/h([1-6])>/)[1];
      assert.strictEqual(open, close, `${name}: mismatched heading tag "${tag}"`);
    }
  }
});

/* ---------- section completeness ---------- */

test('every audience page declares Experience and Education', () => {
  for (const name of PAGES) {
    const content = readPage(name);
    const hasExperience = /section-title">Experience/.test(content) || /section-title">Experience Timeline/.test(content);
    const hasEducation = /section-title">Education/.test(content);
    assert.ok(hasExperience, `${name}: missing Experience section`);
    assert.ok(hasEducation, `${name}: missing Education section`);
  }
});

test('every audience page declares at least one skills section', () => {
  for (const name of PAGES) {
    const content = readPage(name);
    const hasSkills = /section-title">[^<]*Skills/.test(content) || /section-title">Services Offered/.test(content) || /skill-bar/.test(content);
    assert.ok(hasSkills, `${name}: missing skills section`);
  }
});

test('data-engineer page declares Experience and Impact Highlights', () => {
  const content = readPage('data-engineer.html');
  assert.ok(/section-title">Experience/.test(content), 'data-engineer: missing Experience');
  assert.ok(/section-title">Impact Highlights/.test(content), 'data-engineer: missing Impact Highlights');
});

/* ---------- meta completeness (new setup) ---------- */

test('every audience page has charset, viewport, and description meta', () => {
  for (const name of PAGES) {
    const content = readPage(name);
    assert.match(content, /<meta charset=["']UTF-8["']/i, `${name}: missing charset`);
    assert.match(content, /<meta name="viewport"/, `${name}: missing viewport`);
    assert.match(content, /<meta name="description" content="[^"]+"/, `${name}: missing description`);
  }
});

test('every audience page title starts with "Jade Makwela"', () => {
  for (const name of PAGES) {
    const content = readPage(name);
    const title = content.match(/<title>([^<]+)<\/title>/)?.[1] ?? '';
    assert.ok(title.startsWith('Jade Makwela'), `${name}: title "${title}" does not start with "Jade Makwela"`);
  }
});

test('every audience page has valid heading hierarchy (no skips)', () => {
  for (const name of PAGES) {
    const content = readPage(name);
    const levels = [...content.matchAll(/<h([1-6])[ >]/g)].map((m) => Number(m[1]));
    let prev = 0;
    for (const level of levels) {
      assert.ok(level <= prev + 1, `${name}: heading skip h${prev} -> h${level}`);
      prev = level;
    }
  }
});

test('every audience page has exactly one h1', () => {
  for (const name of PAGES) {
    const content = readPage(name);
    const h1s = content.match(/<h1[ >]/g) ?? [];
    assert.strictEqual(h1s.length, 1, `${name}: expected 1 h1, found ${h1s.length}`);
  }
});

/* ---------- navigation (new setup) ---------- */

test('every audience page has "← CVs" and "Home" nav links', () => {
  for (const name of PAGES) {
    const content = readPage(name);
    assert.ok(content.includes('← CVs'), `${name}: missing "← CVs" link`);
    assert.ok(/href="\.\.\/\.\.\/index\.html"/.test(content), `${name}: missing Home link to ../../index.html`);
  }
});

test('every audience page has consistent contact info', () => {
  const EMAIL = 'makwela.j.justice@gmail.com';
  const LINKEDIN = 'linkedin.com/in/jade-makwela-6a79111a8';
  const GITHUB = 'github.com/skydeamon';
  for (const name of PAGES) {
    const content = readPage(name);
    assert.ok(content.includes(`mailto:${EMAIL}`), `${name}: missing email`);
    assert.ok(content.includes(LINKEDIN), `${name}: missing LinkedIn`);
    assert.ok(content.includes(GITHUB), `${name}: missing GitHub`);
  }
});