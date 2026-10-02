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

test('dark mode is applied before the stylesheet loads, with no light flash', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('theme', 'dark'));

  // Record network order and the attribute as soon as the head is parsed.
  // If the theme were applied by scripts at the end of <body>, the stylesheet
  // would already have been fetched and the browser would paint light first.
  // theme-store.js is the pre-paint entry point; theme-init.js was the
  // predecessor that this replaced.
  const order = [];
  page.on('request', (req) => {
    const url = req.url();
    if (url.endsWith('/js/theme-store.js')) order.push('theme-store');
    else if (/\/css\/(main|portfolio|themes|cv-minimal|portfolio-hub)\.css$/.test(url)) {
      order.push('css');
    } else if (url.endsWith('/js/app.js') || url.endsWith('/js/theme.js')) {
      order.push('body-script');
    }
  });

  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      window.__themeAtDCL = document.documentElement.getAttribute('data-theme');
    });
  });

  await page.reload();

  // The theme script must be fetched first, and must run before any
  // stylesheet that could paint the light default.
  expect(order[0], `resource order was ${order.join(' -> ')}`).toBe('theme-store');
  expect(order.indexOf('theme-store')).toBeLessThan(order.indexOf('css'));
  // theme-store must not merely be fetched first; it must have applied the
  // theme by the time the DOM is ready, which is what prevents the flash.
  expect(await page.evaluate(() => window.__themeAtDCL)).toBe('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('dark hero text meets WCAG AA contrast in dark mode', async ({ page }) => {
  await page.goto('/');
  await page.click('#theme-toggle');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  // The hero sits on --bg-tertiary, the darkest surface the brand tokens meet.
  const { heroSubColor, heroBg } = await page.evaluate(() => {
    const hero = document.querySelector('.hero');
    const sub = document.querySelector('.hero-sub');
    return {
      heroSubColor: getComputedStyle(sub).color,
      heroBg: getComputedStyle(hero).backgroundColor,
    };
  });

  expect(contrastRatio(heroSubColor, heroBg)).toBeGreaterThanOrEqual(4.5);
});

test('dark links meet WCAG AA contrast on every page surface', async ({ page }) => {
  const pages = [
    { path: '/', surface: '.hero' },
    { path: '/portfolio/audience/ai-engineer.html', surface: 'body' },
    { path: '/portfolio/cv/cto.html', surface: 'body' },
  ];

  for (const { path: url, surface } of pages) {
    await page.goto(url);
    // Portfolio/CV pages expose their own toggle; the root site uses #theme-toggle.
    const toggle = page.locator('#theme-toggle, button.control-btn').first();
    if ((await page.locator('html').getAttribute('data-theme')) !== 'dark') {
      await toggle.click();
    }
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    const result = await page.evaluate((sel) => {
      const link = document.querySelector('main a, .cv-content a');
      const bgEl = document.querySelector(sel);
      return {
        linkColor: getComputedStyle(link).color,
        bg: getComputedStyle(bgEl).backgroundColor,
      };
    }, surface);

    expect(
      contrastRatio(result.linkColor, result.bg),
      `${url} link ${result.linkColor} on ${result.bg}`
    ).toBeGreaterThanOrEqual(4.5);
  }
});

/* ---------- WCAG relative luminance ---------- */

function parseColor(value) {
  const rgb = value.match(/rgba?\(([^)]+)\)/);
  if (rgb) {
    const [r, g, b] = rgb[1].split(',').map((n) => parseFloat(n));
    return [r, g, b];
  }
  const hex = value.replace('#', '');
  const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

function channel(c) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function contrastRatio(fg, bg) {
  const a = parseColor(fg);
  const b = parseColor(bg);
  const la =
    0.2126 * channel(a[0]) + 0.7152 * channel(a[1]) + 0.0722 * channel(a[2]);
  const lb =
    0.2126 * channel(b[0]) + 0.7152 * channel(b[1]) + 0.0722 * channel(b[2]);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}