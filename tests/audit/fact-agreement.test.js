'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT } = require('../helpers');

const CV_DATA = require(path.join(ROOT, 'js', 'cv-data.js'));

// The "general" audience profile is cvProfiles.data_engineer — the profile whose
// targetRole/summary carry the canonical general-audience facts.
const GENERAL = CV_DATA.cvProfiles.data_engineer;

const AUDIENCE_PAGES = [
  'portfolio/audience/general.html',
  'portfolio/audience/data-engineer.html',
  'portfolio/audience/ai-engineer.html',
  'portfolio/audience/academic.html',
  'portfolio/audience/freelance.html',
  'portfolio/audience/executive.html',
];

const FORBIDDEN_ON_AUDIENCE = [
  'On-Premises',
  'Proof of Concept',
  'AI/ML',
  'over 5 years',
  '2021–Present',
  '2021 — Present',
  '90%+ data quality',
];

/* ---------- canonical facts ---------- */

test('general profile targetRole is exactly the canonical contract role (no Staff)', () => {
  // Arrange / Act / Assert
  assert.strictEqual(
    GENERAL.targetRole,
    'Senior Data Engineer — AI Training Data (Contract)'
  );
});

test('general profile summary claims 5+ years, seeks a contract role, and avoids Staff-level', () => {
  // Arrange / Act / Assert
  assert.ok(GENERAL.summary.includes('5+ years'), 'summary missing "5+ years"');
  assert.ok(
    GENERAL.summary.includes('Seeking a contract role'),
    'summary missing "Seeking a contract role"'
  );
  assert.ok(!GENERAL.summary.includes('Staff-level'), 'summary contains "Staff-level"');
});

test('the Umuzi.org Alumni Mentor teaching bullet uses (2020 — Present)', () => {
  // Arrange
  const teaching = CV_DATA.cvProfiles.academic.teaching || [];
  const bullet = teaching.find((b) => b.includes('Umuzi.org Alumni Mentor'));
  // Act / Assert
  assert.ok(bullet, 'no teaching bullet mentions Umuzi.org Alumni Mentor');
  assert.ok(
    bullet.includes('(2020 — Present)'),
    `mentor bullet missing (2020 — Present): ${bullet}`
  );
});

test('the Umuzi.org affiliation entry uses (2020 — Present)', () => {
  // Arrange
  const affiliation = CV_DATA.affiliations.find((a) => a.includes('Umuzi.org'));
  // Act / Assert
  assert.ok(affiliation, 'no affiliation mentions Umuzi.org');
  assert.ok(
    affiliation.includes('(2020 — Present)'),
    `affiliation missing (2020 — Present): ${affiliation}`
  );
});

test('every experience date uses the em-dash with spaces format (no en-dash)', () => {
  // Arrange / Act
  const offenders = [];
  for (const job of CV_DATA.experience) {
    if (!/^(\d{4}|\w{3} \d{4}) — /.test(job.date)) {
      offenders.push(`${job.roleKey}: "${job.date}" does not start with "YYYY — " or "Mon YYYY — "`);
    }
    if (job.date.includes('–')) {
      offenders.push(`${job.roleKey}: en-dash in "${job.date}"`);
    }
  }
  // Assert
  assert.deepStrictEqual(offenders, [], 'Experience dates with wrong dash format');
});

test('general profile summary contains "enterprise-grade cloud data platforms" (no comma)', () => {
  // Arrange / Act / Assert
  assert.ok(
    GENERAL.summary.includes('enterprise-grade cloud data platforms'),
    'summary missing "enterprise-grade cloud data platforms"'
  );
});

/* ---------- audience page cross-check ---------- */

test('audience pages avoid all forbidden glossary terms', () => {
  // Arrange / Act
  const offenders = [];
  for (const rel of AUDIENCE_PAGES) {
    const content = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    for (const term of FORBIDDEN_ON_AUDIENCE) {
      if (content.includes(term)) {
        offenders.push(`${rel}: "${term}"`);
      }
    }
  }
  // Assert
  assert.deepStrictEqual(offenders, [], 'Forbidden terms on audience pages');
});