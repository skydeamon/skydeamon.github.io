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