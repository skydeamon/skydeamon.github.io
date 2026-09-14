'use strict';

const { test, expect } = require('@playwright/test');

test('recruiter journey: root -> AI Engineer -> full CV -> hub -> modern CV', async ({ page }) => {
  const problems = [];
  page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`));
  page.on('requestfailed', (req) => problems.push(`requestfailed: ${req.url()}`));

  // Land on the root site
  await page.goto('/');
  await expect(page).toHaveTitle(/Jade Makwela/);
  await expect(page.locator('#home h1')).toBeVisible();

  // Root -> AI Engineer audience page
  await page.click('a.audience-card[href="portfolio/audience/ai-engineer.html"]');
  await expect(page).toHaveURL(/audience\/ai-engineer\.html$/);
  await expect(page.locator('body')).toHaveAttribute('data-theme', 'ai-engineer');

  // Audience -> full CV
  await page.click('a[href="../cv/ai-engineer.html"]');
  await expect(page).toHaveURL(/\/cv\/ai-engineer\.html$/);
  await expect(page.locator('h2.section-title', { hasText: 'Professional Experience' })).toBeVisible();
  await expect(page.locator('h2.section-title', { hasText: 'References' })).toBeVisible();

  // CV -> back to hub
  await page.click('a[href="../index.html"]');
  await expect(page).toHaveURL(/portfolio\/index\.html$/);

  // Hub -> Modern CV
  await page.click('a.cv-card[href="cv/modern.html"]');
  await expect(page).toHaveURL(/\/cv\/modern\.html$/);
  await expect(page.locator('body')).toHaveAttribute('data-theme', 'modern');

  expect(problems).toEqual([]);
});