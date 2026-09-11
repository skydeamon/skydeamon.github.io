'use strict';

const { test, expect } = require('@playwright/test');

test.describe('root site wiring', () => {
  test('dark mode toggle flips data-theme, icon, and persists to localStorage', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'light');

    await page.click('#theme-toggle');
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('#theme-icon')).toHaveClass(/fa-sun/);
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('dark');

    await page.click('#theme-toggle');
    await expect(html).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('#theme-icon')).toHaveClass(/fa-moon/);
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('light');
  });

  test('dark mode persists across reload', async ({ page }) => {
    await page.goto('/');
    await page.click('#theme-toggle');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('system dark preference applies when nothing is stored', async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: 'dark' });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await context.close();
  });

  test.describe('mobile nav (mobile viewport)', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('mobile nav burger opens and closes the menu', async ({ page }) => {
      await page.goto('/');
      const burger = page.locator('#nav-burger');
      const navLinks = page.locator('#nav-links');

      await expect(navLinks).not.toHaveClass(/open/);
      await burger.click();
      await expect(navLinks).toHaveClass(/open/);
      await expect(burger).toHaveAttribute('aria-expanded', 'true');

      await page.locator('#nav-links .nav-link').first().click();
      await expect(navLinks).not.toHaveClass(/open/);
      await expect(burger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test('footer year matches the current year', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#year')).toHaveText(String(new Date().getFullYear()));
  });

  test('scroll reveal adds .visible when scrolled into view', async ({ page }) => {
    await page.goto('/');
    const reveal = page.locator('.reveal').last();
    await expect(reveal).not.toHaveClass(/visible/);
    await reveal.scrollIntoViewIfNeeded();
    await expect(reveal).toHaveClass(/visible/);
  });

  test('every nav link targets an existing section', async ({ page }) => {
    await page.goto('/');
    const hrefs = await page
      .locator('#nav-links .nav-link')
      .evaluateAll((els) => els.map((el) => el.getAttribute('href')));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      const id = href.replace('#', '');
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });
});