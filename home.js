document.addEventListener('DOMContentLoaded', () => {

  // ---- Footer year ----
  document.querySelectorAll('#year').forEach(el => { el.textContent = new Date().getFullYear(); });

  // ---- Mobile nav toggle ----
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close the menu when a link is chosen
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Skill bars (about page) ----
  const skillCards = document.querySelectorAll('#skillsGrid .card[data-level]');
  if (skillCards.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target.querySelector('.skill-bar-fill');
          if (fill) fill.style.width = Number(entry.target.dataset.level) + '%';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    skillCards.forEach(card => observer.observe(card));
  }

});
