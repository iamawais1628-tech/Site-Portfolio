/* ══════════════════════════════════════════════
   AWAIS TAHIR PORTFOLIO — UNIFIED SCRIPT
   Works across: index.html, about.html,
                 services.html, portfolio.html
   ══════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────
   1. NAVBAR — scroll shadow + active highlight
   ───────────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const scrollTop = document.getElementById('scrollTop');
  if (!navbar) return;

  function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 40);
    if (scrollTop) scrollTop.classList.toggle('visible', y > 400);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ─────────────────────────────────────────────
   2. MOBILE MENU — hamburger toggle
   ───────────────────────────────────────────── */
(function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.add('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '';
    });
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', closeMenu)
  );

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  // Expose globally (used by onclick="closeMobile()" in HTML)
  window.closeMobile = closeMenu;
})();


/* ─────────────────────────────────────────────
   3. SCROLL REVEAL — fade-up on scroll
   ───────────────────────────────────────────── */
(function initScrollReveal() {
  const els = document.querySelectorAll('.scroll-reveal');
  if (!els.length) return;

  const obs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target); // only animate once
      }
    }),
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(el => obs.observe(el));
})();


/* ─────────────────────────────────────────────
   4. REVEAL-UP ANIMATIONS — stagger delays
   ───────────────────────────────────────────── */
(function initRevealUp() {
  document.querySelectorAll('.reveal-up').forEach((el, i) => {
    if (!el.style.animationDelay) {
      el.style.animationDelay = (i * 0.12) + 's';
    }
  });
})();


/* ─────────────────────────────────────────────
   5. STATS COUNTER — animated number count-up
   ───────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  function countUp(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step     = 16;
    const steps    = duration / step;
    let   current  = 0;

    const timer = setInterval(() => {
      current += target / steps;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, step);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        countUp(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => obs.observe(el));
})();


/* ─────────────────────────────────────────────
   6. SKILL BARS — animated width fill
   ───────────────────────────────────────────── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.sb-fill[data-w]');
  if (!fills.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.w + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(el => obs.observe(el));
})();


/* ─────────────────────────────────────────────
   7. SKILL CIRCLES — SVG stroke-dashoffset
   ───────────────────────────────────────────── */
(function initSkillCircles() {
  const circles = document.querySelectorAll('.skill-circle[data-pct]');
  if (!circles.length) return;

  const circumference = 314; // 2 * π * 50

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const pct = parseInt(e.target.dataset.pct, 10);
        const arc = e.target.querySelector('.skill-arc');
        if (arc) {
          const offset = circumference - (circumference * pct / 100);
          arc.style.strokeDashoffset = offset;
        }
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  circles.forEach(el => obs.observe(el));
})();


/* ─────────────────────────────────────────────
   8. TESTIMONIAL SLIDER — auto + dot nav
   ───────────────────────────────────────────── */
(function initTestimonials() {
  const cards = document.querySelectorAll('.testi-card');
  const dots  = document.querySelectorAll('.testi-dot');
  if (!cards.length) return;

  let current  = 0;
  let autoTimer = null;

  function goTo(index) {
    cards[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');
    current = (index + cards.length) % cards.length;
    cards[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  // Dot click handlers
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopAuto();
      goTo(i);
      startAuto();
    });
  });

  // Expose globally (used by onclick="goTesti(n)" in HTML)
  window.goTesti = function(n) {
    stopAuto();
    goTo(n);
    startAuto();
  };

  // Pause on hover
  const wrap = document.querySelector('.testimonials-wrap');
  if (wrap) {
    wrap.addEventListener('mouseenter', stopAuto);
    wrap.addEventListener('mouseleave', startAuto);
  }

  startAuto();
})();


/* ─────────────────────────────────────────────
   9. CONTACT FORM — submit handler
   ───────────────────────────────────────────── */
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  window.handleSubmit = function(e) {
    e.preventDefault();

    const btn  = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;

    btn.innerHTML = '<span>Sending…</span>';
    btn.disabled  = true;

    // Simulate network request (replace with real fetch/formspree/emailjs call)
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.disabled  = false;
      form.reset();
      if (success) {
        success.classList.add('show');
        setTimeout(() => success.classList.remove('show'), 5000);
      }
    }, 1200);
  };

  form.addEventListener('submit', window.handleSubmit);
})();


/* ─────────────────────────────────────────────
   10. PORTFOLIO FILTER — show/hide case studies
   ───────────────────────────────────────────── */
(function initPortfolioFilter() {
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const caseStudies = document.querySelectorAll('.case-study');
  if (!filterBtns.length || !caseStudies.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      caseStudies.forEach(cs => {
        const match = filter === 'all' || cs.dataset.category === filter;
        if (match) {
          cs.style.opacity = '0';
          cs.style.display = '';
          requestAnimationFrame(() => {
            cs.style.transition = 'opacity .35s ease';
            cs.style.opacity    = '1';
          });
        } else {
          cs.style.transition = 'opacity .3s ease';
          cs.style.opacity    = '0';
          setTimeout(() => { cs.style.display = 'none'; }, 320);
        }
      });
    });
  });
})();


/* ─────────────────────────────────────────────
   11. HERO CANVAS — light particle network
   ───────────────────────────────────────────── */
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles, animId;

  const PARTICLE_COUNT = 55;
  const MAX_DIST       = 130;
  const PARTICLE_COLOR = '26,86,219';   // blue, light-theme friendly
  const LINE_COLOR     = '26,86,219';

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function randBetween(a, b) { return a + Math.random() * (b - a); }

  function createParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: randBetween(-0.4, 0.4),
      vy: randBetween(-0.4, 0.4),
      r:  randBetween(1.5, 3),
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Move particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.25;
          ctx.strokeStyle = `rgba(${LINE_COLOR},${alpha})`;
          ctx.lineWidth   = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw dots
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${PARTICLE_COLOR},0.35)`;
      ctx.fill();
    });

    animId = requestAnimationFrame(draw);
  }

  // Handle resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      createParticles();
    }, 200);
  });

  // Pause when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      draw();
    }
  });

  resize();
  createParticles();
  draw();
})();


/* ─────────────────────────────────────────────
   12. ACTIVE NAV LINK — highlight current page
   ───────────────────────────────────────────── */
(function highlightActiveNav() {
  const page  = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === page || href.startsWith(page.replace('.html', ''))) {
      link.classList.add('active-page');
    }
  });
})();


/* ─────────────────────────────────────────────
   13. SMOOTH SCROLL — anchor links
   ───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ─────────────────────────────────────────────
   14. SCROLL-TO-TOP BUTTON — click handler
   ───────────────────────────────────────────── */
(function initScrollTopBtn() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  btn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );
})();
