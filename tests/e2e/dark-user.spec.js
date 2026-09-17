'use strict';

const { test, expect } = require('@playwright/test');

test('dark-mode user: root persists across reloads, portfolio inherits and toggles in-page', async ({ page }) => {
  // Root site persists the theme
  await page.goto('/');
  await page.click('#theme-toggle');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  // Portfolio pages inherit the stored theme (theme.js reads localStorage)
  await page.goto('/portfolio/audience/ai-engineer.html');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

  // In-page toggle works and actually changes colors (cascade fix)
  await page.click('button.control-btn');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('#theme-icon')).toHaveText('🌙');
  const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(lightBg).not.toBe(darkBg);
});