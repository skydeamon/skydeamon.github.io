'use strict';

const { test, expect } = require('@playwright/test');

test('hub -> audience -> CV -> hub -> root navigation', async ({ page }) => {
  await page.goto('/portfolio/index.html');
  await expect(page).toHaveTitle(/CV Collection/);

  // Hub -> audience page
  await page.click('a[href="audience/ai-engineer.html"]');
  await expect(page).toHaveURL(/audience\/ai-engineer\.html$/);
  await expect(page.locator('body')).toHaveAttribute('data-theme', 'ai-engineer');

  // Audience -> full CV
  await page.click('a[href="../cv/ai-engineer.html"]');
  await expect(page).toHaveURL(/\/cv\/ai-engineer\.html$/);

  // CV -> back to hub
  await page.click('a[href="../index.html"]');
  await expect(page).toHaveURL(/portfolio\/index\.html$/);

  // Hub -> root home
  await page.click('a[href="../index.html"]');
  await expect(page).toHaveURL(/index\.html$/);
  await expect(page.locator('#home')).toBeVisible();
});

test('root audience card opens the matching audience page', async ({ page }) => {
  await page.goto('/');
  await page.click('a.audience-card[href="portfolio/audience/ai-engineer.html"]');
  await expect(page).toHaveURL(/audience\/ai-engineer\.html$/);
  await expect(page.locator('body')).toHaveAttribute('data-theme', 'ai-engineer');
});