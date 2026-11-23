'use strict';

/**
 * Computed-style contrast, in a real browser, on representative text from every
 * page template. The node contrast audit verifies token pairs mathematically;
 * this verifies the cascade actually resolves those tokens to readable colours
 * on the page, including generated CV content and the dark-mode overrides.
 */

const { test, expect } = require('@playwright/test');

const PAGES = [
  {
    path: '/',
    selectors: ['.section-title', '.section-sub', '.project-desc', '.audience-card p'],
  },
  {
    path: '/portfolio/index.html',
    selectors: ['.category-title', '.cv-card h3', '.cv-card p'],
  },
  {
    path: '/portfolio/audience/ai-engineer.html',
    selectors: ['.cv-header h1', '.subtitle', '.section-title', '.section p', '.stat-label'],
  },
  {
    path: '/portfolio/cv/platform-engineer.html',
    selectors: [
      '.cv-header h1',
      '.subtitle',
      '.section-title',
      '.section p',
      '.cert-info h3 a',
      '.cert-info p',
      '.control-btn',
    ],
  },
  {
    path: '/portfolio/cv/engagement/minimal.html',
    selectors: ['h1', 'p.contact', 'h2', 'p', 'a[href$=".pdf"]'],
  },
];

test.use({ colorScheme: 'light' });

for (const { path: url, selectors } of PAGES) {
  test(`live text contrast clears WCAG AA in light and dark modes on ${url}`, async ({ page }) => {
    await page.goto(url);
    const light = await audit(page, selectors);
    assertAudit(light, url, 'light');

    await page.evaluate(() => localStorage.setItem('theme', 'dark'));
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    const dark = await audit(page, selectors);
    assertAudit(dark, url, 'dark');
  });
}

async function audit(page, selectors) {
  return page.evaluate((list) => {
    const parse = (value) => {
      const match = value.match(/rgba?\(([^)]+)\)/i);
      if (!match) return null;
      const [r, g, b, a = '1'] = match[1].split(',').map((part) => part.trim());
      return { r: Number(r), g: Number(g), b: Number(b), a: Number(a) };
    };

    const luminance = ({ r, g, b }) => {
      const channel = (value) => {
        const s = value / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
    };

    const ratio = (fg, bg) => {
      const a = luminance(fg);
      const b = luminance(bg);
      const [hi, lo] = a > b ? [a, b] : [b, a];
      return (hi + 0.05) / (lo + 0.05);
    };

    /**
     * Resolve the first opaque background up the tree. A gradient or a
     * semi-transparent layer makes the effective pixel colour unknowable
     * without rendering, so mark the sample uncheckable rather than guess.
     */
    const background = (el) => {
      for (let node = el; node; node = node.parentElement) {
        const style = getComputedStyle(node);
        if (style.backgroundImage && style.backgroundImage !== 'none') return null;
        const colour = parse(style.backgroundColor);
        if (!colour) return null;
        if (colour.a === 1) return colour;
        if (colour.a > 0) return null;
      }
      return null;
    };

    return list.map((selector) => {
      const el = document.querySelector(selector);
      if (!el) return { selector, missing: true };
      const style = getComputedStyle(el);
      const fg = parse(style.color);
      const bg = background(el);
      if (!fg || !bg) return { selector, skipped: true };
      return { selector, ratio: ratio(fg, bg), fg: style.color, bg: style.backgroundColor };
    });
  }, selectors);
}

function assertAudit(results, url, mode) {
  const checked = results.filter((result) => typeof result.ratio === 'number');
  const failed = checked.filter((result) => result.ratio < 4.5);

  expect(
    checked.length,
    `${url} (${mode}): no text samples could be checked; results ${JSON.stringify(results)}`
  ).toBeGreaterThanOrEqual(2);

  expect(
    failed.map((result) => `${result.selector} ${result.ratio.toFixed(2)}:1 (${result.fg} on ${result.bg})`),
    `${url} (${mode}) text contrast failures`
  ).toEqual([]);
}
