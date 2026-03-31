/* ==========================================================================
   Angavu Metrics — Main JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Mobile Navigation Toggle ----------
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');

  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      navList.classList.toggle('nav__list--open');
      navToggle.setAttribute(
        'aria-expanded',
        navList.classList.contains('nav__list--open')
      );
    });

    // Close on clicking a nav link
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('nav__list--open');
      });
    });
  }

  // ---------- Header Scroll Shadow ----------
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 10) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------- Smooth Anchor Scrolling ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---------- Intersection Observer — Fade-in on scroll ----------
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.service-card, .project-card, .testimonial-card, .pillar, .value-item, .team-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Add visible state styles
  const style = document.createElement('style');
  style.textContent = `
    .is-visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  // ---------- Contact Form Handling ----------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic client-side validation
      const requiredFields = contactForm.querySelectorAll('[required]');
      let isValid = true;

      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = 'var(--color-error)';
        } else {
          field.style.borderColor = '';
        }
      });

      // Email validation
      const emailField = contactForm.querySelector('[type="email"]');
      if (emailField && emailField.value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value)) {
          isValid = false;
          emailField.style.borderColor = 'var(--color-error)';
        }
      }

      if (isValid) {
        // In production, this would submit to a backend
        const successMsg = document.createElement('div');
        successMsg.style.cssText = 'padding: 1rem; background: #38A169; color: white; border-radius: 8px; margin-top: 1rem; font-family: var(--font-heading); font-weight: 600;';
        successMsg.textContent = 'Thank you! Your message has been received. We will be in touch shortly.';
        contactForm.appendChild(successMsg);
        contactForm.reset();

        setTimeout(() => successMsg.remove(), 5000);
      }
    });
  }

  // ---------- Active Navigation Highlighting ----------
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('nav__link--active');
    }
  });

  // ---------- Back to Top Button ----------
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    const toggleBackToTop = () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('is-visible');
      } else {
        backToTop.classList.remove('is-visible');
      }
    };
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Close mobile nav on outside click ----------
  document.addEventListener('click', (e) => {
    const navList = document.getElementById('navList');
    const navToggle = document.getElementById('navToggle');
    if (navList && navToggle && navList.classList.contains('nav__list--open')) {
      if (!navList.contains(e.target) && !navToggle.contains(e.target)) {
        navList.classList.remove('nav__list--open');
      }
    }
  });
});
