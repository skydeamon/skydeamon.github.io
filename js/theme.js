/**
 * Theme toggle + print handler for portfolio pages.
 * Expects: <button id="theme-toggle"> with <span id="theme-icon">🌙</span> " Dark"
 *
 * The theme itself is already applied pre-paint by ThemeStore, which is loaded
 * in <head>. This file only drives the toggle UI, so it holds no theme state
 * and reads no storage directly.
 */
(function () {
  'use strict';

  var store = window.ThemeStore;

  var btn = document.getElementById('theme-toggle');
  var icon = document.getElementById('theme-icon');
  var root = document.documentElement;

  if (btn && icon) {
    function syncIcon() {
      var isDark = root.getAttribute('data-theme') === 'dark';
      icon.textContent = isDark ? '\u2600\uFE0F' : '\uD83C\uDF19';
      var label = null;
      var nodes = icon.parentElement.childNodes;
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType === 3 && nodes[i].textContent.trim()) {
          label = nodes[i];
          break;
        }
      }
      if (label) label.textContent = isDark ? ' Light' : ' Dark';
    }

    syncIcon();

    btn.addEventListener('click', function () {
      var next = store.computeNextTheme(root.getAttribute('data-theme'));
      root.setAttribute('data-theme', next);
      store.writeStoredTheme(next);
      syncIcon();
    });
  }

  var printBtn = document.getElementById('print-btn');
  if (printBtn) {
    printBtn.addEventListener('click', function () { window.print(); });
  }
})();