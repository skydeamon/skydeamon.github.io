'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, htmlFiles } = require('../helpers');

/**
 * Cover letters are shipped as merge-field templates, so a placeholder there
 * is intentional. Everything else is finished copy, so a placeholder anywhere
 * else is a defect.
 *
 * The previous version skipped the whole cover-letters/ directory, which meant
 * an accidental `[TODO]` in a cover letter passed. The exemption is now by
 * vocabulary, not by directory.
 */

// Merge fields, in any bracket style, that indicate unfilled template text.
const PLACEHOLDER_RE = /\[([^\]\n]{1,120})\]/g;

// Authored-by-hand markers. These are defects in every file, template or not.
const BANNED = [
  'TODO',
  'FIXME',
  'XXX',
  'TBD',
  'TBC',
  'PLACEHOLDER',
  'LOREM',
  'INSERT HERE',
  'FILL IN',
  'YOUR NAME HERE',
  'REPLACE ME',
  'REPLACE THIS',
];

function isCoverLetter(rel) {
  return rel.startsWith('portfolio/cover-letters/');
}

function placeholdersIn(content) {
  return [...content.matchAll(PLACEHOLDER_RE)].map((m) => m[1].trim());
}

test('no banned authoring marker appears in any file', () => {
  // TODO/FIXME/LOREM are defects everywhere. Case-insensitive, because
  // "Lorem ipsum" and "todo:" both slip through an exact-match check.
  const offenders = [];
  for (const file of htmlFiles()) {
    const rel = path.relative(ROOT, file);
    const content = fs.readFileSync(file, 'utf8');
    for (const marker of BANNED) {
      if (new RegExp(`\\b${marker}\\b`, 'i').test(content)) {
        offenders.push(`${rel}: "${marker}"`);
      }
    }
  }
  assert.deepStrictEqual(offenders, [], 'Banned authoring markers found');
});

test('finished pages contain no merge-field placeholders', () => {
  const offenders = [];
  for (const file of htmlFiles()) {
    const rel = path.relative(ROOT, file);
    if (isCoverLetter(rel)) continue;
    const found = placeholdersIn(fs.readFileSync(file, 'utf8'));
    if (found.length > 0) {
      offenders.push(`${rel}: ${[...new Set(found)].join(', ')}`);
    }
  }
  assert.deepStrictEqual(offenders, [], 'Placeholders outside portfolio/cover-letters/');
});

test('cover-letter merge fields use consistent slot names', () => {
  // A shared slot spelled two ways across letters ("Recipient Name" and
  // "Recipients Name") is a real defect: the recruiter filling the template
  // cannot tell they are the same field. Compare short slots case- and
  // whitespace-insensitively, and flag near-duplicates by edit distance.
  const shortSlots = new Map();

  for (const file of htmlFiles()) {
    const rel = path.relative(ROOT, file);
    if (!isCoverLetter(rel)) continue;

    for (const field of placeholdersIn(fs.readFileSync(file, 'utf8'))) {
      // Only short slots are comparable; the long "specific reason — e.g."
      // prose fields are per-letter copy, not a shared slot.
      if (field.split(/\s+/).length > 3) continue;
      const key = field.toLowerCase().replace(/\s+/g, ' ');
      if (!shortSlots.has(key)) shortSlots.set(key, []);
      shortSlots.get(key).push(rel);
    }
  }

  const offenders = [];
  const keys = [...shortSlots.keys()];
  for (let i = 0; i < keys.length; i += 1) {
    for (let j = i + 1; j < keys.length; j += 1) {
      if (editDistanceAtMost(keys[i], keys[j], 1)) {
        offenders.push(
          `"${keys[i]}" and "${keys[j]}" look like the same slot spelled differently`
        );
      }
    }
  }

  assert.deepStrictEqual(offenders, [], 'Inconsistent cover-letter slot names');
  assert.ok(keys.length > 0, 'expected cover letters to define merge-field slots');
});

/** True when `a` and `b` differ by at most `max` single-character edits. */
function editDistanceAtMost(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return false;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const row = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + cost);
      rowMin = Math.min(rowMin, row[j]);
    }
    if (rowMin > max) return false;
    prev = row;
  }
  return prev[b.length] <= max;
}

test('cover-letter placeholders render as text, not as broken markup', () => {
  // An unescaped `<` or a stray quote inside a merge field can break the
  // surrounding element, so the bracket must be literal text.
  const offenders = [];
  for (const file of htmlFiles()) {
    const rel = path.relative(ROOT, file);
    if (!isCoverLetter(rel)) continue;
    for (const field of placeholdersIn(fs.readFileSync(file, 'utf8'))) {
      if (/[<>]/.test(field)) {
        offenders.push(`${rel}: "[${field}]" contains markup characters`);
      }
    }
  }
  assert.deepStrictEqual(offenders, [], 'Merge fields containing markup characters');
});
