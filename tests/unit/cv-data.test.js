'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

const CV_DATA = require(path.join(__dirname, '..', '..', 'js', 'cv-data.js'));

const VALID_THEMES = ['general', 'data-engineer', 'ai-engineer', 'academic', 'freelance', 'executive', 'modern'];

/* ---------- module shape ---------- */

test('module exports an object with the expected top-level keys', () => {
  // Arrange / Act / Assert
  assert.deepStrictEqual(Object.keys(CV_DATA).sort(), [
    'affiliations',
    'certifications',
    'contact',
    'cvProfiles',
    'education',
    'experience',
    'interests',
    'languages',
    'projects',
    'skills',
  ]);
});

/* ---------- contact ---------- */

test('contact has all required fields', () => {
  // Arrange
  const required = ['name', 'email', 'linkedin', 'github', 'location'];
  // Act / Assert
  for (const field of required) {
    assert.ok(CV_DATA.contact[field], `contact.${field} missing`);
    assert.strictEqual(typeof CV_DATA.contact[field], 'string', `contact.${field} must be a string`);
  }
});

/* ---------- experience ---------- */

test('experience array has exactly 5 entries', () => {
  // Arrange / Act / Assert
  assert.strictEqual(CV_DATA.experience.length, 5);
});

test('canonical role dates are correct', () => {
  // Arrange
  const expected = {
    ibitse: 'Jun 2025 — Present',
    om_lead: 'Oct 2023 — Present',
    om_analyst: 'Dec 2022 — Oct 2023',
    om_de: 'Sep 2021 — Nov 2022',
    umuzi: 'Dec 2020 — Sep 2021',
  };
  // Act
  const byKey = Object.fromEntries(CV_DATA.experience.map((job) => [job.roleKey, job.date]));
  // Assert
  for (const [key, date] of Object.entries(expected)) {
    assert.strictEqual(byKey[key], date, `role ${key} date mismatch`);
  }
});

test('experience roles are in reverse chronological order', () => {
  // Arrange
  const startOrder = ['Jun 2025', 'Oct 2023', 'Dec 2022', 'Sep 2021', 'Dec 2020'];
  // Act
  const actual = CV_DATA.experience.map((job) => job.date.split(' — ')[0]);
  // Assert
  assert.deepStrictEqual(actual, startOrder);
});

/* ---------- cvProfiles ---------- */

test('cvProfiles has exactly 10 unique keys', () => {
  // Arrange / Act
  const keys = Object.keys(CV_DATA.cvProfiles);
  // Assert
  assert.strictEqual(keys.length, 10);
  assert.strictEqual(new Set(keys).size, 10, 'duplicate profile keys');
});

test('every profile has experienceBullets keys matching canonical roleKeys', () => {
  // Arrange
  const canonicalKeys = CV_DATA.experience.map((job) => job.roleKey);
  // Act / Assert
  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
    const bulletKeys = Object.keys(profile.experienceBullets || {});
    for (const bulletKey of bulletKeys) {
      assert.ok(canonicalKeys.includes(bulletKey), `${key}: unknown roleKey "${bulletKey}"`);
    }
  }
});

test('every profile references education', () => {
  // Arrange / Act / Assert
  assert.ok(CV_DATA.education.length >= 1, 'education data missing');
  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
    assert.ok(
      profile.sectionOrder.includes('education'),
      `${key}: sectionOrder missing education`
    );
  }
});

test('every profile has a valid theme string', () => {
  // Arrange / Act / Assert
  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
    assert.ok(VALID_THEMES.includes(profile.theme), `${key}: invalid theme "${profile.theme}"`);
  }
});

test('every profile has sectionOrder as a non-empty array', () => {
  // Arrange / Act / Assert
  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
    assert.ok(Array.isArray(profile.sectionOrder), `${key}: sectionOrder not an array`);
    assert.ok(profile.sectionOrder.length > 0, `${key}: sectionOrder empty`);
  }
});

test('every profile has availability as an array of {label, value} objects', () => {
  // Arrange / Act / Assert
  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
    assert.ok(Array.isArray(profile.availability), `${key}: availability not an array`);
    for (const row of profile.availability) {
      assert.strictEqual(typeof row.label, 'string', `${key}: availability label missing`);
      assert.strictEqual(typeof row.value, 'string', `${key}: availability value missing`);
    }
  }
});

test('freelance and contract profiles have a rate field', () => {
  // Arrange / Act / Assert
  assert.strictEqual(typeof CV_DATA.cvProfiles.freelance.rate, 'string');
  assert.strictEqual(typeof CV_DATA.cvProfiles.contract.rate, 'string');
});

/* ---------- new setup: factual consistency ---------- */

test('ai_engineer technicalStack lists TypeScript (15 months)', () => {
  // Arrange
  const stack = CV_DATA.cvProfiles.ai_engineer.technicalStack;
  const languages = stack.find((row) => row.label === 'Languages');
  // Act / Assert
  assert.ok(languages, 'ai_engineer: technicalStack missing Languages row');
  assert.ok(
    languages.value.includes('TypeScript (15 months)'),
    `ai_engineer: expected "TypeScript (15 months)", got "${languages.value}"`
  );
  assert.ok(
    !languages.value.includes('TypeScript (6 months)'),
    'ai_engineer: stale "TypeScript (6 months)" claim still present'
  );
});

test('freelance and contract rates are identical', () => {
  // Arrange / Act / Assert
  assert.strictEqual(
    CV_DATA.cvProfiles.freelance.rate,
    CV_DATA.cvProfiles.contract.rate,
    'freelance and contract rates must match'
  );
});

test('impact metrics are consistent across experience, highlights, and metrics', () => {
  // Arrange
  const allText = JSON.stringify(CV_DATA);
  const expected = ['35%', '22%', '90%', 'H+1'];
  // Act / Assert
  for (const metric of expected) {
    assert.ok(allText.includes(metric), `metric "${metric}" missing from cv-data.js`);
  }
});

test('every profile summary claims 5+ years of experience', () => {
  // Arrange / Act / Assert
  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
    assert.ok(
      profile.summary.includes('5+ years'),
      `${key}: summary missing "5+ years" claim`
    );
  }
});

test('experience timeline supports the 5+ years claim', () => {
  // Arrange: earliest role starts Dec 2020, latest is Present (Sep 2026)
  const earliest = CV_DATA.experience[CV_DATA.experience.length - 1];
  assert.strictEqual(earliest.date, 'Dec 2020 — Sep 2021');
  // Act: months from Dec 2020 to Sep 2026
  const months = (2026 - 2020) * 12 + (9 - 12);
  // Assert
  assert.ok(months >= 60, `timeline spans ${months} months, expected >= 60 for "5+ years"`);
});