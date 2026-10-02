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

test('no two profiles resolve to the same rendered document', () => {
  // The previous 'unique config key' test compared Object.keys against itself,
  // which is a tautology: an object cannot have duplicate keys. The real risk
  // is two profile keys rendering identical output, where one page silently
  // duplicates another. Distinguish on the content that actually renders.
  const signatures = new Map();

  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
    const signature = JSON.stringify({
      subtitle: profile.subtitle,
      summary: profile.summary,
      sectionOrder: profile.sectionOrder,
      skills: profile.skills,
    });
    if (signatures.has(signature)) {
      assert.fail(
        `${key} renders identically to ${signatures.get(signature)}; ` +
          'one of them is redundant'
      );
    }
    signatures.set(signature, key);
  }

  // Guard against the comparison collapsing to a single fingerprint.
  assert.strictEqual(
    signatures.size,
    Object.keys(CV_DATA.cvProfiles).length,
    'signatures did not distinguish every profile'
  );
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

test('every profile has a non-empty subtitle', () => {
  // Arrange / Act / Assert
  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
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

test('every profile declares stats and impactHighlights', () => {
  // Arrange / Act / Assert
  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
    assert.ok(
      Array.isArray(profile.stats) && profile.stats.length > 0,
      `${key}: stats missing or empty`
    );
    assert.ok(
      Array.isArray(profile.impactHighlights) && profile.impactHighlights.length > 0,
      `${key}: impactHighlights missing or empty`
    );
  }
});

/* ---------- new setup: bullets ---------- */

test('every profile has experienceBullets as an object with canonical role keys', () => {
  // Arrange
  const canonicalKeys = CV_DATA.experience.map((job) => job.roleKey);
  // Act / Assert
  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
    assert.ok(
      profile.experienceBullets && typeof profile.experienceBullets === 'object',
      `${key}: experienceBullets missing or not an object`
    );
    for (const bulletKey of Object.keys(profile.experienceBullets)) {
      assert.ok(
        canonicalKeys.includes(bulletKey),
        `${key}: experienceBullets has unknown role "${bulletKey}"`
      );
    }
  }
});

test('every non-empty experienceBullets entry is a non-empty array', () => {
  // Arrange / Act / Assert
  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
    for (const [roleKey, bullets] of Object.entries(profile.experienceBullets || {})) {
      assert.ok(
        Array.isArray(bullets) && bullets.length > 0,
        `${key}: experienceBullets.${roleKey} empty`
      );
    }
  }
});