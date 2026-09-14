'use strict';

const { test, expect } = require('@playwright/test');

test('print button on a CV page triggers window.print', async ({ page }) => {
  await page.addInitScript(() => {
    window.__printed = false;
    window.print = () => {
      window.__printed = true;
    };
  });
  await page.goto('/portfolio/cv/ai-engineer.html');
  await page.click('button.control-btn.secondary');
  expect(await page.evaluate(() => window.__printed)).toBe(true);
});

test('cv/engagement/minimal.html renders conformed controls without theme toggle', async ({ page }) => {
  await page.goto('/portfolio/cv/engagement/minimal.html');
  await expect(page.locator('button.control-btn.secondary#print-btn')).toBeVisible();
  await expect(page.locator('#theme-toggle')).toHaveCount(0);
  await expect(page.locator('a.control-btn.secondary', { hasText: '← CVs' })).toBeVisible();
  expect(await page.locator('body').getAttribute('data-theme')).toBe('general');
});