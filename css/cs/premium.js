// ===== Version premium (Awa) =====
(function () {
  const $ = s => document.querySelector(s), $$ = s => document.querySelectorAll(s);

  // 1. Rideau d'intro avec monogramme
  const intro = document.createElement('div');
  intro.className = 'intro';
  intro.innerHTML = '<span>A</span><span>B</span>';
  document.body.appendChild(intro);
  setTimeout(() => intro.remove(), 2300);

  // 2. Nom découpé en lettres animées
  const nom = $('.hero h1 span');
  nom.classList.add('nom');
  const texte = nom.textContent;
  nom.setAttribute('aria-label', texte);
  nom.innerHTML = [...texte].map((c, k) =>
    `<span class="lettre" aria-hidden="true" style="animation-delay:${1.6 + k * .05}s">${c === ' ' ? '&nbsp;' : c}</span>`).join('');

  // 3. Photo dans un cadre tournant + pastille « disponible »
  const photo = $('.photo');
  if (photo) {
    const cadre = document.createElement('div');
    cadre.className = 'cadre-photo';
    photo.replaceWith(cadre); cadre.appendChild(photo);
    cadre.insertAdjacentHTML('beforeend', '<span class="statut" title="Disponible pour un stage"></span>');
  }
  const actions = document.createElement('div'); actions.className = 'actions';
  const boutons = $$('#accueil .bouton'); boutons[0].before(actions); boutons.forEach(b => actions.appendChild(b));
  $('#accueil').insertAdjacentHTML('beforeend', '<a class="defiler" href="#apropos" aria-label="Défiler"></a>');

  // 4. Pastille qui glisse sous le lien actif du menu
  const ul = $('.menu ul');
  const pastille = document.createElement('span');
  pastille.className = 'pastille';
  ul.prepend(pastille);
  function placer(a) {
    if (!a) { pastille.style.width = 0; return; }
    pastille.style.left = a.offsetLeft + 'px'; pastille.style.width = a.offsetWidth + 'px';
  }
  new MutationObserver(() => placer($('.menu ul a.actif'))).observe(ul, { subtree: true, attributes: true, attributeFilter: ['class'] });
  $$('.menu ul a').forEach(a => {
    a.addEventListener('mouseenter', () => placer(a));
    a.addEventListener('mouseleave', () => placer($('.menu ul a.actif')));
  });

  // 5. Compétences en deux bandeaux défilants
  const cartes = $('.cartes');
  const items = [...cartes.children].map(li => li.textContent);
  const moitie = Math.ceil(items.length / 2);
  [items.slice(0, moitie), items.slice(moitie)].forEach((liste, k) => {
    const b = document.createElement('div');
    b.className = 'bandeau' + (k ? ' inverse' : '');
    const spans = liste.map(t => `<span>${t}</span>`).join('');
    b.innerHTML = `<div class="piste">${spans}${spans}</div>`;
    cartes.before(b);
  });
  cartes.classList.add('masque');

  // 6. Titres qui se « décodent » (clin d'œil cybersécurité)
  const signes = '01<>/{}#$%&*ABCDEF';
  const obsTitre = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    obsTitre.unobserve(e.target);
    const final = e.target.textContent; let tour = 0;
    const t = setInterval(() => {
      e.target.textContent = [...final].map((c, k) => k < tour || c === ' ' ? c : signes[Math.random() * signes.length | 0]).join('');
      tour += 1 / 2;
      if (tour > final.length) { clearInterval(t); e.target.textContent = final; }
    }, 30);
  }), { threshold: .6 });
  $$('.bloc > h2:first-child').forEach(h => obsTitre.observe(h));

  // 7. Frise qui se remplit au défilement
  window.addEventListener('scroll', () => {
    $$('.timeline').forEach(t => {
      const r = t.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * .7 - r.top) / r.height));
      t.style.setProperty('--rempli', p * 100 + '%');
    });
  });

  // 8. Boutons magnétiques
  $$('.bouton, .copier').forEach(b => {
    b.addEventListener('mousemove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
    });
    b.addEventListener('mouseleave', () => { b.style.transform = ''; });
  });

  // 9. Contact : grande accroche + copie de l'e-mail
  const contact = $('#contact');
  const mail = contact.querySelector('a[href^="mailto"]');
  if (mail) {
    const adresse = mail.textContent;
    contact.querySelector('h2').insertAdjacentHTML('afterend',
      `<p class="cta">Un stage, un projet data,<br>une idée ? <em>Parlons-en.</em></p>
       <button class="copier" type="button">📋 Copier ${adresse}</button><br><br>`);
    const toast = document.createElement('div'); toast.className = 'toast'; toast.textContent = '✓ Adresse copiée !';
    document.body.appendChild(toast);
    $('.copier').addEventListener('click', () => {
      navigator.clipboard && navigator.clipboard.writeText(adresse);
      toast.classList.add('montre'); setTimeout(() => toast.classList.remove('montre'), 1800);
    });
  }

  // 10. Curseur personnalisé + lueur qui suit la souris
  const lueur = document.createElement('div'); lueur.className = 'lueur'; document.body.prepend(lueur);
  if (matchMedia('(pointer: fine)').matches) {
    const point = document.createElement('div'), anneau = document.createElement('div');
    point.className = 'curseur'; anneau.className = 'curseur-anneau';
    document.body.append(point, anneau);
    let mx = 0, my = 0, ax = 0, ay = 0;
    addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      point.style.transform = `translate(${mx}px, ${my}px)`;
      lueur.style.setProperty('--x', mx + 'px'); lueur.style.setProperty('--y', my + 'px');
    });
    (function suivre() {
      ax += (mx - ax) * .15; ay += (my - ay) * .15;
      anneau.style.transform = `translate(${ax}px, ${ay}px)`;
      requestAnimationFrame(suivre);
    })();
    document.addEventListener('mouseover', e => anneau.classList.toggle('survol', !!e.target.closest('a, button, .projet, .piste span')));
  }
})();