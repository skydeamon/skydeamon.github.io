'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, htmlFiles } = require('../helpers');

/* ---------- curated tag sets ---------- */

// Container tags that must appear balanced (open + close) in every HTML file.
const CONTAINER_TAGS = new Set([
  'section', 'div', 'main', 'header', 'footer', 'nav',
  'ul', 'ol', 'li', 'span', 'p', 'a', 'strong', 'em',
  'h1', 'h2', 'h3',
  'table', 'thead', 'tbody', 'tr', 'td', 'th',
  'form', 'button', 'label', 'select', 'option', 'textarea',
  'figure', 'figcaption', 'article', 'aside', 'details', 'summary',
]);

// Void elements never have a closing tag.
const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

// Raw-text elements: their content is not parsed for tags.
const RAW_TEXT_TAGS = new Set(['script', 'style', 'textarea', 'title']);

/* ---------- stack-based balance checker ---------- */

/**
 * Check that every curated container tag is balanced.
 * Handles self-closing tags, void elements, HTML comments, and raw-text
 * elements (script/style/textarea/title) whose content must not be scanned.
 * Returns [{ line, message }] — the first mismatch per file.
 */
function checkBalancedTags(content) {
  const problems = [];
  // Strip HTML comments so their content cannot be misread as tags.
  const cleaned = content.replace(/<!--[\s\S]*?-->/g, '');
  const stack = [];
  // Attribute section allows quoted values (so `>` inside an attribute is safe).
  const tagRe = /<\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g;
  let m;
  while ((m = tagRe.exec(cleaned))) {
    const isClosing = m[1] === '/';
    const name = m[2].toLowerCase();
    const attrs = m[3] || '';
    const line = cleaned.slice(0, m.index).split('\n').length;

    // Inside a raw-text element, only its own closing tag matters.
    const top = stack[stack.length - 1];
    if (top && RAW_TEXT_TAGS.has(top.name)) {
      if (isClosing && name === top.name) stack.pop();
      continue;
    }

    if (isClosing) {
      // Only curated/raw-text closers are tracked; everything else is ignored.
      if (!CONTAINER_TAGS.has(name) && !RAW_TEXT_TAGS.has(name)) continue;
      const idx = stack.map((e) => e.name).lastIndexOf(name);
      if (idx === -1) {
        problems.push({ line, message: `unmatched closing </${name}>` });
      } else if (idx !== stack.length - 1) {
        problems.push({
          line,
          message: `</${name}> closes while <${stack[stack.length - 1].name}> (opened line ${stack[stack.length - 1].line}) is still open`,
        });
        stack.length = idx;
      } else {
        stack.pop();
      }
      continue;
    }

    // Opening tag: skip void elements and explicit self-closing tags.
    const selfClosing = /\/\s*$/.test(attrs) || VOID_TAGS.has(name);
    if (selfClosing) continue;
    if (CONTAINER_TAGS.has(name) || RAW_TEXT_TAGS.has(name)) {
      stack.push({ name, line });
    }
  }

  for (const e of stack) {
    problems.push({ line: e.line, message: `unclosed <${e.name}>` });
  }
  return problems;
}

/* ---------- audit ---------- */

test('every HTML file has balanced tags for the curated container set', () => {
  // Arrange / Act
  const offenders = [];
  for (const file of htmlFiles()) {
    const content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(ROOT, file);
    const problems = checkBalancedTags(content);
    if (problems.length > 0) {
      offenders.push(`${rel}: ${problems[0].message} (line ${problems[0].line})`);
    }
  }
  // Assert
  assert.deepStrictEqual(offenders, [], 'HTML tag balance violations');
});