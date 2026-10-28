// =====================================================================
//  Shared chrome (top bar, logo, drawer menu, footer) + render helpers.
//  Every page loads data.js then this file.
//  Language comes from <html lang>: Hebrew pages live at ROOT/, English at ROOT/en/.
//  ROOT is the folder the site sits in: '' at launch, the hidden preview
//  folder before that. It is read from this script's own URL.
// =====================================================================

const LANG = document.documentElement.lang === 'en' ? 'en' : 'he';
const EN = LANG === 'en';
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const L = (he, en) => (EN ? en : he);                   // pick a UI string
const tr = (obj, key) => (EN && obj[key + '_en']) || obj[key];  // pick a data field
const ROOT = new URL(document.currentScript.src).pathname.replace(/\/assets\/site\.js$/, '');
const BASE = ROOT + (EN ? '/en/' : '/');
const OTHER_BASE = ROOT + (EN ? '/' : '/en/');
const ARROW = `<i class="arr" aria-hidden="true">${EN ? '→' : '←'}</i>`;

const T = slug => SITE.tickets + slug;
const ext = 'target="_blank" rel="noopener"';
const dayOf = (id, list = DAYS) => list.find(d => d.id === id);
const dayName = d => (EN ? d.name_en : 'יום ' + d.name);
const img = f => ROOT + '/images/' + f;
// data.js names a few files from the domain root – point them into ROOT
['logo', 'logoDark', 'program'].forEach(k => { if (SITE[k] && SITE[k][0] === '/') SITE[k] = ROOT + SITE[k]; });
const page = f => BASE + f;

const NAV_MAIN = [
  ['lineup.html', 'לוח הופעות', 'Line-up'],
  ['guide.html', 'מידע למבקרים', 'Visitor info'],
  ['festival-2025.html', 'מהדורות קודמות', 'Past Editions'],
  ['venue.html', 'המתחם', 'The Venue'],
  ['index.html#partners', 'שותפים', 'Partners'],
];
const NAV_SUB = [
  ['about.html', 'אודות', 'About'],
  ['workshops.html', 'סדנאות', 'Workshops'],
  ['media.html', 'מדיה ועיתונות', 'Media + Press'],
  ['tickets.html', 'כרטיסים ופסים', 'Tickets + Passes'],
  ['guide.html#faq', 'שאלות נפוצות', 'FAQ'],
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
  let li = 0;
  const link = ([href, he, en]) => `<a href="${page(href)}" style="--i:${li++}"${href === here ? ' class="active" aria-current="page"' : ''}>${L(he, en)}</a>`;
  const langBtn = cls => `<a class="${cls}" href="${otherLangHref()}" hreflang="${L('en', 'he')}" lang="${L('en', 'he')}">${L('English', 'עברית')}</a>`;

  document.body.insertAdjacentHTML('afterbegin', `
<a class="skip" href="#main">${L('דילוג לתוכן', 'Skip to content')}</a>
${ICONS}
${SITE.notice ? `<div class="notice"><span class="dot" aria-hidden="true"></span><b>${L(SITE.notice.he, SITE.notice.en)}</b>
  <a href="${/^https?:/.test(SITE.notice.href) ? SITE.notice.href : page(SITE.notice.href)}" ${/^https?:/.test(SITE.notice.href) ? ext : ''}>${L(SITE.notice.link, SITE.notice.link_en)} ${ARROW}</a></div>` : ''}
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
  <a class="logo-dots" href="${page('index.html')}"><img src="${img('logo-nodots.png')}" alt="${L('World Jazz Music – פסטיבל הג׳אז רעננה', 'World Jazz Music – Raanana Jazz Festival')}"><img class="ld ld1" src="${img('logo-dot1.png')}" alt=""><img class="ld ld2" src="${img('logo-dot2.png')}" alt=""><img class="ld ld3" src="${img('logo-dot3.png')}" alt=""></a>
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
    <div><h2>${L('הפסטיבל', 'Festival')}</h2><a href="${page('lineup.html')}">${L('לוח הופעות', 'Line-up')}</a><a href="${page('festival-2025.html')}">${L('מהדורות קודמות', 'Past Editions')}</a><a href="${page('venue.html')}">${L('המתחם', 'The Venue')}</a><a href="${page('guide.html')}">${L('מידע למבקרים', 'Visitor info')}</a><a href="${SITE.program}" ${ext}>${L('תוכנייה', 'Programme')}</a></div>
    <div><h2>${L('השתתפות', 'Get involved')}</h2><a href="${page('workshops.html')}">${L('סדנאות', 'Workshops')}</a><a href="${page('tickets.html')}">${L('כרטיסים ופסים', 'Tickets + Passes')}</a><a href="${page('media.html')}">${L('מדיה ועיתונות', 'Media + Press')}</a></div>
    <div><h2>${L('עלינו', 'About')}</h2><a href="${page('about.html')}">${L('אודות', 'About us')}</a><a href="${page('guide.html#faq')}">${L('שאלות נפוצות', 'FAQ')}</a><a href="${page('contact.html')}">${L('צור קשר', 'Contact')}</a><a href="${page('accessibility.html')}">${L('הצהרת נגישות', 'Accessibility statement')}</a><a href="${page('privacy.html')}">${L('מדיניות פרטיות', 'Privacy policy')}</a><a href="${page('terms.html')}">${L('תנאי שימוש', 'Terms of use')}</a>${langBtn('')}<p>${L(SITE.venueName, 'Raanana Pais Music Center')}</p></div>
  </div>
  <div class="copy">© ${SITE.year} website by Lior Doron · graphic design by Dekel Hevroni</div>
</footer>
<a href="#" class="totop" aria-label="${L('חזרה למעלה', 'Back to top')}"><svg class="ring" viewBox="0 0 54 54" aria-hidden="true"><circle cx="27" cy="27" r="25"/></svg><svg viewBox="0 0 24 24" stroke-width="2.5"><path d="M6 15l6-6 6 6"/></svg></a>`);

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

  // the fixed logo starts below the notice strip and rises with it as the page scrolls
  const notice = document.querySelector('.notice');
  if (notice) {
    const chrome = [document.querySelector('.brand'), document.querySelector('.socials-fixed')];
    const place = () => { const y = Math.max(0, notice.offsetHeight - scrollY); chrome.forEach(c => c && (c.style.transform = `translateY(${y}px)`)); };
    addEventListener('scroll', place, { passive: true }); addEventListener('resize', place); place();
  }

  // remember the visitor's language choice
  document.querySelectorAll('.lang-switch, .fcols a[hreflang]').forEach(a =>
    a.addEventListener('click', () => { try { localStorage.setItem('lang', a.hreflang); } catch (e) {} }));
}

// ---------- render helpers ----------
const freeTag = `<span class="free">${L('כניסה חופשית', 'Free entry')}</span>`;
const kidsTag = `<span class="free kids">${L('לכל המשפחה', 'For families')}</span>`;

function renderSchedule(el) {
  el.innerHTML = DAYS.map(d => `
    <div class="daycol">
      <header><h3>${dayName(d)}</h3><span>${d.date}</span></header>
      ${SHOWS.filter(s => s.day === d.id).map(s => `
        <div class="slot"><time>${s.time}</time><div>
          <div class="t">${tr(s, 'title')}</div>
          <div class="v">${tr(s, 'venue')}${s.free ? freeTag : ''}${s.kids ? kidsTag : ''}</div>
          ${s.slug ? `<a class="tix" href="${T(s.slug)}" ${ext}>${L('לכרטיסים', 'Tickets')} ${ARROW}</a>` : ''}
        </div></div>`).join('')}
      ${d.pass ? `<a class="pass" href="${T(d.pass)}" ${ext}>${L('לרכישת פס יומי', 'Buy a day pass')} ${ARROW}</a>` : ''}
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
      const end = (s, i) => s.dur ? new Date(+at(day.iso, s.time) + s.dur * 60000) : list[i + 1] ? at(day.iso, list[i + 1].time) : new Date(+at(day.iso, s.time) + 90 * 60000);
      const cur = list.find((s, i) => at(day.iso, s.time) <= now && now < end(s, i));
      const next = list.find(s => at(day.iso, s.time) > now);
      return { v, cur, next, label: tr(list[0], 'venue') };
    }).filter(r => r.cur || r.next);
    if (!rows.length) { el.hidden = true; return; }
    el.hidden = false;
    el.innerHTML = `<div class="now-in">
      <div class="now-h"><span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>${L('עכשיו על הבמות', 'Now on stage')} · ${dayName(day)} ${day.date}</div>
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
        ${s.free ? `<div class="free">${L('כניסה חופשית', 'Free entry')}</div><br>` : ''}${s.kids ? `<div class="free kids">${L('לכל המשפחה', 'For families')}</div><br>` : ''}
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

// ---------- line-up as a cloud of names, coloured by day ----------
function renderCloud(el) {
  const count = id => SHOWS.filter(s => !id || s.day === id).length;
  const chip = (id, label) => `<button type="button" class="${id ? 'd-' + id : 'all'}${id ? '' : ' on'}" data-day="${id}" aria-pressed="${!id}">
    ${id ? '<i aria-hidden="true"></i>' : ''}<span>${label}</span><b>${count(id)}</b></button>`;
  el.innerHTML = `
    <div class="cloud-filter" role="group" aria-label="${L('סינון לפי יום', 'Filter by day')}">
      ${chip('', L('כל הימים', 'All days'))}${DAYS.map(d => chip(d.id, `${dayName(d)} ${d.date}`)).join('')}
    </div>
    <ul class="cloud">${SHOWS.map(s => `
      <li data-day="${s.day}" style="--i:${SHOWS.indexOf(s)}"><button type="button" class="pill d-${s.day}" aria-expanded="false">
        <span class="n">${tr(s, 'title')}</span>
        <span class="m">${dayName(dayOf(s.day))} · ${s.time} · ${tr(s, 'venue')}${s.free ? ' · ' + L('כניסה חופשית', 'Free entry') : ''}</span>
      </button></li>`).join('')}</ul>`;
  const cloud = el.querySelector('.cloud');
  // names pop in the first time the cloud scrolls into view
  if (!reduceMotion && 'IntersectionObserver' in window) {
    cloud.classList.add('pre');
    const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { cloud.classList.replace('pre', 'pop'); io.disconnect(); } }, { threshold: .15 });
    io.observe(cloud);
    addEventListener('beforeprint', () => cloud.classList.remove('pre'));
  }
  el.querySelectorAll('.cloud-filter button').forEach(b => b.addEventListener('click', () => {
    el.querySelectorAll('.cloud-filter button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
    cloud.classList.remove('pre', 'pop');
    const items = [...cloud.children], before = new Map(items.map(li => [li, li.hidden ? null : li.getBoundingClientRect()]));
    items.forEach(li => { li.hidden = !!b.dataset.day && li.dataset.day !== b.dataset.day; });
    if (reduceMotion) return;
    // the names that stay glide to their new places; names that return grow back in
    items.filter(li => !li.hidden).forEach(li => {
      const a = before.get(li), z = li.getBoundingClientRect();
      li.animate(a ? [{ transform: `translate(${a.left - z.left}px, ${a.top - z.top}px)` }, { transform: 'none' }]
                   : [{ opacity: 0, transform: 'scale(.7)' }, { opacity: 1, transform: 'none' }],
        { duration: 420, easing: 'cubic-bezier(.23, 1, .32, 1)' });
    });
  }));
  el.querySelectorAll('.pill').forEach(p => p.addEventListener('click', () => {
    p.setAttribute('aria-expanded', p.getAttribute('aria-expanded') !== 'true');
  }));
}

// ---------- timetable: stages × hours, with a personal "my line-up" ----------
const FAV_KEY = 'rjf-favs';
const showKey = s => `${s.day}-${s.time}-${s.venue}`;
const readFavs = () => { try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]')); } catch (e) { return new Set(); } };
const saveFavs = f => { try { localStorage.setItem(FAV_KEY, JSON.stringify([...f])); } catch (e) {} };
const mins = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const hhmm = m => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

function renderTimetable(el) {
  let day = DAYS[0].id, mine = false, dir = 0, popped = null;
  const favs = readFavs();
  el.innerHTML = `
    <div class="tt-bar">
      <div class="tt-days" role="group" aria-label="${L('בחירת יום', 'Choose a day')}">${DAYS.map((d, i) =>
        `<button type="button" class="d-${d.id}${i ? '' : ' on'}" data-day="${d.id}" aria-pressed="${!i}"><b>${dayName(d)}</b><small>${d.date}</small></button>`).join('')}</div>
      <div class="tt-tools">
        <button type="button" class="tt-mine" aria-pressed="false">★ ${L('הליינאפ שלי', 'My line-up')} <b class="tt-count"></b></button>
        <button type="button" class="tt-print">${L('הדפסה / PDF', 'Print / PDF')} ↓</button>
      </div>
    </div>
    <p class="tt-hint" hidden>${L('עוד אין הופעות מסומנות ביום הזה. לחצו על ☆ בהופעה כדי להוסיף אותה לליינאפ שלכם.', 'No shows marked on this day yet. Tap ☆ on a show to add it to your line-up.')}</p>
    <div class="tt-scroll" tabindex="0" aria-label="${L('לוח זמנים לפי במות', 'Timetable by stage')}"><div class="tt"></div></div>`;
  const grid = el.querySelector('.tt');
  const draw = () => {
    const shows = SHOWS.filter(s => s.day === day);
    const stages = [...VENUES.map(v => v.name).filter(n => shows.some(s => s.venue === n)), ...new Set(shows.map(s => s.venue).filter(n => !VENUES.some(v => v.name === n)))];
    // a show ends when the next one on its stage starts, or after 90 minutes
    const items = shows.map(s => {
      const start = mins(s.time);
      const next = shows.filter(o => o.venue === s.venue && mins(o.time) > start).map(o => mins(o.time)).sort((a, b) => a - b)[0];
      return { s, start, end: s.dur ? start + s.dur : Math.min(next || Infinity, start + 90) };
    });
    // the timeline runs in whole hours; an empty stretch of two hours or more folds into one narrow break column
    const spans = items.map(i => [Math.floor(i.start / 60) * 60, Math.ceil(i.end / 60) * 60]).sort((a, b) => a[0] - b[0]);
    const segs = [];
    spans.forEach(([a, b]) => { const last = segs[segs.length - 1]; if (last && a - last[1] < 120) last[1] = Math.max(last[1], b); else segs.push([a, b]); });
    const tracks = [], hours = [];
    let col = 2;
    const colOf = m => { let c = 2; for (const [a, b] of segs) { if (m < b || b === segs[segs.length - 1][1]) return c + Math.round((m - a) / 15); c += (b - a) / 15 + 1; } return c; };
    segs.forEach(([a, b], k) => {
      if (k) { tracks.push('34px'); hours.push(`<div class="tt-h tt-gap" style="grid-column:${col}" aria-hidden="true">⋯</div>`); col++; }
      for (let m = a; m < b; m += 60) hours.push(`<div class="tt-h" style="grid-column:${col + (m - a) / 15} / span 4">${hhmm(m)}</div>`);
      for (let m = a; m < b; m += 15) tracks.push('minmax(26px, 1fr)');
      col += (b - a) / 15;
    });
    grid.style.setProperty('--cols', tracks.length);
    grid.style.gridTemplateColumns = `var(--stage-w) ${tracks.join(' ')}`;
    grid.innerHTML = `<div class="tt-corner"></div>${hours.join('')}` +
      stages.map((v, r) => `<div class="tt-stage" style="grid-row:${r + 2}">${tr(shows.find(s => s.venue === v), 'venue')}</div>`).join('') +
      items.map(({ s, start, end }) => {
        const on = favs.has(showKey(s));
        return `<div class="tt-show d-${s.day}${on ? ' fav' : ''}${dir ? ' in' : ''}" style="--i:${shows.indexOf(s)};--dir:${dir};grid-row:${stages.indexOf(s.venue) + 2};grid-column:${colOf(start)} / span ${Math.max(1, Math.round((end - start) / 15))}">
          <button type="button" class="star" data-key="${showKey(s)}" aria-pressed="${on}" aria-label="${L('הוספה לליינאפ שלי', 'Add to my line-up')}: ${tr(s, 'title')}">${on ? '★' : '☆'}</button>
          <b>${tr(s, 'title')}</b><small>${hhmm(start)}–${hhmm(end)}</small>
        </div>`;
      }).join('');
    grid.classList.toggle('mine', mine);
    const count = el.querySelector('.tt-count');
    count.textContent = favs.size ? `(${favs.size})` : '';
    if (popped && !reduceMotion) {
      const b = grid.querySelector(`.star[data-key="${CSS.escape(popped)}"]`);
      if (b) {
        b.classList.add('bump');
        if (favs.has(popped)) for (let i = 0; i < 8; i++) { const sp = document.createElement('i'); sp.className = 'spark'; sp.style.setProperty('--a', `${i * 45}deg`); b.appendChild(sp); }
        b.focus({ preventScroll: true });
      }
      count.classList.remove('bump'); void count.offsetWidth; count.classList.add('bump');
    }
    popped = null; dir = 0;
    el.querySelector('.tt-hint').hidden = !(mine && !shows.some(s => favs.has(showKey(s))));
  };
  el.querySelectorAll('.tt-days button').forEach(b => b.addEventListener('click', () => {
    const order = id => DAYS.findIndex(d => d.id === id);
    if (b.dataset.day === day) return;
    dir = (order(b.dataset.day) > order(day) ? 1 : -1) * (EN ? 1 : -1);
    day = b.dataset.day;
    el.querySelectorAll('.tt-days button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
    draw();
  }));
  el.querySelector('.tt-mine').addEventListener('click', e => {
    mine = !mine; e.currentTarget.setAttribute('aria-pressed', mine); draw();
  });
  el.querySelector('.tt-print').addEventListener('click', () => print());
  grid.addEventListener('click', e => {
    const b = e.target.closest('.star'); if (!b) return;
    favs.has(b.dataset.key) ? favs.delete(b.dataset.key) : favs.add(b.dataset.key);
    popped = b.dataset.key;
    saveFavs(favs); draw();
  });
  draw();
}

// ---------- visitor guide: numbered tabs (all panels show without script) ----------
function guideTabs() {
  const box = document.querySelector('.guide');
  if (!box) return;
  const tabs = [...box.querySelectorAll('[role="tab"]')];
  const list = box.querySelector('.g-tabs');
  const ind = document.createElement('span');
  ind.className = 'g-ind'; ind.setAttribute('aria-hidden', 'true');
  list.prepend(ind);
  const mark = () => {
    const t = tabs.find(x => x.getAttribute('aria-selected') === 'true');
    if (!t) return;
    ind.style.width = t.offsetWidth + 'px'; ind.style.height = t.offsetHeight + 'px';
    ind.style.transform = `translate(${t.offsetLeft}px, ${t.offsetTop}px)`;
  };
  const show = id => {
    tabs.forEach(t => {
      const on = t.dataset.tab === id;
      t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1;
      document.getElementById('g-' + t.dataset.tab).hidden = !on;
    });
    mark();
  };
  addEventListener('resize', mark);
  document.fonts && document.fonts.ready.then(() => { ind.classList.add('still'); mark(); requestAnimationFrame(() => ind.classList.remove('still')); });
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => { show(t.dataset.tab); history.replaceState(null, '', '#' + t.dataset.tab); });
    t.addEventListener('keydown', e => {
      const step = { ArrowLeft: EN ? -1 : 1, ArrowRight: EN ? 1 : -1 }[e.key];
      if (!step) return;
      const n = tabs[(i + step + tabs.length) % tabs.length]; n.focus(); n.click();
    });
  });
  const fromHash = tabs.find(t => '#' + t.dataset.tab === location.hash);
  ind.classList.add('still');
  show((fromHash || tabs[0]).dataset.tab);
  requestAnimationFrame(() => ind.classList.remove('still'));
}

// ---------- FAQ answers open and close with a short height animation ----------
function smoothDetails() {
  if (reduceMotion) return;
  document.querySelectorAll('.faq details').forEach(d => {
    const sum = d.querySelector('summary'), body = d.querySelector('summary + div');
    if (!body) return;
    let anim;
    sum.addEventListener('click', e => {
      e.preventDefault();
      if (anim) anim.cancel();
      const ease = 'cubic-bezier(.23, 1, .32, 1)';
      if (d.open) {
        anim = body.animate([{ height: body.offsetHeight + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 240, easing: ease });
        anim.onfinish = () => { d.open = false; anim = null; };
      } else {
        d.open = true;
        anim = body.animate([{ height: '0px', opacity: 0 }, { height: body.offsetHeight + 'px', opacity: 1 }], { duration: 320, easing: ease });
        anim.onfinish = () => { anim = null; };
      }
    });
  });
}

// ---------- back-to-top ring fills with scroll progress ----------
function scrollRing() {
  const c = document.querySelector('.totop .ring circle');
  if (!c) return;
  const len = 2 * Math.PI * 25;
  c.style.strokeDasharray = len;
  let queued = false;
  const set = () => {
    queued = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    c.style.strokeDashoffset = len * (1 - (max > 0 ? Math.min(1, scrollY / max) : 0));
  };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(set); } }, { passive: true });
  addEventListener('resize', set);
  set();
}

buildChrome();
document.querySelectorAll('[data-render]').forEach(el => {
  const fn = { schedule: renderSchedule, cards: renderCards, featured: renderFeatured, now: nowOnStage, showlist: renderShowList, teachers: renderTeachers,
    people: el => renderTeachers(el, false), moments: renderMoments, partners: renderPartners, themes: renderThemePasses,
    cloud: renderCloud, timetable: renderTimetable }[el.dataset.render];
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
  '.person', '.stat', '.stats-h', '.prose > *', '.sec-h', '.sec-h + p', '.daytabs', '.cta-band > *', '.map',
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

// each digit that changes rolls up into place, like a flip clock
function roll(el, val) {
  const old = el.dataset.v || '';
  if (val === old) return;
  el.innerHTML = [...val].map((c, i) => `<span${old && old[i] !== c && !reduceMotion ? ' class="in"' : ''}>${c}</span>`).join('');
  el.dataset.v = val;
}

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
    const two = n => String(n).padStart(2, '0');
    roll(out.d, two(Math.floor(s / 86400)));
    roll(out.h, two(Math.floor(s / 3600) % 24));
    roll(out.m, two(Math.floor(s / 60) % 60));
    roll(out.s, two(s % 60));
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
  guideTabs();
  smoothDetails();
  scrollRing();
});

// ---------- photo gallery: small thumbnails in batches, a larger view on click ----------
// GALLERY_2025 (assets/gallery-2025.js) lists [width, height] per photo; files are images/gallery-2025/NNN-480.webp and NNN-1200.webp
function renderGallery(el, list, dir) {
  if (!el || !list) return;
  const BATCH = 48, file = (i, w) => `${ROOT}/images/${dir}/${String(i + 1).padStart(3, '0')}-${w}.webp`;
  let shown = 0;
  el.innerHTML = `<div class="gal-grid"></div><button type="button" class="btn primary gal-more"></button>`;
  const grid = el.querySelector('.gal-grid'), more = el.querySelector('.gal-more');
  const add = () => {
    const end = Math.min(list.length, shown + BATCH);
    grid.insertAdjacentHTML('beforeend', list.slice(shown, end).map(([w, h], k) => {
      const i = shown + k;
      return `<button type="button" class="gal-tile" data-i="${i}" aria-label="${L('תמונה', 'Photo')} ${i + 1} ${L('מתוך', 'of')} ${list.length}">
        <img src="${file(i, 480)}" width="${w}" height="${h}" loading="lazy" decoding="async" alt=""></button>`;
    }).join(''));
    shown = end;
    more.hidden = shown >= list.length;
    more.textContent = L(`עוד תמונות (${list.length - shown})`, `More photos (${list.length - shown})`);
  };
  add();
  more.addEventListener('click', add);

  // larger view
  const box = document.createElement('dialog');
  box.className = 'gal-box';
  box.setAttribute('aria-label', L('גלריית תמונות', 'Photo gallery'));
  box.innerHTML = `<img alt=""><p class="gal-count" aria-live="polite"></p>
    <button type="button" class="gal-close" aria-label="${L('סגירה', 'Close')}">✕</button>
    <button type="button" class="gal-prev" aria-label="${L('התמונה הקודמת', 'Previous photo')}">${EN ? '‹' : '›'}</button>
    <button type="button" class="gal-next" aria-label="${L('התמונה הבאה', 'Next photo')}">${EN ? '›' : '‹'}</button>`;
  document.body.appendChild(box);
  const big = box.querySelector('img'), count = box.querySelector('.gal-count');
  let cur = 0;
  const show = i => {
    cur = (i + list.length) % list.length;
    big.src = file(cur, 1200); big.width = list[cur][0]; big.height = list[cur][1];
    count.textContent = `${cur + 1} / ${list.length}`;
    new Image().src = file((cur + 1) % list.length, 1200);          // the next one is ready when asked for
  };
  grid.addEventListener('click', e => { const t = e.target.closest('.gal-tile'); if (t) { show(+t.dataset.i); box.showModal(); } });
  box.querySelector('.gal-close').addEventListener('click', () => box.close());
  box.querySelector('.gal-prev').addEventListener('click', () => show(cur - 1));
  box.querySelector('.gal-next').addEventListener('click', () => show(cur + 1));
  box.addEventListener('click', e => { if (e.target === box) box.close(); });
  box.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') show(cur + (EN ? -1 : 1));
    if (e.key === 'ArrowRight') show(cur + (EN ? 1 : -1));
  });
  let x0 = null;
  box.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) show(cur + ((dx < 0) === EN ? 1 : -1));
  });
}
