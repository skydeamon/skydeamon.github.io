'use strict';

/**
 * Certification content and link contract.
 *
 * The certificate PDFs are the only site assets referenced from JavaScript
 * rather than from HTML/CSS. That puts them outside the static reference walk
 * in references.test.js, so a renamed, deleted, or untracked PDF would render a
 * perfectly-formed 404 link. These tests keep the data, the on-disk artifacts,
 * and both renderer formats in agreement.
 */

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT } = require('./helpers');

const CV_DATA = require(path.join(ROOT, 'js', 'cv-data.js'));
const CVRenderer = require(path.join(ROOT, 'js', 'cv-render.js'));

const LINKED = CV_DATA.certifications.filter((cert) => cert.link);

/** A repository-relative PDF path, with no protocol, traversal, or URL tricks. */
const SAFE_PDF_PATH = /^certificates\/[a-z0-9][a-z0-9-]*\.pdf$/;

/* ---------- data shape ---------- */

test('every certification has the icon, title, and detail the renderers read', () => {
  assert.ok(Array.isArray(CV_DATA.certifications), 'certifications is not an array');
  assert.ok(CV_DATA.certifications.length > 0, 'certifications is empty');

  for (const [index, cert] of CV_DATA.certifications.entries()) {
    const label = `certifications[${index}]`;
    assert.strictEqual(typeof cert.icon, 'string', `${label}: icon is not a string`);
    assert.ok(cert.icon.trim().length > 0, `${label}: icon is empty`);
    assert.strictEqual(typeof cert.title, 'string', `${label}: title is not a string`);
    assert.ok(cert.title.trim().length > 0, `${label}: title is empty`);
    assert.strictEqual(typeof cert.detail, 'string', `${label}: detail is not a string`);
    assert.ok(cert.detail.trim().length > 0, `${label}: detail is empty`);
  }
});

test('certifications exercise both the linked and unlinked render paths', () => {
  // Both branches are user-visible: a linked cert is an anchor, an unlinked one
  // is plain text. Data that only ever uses one branch leaves the other broken
  // until someone adds a PDF.
  assert.ok(LINKED.length > 0, 'no certification has a link');
  assert.ok(
    CV_DATA.certifications.length > LINKED.length,
    'no certification exercises the unlinked render path'
  );
});

test('every certification link is a safe, repository-relative PDF path', () => {
  const seen = new Set();

  for (const cert of LINKED) {
    assert.strictEqual(typeof cert.link, 'string', `${cert.title}: link is not a string`);
    assert.match(
      cert.link,
      SAFE_PDF_PATH,
      `${cert.title}: link must be certificates/<slug>.pdf, got "${cert.link}"`
    );
    assert.ok(!cert.link.includes('..'), `${cert.title}: link contains path traversal`);
    assert.ok(!cert.link.includes('\\'), `${cert.title}: link contains a backslash`);
    assert.ok(!seen.has(cert.link), `${cert.title}: duplicate link "${cert.link}"`);
    seen.add(cert.link);
  }
});

test('every certification link points at a real, non-trivial PDF', () => {
  for (const cert of LINKED) {
    const target = path.join(ROOT, cert.link);
    assert.ok(fs.existsSync(target), `${cert.title}: missing PDF at ${cert.link}`);

    const stat = fs.statSync(target);
    assert.ok(stat.isFile(), `${cert.title}: ${cert.link} is not a file`);
    assert.ok(
      stat.size > 1024,
      `${cert.title}: ${cert.link} is only ${stat.size} bytes, which is not a usable PDF`
    );

    const header = fs.readFileSync(target).subarray(0, 5).toString('ascii');
    assert.strictEqual(header, '%PDF-', `${cert.title}: ${cert.link} is not a PDF`);
  }
});

/* ---------- card renderer ---------- */

test('card view links certificate titles at the CV page depth', () => {
  const html = CVRenderer.renderCV(CV_DATA.cvProfiles.data_engineer, CV_DATA);

  for (const cert of LINKED) {
    const href = `href="../../${cert.link}"`;
    assert.ok(
      html.includes(href),
      `card view is missing ${href} for "${cert.title}"`
    );
    assert.ok(
      html.includes(`>${cert.title}</a>`),
      `card view did not wrap "${cert.title}" in its link`
    );
  }
});

test('card view leaves unlinked certifications as plain headings', () => {
  const html = CVRenderer.renderCV(CV_DATA.cvProfiles.data_engineer, CV_DATA);

  for (const cert of CV_DATA.certifications.filter((entry) => !entry.link)) {
    assert.ok(html.includes(cert.title), `card view is missing "${cert.title}"`);
    assert.ok(
      !new RegExp(`<a[^>]*>${escapeRegExp(cert.title)}</a>`).test(html),
      `card view made an anchor for unlinked certificate "${cert.title}"`
    );
  }
});

test('certificate links open a new tab with a safe opener relationship', () => {
  const html = CVRenderer.renderCV(CV_DATA.cvProfiles.data_engineer, CV_DATA);

  for (const cert of LINKED) {
    const anchor = new RegExp(
      `<a href="[^"]*${escapeRegExp(cert.link)}" target="_blank" rel="noopener">`
    );
    assert.match(html, anchor, `"${cert.title}" is missing target/rel protection`);
  }
});

/* ---------- engagement renderer ---------- */

test('engagement view links certificates at the engagement page depth', () => {
  const html = CVRenderer.renderEngagement(
    CV_DATA.cvProfiles.data_engineer,
    CV_DATA,
    { format: 'engagement', base: '../../' }
  );

  for (const cert of LINKED) {
    const target = `../../../${cert.link}`;
    const href = `href="${target}"`;
    assert.ok(html.includes(href), `engagement view is missing ${href}`);
    assert.ok(
      html.includes(`<li><a href="${target}"`),
      `engagement view did not use a list link for "${cert.title}"`
    );
  }
});

test('engagement view leaves unlinked certifications as plain list text', () => {
  const html = CVRenderer.renderEngagement(
    CV_DATA.cvProfiles.data_engineer,
    CV_DATA,
    { format: 'engagement', base: '../../' }
  );

  for (const cert of CV_DATA.certifications.filter((entry) => !entry.link)) {
    assert.ok(html.includes(`<li>${cert.title} — ${cert.detail}</li>`));
  }
});

/* ---------- all profiles ---------- */

test('every profile renders every certification, with links at the right depth', () => {
  for (const [key, profile] of Object.entries(CV_DATA.cvProfiles)) {
    const card = CVRenderer.renderCV(profile, CV_DATA);
    const engagement = CVRenderer.renderEngagement(profile, CV_DATA, {
      format: 'engagement',
      base: '../../',
    });

    for (const cert of CV_DATA.certifications) {
      assert.ok(card.includes(cert.title), `${key}: card view is missing "${cert.title}"`);
      assert.ok(
        engagement.includes(cert.title),
        `${key}: engagement view is missing "${cert.title}"`
      );
    }

    for (const cert of LINKED) {
      assert.ok(
        card.includes(`href="../../${cert.link}"`),
        `${key}: card link has the wrong depth`
      );
      assert.ok(
        engagement.includes(`href="../../../${cert.link}"`),
        `${key}: engagement link has the wrong depth`
      );
    }
  }
});

/* ---------- helpers ---------- */

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
