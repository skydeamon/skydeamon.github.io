'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, htmlFiles } = require('./helpers');

const CV_DATA = require(path.join(ROOT, 'js', 'cv-data.js'));

/* ---------- canonical section framework ---------- */

// Canonical position of every section. Common sections share a fixed slot;
// niche sections are pinned to a fixed position in the flow.
const CANONICAL_INDEX = {
  'target-role': 0,
  summary: 1,
  'research-interests': 2,
  'leadership-philosophy': 3,
  'skills-grid': 4,
  services: 5,
  'impact-highlights': 6,
  experience: 7,
  projects: 8,
  publications: 9,
  teaching: 10,
  'research-projects': 11,
  'healthcare-compliance': 12,
  education: 13,
  certifications: 14,
  languages: 15,
  affiliations: 16,
  interests: 17,
  availability: 18,
  references: 19,
};

test('every profile sectionOrder follows the canonical section framework', () => {
  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
    let prev = -1;
    for (const section of profile.sectionOrder) {
      assert.ok(
        CANONICAL_INDEX[section] !== undefined,
        `${key}: unknown section "${section}" in sectionOrder`
      );
      assert.ok(
        CANONICAL_INDEX[section] >= prev,
        `${key}: section "${section}" out of canonical order (after index ${prev})`
      );
      prev = CANONICAL_INDEX[section];
    }
  }
});

test('every profile includes the canonical common sections', () => {
  const common = ['summary', 'skills-grid', 'experience', 'projects', 'education', 'certifications', 'languages', 'affiliations', 'references'];
  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
    for (const section of common) {
      assert.ok(
        profile.sectionOrder.includes(section),
        `${key}: missing canonical section "${section}"`
      );
    }
  }
});

test('every profile skills resolve to canonical master categories', () => {
  const canonical = ['programming', 'cloud_aws', 'data_engineering', 'frameworks', 'databases', 'devops', 'ai_llm'];
  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
    assert.ok(Array.isArray(profile.skills), `${key}: skills not an array`);
    for (const ref of profile.skills) {
      assert.ok(
        canonical.includes(ref),
        `${key}: non-canonical skill reference "${ref}"`
      );
      assert.ok(CV_DATA.skills[ref], `${key}: skill reference "${ref}" missing from master skills`);
    }
  }
});

/* ---------- no ATS terminology in site content ---------- */

test('no site content file retains ATS terminology', () => {
  const offenders = [];
  const scanDirs = ['portfolio', 'js', 'css'];
  const scanFiles = ['index.html', 'README.md'];
  const files = [];
  for (const dir of scanDirs) {
    const walk = (d) => {
      for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
        if (entry.name === '.git' || entry.name === 'node_modules') continue;
        const full = path.join(d, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.(html|js|css|md)$/.test(entry.name)) files.push(full);
      }
    };
    walk(path.join(ROOT, dir));
  }
  for (const f of scanFiles) {
    const full = path.join(ROOT, f);
    if (fs.existsSync(full)) files.push(full);
  }
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    if (/\bATS\b/i.test(content)) offenders.push(path.relative(ROOT, file));
  }
  assert.deepStrictEqual(offenders, [], 'ATS terminology still present in site content');
});

/* ---------- engagement shells match the renderer shell pattern ---------- */

const ENGAGEMENT_SHELLS = {
  'portfolio/cv/engagement/minimal.html': 'job_application',
  'portfolio/cv/engagement/full-time.html': 'full_time',
  'portfolio/cv/engagement/contract.html': 'contract',
  'portfolio/cv/engagement/part-time.html': 'part_time',
};

test('every engagement page is a thin renderer shell (cv-root + initCV)', () => {
  for (const [rel, profileKey] of Object.entries(ENGAGEMENT_SHELLS)) {
    const content = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    assert.ok(content.includes('cv-minimal.css'), `${rel}: missing cv-minimal.css link`);
    assert.ok(content.includes('id="cv-root"'), `${rel}: missing cv-root container`);
    assert.ok(content.includes('js/cv-data.js'), `${rel}: missing cv-data.js script`);
    assert.ok(content.includes('js/cv-render.js'), `${rel}: missing cv-render.js script`);
    assert.ok(content.includes('js/cv-init.js'), `${rel}: missing cv-init.js script`);
    assert.ok(
      content.includes(`data-profile="${profileKey}"`) && content.includes('data-format="engagement"'),
      `${rel}: missing data-profile="${profileKey}" data-format="engagement" on cv-init.js`
    );
    assert.ok(!/<body data-theme=/.test(content), `${rel}: body data-theme must be set by initCV from profile.theme`);
    assert.ok(!content.includes('style="--accent'), `${rel}: inline --accent style should be removed`);
  }
});