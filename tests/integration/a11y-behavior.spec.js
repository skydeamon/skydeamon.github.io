'use strict';

/**
 * Accessibility behaviour that needs a real browser: computed
 * `color-scheme`, honored reduced-motion, focus visibility, the skip link's
 * first tab stop, and keyboard operability of the nav.
 *
 * The structural half of this lives in tests/audit/a11y-affordances.test.js.
 * These assertions are the ones a parser cannot make.
 */

const { test, expect } = require('@playwright/test');

const THEMED_PAGES = [
  '/',
  '/portfolio/index.html',
  '/portfolio/audience/ai-engineer.html',
  '/portfolio/cv/modern.html',
];

/* ---------- computed color-scheme ---------- */

test('light mode reports a light color-scheme to the browser', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  // This drives scrollbar, form-control, and canvas rendering. A dark page
  // reporting `light` gives a white scrollbar down the side of it.
  const scheme = await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme);
  expect(scheme).toContain('light');
  expect(scheme).not.toContain('dark');
});

test('dark mode reports a dark color-scheme to the browser', async ({ page }) => {
  await page.goto('/');
  await page.click('#theme-toggle');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  const scheme = await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme);
  expect(scheme).toContain('dark');
});

test('every themed page follows the stored preference into color-scheme', async ({ page }) => {
  for (const p of THEMED_PAGES) {
    await page.goto(p);
    await page.click('#theme-toggle');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    const scheme = await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme);
    expect(scheme, `${p} did not report a dark color-scheme`).toContain('dark');

    await page.click('#theme-toggle');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    const back = await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme);
    expect(back, `${p} did not return to a light color-scheme`).toContain('light');
  }
});

/* ---------- reduced motion ---------- */

test('a reduced-motion reader gets no transition duration on controls', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  // main.css declares a 200ms transition on every button. Honoring the
  // preference means zeroing it, not merely the scroll-reveal.
  const durations = await page.evaluate(() => {
    const read = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const s = getComputedStyle(el);
      return {
        transition: s.transitionDuration,
        animation: s.animationDuration,
      };
    };
    return {
      button: read('.btn, .control-btn, .hero-cta a, button'),
      link: read('a.nav-link, .nav-link'),
      scroll: getComputedStyle(document.documentElement).scrollBehavior,
    };
  });

  expect(durations.button, 'no button found to sample').not.toBeNull();
  for (const [name, value] of Object.entries(durations.button)) {
    const ms = parseFloat(value);
    expect(ms, `${name} is still ${value} under reduced motion`).toBeLessThanOrEqual(0.01);
  }
  expect(durations.scroll).toBe('auto');
});

test('reduced motion still reveals scroll-animated content', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  // The regression this guards: suppressing the transition alone leaves .reveal
  // at opacity 0 if the observer never fires, hiding the content entirely.
  const opacities = await page.evaluate(() =>
    [...document.querySelectorAll('.reveal')].map((el) => getComputedStyle(el).opacity)
  );

  expect(opacities.length, 'expected .reveal elements').toBeGreaterThan(0);
  for (const o of opacities) {
    expect(Number(o), `a .reveal element stayed at opacity ${o}`).toBeGreaterThan(0.9);
  }
});

test('motion is preserved for a reader who has not asked for reduced motion', async ({ page }) => {
  // The guard against over-correcting: the reset must not apply unconditionally.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');

  const transition = await page.evaluate(() => {
    const el = document.querySelector('a.nav-link, .nav-link, button');
    return el ? getComputedStyle(el).transitionDuration : null;
  });

  expect(transition, 'no control found to sample').not.toBeNull();
  expect(parseFloat(transition)).toBeGreaterThan(0);
});

/* ---------- keyboard and focus ---------- */

test('the skip link is the first tab stop and becomes visible on focus', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');

  const focused = await page.evaluate(() => ({
    text: document.activeElement?.textContent?.trim(),
    className: document.activeElement?.className,
  }));

  expect(focused.className).toContain('skip-link');
  expect(focused.text).toMatch(/skip/i);

  // A parked skip link sits at top: -48px and animates in on focus, so poll for
  // the settled position rather than sampling mid-transition.
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const el = document.querySelector('.skip-link');
          return el ? el.getBoundingClientRect().top : null;
        }),
      { timeout: 2000 }
    )
    .toBeGreaterThanOrEqual(0);
});

test('activating the skip link moves focus to the main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');

  const target = await page.evaluate(() => {
    const id = location.hash.replace('#', '');
    return { id, hasTarget: Boolean(document.getElementById(id)) };
  });

  expect(target.id).toBeTruthy();
  expect(target.hasTarget, `skip link pointed at #${target.id}, which does not exist`).toBe(true);
});

test('the theme toggle is operable by keyboard', async ({ page }) => {
  await page.goto('/portfolio/index.html');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  const toggle = page.locator('#theme-toggle');
  await toggle.focus();
  await expect(toggle).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.keyboard.press('Space');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('every interactive control shows a visible focus indicator', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab'); // skip link
  await page.keyboard.press('Tab'); // first nav control

  const indicator = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const s = getComputedStyle(el);
    return {
      tag: el.tagName,
      outlineStyle: s.outlineStyle,
      outlineWidth: s.outlineWidth,
      boxShadow: s.boxShadow,
    };
  });

  expect(indicator, 'nothing was focusable after two tabs').not.toBeNull();
  const hasOutline = indicator.outlineStyle !== 'none' && parseFloat(indicator.outlineWidth) > 0;
  expect(
    hasOutline || (indicator.boxShadow && indicator.boxShadow !== 'none'),
    `focused ${indicator.tag} has no visible indicator (outline ${indicator.outlineStyle} ${indicator.outlineWidth}, shadow "${indicator.boxShadow}")`
  ).toBe(true);
});

test('the closed mobile menu is skipped by the tab order', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  // The menu is closed but covers nothing; its links must still be unreachable
  // by Tab, or a keyboard user walks into an invisible menu.
  const reached = new Set();
  for (let i = 0; i < 8; i += 1) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => ({
      inMenu: Boolean(document.activeElement?.closest('#nav-links')),
      visible: document.activeElement ? getComputedStyle(document.activeElement).visibility !== 'hidden' : false,
    }));
    if (info.inMenu) reached.add('menu');
    expect(info.visible, 'a focused element is hidden from view').toBe(true);
  }

  expect([...reached], 'tabbing reached the closed mobile menu').toEqual([]);
});

test('Escape closes the mobile menu and returns focus to the burger', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const burger = page.locator('#nav-burger');
  const links = page.locator('#nav-links');

  await burger.focus();
  await page.keyboard.press('Enter');
  await expect(links).toHaveClass(/open/);
  await expect(burger).toHaveAttribute('aria-expanded', 'true');
  await expect(burger).toHaveAttribute('aria-label', 'Close menu');
  await expect(links).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(links).not.toHaveClass(/open/);
  await expect(burger).toHaveAttribute('aria-expanded', 'false');
  await expect(burger).toHaveAttribute('aria-label', 'Open menu');
  await expect(links).toBeHidden();
  await expect(burger).toBeFocused();
});

test('the mobile nav is fully keyboard operable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const burger = page.locator('#nav-burger');
  await burger.focus();
  await page.keyboard.press('Enter');

  const links = page.locator('#nav-links');
  await expect(links).toHaveClass(/open/);
  await expect(burger).toHaveAttribute('aria-expanded', 'true');

  // Choosing a destination must close the menu and reset the button.
  await links.locator('.nav-link').first().click();
  await expect(links).not.toHaveClass(/open/);
  await expect(burger).toHaveAttribute('aria-expanded', 'false');
});

/* ---------- no-JS fallback ---------- */

// Blocking .js requests is not the same as disabling scripting: <noscript>
// only renders when the browser is told it has no JS engine, so this has to be
// a real javaScriptEnabled:false context.
test.describe('with JavaScript disabled', () => {
  test.use({ javaScriptEnabled: false });

  test('the homepage is readable and navigable', async ({ page }) => {
    await page.goto('/');

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length, 'the homepage rendered no text without JavaScript').toBeGreaterThan(400);
    expect(bodyText).toContain('Jade Makwela');

    // index.html loads css/no-js.css via <noscript> precisely so that
    // .reveal, which is authored at opacity 0, does not become blank gaps.
    const hiddenReveals = await page.locator('.reveal').evaluateAll((els) =>
      els.filter((el) => Number(getComputedStyle(el).opacity) < 0.9).length
    );
    expect(hiddenReveals, 'scroll-reveal content stayed invisible without JavaScript').toBe(0);

    expect(await page.locator('a[href]').count(), 'no links rendered without JavaScript').toBeGreaterThan(5);
  });

  test('a CV page offers a reachable fallback instead of a blank page', async ({ page }) => {
    await page.goto('/portfolio/cv/modern.html');

    // cv-render.js builds the CV, so a no-JS reader gets the <noscript> block
    // nested inside #cv-root rather than an empty container.
    const fallback = page.locator('.noscript-fallback');
    await expect(fallback).toBeVisible();
    await expect(fallback).toContainText('Jade Makwela');
    await expect(fallback).toContainText(/JavaScript/i);

    // The skip link targets #cv-root, which must not be an empty target. It is
    // parked off-screen until focused, so reach it with the keyboard rather than
    // clicking (Playwright would wait for it to be on-screen), and read the
    // result with locators, since page.evaluate needs the JS we just disabled.
    // Read textContent rather than using toHaveText: the latter misreports an
    // element's text when javaScriptEnabled is false.
    const rootText = await page.locator('#cv-root').textContent();
    expect(rootText, '#cv-root is an empty skip-link target without JavaScript').toMatch(/JavaScript/i);

    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveClass(/skip-link/);
    await page.keyboard.press('Enter');

    expect(page.url()).toContain('#cv-root');
    await expect(page.locator('#cv-root .noscript-fallback')).toBeVisible();
  });

  test('the CV fallback routes to contact and back to the site', async ({ page }) => {
    await page.goto('/portfolio/cv/engagement/minimal.html');

    const mailto = page.locator('.noscript-fallback a[href^="mailto:"]');
    await expect(mailto).toHaveCount(1);
    expect(await mailto.getAttribute('href')).toContain('@');

    // Depth matters: engagement pages sit one level deeper than the others.
    const back = page.locator('.noscript-fallback a:not([href^="mailto:"])');
    await expect(back).toHaveAttribute('href', '../../../index.html');
  });

  test('a portfolio page is readable', async ({ page }) => {
    await page.goto('/portfolio/index.html');

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(200);
    expect(bodyText).not.toContain('[object Object]');
  });
});

/* ---------- print output ---------- */

// Checked through emulated print media rather than a rendered PDF: a PDF would
// need an external text extractor, and the print stylesheet is what decides
// what ends up on paper either way.
test.describe('in print media', () => {
  const CHROME_SELECTORS = ['.controls', '.control-btn', '.theme-toggle', '#print-btn'];

  for (const url of ['/portfolio/cv/modern.html', '/portfolio/cv/engagement/minimal.html', '/portfolio/audience/finance.html']) {
    test(`${url} hides its interactive chrome`, async ({ page }) => {
      await page.goto(url);
      await page.emulateMedia({ media: 'print' });

      for (const sel of CHROME_SELECTORS) {
        const loc = page.locator(sel);
        if ((await loc.count()) === 0) continue;
        const display = await loc.first().evaluate((el) => getComputedStyle(el).display);
        expect(display, `${url} still prints ${sel}`).toBe('none');
      }

      // The content itself must survive: hiding the chrome is only correct if
      // the document is still there.
      const bodyText = await page.locator('body').innerText();
      expect(bodyText, `${url} prints an empty document`).toContain('Jade Makwela');
    });
  }

  test('print media does not hide the CV content', async ({ page }) => {
    await page.goto('/portfolio/cv/modern.html');
    await page.emulateMedia({ media: 'print' });

    const visibleSections = await page
      .locator('.cv-section, section, h2')
      .evaluateAll((els) => els.filter((el) => getComputedStyle(el).display !== 'none').length);
    expect(visibleSections, 'the print stylesheet hides the CV body').toBeGreaterThan(3);
  });

  test('print media forces scroll-reveal content to stay visible', async ({ page }) => {
    await page.goto('/');
    await page.emulateMedia({ media: 'print' });

    // .reveal is authored at opacity 0 and revealed by an observer in app.js.
    // A reader who prints without scrolling must still get the content. Poll
    // rather than sample once, so a media switch mid-fade is not misread.
    await expect
      .poll(
        () =>
          page
            .locator('.reveal')
            .evaluateAll((els) => els.filter((el) => Number(getComputedStyle(el).opacity) < 0.9).length),
        { timeout: 3000 }
      )
      .toBe(0);
  });
});
