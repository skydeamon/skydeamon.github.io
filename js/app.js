/* ============================================
   MAIN SITE SCRIPT — Jade Makwela
   Version: 2.0
   Features: dark mode, mobile nav, smooth scroll,
             scroll reveal, navbar shadow
   ============================================ */

(function () {
  'use strict';

  /* ---------- Dark Mode Toggle ---------- */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const root = document.documentElement;

  // Initial theme: localStorage > system preference > light
  const storedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = SiteLogic.getInitialTheme(storedTheme, systemDark);

  if (initialTheme) {
    root.setAttribute('data-theme', initialTheme);
  }

  function updateThemeIcon() {
    const isDark = root.getAttribute('data-theme') === 'dark';
    themeIcon.className = SiteLogic.themeIconClass(isDark);
  }

  updateThemeIcon();

  themeToggle.addEventListener('click', function () {
    const current = root.getAttribute('data-theme');
    const next = SiteLogic.computeNextTheme(current);
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon();
  });

  /* ---------- Mobile Nav ---------- */
  const navBurger = document.getElementById('nav-burger');
  const navLinks = document.getElementById('nav-links');

  navBurger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    navBurger.setAttribute('aria-expanded', String(isOpen));
    navBurger.innerHTML = isOpen
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  });

  // Close mobile nav when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navBurger.setAttribute('aria-expanded', 'false');
      navBurger.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });

  /* ---------- Navbar Shadow on Scroll ---------- */
  const navbar = document.getElementById('navbar');

  function onScroll() {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

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