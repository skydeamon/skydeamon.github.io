'use strict';

/**
 * Self-tests for tests/helpers.js.
 *
 * The helper parses CSS by walking braces, so it is itself test code with real
 * failure modes. A parser that silently returns [] would make every contrast
 * assertion in the suite pass vacuously, which is exactly the class of bug this
 * project already hit once.
 */

const { test } = require('node:test');
const assert = require('node:assert');
const { ruleBodies, findTokenInRule, contrastRatio, normalizeHex } = require('../helpers');

test('ruleBodies finds simple rules', () => {
  assert.deepStrictEqual(ruleBodies('.a{color:red}'), [
    { selectors: ['.a'], body: 'color:red;', atRules: [] },
  ]);
});

test('ruleBodies splits comma-separated selector lists', () => {
  const [rule] = ruleBodies('h1, h2,   h3 { color: red; }');
  assert.deepStrictEqual(rule.selectors, ['h1', 'h2', 'h3']);
});

test('ruleBodies keeps the last declaration without a trailing semicolon', () => {
  // The pre-`;` flush bug: ".a{margin:0}" produced an empty body.
  const [rule] = ruleBodies('.a{margin:0}');
  assert.strictEqual(rule.body, 'margin:0;');
  assert.strictEqual(findTokenInRule('.a{--margin:0}', () => true, 'margin').value, '0');
});

test('ruleBodies attributes rules nested in an at-rule', () => {
  const rules = ruleBodies('.a{color:red}@media (max-width:600px){.b{margin:0}}.c{padding:1px}');
  assert.strictEqual(rules.length, 3);
  assert.deepStrictEqual(rules[0].atRules, []);
  assert.deepStrictEqual(rules[1].atRules, ['@media (max-width:600px)']);
  assert.deepStrictEqual(rules[2].atRules, []);
});

test('ruleBodies handles nested at-rules without losing declarations', () => {
  const rules = ruleBodies('@media print{@media (min-width:0){.p{color:#000}}}');
  assert.strictEqual(rules.length, 1);
  assert.deepStrictEqual(rules[0].selectors, ['.p']);
  assert.strictEqual(rules[0].body, 'color:#000;');
  assert.strictEqual(rules[0].atRules.length, 2);
});

test('ruleBodies does not treat a top-level @import as a rule', () => {
  const rules = ruleBodies("@import url('x.css');\n.a{color:red}");
  assert.strictEqual(rules.length, 1);
  assert.deepStrictEqual(rules[0].selectors, ['.a']);
});

test('ruleBodies ignores commented-out rules', () => {
  // Otherwise a disabled declaration could satisfy an assertion.
  const rules = ruleBodies('.a{color:red}/* .dead{color:blue} */');
  assert.strictEqual(rules.length, 1);
  assert.strictEqual(findTokenInRule(rules && '.a{color:red}/* .dead{--x:#fff} */', (s) => s === '.dead', 'x'), null);
});

test('ruleBodies does not read a var() declaration inside a comment as a token', () => {
  const css = ':root{--primary:#2563eb} /* --primary: #000 */';
  assert.strictEqual(findTokenInRule(css, (s) => s === ':root', 'primary').value, '#2563eb');
});

test('ruleBodies survives an unterminated final block', () => {
  const rules = ruleBodies('.a{color:red');
  assert.strictEqual(rules.length, 1);
  assert.strictEqual(rules[0].body, 'color:red;');
});

test('findTokenInRule matches only the requested selector', () => {
  const css = ':root{--x:#fff}[data-theme="dark"]{--x:#000}';
  assert.strictEqual(findTokenInRule(css, (s) => s === ':root', 'x').value, '#fff');
  assert.strictEqual(findTokenInRule(css, (s) => s === '[data-theme="dark"]', 'x').value, '#000');
  assert.strictEqual(findTokenInRule(css, () => true, 'x').value, '#fff', 'first match wins');
});

test('findTokenInRule returns null for a missing token', () => {
  assert.strictEqual(findTokenInRule(':root{--x:#fff}', () => true, 'nope'), null);
});

test('findTokenInRule respects the from index for chained resolution', () => {
  const css = ':root{--a:var(--b);--b:#123456}';
  const a = findTokenInRule(css, (s) => s === ':root', 'a');
  assert.strictEqual(a.value, 'var(--b)');
  const b = findTokenInRule(css, (s) => s === ':root', 'b');
  assert.strictEqual(b.value, '#123456');
});

test('findTokenInRule does not match a token as a name prefix', () => {
  // --primary must not match --primary-dark.
  const css = ':root{--primary-dark:#123456}';
  assert.strictEqual(findTokenInRule(css, () => true, 'primary'), null);
});

test('normalizeHex expands shorthand and rejects non-hex', () => {
  assert.strictEqual(normalizeHex('#FFF'), '#ffffff');
  assert.strictEqual(normalizeHex('#abc'), '#aabbcc');
  assert.strictEqual(normalizeHex('#123456'), '#123456');
  assert.strictEqual(normalizeHex('var(--x)'), null);
  assert.strictEqual(normalizeHex('rgb(0,0,0)'), null);
});

test('contrastRatio matches known WCAG reference values', () => {
  // Black on white is the maximum, 21:1.
  assert.strictEqual(Math.round(contrastRatio('#000000', '#ffffff')), 21);
  // Identical colours have no contrast.
  assert.strictEqual(contrastRatio('#123456', '#123456'), 1);
  // Symmetric.
  assert.strictEqual(
    Math.round(contrastRatio('#2563eb', '#edf2f7')),
    Math.round(contrastRatio('#edf2f7', '#2563eb'))
  );
});

test('contrastRatio rejects values it cannot parse instead of returning NaN', () => {
  assert.throws(() => contrastRatio('#fff', 'rebeccapurple'), /not hex/);
});