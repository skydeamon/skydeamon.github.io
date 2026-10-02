'use strict';

/**
 * A minimal DOM good enough to execute the site's theme consumers under
 * node:test. The point is to assert behaviour — did the attribute change, did
 * storage get written, did the icon update — instead of grepping the source for
 * strings, which cannot tell a working call from a comment that mentions it.
 *
 * Deliberately not jsdom: these three files use a small, known slice of the
 * DOM API, and a hand-written stub keeps the failure messages legible.
 */

const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert');
const vm = require('node:vm');

const { ROOT } = require('../helpers');

/** An in-memory Storage that can be told to throw, like Safari private mode. */
function createStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    throwOnAccess: false,
    getItem(key) {
      if (this.throwOnAccess) throw new Error('SecurityError: storage disabled');
      return map.has(key) ? map.get(key) : null;
    },
    setItem(key, value) {
      if (this.throwOnAccess) throw new Error('SecurityError: storage disabled');
      map.set(key, String(value));
    },
    removeItem(key) {
      map.delete(key);
    },
    _dump: () => Object.fromEntries(map),
  };
}

class FakeClassList {
  constructor(initial = []) {
    this._set = new Set(initial);
  }
  add(...names) {
    for (const n of names) this._set.add(n);
  }
  remove(...names) {
    for (const n of names) this._set.delete(n);
  }
  contains(name) {
    return this._set.has(name);
  }
  toggle(name, force) {
    const shouldAdd = force === undefined ? !this._set.has(name) : Boolean(force);
    if (shouldAdd) this._set.add(name);
    else this._set.delete(name);
    return shouldAdd;
  }
  toString() {
    return [...this._set].join(' ');
  }
  get value() {
    return [...this._set].join(' ');
  }
}

class FakeElement {
  constructor(tag = 'div', attrs = {}) {
    this.tagName = tag.toUpperCase();
    this._attrs = { ...attrs };
    this.classList = new FakeClassList();
    this.children = [];
    this.childNodes = [];
    this.parentElement = null;
    this._listeners = new Map();
    this._text = '';
    this.innerHTML = '';
  }

  get className() {
    return this.classList.value;
  }
  set className(value) {
    this.classList = new FakeClassList(String(value).split(/\s+/).filter(Boolean));
  }

  get textContent() {
    return this._text;
  }
  set textContent(value) {
    this._text = String(value);
  }

  get lastChild() {
    return this.childNodes[this.childNodes.length - 1] || null;
  }

  getAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this._attrs, name) ? this._attrs[name] : null;
  }
  setAttribute(name, value) {
    this._attrs[name] = String(value);
  }
  removeAttribute(name) {
    delete this._attrs[name];
  }
  hasAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this._attrs, name);
  }

  appendChild(node) {
    // Mirrors the DOM split: `children` holds elements only, `childNodes`
    // holds everything. A text node placed in `children` would be handed to
    // querySelectorAll, which has no classList to match against.
    if (node.nodeType === 3) {
      this.childNodes.push(node);
      return node;
    }
    this.children.push(node);
    this.childNodes.push(node);
    node.parentElement = this;
    return node;
  }

  /** Model the browser focus model closely enough to assert focus moves. */
  focus() {
    this.ownerDocument.activeElement = this;
  }
  blur() {
    if (this.ownerDocument && this.ownerDocument.activeElement === this) {
      this.ownerDocument.activeElement = this.ownerDocument.body;
    }
  }
  addEventListener(type, handler) {
    if (!this._listeners.has(type)) this._listeners.set(type, []);
    this._listeners.get(type).push(handler);
  }
  removeEventListener(type, handler) {
    const list = this._listeners.get(type) || [];
    const i = list.indexOf(handler);
    if (i >= 0) list.splice(i, 1);
  }
  /** Test affordance: fire a listener synchronously. */
  dispatch(type, event = {}) {
    const handlers = this._listeners.get(type) || [];
    for (const h of handlers) h({ type, target: this, preventDefault() {}, ...event });
    return handlers.length;
  }
  listenerCount(type) {
    return (this._listeners.get(type) || []).length;
  }

  querySelectorAll(selector) {
    // Only `.class` and `#id` and tag selectors are needed by these files.
    const out = [];
    const walk = (el) => {
      for (const child of el.children) {
        if (matches(child, selector)) out.push(child);
        walk(child);
      }
    };
    walk(this);
    return out;
  }
  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }
  insertAdjacentHTML(_position, html) {
    this._insertedHTML = html;
  }
  print() {
    this._printed = true;
  }

  /** Test affordance: append a text node. */
  appendText(text) {
    return this.appendChild({ nodeType: 3, textContent: text });
  }
}

function matches(el, selector) {
  if (selector.startsWith('.')) return el.classList.contains(selector.slice(1));
  if (selector.startsWith('#')) return el.getAttribute('id') === selector.slice(1);
  return el.tagName === selector.toUpperCase();
}

/**
 * Build a document containing only the elements the given script needs.
 *
 * @param {object} options
 * @param {string[]} options.ids element ids to create
 * @param {string[]} options.classes wrap class names for extra querySelectorAll targets
 * @param {object} [options.htmlAttrs] attributes on <html>
 * @param {object} [options.bodyAttrs] attributes on <body>
 * @param {object} [options.storage] initial localStorage contents
 * @param {boolean} [options.withThemeStore] load the real ThemeStore first
 * @param {boolean} [options.storageThrows]
 * @param {boolean} [options.intersectionObserver] whether window exposes it
 */
function createHarness(options = {}) {
  const {
    ids = [],
    classes = [],
    htmlAttrs = {},
    bodyAttrs = {},
    storage: storageSeed = {},
    withThemeStore = true,
    storageThrows = false,
    intersectionObserver = true,
    children = {},
    attrs = {},
  } = options;

  const documentElement = new FakeElement('html', { ...htmlAttrs });
  const body = new FakeElement('body', { ...bodyAttrs });
  const byId = new Map();

  // focus()/blur() read ownerDocument.activeElement, so every element needs a
  // back-reference. Set it in the constructor hook rather than per call site.
  const ownerDocument = {
    documentElement,
    body,
    activeElement: null,
  };
  documentElement.ownerDocument = ownerDocument;
  body.ownerDocument = ownerDocument;

  for (const id of ids) {
    // Seed the attributes the real markup ships, so a test can tell the
    // difference between "app.js never set this" and "this was never in the
    // HTML to begin with".
    const el = new FakeElement('div', { id, ...(attrs[id] || {}) });
    el.ownerDocument = ownerDocument;
    byId.set(id, el);
    body.appendChild(el);
  }
  for (const cls of classes) {
    const el = new FakeElement('div');
    el.ownerDocument = ownerDocument;
    el.className = cls;
    body.appendChild(el);
  }

  // Class children nested under a named parent, so container-scoped lookups
  // such as `navLinks.querySelectorAll('.nav-link')` have something to find.
  for (const [parentId, childClasses] of Object.entries(children)) {
    const parent = byId.get(parentId);
    assert.ok(parent, `children: no element with id "${parentId}" to nest under`);
    for (const cls of childClasses) {
      const el = new FakeElement('a');
      el.ownerDocument = ownerDocument;
      el.className = cls;
      parent.appendChild(el);
    }
  }

  // A trailing text node on the toggle, so cv-render.js's `toggle.lastChild`
  // label write is exercised the way the real markup
  // `<button ...><span id="theme-icon">🌙</span> Dark</button>` exercises it.
  if (byId.has('theme-toggle')) {
    byId.get('theme-toggle').appendChild({ nodeType: 3, textContent: ' Dark' });
  }

  // A text node sibling, so theme.js's label-scan path is exercised.
  const labelTextNode = { nodeType: 3, textContent: ' Dark' };
  if (byId.has('theme-icon')) {
    const icon = byId.get('theme-icon');
    const holder = new FakeElement('button');
    holder.appendChild(icon);
    holder.appendChild(labelTextNode);
    byId.set('__theme-toggle-holder', holder);
  }

  const localStorage = createStorage(storageSeed);
  localStorage.throwOnAccess = Boolean(storageThrows);

  const document = {
    documentElement,
    body,
    activeElement: null,
    getElementById: (id) => byId.get(id) || null,
    querySelectorAll: (sel) => body.querySelectorAll(sel),
    _listeners: {},
    addEventListener(type, handler) {
      (this._listeners[type] = this._listeners[type] || []).push(handler);
    },
    /** Test affordance: mirror FakeElement#dispatch at the document level. */
    dispatch(type, event = {}) {
      const handlers = this._listeners[type] || [];
      for (const h of handlers) h({ type, target: this, preventDefault() {}, ...event });
      return handlers.length;
    },
    listenerCount(type) {
      return (this._listeners[type] || []).length;
    },
    currentScript: null,
  };

  // In a browser `window`, `self`, and the global object are all the SAME
  // object. That identity matters: a UMD wrapper writing `root.ThemeStore`
  // must leave `ThemeStore` reachable as a bare global, and code saying
  // `typeof CVRenderer === 'undefined'` must see a property set on `window`.
  // Modelling them as separate objects silently breaks both.
  const window = {
    document,
    localStorage,
    console,
    navigator: { userAgent: 'node' },
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    getComputedStyle: () => ({ getPropertyValue: () => '' }),
    setTimeout,
    Date,
    scrollY: 0,
    print: () => {
      window._printed = true;
    },
    addEventListener(type, handler) {
      (window._listeners[type] = window._listeners[type] || []).push(handler);
    },
    _listeners: {},
  };
  // focus() writes to ownerDocument.activeElement; point the ownerDocument at
  // the same object tests read, or focus assertions see a second document.
  for (const el of [documentElement, body, ...byId.values()]) {
    el.ownerDocument = document;
  }
  document.activeElement = document.body;

  if (intersectionObserver) {
    window.IntersectionObserver = function (cb) {
      this._cb = cb;
      this.observe = (el) => {
        (this._observed = this._observed || []).push(el);
      };
      this.unobserve = () => {};
    };
  }
  window.window = window;
  window.self = window;
  window.globalThis = window;

  const context = vm.createContext(window);

  if (withThemeStore) {
    runFile(path.join(ROOT, 'js/theme-store.js'), context);
  }

  return {
    context,
    window,
    document,
    localStorage,
    byId,
    html: documentElement,
    body,
    themeIcon: byId.get('theme-icon'),
    themeToggle: byId.get('theme-toggle'),
    run: (rel) => runFile(path.join(ROOT, rel), context),
    /** Assert-free read of the current on-page theme. */
    currentTheme: () => documentElement.getAttribute('data-theme'),
    storedTheme: () => localStorage._dump().theme,
    fire: (el, type) => el.dispatch(type),
  };
}

function runFile(file, context) {
  const code = fs.readFileSync(file, 'utf8');
  vm.runInContext(code, context, { filename: file });
}

module.exports = { createHarness, createStorage, FakeElement, FakeClassList, runFile };
