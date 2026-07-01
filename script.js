// ----- script.js -----
console.log('🔥 Sushma Lama · Offensive Security Portfolio');

document.addEventListener('DOMContentLoaded', function() {
  // Smooth scroll for anchor links (if added)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Dynamic year update
  const yearSpan = document.querySelector('.cname-footer span:last-child');
  if (yearSpan) {
    const year = new Date().getFullYear();
    yearSpan.innerHTML = `<i class="fas fa-code"></i> #HackThePlanet · ${year}`;
  }

  // Add typing effect to summary (optional)
  const summaryText = document.querySelector('.summary-text');
  if (summaryText) {
    // Could add a typing effect here if desired
  }

  // Console greeting
  console.log('👋 Hi! I\'m Sushma - Offensive Security Specialist');
  console.log('🔐 Breaking systems to build stronger defenses');
});