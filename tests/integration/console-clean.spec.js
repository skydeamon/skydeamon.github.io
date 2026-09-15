'use strict';

const { test, expect } = require('@playwright/test');

// Every page of the site (root + 27 portfolio pages).
const PAGES = [
  '/',
  '/portfolio/index.html',
  '/portfolio/audience/general.html',
  '/portfolio/audience/data-engineer.html',
  '/portfolio/audience/ai-engineer.html',
  '/portfolio/audience/academic.html',
  '/portfolio/audience/freelance.html',
  '/portfolio/audience/executive.html',
  '/portfolio/cv/job-application.html',
  '/portfolio/cv/data-engineer.html',
  '/portfolio/cv/ai-engineer.html',
  '/portfolio/cv/academic.html',
  '/portfolio/cv/freelance-portfolio.html',
  '/portfolio/cv/executive.html',
  '/portfolio/cv/modern.html',
  '/portfolio/cv/engagement/minimal.html',
  '/portfolio/cv/full-time.html',
  '/portfolio/cv/contract.html',
  '/portfolio/cv/part-time.html',
  '/portfolio/cv/engagement/full-time.html',
  '/portfolio/cv/engagement/contract.html',
  '/portfolio/cv/engagement/part-time.html',
  '/portfolio/cover-letters/general.html',
  '/portfolio/cover-letters/data-engineer.html',
  '/portfolio/cover-letters/ai-engineer.html',
  '/portfolio/cover-letters/freelance.html',
  '/portfolio/cover-letters/executive.html',
];

for (const url of PAGES) {
  test(`no console errors or failed requests on ${url}`, async ({ page }) => {
    const problems = [];
    page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`));
    page.on('requestfailed', (req) =>
      problems.push(`requestfailed: ${req.url()} ${req.failure()?.errorText ?? ''}`)
    );
    page.on('response', (res) => {
      if (res.status() >= 400) problems.push(`http ${res.status()}: ${res.url()}`);
    });

    await page.goto(url, { waitUntil: 'networkidle' });
    expect(problems).toEqual([]);
  });
}