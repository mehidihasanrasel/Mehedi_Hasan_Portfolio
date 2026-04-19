/* ══════════════════════════════════════════
   Rasel — ExcelPro — script.js
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

console.log('%c Rasel — ExcelPro ✦', 'background:#6366f1;color:#fff;font-size:14px;padding:6px 12px;border-radius:4px;');

/* ══════════════════════════════════════════
   EXTRA FEATURES
══════════════════════════════════════════ */

/* ── THEME PICKER ── */
const pickerBtn      = document.getElementById('themePickerBtn');
const pickerWrap     = document.getElementById('themePicker');
const themeDropdown  = document.getElementById('themeDropdown');
const swatches       = document.querySelectorAll('.tc-swatch');
const darkModeBtn    = document.getElementById('darkModeBtn');
const lightModeBtn   = document.getElementById('lightModeBtn');

// Toggle dropdown
pickerBtn.addEventListener('click', e => {
  e.stopPropagation();
  pickerWrap.classList.toggle('open');
});
document.addEventListener('click', () => pickerWrap.classList.remove('open'));
themeDropdown.addEventListener('click', e => e.stopPropagation());

// Color theme
swatches.forEach(sw => {
  sw.addEventListener('click', () => {
    swatches.forEach(s => s.classList.remove('active'));
    sw.classList.add('active');
    document.body.dataset.theme = sw.dataset.theme;
    localStorage.setItem('ep-theme', sw.dataset.theme);
  });
});

// Dark / Light mode
darkModeBtn.addEventListener('click', () => {
  document.body.classList.remove('light-mode');
  darkModeBtn.classList.add('active');
  lightModeBtn.classList.remove('active');
  localStorage.setItem('ep-mode', 'dark');
});
lightModeBtn.addEventListener('click', () => {
  document.body.classList.add('light-mode');
  lightModeBtn.classList.add('active');
  darkModeBtn.classList.remove('active');
  localStorage.setItem('ep-mode', 'light');
});

// Restore saved preferences
(function restorePrefs() {
  const savedTheme = localStorage.getItem('ep-theme') || 'default';
  const savedMode  = localStorage.getItem('ep-mode')  || 'dark';
  document.body.dataset.theme = savedTheme;
  swatches.forEach(s => s.classList.toggle('active', s.dataset.theme === savedTheme));
  if (savedMode === 'light') {
    document.body.classList.add('light-mode');
    lightModeBtn.classList.add('active');
    darkModeBtn.classList.remove('active');
  }
})();



/* ── PRELOADER ── */
(function() {
  document.body.classList.add('loading');
  const loader  = document.getElementById('preloader');
  const bar     = document.getElementById('preBar');
  const pct     = document.getElementById('prePercent');
  let progress  = 0;
  const target  = 100;
  const speeds  = [0.8, 1.2, 1.6, 2.2, 3.0]; // accelerates

  function tick() {
    const remaining = target - progress;
    const speed = speeds[Math.floor(progress / 20)] || 1;
    progress += Math.random() * speed * (remaining / 60);
    if (progress >= target) progress = target;

    bar.style.width = progress + '%';
    pct.textContent = Math.floor(progress) + '%';

    if (progress < target) {
      requestAnimationFrame(tick);
    } else {
      clearInterval(forceInterval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');
      }, 400);
    }
  }

  // Fixed: use simple timer — never hangs
  let elapsed = 0;
  const forceInterval = setInterval(() => {
    elapsed += 50;
    // Force progress to reach 100 within 2.5s max
    if (elapsed >= 2500 && progress < 100) {
      progress = 100;
      bar.style.width = '100%';
      pct.textContent = '100%';
      clearInterval(forceInterval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');
      }, 400);
    }
  }, 50);
  // Also start the normal tick immediately
  setTimeout(tick, 100);
})();



/* ── HERO PARTICLE ANIMATION ── */
(function(){
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: -9999, y: -9999 };
  const COUNT = 130;
  const COLORS = ['#10b981','#6366f1','#ec4899','#f59e0b','#0ea5e9','#a78bfa'];

  function resize() {
    const hero = document.getElementById('home');
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x    = Math.random() * W;
      this.y    = init ? Math.random() * H : H + 10;
      this.r    = Math.random() * 2.2 + 0.5;
      this.vx   = (Math.random() - 0.5) * 0.35;
      this.vy   = -(Math.random() * 0.5 + 0.15);
      this.alpha= Math.random() * 0.55 + 0.15;
      this.color= COLORS[Math.floor(Math.random() * COLORS.length)];
      this.pulse= Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.025 + 0.008;
      // connection data
      this.ax = 0; this.ay = 0;
    }
    update() {
      this.pulse += this.pulseSpeed;
      const pulseFactor = 1 + Math.sin(this.pulse) * 0.3;

      // Mouse repel
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        const force = (100 - dist) / 100;
        this.ax += (dx / dist) * force * 0.6;
        this.ay += (dy / dist) * force * 0.6;
      }
      this.ax *= 0.88;
      this.ay *= 0.88;

      this.x += this.vx + this.ax;
      this.y += this.vy + this.ay;
      this.drawR = this.r * pulseFactor;

      if (this.y < -10 || this.x < -20 || this.x > W + 20) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.drawR || this.r, 0, Math.PI*2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();

      // glow
      ctx.beginPath();
      ctx.arc(this.x, this.y, (this.drawR || this.r) * 2.5, 0, Math.PI*2);
      const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, (this.drawR||this.r)*2.5);
      grd.addColorStop(0, this.color + '55');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.globalAlpha = this.alpha * 0.6;
      ctx.fill();
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i+1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          const alpha = (1 - dist/120) * 0.12;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = a.color;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function init() {
    resize();
    particles = Array.from({length: COUNT}, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); });
  document.getElementById('home').addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  document.getElementById('home').addEventListener('mouseleave', () => {
    mouse.x = -9999; mouse.y = -9999;
  });

  init();
  loop();
})();



/* ══ SMOOTH PAGE TRANSITIONS ══ */
(function(){

  /* scrollProgress upgraded */

  /* ── 2. Page transition overlay ── */
  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  overlay.innerHTML = '<div class="pt-panel"></div><div class="pt-panel"></div><div class="pt-panel"></div><div class="pt-panel"></div>';
  document.body.appendChild(overlay);

  function transitionTo(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

    // Enter: panels sweep in
    overlay.classList.add('enter-active');
    overlay.classList.remove('exit-active');

    setTimeout(() => {
      // Scroll to section instantly (while covered)
      target.scrollIntoView({behavior:'instant'});
      target.classList.add('section-flash');
      setTimeout(()=>target.classList.remove('section-flash'), 900);
    }, 350);

    setTimeout(() => {
      // Exit: panels sweep out
      overlay.classList.add('exit-active');
      setTimeout(() => {
        overlay.classList.remove('enter-active','exit-active');
      }, 700);
    }, 550);
  }

  /* ── 3. Nav link hijack ── */
  document.querySelectorAll('.nav-links a, .btn-hire, a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || !href.startsWith('#') || href === '#') return;
      const targetId = href.slice(1);
      const target   = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();

      // Ripple effect at click position
      const ripple = document.createElement('div');
      ripple.className = 'nav-ripple';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top  = e.clientY + 'px';
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);

      transitionTo(targetId);
    });
  });

  /* ── 4. Scroll-reveal with direction ── */
  // Add data-reveal to key elements
  const revealMap = [
    ['.hero-text',          'left',  '0'],
    ['.hero-photo-wrap',    'right', '0'],
    ['.about-visual',       'left',  '0'],
    ['.about-content',      'right', '0'],
    ['.skill-card',         'up',    null],
    ['.proj-card',          'up',    null],
    ['.testi-card',         'scale', null],
    ['.cc-card',            'left',  null],
    ['.cf-card',            'right', '0'],
    ['.section-header',     'up',    '0'],
    ['.acard',              'left',  null],
    ['.section-tag',        'up',    '0'],
    ['.hstat',              'up',    null],
  ];

  revealMap.forEach(([sel, dir, delay]) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      // Only apply if not already handled by old AOS
      if (!el.hasAttribute('data-reveal')) {
        el.setAttribute('data-reveal', dir);
        if (delay !== null) {
          el.setAttribute('data-delay', delay || String(Math.min(i, 5)));
        } else {
          el.setAttribute('data-delay', String(Math.min(i, 5)));
        }
      }
    });
  });

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

  /* ── 5. Active nav highlight on scroll ── */
  const navAs = document.querySelectorAll('.nav-links a');
  const allSections = document.querySelectorAll('section[id]');
  const sectionObs2 = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAs.forEach(a => {
          const match = a.getAttribute('href') === '#' + e.target.id;
          a.classList.toggle('nav-active', match);
        });
      }
    });
  }, { threshold: 0.35 });
  allSections.forEach(s => sectionObs2.observe(s));

  /* ── 6. Hero entrance on load ── */
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.querySelectorAll('.hero-text [data-reveal], .hero-photo-wrap').forEach((el,i) => {
        setTimeout(() => el.classList.add('revealed'), i * 120);
      });
    }, 200);
  });

})();



/* ══ EXCEL PREVIEW WIDGET ══ */
(function(){

  const SHEETS = {
    sales: {
      label: 'Sales Dashboard',
      cols: ['Month','Revenue','Target','Growth','Status'],
      formulas: {
        B: '=SUMIF(A:A,A{r},B:B)', C: '=B{r}*1.1', D: '=(B{r}-C{r})/C{r}*100', E: '=IF(D{r}>0,"✅ Above","❌ Below")'
      },
      rows: [
        ['January',  4200000, 4000000,  5.0, '✅ Above'],
        ['February', 3800000, 4000000, -5.0, '❌ Below'],
        ['March',    5100000, 4500000, 13.3, '✅ Above'],
        ['April',    4750000, 4500000,  5.6, '✅ Above'],
        ['May',      5300000, 5000000,  6.0, '✅ Above'],
        ['June',     4900000, 5000000, -2.0, '❌ Below'],
        ['July',     6200000, 5500000, 12.7, '✅ Above'],
        ['August',   5800000, 5500000,  5.5, '✅ Above'],
        ['September',6500000, 6000000,  8.3, '✅ Above'],
        ['October',  7100000, 6500000,  9.2, '✅ Above'],
        ['November', 6800000, 6500000,  4.6, '✅ Above'],
        ['December', 8200000, 7000000, 17.1, '✅ Above'],
        ['TOTAL',   '=SUM(B2:B13)','=SUM(C2:C13)','=AVERAGE(D2:D13)','✅ Profitable'],
      ],
      chartKey: 1, chartLabel: 'Monthly Revenue (BDT)',
      chartColor: ['#10b981','#6366f1','#10b981','#10b981','#10b981','#6366f1','#10b981','#10b981','#10b981','#10b981','#10b981','#10b981'],
      legend: [{color:'#10b981',label:'Above Target'},{color:'#6366f1',label:'Below Target'}]
    },
    attendance: {
      label: 'Attendance Sheet',
      cols: ['Employee','Dept','Present','Absent','Late','Salary (BDT)'],
      rows: [
        ['Rasel Ahmed',   'IT',  22, 1, 2, 28000],
        ['Karim Uddin',   'HR',  20, 3, 1, 22000],
        ['Nadia Islam',   'Sales',23, 0, 0, 25000],
        ['Rahim Khan',    'IT',  19, 4, 3, 30000],
        ['Sumaiya Akter', 'Admin',21, 2, 1, 18000],
        ['Farhan Hasan',  'Sales',24, 0, 0, 27000],
        ['Mitu Begum',    'HR',  18, 5, 2, 20000],
        ['Sabbir Ahmed',  'IT',  23, 1, 0, 32000],
        ['Roksana Parvin','Admin',20, 3, 2, 17500],
        ['Tanvir Hossain','Sales',22, 2, 1, 26000],
        ['TOTAL','—','=SUM(C2:C11)','=SUM(D2:D11)','=SUM(E2:E11)','=SUM(F2:F11)'],
      ],
      chartKey: 2, chartLabel: 'Attendance: Present Days',
      chartColor: ['#10b981','#f59e0b','#10b981','#f59e0b','#10b981','#10b981','#f59e0b','#10b981','#10b981','#10b981'],
      legend: [{color:'#10b981',label:'Full Attendance'},{color:'#f59e0b',label:'Has Absences'}]
    },
    expense: {
      label: 'Expense Tracker',
      cols: ['Category','Budget (BDT)','Spent','Remaining','Usage %'],
      rows: [
        ['Office Rent',   15000, 15000,     0,   '100%'],
        ['Utilities',      3000,  2750,   250,  '91.7%'],
        ['Software',       5000,  4200,   800,    '84%'],
        ['Marketing',     10000,  8500,  1500,    '85%'],
        ['Salaries',      80000, 80000,     0,   '100%'],
        ['Transport',      4000,  3200,   800,    '80%'],
        ['Food/Misc',      3000,  2100,   900,    '70%'],
        ['Equipment',      8000,  6500,  1500,  '81.3%'],
        ['Training',       5000,  2000,  3000,    '40%'],
        ['Contingency',    5000,   500,  4500,    '10%'],
        ['TOTAL','=SUM(B2:B11)','=SUM(C2:C11)','=SUM(D2:D11)','=AVERAGE(E2:E11)'],
      ],
      chartKey: 2, chartLabel: 'Budget vs Spent',
      chartColor: ['#ec4899','#ec4899','#f59e0b','#f59e0b','#ec4899','#f59e0b','#10b981','#f59e0b','#10b981','#10b981'],
      legend: [{color:'#ec4899',label:'Over 90%'},{color:'#f59e0b',label:'75-90%'},{color:'#10b981',label:'Under 75%'}]
    },
    invoice: {
      label: 'Invoice Generator',
      cols: ['Item / Service','Qty','Unit Price','Discount','Total (BDT)'],
      rows: [
        ['Sales Dashboard',    1, 3500, '0%',   3500],
        ['Attendance Sheet',   1, 2500, '10%',  2250],
        ['VBA Macro Setup',    2, 1500, '0%',   3000],
        ['Power Query Clean',  1, 4000, '5%',   3800],
        ['Chart Design',       3,  800, '0%',   2400],
        ['Data Entry System',  1, 2000, '15%',  1700],
        ['Training Session',   2, 1200, '0%',   2400],
        ['Monthly Support',    1, 5000, '20%',  4000],
        ['','','','Subtotal','=SUM(E2:E9)'],
        ['','','','VAT (5%)','=E10*0.05'],
        ['','','','GRAND TOTAL','=E10+E11'],
      ],
      chartKey: 4, chartLabel: 'Revenue per Service',
      chartColor: ['#6366f1','#8b5cf6','#6366f1','#a78bfa','#6366f1','#8b5cf6','#6366f1','#a78bfa'],
      legend: [{color:'#6366f1',label:'Services'},{color:'#a78bfa',label:'Support'}]
    }
  };

  let currentSheet = 'sales';
  let sortAsc = true;
  let selectedCell = null;

  const grid       = document.getElementById('ewGrid');
  const chart      = document.getElementById('ewChart');
  const legend     = document.getElementById('ewLegend');
  const cellRef    = document.getElementById('ewCellRef');
  const formulaEl  = document.getElementById('ewFormula');
  const statusLeft = document.getElementById('ewStatusLeft');
  const statusRight= document.getElementById('ewStatusRight');
  const sumEl      = document.getElementById('ewSum');
  const avgEl      = document.getElementById('ewAvg');
  const countEl    = document.getElementById('ewCount');
  const chartLabel = document.getElementById('ewChartLabel');

  if (!grid) return;

  function formatNum(val) {
    if (typeof val === 'number') {
      if (val > 10000) return val.toLocaleString('en-BD');
      if (Number.isInteger(val)) return val.toLocaleString();
      return val.toFixed(1);
    }
    return val;
  }

  function renderGrid(sheetKey) {
    const s = SHEETS[sheetKey];
    const cols = s.cols;
    const rows = s.rows;
    const totalCols = cols.length + 1; // +1 for row numbers

    grid.style.gridTemplateColumns = '36px ' + cols.map((_,i) =>
      i === 0 ? '140px' : '110px'
    ).join(' ');

    let html = '';
    // Corner cell
    html += '<div class="ew-col-head"></div>';
    // Column headers (A, B, C...)
    cols.forEach((_, i) => {
      html += `<div class="ew-col-head">${String.fromCharCode(65+i)}</div>`;
    });

    // Header row
    html += '<div class="ew-row-num">1</div>';
    cols.forEach(col => {
      html += `<div class="ew-cell header-cell">${col}</div>`;
    });

    // Data rows
    rows.forEach((row, ri) => {
      const isTotal = ri === rows.length - 1;
      html += `<div class="ew-row-num">${ri + 2}</div>`;
      row.forEach((cell, ci) => {
        let cls = 'ew-cell';
        if (isTotal) cls += ' total-cell';
        else if (ci > 0) {
          if (typeof cell === 'number') {
            if (cell > 0 && ci === (sheetKey === 'sales' ? 3 : -1)) cls += ' positive';
            if (cell < 0) cls += ' negative';
          }
          if (typeof cell === 'string' && cell.includes('✅')) cls += ' positive';
          if (typeof cell === 'string' && cell.includes('❌')) cls += ' negative';
        }
        const colLetter = String.fromCharCode(65 + ci);
        const rowNum = ri + 2;
        const display = typeof cell === 'string' && cell.startsWith('=') ? cell : formatNum(cell);
        html += `<div class="${cls}" data-row="${rowNum}" data-col="${colLetter}" data-val="${cell}">${display}</div>`;
      });
    });

    grid.innerHTML = html;
    statusLeft.textContent = `📋 Sheet: ${s.label} | ${rows.length} rows × ${cols.length} cols`;

    // Cell click
    grid.querySelectorAll('.ew-cell:not(.header-cell)').forEach(cell => {
      cell.addEventListener('click', function() {
        grid.querySelectorAll('.ew-cell').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        selectedCell = this;
        const r = this.dataset.row, c = this.dataset.col, v = this.dataset.val;
        cellRef.textContent = c + r;
        // Show formula or value
        const formulas = s.formulas || {};
        const colKey = c;
        const f = formulas[colKey];
        formulaEl.textContent = f ? f.replace('{r}', r) : (typeof v === 'string' && v.startsWith('=') ? v : v);

        // Update stats
        const numericCells = Array.from(grid.querySelectorAll('.ew-cell[data-col="' + c + '"]:not(.header-cell)'))
          .map(el => parseFloat(el.dataset.val))
          .filter(n => !isNaN(n));
        if (numericCells.length) {
          const sum = numericCells.reduce((a,b)=>a+b,0);
          sumEl.textContent   = Math.round(sum).toLocaleString();
          avgEl.textContent   = Math.round(sum/numericCells.length).toLocaleString();
          countEl.textContent = numericCells.length;
        }
      });
    });
  }

  function renderChart(sheetKey) {
    const s = SHEETS[sheetKey];
    const dataRows = s.rows.slice(0, -1); // exclude total
    const key = s.chartKey;

    const vals = dataRows.map(r => typeof r[key] === 'number' ? r[key] : 0);
    const labels = dataRows.map(r => r[0].toString().slice(0, 3));
    const maxVal = Math.max(...vals) || 1;
    const colors = s.chartColor;

    chartLabel.textContent = s.chartLabel;
    chart.innerHTML = vals.map((v, i) => {
      const pct = (v / maxVal * 86);
      return `<div class="ew-bar-wrap">
        <div class="ew-bar" style="height:${pct}px;background:${colors[i] || '#6366f1'}" title="${labels[i]}: ${formatNum(v)}"></div>
        <div class="ew-bar-lbl">${labels[i]}</div>
      </div>`;
    }).join('');

    legend.innerHTML = s.legend.map(l =>
      `<div class="ew-legend-item"><div class="ew-legend-dot" style="background:${l.color}"></div>${l.label}</div>`
    ).join('');

    // Animate bars in
    setTimeout(() => {
      chart.querySelectorAll('.ew-bar').forEach((bar, i) => {
        bar.style.transition = `height 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i*0.04}s, background 0.3s`;
      });
    }, 50);
  }

  function loadSheet(key) {
    currentSheet = key;
    sortAsc = true;
    renderGrid(key);
    renderChart(key);
    // Reset stats
    sumEl.textContent = '—'; avgEl.textContent = '—'; countEl.textContent = '—';
    cellRef.textContent = 'A1';
    formulaEl.textContent = '=SUM(B2:B' + (SHEETS[key].rows.length) + ')';
  }

  // Tab switching
  document.getElementById('ewTabs').addEventListener('click', e => {
    const btn = e.target.closest('.ew-tab');
    if (!btn) return;
    document.querySelectorAll('.ew-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    loadSheet(btn.dataset.sheet);
  });

  // Sort button
  document.getElementById('ewSortBtn').addEventListener('click', () => {
    const s = SHEETS[currentSheet];
    const dataRows = s.rows.slice(0, -1);
    const totalRow = s.rows[s.rows.length - 1];
    const key = s.chartKey;
    dataRows.sort((a, b) => sortAsc
      ? (b[key] || 0) - (a[key] || 0)
      : (a[key] || 0) - (b[key] || 0)
    );
    sortAsc = !sortAsc;
    SHEETS[currentSheet].rows = [...dataRows, totalRow];
    loadSheet(currentSheet);
    document.getElementById('ewSortBtn').textContent = sortAsc ? '⇅ Sort' : '⇅ Sorted';
  });

  // Initial load
  loadSheet('sales');

})();



/* ══ SCROLL READING PROGRESS BAR — UPGRADED ══ */
(function(){

  /* ── Top bar ── */
  const topBar = document.createElement('div');
  topBar.id = 'readProgress';
  document.body.prepend(topBar);

  /* ── SVG gradient def ── */
  const svgDefs = `<svg width="0" height="0" style="position:absolute">
    <defs>
      <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stop-color="#10b981"/>
        <stop offset="50%"  stop-color="#6366f1"/>
        <stop offset="100%" stop-color="#ec4899"/>
      </linearGradient>
    </defs>
  </svg>`;
  document.body.insertAdjacentHTML('afterbegin', svgDefs);

  /* ── Floating pill ── */
  const pill = document.createElement('div');
  pill.id = 'progressPill';
  pill.innerHTML = `
    <div class="pp-ring-wrap">
      <svg class="pp-svg" viewBox="0 0 54 54">
        <circle class="pp-track" cx="27" cy="27" r="22"/>
        <circle class="pp-fill" id="ppFill" cx="27" cy="27" r="22"/>
      </svg>
      <div class="pp-pct" id="ppPct">0%</div>
    </div>
    <div class="pp-section" id="ppSection">Home</div>
    <div class="pp-time"   id="ppTime">~5 min</div>
  `;
  document.body.appendChild(pill);

  /* ── Section dots ── */
  const sections = [
    { id:'home',      label:'Home'     },
    { id:'about',     label:'About'    },
    { id:'skills',    label:'Skills'   },
    { id:'projects',  label:'Projects' },
    { id:'contact',   label:'Contact'  },
  ];

  const dotsWrap = document.createElement('div');
  dotsWrap.id = 'sectionDots';
  sections.forEach(s => {
    const wrap = document.createElement('div');
    wrap.className = 'sd-dot-wrap';
    wrap.dataset.id = s.id;
    wrap.innerHTML = `<div class="sd-label">${s.label}</div><div class="sd-dot"></div>`;
    wrap.addEventListener('click', () => {
      const target = document.getElementById(s.id);
      if (target) target.scrollIntoView({behavior:'smooth'});
    });
    dotsWrap.appendChild(wrap);
  });
  document.body.appendChild(dotsWrap);

  /* ── Reading time ── */
  const words = document.body.innerText.split(/\s+/).length;
  const totalMins = Math.ceil(words / 200);

  const ppFill    = document.getElementById('ppFill');
  const ppPct     = document.getElementById('ppPct');
  const ppSection = document.getElementById('ppSection');
  const ppTime    = document.getElementById('ppTime');
  const CIRCUM    = 138.2;

  let ticking = false;

  function getCurrentSection() {
    let current = sections[0];
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el && window.scrollY >= el.offsetTop - 200) current = s;
    });
    return current;
  }

  function updateDots(activeId) {
    let passed = true;
    dotsWrap.querySelectorAll('.sd-dot-wrap').forEach(wrap => {
      const id = wrap.dataset.id;
      wrap.classList.remove('active','passed');
      if (id === activeId) { wrap.classList.add('active'); passed = false; }
      else if (passed)      { wrap.classList.add('passed'); }
    });
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrolled = window.scrollY;
      const total    = document.body.scrollHeight - window.innerHeight;
      const pct      = total > 0 ? Math.min(scrolled / total * 100, 100) : 0;

      /* top bar */
      topBar.style.width = pct + '%';

      /* circle */
      const offset = CIRCUM - (pct / 100 * CIRCUM);
      if (ppFill) ppFill.style.strokeDashoffset = offset;
      if (ppPct)  ppPct.textContent = Math.round(pct) + '%';

      /* reading time remaining */
      const remaining = Math.max(1, Math.ceil(totalMins * (1 - pct/100)));
      if (ppTime) ppTime.textContent = pct > 95 ? '✅ Done!' : `~${remaining} min left`;

      /* current section */
      const cur = getCurrentSection();
      if (ppSection) ppSection.textContent = cur.label;
      updateDots(cur.id);

      /* show/hide pill & dots */
      const show = scrolled > 150;
      pill.classList.toggle('visible', show);
      dotsWrap.classList.toggle('visible', show);

      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

})();