document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (menuBtn && navLinks) menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));

  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);
  const back = document.createElement('button');
  back.className = 'back-top';
  back.setAttribute('aria-label', 'Volver arriba');
  back.textContent = '↑';
  document.body.appendChild(back);
  back.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = pct + '%';
    back.classList.toggle('show', window.scrollY > 600);
  };
  updateScroll();
  window.addEventListener('scroll', updateScroll, { passive:true });

  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('show'); });
  }, {threshold:.12});
  reveals.forEach(el => observer.observe(el));

  document.querySelectorAll('.count-num').forEach(el => {
    const target = parseInt(el.dataset.target || '0', 10);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 42));
    const tick = () => {
      current += step;
      if (current >= target) el.textContent = target;
      else { el.textContent = current; requestAnimationFrame(tick); }
    };
    tick();
  });

  document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.carousel-dots button');
    const prev = carousel.querySelector('[data-prev]');
    const next = carousel.querySelector('[data-next]');
    if (!track || !slides.length) return;
    let index = 0;
    const goTo = i => {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, idx) => dot.classList.toggle('active', idx === index));
    };
    if (prev) prev.addEventListener('click', () => goTo(index - 1));
    if (next) next.addEventListener('click', () => goTo(index + 1));
    dots.forEach((dot, idx) => dot.addEventListener('click', () => goTo(idx)));
    let timer = setInterval(() => goTo(index + 1), 4800);
    carousel.addEventListener('mouseenter', () => clearInterval(timer));
    carousel.addEventListener('mouseleave', () => { timer = setInterval(() => goTo(index + 1), 4800); });
    goTo(0);
  });
});
