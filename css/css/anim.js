// ===== Animations du portfolio (Awa) =====
(function () {
  const hero = document.getElementById('accueil');

  // 1. Réseau de particules (thème data / IA)
  const cv = document.createElement('canvas');
  cv.className = 'reseau';
  hero.prepend(cv);
  const ctx = cv.getContext('2d');
  let pts = [];
  const souris = { x: -999, y: -999 };
  function taille() {
    cv.width = hero.offsetWidth; cv.height = hero.offsetHeight;
    const n = Math.min(70, Math.floor(cv.width / 18));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * cv.width, y: Math.random() * cv.height,
      vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5
    }));
  }
  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect(); souris.x = e.clientX - r.left; souris.y = e.clientY - r.top;
  });
  hero.addEventListener('mouseleave', () => { souris.x = souris.y = -999; });
  function dessiner() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > cv.width) p.vx *= -1;
      if (p.y < 0 || p.y > cv.height) p.vy *= -1;
      ctx.fillStyle = 'rgba(194,24,91,.55)';
      ctx.beginPath(); ctx.arc(p.x, p.y, 2.2, 0, 7); ctx.fill();
    }
    const tous = pts.concat([souris]);
    for (let a = 0; a < tous.length; a++) for (let b = a + 1; b < tous.length; b++) {
      const d = Math.hypot(tous[a].x - tous[b].x, tous[a].y - tous[b].y);
      if (d < 120) {
        ctx.strokeStyle = `rgba(194,24,91,${.25 * (1 - d / 120)})`;
        ctx.beginPath(); ctx.moveTo(tous[a].x, tous[a].y); ctx.lineTo(tous[b].x, tous[b].y); ctx.stroke();
      }
    }
    requestAnimationFrame(dessiner);
  }
  window.addEventListener('resize', taille);
  taille(); dessiner();

  // 2. Barre de progression de lecture
  const barre = document.createElement('div');
  barre.className = 'progression';
  document.body.appendChild(barre);
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    barre.style.width = (scrollY / h * 100) + '%';
  });

  // 3. Lien du menu actif selon la section visible
  const liens = document.querySelectorAll('.menu ul a');
  const obsMenu = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) liens.forEach(l => l.classList.toggle('actif', l.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section').forEach(s => obsMenu.observe(s));

  // 4. Apparition en cascade
  const elems = document.querySelectorAll('.cartes li, .projet, .timeline li, .chiffres div, .certifs li');
  elems.forEach(el => el.classList.add('cascade'));
  const obsCascade = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const freres = [...e.target.parentElement.children];
    e.target.style.transitionDelay = (freres.indexOf(e.target) % 9) * 70 + 'ms';
    e.target.classList.add('vu');
    obsCascade.unobserve(e.target);
  }), { threshold: .1 });
  elems.forEach(el => obsCascade.observe(el));

  // 5. Effet 3D sur les cartes projets
  document.querySelectorAll('.projet').forEach(c => {
    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
      c.style.setProperty('--mx', (x + .5) * 100 + '%'); c.style.setProperty('--my', (y + .5) * 100 + '%');
    });
    c.addEventListener('mouseleave', () => { c.style.transform = ''; });
  });
})();