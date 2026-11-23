'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

const { ROOT } = require('../helpers');
const { createHarness } = require('../helpers/dom-harness');
const CV_DATA = require(path.join(ROOT, 'js', 'cv-data.js'));
const CVRenderer = require(path.join(ROOT, 'js', 'cv-render.js'));

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
  }
});

test('every section renderer produces non-empty output for its profile', () => {
  // Arrange
  const renderers = CVRenderer.sectionRenderers;
  // Act / Assert
  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
    for (const section of profile.sectionOrder) {
      // availability is conditionally rendered: empty when the profile has no data
      if (section === 'availability' && (!profile.availability || profile.availability.length === 0)) continue;
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

test('every skillsGrid entry has a category and non-empty skills list', () => {
  // Arrange / Act / Assert
  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
    if (!profile.skillsGrid) continue;
    assert.ok(Array.isArray(profile.skillsGrid), `${key}: skillsGrid not an array`);
    for (const entry of profile.skillsGrid) {
      assert.ok(typeof entry.category === 'string' && entry.category.length > 0, `${key}: skillsGrid entry missing category`);
      assert.ok(Array.isArray(entry.skills) && entry.skills.length > 0, `${key}: skillsGrid entry "${entry.category}" has no skills`);
      for (const skill of entry.skills) {
        assert.strictEqual(typeof skill, 'string', `${key}: skillsGrid skill not a string`);
      }
    }
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

/* ---------- new setup: nav controls ---------- */

test('renderControls includes theme toggle, print, "← CVs", and Home links', () => {
  // Arrange
  const controls = CVRenderer.renderControls();
  // Act / Assert
  assert.ok(controls.includes('theme-toggle'), 'missing theme toggle button');
  assert.ok(controls.includes('print-btn'), 'missing print button');
  assert.ok(controls.includes('← CVs'), 'missing "← CVs" link');
  assert.ok(controls.includes('href="../index.html"'), 'missing hub link');
  assert.ok(controls.includes('href="../../index.html"'), 'missing root Home link');
});

test('renderControls supports the engagement base depth and plain mode', () => {
  const controls = CVRenderer.renderControls({ plain: true, base: '../../' });

  assert.ok(!controls.includes('theme-toggle'), 'engagement controls must not include a theme toggle');
  assert.ok(controls.includes('print-btn'), 'missing print button');
  assert.ok(controls.includes('href="../../index.html"'), 'missing engagement hub link');
  assert.ok(controls.includes('href="../../../index.html"'), 'missing engagement Home link');
});

/* ---------- engagement / flat renderers ---------- */

const FLAT_SECTION_LABELS = {
  summary: 'Professional Summary',
  skills: 'Technical Skills',
  'skills-grid': 'Skills',
  stats: 'Key Metrics',
  experience: 'Professional Experience',
  projects: 'Selected Projects',
  education: 'Education',
  certifications: 'Certifications',
  languages: 'Languages',
  affiliations: 'Professional Affiliations',
  interests: 'Interests',
  availability: 'Availability',
  references: 'References',
  'target-role': 'Target Role',
  'impact-highlights': 'Proven Impact',
  'healthcare-compliance': 'Healthcare & Compliance',
  'research-interests': 'Research Interests',
  publications: 'Publications',
  teaching: 'Teaching & Mentoring',
  'research-projects': 'Research Projects',
  'leadership-philosophy': 'Leadership Philosophy',
  services: 'Services Offered',
};

/** A profile carrying data for every flat renderer, so none is skipped. */
function fullFlatProfile(sectionOrder) {
  return {
    ...CV_DATA.cvProfiles.platform_engineer,
    sectionOrder,
    skills: ['programming', 'cloud_aws'],
    skillsGrid: CV_DATA.cvProfiles.platform_engineer.skillsGrid,
    services: CV_DATA.cvProfiles.freelance.services,
    targetRole: 'Platform Engineering Lead',
    impactHighlights: ['<strong>35%</strong> faster delivery'],
    healthcareCompliance: ['POPIA'],
    researchInterests: ['Distributed systems'],
    publications: [
      { title: 'A paper', url: 'https://example.com/paper', description: 'A description' },
    ],
    teaching: ['Mentored engineers'],
    researchProjects: [{ title: 'A project', description: 'A description' }],
    leadershipPhilosophy: 'Build the system that builds the system.',
    availability:
      CV_DATA.cvProfiles.platform_engineer.availability &&
      CV_DATA.cvProfiles.platform_engineer.availability.length
        ? CV_DATA.cvProfiles.platform_engineer.availability
        : [{ label: 'Notice', value: 'Immediate' }],
  };
}

test('renderEngagement renders every flat section renderer', () => {
  const sectionOrder = ['skills', ...Object.keys(CVRenderer.sectionRenderers)];
  const html = CVRenderer.renderEngagement(fullFlatProfile(sectionOrder), CV_DATA, {
    format: 'engagement',
    base: '../../',
  });

  assert.ok(html.includes('<h1>'), 'missing flat header');
  for (const [section, label] of Object.entries(FLAT_SECTION_LABELS)) {
    assert.ok(html.includes(`<h2>${label}</h2>`), `flat renderer "${section}" did not render "${label}"`);
  }
});

test('renderEngagement falls back to the engagement section order when a profile has none', () => {
  const html = CVRenderer.renderEngagement(fullFlatProfile([]), CV_DATA, {
    format: 'engagement',
    base: '../../',
  });

  for (const section of CVRenderer.ENGAGEMENT_SECTION_ORDER) {
    assert.ok(
      html.includes(`<h2>${FLAT_SECTION_LABELS[section]}</h2>`),
      `fallback order skipped "${section}"`
    );
  }
  assert.ok(!html.includes('<h2>Target Role</h2>'), 'fallback order should not add optional sections');
});

test('renderEngagement keeps flat cert links at the engagement depth', () => {
  const html = CVRenderer.renderEngagement(fullFlatProfile(['certifications']), CV_DATA, {
    format: 'engagement',
    base: '../../',
  });

  for (const cert of CV_DATA.certifications.filter((entry) => entry.link)) {
    assert.ok(
      html.includes(`href="../../../${cert.link}"`),
      `flat cert link has the wrong depth for "${cert.title}"`
    );
  }
});

/* ---------- resilience ---------- */

test('cv-render.js initCV does not throw when ThemeStore never loaded', () => {
  const h = createHarness({
    ids: ['cv-root', 'theme-toggle', 'theme-icon', 'print-btn'],
    withThemeStore: false,
  });
  h.context.window.CV_DATA = CV_DATA;
  h.run('js/cv-render.js');

  const renderer = h.context.window.CVRenderer;
  assert.doesNotThrow(() => renderer.initCV('platform_engineer'));

  // The profile accent still applies; only the mode toggle is unavailable.
  assert.strictEqual(h.body.getAttribute('data-theme'), 'modern');
  assert.strictEqual(h.currentTheme(), null);

  assert.doesNotThrow(() => h.fire(h.themeToggle, 'click'));
  assert.strictEqual(h.currentTheme(), null, 'a store-less toggle changed the theme');
});

test('cv-render.js still wires print when ThemeStore never loaded', () => {
  const h = createHarness({
    ids: ['cv-root', 'theme-toggle', 'theme-icon', 'print-btn'],
    withThemeStore: false,
  });
  h.context.window.CV_DATA = CV_DATA;
  h.run('js/cv-render.js');
  h.context.window.CVRenderer.initCV('platform_engineer');

  h.fire(h.byId.get('print-btn'), 'click');
  assert.strictEqual(h.window._printed, true, 'print died with the store');
});