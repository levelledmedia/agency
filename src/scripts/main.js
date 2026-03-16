/* ============================================================
   LEVELLED MEDIA V2 — JAVASCRIPT
   - Sticky nav shadow
   - Mobile menu toggle
   - Testimonial slider
   - Accordion toggles (onboarding + FAQ)
   - Fade-up scroll animations (IntersectionObserver)
   - Coverage tabs
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. STICKY NAV — merge with hero, transition to white on scroll
  ---------------------------------------------------------- */
  const navHeader = document.getElementById('nav-header');
  const heroSection = document.getElementById('hero');

  const updateNav = () => {
    // Become "scrolled" (white) once the hero section is no longer visible
    const heroBottom = heroSection
      ? heroSection.getBoundingClientRect().bottom
      : 0;
    if (heroBottom <= navHeader.offsetHeight) {
      navHeader.classList.add('scrolled');
    } else {
      navHeader.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav(); // run on load in case page is already scrolled


  /* ----------------------------------------------------------
     2. MOBILE NAV TOGGLE
  ---------------------------------------------------------- */
  const burger = document.getElementById('nav-burger');
  const navLinks = document.getElementById('nav-links');
  const navActions = document.querySelector('.nav-actions');

  if (burger) {
    burger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navActions.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen);
    });
  }

  // Close mobile nav when a link is clicked
  document.querySelectorAll('#nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navActions.classList.remove('open');
    });
  });


  /* ----------------------------------------------------------
     3. TESTIMONIAL SLIDER
  ---------------------------------------------------------- */
  const track = document.getElementById('slider-track');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');

  if (track && prevBtn && nextBtn) {
    let currentIndex = 0;

    const getVisibleCount = () => {
      if (window.innerWidth <= 600) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
    };

    const getCardWidth = () => {
      const cards = track.querySelectorAll('.testimonial-card');
      if (!cards.length) return 0;
      const gap = 24;
      return cards[0].offsetWidth + gap;
    };

    const getMaxIndex = () => {
      const cards = track.querySelectorAll('.testimonial-card');
      const cardW = getCardWidth();
      const wrapWidth = track.parentElement.offsetWidth;
      if (!cardW) return 0;
      const visibleCount = Math.floor((wrapWidth + 24) / cardW);
      return Math.max(0, cards.length - visibleCount);
    };

    const updateSlider = () => {
      const maxIndex = getMaxIndex();
      currentIndex = Math.min(currentIndex, maxIndex);
      const offset = currentIndex * getCardWidth();
      track.style.transform = `translateX(-${offset}px)`;
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= maxIndex;
      prevBtn.style.opacity = prevBtn.disabled ? '0.4' : '1';
      nextBtn.style.opacity = nextBtn.disabled ? '0.4' : '1';
    };

    nextBtn.addEventListener('click', () => {
      if (currentIndex < getMaxIndex()) {
        currentIndex++;
        updateSlider();
      }
    });

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    });

    window.addEventListener('resize', updateSlider, { passive: true });
    updateSlider();
  }


  /* ----------------------------------------------------------
     4. ACCORDION TOGGLES — exclusive (one open at a time per group)
  ---------------------------------------------------------- */
  document.querySelectorAll('[data-accordion]').forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('accordion-item--active');

      // Find the closest containing group (accordion-list or faq-list)
      const group = item.closest('.accordion-list, .faq-list');

      if (group) {
        // Close all siblings in the same group
        group.querySelectorAll('.accordion-item').forEach(sibling => {
          sibling.classList.remove('accordion-item--active');
        });
      }

      // Open this one unless it was already open (acts as a toggle)
      if (!isActive) {
        item.classList.add('accordion-item--active');
      }
    });
  });


  /* ----------------------------------------------------------
     4b. SIDEWAYS EXPANDING PROCESS PANELS
  ---------------------------------------------------------- */
  const processPanels = document.querySelectorAll('[data-panel]');
  processPanels.forEach(panel => {
    panel.addEventListener('click', () => {
      if (panel.classList.contains('process-panel--active')) return;
      processPanels.forEach(p => p.classList.remove('process-panel--active'));
      panel.classList.add('process-panel--active');
    });
  });


  /* ----------------------------------------------------------
     5. PHONE SLIDE-UP (IntersectionObserver — triggers on scroll into view)
  ---------------------------------------------------------- */
  const phoneEl = document.querySelector('.hero-device--phone');
  if (phoneEl) {
    const phoneObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          phoneEl.classList.add('phone-visible');
          phoneObserver.unobserve(phoneEl);
        }
      });
    }, { threshold: 0.2 });
    phoneObserver.observe(phoneEl);
  }

  /* ----------------------------------------------------------
     5b. SERVICES CARD PHONE MOCKUP — slide-up on scroll into view
  ---------------------------------------------------------- */
  const cardPhoneImg = document.querySelector('.split-card-phone-img');
  const cardPhoneWrapper = document.querySelector('.split-card-phone');
  if (cardPhoneImg && cardPhoneWrapper) {
    const cardPhoneObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Delay until after the parent fade-up transition completes (600ms)
          setTimeout(() => cardPhoneImg.classList.add('phone-slide-visible'), 600);
          cardPhoneObserver.unobserve(cardPhoneWrapper);
        }
      });
    }, { threshold: 0 });
    cardPhoneObserver.observe(cardPhoneWrapper);
  }

  /* ----------------------------------------------------------
     5c. SERVICES CARD BROWSER MOCKUP — slide-in from right on scroll into view
  ---------------------------------------------------------- */
  const browserImg = document.querySelector('.split-card-browser-img--animated');
  const browserWrapper = document.querySelector('.split-card-browser');
  if (browserImg && browserWrapper) {
    const browserObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => browserImg.classList.add('browser-slide-visible'), 600);
          browserObserver.unobserve(browserWrapper);
        }
      });
    }, { threshold: 0 });
    browserObserver.observe(browserWrapper);
  }

  /* ----------------------------------------------------------
     5d. SEO CARD BROWSER FRAME — slide-up on scroll into view
  ---------------------------------------------------------- */
  const browserFrameImg = document.querySelector('.split-card-browser-frame > .split-card-browser-img');
  const browserFrameWrapper = document.querySelector('.split-card-browser-frame');
  if (browserFrameImg && browserFrameWrapper) {
    const browserFrameObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => browserFrameImg.classList.add('browser-frame-slide-visible'), 600);
          browserFrameObserver.unobserve(browserFrameWrapper);
        }
      });
    }, { threshold: 0 });
    browserFrameObserver.observe(browserFrameWrapper);
  }


  /* ----------------------------------------------------------
     7. FADE-UP SCROLL ANIMATIONS (IntersectionObserver)
  ---------------------------------------------------------- */
  const fadeEls = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          // Stagger siblings slightly
          const siblings = entry.target.parentElement
            ? Array.from(entry.target.parentElement.querySelectorAll('.fade-up'))
            : [];
          const sibIndex = siblings.indexOf(entry.target);
          const delay = sibIndex * 80;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all immediately
    fadeEls.forEach(el => el.classList.add('visible'));
  }


  /* ----------------------------------------------------------
     6. COVERAGE TABS
  ---------------------------------------------------------- */
  const tabBtns = document.querySelectorAll('.tab-btn');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('tab-btn--active'));
      btn.classList.add('tab-btn--active');
      // In a real implementation, filter countries by tab.active value
      // For now, just toggle active state visually.
    });
  });


  /* ----------------------------------------------------------
     8. BUTTON RIPPLE EFFECT
  ---------------------------------------------------------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('pointerenter', (e) => {
      const rect = btn.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;

      const diameter = Math.ceil(Math.sqrt(rect.width ** 2 + rect.height ** 2)) * 2;

      const ripple = document.createElement('span');
      ripple.classList.add('btn-ripple');
      ripple.style.width  = diameter + 'px';
      ripple.style.height = diameter + 'px';
      ripple.style.left   = localX + 'px';
      ripple.style.top    = localY + 'px';

      // Colour: white ripple on dark buttons, dark ripple on light buttons
      ripple.style.background = btn.classList.contains('btn-dark')
        ? 'rgba(255,255,255,0.45)'
        : 'rgba(0,33,43,0.18)';

      btn.appendChild(ripple);

      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    });
  });


  /* ----------------------------------------------------------
     6b. AUTO-SCROLL CAROUSEL — clone cards for seamless infinite loop
  ---------------------------------------------------------- */
  const autoTrack = document.getElementById('auto-carousel-track');
  if (autoTrack) {
    // Clone all cards and append so the -50% translateX loops seamlessly
    const cards = Array.from(autoTrack.children);
    cards.forEach(card => autoTrack.appendChild(card.cloneNode(true)));
  }

  /* ----------------------------------------------------------
     7. SMOOTH SCROLL OFFSET (for sticky nav height)
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = navHeader ? navHeader.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

});
