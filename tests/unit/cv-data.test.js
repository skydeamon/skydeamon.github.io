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

test('experience array has exactly 6 entries', () => {
  // Arrange / Act / Assert
  assert.strictEqual(CV_DATA.experience.length, 6);
});

test('canonical role dates are correct', () => {
  // Arrange
  const expected = {
    ibitse: 'Jun 2025 — Present',
    zelenial: 'Feb 2025 — Present',
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
  const startOrder = ['Jun 2025', 'Feb 2025', 'Oct 2023', 'Dec 2022', 'Sep 2021', 'Dec 2020'];
  // Act
  const actual = CV_DATA.experience.map((job) => job.date.split(' — ')[0]);
  // Assert
  assert.deepStrictEqual(actual, startOrder);
});

/* ---------- cvProfiles ---------- */

test('cvProfiles has exactly 17 keys', () => {
  // Arrange / Act
  const keys = Object.keys(CV_DATA.cvProfiles);
  // Assert
  assert.strictEqual(keys.length, 17);
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

test('ai_engineer skills resolve to canonical categories including TypeScript', () => {
  // Arrange
  const profile = CV_DATA.cvProfiles.ai_engineer;
  const programming = CV_DATA.skills.programming;
  // Act / Assert
  assert.ok(
    profile.skills.includes('programming'),
    'ai_engineer: skills missing canonical "programming" category'
  );
  assert.ok(
    programming.tags.includes('TypeScript'),
    'ai_engineer: canonical programming category missing TypeScript'
  );
  assert.ok(
    !JSON.stringify(CV_DATA).includes('TypeScript (6 months)'),
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

test('impact metrics are consistent across experience bullets', () => {
  // Arrange
  const bullets = CV_DATA.experience.flatMap((job) => job.bullets || []).join(' ');
  const expected = ['35%', '22%', '90%', 'H+1'];
  // Act / Assert
  for (const metric of expected) {
    assert.ok(bullets.includes(metric), `metric "${metric}" missing from experience bullets`);
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
  // Arrange: earliest role starts Dec 2020, latest is Present
  const earliest = CV_DATA.experience[CV_DATA.experience.length - 1];
  assert.strictEqual(earliest.date, 'Dec 2020 — Sep 2021');
  // Act: months from Dec 2020 to today
  const now = new Date();
  const months = (now.getFullYear() - 2020) * 12 + (now.getMonth() + 1 - 12);
  // Assert
  assert.ok(months >= 60, `timeline spans ${months} months, expected >= 60 for "5+ years"`);
});