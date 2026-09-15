'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

const CV_DATA = require(path.join(__dirname, '..', '..', 'js', 'cv-data.js'));
const CVRenderer = require(path.join(__dirname, '..', '..', 'js', 'cv-render.js'));

/* ---------- minimal fake DOM ---------- */

// initCV touches: window.CV_DATA, document.body, document.documentElement,
// document.getElementById('cv-root'|'theme-toggle'|'theme-icon'|'print-btn'),
// and localStorage (guarded by try/catch). This fake covers exactly that surface.
function makeFakeDom() {
  const body = {
    _attrs: {},
    setAttribute(name, value) { this._attrs[name] = value; },
    getAttribute(name) { return this._attrs[name] ?? null; },
  };
  const documentElement = {
    _attrs: {},
    setAttribute(name, value) { this._attrs[name] = value; },
    getAttribute(name) { return this._attrs[name] ?? null; },
  };
  const root = {
    innerHTML: '',
    insertAdjacentHTML() {},
  };
  const elements = { 'cv-root': root };
  return {
    body,
    documentElement,
    root,
    document: {
      body,
      documentElement,
      getElementById(id) { return elements[id] ?? null; },
    },
  };
}

function setupGlobals(fake, cvData) {
  const previous = {
    window: global.window,
    document: global.document,
    localStorage: global.localStorage,
  };
  global.window = { CV_DATA: cvData };
  global.document = fake.document;
  global.localStorage = { getItem: () => null, setItem: () => {} };
  return function restore() {
    if (previous.window === undefined) delete global.window;
    else global.window = previous.window;
    if (previous.document === undefined) delete global.document;
    else global.document = previous.document;
    if (previous.localStorage === undefined) delete global.localStorage;
    else global.localStorage = previous.localStorage;
  };
}

/* ---------- initCV theme wiring ---------- */

test('initCV sets document.body data-theme from profile.theme', () => {
  // Arrange
  const fake = makeFakeDom();
  const restore = setupGlobals(fake, CV_DATA);
  try {
    // Act
    CVRenderer.initCV('ai_engineer');
    // Assert
    assert.strictEqual(fake.body.getAttribute('data-theme'), 'ai-engineer');
  } finally {
    restore();
  }
});

test('initCV leaves body data-theme unset when the profile has no theme', () => {
  // Arrange — the current implementation has no fallback: `if (profile.theme)`
  // simply skips setAttribute, so data-theme stays null (no "general" default).
  const fake = makeFakeDom();
  const noThemeData = {
    ...CV_DATA,
    cvProfiles: {
      no_theme: { ...CV_DATA.cvProfiles.job_application, theme: undefined },
    },
  };
  const restore = setupGlobals(fake, noThemeData);
  try {
    // Act
    CVRenderer.initCV('no_theme');
    // Assert
    assert.strictEqual(fake.body.getAttribute('data-theme'), null);
  } finally {
    restore();
  }
});