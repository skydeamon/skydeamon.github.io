'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, htmlFiles } = require('../helpers');

const CV_DATA_FILE = path.join(ROOT, 'js', 'cv-data.js');

/* ---------- glossary rules ---------- */

// Rules applied to every HTML file AND to js/cv-data.js.
// ATS uses a word boundary so "STATS" (e.g. "IMPACT STATS") is not a false hit —
// this matches the existing convention in tests/compliance.test.js.
const RULES = [
  { name: 'On-Premises (must be lowercase "on-premises")', re: /On-Premises/g },
  { name: 'Proof of Concept (must be lowercase "proof-of-concept")', re: /Proof of Concept/g },
  { name: 'AI/ML (must be "AI/LLM")', re: /AI\/ML/g },
  { name: 'over 5 years (must be "5+ years")', re: /over 5 years/g },
  { name: 'ATS (case-insensitive)', re: /\bATS\b/gi },
  { name: '2021–Present / 2021 — Present (Umuzi mentor must be 2020)', re: /2021[–—]\s*Present/g },
  { name: '90%+ data quality (must be "90%+ data-quality coverage")', re: /90%\+ data quality/g },
];

// Rule 6 is scoped to js/cv-data.js summary/targetRole fields.
const STAFF_RE = /Staff-level|Staff \/ Senior/g;

/* ---------- helpers ---------- */

function collectOffenders(files) {
  const offenders = [];
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(ROOT, file);
    for (const rule of RULES) {
      for (const m of content.matchAll(rule.re)) {
        const line = content.slice(0, m.index).split('\n').length;
        const snippet = content
          .slice(Math.max(0, m.index - 40), m.index + 40)
          .replace(/\s+/g, ' ');
        offenders.push(`${rel} (line ${line}): ${rule.name} — "...${snippet}..."`);
      }
    }
  }
  return offenders;
}

/* ---------- audit ---------- */

test('no forbidden terminology in any HTML file', () => {
  // Arrange / Act
  const offenders = collectOffenders(htmlFiles());
  // Assert
  assert.deepStrictEqual(offenders, [], 'Forbidden terminology in HTML files');
});

test('no forbidden terminology in js/cv-data.js', () => {
  // Arrange / Act — cv-data.js is read directly since it is not an HTML file.
  const offenders = collectOffenders([CV_DATA_FILE]);
  // Assert
  assert.deepStrictEqual(offenders, [], 'Forbidden terminology in js/cv-data.js');
});

test('js/cv-data.js summaries and targetRoles contain no Staff-level or Staff / Senior', () => {
  // Arrange / Act — checks the whole file, which is a superset of summary/targetRole.
  const content = fs.readFileSync(CV_DATA_FILE, 'utf8');
  const offenders = [];
  for (const m of content.matchAll(STAFF_RE)) {
    const line = content.slice(0, m.index).split('\n').length;
    offenders.push(`line ${line}: ${m[0]}`);
  }
  // Assert
  assert.deepStrictEqual(offenders, [], 'Staff terminology in cv-data.js');
});