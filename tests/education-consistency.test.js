'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, htmlFiles } = require('./helpers');

const CV_DATA = require(path.join(ROOT, 'js', 'cv-data.js'));
const CVRenderer = require(path.join(ROOT, 'js', 'cv-render.js'));

const BSC = CV_DATA.education[0];
const NSC = CV_DATA.education[1];

const AUDIENCE_PAGES = [
  'portfolio/audience/general.html',
  'portfolio/audience/ai-engineer.html',
  'portfolio/audience/data-engineer.html',
  'portfolio/audience/executive.html',
  'portfolio/audience/freelance.html',
  'portfolio/audience/modern.html',
  'portfolio/audience/academic.html',
];

/* ---------- canonical data ---------- */

test('canonical education has BSc and NSC entries', () => {
  assert.strictEqual(CV_DATA.education.length, 2);
  assert.ok(BSC.degree.includes('Bachelor of Science (BSc) in Physics and Astrophysics'));
  assert.strictEqual(NSC.degree, 'National Senior Certificate');
});

test('canonical BSc subject list includes Astrophysics', () => {
  assert.ok(BSC.details.includes('Astrophysics'), 'BSc details missing Astrophysics');
  assert.ok(BSC.details.includes('Astronomy'), 'BSc details missing Astronomy');
});

/* ---------- audience pages (BSc-only, full canonical block) ---------- */

test('every audience page shows the full canonical BSc block', () => {
  for (const rel of AUDIENCE_PAGES) {
    const content = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    assert.ok(content.includes(BSC.degree), `${rel}: missing canonical BSc degree`);
    assert.ok(content.includes('University of Cape Town, South Africa'), `${rel}: missing canonical school`);
    assert.ok(content.includes('Feb 2015 — Nov 2017'), `${rel}: missing canonical BSc date`);
    assert.ok(content.includes(BSC.details), `${rel}: missing canonical BSc subject list`);
  }
});

test('audience pages are BSc-only (no NSC)', () => {
  for (const rel of AUDIENCE_PAGES) {
    const content = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    assert.ok(!content.includes('National Senior Certificate'), `${rel}: audience page must not show NSC`);
  }
});

/* ---------- root + engagement pages (BSc + NSC) ---------- */

test('root index.html shows canonical BSc and NSC blocks', () => {
  const content = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  assert.ok(content.includes(BSC.degree), 'root: missing canonical BSc degree');
  assert.ok(content.includes('University of Cape Town, South Africa'), 'root: missing canonical school');
  assert.ok(content.includes('Feb 2015 — Nov 2017'), 'root: missing canonical BSc date');
  assert.ok(content.includes(BSC.details), 'root: missing canonical BSc subject list');
  assert.ok(content.includes(NSC.degree), 'root: missing NSC degree');
  assert.ok(content.includes('Jan 2009 — Dec 2014'), 'root: missing canonical NSC date');
  assert.ok(content.includes(NSC.details), 'root: missing NSC subject list');
});

test('every engagement page renders canonical BSc and NSC blocks', () => {
  const profileKeys = {
    'portfolio/cv/engagement/full-time.html': 'full_time',
    'portfolio/cv/engagement/contract.html': 'contract',
    'portfolio/cv/engagement/part-time.html': 'part_time',
    'portfolio/cv/engagement/minimal.html': 'job_application',
  };
  for (const [rel, key] of Object.entries(profileKeys)) {
    const html = CVRenderer.renderEngagement(CV_DATA.cvProfiles[key], CV_DATA);
    assert.ok(html.includes(BSC.degree), `${rel}: missing canonical BSc degree`);
    assert.ok(html.includes('University of Cape Town, South Africa'), `${rel}: missing canonical school`);
    assert.ok(html.includes('Feb 2015 — Nov 2017'), `${rel}: missing canonical BSc date`);
    assert.ok(html.includes(BSC.details), `${rel}: missing canonical BSc subject list`);
    assert.ok(html.includes(NSC.degree), `${rel}: missing NSC degree`);
    assert.ok(html.includes('Jan 2009 — Dec 2014'), `${rel}: missing canonical NSC date`);
    assert.ok(html.includes(NSC.details), `${rel}: missing NSC subject list`);
  }
});

/* ---------- no stale short forms anywhere ---------- */

test('no HTML file retains the short-form degree or year-only dates', () => {
  const offenders = [];
  for (const file of htmlFiles()) {
    const content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(ROOT, file);
    if (content.includes('BSc Physics')) offenders.push(`${rel}: short-form degree`);
    if (content.includes('2015 — 2017')) offenders.push(`${rel}: year-only BSc date`);
  }
  assert.deepStrictEqual(offenders, [], 'Stale short-form education strings');
});