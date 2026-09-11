'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

/** Recursively collect files with the given extension, skipping VCS/tooling dirs. */
function walk(dir, ext, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === '.opencode' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, ext, out);
    else if (entry.name.endsWith(ext)) out.push(full);
  }
  return out;
}

const htmlFiles = () => walk(ROOT, '.html');
const cssFiles = () => walk(ROOT, '.css');

/** Extract every href/src/srcset/data-src value from an HTML file. */
function extractLocalRefs(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const refs = [];
  const re = /(?:href|src|srcset|data-src)="([^"]*)"/g;
  let m;
  while ((m = re.exec(content))) {
    const raw = m[1];
    // srcset may be comma-separated: "a.jpg 1x, b.jpg 2x"
    for (const part of raw.split(',')) {
      const ref = part.trim().split(/\s+/)[0];
      if (ref) refs.push(ref);
    }
  }
  return refs;
}

/** True for references that point at local files (not protocols or fragments). */
function isLocalRef(ref) {
  return !/^(https?:|mailto:|tel:|javascript:|data:|#)/.test(ref) && ref !== '';
}

/** Resolve a reference relative to the referencing file; strips query/hash. */
function resolveRef(filePath, ref) {
  const clean = ref.split('#')[0].split('?')[0];
  if (!clean) return null;
  return path.resolve(path.dirname(filePath), clean);
}

module.exports = { ROOT, htmlFiles, cssFiles, extractLocalRefs, isLocalRef, resolveRef };