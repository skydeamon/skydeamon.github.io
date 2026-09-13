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
  '/portfolio/audience/modern.html',
  '/portfolio/cv_job_application.html',
  '/portfolio/cv_data_engineer.html',
  '/portfolio/cv_ai_engineer.html',
  '/portfolio/cv_academic.html',
  '/portfolio/cv_freelance_portfolio.html',
  '/portfolio/cv_executive.html',
  '/portfolio/cv_modern.html',
  '/portfolio/cv_minimal.html',
  '/portfolio/cv_full_time.html',
  '/portfolio/cv_contract.html',
  '/portfolio/cv_part_time.html',
  '/portfolio/cv_full_time_ats.html',
  '/portfolio/cv_contract_ats.html',
  '/portfolio/cv_part_time_ats.html',
  '/portfolio/cover_letter_general.html',
  '/portfolio/cover_letter_data_engineer.html',
  '/portfolio/cover_letter_ai_engineer.html',
  '/portfolio/cover_letter_freelance.html',
  '/portfolio/cover_letter_executive.html',
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