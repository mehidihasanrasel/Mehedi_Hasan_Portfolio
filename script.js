/* =============================================
   DR. MEHIDI HASAN - PORTFOLIO JAVASCRIPT
   ============================================= */

'use strict';

/* ---- PRELOADER ---- */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => preloader.remove(), 700);
    }, 1200);
  }
  initAOS();
  initCounters();
  initSkillBars();
});

/* ---- NAVBAR SCROLL & ACTIVE ---- */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Sticky navbar shadow
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }

  // Active nav link on scroll
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (scrollPos >= top && scrollPos < bottom) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${section.id}`) {
          link.classList.add('active');
        }
      });
    }
  });

  // Back to top
  const backToTop = document.getElementById('backToTop');
  if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
});

/* ---- HAMBURGER MENU ---- */
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('navLinks');

if (hamburger && navLinksContainer) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksContainer.classList.toggle('open');
    document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
  });

  navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinksContainer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinksContainer.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinksContainer.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ---- SMOOTH SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const headerH = document.getElementById('navbar')?.offsetHeight || 80;
      window.scrollTo({
        top: target.offsetTop - headerH,
        behavior: 'smooth'
      });
    }
  });
});

/* ---- BACK TO TOP ---- */
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---- AOS (Animate On Scroll) ---- */
function initAOS() {
  const aosEls = document.querySelectorAll('[data-aos]');
  const delays = {
    '100': 100, '150': 150, '200': 200, '250': 250,
    '300': 300, '350': 350
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute('data-aos-delay') || 0;
        setTimeout(() => el.classList.add('aos-animate'), parseInt(delay));
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  aosEls.forEach(el => observer.observe(el));
}

/* ---- COUNTER ANIMATION ---- */
function initCounters() {
  const counters = document.querySelectorAll('.counter, .stat-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count') || el.textContent);
  const duration = 1800;
  const step = 16;
  const steps = Math.ceil(duration / step);
  let current = 0;
  const increment = target / steps;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString();
  }, step);
}

/* ---- SKILL BARS ---- */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.getAttribute('data-width');
        fill.style.width = width + '%';
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(f => observer.observe(f));
}

/* ---- EXPERIENCE TABS ---- */
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.timeline-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-tab');
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    tabContents.forEach(tc => {
      tc.classList.add('hidden');
    });

    const activeContent = document.getElementById(target + 'Tab');
    if (activeContent) {
      activeContent.classList.remove('hidden');
      // Re-trigger AOS for newly shown elements
      activeContent.querySelectorAll('[data-aos]').forEach(el => {
        setTimeout(() => el.classList.add('aos-animate'), 100);
      });
    }
  });
});

/* ---- GALLERY FILTER ---- */
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    galleryItems.forEach(item => {
      if (filter === 'all' || item.getAttribute('data-category') === filter) {
        item.classList.remove('hide');
        item.style.animation = 'none';
        setTimeout(() => {
          item.style.animation = '';
        }, 10);
      } else {
        item.classList.add('hide');
      }
    });
  });
});

/* ---- TESTIMONIALS SLIDER ---- */
const testimonialCards = document.querySelectorAll('.testimonial-card');
const sliderDotsContainer = document.getElementById('sliderDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentSlide = 0;
let autoSlideTimer;

function initSlider() {
  if (!testimonialCards.length) return;

  // Create dots
  testimonialCards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    sliderDotsContainer.appendChild(dot);
  });

  showSlide(0);
  startAutoSlide();
}

function showSlide(index) {
  const dots = document.querySelectorAll('.dot');
  testimonialCards.forEach((card, i) => {
    card.classList.remove('active');
    if (dots[i]) dots[i].classList.remove('active');
  });
  testimonialCards[index].classList.add('active');
  if (dots[index]) dots[index].classList.add('active');
  currentSlide = index;
}

function goToSlide(index) {
  let newIndex = index;
  if (newIndex < 0) newIndex = testimonialCards.length - 1;
  if (newIndex >= testimonialCards.length) newIndex = 0;
  showSlide(newIndex);
  resetAutoSlide();
}

function startAutoSlide() {
  autoSlideTimer = setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 5000);
}

function resetAutoSlide() {
  clearInterval(autoSlideTimer);
  startAutoSlide();
}

if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

// Touch/swipe support for slider
let touchStartX = 0;
const track = document.getElementById('testimonialsTrack');
if (track) {
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
  });
}

initSlider();

/* ---- APPOINTMENT FORM ---- */
const appointForm = document.getElementById('appointmentForm');
const successModal = document.getElementById('successModal');
const modalClose = document.getElementById('modalClose');

if (appointForm) {
  appointForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = appointForm.querySelector('.btn-submit');
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Appointment Request';
      submitBtn.disabled = false;
      appointForm.reset();
      if (successModal) {
        successModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    }, 1500);
  });
}

if (modalClose) {
  modalClose.addEventListener('click', () => {
    successModal.classList.remove('open');
    document.body.style.overflow = '';
  });
}

if (successModal) {
  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
      successModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ---- FLOATING PARTICLES ---- */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 20;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 40 + 10;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 10}s;
    `;
    container.appendChild(p);
  }
}

createParticles();

/* ---- GALLERY LIGHTBOX ---- */
const galleryImgs = document.querySelectorAll('.gallery-img');

galleryImgs.forEach(img => {
  img.addEventListener('click', () => {
    const caption = img.closest('.gallery-item')?.querySelector('.gallery-caption')?.textContent || '';

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 9000;
      background: rgba(7,30,61,0.92);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      animation: fadeIn 0.3s ease;
    `;

    const box = document.createElement('div');
    box.style.cssText = `
      background: #1a2744;
      border-radius: 14px;
      padding: 48px;
      text-align: center;
      max-width: 500px;
      width: 90%;
      color: white;
    `;

    const icon = document.createElement('i');
    icon.className = 'fas fa-image';
    icon.style.cssText = 'font-size: 4rem; color: rgba(255,255,255,0.2); margin-bottom: 16px; display: block;';

    const title = document.createElement('p');
    title.textContent = caption;
    title.style.cssText = 'font-size: 1.1rem; font-weight: 600; margin-bottom: 6px;';

    const hint = document.createElement('p');
    hint.textContent = 'Click anywhere to close';
    hint.style.cssText = 'font-size: 0.8rem; color: rgba(255,255,255,0.4); margin-top: 16px;';

    box.appendChild(icon);
    box.appendChild(title);
    box.appendChild(hint);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    overlay.addEventListener('click', () => {
      overlay.remove();
      document.body.style.overflow = '';
    });

    document.addEventListener('keydown', function closeOnEsc(e) {
      if (e.key === 'Escape') {
        overlay.remove();
        document.body.style.overflow = '';
        document.removeEventListener('keydown', closeOnEsc);
      }
    });
  });
});

/* ---- HEADER SCROLL DIRECTION ---- */
let lastScrollY = 0;
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  if (header && currentScrollY > 200) {
    if (currentScrollY > lastScrollY + 5) {
      header.querySelector('.navbar').style.transform = 'translateY(-100%)';
    } else if (currentScrollY < lastScrollY - 5) {
      header.querySelector('.navbar').style.transform = 'translateY(0)';
    }
  } else if (header) {
    header.querySelector('.navbar').style.transform = 'translateY(0)';
  }
  lastScrollY = currentScrollY;
}, { passive: true });

/* ---- SPECIALTY CARD HOVER EFFECT ---- */
document.querySelectorAll('.specialty-card').forEach(card => {
  card.addEventListener('mouseenter', function () {
    this.style.zIndex = '2';
  });
  card.addEventListener('mouseleave', function () {
    this.style.zIndex = '';
  });
});

/* ---- DATE INPUT MIN DATE ---- */
const dateInput = document.querySelector('input[type="date"]');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
}

/* ---- KEYBOARD NAVIGATION ---- */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Close mobile menu
    if (navLinksContainer && navLinksContainer.classList.contains('open')) {
      hamburger.classList.remove('active');
      navLinksContainer.classList.remove('open');
      document.body.style.overflow = '';
    }
    // Close modal
    if (successModal && successModal.classList.contains('open')) {
      successModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // Slider keyboard navigation
  if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
  if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
});

/* ---- FOOTER YEAR ---- */
const yearEl = document.querySelector('.footer-bottom p');
if (yearEl) {
  const currentYear = new Date().getFullYear();
  yearEl.innerHTML = yearEl.innerHTML.replace('2025', currentYear);
}

console.log('✅ Dr. Mehidi Hasan Portfolio Loaded Successfully!');
