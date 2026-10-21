/**
 * Boutique Canine Behavioral Academy - Interactive Controller
 * Modules:
 * 1. Smooth anchor navigation for CTAs
 * 2. Section 3: Training Program Discovery & Deterministic Path Matcher
 * 3. Accessible consultation inquiry modal dialog
 * Zero external dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. Smooth Anchor Navigation
     ========================================================================== */
  const actionButtons = document.querySelectorAll('a[href^="#"]');
  
  actionButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const targetHash = button.getAttribute('href');
      if (targetHash && targetHash !== '#') {
        const targetElement = document.querySelector(targetHash);
        if (targetElement) {
          event.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          if (targetElement.hasAttribute('tabindex')) {
            targetElement.focus();
          }
        }
      }
    });
  });

  /* ==========================================================================
     2. Section 3: Training Program Discovery & Deterministic Matcher
     ========================================================================== */
  const programsSection = document.getElementById('programs');
  if (!programsSection) return;

  // DOM Elements
  const stageButtons = programsSection.querySelectorAll('.redesign-programs__stage');
  const programCards = programsSection.querySelectorAll('.redesign-programs__card');
  const matcherToggleBtn = document.getElementById('matcherToggleBtn');
  const matcherQuestions = document.getElementById('matcherQuestions');
  const matcherToggleBadge = document.getElementById('matcherToggleBadge');

  const matchAgeSelect = document.getElementById('matchAge');
  const matchGoalSelect = document.getElementById('matchGoal');
  const matchFormatSelect = document.getElementById('matchFormat');

  const recTitle = document.getElementById('recProgramTitle');
  const recDesc = document.getElementById('recProgramDesc');
  const recTagStage = document.getElementById('recTagStage');
  const recTagGoal = document.getElementById('recTagGoal');
  const recTagFormat = document.getElementById('recTagFormat');
  const recCtaBtn = document.getElementById('recCtaBtn');
  const recRefineBtn = document.getElementById('recRefineBtn');

  const programModal = document.getElementById('programModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDismissBtn = document.getElementById('modalDismissBtn');
  const modalProgramName = document.getElementById('modalProgramName');
  const modalSummary = document.getElementById('modalSummary');

  // Program definitions & copy
  const PROGRAM_DATA = {
    puppy: {
      name: 'Puppy Essentials',
      tag: 'Stage: Under 6 Months',
      ageLabel: 'Puppy (Under 6 months)',
      descriptions: {
        standard: 'Because your puppy is in their foundational development window (under 6 months), early positive socialization, gentle bite inhibition, and structured house routines now will prevent future anxiety and build lifelong trust.',
        senior: 'Puppy foundational exercises adapted for young or newly adopted companions.'
      }
    },
    obedience: {
      name: 'Complete Obedience',
      tag: 'Everyday Manners & Leash Reliability',
      descriptions: {
        standard: 'Ideal for adolescent and adult dogs needing dependable loose-leash manners, reliable recall amidst distractions, and calm polite greeting habits in everyday neighborhood environments.',
        senior: 'Tailored specifically for older dogs, focusing on gentle low-impact manners, cognitive engagement, and relaxed everyday routines that respect your senior dog’s comfort.'
      }
    },
    behavior: {
      name: 'Behavior Coaching',
      tag: 'Reactivity, Fear & Stress Management',
      descriptions: {
        standard: 'A structured, one-on-one positive reinforcement pathway for dogs experiencing fear, leash reactivity, or environmental stress, systematically building emotional resilience at your dog’s natural pace.',
        senior: 'Gentle, supportive behavior guidance to help older dogs navigate sudden anxiety, cognitive shifts, or vision/hearing-related sensitivities with patience and clarity.'
      }
    }
  };

  // State tracker
  let currentProgramKey = 'puppy';

  /**
   * Evaluates deterministic matching rules based on current dropdown selections
   */
  function calculateBestFit() {
    const age = matchAgeSelect ? matchAgeSelect.value : 'puppy';
    const goal = matchGoalSelect ? matchGoalSelect.value : 'confidence';
    const format = matchFormatSelect ? matchFormatSelect.value : 'private';

    let matchedKey = 'obedience';

    // Core matching logic
    if (age === 'puppy' || (goal === 'confidence' && age === 'adolescent')) {
      matchedKey = 'puppy';
    } else if (goal === 'reactivity') {
      matchedKey = 'behavior';
    } else {
      matchedKey = 'obedience';
    }

    return {
      key: matchedKey,
      age: age,
      goal: goal,
      format: format
    };
  }

  /**
   * Updates all UI components to reflect the selected program and inputs
   */
  function updateUI(programKey, isDirectStageClick = false) {
    currentProgramKey = programKey;
    const data = PROGRAM_DATA[programKey] || PROGRAM_DATA.puppy;

    // 1. Update Stage Tabs
    stageButtons.forEach((btn) => {
      const stage = btn.getAttribute('data-stage');
      const isMatch = stage === programKey;
      btn.classList.toggle('is-active', isMatch);
      btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    // 2. Update Program Cards
    programCards.forEach((card) => {
      const cardProgram = card.getAttribute('data-card-program');
      const isMatch = cardProgram === programKey;
      card.classList.toggle('is-recommended', isMatch);
    });

    // 3. Update Recommendation Card Content
    if (recTitle) {
      recTitle.textContent = data.name;
    }

    const currentAge = matchAgeSelect ? matchAgeSelect.value : 'puppy';
    const currentGoal = matchGoalSelect ? matchGoalSelect.options[matchGoalSelect.selectedIndex].text : 'Confidence & Socialization';
    const currentFormat = matchFormatSelect ? matchFormatSelect.options[matchFormatSelect.selectedIndex].text : 'Private In-Home Training';

    if (recDesc) {
      if (currentAge === 'senior') {
        recDesc.textContent = data.descriptions.senior || data.descriptions.standard;
      } else {
        recDesc.textContent = data.descriptions.standard;
      }
    }

    if (recTagStage && matchAgeSelect) {
      recTagStage.textContent = `Stage: ${matchAgeSelect.options[matchAgeSelect.selectedIndex].text.split('—')[0].trim()}`;
    }
    if (recTagGoal) {
      recTagGoal.textContent = `Focus: ${currentGoal.split('&')[0].trim()}`;
    }
    if (recTagFormat) {
      recTagFormat.textContent = `Format: ${currentFormat}`;
    }

    // If stage was directly clicked, synchronize dropdowns gracefully
    if (isDirectStageClick) {
      if (programKey === 'puppy' && matchAgeSelect && matchGoalSelect) {
        matchAgeSelect.value = 'puppy';
        matchGoalSelect.value = 'confidence';
      } else if (programKey === 'obedience' && matchAgeSelect && matchGoalSelect) {
        if (matchAgeSelect.value === 'puppy') matchAgeSelect.value = 'adolescent';
        matchGoalSelect.value = 'basic';
      } else if (programKey === 'behavior' && matchGoalSelect) {
        matchGoalSelect.value = 'reactivity';
      }
    }
  }

  /**
   * Stage button clicks
   */
  stageButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const stage = btn.getAttribute('data-stage');
      if (stage) {
        updateUI(stage, true);
      }
    });

    // Keyboard navigation (Left/Right arrow support)
    btn.addEventListener('keydown', (e) => {
      const stageList = Array.from(stageButtons);
      const currentIndex = stageList.indexOf(btn);
      let nextIndex = null;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % stageList.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + stageList.length) % stageList.length;
      }

      if (nextIndex !== null) {
        stageList[nextIndex].focus();
        stageList[nextIndex].click();
      }
    });
  });

  /**
   * Question Select changes
   */
  [matchAgeSelect, matchGoalSelect, matchFormatSelect].forEach((select) => {
    if (!select) return;
    select.addEventListener('change', () => {
      const fit = calculateBestFit();
      updateUI(fit.key, false);
    });
  });

  /**
   * Matcher drawer toggle button
   */
  if (matcherToggleBtn && matcherQuestions) {
    matcherToggleBtn.addEventListener('click', () => {
      const isExpanded = matcherToggleBtn.getAttribute('aria-expanded') === 'true';
      const willExpand = !isExpanded;

      matcherToggleBtn.setAttribute('aria-expanded', willExpand ? 'true' : 'false');
      matcherQuestions.classList.toggle('is-collapsed', !willExpand);
      
      if (matcherToggleBadge) {
        matcherToggleBadge.textContent = willExpand ? 'Hide Customizer' : 'Customize Match';
      }

      if (willExpand && matchAgeSelect) {
        setTimeout(() => matchAgeSelect.focus(), 100);
      }
    });
  }

  /**
   * Secondary "Change My Answers" button
   */
  if (recRefineBtn && matcherToggleBtn && matcherQuestions) {
    recRefineBtn.addEventListener('click', () => {
      matcherToggleBtn.setAttribute('aria-expanded', 'true');
      matcherQuestions.classList.remove('is-collapsed');
      if (matcherToggleBadge) {
        matcherToggleBadge.textContent = 'Hide Customizer';
      }
      matcherToggleBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (matchAgeSelect) {
        setTimeout(() => matchAgeSelect.focus(), 300);
      }
    });
  }

  /**
   * Program Cards buttons & card click handlers
   */
  programCards.forEach((card) => {
    const cardProgram = card.getAttribute('data-card-program');
    const selectBtn = card.querySelector('[data-select-program]');

    const triggerProgramAction = () => {
      if (cardProgram) {
        updateUI(cardProgram, true);
        openConsultModal(cardProgram);
      }
    };

    if (selectBtn) {
      selectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerProgramAction();
      });
    }

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerProgramAction();
      }
    });
  });

  /**
   * Recommendation CTA Button
   */
  if (recCtaBtn) {
    recCtaBtn.addEventListener('click', () => {
      openConsultModal(currentProgramKey);
    });
  }

  /**
   * Modal dialog controller
   */
  function openConsultModal(programKey) {
    if (!programModal) return;

    const data = PROGRAM_DATA[programKey] || PROGRAM_DATA.puppy;
    const currentAgeText = matchAgeSelect ? matchAgeSelect.options[matchAgeSelect.selectedIndex].text : 'Under 6 months';
    const currentGoalText = matchGoalSelect ? matchGoalSelect.options[matchGoalSelect.selectedIndex].text : 'Confidence and socialization';
    const currentFormatText = matchFormatSelect ? matchFormatSelect.options[matchFormatSelect.selectedIndex].text : 'Private In-Home';

    if (modalProgramName) {
      modalProgramName.textContent = data.name;
    }

    if (modalSummary) {
      modalSummary.innerHTML = `
        <div style="margin-bottom: 6px;"><strong>Selected Curriculum:</strong> ${data.name}</div>
        <div style="margin-bottom: 4px;">&bull; <strong>Dog's Age:</strong> ${currentAgeText}</div>
        <div style="margin-bottom: 4px;">&bull; <strong>Primary Focus:</strong> ${currentGoalText}</div>
        <div>&bull; <strong>Preferred Format:</strong> ${currentFormatText}</div>
      `;
    }

    if (typeof programModal.showModal === 'function') {
      programModal.showModal();
    } else {
      programModal.setAttribute('open', '');
    }

    // Focus close button initially
    if (modalCloseBtn) {
      modalCloseBtn.focus();
    }
  }

  function closeConsultModal() {
    if (!programModal) return;
    if (typeof programModal.close === 'function') {
      programModal.close();
    } else {
      programModal.removeAttribute('open');
    }
    if (recCtaBtn) {
      recCtaBtn.focus();
    }
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeConsultModal);
  }
  if (modalDismissBtn) {
    modalDismissBtn.addEventListener('click', closeConsultModal);
  }

  // Backdrop click closes dialog
  if (programModal) {
    programModal.addEventListener('click', (e) => {
      const rect = programModal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        closeConsultModal();
      }
    });

    // Close on Escape key
    programModal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeConsultModal();
      }
    });
  }

  // Initial setup with default puppy fit
  updateUI('puppy', false);

  /* ==========================================================================
     3. Section 4: Comprehensive Training Programs — Showcase & Directory
     ========================================================================== */
  const trainingSection = document.getElementById('training');
  if (trainingSection) {
    const TRAINING_CATALOG = {
      'puppy-kindergarten': {
        id: 'puppy-kindergarten',
        num: '01',
        category: 'PUPPY FOUNDATIONS',
        filterTag: 'puppy',
        title: 'Puppy Kindergarten & Foundation',
        desc: 'Set your puppy up for a lifetime of good manners before bad habits take root. Build confidence, establish everyday routines, and develop the foundations for reliable behavior.',
        duration: '4 Weeks',
        durationMeta: '4-Week Program',
        price: '$349',
        ctaText: 'Explore Puppy Program',
        image: 'assets/images/01(1).jpg',
        imageAlt: 'Puppy learning high five and foundational focus with positive trainer',
        benefits: [
          'Potty training and crate routines',
          'Teething, chewing, and bite inhibition',
          'Safe exposure and sound desensitization',
          'Loose-leash walking fundamentals'
        ]
      },
      'everyday-obedience': {
        id: 'everyday-obedience',
        num: '02',
        category: 'EVERYDAY OBEDIENCE',
        filterTag: 'obedience',
        title: 'On-Leash & Off-Leash Obedience',
        desc: 'Transform your walking routine with reliable sit, stay, heel, down, and recall skills that work around real-world distractions.',
        duration: '5 Weeks',
        durationMeta: '5-Week Program',
        price: '$499',
        ctaText: 'Explore Obedience',
        image: 'assets/images/02(1).jpg',
        imageAlt: 'Dog obedience training on leash',
        benefits: [
          'Reliable heel walking',
          'Distance commands and impulse control',
          'Emergency recall and release cues',
          'Polite greetings around people and children'
        ]
      },
      'behavior-rehab': {
        id: 'behavior-rehab',
        num: '03',
        category: 'SPECIALIST SUPPORT',
        filterTag: 'behavior',
        title: 'Behavior Rehab & Reactivity',
        desc: 'Structured support for dogs experiencing reactivity, fear-related challenges, separation anxiety, or difficult everyday behaviors.',
        duration: '6 Weeks',
        durationMeta: '6-Week Program',
        price: '$680',
        ctaText: 'Explore Behavior Support',
        image: 'assets/images/03(1).jpg',
        imageAlt: 'Behavior modification session',
        benefits: [
          'Trigger identification',
          'Gradual desensitization and counter-conditioning',
          'Stress management',
          'Owner handling guidance'
        ]
      },
      'k9-agility': {
        id: 'k9-agility',
        num: '04',
        category: 'ATHLETIC CONDITIONING',
        filterTag: 'advanced',
        title: 'K9 Agility & Sport Obstacles',
        desc: "Channel your dog's energy through agility foundations, obstacle work, and focused movement that builds confidence and engagement.",
        duration: '4 Weeks',
        durationMeta: '4-Week Program',
        price: '$380',
        ctaText: 'Explore Agility',
        image: 'assets/images/04(1).jpg',
        imageAlt: 'Dog agility training course',
        benefits: [
          'Body awareness and coordination',
          'Tunnel, tire-jump, and obstacle skills',
          'Focus and engagement',
          'Handler communication'
        ]
      },
      'board-train': {
        id: 'board-train',
        num: '05',
        category: 'IMMERSIVE TRAINING',
        filterTag: 'obedience',
        title: 'Elite Board & Train Immersion',
        desc: 'A structured residential training option for owners seeking intensive professional sessions followed by practical handler coaching.',
        duration: '2–3 Weeks',
        durationMeta: '2–3 Week Residency',
        price: 'Starting at $1,450',
        ctaText: 'Explore Board & Train',
        image: 'assets/images/05(1).jpg',
        imageAlt: 'Board and train immersion facility',
        benefits: [
          'Multiple structured sessions',
          'Individualized training plan',
          'Progress updates',
          'Owner handover and follow-up guidance'
        ]
      },
      'working-k9': {
        id: 'working-k9',
        num: '06',
        category: 'ADVANCED WORKING DOG',
        filterTag: 'advanced',
        title: 'Working K9, Scent & Protection',
        desc: 'Specialized working-dog development focused on scent-related tasks, controlled obedience, and suitable advanced handling skills.',
        duration: 'Custom',
        durationMeta: 'Custom Schedule',
        price: 'Assessment required',
        ctaText: 'Request an Evaluation',
        image: 'assets/images/06(1).jpg',
        imageAlt: 'Working dog training',
        benefits: [
          'Scent and target discrimination',
          'Structured obedience',
          'Handler communication',
          'Individual evaluation'
        ]
      }
    };

    // Showcase Elements
    const featuredCard = document.getElementById('trainingFeaturedCard');
    const featuredImg = document.getElementById('featuredImage');
    const badgeCategory = document.getElementById('featuredBadgeCategory');
    const badgeDuration = document.getElementById('featuredBadgeDuration');
    const metaCategory = document.getElementById('featuredMetaCategory');
    const metaDuration = document.getElementById('featuredMetaDuration');
    const priceVal = document.getElementById('featuredPrice');
    const titleEl = document.getElementById('featuredTitle');
    const descEl = document.getElementById('featuredDesc');
    const benefitsList = document.getElementById('featuredBenefitsList');
    const ctaBtn = document.getElementById('featuredCtaBtn');
    const ctaText = document.getElementById('featuredCtaText');
    const quickBtn = document.getElementById('featuredQuickBtn');

    // List and Filter Elements
    const programItems = trainingSection.querySelectorAll('.redesign-training__item');
    const filterButtons = trainingSection.querySelectorAll('.redesign-training__filter-btn');

    // Modal Elements
    const trainingModal = document.getElementById('trainingInquiryModal');
    const trainingModalCloseBtn = document.getElementById('trainingModalCloseBtn');
    const trainingModalDismissBtn = document.getElementById('trainingModalDismissBtn');
    const trainingModalTitle = document.getElementById('trainingModalTitle');
    const trainingModalDesc = document.getElementById('trainingModalDesc');
    const trainingModalDetails = document.getElementById('trainingModalDetails');

    let currentProgramId = 'puppy-kindergarten';

    /**
     * Update Featured Showcase with Program Data
     */
    function updateFeaturedShowcase(programId) {
      const data = TRAINING_CATALOG[programId];
      if (!data) return;

      currentProgramId = programId;

      // Soft transition
      const contentPanel = featuredCard ? featuredCard.querySelector('.redesign-training__featured-content') : null;
      if (contentPanel) {
        contentPanel.style.opacity = '0.7';
      }

      setTimeout(() => {
        if (featuredImg) {
          featuredImg.src = data.image;
          featuredImg.alt = data.imageAlt;
        }
        if (badgeCategory) badgeCategory.textContent = data.category;
        if (badgeDuration) badgeDuration.textContent = data.duration.toUpperCase();
        if (metaCategory) metaCategory.textContent = data.category;
        if (metaDuration) metaDuration.textContent = data.durationMeta;
        if (priceVal) priceVal.textContent = data.price;
        if (titleEl) titleEl.textContent = data.title;
        if (descEl) descEl.textContent = data.desc;
        if (ctaText) ctaText.textContent = data.ctaText;

        if (benefitsList) {
          benefitsList.innerHTML = data.benefits.map((b) => `
            <li class="redesign-training__featured-benefit">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>${b}</span>
            </li>
          `).join('');
        }

        if (contentPanel) {
          contentPanel.style.opacity = '1';
        }
      }, 120);

      // Synchronize list items active state
      programItems.forEach((item) => {
        const id = item.getAttribute('data-program-id');
        const isActive = id === programId;
        item.classList.toggle('is-active', isActive);
        item.setAttribute('aria-selected', isActive ? 'true' : 'false');
        
        const ctaLabel = item.querySelector('.redesign-training__item-cta-text');
        if (ctaLabel) {
          ctaLabel.textContent = isActive ? 'Featured' : 'Select';
        }
      });
    }

    /**
     * Program list row selection & keyboard navigation
     */
    programItems.forEach((item) => {
      const progId = item.getAttribute('data-program-id');

      item.addEventListener('click', () => {
        if (progId) {
          updateFeaturedShowcase(progId);
        }
      });

      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (progId) updateFeaturedShowcase(progId);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          const visibleItems = Array.from(programItems).filter((el) => !el.classList.contains('is-filtered-out'));
          const currentIdx = visibleItems.indexOf(item);
          if (currentIdx < visibleItems.length - 1) {
            visibleItems[currentIdx + 1].focus();
            const nextId = visibleItems[currentIdx + 1].getAttribute('data-program-id');
            if (nextId) updateFeaturedShowcase(nextId);
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const visibleItems = Array.from(programItems).filter((el) => !el.classList.contains('is-filtered-out'));
          const currentIdx = visibleItems.indexOf(item);
          if (currentIdx > 0) {
            visibleItems[currentIdx - 1].focus();
            const prevId = visibleItems[currentIdx - 1].getAttribute('data-program-id');
            if (prevId) updateFeaturedShowcase(prevId);
          }
        }
      });
    });

    /**
     * Filter Buttons Logic
     */
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filterVal = btn.getAttribute('data-filter') || 'all';

        // Update active button state
        filterButtons.forEach((b) => {
          const isActive = b === btn;
          b.classList.toggle('is-active', isActive);
          b.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // Filter list items
        let firstVisibleId = null;
        let isCurrentVisible = false;

        programItems.forEach((item) => {
          const cat = item.getAttribute('data-category');
          const progId = item.getAttribute('data-program-id');
          const matches = filterVal === 'all' || cat === filterVal;

          item.classList.toggle('is-filtered-out', !matches);

          if (matches) {
            if (!firstVisibleId) firstVisibleId = progId;
            if (progId === currentProgramId) isCurrentVisible = true;
          }
        });

        // If current program was filtered out, switch to first visible
        if (!isCurrentVisible && firstVisibleId) {
          updateFeaturedShowcase(firstVisibleId);
        }
      });
    });

    /**
     * Modal Dialog for Training Programs
     */
    function openTrainingModal(programId) {
      if (!trainingModal) return;
      const data = TRAINING_CATALOG[programId] || TRAINING_CATALOG['puppy-kindergarten'];

      if (trainingModalTitle) {
        trainingModalTitle.textContent = `${data.title} Inquiry`;
      }
      if (trainingModalDesc) {
        trainingModalDesc.textContent = `Connect with our certified trainers about enrolling in ${data.title} (${data.duration}).`;
      }

      if (trainingModalDetails) {
        trainingModalDetails.innerHTML = `
          <div style="margin-bottom: 6px;"><strong>Curriculum:</strong> ${data.title}</div>
          <div style="margin-bottom: 4px;">&bull; <strong>Track Category:</strong> ${data.category}</div>
          <div style="margin-bottom: 4px;">&bull; <strong>Program Duration:</strong> ${data.duration}</div>
          <div style="margin-bottom: 8px;">&bull; <strong>Tuition Fee:</strong> ${data.price}</div>
          <div><strong>Core Topics:</strong> ${data.benefits.join(' &bull; ')}</div>
        `;
      }

      if (typeof trainingModal.showModal === 'function') {
        trainingModal.showModal();
      } else {
        trainingModal.setAttribute('open', '');
      }

      if (trainingModalCloseBtn) {
        trainingModalCloseBtn.focus();
      }
    }

    function closeTrainingModal() {
      if (!trainingModal) return;
      if (typeof trainingModal.close === 'function') {
        trainingModal.close();
      } else {
        trainingModal.removeAttribute('open');
      }
      if (ctaBtn) ctaBtn.focus();
    }

    if (ctaBtn) {
      ctaBtn.addEventListener('click', () => openTrainingModal(currentProgramId));
    }
    if (quickBtn) {
      quickBtn.addEventListener('click', () => openTrainingModal(currentProgramId));
    }
    if (trainingModalCloseBtn) {
      trainingModalCloseBtn.addEventListener('click', closeTrainingModal);
    }
    if (trainingModalDismissBtn) {
      trainingModalDismissBtn.addEventListener('click', closeTrainingModal);
    }

    if (trainingModal) {
      trainingModal.addEventListener('click', (e) => {
        const rect = trainingModal.getBoundingClientRect();
        const isInDialog = (
          rect.top <= e.clientY &&
          e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX &&
          e.clientX <= rect.left + rect.width
        );
        if (!isInDialog) {
          closeTrainingModal();
        }
      });

      trainingModal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeTrainingModal();
        }
      });
    }

    // Initialize with puppy kindergarten
    updateFeaturedShowcase('puppy-kindergarten');
  }

  /* ==========================================================================
     4. Section 5: Stories Beyond the Leash — Transformations & Lightbox
     ========================================================================== */
  const storiesSection = document.getElementById('gallery');
  if (storiesSection) {
    const STORIES_DATA = {
      'puppy-foundations': {
        tag: 'PUPPY FOUNDATIONS',
        title: 'Confidence Starts With the Smallest Steps',
        desc: 'Early experiences help puppies become more comfortable with people, new environments, everyday sounds, and the routines that shape their future behavior.',
        focus: ['Confidence building', 'Positive reinforcement', 'Everyday foundations'],
        image: 'assets/images/01(1).jpg',
        imageAlt: 'Golden retriever puppy learning foundational high five and focus'
      },
      'everyday-obedience': {
        tag: 'EVERYDAY OBEDIENCE',
        title: 'Real-World Calm in Every Setting',
        desc: 'Moving beyond indoor practice, teaching dogs to stay centered, attentive, and responsive during lively neighborhood strolls.',
        focus: ['Loose-leash walking', 'Distraction proofing', 'Impulse control'],
        image: 'assets/images/02(1).jpg',
        imageAlt: 'Dog in focused heel position with handler outdoors'
      },
      'agility-play': {
        tag: 'AGILITY & ENRICHMENT',
        title: 'Channeling Energy Through Purposeful Play',
        desc: 'Physical fitness meets mental engagement as dogs master coordination, obstacles, and cooperative play that deepens mutual trust.',
        focus: ['Active movement', 'Mental enrichment', 'Body awareness'],
        image: 'assets/images/03(1).jpg',
        imageAlt: 'Dog leaping joyfully during athletic enrichment training'
      },
      'trust-connection': {
        tag: 'TRUST & CONNECTION',
        title: 'The Quiet Language of Mutual Respect',
        desc: 'True behavioral change happens when fear is replaced by clarity, gentle guidance, and unconditional understanding between pet and guardian.',
        focus: ['Gentle handling', 'Stress reduction', 'Bond building'],
        image: 'assets/images/19.jpg',
        imageAlt: 'Gentle hands cradling a calm dog with affection and mutual trust'
      }
    };

    const storyImg = document.getElementById('storyFeaturedImg');
    const storyTagText = document.getElementById('storyFeaturedTagText');
    const storyCatBadge = document.getElementById('storyCatBadge');
    const storyTitle = document.getElementById('storyTitle');
    const storyDesc = document.getElementById('storyDesc');
    const storyFocusPills = document.getElementById('storyFocusPills');
    const narrativeBox = document.getElementById('storyNarrativeBox');
    const selectorItems = storiesSection.querySelectorAll('.redesign-stories__selector-item');

    function updateStory(storyId) {
      const data = STORIES_DATA[storyId];
      if (!data) return;

      if (narrativeBox && storyImg) {
        narrativeBox.style.opacity = '0.7';
        storyImg.style.opacity = '0.7';
      }

      setTimeout(() => {
        if (storyImg) {
          storyImg.src = data.image;
          storyImg.alt = data.imageAlt;
          storyImg.style.opacity = '1';
        }
        if (storyTagText) storyTagText.textContent = data.tag;
        if (storyCatBadge) storyCatBadge.textContent = data.tag;
        if (storyTitle) storyTitle.textContent = data.title;
        if (storyDesc) storyDesc.textContent = data.desc;

        if (storyFocusPills) {
          storyFocusPills.innerHTML = data.focus.map((pill) => `
            <span class="redesign-stories__focus-pill">${pill}</span>
          `).join('');
        }

        if (narrativeBox) {
          narrativeBox.style.opacity = '1';
        }
      }, 100);

      selectorItems.forEach((btn) => {
        const id = btn.getAttribute('data-story-id');
        const isActive = id === storyId;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }

    selectorItems.forEach((btn) => {
      const storyId = btn.getAttribute('data-story-id');

      btn.addEventListener('click', () => {
        if (storyId) updateStory(storyId);
      });

      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (storyId) updateStory(storyId);
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          const items = Array.from(selectorItems);
          const idx = items.indexOf(btn);
          const next = items[(idx + 1) % items.length];
          next.focus();
          const nextId = next.getAttribute('data-story-id');
          if (nextId) updateStory(nextId);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const items = Array.from(selectorItems);
          const idx = items.indexOf(btn);
          const prev = items[(idx - 1 + items.length) % items.length];
          prev.focus();
          const prevId = prev.getAttribute('data-story-id');
          if (prevId) updateStory(prevId);
        }
      });
    });

    // Lightbox modal controller
    const lightboxModal = document.getElementById('storiesLightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTag = document.getElementById('lightboxTag');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');
    const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
    const galleryCards = storiesSection.querySelectorAll('.redesign-stories__card');

    let lastFocusedElement = null;

    function openLightbox(card) {
      if (!lightboxModal) return;

      lastFocusedElement = card;

      const src = card.getAttribute('data-lightbox-src');
      const title = card.getAttribute('data-lightbox-title');
      const tag = card.getAttribute('data-lightbox-tag');
      const desc = card.getAttribute('data-lightbox-desc');

      if (lightboxImg && src) {
        lightboxImg.src = src;
        lightboxImg.alt = title || 'Curated moment from academy';
      }
      if (lightboxTag && tag) lightboxTag.textContent = tag;
      if (lightboxTitle && title) lightboxTitle.textContent = title;
      if (lightboxDesc && desc) lightboxDesc.textContent = desc;

      if (typeof lightboxModal.showModal === 'function') {
        lightboxModal.showModal();
      } else {
        lightboxModal.setAttribute('open', '');
      }

      if (lightboxCloseBtn) {
        lightboxCloseBtn.focus();
      }
    }

    function closeLightbox() {
      if (!lightboxModal) return;
      if (typeof lightboxModal.close === 'function') {
        lightboxModal.close();
      } else {
        lightboxModal.removeAttribute('open');
      }

      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
    }

    galleryCards.forEach((card) => {
      card.addEventListener('click', () => openLightbox(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(card);
        }
      });
    });

    if (lightboxCloseBtn) {
      lightboxCloseBtn.addEventListener('click', closeLightbox);
    }

    if (lightboxModal) {
      lightboxModal.addEventListener('click', (e) => {
        const rect = lightboxModal.getBoundingClientRect();
        const isInDialog = (
          rect.top <= e.clientY &&
          e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX &&
          e.clientX <= rect.left + rect.width
        );
        if (!isInDialog) {
          closeLightbox();
        }
      });

      lightboxModal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeLightbox();
        }
      });
    }
  }

  /* ==========================================================================
     6. Section 6: Transparent Training Packages & Investment Planner
     ========================================================================== */
  const pricingSection = document.getElementById('pricing');
  if (pricingSection) {
    // Single source of truth data structure
    const PRICING_DATA = {
      'puppy-starter': {
        id: 'puppy-starter',
        name: 'Puppy Starter',
        category: 'EARLY FOUNDATIONS',
        price: 349,
        billing: 'per course',
        sessions: '4 Private One-on-One Sessions (60 Min)',
        duration: 'For puppies under 6 months',
        desc: "Build healthy habits during your puppy's earliest learning stages, establishing clear communication and calm foundational manners before bad habits take root.",
        summaryGoal: "Best suited for puppies under 6 months starting their social journey, establishing house routines, and gentle impulse control.",
        included: [
          '4 private one-on-one sessions, 60 minutes each',
          'Housebreaking and crate guidance',
          'Biting and chewing guidance',
          'Complimentary training clicker'
        ],
        excluded: [
          'Off-leash freedom proofing',
          'Severe reactivity treatment'
        ],
        colIndex: 0
      },
      'complete-obedience': {
        id: 'complete-obedience',
        name: 'Complete K9 Obedience',
        category: 'EVERYDAY OBEDIENCE',
        price: 599,
        billing: 'per course',
        sessions: '6 In-Depth Private Sessions',
        duration: 'For adolescent & adult dogs',
        desc: 'Develop reliable everyday manners, better leash behavior, and practical obedience that holds up in real-world environments and busy parks.',
        summaryGoal: 'Best suited for adolescent and adult dogs needing loose-leash walking, dependable commands, and real-world manners.',
        included: [
          '6 in-depth private sessions',
          'Reliable loose-leash heel training',
          'Sit, stay, down, and distance-place cues',
          'Emergency leave-it and recall',
          'Real-world park training session',
          'Alumni clinic access'
        ],
        excluded: [],
        colIndex: 1
      },
      'behavioral-bootcamp': {
        id: 'behavioral-bootcamp',
        name: 'Behavioral Bootcamp',
        category: 'SPECIALIST SUPPORT',
        price: 849,
        billing: 'per course',
        sessions: '8 Dedicated Specialist Sessions',
        duration: 'For dogs needing behavioral rehabilitation',
        desc: 'A structured training option for more challenging behavioral goals requiring individualized support and systematic desensitization under certified behaviorists.',
        summaryGoal: 'Best suited for dogs with fear, leash reactivity, or anxiety requiring specialized 1-on-1 coaching and custom behavior plans.',
        included: [
          '8 dedicated specialist sessions',
          'An individualized behavior plan',
          'Controlled desensitization exercises, where appropriate',
          'Progress review and homework',
          'Direct trainer communication',
          'Follow-up guidance'
        ],
        excluded: [],
        colIndex: 2
      }
    };

    // DOM Elements
    const optionTabs = Array.from(pricingSection.querySelectorAll('.redesign-pricing__option'));
    const detailsCat = document.getElementById('detailsCat');
    const detailsSessions = document.getElementById('detailsSessions');
    const detailsTitle = document.getElementById('pricingDetailsTitle');
    const detailsDesc = document.getElementById('detailsDesc');
    const detailsIncludedList = document.getElementById('detailsIncludedList');
    const detailsExcludedBox = document.getElementById('detailsExcludedBox');
    const detailsExcludedList = document.getElementById('detailsExcludedList');
    const detailsAmount = document.getElementById('detailsAmount');
    const detailsBilling = document.getElementById('detailsBilling');

    // Summary Elements
    const summaryPkgName = document.getElementById('summaryPkgName');
    const summaryPkgPrice = document.getElementById('summaryPkgPrice');
    const summaryPkgDesc = document.getElementById('summaryPkgDesc');
    const summaryActionBtn = document.getElementById('summaryActionBtn');

    // Comparison Table Elements
    const tableHeaderCols = pricingSection.querySelectorAll('.redesign-pricing__th-col');
    const tableRows = pricingSection.querySelectorAll('.redesign-pricing__table tbody tr');

    // CTA & Modal Elements
    const pricingPrimaryCta = document.getElementById('pricingPrimaryCta');
    const pricingCompareLink = document.getElementById('pricingCompareLink');
    const pricingModal = document.getElementById('pricingInquiryModal');
    const pricingModalCloseBtn = document.getElementById('pricingModalCloseBtn');
    const pricingModalDismissBtn = document.getElementById('pricingModalDismissBtn');
    const pricingModalDetails = document.getElementById('pricingModalDetails');

    let currentSelectedPkgId = 'complete-obedience';
    let modalReturnFocusElement = null;

    /**
     * Update all dependent UI when a package is selected
     * @param {string} pkgId 
     * @param {boolean} shouldFocus 
     */
    function updatePackage(pkgId, shouldFocus = false) {
      const pkg = PRICING_DATA[pkgId];
      if (!pkg) return;

      currentSelectedPkgId = pkgId;

      // 1. Update selector buttons
      optionTabs.forEach((tab) => {
        const isSelected = tab.dataset.packageId === pkgId;
        tab.classList.toggle('is-active', isSelected);
        tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        tab.setAttribute('tabindex', isSelected ? '0' : '-1');
        if (isSelected && shouldFocus) {
          tab.focus();
        }
      });

      // 2. Update Details Panel
      if (detailsCat) detailsCat.textContent = pkg.category;
      if (detailsSessions) detailsSessions.textContent = pkg.sessions;
      if (detailsTitle) detailsTitle.textContent = pkg.name;
      if (detailsDesc) detailsDesc.textContent = pkg.desc;
      if (detailsAmount) detailsAmount.textContent = pkg.price;
      if (detailsBilling) detailsBilling.textContent = pkg.billing;

      // Populate Included features
      if (detailsIncludedList) {
        detailsIncludedList.innerHTML = pkg.included.map((item) => `
          <li class="redesign-pricing__feature-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${item}</span>
          </li>
        `).join('');
      }

      // Populate Excluded features (if any)
      if (detailsExcludedBox && detailsExcludedList) {
        if (pkg.excluded && pkg.excluded.length > 0) {
          detailsExcludedBox.classList.remove('is-hidden');
          detailsExcludedList.innerHTML = pkg.excluded.map((item) => `
            <li class="redesign-pricing__excluded-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>${item}</span>
            </li>
          `).join('');
        } else {
          detailsExcludedBox.classList.add('is-hidden');
          detailsExcludedList.innerHTML = '';
        }
      }

      // 3. Update Package Summary
      if (summaryPkgName) summaryPkgName.textContent = pkg.name;
      if (summaryPkgPrice) summaryPkgPrice.textContent = `$${pkg.price} ${pkg.billing}`;
      if (summaryPkgDesc) summaryPkgDesc.textContent = pkg.summaryGoal;

      // 4. Synchronize Comparison Table highlight column
      if (tableHeaderCols.length > 0) {
        tableHeaderCols.forEach((col, idx) => {
          col.classList.toggle('redesign-pricing__th-col--highlight', idx === pkg.colIndex);
        });
      }

      if (tableRows.length > 0) {
        tableRows.forEach((row) => {
          const cells = row.querySelectorAll('td');
          cells.forEach((cell, idx) => {
            cell.classList.toggle('redesign-pricing__td--highlight', idx === pkg.colIndex);
          });
        });
      }
    }

    // Bind click & keyboard interactions to selector tabs
    optionTabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        const pkgId = tab.dataset.packageId;
        updatePackage(pkgId, false);
      });

      tab.addEventListener('keydown', (e) => {
        let nextIndex = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          nextIndex = (index + 1) % optionTabs.length;
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          nextIndex = (index - 1 + optionTabs.length) % optionTabs.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          nextIndex = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          nextIndex = optionTabs.length - 1;
        }

        if (nextIndex !== null) {
          const targetTab = optionTabs[nextIndex];
          const targetPkgId = targetTab.dataset.packageId;
          updatePackage(targetPkgId, true);
        }
      });
    });

    // Comparison link smooth scroll
    if (pricingCompareLink) {
      pricingCompareLink.addEventListener('click', (e) => {
        e.preventDefault();
        const compareTarget = document.getElementById('pricingComparison');
        if (compareTarget) {
          compareTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
          compareTarget.setAttribute('tabindex', '-1');
          compareTarget.focus();
        }
      });
    }

    // Modal dialog handlers
    function openPricingModal(triggerElement) {
      if (!pricingModal) return;
      modalReturnFocusElement = triggerElement;

      const pkg = PRICING_DATA[currentSelectedPkgId] || PRICING_DATA['complete-obedience'];
      if (pricingModalDetails) {
        pricingModalDetails.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
            <strong style="font-size: 1.15rem; color: #17382F;">${pkg.name}</strong>
            <span style="font-size: 1.15rem; font-weight: 700; color: #214E41;">$${pkg.price} <span style="font-size: 0.825rem; font-weight: 500; color: #68776E;">${pkg.billing}</span></span>
          </div>
          <p style="margin: 0 0 8px; font-size: 0.825rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #5D8D80;">${pkg.category} &bull; ${pkg.sessions}</p>
          <p style="margin: 0; font-size: 0.9rem; color: #68776E; line-height: 1.5;">${pkg.summaryGoal}</p>
        `;
      }

      if (typeof pricingModal.showModal === 'function') {
        pricingModal.showModal();
      } else {
        pricingModal.setAttribute('open', '');
      }

      if (pricingModalCloseBtn) {
        pricingModalCloseBtn.focus();
      }
    }

    function closePricingModal() {
      if (!pricingModal) return;

      if (typeof pricingModal.close === 'function') {
        pricingModal.close();
      } else {
        pricingModal.removeAttribute('open');
      }

      if (modalReturnFocusElement && typeof modalReturnFocusElement.focus === 'function') {
        modalReturnFocusElement.focus();
      }
    }

    if (pricingPrimaryCta) {
      pricingPrimaryCta.addEventListener('click', () => openPricingModal(pricingPrimaryCta));
    }

    if (summaryActionBtn) {
      summaryActionBtn.addEventListener('click', () => openPricingModal(summaryActionBtn));
    }

    if (pricingModalCloseBtn) {
      pricingModalCloseBtn.addEventListener('click', closePricingModal);
    }

    if (pricingModalDismissBtn) {
      pricingModalDismissBtn.addEventListener('click', closePricingModal);
    }

    if (pricingModal) {
      pricingModal.addEventListener('click', (e) => {
        const rect = pricingModal.getBoundingClientRect();
        const isInDialog = (
          rect.top <= e.clientY &&
          e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX &&
          e.clientX <= rect.left + rect.width
        );
        if (!isInDialog) {
          closePricingModal();
        }
      });

      pricingModal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closePricingModal();
        }
      });
    }

    // Initialize with default selection: Complete K9 Obedience
    updatePackage('complete-obedience', false);
  }

  /* ==========================================================================
     7. Section 7: Client Stories, FAQ Accordion & Free Assessment Controller
     ========================================================================== */
  
  // 1. Accessible FAQ Accordion
  const s7AccordionItems = Array.from(document.querySelectorAll('.s7-accordion-item'));
  if (s7AccordionItems.length > 0) {
    s7AccordionItems.forEach((item) => {
      const triggerBtn = item.querySelector('.s7-accordion-item__trigger');
      if (!triggerBtn) return;

      triggerBtn.addEventListener('click', () => {
        const isCurrentlyExpanded = item.classList.contains('is-expanded');

        // Toggle current item
        if (isCurrentlyExpanded) {
          item.classList.remove('is-expanded');
          triggerBtn.setAttribute('aria-expanded', 'false');
        } else {
          // Close sibling items for clean accordion UX
          s7AccordionItems.forEach((sibling) => {
            if (sibling !== item) {
              sibling.classList.remove('is-expanded');
              const siblingBtn = sibling.querySelector('.s7-accordion-item__trigger');
              if (siblingBtn) siblingBtn.setAttribute('aria-expanded', 'false');
            }
          });

          item.classList.add('is-expanded');
          triggerBtn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // 2. FAQ CTA Smooth Scroll to Assessment Form
  const s7FaqCtaBtn = document.getElementById('s7FaqCtaBtn');
  if (s7FaqCtaBtn) {
    s7FaqCtaBtn.addEventListener('click', (e) => {
      const targetId = s7FaqCtaBtn.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          e.preventDefault();
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

          const firstInput = document.getElementById('s7UserName');
          if (firstInput) {
            setTimeout(() => {
              firstInput.focus({ preventScroll: true });
            }, 400);
          }
        }
      }
    });
  }

  // 3. Free Assessment Form Validation & Front-End Handler
  const s7Form = document.getElementById('s7AssessmentForm');
  const s7FormFieldsGroup = document.getElementById('s7FormFieldsGroup');
  const s7FormFeedback = document.getElementById('s7FormFeedback');
  const s7FeedbackMsg = document.getElementById('s7FeedbackMsg');
  const s7FormResetBtn = document.getElementById('s7FormResetBtn');

  if (s7Form) {
    const s7Fields = {
      userName: {
        input: document.getElementById('s7UserName'),
        error: document.getElementById('s7UserNameError'),
        validate: (val) => {
          if (!val.trim()) return 'Please enter your name.';
          if (val.trim().length < 2) return 'Name must be at least 2 characters.';
          return '';
        }
      },
      userPhone: {
        input: document.getElementById('s7UserPhone'),
        error: document.getElementById('s7UserPhoneError'),
        validate: (val) => {
          if (!val.trim()) return 'Please enter your phone number.';
          const digitCount = (val.match(/\d/g) || []).length;
          if (digitCount < 7 || digitCount > 15) {
            return 'Please enter a valid phone number (e.g. 555-019-2834).';
          }
          return '';
        }
      },
      userEmail: {
        input: document.getElementById('s7UserEmail'),
        error: document.getElementById('s7UserEmailError'),
        validate: (val) => {
          if (!val.trim()) return 'Please enter your email address.';
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(val.trim())) {
            return 'Please enter a valid email address (e.g. name@domain.com).';
          }
          return '';
        }
      },
      dogName: {
        input: document.getElementById('s7DogName'),
        error: document.getElementById('s7DogNameError'),
        validate: (val) => {
          if (!val.trim()) return "Please enter your dog's name.";
          return '';
        }
      },
      dogAge: {
        input: document.getElementById('s7DogAge'),
        error: document.getElementById('s7DogAgeError'),
        validate: (val) => {
          if (!val.trim()) return "Please enter your dog's approximate age.";
          return '';
        }
      }
    };

    // Real-time error clearing on input
    Object.keys(s7Fields).forEach((key) => {
      const field = s7Fields[key];
      if (field.input) {
        field.input.addEventListener('input', () => {
          if (field.input.classList.contains('is-invalid')) {
            const err = field.validate(field.input.value);
            if (!err) {
              field.input.classList.remove('is-invalid');
              if (field.error) field.error.textContent = '';
            }
          }
        });
      }
    });

    // Form submission validation
    s7Form.addEventListener('submit', (event) => {
      event.preventDefault();

      let hasErrors = false;
      let firstInvalidInput = null;

      Object.keys(s7Fields).forEach((key) => {
        const field = s7Fields[key];
        if (field.input) {
          const errorMsg = field.validate(field.input.value);
          if (errorMsg) {
            hasErrors = true;
            field.input.classList.add('is-invalid');
            if (field.error) field.error.textContent = errorMsg;
            if (!firstInvalidInput) firstInvalidInput = field.input;
          } else {
            field.input.classList.remove('is-invalid');
            if (field.error) field.error.textContent = '';
          }
        }
      });

      if (hasErrors) {
        if (firstInvalidInput) {
          firstInvalidInput.focus();
        }
        return;
      }

      const userNameVal = s7Fields.userName.input.value.trim();
      const dogNameVal = s7Fields.dogName.input.value.trim();
      const programSelect = document.getElementById('s7ProgramSelect');
      const selectedProgramText = programSelect && programSelect.selectedIndex > 0
        ? programSelect.options[programSelect.selectedIndex].text
        : 'our comprehensive training pathways';

      // Accessible front-end confirmation view
      if (s7FeedbackMsg) {
        s7FeedbackMsg.textContent = `Thank you, ${userNameVal}! Your assessment request for ${dogNameVal} regarding ${selectedProgramText} has been validated. Our head trainer will review your dog's profile and contact you within 24 hours.`;
      }

      if (s7FormFieldsGroup) {
        s7FormFieldsGroup.classList.add('is-hidden');
      }

      if (s7FormFeedback) {
        s7FormFeedback.classList.remove('is-hidden');
        s7FormFeedback.focus();
      }
    });

    // Reset button
    if (s7FormResetBtn) {
      s7FormResetBtn.addEventListener('click', () => {
        s7Form.reset();

        Object.keys(s7Fields).forEach((key) => {
          const field = s7Fields[key];
          if (field.input) field.input.classList.remove('is-invalid');
          if (field.error) field.error.textContent = '';
        });

        if (s7FormFeedback) {
          s7FormFeedback.classList.add('is-hidden');
        }

        if (s7FormFieldsGroup) {
          s7FormFieldsGroup.classList.remove('is-hidden');
        }

        if (s7Fields.userName.input) {
          s7Fields.userName.input.focus();
        }
      });
    }
  }
});



