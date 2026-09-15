'use strict';

const { test, expect } = require('@playwright/test');

const THEME_EXPECTATIONS = [
  { url: '/portfolio/audience/general.html', theme: 'general', primary: '#2563eb' },
  { url: '/portfolio/audience/data-engineer.html', theme: 'data-engineer', primary: '#0d9488' },
  { url: '/portfolio/audience/ai-engineer.html', theme: 'ai-engineer', primary: '#7c3aed' },
  { url: '/portfolio/audience/academic.html', theme: 'academic', primary: '#1f2937' },
  { url: '/portfolio/audience/freelance.html', theme: 'freelance', primary: '#ea580c' },
  { url: '/portfolio/audience/executive.html', theme: 'executive', primary: '#111827' },
];

for (const { url, theme, primary } of THEME_EXPECTATIONS) {
  test(`audience page "${theme}" applies its accent palette`, async ({ page }) => {
    await page.goto(url);
    await expect(page.locator('body')).toHaveAttribute('data-theme', theme);
    const primaryVar = await page.evaluate(() =>
      getComputedStyle(document.body).getPropertyValue('--primary').trim()
    );
    expect(primaryVar).toBe(primary);
  });
}

test('dark mode toggle on a portfolio page changes computed colors (cascade fix)', async ({ page }) => {
  await page.goto('/portfolio/audience/ai-engineer.html');
  const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

  await page.click('button.control-btn');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('#theme-icon')).toHaveText('☀️');

  const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(darkBg).not.toBe(lightBg);
});

test('portfolio pages load portfolio.css and themes.css', async ({ page }) => {
  await page.goto('/portfolio/audience/data-engineer.html');
  const stylesheets = await page.evaluate(() =>
    [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.getAttribute('href'))
  );
  expect(stylesheets.some((s) => s.includes('portfolio.css'))).toBeTruthy();
  expect(stylesheets.some((s) => s.includes('themes.css'))).toBeTruthy();
});