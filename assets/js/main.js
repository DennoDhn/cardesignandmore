(function () {
  'use strict';

  /* Kontakt-Konstanten (Telefon/WhatsApp: 0421 43300620 – vom Betreiber bestätigen) */
  var SITE = {
    phoneTel: '+4942143300620',
    phoneDisplay: '0421 43300620',
    email: 'Car-Design-More-kontakt@T-Online.de',
    whatsapp: '4942143300620'
  };

  /* ── Mobile navigation ─────────────────────────────────── */
  var navToggle = document.querySelector('.nav-toggle');
  var mainNav = document.querySelector('.main-nav');

  function closeMobileNav() {
    if (!navToggle || !mainNav) return;
    navToggle.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      mainNav.classList.toggle('is-open');
      document.body.style.overflow = !expanded ? 'hidden' : '';
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth < 960) closeMobileNav();
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
        closeMobileNav();
        navToggle.focus();
      }
    });
  }

  /* ── Sticky header scroll state ────────────────────────── */
  var siteHeader = document.querySelector('.site-header');

  if (siteHeader) {
    var onScroll = function () {
      siteHeader.classList.toggle('is-scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Active navigation link ────────────────────────────── */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPage === '') currentPage = 'index.html';

  document.querySelectorAll('.nav-list a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href || href.indexOf('#') === 0) return;
    var linkPage = href.split('/').pop();
    if (linkPage === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ── Scroll reveal ─────────────────────────────────────── */
  var revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length) {
    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
      );
      revealElements.forEach(function (el) { revealObserver.observe(el); });
    } else {
      revealElements.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  /* ── Lightbox (Leistungsbeispiele) ─────────────────────── */
  var lightbox = document.getElementById('lightbox');

  if (lightbox) {
    var lightboxImg = lightbox.querySelector('.lightbox-content img');
    var lightboxCaption = lightbox.querySelector('.lightbox-caption');
    var lightboxClose = lightbox.querySelector('.lightbox-close');
    var lastFocused = null;

    function releaseBodyScroll() {
      if (!mainNav || !mainNav.classList.contains('is-open')) {
        document.body.style.overflow = '';
      }
    }

    function openLightbox(src, alt, caption) {
      if (!lightboxImg || !src) return;
      lastFocused = document.activeElement;
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      if (lightboxCaption) lightboxCaption.textContent = caption || alt || '';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      if (lightboxImg) lightboxImg.removeAttribute('src');
      releaseBodyScroll();
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    document.querySelectorAll('[data-lightbox]').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var img = trigger.querySelector('img');
        var src = trigger.getAttribute('data-lightbox') || (img ? img.getAttribute('src') : '');
        var alt = img ? img.getAttribute('alt') : '';
        var caption = trigger.getAttribute('data-caption') || alt || '';
        openLightbox(src, alt, caption);
      });

      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          trigger.click();
        }
      });

      if (trigger.tagName !== 'BUTTON' && trigger.tagName !== 'A') {
        if (!trigger.hasAttribute('tabindex')) trigger.setAttribute('tabindex', '0');
        if (!trigger.hasAttribute('role')) trigger.setAttribute('role', 'button');
      }
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
    });
  }

  /* ── Contact form mailto ───────────────────────────────── */
  var contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameEl = contactForm.querySelector('[name="name"]');
      var emailEl = contactForm.querySelector('[name="email"]');
      var phoneEl = contactForm.querySelector('[name="phone"]');
      var subjectEl = contactForm.querySelector('[name="subject"]');
      var messageEl = contactForm.querySelector('[name="message"]');
      if (!nameEl || !emailEl || !messageEl) return;

      var body = [
        'Name: ' + nameEl.value.trim(),
        'E-Mail: ' + emailEl.value.trim(),
        phoneEl && phoneEl.value.trim() ? 'Telefon: ' + phoneEl.value.trim() : '',
        '',
        messageEl.value.trim()
      ].filter(Boolean).join('\n');

      var subj = subjectEl ? subjectEl.value.trim() : 'Anfrage über die Website';
      window.location.href = 'mailto:' + SITE.email + '?subject=' +
        encodeURIComponent(subj) + '&body=' + encodeURIComponent(body);
    });
  }
})();
