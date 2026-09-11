'use strict';

const { test, expect } = require('@playwright/test');

test('dark-mode user: root persists across reloads, portfolio toggles in-page', async ({ page }) => {
  // Root site persists the theme
  await page.goto('/');
  await page.click('#theme-toggle');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  // Portfolio pages do NOT persist (known product limitation: inline JS, no localStorage)
  await page.goto('/portfolio/audience/ai-engineer.html');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  // In-page toggle works and actually changes colors (cascade fix)
  await page.click('button.control-btn');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('#theme-icon')).toHaveText('☀️');
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).not.toBe('rgb(255, 255, 255)');
});