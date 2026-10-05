'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const path = require('node:path');
const { ROOT, htmlFiles, readHtml } = require('../helpers');

/* ---------- helpers ---------- */

const ORIGIN = 'https://skydeamon.github.io';

/** The absolute URL a page should declare as its canonical. */
function canonicalFor(rel) {
  if (rel === 'index.html') return `${ORIGIN}/`;
  if (rel.endsWith('/index.html')) return `${ORIGIN}/${rel.slice(0, -'index.html'.length)}`;
  return `${ORIGIN}/${rel}`;
}

const isNoindex = (html) => /name="robots"[^>]*noindex/i.test(html);

/** Value of a <meta name="…"> or <meta property="…"> content attribute. */
const meta = (html, kind, key) =>
  new RegExp(`<meta\\s+${kind}="${key}"\\s+content="([^"]*)"`).exec(html)?.[1] ?? null;

const link = (html, rel) => new RegExp(`link rel="${rel}" href="([^"]*)"`).exec(html)?.[1] ?? null;
const has = (html, re) => re.test(html);

/** The page's own <title> / description, used as the expected social values. */
const titleOf = (html) => /<title>([\s\S]*?)<\/title>/.exec(html)?.[1] ?? null;
const descriptionOf = (html) => meta(html, 'name', 'description');

/* ---------- audit ---------- */

// Each of these pages used to ship without canonical/OG/Twitter tags, and two
// of them collided on the same <title>. The invariants below are what stop a
// page from quietly dropping back out of the social metadata, and what stop two
// pages from competing for the same identity again.
test('every indexable page carries a self-referential canonical URL', () => {
  for (const file of htmlFiles()) {
    const html = readHtml(file);
    if (isNoindex(html)) {
      // A canonical on an error page points search engines at a dead URL.
      assert.equal(link(html, 'canonical'), null, `${file}: noindex page must not declare a canonical`);
      continue;
    }
    const rel = path.relative(ROOT, file);
    assert.equal(link(html, 'canonical'), canonicalFor(rel), `${file}: canonical must be its own absolute URL`);
  }
});

test('every indexable page carries a complete, internally consistent social card', () => {
  for (const file of htmlFiles()) {
    const html = readHtml(file);
    if (isNoindex(html)) continue;
    const where = path.relative(ROOT, file);
    const title = titleOf(html);
    const description = descriptionOf(html);
    assert.ok(title, `${where}: has a <title> to mirror`);
    assert.ok(description, `${where}: has a description to mirror`);

    assert.ok(has(html, /meta property="og:type" content="(website|profile)"/), `${where}: og:type`);
    assert.equal(meta(html, 'property', 'og:title'), title, `${where}: og:title must match <title>`);
    assert.equal(meta(html, 'property', 'og:url'), link(html, 'canonical'), `${where}: og:url must match canonical`);
    // og:description is allowed to be shorter than the search meta description:
    // social previews truncate near 200 characters, and index.html hand-trims its
    // own for that reason. It only has to exist and stay unique.
    assert.ok(meta(html, 'property', 'og:description'), `${where}: og:description`);
    assert.ok(meta(html, 'property', 'og:image'), `${where}: og:image`);

    // A twitter:card with no title/description/image is a card with nothing to
    // render: Twitter shows a blank tile. All three payload tags are required.
    assert.ok(has(html, /meta name="twitter:card" content="summary_large_image"/), `${where}: twitter:card`);
    assert.equal(meta(html, 'name', 'twitter:title'), title, `${where}: twitter:title must match <title>`);
    // Twitter mirrors OG exactly, so a card never disagrees with the link preview.
    assert.equal(meta(html, 'name', 'twitter:description'), meta(html, 'property', 'og:description'), `${where}: twitter:description must match og:description`);
    assert.equal(meta(html, 'name', 'twitter:image'), meta(html, 'property', 'og:image'), `${where}: twitter:image must match og:image`);
  }
});

test('no two indexable pages share a title, canonical, or social description', () => {
  // Duplicates are why portfolio/audience/general.html and
  // portfolio/cv/job-application.html both ranked as "General CV": two URLs,
  // one identity, so search engines picked one and dropped the other.
  const seen = { title: new Map(), canonical: new Map(), description: new Map() };
  const fields = {
    title: (html) => titleOf(html),
    canonical: (html) => link(html, 'canonical'),
    description: (html) => meta(html, 'property', 'og:description'),
  };

  for (const file of htmlFiles()) {
    const html = readHtml(file);
    if (isNoindex(html)) continue;
    const where = path.relative(ROOT, file);
    for (const [field, read] of Object.entries(fields)) {
      const value = read(html);
      assert.ok(value, `${where}: has an ${field}`);
      const prior = seen[field].get(value);
      assert.equal(prior, undefined, `${field} "${value}" is claimed by both ${prior} and ${where}`);
      seen[field].set(value, where);
    }
  }
});

test('every social image resolves to a file that exists', () => {
  const fs = require('node:fs');
  for (const file of htmlFiles()) {
    const html = readHtml(file);
    if (isNoindex(html)) continue;
    for (const prop of ['og:image', 'twitter:image']) {
      const url = meta(html, prop === 'og:image' ? 'property' : 'name', prop);
      assert.ok(url?.startsWith(`${ORIGIN}/`), `${path.relative(ROOT, file)}: ${prop} must be absolute`);
      // Same-origin only: an external image would silently break the preview.
      const target = path.join(ROOT, url.slice(ORIGIN.length + 1));
      assert.ok(fs.existsSync(target), `${path.relative(ROOT, file)}: ${prop} -> ${url} does not exist`);
    }
  }
});

test('the sitemap lists exactly the indexable pages, at their canonical URLs', () => {
  const fs = require('node:fs');
  const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.ok(listed.length > 0, 'sitemap.xml has <loc> entries');

  const expected = new Set();
  for (const file of htmlFiles()) {
    const html = readHtml(file);
    if (isNoindex(html)) continue;
    expected.add(link(html, 'canonical'));
  }

  assert.equal(new Set(listed).size, listed.length, 'sitemap has no duplicate URLs');
  // GitHub Pages serves portfolio/index.html at /portfolio/, so a sitemap entry
  // pointing at the .html file advertises a URL that disagrees with the page's
  // own canonical and splits that page's signals.
  assert.deepEqual(
    listed.filter((u) => !expected.has(u)).sort(),
    [],
    'every sitemap URL matches a page canonical',
  );
  assert.deepEqual(
    [...expected].filter((u) => !listed.includes(u)).sort(),
    [],
    'every indexable page is listed in the sitemap',
  );
});
