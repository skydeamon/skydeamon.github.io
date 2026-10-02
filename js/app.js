/* ============================================
   MAIN SITE SCRIPT — Jade Makwela
   Version: 2.1
   Features: dark mode, mobile nav, smooth scroll,
             scroll reveal, navbar shadow

   Every feature below is guarded by its own
   dependencies rather than assuming the whole page
   assembled correctly. This file is a single IIFE,
   so one unguarded lookup used to be enough to kill
   every feature after it: a missing ThemeStore threw
   on the first line and took the nav, the navbar
   shadow, the reveal observer and the footer year
   with it.
   ============================================ */

(function () {
  'use strict';

  const root = document.documentElement;

  // Announce that this script is running, and will therefore reveal .reveal
  // elements. main.css only applies the pre-reveal hidden state under `html.js`,
  // so if this file never executes — blocked, 404, parse error — the class is
  // never added and the content renders at its natural opacity instead of
  // staying invisible forever. This is a parser-blocking script at the end of
  // <body>, so it runs before first paint and the reveal costs no flash.
  root.classList.add('js');

  /* ---------- Dark Mode Toggle ---------- */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  // ThemeStore is the single source of truth for the theme: it already
  // applied the resolved theme pre-paint from <head>, so this only re-asserts
  // it and provides the toggle. No localStorage access lives here.
  //
  // The store is read inside the guard rather than at the top of the IIFE, so
  // a store that failed to load costs only the toggle. The theme itself is
  // still correct: theme-store.js applies it in <head>, before this file runs.
  const store = window.ThemeStore;

  if (themeToggle && themeIcon && store) {
    function updateThemeIcon() {
      const isDark = root.getAttribute('data-theme') === 'dark';
      themeIcon.className = store.iconClass(isDark);
    }

    updateThemeIcon();

    themeToggle.addEventListener('click', function () {
      const next = store.computeNextTheme(root.getAttribute('data-theme'));
      root.setAttribute('data-theme', next);
      store.writeStoredTheme(next);
      updateThemeIcon();
    });
  }

  /* ---------- Mobile Nav ---------- */
  const navBurger = document.getElementById('nav-burger');
  const navLinks = document.getElementById('nav-links');

  /**
   * Single source of truth for the nav's open state.
   *
   * The closed state has to be restated in four places: the class, the
   * aria-expanded value, the icon, and the accessible name. Updating them
   * together is the only way to keep them from drifting apart, which is how the
   * button ends up reading "Open menu" while the menu is already open.
   *
   * @param {boolean} open
   * @param {boolean} restoreFocus - return focus to the burger after closing
   */
  function setNavOpen(open, restoreFocus) {
    navLinks.classList.toggle('open', open);
    navBurger.setAttribute('aria-expanded', String(open));
    navBurger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navBurger.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    if (!open && restoreFocus) navBurger.focus();
  }

  if (navBurger && navLinks) {
    navBurger.addEventListener('click', function () {
      setNavOpen(!navLinks.classList.contains('open'), false);
    });

    // Close mobile nav when a link is clicked
    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        // The click is navigating, so focus is not restored to the burger.
        setNavOpen(false, false);
      });
    });

    // Escape dismisses the menu and hands focus back to the control that opened
    // it. Without this, a keyboard user who opens the menu can only close it by
    // reaching the burger again, and a menu that covers the page leaves no other
    // way out. Scoped to the nav so a page with no menu registers no listener.
    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape' && event.key !== 'Esc') return;
      if (!navLinks.classList.contains('open')) return;
      setNavOpen(false, true);
    });
  }

  /* ---------- Navbar Shadow on Scroll ---------- */
  const navbar = document.getElementById('navbar');

  if (navbar) {
    function onScroll() {
      if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Scroll Reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ---------- Footer Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
