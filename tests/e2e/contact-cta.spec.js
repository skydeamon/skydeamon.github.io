'use strict';

const { test, expect } = require('@playwright/test');

test('contact CTA exposes email, mailto, and social profiles', async ({ page }) => {
  await page.goto('/');
  await page.locator('#contact').scrollIntoViewIfNeeded();

  await expect(page.locator('#contact')).toContainText('makwela.j.justice@gmail.com');

  const mailto = await page.locator('#contact a[href^="mailto:"]').first().getAttribute('href');
  expect(mailto).toContain('makwela.j.justice@gmail.com');

  const github = await page.locator('#contact a[href*="github.com"]').first().getAttribute('href');
  expect(github).toBe('https://github.com/skydeamon');

  const linkedin = await page
    .locator('#contact a[href*="linkedin.com"]')
    .first()
    .getAttribute('href');
  expect(linkedin).toBe('https://www.linkedin.com/in/jade-makwela-6a79111a8/');
});