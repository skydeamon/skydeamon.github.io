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

test('cv/ats/minimal.html is the ATS outlier: print-btn, no toggle, no data-theme', async ({ page }) => {
  await page.goto('/portfolio/cv/ats/minimal.html');
  await expect(page.locator('button.print-btn')).toBeVisible();
  await expect(page.locator('button.control-btn')).toHaveCount(0);
  expect(await page.locator('html').getAttribute('data-theme')).toBeNull();
  expect(await page.locator('body').getAttribute('data-theme')).toBeNull();
});