/**
 * main.js
 * 仏壇クリーニング・修復サービスサイト メインスクリプト
 * Vanilla JavaScript - no frameworks
 */

document.addEventListener('DOMContentLoaded', () => {
  // ============================================================
  // 1. Hamburger Menu Toggle
  // ============================================================
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  const navOverlay = document.getElementById('nav-overlay');

  /**
   * Open or close the mobile navigation menu.
   * Toggles classes on the hamburger button, nav panel, and overlay,
   * and keeps the aria-expanded attribute in sync.
   */
  function toggleMenu() {
    if (!hamburger || !nav) return;

    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));

    if (navOverlay) {
      navOverlay.classList.toggle('active', isOpen);
    }
  }

  /**
   * Close the mobile navigation menu (if it is open).
   */
  function closeMenu() {
    if (!hamburger || !nav) return;

    nav.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');

    if (navOverlay) {
      navOverlay.classList.remove('active');
    }
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  // Close menu when clicking the overlay
  if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
  }

  // Close menu when clicking a nav link (useful on mobile for anchor links)
  if (nav) {
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        closeMenu();
      }
    });
  }

  // ============================================================
  // 2. Header Scroll Effect
  // ============================================================
  const header = document.getElementById('header');

  if (header) {
    /**
     * Add or remove the 'scrolled' class on the header depending on
     * how far the page has been scrolled (threshold: 50px).
     */
    function handleHeaderScroll() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Run once on load in case the page is already scrolled
    handleHeaderScroll();

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  }

  // ============================================================
  // 3. Smooth Scroll – Mobile menu close on anchor click
  // ============================================================
  // CSS scroll-behavior: smooth handles the actual scrolling.
  // The menu-close on nav link click is already handled in section 1.

  // ============================================================
  // 4. Scroll Fade-in Animations (Intersection Observer)
  // ============================================================
  const animatedElements = document.querySelectorAll(
    '.fade-in, .fade-in-left, .fade-in-right, .stagger'
  );

  // Check if the user prefers reduced motion
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (animatedElements.length > 0) {
    if (prefersReducedMotion) {
      // Respect the user's preference: skip animations entirely
      animatedElements.forEach((el) => {
        el.classList.add('visible');
      });
    } else {
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      };

      const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Animate only once
          }
        });
      }, observerOptions);

      animatedElements.forEach((el) => {
        fadeObserver.observe(el);
      });
    }
  }

  // ============================================================
  // 5. FAQ Accordion
  // ============================================================
  const faqQuestions = document.querySelectorAll('.faq-item__question');

  if (faqQuestions.length > 0) {
    faqQuestions.forEach((button) => {
      button.addEventListener('click', () => {
        const parentItem = button.closest('.faq-item');
        if (!parentItem) return;

        const isActive = parentItem.classList.contains('active');
        const answer = parentItem.querySelector('.faq-item__answer');

        // Close all other open FAQ items (accordion behaviour)
        faqQuestions.forEach((otherButton) => {
          const otherItem = otherButton.closest('.faq-item');
          if (otherItem && otherItem !== parentItem && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            otherButton.setAttribute('aria-expanded', 'false');

            const otherAnswer = otherItem.querySelector('.faq-item__answer');
            if (otherAnswer) {
              otherAnswer.style.maxHeight = null;
            }
          }
        });

        // Toggle the clicked item
        parentItem.classList.toggle('active', !isActive);
        button.setAttribute('aria-expanded', String(!isActive));

        if (answer) {
          if (!isActive) {
            // Opening: set max-height to the content's natural height
            answer.style.maxHeight = answer.scrollHeight + 'px';
          } else {
            // Closing: collapse
            answer.style.maxHeight = null;
          }
        }
      });
    });
  }

  // ============================================================
  // 6. Active Navigation Highlight (fallback)
  // ============================================================
  const navLinks = document.querySelectorAll('.nav__link');

  if (navLinks.length > 0) {
    const currentPath = window.location.pathname;

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;

      // Normalise: resolve relative paths for comparison
      const linkPath = new URL(href, window.location.origin).pathname;

      if (linkPath === currentPath) {
        link.classList.add('active');
      }
    });
  }

  // ============================================================
  // 7. Contact Form Basic Validation (demo site)
  // ============================================================
  const contactForm = document.querySelector('form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert(
        'お問い合わせありがとうございます。サンプルサイトのため、実際の送信は行われません。'
      );
    });
  }
});
