// AMI-Teach — Scroll animations: reveal, count-up, parallax, dashboard bars
// Vanilla JS / IntersectionObserver — no GSAP dependency

(function initReveal() {
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        ro.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
})();

(function initCountUp() {
  function countUp(el) {
    const target = +el.dataset.target;
    const dur    = 1400;
    const start  = performance.now();

    (function tick(now) {
      const p    = Math.min((now - start) / dur, 1);
      const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      el.textContent = Math.round(ease * target);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    })(performance.now());
  }

  const co = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { countUp(e.target); co.unobserve(e.target); }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.count-up').forEach(el => co.observe(el));
})();

(function initParallax() {
  const heroLeft = document.querySelector('.hero-left');
  if (!heroLeft) return;

  window.addEventListener('scroll', () => {
    if (scrollY < innerHeight) {
      heroLeft.style.transform = `translateY(${scrollY * 0.12}px)`;
    }
  }, { passive: true });
})();

(function initDashboardBars() {
  document.querySelectorAll('.dp-b').forEach((b, i) => {
    b.style.opacity = '0';
    setTimeout(() => {
      b.style.transition = `opacity 0.4s ${0.8 + i * 0.055}s ease`;
      b.style.opacity = '1';
    }, 100);
  });

  document.querySelectorAll('.dp-sf').forEach((f, i) => {
    const w = f.style.width;
    f.style.width = '0';
    setTimeout(() => {
      f.style.transition = `width 0.9s ease ${1.2 + i * 0.11}s`;
      f.style.width = w;
    }, 100);
  });
})();
