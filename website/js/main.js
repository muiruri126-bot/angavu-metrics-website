/* ==========================================================================
   Angavu Metrics — Main JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Scroll Progress Bar ----------
  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = progress + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // ---------- Mobile Navigation Toggle (Animated Hamburger + Drawer) ----------
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');

  // Create overlay element for mobile nav
  let navOverlay = document.getElementById('navOverlay');
  if (!navOverlay) {
    navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    navOverlay.id = 'navOverlay';
    document.body.appendChild(navOverlay);
  }

  let navIsOpen = false;

  function openMobileNav() {
    navIsOpen = true;
    navList.classList.add('nav__list--open');
    navToggle.classList.add('is-active');
    navToggle.setAttribute('aria-expanded', 'true');
    navOverlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  }

  function closeMobileNav() {
    navIsOpen = false;
    navList.classList.remove('nav__list--open');
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
    navOverlay.classList.remove('is-visible');
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  }

  function toggleMobileNav(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (navIsOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }

  if (navToggle && navList) {
    // Use both click and touchend for maximum mobile compatibility
    navToggle.addEventListener('click', toggleMobileNav);
    navToggle.addEventListener('touchend', function(e) {
      e.preventDefault(); // Prevent ghost click
      toggleMobileNav(e);
    }, { passive: false });

    // Close on clicking a nav link
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        if (navIsOpen) closeMobileNav();
      });
    });

    // Close on overlay click/touch
    navOverlay.addEventListener('click', closeMobileNav);
    navOverlay.addEventListener('touchend', function(e) {
      e.preventDefault();
      closeMobileNav();
    }, { passive: false });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navIsOpen) {
        closeMobileNav();
        navToggle.focus();
      }
    });

    // Close on window resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navIsOpen) {
        closeMobileNav();
      }
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

  // ---------- Intersection Observer — Staggered Fade-in on Scroll ----------
  const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Apply staggered delays to groups of elements
  const animateElements = document.querySelectorAll(
    '.service-card, .project-card, .testimonial-card, .pillar, .value-item, .team-card, .why-item, .methodology-card, .impact-number, .highlight-card, .resource-tile, .resource-card, .thematic-tag'
  );

  animateElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.6s ease ${(index % 3) * 0.12}s, transform 0.6s ease ${(index % 3) * 0.12}s`;
    observer.observe(el);
  });

  // Also animate section headers
  document.querySelectorAll('.section-header, .about-intro > div, .contact-grid > div').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.7s ease ${index * 0.1}s, transform 0.7s ease ${index * 0.1}s`;
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

  // ---------- Contact Form Handling (Formspree AJAX) ----------
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
        const formData = new FormData(contactForm);
        const actionUrl = contactForm.getAttribute('action');
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        fetch(actionUrl, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        })
        .then(response => {
          if (response.ok) {
            const successMsg = document.createElement('div');
            successMsg.style.cssText = 'padding: 1rem 1.25rem; background: linear-gradient(135deg, #38A169, #2F855A); color: white; border-radius: 8px; margin-top: 1rem; font-family: var(--font-heading); font-weight: 600; font-size: 0.95rem;';
            successMsg.textContent = 'Thank you! Your message has been received. We will be in touch within two working days.';
            contactForm.appendChild(successMsg);
            contactForm.reset();
            setTimeout(() => {
              successMsg.style.transition = 'opacity 0.4s ease';
              successMsg.style.opacity = '0';
              setTimeout(() => successMsg.remove(), 400);
            }, 6000);
          } else {
            throw new Error('Form submission failed');
          }
        })
        .catch(() => {
          const errorMsg = document.createElement('div');
          errorMsg.style.cssText = 'padding: 1rem 1.25rem; background: #E53E3E; color: white; border-radius: 8px; margin-top: 1rem; font-family: var(--font-heading); font-weight: 600; font-size: 0.95rem;';
          errorMsg.textContent = 'Something went wrong. Please email us directly at info@angavumetrics.com';
          contactForm.appendChild(errorMsg);
          setTimeout(() => errorMsg.remove(), 6000);
        })
        .finally(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        });
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

  // ---------- Subtle Parallax on Hero ----------
  const hero = document.querySelector('.hero');
  const heroVisual = document.querySelector('.hero__visual');
  if (hero && heroVisual) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroVisual.style.transform = `translateY(calc(-50% + ${scrollY * 0.15}px))`;
      }
    }, { passive: true });
  }

  // ---------- Form Input Focus Labels ----------
  document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('form-group--focused');
    });
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('form-group--focused');
    });
    // Clear error state on input
    input.addEventListener('input', () => {
      input.style.borderColor = '';
    });
  });

  // ---------- Swipe-to-Close Mobile Nav (right swipe) ----------
  if (navList) {
    let touchStartX = 0;
    let touchStartY = 0;
    navList.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    navList.addEventListener('touchend', (e) => {
      const diffX = e.changedTouches[0].screenX - touchStartX;
      const diffY = Math.abs(e.changedTouches[0].screenY - touchStartY);
      if (diffX > 60 && diffY < 100 && navIsOpen) {
        closeMobileNav();
      }
    }, { passive: true });
  }

  // ---------- Smooth reveal for page header ----------
  const pageHeader = document.querySelector('.page-header');
  if (pageHeader) {
    pageHeader.style.opacity = '0';
    pageHeader.style.transform = 'translateY(-10px)';
    pageHeader.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    requestAnimationFrame(() => {
      pageHeader.style.opacity = '1';
      pageHeader.style.transform = 'translateY(0)';
    });
  }

  // ---------- Secondary Quick-Links Bar ----------
  const quickLinks = document.getElementById('quickLinks');
  if (quickLinks) {
    let lastScrollY = 0;
    const showQuickLinks = () => {
      const scrollY = window.scrollY;
      // Show after scrolling past 300px
      if (scrollY > 300) {
        quickLinks.classList.add('is-visible');
      } else {
        quickLinks.classList.remove('is-visible');
      }
      lastScrollY = scrollY;
    };
    window.addEventListener('scroll', showQuickLinks, { passive: true });
    showQuickLinks();
  }

  // ---------- Hero entrance animation ----------
  const heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
    heroContent.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
      });
    });
  }

  const heroStats = document.querySelector('.hero__stats');
  if (heroStats) {
    heroStats.style.opacity = '0';
    heroStats.style.transform = 'translateY(20px)';
    heroStats.style.transition = 'opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        heroStats.style.opacity = '1';
        heroStats.style.transform = 'translateY(0)';
      });
    });
  }

});
