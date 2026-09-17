/* ============================================
   SITE LOGIC — pure functions (Jade Makwela)
   UMD: browser -> window.SiteLogic
        Node.js -> module.exports
   ============================================ */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SiteLogic = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /**
   * Resolve the initial theme.
   * Priority: stored preference > system dark preference > no change (null).
   * @param {string|null} storedTheme - value from localStorage ('dark' | 'light' | null)
   * @param {boolean} systemDark - matchMedia('(prefers-color-scheme: dark)').matches
   * @returns {string|null} 'dark' | 'light' | null
   */
  function getInitialTheme(storedTheme, systemDark) {
    if (storedTheme === 'dark' || storedTheme === 'light') return storedTheme;
    if (systemDark) return 'dark';
    return null;
  }

  /**
   * Read the stored theme preference safely.
   * Returns null when storage is unavailable (privacy mode, blocked storage)
   * or when the stored value is not a known theme.
   * @returns {string|null} 'dark' | 'light' | null
   */
  function readStoredTheme() {
    try {
      var stored = localStorage.getItem('theme');
      return stored === 'dark' || stored === 'light' ? stored : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Persist the theme preference safely. No-op when storage is unavailable.
   * @param {string} theme - 'dark' | 'light'
   */
  function writeStoredTheme(theme) {
    try {
      localStorage.setItem('theme', theme);
    } catch (e) { /* ignore */ }
  }

  /**
   * Compute the next theme from the current one.
   * @param {string|null} current - current data-theme value
   * @returns {string} 'dark' | 'light'
   */
  function computeNextTheme(current) {
    return current === 'dark' ? 'light' : 'dark';
  }

  /**
   * Map a dark-mode boolean to the Font Awesome icon class.
   * @param {boolean} isDark
   * @returns {string} 'fas fa-sun' | 'fas fa-moon'
   */
  function themeIconClass(isDark) {
    return isDark ? 'fas fa-sun' : 'fas fa-moon';
  }

  return {
    getInitialTheme: getInitialTheme,
    computeNextTheme: computeNextTheme,
    themeIconClass: themeIconClass,
    readStoredTheme: readStoredTheme,
    writeStoredTheme: writeStoredTheme,
  };
});