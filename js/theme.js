/**
 * Theme toggle + print handler for portfolio pages.
 * Expects: <button id="theme-toggle"> with <span id="theme-icon">🌙</span> " Dark"
 */
(function () {
  'use strict';

  var btn = document.getElementById('theme-toggle');
  var icon = document.getElementById('theme-icon');
  var root = document.documentElement;

  if (btn && icon) {
    /* Apply stored or system theme on load */
    var stored = localStorage.getItem('theme');
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var initial = stored || (systemDark ? 'dark' : null);
    if (initial) root.setAttribute('data-theme', initial);

    function syncIcon() {
      var isDark = root.getAttribute('data-theme') === 'dark';
      icon.textContent = isDark ? '\u2600\uFE0F' : '\uD83C\uDF19';
      var label = icon.parentElement.lastChild;
      if (label) label.textContent = isDark ? ' Light' : ' Dark';
    }

    syncIcon();

    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      syncIcon();
    });
  }

  var printBtn = document.getElementById('print-btn');
  if (printBtn) {
    printBtn.addEventListener('click', function () { window.print(); });
  }
})();
