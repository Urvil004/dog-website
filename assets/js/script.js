/**
 * Apex K9 Dog Training Academy - Interactive Frontend Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Hero Banner Slider
  // =========================================================================
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  let currentSlide = 0;
  let slideInterval = null;

  function showSlide(index) {
    if (!slides.length) return;
    slides.forEach((slide) => slide.classList.remove('active'));
    dots.forEach((dot) => dot.classList.remove('active'));

    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) {
      dots[currentSlide].classList.add('active');
    }
  }

  function startSlideTimer() {
    stopSlideTimer();
    slideInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 6000);
  }

  function stopSlideTimer() {
    if (slideInterval) clearInterval(slideInterval);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentSlide + 1);
      startSlideTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentSlide - 1);
      startSlideTimer();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
      startSlideTimer();
    });
  });

  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopSlideTimer);
    heroSection.addEventListener('mouseleave', startSlideTimer);

    // Touch swipe support on mobile physical devices
    let touchStartX = 0;
    let touchEndX = 0;
    heroSection.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSection.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDiff = touchEndX - touchStartX;
      if (Math.abs(swipeDiff) > 40) {
        if (swipeDiff < 0) {
          showSlide(currentSlide + 1);
        } else {
          showSlide(currentSlide - 1);
        }
        startSlideTimer();
      }
    }, { passive: true });

    startSlideTimer();
  }

  // =========================================================================
  // 2. Sticky Header & Active Nav Link on Scroll
  // =========================================================================
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const scrollTopBtn = document.querySelector('.scroll-top-btn');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Header background toggle
    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Scroll to Top visibility
    if (scrollTopBtn) {
      if (scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    // Nav active section highlight
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================================
  // 3. Mobile Navigation Menu Toggle & Backdrop
  // =========================================================================
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navBackdrop = document.querySelector('.nav-backdrop');

  function openMobileNav() {
    if (!navMenu || !mobileToggle) return;
    navMenu.classList.add('open');
    mobileToggle.classList.add('active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    if (navBackdrop) navBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!navMenu || !mobileToggle) return;
    navMenu.classList.remove('open');
    mobileToggle.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    if (navBackdrop) navBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close menu when clicking nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    // Close menu when clicking backdrop overlay
    if (navBackdrop) {
      navBackdrop.addEventListener('click', () => {
        closeMobileNav();
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMobileNav();
      }
    });

    // Auto-close if resized to desktop viewport
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
        closeMobileNav();
      }
    });
  }

  // Close mobile nav when clicking the drawer modal CTA button
  const navDrawerBookBtn = document.getElementById('nav-drawer-book-btn');
  if (navDrawerBookBtn) {
    navDrawerBookBtn.addEventListener('click', () => {
      closeMobileNav();
    });
  }

  // =========================================================================
  // 4. Interactive Program Recommendation Quiz
  // =========================================================================
  const quizAge = document.getElementById('quiz-age');
  const quizIssue = document.getElementById('quiz-issue');
  const quizFormat = document.getElementById('quiz-format');
  const quizResultTitle = document.getElementById('quiz-result-title');
  const quizResultDesc = document.getElementById('quiz-result-desc');
  const quizBookBtn = document.getElementById('quiz-book-btn');

  function calculateRecommendation() {
    if (!quizAge || !quizIssue || !quizFormat) return;

    const age = quizAge.value;
    const issue = quizIssue.value;
    const format = quizFormat.value;

    let title = 'Complete K9 Obedience Academy';
    let desc = 'Balanced 4-week program covering core leash manners, impulse control, and polite greeting.';
    let programVal = 'Complete Obedience';

    if (age === 'puppy') {
      title = 'Puppy Foundation & Socialization (8-16 Wks)';
      desc = 'Addresses housebreaking, biting inhibition, crate training, and early positive socialization.';
      programVal = 'Puppy Foundation';
    } else if (issue === 'aggression' || issue === 'anxiety') {
      title = 'Behavioral Rehab & Reactivity Boot Camp';
      desc = 'Science-backed desensitization for fear, leash barking, barrier aggression, and deep anxiety.';
      programVal = 'Behavior Modification';
    } else if (format === 'board_train') {
      title = 'Elite 3-Week Board & Train Immersion';
      desc = 'Your dog stays with our master trainers for 24/7 dedicated training, with complete owner transfer sessions.';
      programVal = 'Board & Train';
    } else if (issue === 'agility') {
      title = 'K9 Athletic Agility & Mental Conditioning';
      desc = 'High-energy obstacle handling, confidence building, and advanced off-leash teamwork.';
      programVal = 'Agility & Sport';
    }

    if (quizResultTitle) quizResultTitle.textContent = title;
    if (quizResultDesc) quizResultDesc.textContent = desc;

    if (quizBookBtn) {
      quizBookBtn.setAttribute('data-target-program', programVal);
    }
  }

  [quizAge, quizIssue, quizFormat].forEach((select) => {
    if (select) select.addEventListener('change', calculateRecommendation);
  });

  if (quizBookBtn) {
    quizBookBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetProg = quizBookBtn.getAttribute('data-target-program') || 'Complete Obedience';
      openBookingModal(targetProg);
    });
  }

  // =========================================================================
  // 5. Gallery Filter
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      galleryItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');
        if (filterVal === 'all' || itemCategory === filterVal) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // =========================================================================
  // 6. Interactive FAQ Accordion
  // =========================================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all
        faqItems.forEach((other) => other.classList.remove('active'));

        // Toggle clicked
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // =========================================================================
  // 7. Booking Modal Logic
  // =========================================================================
  const modalBackdrop = document.querySelector('.modal-backdrop');
  const modalCloseBtn = document.querySelector('.modal-close-btn');
  const modalTriggerBtns = document.querySelectorAll('[data-open-modal]');
  const modalProgramSelect = document.getElementById('modal-program-select');

  function openBookingModal(defaultProgram = '') {
    if (!modalBackdrop) return;
    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (modalProgramSelect && defaultProgram) {
      modalProgramSelect.value = defaultProgram;
    }
  }

  function closeBookingModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalTriggerBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const prog = btn.getAttribute('data-program') || '';
      openBookingModal(prog);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeBookingModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeBookingModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('active')) {
      closeBookingModal();
    }
  });

  // =========================================================================
  // 8. Toast Notification Utility
  // =========================================================================
  function showToast(message) {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
      <span>${message}</span>
    `;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  // =========================================================================
  // 9. Consultation Form Submissions
  // =========================================================================
  const mainBookingForm = document.getElementById('main-consultation-form');
  const modalBookingForm = document.getElementById('modal-consultation-form');

  function handleFormSubmit(form, isModal = false) {
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `Submitting...`;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
        form.reset();

        if (isModal) {
          closeBookingModal();
        }

        showToast('Consultation request received! Our trainer will contact you within 2 hours.');
      }, 1000);
    });
  }

  handleFormSubmit(mainBookingForm, false);
  handleFormSubmit(modalBookingForm, true);

  // Newsletter Form
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      newsletterForm.reset();
      showToast('Thank you for subscribing to our K9 training guides!');
    });
  }
});
