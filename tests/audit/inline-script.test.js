'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, htmlFiles } = require('../helpers');

// Any <script> without a src= attribute is an inline script.
// JSON-LD structured data (type="application/ld+json") is data, not JavaScript,
// so it is exempt from the "all JS must be external files" rule.
//
// Three things the previous version of this pattern got wrong, all of which let
// a real inline script through or flagged a harmless one:
//
//  - No `i` flag, so `<SCRIPT>` and `SRC=` both slipped past the lookaheads.
//  - No comment stripping, so a commented-out `<script>` counted as an offense.
//  - The ld+json exemption required quotes around the type, so a legitimate
//    `<script type=application/ld+json>` was reported as inline JavaScript.
//
// The attribute names are matched case-insensitively (HTML attribute names are
// ASCII case-insensitive), while the tag name is likewise case-insensitive.
const INLINE_SCRIPT_RE =
  /<script(?![^>]*\ssrc\s*=)(?![^>]*\stype\s*=\s*["']?application\/ld\+json\b)/gi;

/** Drop HTML comments so a commented-out script is not counted as live markup. */
function stripHtmlComments(html) {
  return html.replace(/<!--[\s\S]*?-->/g, '');
}

/* ---------- audit ---------- */

test('no inline <script> blocks — all JS must be external files', () => {
  // Arrange / Act
  const offenders = [];
  for (const file of htmlFiles()) {
    const content = stripHtmlComments(fs.readFileSync(file, 'utf8'));
    const rel = path.relative(ROOT, file);
    const matches = content.match(INLINE_SCRIPT_RE) || [];
    if (matches.length > 0) {
      offenders.push(`${rel}: ${matches.length} inline <script> block(s)`);
    }
  }
  // Assert
  assert.deepStrictEqual(offenders, [], 'Inline <script> blocks found');
});

test('the inline-script detector actually detects the cases it claims to', () => {
  // A policy regex with no test of its own is exactly the kind of assertion that
  // can be quietly wrong. Each of these is a real bypass of the previous
  // pattern, or a false positive it used to raise.
  // Mirrors the real audit path above, comment stripping included — otherwise
  // this helper would test a pipeline the suite never actually runs.
  const flags = (html) => (stripHtmlComments(html).match(INLINE_SCRIPT_RE) || []).length;

  // Genuine offenses, including the casing bypasses.
  assert.ok(flags('<script>alert(1)</script>') === 1, 'plain inline script missed');
  assert.ok(flags('<SCRIPT>alert(1)</SCRIPT>') === 1, 'uppercase SCRIPT bypassed the check');
  assert.ok(flags('<script type="text/javascript">alert(1)</script>') === 1, 'typed JS missed');
  assert.ok(
    flags('<script TYPE="text/javascript">alert(1)</script>') === 1,
    'uppercase TYPE bypassed the check'
  );

  // Must not be flagged.
  assert.ok(flags('<script src="js/app.js"></script>') === 0, 'external script flagged');
  assert.ok(
    flags('<script SRC="js/app.js"></script>') === 0,
    'external script flagged — HTML attribute names are case-insensitive, so SRC is a src'
  );
  assert.ok(flags('<script type="application/ld+json">{}</script>') === 0, 'quoted ld+json flagged');
  assert.ok(
    flags('<script type=application/ld+json>{}</script>') === 0,
    'unquoted ld+json flagged'
  );
  assert.ok(
    flags('<!-- <script>alert(1)</script> -->') === 0,
    'a commented-out script was counted as live markup'
  );
});
