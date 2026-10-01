/* ============================================
   PRE-PAINT THEME INITIALISATION
   Loaded synchronously in <head>, before any stylesheet renders,
   so a stored or system dark preference never flashes a light page.

   Priority: stored preference > system preference > light.

   Deliberately standalone (no dependency on site-logic.js, which loads at
   end of body) and dependency-free so it can run before first paint.
   ============================================ */
(function () {
  'use strict';

  var root = document.documentElement;

  var stored = null;
  try {
    stored = window.localStorage.getItem('theme');
  } catch (e) {
    /* Storage blocked (privacy mode / disabled cookies): fall back to system. */
  }

  var theme = null;
  if (stored === 'dark' || stored === 'light') {
    theme = stored;
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme = 'dark';
  }

  root.setAttribute('data-theme', theme || 'light');
})();