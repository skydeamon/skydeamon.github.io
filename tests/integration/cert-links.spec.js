'use strict';

const { test, expect } = require('@playwright/test');
const path = require('node:path');
const { ROOT } = require('../helpers');

const CV_DATA = require(path.join(ROOT, 'js', 'cv-data.js'));
const LINKED = CV_DATA.certifications.filter((cert) => cert.link);

function certHref(cert, prefix) {
  return /^https?:\/\//i.test(cert.link) ? cert.link : `${prefix}${cert.link}`;
}

test('Platform Engineer CV renders every certificate link at the CV depth', async ({ page, request }) => {
  await page.goto('/portfolio/cv/platform-engineer.html');

  await expect(page.locator('body')).toHaveAttribute('data-theme', 'modern');
  await expect(page.locator('h1')).toContainText('Jade Makwela');

  const links = page.locator('.cert-info h3 a');
  await expect(links).toHaveCount(LINKED.length);

  for (const cert of LINKED) {
    const link = page.getByRole('link', { name: cert.title, exact: true });
    await expect(link).toHaveCount(1);
    await expect(link).toHaveAttribute('href', certHref(cert, '../../'));
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);

    if (!/^https?:\/\//i.test(cert.link)) {
      const response = await request.get(`/${cert.link}`);
      expect(response.status(), `${cert.link} status`).toBe(200);
      expect(response.headers()['content-type']).toMatch(/^application\/pdf\b/i);
    }
  }
});

test('engagement CV renders every certificate link at the engagement depth', async ({ page }) => {
  await page.goto('/portfolio/cv/engagement/minimal.html');

  for (const cert of LINKED) {
    const link = page.getByRole('link', { name: cert.title, exact: true });
    await expect(link).toHaveAttribute('href', certHref(cert, '../../../'));
  }
});

test('all certificates open in a new tab with opener protection', async ({ page }) => {
  await page.goto('/portfolio/cv/platform-engineer.html');

  for (const cert of LINKED) {
    const link = page.getByRole('link', { name: cert.title, exact: true });
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
  }
});
