'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

const CV_DATA = require(path.join(__dirname, '..', '..', 'js', 'cv-data.js'));
const CVRenderer = require(path.join(__dirname, '..', '..', 'js', 'cv-render.js'));

/* ---------- section renderer mapping (H3) ---------- */

test('sectionRenderers is exported and covers every sectionOrder entry', () => {
  // Arrange
  const renderers = CVRenderer.sectionRenderers;
  assert.ok(renderers, 'sectionRenderers not exported');
  // Act / Assert
  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
    for (const section of profile.sectionOrder) {
      assert.ok(
        renderers[section],
        `${key}: sectionOrder entry "${section}" has no renderer`
      );
    }
    if (profile.layout && profile.layout.type === 'two-column') {
      for (const section of [...profile.layout.main, ...profile.layout.sidebar]) {
        assert.ok(
          renderers[section],
          `${key}: layout section "${section}" has no renderer`
        );
      }
    }
  }
});

test('every section renderer produces non-empty output for its profile', () => {
  // Arrange
  const renderers = CVRenderer.sectionRenderers;
  // Act / Assert
  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
    for (const section of profile.sectionOrder) {
      const html = renderers[section](profile, CV_DATA);
      assert.ok(
        typeof html === 'string' && html.length > 0,
        `${key}: renderer for "${section}" returned empty output`
      );
    }
  }
});

test('renderCV produces a complete document for every profile', () => {
  // Arrange / Act / Assert
  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
    const html = CVRenderer.renderCV(profile, CV_DATA);
    assert.ok(html.includes('<h1>'), `${key}: missing name heading`);
    assert.ok(html.includes('cv-content'), `${key}: missing content wrapper`);
    assert.ok(html.includes('</header>'), `${key}: missing header close`);
  }
});

/* ---------- skill consistency (M8) ---------- */

test('every string skill reference resolves to a master skill category', () => {
  // Arrange
  const master = CV_DATA.skills;
  // Act / Assert
  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
    const lists = [
      profile.skills,
      profile.skillsAI,
      profile.skillsData,
      profile.services,
    ];
    for (const list of lists || []) {
      if (!Array.isArray(list)) continue;
      for (const entry of list) {
        if (typeof entry === 'string') {
          assert.ok(
            master[entry],
            `${key}: skill reference "${entry}" not found in master skills`
          );
        } else if (entry && typeof entry === 'object') {
          assert.ok(
            Array.isArray(entry.tags) && entry.tags.length > 0,
            `${key}: inline skill category "${entry.title}" has no tags`
          );
        }
      }
    }
  }
});

test('master skills categories have title and non-empty tags', () => {
  // Arrange / Act / Assert
  for (const [name, cat] of Object.entries(CV_DATA.skills)) {
    assert.ok(cat.title, `skills.${name}: missing title`);
    assert.ok(Array.isArray(cat.tags) && cat.tags.length > 0, `skills.${name}: missing tags`);
  }
});

/* ---------- heading hierarchy (H2) ---------- */

test('rendered CVs never skip from h2 to h4', () => {
  // Arrange
  const renderers = CVRenderer.sectionRenderers;
  // Act / Assert
  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
    for (const section of profile.sectionOrder) {
      const html = renderers[section](profile, CV_DATA);
      assert.ok(
        !/<h4/.test(html),
        `${key}: section "${section}" emits h4 (should be h3 or lower)`
      );
    }
  }
});