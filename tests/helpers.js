'use strict';

/**
 * Shared test helpers.
 *
 * Two jobs:
 *  - fixture guards, so a truncated or empty file cannot make a suite pass
 *    vacuously (an absence check on an empty string always succeeds)
 *  - CSS/colour utilities, so contrast assertions read the real token values
 *    instead of a hardcoded table that can drift from the stylesheets
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');

/** WCAG 2.2 AA for normal-size text. */
const AA_TEXT = 4.5;

/** Recursively collect files by extension, skipping VCS, tooling, and deps. */
function walk(dir, ext, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', '.opencode', 'node_modules', 'testenv'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, ext, out);
    else if (entry.name.endsWith(ext)) out.push(full);
  }
  return out;
}

const htmlFiles = () => walk(ROOT, '.html').sort();

const cssFiles = () => walk(ROOT, '.css').sort();

/**
 * Refuse to run content assertions against an empty or implausibly small
 * fixture. Without this, `assert.match('', /data-theme/)` fails loudly but
 * `assert.doesNotMatch('', /neon/)` passes for the wrong reason, and a suite
 * that only ever asserts absence looks green against an empty file.
 *
 * @param {string} file - absolute path
 * @param {number} minChars - smallest believable size
 * @returns {string} file contents
 */
function readFixture(file, minChars) {
  const contents = fs.readFileSync(file, 'utf8');
  if (contents.length < minChars) {
    throw new Error(
      `${path.relative(ROOT, file)} is ${contents.length} chars, expected at least ${minChars}. ` +
        'A truncated or empty fixture makes absence assertions pass vacuously.'
    );
  }
  return contents;
}

/** Every HTML file must be substantial enough that absence checks mean something. */
const readHtml = (file) => readFixture(file, 40);

/** Every stylesheet must be substantial enough that absence checks mean something. */
const readCss = (file) => readFixture(file, 6);

/* ---------- CSS parsing ---------- */

/** Remove comments, so commented-out code is never asserted on. */
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/**
 * Flatten a stylesheet into one entry per declaration block.
 *
 * Walks braces while tracking depth, so declaration `;` terminators inside a
 * rule are kept and only top-level at-rules are recorded as context. Nested
 * rules inside an at-rule keep their own selector, with the enclosing at-rule
 * available on `atRules` for callers that need it.
 *
 * @param {string} css - stylesheet source
 * @returns {Array<{selectors: string[], body: string, atRules: string[]}>}
 */
function ruleBodies(css) {
  const src = stripComments(css);
  const rules = [];

  /** Open blocks: `{selector, atRules, body}` for rules, `{atRules}` for at-rules. */
  const stack = [];
  let buffer = '';

  const top = () => stack[stack.length - 1];

  /**
   * Flush pending text into the open rule. Needed at `{` and `}` because the
   * last declaration in a block often has no trailing semicolon.
   */
  const flush = () => {
    const frame = top();
    if (frame && frame.kind === 'rule' && buffer.trim()) {
      frame.body += `${buffer.trim()};`;
    }
    buffer = '';
  };

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];

    if (ch === '{') {
      const head = buffer.trim();
      buffer = '';
      const atRules = top() ? [...top().atRules] : [];
      if (head.startsWith('@')) {
        stack.push({ kind: 'atrule', head, atRules: [...atRules, head] });
      } else {
        stack.push({ kind: 'rule', head, atRules, body: '' });
      }
      continue;
    }

    if (ch === '}') {
      flush();
      const frame = stack.pop();
      if (frame && frame.kind === 'rule' && frame.head) {
        const selectors = frame.head
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        rules.push({ selectors, body: frame.body, atRules: frame.atRules });
      }
      continue;
    }

    if (ch === ';') {
      // A declaration terminates here when inside a rule. At the top level a
      // `;` ends a statement (@import, @charset), so it must be discarded too,
      // or it bleeds into the next rule's selector.
      if (top() && top().kind === 'rule') {
        top().body += `${buffer.trim()};`;
      }
      buffer = '';
      continue;
    }

    buffer += ch;
  }

  // An unterminated final block still carries valid declarations.
  flush();
  const frame = top();
  if (frame && frame.kind === 'rule' && frame.head && frame.body.trim()) {
    rules.push({
      selectors: frame.head.split(',').map((s) => s.trim()).filter(Boolean),
      body: frame.body,
      atRules: frame.atRules,
    });
  }

  return rules;
}

/**
 * Find a custom property's value in a rule matching a selector predicate.
 *
 * Searches in source order so callers can resolve chains by advancing `from`.
 *
 * @param {string} css - stylesheet source
 * @param {function(string): boolean} selectorTest - selector predicate
 * @param {string} token - property name without leading dashes
 * @param {number} [from] - first rule index to consider
 * @returns {{value: string, selector: string, index: number}|null}
 */
function findTokenInRule(css, selectorTest, token, from = 0) {
  const rules = ruleBodies(css);
  const pattern = new RegExp(`(?:^|;)\\s*--${token}\\s*:\\s*([^;]+)`, 'i');
  for (let i = from; i < rules.length; i++) {
    if (!rules[i].selectors.some(selectorTest)) continue;
    const match = pattern.exec(rules[i].body);
    if (match) return { value: match[1].trim(), selector: rules[i].selectors.join(', '), index: i };
  }
  return null;
}


/* ---------- reference extraction ---------- */

/** Extract every href/src/srcset/data-src value from an HTML file. */
function extractLocalRefs(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const refs = [];
  const re = /(?:href|src|srcset|data-src)="([^"]*)"/g;
  let m;
  while ((m = re.exec(content))) {
    // srcset may be comma-separated: "a.jpg 1x, b.jpg 2x"
    for (const part of m[1].split(',')) {
      const ref = part.trim().split(/\s+/)[0];
      if (ref) refs.push(ref);
    }
  }
  return refs;
}

/** True for references that point at local files (not protocols or fragments). */
const isLocalRef = (ref) => !/^(https?:|mailto:|tel:|javascript:|data:|#)/.test(ref) && ref !== '';

/** Resolve a reference relative to the referencing file; strips query/hash. */
function resolveRef(filePath, ref) {
  const clean = ref.split('#')[0].split('?')[0];
  if (!clean) return null;
  return path.resolve(path.dirname(filePath), clean);
}

/* ---------- colour ---------- */

/** Expand #rgb to #rrggbb, or return null. */
function normalizeHex(value) {
  if (typeof value !== 'string') return null;
  const hex = value.trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(hex)) return hex;
  if (/^#[0-9a-f]{3}$/.test(hex)) {
    return '#' + hex.slice(1).split('').map((c) => c + c).join('');
  }
  return null;
}

/** Parse a hex colour into {r, g, b}. Returns null for anything else. */
function parseColor(value) {
  const hex = normalizeHex(value);
  if (!hex) return null;
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

/** Relative luminance per WCAG 2.x. */
function relativeLuminance({ r, g, b }) {
  const channel = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG contrast ratio between two hex colours. */
function contrastRatio(hexA, hexB) {
  const a = parseColor(hexA);
  const b = parseColor(hexB);
  if (!a || !b) throw new Error(`contrastRatio: not hex colours: ${hexA}, ${hexB}`);
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Contrast ratio rounded to 2dp, for readable assertion messages. */
const contrastRatioHex = (a, b) => Math.round(contrastRatio(a, b) * 100) / 100;

module.exports = {
  ROOT,
  AA_TEXT,
  htmlFiles,
  cssFiles,
  readFixture,
  readHtml,
  readCss,
  stripComments,
  ruleBodies,
  findTokenInRule,
  normalizeHex,
  parseColor,
  relativeLuminance,
  contrastRatio,
  contrastRatioHex,
  extractLocalRefs,
  isLocalRef,
  resolveRef,
};