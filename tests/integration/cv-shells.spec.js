'use strict';

/**
 * The CV collection is generated from one renderer, so a break in a shared
 * section can affect every one of the 29 shells. This exercises each real shell
 * with its own data-profile/format/base attributes, asserting the profile
 * accent, rendered header, controls, and certificate links.
 */

const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT } = require('../helpers');

const CV_DATA = require(path.join(ROOT, 'js', 'cv-data.js'));
const LINKED = CV_DATA.certifications.filter((cert) => cert.link);

function certHref(cert, prefix) {
  return /^https?:\/\//i.test(cert.link) ? cert.link : `${prefix}${cert.link}`;
}

function shells() {
  const out = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.html')) out.push(full);
    }
  };
  walk(path.join(ROOT, 'portfolio', 'cv'));
  return out.sort();
}

function dataAttr(html, name) {
  return new RegExp(`data-${name}="([^"]*)"`).exec(html)?.[1] ?? null;
}

for (const shell of shells()) {
  const rel = path.relative(ROOT, shell).split(path.sep).join('/');
  const source = fs.readFileSync(shell, 'utf8');
  const profileKey = dataAttr(source, 'profile');
  const format = dataAttr(source, 'format');
  const profile = CV_DATA.cvProfiles[profileKey];
  const engagement = format === 'engagement';
  const prefix = engagement ? '../../../' : '../../';

  test(`${rel} renders profile "${profileKey}" with controls and certificate links`, async ({ page }) => {
    expect(profile, `${rel}: unknown profile "${profileKey}"`).toBeTruthy();

    await page.goto(`/${rel}`);
    await expect(page.locator('body')).toHaveAttribute('data-theme', profile.theme);
    await expect(page.locator('h1')).toContainText(CV_DATA.contact.name);
    await expect(page.locator('#print-btn')).toBeVisible();

    if (engagement) {
      await expect(page.locator('#theme-toggle')).toHaveCount(0);
    } else {
      await expect(page.locator('#theme-toggle')).toHaveCount(1);
    }

    // Card format wraps certificates in cards; engagement format is a flat
    // document with list links. Both are generated from the same certification
    // data, so both must expose the same PDFs at the right depth.
    const certSelector = engagement ? 'a' : '.cert-info h3 a';
    if (!engagement) {
      const certLinks = page.locator(certSelector);
      await expect(certLinks).toHaveCount(LINKED.length);
    }

    for (const cert of LINKED) {
      const linkLocator = page.getByRole('link', { name: cert.title, exact: true });
      await expect(linkLocator).toHaveAttribute('href', certHref(cert, prefix));
    }
  });
}
