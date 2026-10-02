/* ============================================
   THEME STORE — single source of truth for theme
   UMD: browser -> window.ThemeStore
        Node.js -> module.exports

   Three entry points used to re-implement this logic independently
   (site-logic.js, theme.js, cv-render.js), and two of them read the
   stored value *unvalidated*. A hand-edited or stale value such as
   "neon" was written straight to <html data-theme>, which matches no
   token block and silently degrades the page to light. Every caller
   now goes through these helpers instead.
   ============================================ */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ThemeStore = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var STORAGE_KEY = 'theme';
  var DARK_QUERY = '(prefers-color-scheme: dark)';

  function isValid(theme) {
    return theme === 'dark' || theme === 'light';
  }

  /**
   * Read the stored preference, discarding anything that is not a known
   * theme. Returns null when storage is unavailable (privacy mode, blocked
   * cookies) or when the stored value is not 'dark'/'light'.
   * @returns {string|null}
   */
  function readStoredTheme() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      return isValid(stored) ? stored : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Persist the preference. No-op for unknown values and when storage is
   * unavailable, so a bad value can never be written in the first place.
   * @param {string} theme - 'dark' | 'light'
   */
  function writeStoredTheme(theme) {
    if (!isValid(theme)) return;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) { /* ignore */ }
  }

  /**
   * Whether the OS asks for a dark rendering.
   * @returns {boolean}
   */
  function systemPrefersDark() {
    return !!(
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia(DARK_QUERY).matches
    );
  }

  /**
   * Resolve the theme to apply on load.
   * Priority: stored preference > system preference > 'light'.
   * Unlike the old per-call-site logic this always returns a real theme,
   * so callers never have to decide what "null" means.
   * @param {string|null} [storedTheme] - raw stored value (unvalidated ok)
   * @param {boolean} [systemDark] - system preference
   * @returns {string} 'dark' | 'light'
   */
  function resolveInitialTheme(storedTheme, systemDark) {
    if (isValid(storedTheme)) return storedTheme;
    if (systemDark === undefined) systemDark = systemPrefersDark();
    return systemDark ? 'dark' : 'light';
  }

  /**
   * Apply the resolved theme to <html> so CSS can key off data-theme.
   * @param {Document} [doc]
   * @returns {string} the theme that was applied
   */
  function applyInitialTheme(doc) {
    var target = doc || (typeof document !== 'undefined' ? document : null);
    if (!target || !target.documentElement) return null;
    var theme = resolveInitialTheme(readStoredTheme());
    target.documentElement.setAttribute('data-theme', theme);
    return theme;
  }

  /**
   * Flip the current theme, persist it, and return the new value.
   * @param {string|null} current - current data-theme value
   * @returns {string} 'dark' | 'light'
   */
  function computeNextTheme(current) {
    return current === 'dark' ? 'light' : 'dark';
  }

  /**
   * Map a dark-mode boolean to the Font Awesome icon class.
   * Lives here rather than in a separate helper module so the toggle's
   * appearance cannot drift from the theme it represents.
   * @param {boolean} isDark
   * @returns {string} 'fas fa-sun' | 'fas fa-moon'
   */
  function iconClass(isDark) {
    return isDark ? 'fas fa-sun' : 'fas fa-moon';
  }

  var api = {
    STORAGE_KEY: STORAGE_KEY,
    DARK_QUERY: DARK_QUERY,
    isValid: isValid,
    readStoredTheme: readStoredTheme,
    writeStoredTheme: writeStoredTheme,
    systemPrefersDark: systemPrefersDark,
    resolveInitialTheme: resolveInitialTheme,
    applyInitialTheme: applyInitialTheme,
    computeNextTheme: computeNextTheme,
    iconClass: iconClass,
  };

  // In a browser, apply immediately on load. This file is loaded in <head>
  // ahead of every stylesheet precisely so the first paint already carries
  // the right theme; without this, pages with no later entry point (404.html,
  // static pages) would never get data-theme at all.
  if (typeof document !== 'undefined' && document.documentElement) {
    api.applyInitialTheme(document);
  }

  return api;
});