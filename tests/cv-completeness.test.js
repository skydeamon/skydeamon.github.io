'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

const CV_DATA = require(path.join(__dirname, '..', 'js', 'cv-data.js'));

const VALID_THEMES = ['general', 'data-engineer', 'ai-engineer', 'academic', 'freelance', 'executive', 'modern'];
const VALID_EMPLOYMENT_TYPES = ['full-time', 'contract', 'part-time'];

/* ---------- uniqueness ---------- */

test('every cvProfile key is unique', () => {
  // Arrange / Act
  const keys = Object.keys(CV_DATA.cvProfiles);
  // Assert
  assert.strictEqual(new Set(keys).size, keys.length, 'duplicate profile keys found');
});

test('every profile has a unique config key', () => {
  // Arrange / Act
  const keys = Object.keys(CV_DATA.cvProfiles);
  // Assert
  assert.strictEqual(keys.length, new Set(keys).size);
});

/* ---------- section completeness ---------- */

test('every profile declares Experience', () => {
  // Arrange / Act / Assert
  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
    const declaresExperience = profile.sectionOrder.some(
      (section) => section === 'experience' || section === 'timeline'
    );
    assert.ok(declaresExperience, `${key}: no experience/timeline section declared`);
  }
});

test('every profile declares Education', () => {
  // Arrange / Act / Assert
  assert.ok(CV_DATA.education.length >= 1, 'education data missing');
  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
    assert.ok(
      profile.sectionOrder.includes('education'),
      `${key}: no education section declared`
    );
  }
});

test('every profile declares Skills', () => {
  // Arrange / Act / Assert
  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
    const declaresSkills = profile.sectionOrder.some(
      (section) => section.includes('skills') || section === 'skill-bars'
    );
    assert.ok(declaresSkills, `${key}: no skills section declared`);
  }
});

/* ---------- theme ---------- */

test('every profile has a valid theme from VALID_THEMES', () => {
  // Arrange / Act / Assert
  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
    assert.ok(VALID_THEMES.includes(profile.theme), `${key}: invalid theme "${profile.theme}"`);
  }
});

/* ---------- metadata ---------- */

test('every profile has non-empty title and subtitle', () => {
  // Arrange / Act / Assert
  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
    assert.strictEqual(typeof profile.title, 'string', `${key}: title missing`);
    assert.ok(profile.title.length > 0, `${key}: title empty`);
    assert.strictEqual(typeof profile.subtitle, 'string', `${key}: subtitle missing`);
    assert.ok(profile.subtitle.length > 0, `${key}: subtitle empty`);
  }
});

test('every profile has a valid employmentType', () => {
  // Arrange / Act / Assert
  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
    assert.ok(
      VALID_EMPLOYMENT_TYPES.includes(profile.employmentType),
      `${key}: invalid employmentType "${profile.employmentType}"`
    );
  }
});

test('every profile has a non-empty summary', () => {
  // Arrange / Act / Assert
  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
    assert.strictEqual(typeof profile.summary, 'string', `${key}: summary missing`);
    assert.ok(profile.summary.length > 0, `${key}: summary empty`);
  }
});