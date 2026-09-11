'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

const SiteLogic = require(path.join(__dirname, '..', '..', 'js', 'site-logic.js'));

/* ---------- getInitialTheme ---------- */

test('getInitialTheme returns stored theme when present', () => {
  // Arrange / Act / Assert
  assert.strictEqual(SiteLogic.getInitialTheme('dark', false), 'dark');
  assert.strictEqual(SiteLogic.getInitialTheme('light', true), 'light');
});

test('getInitialTheme falls back to system dark when nothing stored', () => {
  assert.strictEqual(SiteLogic.getInitialTheme(null, true), 'dark');
  assert.strictEqual(SiteLogic.getInitialTheme('', true), 'dark');
});

test('getInitialTheme returns null when no stored theme and system is light', () => {
  assert.strictEqual(SiteLogic.getInitialTheme(null, false), null);
  assert.strictEqual(SiteLogic.getInitialTheme('', false), null);
});

test('getInitialTheme prefers stored theme over system preference', () => {
  assert.strictEqual(SiteLogic.getInitialTheme('light', true), 'light');
  assert.strictEqual(SiteLogic.getInitialTheme('dark', false), 'dark');
});

/* ---------- computeNextTheme ---------- */

test('computeNextTheme flips dark to light', () => {
  assert.strictEqual(SiteLogic.computeNextTheme('dark'), 'light');
});

test('computeNextTheme flips light to dark', () => {
  assert.strictEqual(SiteLogic.computeNextTheme('light'), 'dark');
});

test('computeNextTheme treats missing/unknown current as light (defaults to dark)', () => {
  assert.strictEqual(SiteLogic.computeNextTheme(null), 'dark');
  assert.strictEqual(SiteLogic.computeNextTheme(undefined), 'dark');
  assert.strictEqual(SiteLogic.computeNextTheme(''), 'dark');
});

/* ---------- themeIconClass ---------- */

test('themeIconClass returns sun icon when dark', () => {
  assert.strictEqual(SiteLogic.themeIconClass(true), 'fas fa-sun');
});

test('themeIconClass returns moon icon when light', () => {
  assert.strictEqual(SiteLogic.themeIconClass(false), 'fas fa-moon');
});

/* ---------- module shape ---------- */

test('SiteLogic exposes exactly the public API', () => {
  assert.deepStrictEqual(Object.keys(SiteLogic).sort(), [
    'computeNextTheme',
    'getInitialTheme',
    'themeIconClass',
  ]);
});