// =====================================================================
//  Shared chrome (top bar, logo, drawer menu, footer) + render helpers.
//  Every page loads data.js then this file.
//  Language comes from <html lang>: Hebrew pages live at /, English at /en/.
// =====================================================================

const LANG = document.documentElement.lang === 'en' ? 'en' : 'he';
const EN = LANG === 'en';
const L = (he, en) => (EN ? en : he);                   // pick a UI string
const tr = (obj, key) => (EN && obj[key + '_en']) || obj[key];  // pick a data field
const BASE = EN ? '/en/' : '/';
const OTHER_BASE = EN ? '/' : '/en/';
const ARROW = EN ? '→' : '←';

const T = slug => SITE.tickets + slug;
const ext = 'target="_blank" rel="noopener"';
const dayOf = id => DAYS.find(d => d.id === id);
const dayName = d => (EN ? d.name_en : 'יום ' + d.name);
const img = f => '/images/' + f;
const page = f => BASE + f;

const NAV_MAIN = [
  ['lineup.html', 'לוח הופעות', 'Line-up'],
  ['festival-2025.html', 'מהדורות קודמות', 'Past Editions'],
  ['venue.html', 'המתחם', 'The Venue'],
  ['index.html#partners', 'שותפים', 'Partners'],
];
const NAV_SUB = [
  ['about.html', 'אודות', 'About'],
  ['workshops.html', 'סדנאות', 'Workshops'],
  ['media.html', 'מדיה ועיתונות', 'Media + Press'],
  ['tickets.html', 'כרטיסים ופסים', 'Tickets + Passes'],
  ['contact.html', 'צור קשר', 'Contact'],
];

const ICONS = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-ig" viewBox="0 0 24 24"><path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM12 2c-2.7 0-3 0-4.1.1C4.3 2.3 2.3 4.3 2.1 7.9 2 9 2 9.3 2 12s0 3 .1 4.1c.2 3.6 2.2 5.6 5.8 5.8 1.1.1 1.4.1 4.1.1s3 0 4.1-.1c3.6-.2 5.6-2.2 5.8-5.8.1-1.1.1-1.4.1-4.1s0-3-.1-4.1c-.2-3.6-2.2-5.6-5.8-5.8C15 2 14.7 2 12 2zm0 1.8c2.7 0 3 0 4 .1 2.7.1 4 1.4 4.1 4.1.1 1 .1 1.3.1 4s0 3-.1 4c-.1 2.7-1.4 4-4.1 4.1-1 .1-1.3.1-4 .1s-3 0-4-.1c-2.7-.1-4-1.4-4.1-4.1-.1-1-.1-1.3-.1-4s0-3 .1-4C4 5.3 5.3 4 8 3.9c1-.1 1.3-.1 4-.1z"/></symbol>
  <symbol id="i-fb" viewBox="0 0 24 24"><path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.2h2.8V22h3.4z"/></symbol>
</svg>`;

const socials = () => `
  <a href="${SITE.instagram}" ${ext} aria-label="Instagram"><svg class="ic"><use href="#i-ig"/></svg></a>
  <a href="${SITE.facebook}" ${ext} aria-label="Facebook"><svg class="ic"><use href="#i-fb"/></svg></a>`;

// same page in the other language (keeps the #section)
function otherLangHref() {
  const file = location.pathname.split('/').pop() || 'index.html';
  return OTHER_BASE + (file === 'index.html' ? '' : file) + location.hash;
}

function buildChrome() {
  const here = location.pathname.split('/').pop() || 'index.html';
  const link = ([href, he, en]) => `<a href="${page(href)}"${href === here ? ' class="active" aria-current="page"' : ''}>${L(he, en)}</a>`;
  const langBtn = cls => `<a class="${cls}" href="${otherLangHref()}" hreflang="${L('en', 'he')}" lang="${L('en', 'he')}">${L('English', 'עברית')}</a>`;

  document.body.insertAdjacentHTML('afterbegin', `
<a class="skip" href="#main">${L('דילוג לתוכן', 'Skip to content')}</a>
${ICONS}
<header class="topbar">
  <div class="tag">World <em>Jazz</em> Music · <i>${L('רעננה', 'Raanana')}</i> · ${SITE.dates}</div>
  <nav>
    <a href="${page('lineup.html')}">${L('לוח <span>הופעות</span>', 'Line-<span>up</span>')}</a>
    <a href="${page('workshops.html')}">${L('סדנאות', 'Workshops')}</a>
    <a href="${page('tickets.html')}">${L('רכישת <span>כרטיסים</span>', 'Buy <span>tickets</span>')}</a>
    ${langBtn('lang-switch')}
  </nav>
</header>
<div class="brand">
  <a href="${page('index.html')}"><img src="${SITE.logo}" alt="${L('World Jazz Music – פסטיבל הג׳אז רעננה', 'World Jazz Music – Raanana Jazz Festival')}"></a>
  <button class="burger" aria-label="${L('פתיחת תפריט', 'Open menu')}" aria-expanded="false" aria-controls="drawer"><span></span><span></span><span></span></button>
</div>
<div class="socials-fixed">${socials()}</div>
<div class="drawer-scrim" data-close></div>
<nav class="drawer" id="drawer" aria-label="${L('תפריט ראשי', 'Main menu')}">
  <button class="close" data-close aria-label="${L('סגירת תפריט', 'Close menu')}"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M5 5l14 14M19 5L5 19"/></svg></button>
  <a href="${page('index.html')}"><img class="dlogo" src="${SITE.logoDark}" alt="${L('World Jazz Music – דף הבית', 'World Jazz Music – Home')}"></a>
  <div class="main">${NAV_MAIN.map(link).join('')}</div>
  <div class="sub">${NAV_SUB.map(link).join('')}</div>
  <div class="follow">
    ${langBtn('lang-switch drawer-lang')}
    <b>${L('עקבו אחרינו', 'Follow us')}</b>
    <div>${socials()}</div>
    <small>${L('עדכונים על הפסטיבל הבא באינסטגרם ובפייסבוק', 'News about the next festival on Instagram and Facebook')}</small>
    <a href="${page('tickets.html')}" class="btn primary dbtn">${L('לרכישת כרטיסים', 'Buy tickets')}</a>
  </div>
</nav>`);

  document.body.insertAdjacentHTML('beforeend', `
<footer class="footer grain">
  <a href="${page('index.html')}"><img class="flogo" src="${SITE.logo}" alt="World Jazz Music"></a>
  <div class="socials">${socials()}</div>
  <div class="ctas"><a href="${page('tickets.html')}" class="btn primary">${L('לרכישת כרטיסים', 'Buy tickets')}</a></div>
  <div class="fcols">
    <div><h2>${L('הפסטיבל', 'Festival')}</h2><a href="${page('lineup.html')}">${L('לוח הופעות', 'Line-up')}</a><a href="${page('festival-2025.html')}">${L('מהדורות קודמות', 'Past Editions')}</a><a href="${page('venue.html')}">${L('המתחם', 'The Venue')}</a><a href="${SITE.program}" ${ext}>${L('תוכנייה', 'Programme')}</a></div>
    <div><h2>${L('השתתפות', 'Get involved')}</h2><a href="${page('workshops.html')}">${L('סדנאות', 'Workshops')}</a><a href="${page('tickets.html')}">${L('כרטיסים ופסים', 'Tickets + Passes')}</a><a href="${page('media.html')}">${L('מדיה ועיתונות', 'Media + Press')}</a></div>
    <div><h2>${L('עלינו', 'About')}</h2><a href="${page('about.html')}">${L('אודות', 'About us')}</a><a href="${page('contact.html')}">${L('צור קשר', 'Contact')}</a><a href="${page('accessibility.html')}">${L('הצהרת נגישות', 'Accessibility statement')}</a>${langBtn('')}<p>${L(SITE.venueName, 'Raanana Pais Music Center')}</p></div>
  </div>
  <div class="copy">© ${SITE.year} website by Lior Doron · graphic design by Dekel Hevroni</div>
</footer>
<a href="#" class="totop" aria-label="${L('חזרה למעלה', 'Back to top')}"><svg viewBox="0 0 24 24" stroke-width="2.5"><path d="M6 15l6-6 6 6"/></svg></a>`);

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

  // remember the visitor's language choice
  document.querySelectorAll('.lang-switch, .fcols a[hreflang]').forEach(a =>
    a.addEventListener('click', () => { try { localStorage.setItem('lang', a.hreflang); } catch (e) {} }));
}

// ---------- render helpers ----------
const freeTag = `<span class="free">${L('כניסה חופשית', 'Free entry')}</span>`;

function renderSchedule(el) {
  el.innerHTML = DAYS.map(d => `
    <div class="daycol">
      <header><h3>${dayName(d)}</h3><span>${d.date}</span></header>
      ${SHOWS.filter(s => s.day === d.id).map(s => `
        <div class="slot"><time>${s.time}</time><div>
          <div class="t">${tr(s, 'title')}</div>
          <div class="v">${tr(s, 'venue')}${s.free ? freeTag : ''}</div>
          ${s.slug ? `<a class="tix" href="${T(s.slug)}" ${ext}>${L('לכרטיסים', 'Tickets')} ${ARROW}</a>` : ''}
        </div></div>`).join('')}
      <a class="pass" href="${T(d.pass)}" ${ext}>${L('לרכישת פס יומי', 'Buy a day pass')} ${ARROW}</a>
    </div>`).join('');
}

function renderCards(el, list = SHOWS.filter(s => s.featured)) {
  el.innerHTML = list.map(s => `
    <article class="card">
      <div class="ph" data-bg="${img(s.img)}"></div>
      <div class="day">${EN ? dayOf(s.day).name_en : dayOf(s.day).name} ${dayOf(s.day).date} <b>· ${s.time}</b></div>
      <h3>${tr(s, 'title')}</h3>
      <div class="desc">${tr(s, 'desc')}</div>
      <div class="venue">${tr(s, 'venue')}</div>
      ${s.slug ? `<a href="${T(s.slug)}" class="buy stretch" ${ext}>${L('לרכישת כרטיסים', 'Buy tickets')}</a>` : ''}
    </article>`).join('');
}

// Featured shows as an editorial list: the first is the lead, the rest follow as rows.
function renderFeatured(el) {
  const featured = SHOWS.filter(s => s.featured);
  const lead = featured.find(s => s.lead) || featured[0];   // the headline production leads
  const rest = featured.filter(s => s !== lead);
  const meta = s => `${dayName(dayOf(s.day))} ${dayOf(s.day).date} · ${s.time} · ${tr(s, 'venue')}`;
  const link = (s, label, cls) => s.slug ? `<a href="${T(s.slug)}" class="${cls} stretch" ${ext}>${label}</a>` : '';
  el.innerHTML = `
    <article class="lead">
      <div class="ph" data-bg="${img(lead.img)}" role="img" aria-label="${tr(lead, 'title')}"></div>
      <div class="meta">${meta(lead)}</div>
      <h3>${tr(lead, 'title')}</h3>
      <p>${tr(lead, 'desc')}</p>
      ${link(lead, L('לכרטיסים', 'Tickets') + ' ' + ARROW, 'buy')}
    </article>
    <ul class="others">
      ${rest.map(s => `
        <li>
          <div class="ph" data-bg="${img(s.img)}"></div>
          <div>
            <div class="meta">${dayName(dayOf(s.day))} ${dayOf(s.day).date} · ${s.time}</div>
            <h3>${link(s, tr(s, 'title'), 'name') || tr(s, 'title')}</h3>
            <div class="venue">${tr(s, 'venue')}</div>
          </div>
        </li>`).join('')}
    </ul>`;
}

// "Now on stage": during festival days, what is playing on each stage right now (or next).
// Preview any moment with ?now=2025-12-19T20:15
function nowOnStage(el) {
  const param = new URLSearchParams(location.search).get('now');
  const clock = () => (param ? new Date(param + (/[+Z]/.test(param.slice(10)) ? '' : '+02:00')) : new Date());
  const at = (iso, time) => new Date(`${iso}T${time}:00+02:00`);   // Israel time in December
  const render = () => {
    const now = clock();
    const day = DAYS.find(d => d.iso && now >= at(d.iso, '00:00') && now < at(d.iso, '23:59'));
    const shows = day ? SHOWS.filter(s => s.day === day.id) : [];
    const stages = [...new Set(shows.map(s => s.venue))];
    const rows = stages.map(v => {
      const list = shows.filter(s => s.venue === v).sort((a, b) => a.time.localeCompare(b.time));
      const cur = list.find((s, i) => at(day.iso, s.time) <= now && now < (list[i + 1] ? at(day.iso, list[i + 1].time) : new Date(+at(day.iso, s.time) + 90 * 60000)));
      const next = list.find(s => at(day.iso, s.time) > now);
      return { v, cur, next, label: tr(list[0], 'venue') };
    }).filter(r => r.cur || r.next);
    if (!rows.length) { el.hidden = true; return; }
    el.hidden = false;
    el.innerHTML = `<div class="now-in">
      <div class="now-h"><span class="live" aria-hidden="true"></span>${L('עכשיו על הבמות', 'Now on stage')} · ${dayName(day)} ${day.date}</div>
      <ul>${rows.map(r => r.cur
        ? `<li><b>${r.label}</b><strong>${tr(r.cur, 'title')}</strong><span>${L('התחיל ב־', 'Started ')}${r.cur.time}</span></li>`
        : `<li class="idle"><b>${r.label}</b><strong>${tr(r.next, 'title')}</strong><span>${L('בשעה', 'At')} ${r.next.time}</span></li>`).join('')}</ul>
    </div>`;
  };
  render();
  setInterval(render, 60000);
}

function renderShowList(el, dayId) {
  el.innerHTML = SHOWS.filter(s => !dayId || s.day === dayId).map(s => `
    <article class="showrow">
      <div class="ph${s.img ? '' : ' noimg'}" ${s.img ? `data-bg="${img(s.img)}"` : ''}></div>
      <div>
        <div class="when">${dayName(dayOf(s.day))} ${dayOf(s.day).date} <time>${s.time}</time></div>
        <h3>${tr(s, 'title')}</h3>
        <p>${tr(s, 'desc')}</p>
        <div class="venue">${tr(s, 'venue')}</div>
        ${s.credit ? `<small class="credit">${L('צילום', 'Photo')}: ${s.credit}</small>` : ''}
      </div>
      <div class="act">
        ${s.free ? `<div class="free">${L('כניסה חופשית', 'Free entry')}</div><br>` : ''}
        ${s.slug ? `<a class="btn primary stretch" href="${T(s.slug)}" ${ext}>${L('לכרטיסים', 'Tickets')}</a>` : ''}
      </div>
    </article>`).join('');
}

function renderTeachers(el, asList = true) {
  const rows = TEACHERS.map(([f, n, r, nEn, rEn]) => [f, EN ? nEn : n, EN ? rEn : r]);
  el.innerHTML = asList
    ? rows.map(([f, n, r]) => `<li><i data-bg="${img(f)}"></i><div><b>${n}</b><small>${r}</small></div></li>`).join('')
    : rows.map(([f, n, r]) => `<div class="person"><div class="ph" data-bg="${img(f)}"></div><b>${n}</b><span>${r}</span></div>`).join('');
}

function renderMoments(el) {
  el.innerHTML = MOMENTS.map(([f, cap, capEn, credit]) => `<a href="${img(f)}" target="_blank" rel="noopener" data-bg="${img(f)}" aria-label="${EN ? capEn : cap}"><span>${EN ? capEn : cap}</span>${credit ? `<small class="credit">${L('צילום', 'Photo')}: ${credit}</small>` : ''}</a>`).join('');
}

function renderPartners(el) {
  el.innerHTML = PARTNERS.map(([f, alt, altEn]) => `<img class="tall" src="${img(f)}" alt="${EN ? altEn : alt}">`).join('');
}

function renderThemePasses(el) {
  el.innerHTML = `<span>${L('פסים לפי נושאים:', 'Themed passes:')}</span>` + THEME_PASSES.map(([n, slug]) => `<a href="${T(slug)}" ${ext}>${n}</a>`).join('');
}

buildChrome();
document.querySelectorAll('[data-render]').forEach(el => {
  const fn = { schedule: renderSchedule, cards: renderCards, featured: renderFeatured, now: nowOnStage, showlist: renderShowList, teachers: renderTeachers,
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

// photos exist as name-800.webp and name-1600.webp; pick the one this element needs
const sized = (src, el) => {
  if (!/\.jpe?g$/.test(src)) return src;
  const need = (el.offsetWidth || 800) * (devicePixelRatio || 1);
  return src.replace(/\.jpe?g$/, need > 900 ? '-1600.webp' : '-800.webp');
};

function lazyBackgrounds() {
  const els = document.querySelectorAll('[data-bg]');
  const load = el => { el.style.backgroundImage = `url(${sized(el.dataset.bg, el)})`; el.classList.add('bg-in'); el.removeAttribute('data-bg'); };
  if (!('IntersectionObserver' in window)) return els.forEach(load);
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { load(e.target); io.unobserve(e.target); }
  }), { rootMargin: '400px 0px' });
  els.forEach(el => io.observe(el));
}

const REVEAL = [
  '.stitle', '.intro h2', '.intro p', '.card', '.daycol', '.passes', '.duo .col', '.moments-h', '.grid > div',
  '.partners h2', '.partners .logos img', '.grid > a', '.showrow', '.artist', '.venue-card', '.tcard', '.cbtn', '.dl',
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
  const show = el => { el.classList.add('in'); io.unobserve(el); };
  const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) show(e.target); }),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach(el => io.observe(el));

  // Safety nets so content is never left invisible:
  // anything already on screen that the observer missed, a hidden tab at load, and printing.
  const showVisible = () => els.forEach(el => {
    if (!el.classList.contains('in') && el.getBoundingClientRect().top < innerHeight) show(el);
  });
  const showAll = () => els.forEach(show);
  if (document.visibilityState === 'hidden') showAll();
  setTimeout(showVisible, 1200);
  let queued = false;
  addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    setTimeout(() => { showVisible(); queued = false; }, 250);
  }, { passive: true });
  addEventListener('beforeprint', showAll);
}

// Festival opens 10 Dec 2026, 00:00 Israel time (UTC+2 in December)
const FESTIVAL_START = new Date('2026-12-10T00:00:00+02:00');

function countdown() {
  const box = document.getElementById('countdown');
  if (!box) return;
  const out = Object.fromEntries([...box.querySelectorAll('[data-k]')].map(b => [b.dataset.k, b]));
  let timer;
  const tick = () => {
    const ms = FESTIVAL_START - Date.now();
    if (ms <= 0) {
      box.hidden = true;
      document.getElementById('cdLabel').textContent = L('הפסטיבל כבר כאן!', 'The festival is here!');
      return clearInterval(timer);
    }
    const s = Math.floor(ms / 1000);
    out.d.textContent = Math.floor(s / 86400);
    const two = n => String(n).padStart(2, '0');
    out.h.textContent = two(Math.floor(s / 3600) % 24);
    out.m.textContent = two(Math.floor(s / 60) % 60);
    out.s.textContent = two(s % 60);
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
  btn.href = page('tickets.html');
  btn.className = 'btn primary sticky-cta';
  btn.textContent = L('לרכישת כרטיסים', 'Buy tickets');
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

// The fixed logo and menu icon are white; over a light section they switch to charcoal.
const DARK_SECTIONS = '.hero, .page-hero, .hero-photo, .passes, .partners, .footer, .cta-band, .topbar';
function chromeContrast() {
  const brand = document.querySelector('.brand');
  if (!brand) return;
  let queued = false;
  const check = () => {
    queued = false;
    const r = brand.getBoundingClientRect();
    const under = document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2)
      .find(el => !brand.contains(el) && !el.closest('.socials-fixed, .totop, .sticky-cta'));
    document.body.classList.toggle('chrome-dark', !(under && under.closest(DARK_SECTIONS)));
  };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(check); } }, { passive: true });
  addEventListener('resize', check);
  check();
}

addEventListener('DOMContentLoaded', () => {
  chromeContrast();
  lazyBackgrounds();
  scrollReveal();
  countdown();
  stickyCta();
});
