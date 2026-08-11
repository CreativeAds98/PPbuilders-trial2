/* ==========================================================================
   PP BUILDERS & INTERIORS - INTERACTIVE JAVASCRIPT WITH MOBILE TOGGLE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCostCalculator();
  initProjectFilter();
  initModalHandler();
  initNavigation();
  initContactForm();
  initFloatingActions();
  initScrollReveal();
});

/* --------------------------------------------------------------------------
   Mobile Menu Toggle Logic
   -------------------------------------------------------------------------- */
window.toggleMobileMenu = function (e) {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  if (navMenu) {
    const isOpen = navMenu.classList.toggle('active');
    if (mobileToggle) {
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    }
  }
};

function initMobileMenu() {
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const dropdownItems = document.querySelectorAll('.has-dropdown');

  // Toggle dropdowns in mobile view
  dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
      if (window.innerWidth <= 1080) {
        item.classList.toggle('active');
      }
    });
  });

  // Close mobile menu when clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu && (!link.parentElement || !link.parentElement.classList.contains('has-dropdown') || window.innerWidth > 1080)) {
        navMenu.classList.remove('active');
        const mobileToggle = document.getElementById('mobileToggle');
        if (mobileToggle) {
          const icon = mobileToggle.querySelector('i');
          if (icon) icon.className = 'fa-solid fa-bars';
        }
      }
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    const mobileToggle = document.getElementById('mobileToggle');
    if (navMenu && navMenu.classList.contains('active')) {
      if (mobileToggle && mobileToggle.contains(e.target)) return;
      if (!navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        if (mobileToggle) {
          const icon = mobileToggle.querySelector('i');
          if (icon) icon.className = 'fa-solid fa-bars';
        }
      }
    }
  });
}

/* --------------------------------------------------------------------------
   Cost Calculator Logic
   -------------------------------------------------------------------------- */
function initCostCalculator() {
  const plotAreaInput = document.getElementById('plotArea');
  const plotAreaValue = document.getElementById('plotAreaVal');
  const floorOptions = document.querySelectorAll('.floor-opt');
  const packageOptions = document.querySelectorAll('.package-opt');

  const displayTotal = document.getElementById('calcTotalEstimate');
  const displayStructure = document.getElementById('calcStructure');
  const displayInteriors = document.getElementById('calcInteriors');
  const displayServices = document.getElementById('calcServices');

  if (!plotAreaInput) return;

  let currentFloors = 1;
  let currentRate = 2100;

  plotAreaInput.addEventListener('input', (e) => {
    plotAreaValue.textContent = `${e.target.value} sq.ft`;
    calculateCost();
  });

  floorOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      floorOptions.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      currentFloors = parseFloat(btn.dataset.floors);
      calculateCost();
    });
  });

  packageOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      packageOptions.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      currentRate = parseInt(btn.dataset.rate, 10);
      calculateCost();
    });
  });

  function calculateCost() {
    const area = parseInt(plotAreaInput.value, 10);
    const totalArea = area * currentFloors;
    const totalEstimate = totalArea * currentRate;

    const structureCost = totalEstimate * 0.60;
    const interiorCost = totalEstimate * 0.25;
    const servicesCost = totalEstimate * 0.15;

    if (displayTotal) displayTotal.textContent = `₹${formatLakhs(totalEstimate)}`;
    if (displayStructure) displayStructure.textContent = `₹${formatLakhs(structureCost)}`;
    if (displayInteriors) displayInteriors.textContent = `₹${formatLakhs(interiorCost)}`;
    if (displayServices) displayServices.textContent = `₹${formatLakhs(servicesCost)}`;
  }

  function formatLakhs(num) {
    if (num >= 10000000) {
      return (num / 10000000).toFixed(2) + ' Cr';
    } else if (num >= 100000) {
      return (num / 100000).toFixed(2) + ' Lakh';
    }
    return num.toLocaleString('en-IN');
  }

  calculateCost();
}

function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.dataset.filter;

      projectItems.forEach(item => {
        if (filterValue === 'all' || item.dataset.category === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

function initModalHandler() {
  const estimateBtns = document.querySelectorAll('.trigger-modal');
  const modalOverlay = document.getElementById('estimateModal');
  const closeBtn = document.querySelector('.modal-close');

  if (!modalOverlay) return;

  estimateBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modalOverlay.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  });
}

function initNavigation() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (header) {
      if (window.pageYOffset > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (sections.length === 0) return;
    let current = '';
    const scrollPosition = window.pageYOffset + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    if (current) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          link.classList.remove('active');
          if (href === `#${current}`) {
            link.classList.add('active');
          }
        }
      });
    }
  });
}

function initContactForm() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const modalOverlay = document.getElementById('estimateModal');
      alert('Thank you! Your estimate request has been submitted. PP Builders & Interiors engineering team will contact you shortly.');
      form.reset();
      if (modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  });
}

function initFloatingActions() {
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* Hide Preloader when page loads completely */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('fade-out');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  }
});

/* --------------------------------------------------------------------------
   Lazy Loading on Scroll (Intersection Observer for Sections & Lazy Images)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  // Automatically target key sections, cards, and items across all pages
  const targets = document.querySelectorAll('section, .trust-card, .service-card, .material-card, .project-item, .testimonial-card, .process-card, .step-card, .faq-item, .contact-card');

  targets.forEach(el => {
    // Avoid double tagging header/hero elements if needed
    if (!el.classList.contains('hero-section') && !el.classList.contains('site-header')) {
      el.classList.add('reveal-on-scroll');
    }
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Lazy load data-src images if present
        const lazyImgs = entry.target.querySelectorAll('img[data-src]');
        lazyImgs.forEach(img => {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        });
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
  });
}
