'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, htmlFiles, cssFiles } = require('./helpers');

const VALID_THEMES = ['general', 'data-engineer', 'ai-engineer', 'academic', 'freelance', 'executive', 'modern'];

// Pages that intentionally keep the default navy palette (no inline theme block existed).
const NO_THEME_PAGES = [
  'portfolio/cover-letters/general.html',
  'portfolio/index.html',
];

test('no references to the old shared_styles.css remain', () => {
  const offenders = [];
  for (const file of [...htmlFiles(), ...cssFiles()]) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('shared_styles')) offenders.push(path.relative(ROOT, file));
  }
  assert.deepStrictEqual(offenders, [], 'shared_styles.css still referenced');
});

test('no inline <style> blocks remain in any HTML file', () => {
  const offenders = [];
  for (const file of htmlFiles()) {
    const content = fs.readFileSync(file, 'utf8');
    if (/<style[\s>]/.test(content)) offenders.push(path.relative(ROOT, file));
  }
  assert.deepStrictEqual(offenders, [], 'Inline <style> blocks still present');
});

test('all authored CSS lives under css/ (fontawesome is the only vendored exception)', () => {
  const outside = cssFiles()
    .map((f) => path.relative(ROOT, f))
    .filter((f) => !f.startsWith('css/') && !f.startsWith('fontawesome/'));
  assert.deepStrictEqual(outside, [], 'CSS files outside css/');
});

test('css/ contains the expected consolidated files', () => {
  const expected = ['css/main.css', 'css/portfolio.css', 'css/themes.css', 'css/portfolio-hub.css', 'css/cv-minimal.css'];
  for (const f of expected) {
    assert.ok(fs.existsSync(path.join(ROOT, f)), `${f} missing`);
  }
});

test('every themed page links themes.css and has a valid data-theme', () => {
  const themed = [];
  for (const file of htmlFiles()) {
    const rel = path.relative(ROOT, file);
    if (!rel.startsWith('portfolio/')) continue;
    const content = fs.readFileSync(file, 'utf8');
    const themeMatch = content.match(/<body data-theme="([^"]+)"/);
    if (themeMatch) {
      themed.push(rel);
      assert.ok(VALID_THEMES.includes(themeMatch[1]), `${rel}: invalid theme "${themeMatch[1]}"`);
      // Engagement pages get their accent from cv-minimal.css [data-theme] mapping,
      // so they do not link themes.css.
      const isEngagement = rel.startsWith('portfolio/cv/engagement/');
      if (!isEngagement) {
        assert.ok(content.includes('themes.css'), `${rel}: themed page missing themes.css link`);
      }
    }
  }
  assert.strictEqual(themed.length, 24, 'expected exactly 24 themed pages');
});

test('pages without data-theme are exactly the default-palette set', () => {
  const untagged = [];
  for (const file of htmlFiles()) {
    const rel = path.relative(ROOT, file);
    if (!rel.startsWith('portfolio/')) continue;
    const content = fs.readFileSync(file, 'utf8');
    if (!/<body data-theme=/.test(content)) untagged.push(rel);
  }
  assert.deepStrictEqual(untagged.sort(), [...NO_THEME_PAGES].sort());
});

test('themes.css defines all 7 theme selectors', () => {
  const themes = fs.readFileSync(path.join(ROOT, 'css/themes.css'), 'utf8');
  for (const t of VALID_THEMES) {
    assert.ok(themes.includes(`[data-theme="${t}"]`), `missing theme selector for "${t}"`);
  }
});

test('portfolio pages link portfolio.css (cv/engagement pages link cv-minimal.css instead)', () => {
  for (const file of htmlFiles()) {
    const rel = path.relative(ROOT, file);
    if (!rel.startsWith('portfolio/')) continue;
    const content = fs.readFileSync(file, 'utf8');
    const isEngagement = rel.startsWith('portfolio/cv/engagement/');
    if (isEngagement) {
      assert.ok(content.includes('cv-minimal.css'), `${rel} must link cv-minimal.css`);
      assert.ok(!content.includes('portfolio.css'), `${rel} must not link portfolio.css`);
    } else {
      assert.ok(content.includes('portfolio.css'), `${rel} missing portfolio.css link`);
    }
  }
});

test('portfolio/index.html links portfolio-hub.css', () => {
  const content = fs.readFileSync(path.join(ROOT, 'portfolio/index.html'), 'utf8');
  assert.ok(content.includes('portfolio-hub.css'), 'hub missing portfolio-hub.css link');
});

test('portfolio.css dark-mode block comes after the light/:root block (cascade fix)', () => {
  const css = fs.readFileSync(path.join(ROOT, 'css/portfolio.css'), 'utf8');
  const lightIdx = css.indexOf('[data-theme="light"], :root');
  const darkIdx = css.indexOf('[data-theme="dark"]');
  assert.ok(lightIdx !== -1, 'portfolio.css missing [data-theme="light"], :root block');
  assert.ok(darkIdx !== -1, 'portfolio.css missing [data-theme="dark"] block');
  assert.ok(
    darkIdx > lightIdx,
    '[data-theme="dark"] must appear AFTER [data-theme="light"], :root so dark vars win the cascade'
  );
});