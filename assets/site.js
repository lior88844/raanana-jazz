// =====================================================================
//  Shared chrome (top bar, logo, drawer menu, footer) + render helpers.
//  Every page loads data.js then this file.
// =====================================================================

const T = slug => SITE.tickets + slug;
const ext = 'target="_blank" rel="noopener"';
const dayOf = id => DAYS.find(d => d.id === id);
const img = f => 'images/' + f;

const NAV_MAIN = [
  ['lineup.html', 'לוח הופעות'],
  ['festival-2025.html', 'מהדורות קודמות'],
  ['venue.html', 'המתחם'],
  ['index.html#partners', 'שותפים'],
];
const NAV_SUB = [
  ['about.html', 'אודות'],
  ['workshops.html', 'סדנאות'],
  ['media.html', 'מדיה ועיתונות'],
  ['tickets.html', 'כרטיסים ופסים'],
  ['contact.html', 'צור קשר'],
];

const ICONS = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-ig" viewBox="0 0 24 24"><path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM12 2c-2.7 0-3 0-4.1.1C4.3 2.3 2.3 4.3 2.1 7.9 2 9 2 9.3 2 12s0 3 .1 4.1c.2 3.6 2.2 5.6 5.8 5.8 1.1.1 1.4.1 4.1.1s3 0 4.1-.1c3.6-.2 5.6-2.2 5.8-5.8.1-1.1.1-1.4.1-4.1s0-3-.1-4.1c-.2-3.6-2.2-5.6-5.8-5.8C15 2 14.7 2 12 2zm0 1.8c2.7 0 3 0 4 .1 2.7.1 4 1.4 4.1 4.1.1 1 .1 1.3.1 4s0 3-.1 4c-.1 2.7-1.4 4-4.1 4.1-1 .1-1.3.1-4 .1s-3 0-4-.1c-2.7-.1-4-1.4-4.1-4.1-.1-1-.1-1.3-.1-4s0-3 .1-4C4 5.3 5.3 4 8 3.9c1-.1 1.3-.1 4-.1z"/></symbol>
  <symbol id="i-fb" viewBox="0 0 24 24"><path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.2h2.8V22h3.4z"/></symbol>
</svg>`;

const socials = () => `
  <a href="${SITE.instagram}" ${ext} aria-label="Instagram"><svg class="ic"><use href="#i-ig"/></svg></a>
  <a href="${SITE.facebook}" ${ext} aria-label="Facebook"><svg class="ic"><use href="#i-fb"/></svg></a>`;

function buildChrome() {
  const here = location.pathname.split('/').pop() || 'index.html';
  const link = ([href, label]) => `<a href="${href}"${href === here ? ' class="active" aria-current="page"' : ''}>${label}</a>`;

  document.body.insertAdjacentHTML('afterbegin', `
${ICONS}
<header class="topbar">
  <div class="tag">World <em>Jazz</em> Music · <i>רעננה</i> · ${SITE.dates}</div>
  <nav>
    <a href="lineup.html">לוח <span>הופעות</span></a>
    <a href="workshops.html">סדנאות</a>
    <a href="tickets.html">רכישת <span>כרטיסים</span></a>
  </nav>
</header>
<div class="brand">
  <a href="index.html"><img src="${SITE.logo}" alt="World Jazz Music – פסטיבל הג׳אז רעננה"></a>
  <button class="burger" aria-label="פתיחת תפריט" aria-expanded="false" aria-controls="drawer"><span></span><span></span><span></span></button>
</div>
<div class="socials-fixed">${socials()}</div>
<div class="drawer-scrim" data-close></div>
<nav class="drawer" id="drawer" aria-label="תפריט ראשי">
  <button class="close" data-close aria-label="סגירת תפריט"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M5 5l14 14M19 5L5 19"/></svg></button>
  <a href="index.html"><img class="dlogo" src="${SITE.logo}" alt="דף הבית"></a>
  <div class="main">${NAV_MAIN.map(link).join('')}</div>
  <div class="sub">${NAV_SUB.map(link).join('')}</div>
  <div class="follow">
    <b>עקבו אחרינו</b>
    <div>${socials()}</div>
    <small>עדכונים על הפסטיבל הבא באינסטגרם ובפייסבוק</small>
    <a href="tickets.html" class="btn primary dbtn">לרכישת כרטיסים</a>
  </div>
</nav>`);

  document.body.insertAdjacentHTML('beforeend', `
<footer class="footer grain">
  <a href="index.html"><img class="flogo" src="${SITE.logo}" alt="World Jazz Music"></a>
  <div class="socials">${socials()}</div>
  <div class="ctas"><a href="tickets.html" class="btn primary">לרכישת כרטיסים</a></div>
  <div class="fcols">
    <div><h6>הפסטיבל</h6><a href="lineup.html">לוח הופעות</a><a href="festival-2025.html">מהדורות קודמות</a><a href="venue.html">המתחם</a><a href="${SITE.program}" ${ext}>תוכנייה</a></div>
    <div><h6>השתתפות</h6><a href="workshops.html">סדנאות</a><a href="tickets.html">כרטיסים ופסים</a><a href="media.html">מדיה ועיתונות</a></div>
    <div><h6>עלינו</h6><a href="about.html">אודות</a><a href="contact.html">צור קשר</a><p>${SITE.venueName}</p></div>
  </div>
  <div class="copy">© ${SITE.year} website by Lior Doron · graphic design by Dekel Hevroni</div>
</footer>
<a href="#" class="totop" aria-label="חזרה למעלה"><svg viewBox="0 0 24 24" stroke-width="2.5"><path d="M6 15l6-6 6 6"/></svg></a>`);

  // drawer behaviour
  const burger = document.querySelector('.burger');
  const setOpen = open => {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    if (open) document.querySelector('.drawer .main a').focus();
  };
  burger.addEventListener('click', () => setOpen(true));
  document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', () => setOpen(false)));
  document.querySelectorAll('.drawer a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
}

// ---------- render helpers ----------
const freeTag = '<span class="free">כניסה חופשית</span>';

function renderSchedule(el) {
  el.innerHTML = DAYS.map(d => `
    <div class="daycol">
      <header><h5>יום ${d.name}</h5><span>${d.date}</span></header>
      ${SHOWS.filter(s => s.day === d.id).map(s => `
        <div class="slot"><time>${s.time}</time><div>
          <div class="t">${s.title}</div>
          <div class="v">${s.venue}${s.free ? freeTag : ''}</div>
          ${s.slug ? `<a class="tix" href="${T(s.slug)}" ${ext}>לכרטיסים ←</a>` : ''}
        </div></div>`).join('')}
      <a class="pass" href="${T(d.pass)}" ${ext}>לרכישת פס יומי ←</a>
    </div>`).join('');
}

function renderCards(el, list = SHOWS.filter(s => s.featured)) {
  el.innerHTML = list.map(s => `
    <article class="card">
      <div class="ph" data-bg="${img(s.img)}"></div>
      <div class="day">${dayOf(s.day).name} ${dayOf(s.day).date} <b>· ${s.time}</b></div>
      <h4>${s.title}</h4>
      <div class="desc">${s.desc}</div>
      <div class="venue">${s.venue}</div>
      ${s.slug ? `<a href="${T(s.slug)}" class="buy" ${ext}>לרכישת כרטיסים</a>` : ''}
    </article>`).join('');
}

function renderShowList(el, dayId) {
  el.innerHTML = SHOWS.filter(s => !dayId || s.day === dayId).map(s => `
    <article class="showrow">
      <div class="ph${s.img ? '' : ' noimg'}" ${s.img ? `data-bg="${img(s.img)}"` : ''}></div>
      <div>
        <div class="when">יום ${dayOf(s.day).name} ${dayOf(s.day).date} <time>${s.time}</time></div>
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
        <div class="venue">${s.venue}</div>
      </div>
      <div class="act">
        ${s.free ? '<div class="free">כניסה חופשית</div><br>' : ''}
        ${s.slug ? `<a class="btn primary" href="${T(s.slug)}" ${ext}>לכרטיסים</a>` : ''}
      </div>
    </article>`).join('');
}

function renderTeachers(el, asList = true) {
  el.innerHTML = asList
    ? TEACHERS.map(([f, n, r]) => `<li><i data-bg="${img(f)}"></i><div><b>${n}</b><small>${r}</small></div></li>`).join('')
    : TEACHERS.map(([f, n, r]) => `<div class="person"><div class="ph" data-bg="${img(f)}"></div><b>${n}</b><span>${r}</span></div>`).join('');
}

function renderMoments(el) {
  el.innerHTML = MOMENTS.map(([f, cap]) => `<div data-bg="${img(f)}"><span>${cap}</span></div>`).join('');
}

function renderPartners(el) {
  el.innerHTML = PARTNERS.map(([f, alt]) => `<img class="tall" src="${img(f)}" alt="${alt}">`).join('');
}

function renderThemePasses(el) {
  el.innerHTML = '<span>פסים לפי נושאים:</span>' + THEME_PASSES.map(([n, slug]) => `<a href="${T(slug)}" ${ext}>${n}</a>`).join('');
}

buildChrome();
document.querySelectorAll('[data-render]').forEach(el => {
  const fn = { schedule: renderSchedule, cards: renderCards, showlist: renderShowList, teachers: renderTeachers,
    people: el => renderTeachers(el, false), moments: renderMoments, partners: renderPartners, themes: renderThemePasses }[el.dataset.render];
  fn && fn(el);
});
document.querySelectorAll('[data-href]').forEach(a => {
  const v = a.dataset.href;
  a.href = v === 'fullpass' ? T(SITE.fullPass) : v === 'form' ? SITE.workshopForm : v === 'program' ? SITE.program : '#';
});

// =====================================================================
//  Enhancements: lazy images, scroll reveal, countdown, sticky CTA.
//  Runs after every page script has rendered its content.
// =====================================================================
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function lazyBackgrounds() {
  const els = document.querySelectorAll('[data-bg]');
  const load = el => { el.style.backgroundImage = `url(${el.dataset.bg})`; el.classList.add('bg-in'); el.removeAttribute('data-bg'); };
  if (!('IntersectionObserver' in window)) return els.forEach(load);
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { load(e.target); io.unobserve(e.target); }
  }), { rootMargin: '400px 0px' });
  els.forEach(el => io.observe(el));
}

const REVEAL = [
  '.stitle', '.intro h2', '.intro p', '.card', '.daycol', '.passes', '.duo .col', '.moments-h', '.grid > div',
  '.partners h2', '.partners .logos img', '.showrow', '.artist', '.venue-card', '.tcard', '.cbtn', '.dl',
  '.person', '.stat', '.stats-h', '.prose > *', '.sec-h', '.sec-h + p', '.year-bar', '.daytabs', '.cta-band > *', '.map',
].join(',');

function scrollReveal() {
  const els = [...document.querySelectorAll(REVEAL)];
  if (reduceMotion || !('IntersectionObserver' in window)) return;
  // stagger siblings in the same container (max 6 steps, 60ms apart)
  els.forEach(el => {
    const sibs = [...el.parentElement.children].filter(c => els.includes(c));
    const i = sibs.indexOf(el);
    el.style.setProperty('--d', `${Math.min(i % 6, 5) * 60}ms`);
    el.classList.add('rv');
  });
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach(el => io.observe(el));
}

// Festival opens 9 Dec 2026, 00:00 Israel time (UTC+2 in December)
const FESTIVAL_START = new Date('2026-12-09T00:00:00+02:00');

function countdown() {
  const box = document.getElementById('countdown');
  if (!box) return;
  const out = Object.fromEntries([...box.querySelectorAll('[data-k]')].map(b => [b.dataset.k, b]));
  let timer;
  const tick = () => {
    const ms = FESTIVAL_START - Date.now();
    if (ms <= 0) {
      box.hidden = true;
      document.getElementById('cdLabel').textContent = 'הפסטיבל כבר כאן!';
      return clearInterval(timer);
    }
    const s = Math.floor(ms / 1000);
    out.d.textContent = Math.floor(s / 86400);
    out.h.textContent = Math.floor(s / 3600) % 24;
    out.m.textContent = Math.floor(s / 60) % 60;
    out.s.textContent = s % 60;
    box.hidden = false;
  };
  const start = () => { clearInterval(timer); tick(); timer = setInterval(tick, reduceMotion ? 60000 : 1000); };
  // pause while the tab is hidden
  document.addEventListener('visibilitychange', () => document.hidden ? clearInterval(timer) : start());
  start();
}

function stickyCta() {
  if (/tickets\.html$/.test(location.pathname)) return;
  const btn = document.createElement('a');
  btn.href = 'tickets.html';
  btn.className = 'btn primary sticky-cta';
  btn.textContent = 'לרכישת כרטיסים';
  document.body.appendChild(btn);
  const hero = document.querySelector('.hero, .page-hero');
  const limit = () => (hero ? hero.offsetTop + hero.offsetHeight : 400);
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const nearFooter = innerHeight + scrollY > document.body.scrollHeight - 500;
      btn.classList.toggle('show', scrollY > limit() && !nearFooter);
      ticking = false;
    });
  }, { passive: true });
}

addEventListener('DOMContentLoaded', () => {
  lazyBackgrounds();
  scrollReveal();
  countdown();
  stickyCta();
});
