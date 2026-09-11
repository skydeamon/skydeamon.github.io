'use strict';

const { test, expect } = require('@playwright/test');

test.describe('mobile hiring manager (390x844)', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('navigates via burger menu and reaches a CV', async ({ page }) => {
    await page.addInitScript(() => {
      window.print = () => {};
    });

    // Root: burger menu navigation
    await page.goto('/');
    await page.click('#nav-burger');
    await expect(page.locator('#nav-links')).toHaveClass(/open/);
    await page.click('#nav-links a[href="#projects"]');
    await expect(page.locator('#projects')).toBeVisible();

    // Audience page on mobile: controls visible, print + toggle work
    await page.goto('/portfolio/audience/ai-engineer.html');
    await expect(page.locator('button.control-btn.secondary')).toBeVisible();
    await page.click('button.control-btn.secondary');
    await page.click('button.control-btn');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});