'use strict';

const { test, expect } = require('@playwright/test');
const path = require('node:path');
const { ROOT } = require('../helpers');

const CV_DATA = require(path.join(ROOT, 'js', 'cv-data.js'));
const LINKED = CV_DATA.certifications.filter((cert) => cert.link);

test('platform engineering journey: root -> hub -> Platform Engineer CV -> certificate links', async ({ page, request }) => {
  const problems = [];
  page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`));
  page.on('requestfailed', (req) => problems.push(`requestfailed: ${req.url()}`));

  await page.goto('/');
  await page.click('a[href="portfolio/index.html"]');
  await expect(page).toHaveURL(/portfolio\/index\.html$/);

  await page.click('a.cv-card[href="cv/platform-engineer.html"]');
  await expect(page).toHaveURL(/\/cv\/platform-engineer\.html$/);
  await expect(page.locator('body')).toHaveAttribute('data-theme', 'modern');
  await expect(page.locator('h1')).toContainText('Jade Makwela');
  await expect(page.locator('h2.section-title', { hasText: 'Certifications' })).toBeVisible();

  for (const cert of LINKED) {
    const link = page.locator('.cert-info h3 a', { hasText: cert.title });
    await expect(link).toHaveAttribute('href', `../../${cert.link}`);

    const response = await request.get(`/${cert.link}`);
    expect(response.status(), `${cert.link} status`).toBe(200);
    expect(response.headers()['content-type']).toMatch(/^application\/pdf\b/i);
  }

  await page.click('a.control-btn[href="../index.html"]');
  await expect(page).toHaveURL(/portfolio\/index\.html$/);

  expect(problems).toEqual([]);
});

test('Platform Engineer CV deep link keeps its accent and navigation', async ({ page }) => {
  await page.goto('/portfolio/cv/platform-engineer.html');

  await expect(page).toHaveTitle(/Platform Engineer/);
  await expect(page.locator('body')).toHaveAttribute('data-theme', 'modern');
  await expect(page.locator('h1')).toContainText('Jade Makwela');

  await expect(page.locator('a.control-btn[href="../index.html"]')).toBeVisible();
  await expect(page.locator('a.control-btn[href="../../index.html"]')).toBeVisible();
});
