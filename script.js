const header    = document.getElementById('site-header');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

// Nav background on scroll
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// Mobile menu toggle
hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
  navLinks.classList.toggle('open', open);
});

// Close mobile menu on nav link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
  });
});

// Contact form — show success message without full page reload
const ctaForm = document.getElementById('cta-form');
const formSent = document.getElementById('form-sent');
if (ctaForm) {
  ctaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(ctaForm);
    try {
      await fetch('/', { method: 'POST', body: data });
    } catch (_) {
      // Cloudflare Pages may return a redirect — fetch throws on opaque redirect, which is fine
    }
    ctaForm.hidden = true;
    formSent.hidden = false;
  });
}
