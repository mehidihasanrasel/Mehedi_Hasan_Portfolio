/* ══════════════════════════════════════════
   ExcelPro Portfolio — script.js
══════════════════════════════════════════ */

/* ── 1. EMBED PROFILE PHOTO ── */
// The photo is stored as a base64 string in photoData (injected by build step).
// If running standalone, we use the placeholder image path.
(function embedPhoto() {
  const img = document.getElementById('profileImg');
  if (!img) return;
  // If no external photo provided, show a professional placeholder
  if (img.src.includes('PHOTO_PLACEHOLDER') || img.src === '') {
    img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='380' viewBox='0 0 300 380'%3E%3Crect width='300' height='380' fill='%230d1424'/%3E%3Ccircle cx='150' cy='140' r='70' fill='%23151e2d'/%3E%3Cellipse cx='150' cy='310' rx='110' ry='80' fill='%23151e2d'/%3E%3C/svg%3E";
  }
})();

/* ── 2. CUSTOM CURSOR ── */
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function animFollower() {
  fx += (mx - fx) * 0.1;
  fy += (my - fy) * 0.1;
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
  requestAnimationFrame(animFollower);
})();

/* ── 3. NAVBAR SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  // back to top
  backTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

/* ── 4. HAMBURGER ── */
const hamburger = document.getElementById('hamburger');
hamburger.addEventListener('click', () => {
  navbar.classList.toggle('mobile-open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => navbar.classList.remove('mobile-open'));
});

/* ── 5. TYPEWRITER ── */
const texts = [
  'Excel Automation Expert',
  'Google Sheets Specialist',
  'Data Dashboard Designer',
  'VBA Macro Developer',
  'Power Query Analyst',
];
let ti = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
  const current = texts[ti];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++ci);
    if (ci === current.length) { deleting = true; setTimeout(type, 1800); return; }
    setTimeout(type, 80);
  } else {
    typedEl.textContent = current.slice(0, --ci);
    if (ci === 0) { deleting = false; ti = (ti + 1) % texts.length; setTimeout(type, 300); return; }
    setTimeout(type, 40);
  }
}
setTimeout(type, 800);

/* ── 6. SCROLL REVEAL (AOS) ── */
const aosEls = document.querySelectorAll('[data-aos]');
const aosObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('aos-visible');
      aosObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
aosEls.forEach(el => aosObs.observe(el));

/* ── 7. COUNTERS ── */
const counters = document.querySelectorAll('.counter');
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.target;
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 20);
    countObs.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(el => countObs.observe(el));

/* ── 8. SKILL BARS ── */
const bars = document.querySelectorAll('.skill-bar');
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('animated');
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
bars.forEach(b => barObs.observe(b));

/* ── 9. PROJECT FILTER ── */
const filterBtns = document.querySelectorAll('.pf-btn');
const projCards  = document.querySelectorAll('.proj-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.display = match ? '' : 'none';
      if (match) {
        card.style.animation = 'fadeIn 0.4s ease both';
      }
    });
  });
});

/* ── 10. TESTIMONIALS SLIDER ── */
const track  = document.getElementById('testiTrack');
const dotsWrap = document.getElementById('testiDots');
const slides = document.querySelectorAll('.testi-card');
let current = 0;
const visibleCount = () => window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;

// Build dots
slides.forEach((_, i) => {
  const d = document.createElement('div');
  d.className = 'testi-dot' + (i === 0 ? ' active' : '');
  d.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(d);
});

function goTo(idx) {
  const max = slides.length - visibleCount();
  current = Math.max(0, Math.min(idx, max));
  const cardWidth = slides[0].offsetWidth + 24; // gap
  track.style.transform = `translateX(-${current * cardWidth}px)`;
  document.querySelectorAll('.testi-dot').forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });
}

document.getElementById('tPrev').addEventListener('click', () => goTo(current - 1));
document.getElementById('tNext').addEventListener('click', () => goTo(current + 1));

// Auto play
let autoSlide = setInterval(() => goTo(current + 1 > slides.length - visibleCount() ? 0 : current + 1), 4000);
track.parentElement.addEventListener('mouseenter', () => clearInterval(autoSlide));
track.parentElement.addEventListener('mouseleave', () => {
  autoSlide = setInterval(() => goTo(current + 1 > slides.length - visibleCount() ? 0 : current + 1), 4000);
});

/* ── 11. CONTACT FORM ── */
document.getElementById('sendBtn').addEventListener('click', () => {
  const name    = document.getElementById('cf-name').value.trim();
  const email   = document.getElementById('cf-email').value.trim();
  const subject = document.getElementById('cf-subject').value.trim();
  const msg     = document.getElementById('cf-msg').value.trim();

  if (!name || !email || !msg) {
    alert('Please fill in your name, email and message.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  const btn = document.getElementById('sendBtn');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = '✅ Message Sent!';
    document.getElementById('cfSuccess').style.display = 'block';
    document.getElementById('cf-name').value = '';
    document.getElementById('cf-email').value = '';
    document.getElementById('cf-subject').value = '';
    document.getElementById('cf-msg').value = '';
    setTimeout(() => {
      btn.textContent = 'Send Message →';
      btn.disabled = false;
      document.getElementById('cfSuccess').style.display = 'none';
    }, 4000);
  }, 1200);
});

/* ── 12. BACK TO TOP ── */
const backTop = document.getElementById('backTop');
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── 13. SMOOTH ACTIVE NAV ── */
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');
const sectionObs  = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinksAll.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + e.target.id ? 'var(--white)' : '';
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionObs.observe(s));

/* ── 14. HERO PARALLAX ── */
window.addEventListener('scroll', () => {
  const blobs = document.querySelectorAll('.blob');
  const y = window.scrollY;
  blobs[0].style.transform = `translate(0, ${y * 0.08}px)`;
  blobs[1].style.transform = `translate(0, ${-y * 0.05}px)`;
}, { passive: true });

/* ── 15. FADE IN ANIMATION ── */
const style = document.createElement('style');
style.textContent = `
@keyframes fadeIn {
  from { opacity:0; transform:scale(0.95) translateY(10px); }
  to   { opacity:1; transform:scale(1) translateY(0); }
}`;
document.head.appendChild(style);

console.log('%c ExcelPro Portfolio ✦', 'background:#6366f1;color:#fff;font-size:14px;padding:6px 12px;border-radius:4px;');
