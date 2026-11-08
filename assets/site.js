// =====================================================================
//  Shared chrome (top bar, logo, drawer menu, footer) + render helpers.
//  Every page loads data.js then this file.
//  Language comes from <html lang>: Hebrew pages live at ROOT/, English at ROOT/en/.
//  ROOT is the folder the site sits in: '' at launch, the hidden preview
//  folder before that. It is read from this script's own URL.
// =====================================================================

const LANG = document.documentElement.lang === 'en' ? 'en' : 'he';
const EN = LANG === 'en';
// a show photo with words in it can have an English twin (img_en)
if (EN && typeof SHOWS !== 'undefined') SHOWS.forEach(s => { if (s.img_en) s.img = s.img_en; });
// accessibility menu settings (saved per visitor); applied before anything renders
const A11Y_KEY = 'rjf-a11y';
const a11y = (() => { try { return JSON.parse(localStorage.getItem(A11Y_KEY)) || {}; } catch { return {}; } })();
const a11yApply = () => {
  const c = document.documentElement.classList;
  c.toggle('a11y-still', !!a11y.still);
  c.toggle('a11y-text-1', a11y.text === 1); c.toggle('a11y-text-2', a11y.text === 2);
  c.toggle('a11y-light', a11y.contrast === 'light'); c.toggle('a11y-dark', a11y.contrast === 'dark');
  c.toggle('a11y-mono', !!a11y.mono); c.toggle('a11y-links', !!a11y.links); c.toggle('a11y-focus', !!a11y.focus);
};
a11yApply();
// "stop all motion" from the menu counts exactly like the system's reduce-motion setting
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches || !!a11y.still;
const stilled = () => document.documentElement.classList.contains('a11y-still');   // switched on from the menu after load
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
// pretty addresses: 'lineup.html#x' -> 'lineup#x', 'index.html' -> '' (the host serves lineup.html at /lineup)
const clean = f => f.replace(/(^|\/)index\.html/, '$1').replace(/\.html(?=$|[#?])/, '');
const page = f => BASE + clean(f);

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
  const file = clean(location.pathname.split('/').pop() || '');
  return OTHER_BASE + file + location.hash;
}

function buildChrome() {
  const here = clean(location.pathname.split('/').pop() || '');
  let li = 0;
  const link = ([href, he, en]) => `<a href="${page(href)}" style="--i:${li++}"${clean(href) === here ? ' class="active" aria-current="page"' : ''}>${L(he, en)}</a>`;
  const langBtn = cls => `<a class="${cls}" href="${otherLangHref()}" hreflang="${L('en', 'he')}" lang="${L('en', 'he')}">${L('English', 'עברית')}</a>`;

  document.body.insertAdjacentHTML('afterbegin', `
<a class="skip" href="#main">${L('דילוג לתוכן', 'Skip to content')}</a>
${ICONS}
${SITE.notice ? `<div class="notice"><span class="dot" aria-hidden="true"></span><b>${L(SITE.notice.he, SITE.notice.en)}</b>
  <a href="${/^https?:/.test(SITE.notice.href) ? SITE.notice.href : page(SITE.notice.href)}" ${/^https?:/.test(SITE.notice.href) ? ext : ''}>${L(SITE.notice.link, SITE.notice.link_en)} ${ARROW}</a></div>` : ''}
<header class="topbar">
  <div class="tag">World <em>Jazz</em> Music · <i>${L('רעננה', 'Raanana')}</i> · <bdi dir="ltr">${SITE.dates}</bdi></div>
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
    <div><h2>${L('הפסטיבל', 'Festival')}</h2><a href="${page('lineup.html')}">${L('לוח הופעות', 'Line-up')}</a><a href="${page('festival-2025.html')}">${L('מהדורות קודמות', 'Past Editions')}</a><a href="${page('venue.html')}">${L('המתחם', 'The Venue')}</a><a href="${page('guide.html')}">${L('מידע למבקרים', 'Visitor info')}</a></div>
    <div><h2>${L('השתתפות', 'Get involved')}</h2><a href="${page('workshops.html')}">${L('סדנאות', 'Workshops')}</a><a href="${page('tickets.html')}">${L('כרטיסים ופסים', 'Tickets + Passes')}</a></div>
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
// stickers on show photos: free entry comes from s.free, the rest from s.tags
const STICKERS = { free: ['הכניסה חופשית', 'Free entry'], kids20: ['הופעת ילדים · 20 ₪ בלבד', 'Kids’ show · only ₪20'],
  original: ['הפקת מקור', 'Original production'], premiere: ['הופעת בכורה', 'Premiere'], screening: ['הקרנת בכורה', 'Premiere screening'] };
const stickers = s => {
  const keys = (s.free ? ['free'] : []).concat(s.tags || []);
  return keys.length ? `<span class="stk-wrap${s.stkLow ? ' low' : ''}">${keys.map(k => `<span class="stk stk-${k}">${L(...STICKERS[k])}</span>`).join('')}</span>` : '';
};
const freeTag = `<span class="free">${L('כניסה חופשית', 'Free entry')}</span>`;
const kidsTag = `<span class="free kids">${L('לכל המשפחה', 'For families')}</span>`;

function renderSchedule(el) {
  el.innerHTML = DAYS.map(d => `
    <div class="daycol">
      <header><h3>${dayName(d)}</h3><span>${d.date}</span></header>
      ${SHOWS.filter(s => s.day === d.id).map(s => `
        <div class="slot"><time>${s.time}</time><div>
          <button type="button" class="t" data-show="${s.id}" aria-haspopup="dialog">${tr(s, 'title')}</button>
          <div class="v">${tr(s, 'sub') || tr(s, 'venue')}${s.free ? freeTag : ''}${s.kids ? kidsTag : ''}</div>
          ${s.slug ? `<a class="tix" href="${T(s.slug)}" ${ext}>${L('לכרטיסים', 'Tickets')} ${ARROW}</a>` : ''}
        </div></div>`).join('')}
      ${d.pass ? `<a class="pass" href="${T(d.pass)}" ${ext}>${L('לרכישת פס יומי', 'Buy a day pass')} ${ARROW}</a>` : ''}
    </div>`).join('');
}

// thumbnails crop the photo; tpos keeps a baked-in guest card inside the crop
// the nightly jam is one SHOWS entry per night; lists of all shows show it once ("every night")
const ONCE = s => !s.repeat;
const when = s => s.every ? L('בכל לילה', 'Every night') : `${dayName(dayOf(s.day))} ${dayOf(s.day).date}`;
const thumbImg = s => s.timg || s.img;
const thumbPos = s => (s.tpos || s.pos) ? ` style="background-position:${s.tpos || s.pos}"` : '';

function renderCards(el, list = SHOWS.filter(s => s.featured)) {
  el.innerHTML = list.map(s => `
    <article class="card">
      <div class="ph" data-bg="${img(thumbImg(s))}"${thumbPos(s)}>${stickers(s)}</div>
      <div class="day">${EN ? dayOf(s.day).name_en : dayOf(s.day).name} ${dayOf(s.day).date} <b>· ${s.time}</b></div>
      <h3>${tr(s, 'title')}</h3>
      <div class="desc">${tr(s, 'sub')}</div>
      <div class="venue">${tr(s, 'venue')}</div>
      <button type="button" class="buy stretch" data-show="${s.id}" aria-haspopup="dialog">${L('לכל הפרטים', 'Full details')}</button>
    </article>`).join('');
}

// Featured shows as an editorial list: the first is the lead, the rest follow as rows.
function renderFeatured(el) {
  const featured = SHOWS.filter(s => s.featured);
  const lead = featured.find(s => s.lead) || featured[0];   // the headline production leads
  const rest = featured.filter(s => s !== lead);
  const meta = s => `${when(s)} · ${s.time} · ${tr(s, 'venue')}`;
  const link = (s, label, cls) => `<button type="button" class="${cls} stretch" data-show="${s.id}" aria-haspopup="dialog">${label}</button>`;
  el.innerHTML = `
    <article class="lead">
      <div class="ph" data-bg="${img(thumbImg(lead))}"${thumbPos(lead)} role="img" aria-label="${tr(lead, 'title')}">${stickers(lead)}</div>
      <div class="meta">${meta(lead)}</div>
      <h3>${tr(lead, 'title')}</h3>
      <p>${tr(lead, 'sub')}</p>
      ${link(lead, L('לכל הפרטים', 'Full details') + ' ' + ARROW, 'buy')}
    </article>
    <ul class="others">
      ${rest.map(s => `
        <li>
          <div class="ph" data-bg="${img(thumbImg(s))}"${thumbPos(s)}>${stickers(s)}</div>
          <div>
            <div class="meta">${when(s)} · ${s.time}</div>
            <h3>${link(s, tr(s, 'title'), 'name')}</h3>
            <div class="venue">${tr(s, 'venue')}</div>
          </div>
        </li>`).join('')}
    </ul>`;
}

// Home: one 2026 show at a time in a big spotlight, in random order so nobody is always first.
// Changes every 4 s with a crossfade and a slow zoom; pauses on hover; arrows and dots to move.
function renderSpotlight(el) {
  const order = SHOWS.filter(ONCE);
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  // wide desktop spotlight can use its own crop (simg) so a guest circle at the bottom isn't cut
  const wide = matchMedia('(min-width: 701px)').matches;
  const big = s => img(((wide && s.simg) || s.img).replace(/\.jpe?g$/, '-1600.webp'));
  const DOTS = 7;                                               // only a short window of dots, sliding with the current show
  el.innerHTML = `<div class="sp-stage">${order.map((s, i) => `<div class="sp-slide${i ? '' : ' on'}${wide && s.simg ? ' guest' : ''}" aria-hidden="${!!i}">
      ${s.img ? `<img src="${big(s)}" alt="" loading="${i < 2 ? 'eager' : 'lazy'}" decoding="async"${s.pos && !(wide && s.simg) ? ` style="object-position:${s.pos}"` : ''}>` : `<span class="sp-logo d-${s.day}"></span>`}
      ${stickers(s)}<div class="sp-cap"><small>${when(s)} · ${s.time} · ${tr(s, 'venue')}</small>
        <button type="button" data-show="${s.id}" aria-haspopup="dialog"${i ? ' tabindex="-1"' : ''}><bdi>${tr(s, 'title')}</bdi></button></div></div>`).join('')}</div>
    <div class="sp-ctl"><button type="button" class="sp-arr" data-step="-1" aria-label="${L('ההופעה הקודמת', 'Previous show')}">${EN ? '←' : '→'}</button>
      <div class="sp-dots" aria-hidden="true">${'<i></i>'.repeat(Math.min(DOTS, order.length))}</div>
      <button type="button" class="sp-arr" data-step="1" aria-label="${L('ההופעה הבאה', 'Next show')}">${EN ? '→' : '←'}</button></div>`;
  const slides = [...el.querySelectorAll('.sp-slide')], dots = [...el.querySelectorAll('.sp-dots i')], stage = el.querySelector('.sp-stage');
  let i = 0, timer, hold = false, visible = false;
  const go = n => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, j) => { s.classList.toggle('on', j === i); s.setAttribute('aria-hidden', j !== i); s.querySelector('button').tabIndex = j === i ? 0 : -1; });
    const total = slides.length, start = Math.max(0, Math.min(i - (DOTS >> 1), total - dots.length));
    dots.forEach((d, j) => {
      const k = start + j;
      d.classList.toggle('on', k === i);
      d.classList.toggle('edge', (j === 0 && k > 0) || (j === dots.length - 1 && k < total - 1));   // smaller end dots hint there are more
    });
  };
  const tick = () => { clearTimeout(timer); timer = setTimeout(() => { if (!hold && visible && !stilled()) go(i + 1); tick(); }, 4000); };
  el.querySelectorAll('.sp-arr').forEach(b => b.addEventListener('click', () => { go(i + +b.dataset.step); tick(); }));
  stage.addEventListener('mouseenter', () => { hold = true; });
  stage.addEventListener('mouseleave', () => { hold = false; });
  stage.addEventListener('focusin', () => { hold = true; });
  stage.addEventListener('focusout', () => { hold = false; });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(stage);
  go(0);
  if (!reduceMotion) tick();
}

// Home: Thursday / Friday / Saturday tabs; the day's shows as a timeline that slides in when the day changes.
function renderDays(el) {
  const thumb = s => s.img ? `<img src="${img((s.dimg || s.img).replace(/\.jpe?g$/, '-800.webp'))}" alt="" loading="lazy" decoding="async"${s.dpos || s.pos ? ` style="object-position:${s.dpos || s.pos}"` : ''}>` : '';
  el.innerHTML = `<div class="dy-tabs" role="tablist" aria-label="${L('ימי הפסטיבל', 'Festival days')}">${DAYS.map((d, i) =>
      `<button type="button" role="tab" id="dy-t-${d.id}" aria-controls="dy-panel" class="d-${d.id}" aria-selected="${!i}" tabindex="${i ? -1 : 0}">${dayName(d)}<b>${d.date}</b></button>`).join('')}</div>
    <div class="dy-panel d-${DAYS[0].id}" id="dy-panel" role="tabpanel"></div>`;
  const panel = el.querySelector('.dy-panel'), tabs = [...el.querySelectorAll('[role=tab]')];
  let cur = 0;
  const show = (i, dir) => {
    const d = DAYS[i];
    panel.className = `dy-panel d-${d.id}`;
    panel.setAttribute('aria-labelledby', `dy-t-${d.id}`);
    panel.innerHTML = `<ul class="dy-list${dir ? ' in-' + dir : ''}">${SHOWS.filter(s => s.day === d.id).sort((a, b) => a.time.localeCompare(b.time)).map(s =>
      `<li><time>${s.time}</time><span class="dy-th">${thumb(s)}</span><button type="button" data-show="${s.id}" aria-haspopup="dialog"><b><bdi>${tr(s, 'title')}</bdi></b><small>${tr(s, 'sub') || tr(s, 'venue')}</small></button></li>`).join('')}</ul>`;
    tabs.forEach((t, j) => { t.setAttribute('aria-selected', j === i); t.tabIndex = j === i ? 0 : -1; });
  };
  const pick = i => { if (i === cur) return; const dir = (i > cur) !== EN ? 'l' : 'r'; cur = i; show(i, reduceMotion ? '' : dir); };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => pick(i));
    t.addEventListener('keydown', e => {            // arrow keys move between tabs (mirrored in Hebrew)
      const k = { ArrowRight: EN ? 1 : -1, ArrowLeft: EN ? -1 : 1 }[e.key];
      if (!k) return;
      const n = (cur + k + tabs.length) % tabs.length; pick(n); tabs[n].focus(); e.preventDefault();
    });
  });
  show(0);
}

// Home: the five stages as photo cards, linking to the venue page.
function renderStages(el) {
  const g = f => img(`${f}-480.webp`);
  el.innerHTML = VENUES.map(v => {
    return `<a class="stage${v.img ? '' : ' new'}" href="${page('venue.html')}#map-${v.id}">
      <span class="stage-ph">${v.img ? `<img src="${g(v.img)}" srcset="${g(v.img)} 480w, ${img(v.img + '-1200.webp')} 1200w" sizes="(max-width: 700px) 70vw, 240px" alt="" loading="lazy" decoding="async">` : `<em>${L('חדש', 'New')}</em>`}</span>
      <b>${tr(v, 'name')}</b>
      <span class="stage-d">${tr(v, 'desc')}</span></a>`;
  }).join('');
}

// The building map: the music center drawn from the front (images/venue-map), with a
// clickable label + arrow per stage (positions in VENUES[].map). Picking a stage shows
// its floor, description and shows underneath. data-tone="field" = white labels for a
// terracotta section; venue.html#map-<id> opens with that stage picked.
function renderVenueMap(el) {
  const dayIx = d => DAYS.findIndex(x => x.id === d);
  const pins = VENUES.filter(v => v.map).map(v => `
    <button type="button" class="vm-pin${v.map.down ? ' down' : ''}" data-v="${v.id}" aria-pressed="false" style="left:${v.map.x}%;top:${v.map.y}%">
      <img class="vm-arrow" src="${img('venue-map/arrow-up.webp')}" alt="" aria-hidden="true">
      <span class="vm-name">${tr(v, 'name')}</span><span class="vm-floor">${tr(v, 'floor')}</span>
    </button>`).join('');
  el.innerHTML = `
    <div class="vm-scroll"><div class="vm-stage">
      <img class="vm-building" src="${img('venue-map/building-1776.webp')}" srcset="${img('venue-map/building-900.webp')} 900w, ${img('venue-map/building-1776.webp')} 1776w"
        sizes="(max-width: 800px) 800px, 1180px" width="1776" height="660" loading="lazy" decoding="async"
        alt="${L('ציור של מרכז פיס למוזיקה רעננה מלפנים, עם חמש במות הפסטיבל', 'Drawing of the Raanana Pais Music Center from the front, with the five festival stages')}">
      ${pins}
    </div></div>
    <p class="vm-hint">${L('לחצו על הבמה לפירוט ההופעות', 'Tap a stage to see its shows')}<span class="vm-swipe"> · ${L('אפשר לגלול את המפה הצידה', 'swipe the map sideways')}</span></p>
    <div class="vm-panel" aria-live="polite" hidden></div>`;
  const panel = el.querySelector('.vm-panel');
  const pick = (id, scroll) => {
    const v = VENUES.find(x => x.id === id);
    el.querySelectorAll('.vm-pin').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === id));
    if (!v) { panel.hidden = true; return; }
    const shows = SHOWS.filter(s => s.venue === v.name && ONCE(s)).sort((a, b) => dayIx(a.day) - dayIx(b.day) || a.time.localeCompare(b.time));
    panel.innerHTML = `
      <div class="vm-p-head"><h3>${tr(v, 'name')}</h3><span>${tr(v, 'floor')}</span></div>
      <p>${tr(v, 'desc')}</p>
      ${shows.length ? `<ul>${shows.map(s => `<li><time>${when(s)} · ${s.time}</time><button type="button" data-show="${s.id}" aria-haspopup="dialog"><bdi>${tr(s, 'title')}</bdi></button></li>`).join('')}</ul>`
        : `<p class="vm-none">${L('ההופעות בבמה הזו יפורסמו בקרוב.', 'Shows on this stage will be announced soon.')}</p>`}`;
    panel.hidden = false;
    if (!reduceMotion) panel.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.23,1,.32,1)' });
    if (scroll) {
      const b = el.querySelector(`.vm-pin[data-v="${id}"]`), sc = el.querySelector('.vm-scroll');
      if (b && sc.scrollWidth > sc.clientWidth) sc.scrollLeft += b.getBoundingClientRect().left - sc.getBoundingClientRect().left - sc.clientWidth / 2 + b.offsetWidth / 2;
    }
  };
  el.addEventListener('click', e => {
    const b = e.target.closest('.vm-pin');
    if (b) pick(b.getAttribute('aria-pressed') === 'true' ? null : b.dataset.v);
  });
  const fromHash = () => { const m = location.hash.match(/^#map-(\w+)/); if (m) { pick(m[1], true); setTimeout(() => el.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' }), 350); } };
  addEventListener('hashchange', fromHash);
  fromHash();
}

// Home: everything with free entry, grouped by day, on a photo of the 2025 plaza.
function renderFree(el) {
  const free = SHOWS.filter(s => s.free);
  el.innerHTML = `<div class="free-ph" aria-hidden="true"><img src="${img('gallery-2025/300-1200.webp')}" alt="" loading="lazy" decoding="async"></div>
    <div class="free-in"><img class="ill ill-bass" src="${img('ill/dekel-bass.webp')}" width="388" height="900" alt="" aria-hidden="true" loading="lazy">
      <h2 id="free-h">${L('כניסה חופשית', 'Free entry')}</h2>
      <p>${L('ברחבת הפסטיבל יש מוזיקה כל היום, פתוחה לכולם – וכל ערב נגמר בג׳אם סשן.', 'The Festival Plaza has music all day, open to everyone – and every night ends with a jam session.')}</p>
      <div class="free-days">${DAYS.map(d => `<div><h3>${dayName(d)} <span>${d.date}</span></h3><ul>${free.filter(s => s.day === d.id).map(s =>
        `<li><time>${s.time}</time><button type="button" data-show="${s.id}" aria-haspopup="dialog"><bdi>${tr(s, 'title')}</bdi></button></li>`).join('')}</ul></div>`).join('')}</div>
    </div>`;
}

// "Festival 2026" fact tiles: rise in one by one, and every number in them counts up from zero (10–12.12, 20, 14–25).
function factsMotion() {
  const list = document.querySelector('.facts');
  if (!list || reduceMotion || !('IntersectionObserver' in window)) return;
  const nums = [...list.querySelectorAll('[data-count]')].map(el => ({ el, text: el.textContent }));
  const frame = (text, p) => text.replace(/\d+/g, m => String(Math.round(+m * p)).padStart(m.length, '0'));
  list.classList.add('pre');
  nums.forEach(n => { n.el.setAttribute('aria-label', n.text); n.el.textContent = frame(n.text, 0); });
  const run = () => {
    list.classList.replace('pre', 'go');
    nums.forEach((n, i) => {
      const start = performance.now() + 150 + i * 120, dur = 1300;
      const step = t => {
        const p = Math.min(1, Math.max(0, (t - start) / dur));
        n.el.textContent = frame(n.text, 1 - Math.pow(1 - p, 4));   // fast start, gentle landing
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); run(); } }, { threshold: 0.35 });
  io.observe(list);
}

// Contact page: validated form with a topic dropdown (contact.html?topic=workshops preselects one).
// Sends through FormSubmit (free, to SITE.email with SITE.emailCc copied; the address must be activated once from the first message),
// or Web3Forms when SITE.contactFormKey is set. If sending fails it shows an error with the address to write to.
function contactForm(form) {
  if (!form) return;
  const $ = s => form.querySelector(s), status = $('.cf-status'), topic = $('#cf-topic');
  const hints = {
    artists: L('ספרו לנו על ההרכב והוסיפו קישורים להקלטות או לסרטונים.', 'Tell us about your band and add links to recordings or videos.'),
    workshops: L('כתבו את הכלי, הגיל והרמה – ונחזור עם פרטים על האודישן וההרשמה.', 'Tell us your instrument, age and level – we will reply with audition and sign-up details.'),
    access: L('ספרו לנו מה צריך כדי שתוכלו ליהנות מההופעות, ונעשה כל מה שאפשר.', 'Tell us what you need to enjoy the shows and we will do all we can.'),
  };
  const want = new URLSearchParams(location.search).get('topic');
  if (want && topic.querySelector(`option[value="${want}"]`)) topic.value = want;
  const hint = () => { const h = hints[topic.value]; $('.cf-hint').hidden = !h; $('.cf-hint').textContent = h || ''; };
  topic.addEventListener('change', hint); hint();
  const fields = ['#cf-name', '#cf-email', '#cf-topic', '#cf-msg'].map($);
  const ok = el => el.type === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim()) : el.value.trim() !== '';
  const mark = el => { const bad = !ok(el); el.setAttribute('aria-invalid', bad); el.closest('.cf-field').classList.toggle('bad', bad); return !bad; };
  fields.forEach(el => el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'blur', () => { if (el.value) mark(el); }));
  fields.forEach(el => el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true') mark(el); }));
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const bad = fields.filter(el => !mark(el));
    if (bad.length) { bad[0].focus(); status.textContent = L('יש כמה שדות שצריך למלא.', 'A few fields still need filling in.'); status.className = 'cf-status err'; return; }
    if ($('.cf-bot').checked) return;
    const d = Object.fromEntries(new FormData(form));
    const label = topic.options[topic.selectedIndex].text;
    const subject = `${label} – ${L('פנייה מאתר פסטיבל הג׳אז רעננה', 'Raanana Jazz Festival website')}`;
    const body = `${d.message}\n\n${L('שם', 'Name')}: ${d.name}\n${L('אימייל', 'Email')}: ${d.email}${d.phone ? `\n${L('טלפון', 'Phone')}: ${d.phone}` : ''}`;
    const mailto = () => {
      location.href = `mailto:${SITE.email}?${SITE.emailCc ? `cc=${SITE.emailCc}&` : ''}subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = L('נפתח מייל מוכן לשליחה – רק ללחוץ ״שלח״.', 'A ready-made email has opened – just press send.'); status.className = 'cf-status ok';
    };
    if (!SITE.contactFormKey && !SITE.formSubmit) return mailto();
    const btn = $('.cf-send'); btn.disabled = true; status.textContent = L('שולחים…', 'Sending…'); status.className = 'cf-status';
    try {
      const res = SITE.contactFormKey
        ? await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ access_key: SITE.contactFormKey, subject, from_name: d.name, replyto: d.email, name: d.name, email: d.email, phone: d.phone, topic: label, message: d.message }) })
        : await fetch(`https://formsubmit.co/ajax/${SITE.formSubmit === true ? SITE.email : SITE.formSubmit}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ [L('שם', 'Name')]: d.name, [L('אימייל', 'Email')]: d.email, [L('טלפון', 'Phone')]: d.phone || '', [L('נושא', 'Topic')]: label, [L('הודעה', 'Message')]: d.message,
              _subject: subject, _replyto: d.email, _cc: SITE.emailCc || '', _template: 'table', _captcha: 'false' }) });
      const out = await res.json();
      if (!(out.success === true || out.success === 'true')) throw new Error(out.message);
      form.reset(); hint(); fields.forEach(el => el.removeAttribute('aria-invalid'));
      status.textContent = L('תודה! ההודעה נשלחה ונחזור אליכם בהקדם.', 'Thank you! Your message was sent and we will reply soon.'); status.className = 'cf-status ok';
    } catch {
      const mail = `<a href="mailto:${SITE.email}${SITE.emailCc ? `?cc=${SITE.emailCc}` : ''}">${SITE.email}</a>`;
      status.innerHTML = L(`ההודעה לא נשלחה. אפשר לנסות שוב בעוד כמה דקות, או לכתוב לנו ישירות ל־${mail}.`, `Your message wasn’t sent. Please try again in a few minutes, or write to us at ${mail}.`);
      status.className = 'cf-status err';
    } finally { btn.disabled = false; }
  });
}

// Dekel's festival illustrations sway a little as the page scrolls (each with its own phase)
function illustrationsSway() {
  const ills = [...document.querySelectorAll('.ill')];
  if (!ills.length || reduceMotion) return;
  let queued = false;
  const move = () => {
    queued = false;
    ills.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = (r.top + r.height / 2) / innerHeight;          // 0 top of screen … 1 bottom
      el.style.setProperty('--sway', `${Math.sin(p * 6 + i) * 4}deg`);
      el.style.setProperty('--lift', `${(p - .5) * -24}px`);
    });
  };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(move); } }, { passive: true });
  move();
}

// Accessibility menu: a tab on the side of every page that opens a panel of display settings
function a11yMenu() {
  const save = () => { try { localStorage.setItem(A11Y_KEY, JSON.stringify(a11y)); } catch {} a11yApply(); sync(); };
  const items = [
    ['still', L('עצירת כל התנועה והווידאו', 'Stop all motion and video')],
    ['text', L('הגדלת טקסט', 'Larger text')],
    ['light', L('ניגודיות גבוהה – רקע בהיר', 'High contrast – light')],
    ['dark', L('ניגודיות גבוהה – רקע כהה', 'High contrast – dark')],
    ['mono', L('שחור־לבן (מונוכרום)', 'Black and white (monochrome)')],
    ['links', L('קו תחתון לכל הקישורים', 'Underline all links')],
    ['focus', L('הדגשת מיקוד המקלדת', 'Strong keyboard focus')],
  ];
  const wrap = document.createElement('div');
  wrap.className = 'a11y';
  wrap.innerHTML = `
    <button type="button" class="a11y-tab" aria-expanded="false" aria-controls="a11y-panel">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="4.2" r="2.2"/><path d="M4 8.2c2.7.8 5.3 1.2 8 1.2s5.3-.4 8-1.2l.5 1.9c-2.1.7-4.2 1.1-6.3 1.3V14l2.3 7.2-1.9.6L12.4 15h-.8l-2.2 6.8-1.9-.6L9.8 14v-2.6c-2.1-.2-4.2-.6-6.3-1.3z"/></svg>
      <span class="sr-only">${L('תפריט נגישות', 'Accessibility menu')}</span>
    </button>
    <div class="a11y-panel" id="a11y-panel" role="dialog" aria-label="${L('תפריט נגישות', 'Accessibility menu')}" hidden>
      <div class="a11y-head"><h2>${L('נגישות', 'Accessibility')}</h2>
        <button type="button" class="a11y-x" aria-label="${L('סגירת תפריט הנגישות', 'Close accessibility menu')}">✕</button></div>
      <ul>${items.map(([k, t]) => `<li><button type="button" class="a11y-opt" data-k="${k}" aria-pressed="false"><span class="a11y-check" aria-hidden="true"></span><span class="a11y-label">${t}</span>${k === 'text' ? '<b class="a11y-step" aria-hidden="true"></b>' : ''}</button></li>`).join('')}</ul>
      <div class="a11y-foot">
        <button type="button" class="a11y-reset">${L('איפוס הכל', 'Reset all')}</button>
        <a href="${page('accessibility.html')}">${L('הצהרת נגישות', 'Accessibility statement')}</a>
      </div>
    </div>`;
  document.body.appendChild(wrap);
  const tab = wrap.querySelector('.a11y-tab'), panel = wrap.querySelector('.a11y-panel');
  const on = k => k === 'text' ? !!a11y.text : k === 'light' || k === 'dark' ? a11y.contrast === k : !!a11y[k];
  function sync() {
    wrap.querySelectorAll('.a11y-opt').forEach(b => {
      const k = b.dataset.k; b.setAttribute('aria-pressed', on(k));
      if (k === 'text') b.querySelector('.a11y-step').textContent = a11y.text ? (a11y.text === 2 ? 'A++' : 'A+') : 'A';
    });
  }
  const open = yes => {
    panel.hidden = !yes; tab.setAttribute('aria-expanded', yes);
    if (yes) panel.querySelector('.a11y-opt').focus();
  };
  tab.addEventListener('click', () => open(panel.hidden));
  wrap.querySelector('.a11y-x').addEventListener('click', () => { open(false); tab.focus(); });
  wrap.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { open(false); tab.focus(); } });
  document.addEventListener('click', e => { if (!panel.hidden && !wrap.contains(e.target)) open(false); });
  wrap.querySelectorAll('.a11y-opt').forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.k;
    if (k === 'text') a11y.text = ((a11y.text || 0) + 1) % 3;        // A → A+ → A++ → A
    else if (k === 'light' || k === 'dark') a11y.contrast = a11y.contrast === k ? '' : k;
    else a11y[k] = !a11y[k];
    save();
    if (k === 'still') {                                            // stop (or restart) every moving part
      document.querySelectorAll('video').forEach(v => a11y.still ? v.pause() : v.play().catch(() => {}));
      if (!a11y.still) { try { sessionStorage.setItem('rjf-a11y-open', '1'); } catch {} location.reload(); }
    }
  }));
  wrap.querySelector('.a11y-reset').addEventListener('click', () => {
    const wasStill = a11y.still;
    Object.keys(a11y).forEach(k => delete a11y[k]); save();
    if (wasStill) { try { sessionStorage.setItem('rjf-a11y-open', '1'); } catch {} location.reload(); }
  });
  sync();
  try { if (sessionStorage.getItem('rjf-a11y-open')) { sessionStorage.removeItem('rjf-a11y-open'); open(true); } } catch {}
  if (a11y.still) document.querySelectorAll('video').forEach(v => { v.pause(); v.removeAttribute('autoplay'); });
}

// Hero background video: portrait cut on phones, landscape on wider screens; poster only for reduced motion or data saver.
function heroVideo() {
  const v = document.querySelector('.hero-vid');
  if (!v) return;
  const sides = [...document.querySelectorAll('.hero-side')];
  // wide screens: two side panels, each a loop of artists (left: players, right: voices and more), and a plain terracotta centre;
  // narrower screens: one background video (portrait cut on phones)
  const wide = matchMedia('(min-width: 1024px) and (min-aspect-ratio: 5/4)');
  const portrait = matchMedia('(max-aspect-ratio: 4/5), (max-width: 640px)');
  const saveData = navigator.connection && navigator.connection.saveData;
  const play = el => { if (stilled()) return; el.play().then(() => el.classList.add('playing')).catch(() => {}); };
  const pick = () => {
    const k = wide.matches ? 'sides' : portrait.matches ? 'mobile' : 'desktop';
    if (v.dataset.on === k) return;
    v.dataset.on = k;
    document.querySelector('.hero').classList.toggle('has-sides', k === 'sides');
    if (k === 'sides') {
      v.pause();
      if (reduceMotion || saveData) return;
      sides.forEach(el => {
        if (!el.src) el.src = el.dataset.src + (el.dataset.offset ? '#t=' + el.dataset.offset : '');   // the right loop starts a beat later, so the two sides never cut together
        play(el);
      });
      return;
    }
    sides.forEach(el => el.pause());
    v.poster = v.dataset[k + 'Poster'];
    if (reduceMotion || saveData) return;
    if (!v.src.endsWith(v.dataset[k])) v.src = v.dataset[k];
    play(v);
  };
  pick();
  wide.addEventListener('change', pick);
  portrait.addEventListener('change', pick);
  // pause while the hero is off screen
  new IntersectionObserver(([e]) => {
    const on = v.dataset.on === 'sides' ? sides : [v];
    on.forEach(el => { if (!el.src) return; e.isIntersecting && !stilled() ? el.play().catch(() => {}) : el.pause(); });
  }).observe(document.querySelector('.hero'));
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
  el.innerHTML = SHOWS.filter(s => dayId ? s.day === dayId : ONCE(s)).map(s => `
    <article class="showrow">
      <div class="ph${s.img ? '' : ' noimg'}" ${s.img ? `data-bg="${img(thumbImg(s))}"` : ''}${thumbPos(s)}>${stickers(s)}</div>
      <div>
        <div class="when">${dayId ? `${dayName(dayOf(s.day))} ${dayOf(s.day).date}` : when(s)} <time>${s.time}</time></div>
        <h3>${tr(s, 'title')}</h3>
        <p>${tr(s, 'sub')}</p>
        <div class="venue">${tr(s, 'venue')}</div>
      </div>
      <div class="act">
        ${s.kids && !(s.tags || []).includes('kids20') ? `<div class="free kids">${L('לכל המשפחה', 'For families')}</div><br>` : ''}
        <button type="button" class="btn primary stretch" data-show="${s.id}" aria-haspopup="dialog">${L('לכל הפרטים', 'Full details')}</button>
      </div>
    </article>`).join('');
}

// Workshops hero: a row of every teacher's photo, the first thing on the page
function renderTeacherStrip(el) {
  const fig = ([f, n, r, nEn, rEn]) => `<figure><img src="${img(f.replace(/\.jpe?g$/, '-800.webp'))}" alt="" loading="eager" decoding="async"><figcaption>${EN ? nEn : n}<small>${(EN ? rEn : r).split(' · ')[0]}</small></figcaption></figure>`;
  const set = TEACHERS.map(fig).join('');
  // two identical sets side by side; the track slides by exactly one set, so the loop has no end and no jump
  el.innerHTML = `<div class="t-track">${set}${set.replace(/<figure>/g, '<figure aria-hidden="true">')}</div>`;
}

function renderTeachers(el, asList = true, bios = false) {
  const rows = TEACHERS.map(([f, n, r, nEn, rEn, b, bEn, c, cEn]) => [f, EN ? nEn : n, EN ? rEn : r, EN ? bEn : b, EN ? cEn : c]);
  // role is "instrument · place": the bios show the country in brackets after the name, and the instrument underneath
  const COUNTRY = { 'ניו יורק': 'ארה״ב', 'ברלין': 'גרמניה', 'בריסל': 'בלגיה', 'New York': 'USA', 'Berlin': 'Germany', 'Brussels': 'Belgium' };
  const split = r => { const [inst, place = ''] = r.split(' · '); return [inst, COUNTRY[place] || place]; };
  const ph = f => `<div class="ph${f ? '' : ' nophoto'}"${f ? ` data-bg="${img(f)}"` : ''}></div>`;
  el.innerHTML = asList
    ? rows.map(([f, n, r]) => `<li><i data-bg="${img(f)}"></i><div><b>${n}</b><small>${r}</small></div></li>`).join('')
    : bios
      ? rows.map(([f, n, r, b, c]) => `<article class="tbio"><figure>${ph(f)}${c ? `<figcaption>${L('צילום', 'Photo')}: ${c}</figcaption>` : ''}</figure><div><h3>${n}${split(r)[1] ? ` (${split(r)[1]})` : ''}</h3><span>${split(r)[0]}</span>${b ? `<p>${b}</p>` : ''}</div></article>`).join('')
      : rows.map(([f, n, r]) => `<div class="person">${ph(f)}<b>${n}</b><span>${r}</span></div>`).join('');
}

// 2025 moments in two rows that drift sideways, in opposite directions, as the page scrolls (like indnegev.co.il)
function renderMoments(el) {
  const half = Math.ceil(MOMENTS.length / 2);
  const tile = ([f, cap, capEn, credit]) => `<a href="${page('festival-2025.html')}#gallery" aria-label="${EN ? capEn : cap} – ${L('לגלריה', 'to the gallery')}">
    <img src="${img(f.replace(/\.jpe?g$/, '-800.webp'))}" alt="" loading="lazy" decoding="async"><span>${EN ? capEn : cap}</span>${credit ? `<small class="credit">${L('צילום', 'Photo')}: ${credit}</small>` : ''}</a>`;
  el.innerHTML = [MOMENTS.slice(0, half), MOMENTS.slice(half)].map(row => `<div class="river-row">${row.map(tile).join('')}</div>`).join('');
  const rows = [...el.children];
  if (reduceMotion) { el.classList.add('still'); return; }
  let queued = false;
  const move = () => {
    queued = false;
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const p = ((r.top + r.height / 2) - innerHeight / 2) / ((innerHeight + r.height) / 2);   // 1 entering below … -1 leaving above
    rows.forEach((row, i) => {
      const room = Math.max(0, (row.scrollWidth - el.clientWidth) / 2);
      row.style.setProperty('--x', `${(i ? -1 : 1) * p * room * 0.9}px`);
    });
  };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(move); } }, { passive: true });
  addEventListener('resize', move);
  move();
}

function renderPartners(el) {
  // logos are trimmed to their edges; each gets the same visual area, so wide and tall marks look equally big
  el.innerHTML = PARTNERS.map(([f, alt, altEn]) => `<img class="partner" src="${img(f)}" alt="${EN ? altEn : alt}">`).join('');
  el.querySelectorAll('img').forEach(im => {
    const fit = () => { im.style.height = `calc(var(--logo-area) / ${Math.sqrt(im.naturalWidth / im.naturalHeight).toFixed(3)})`; };
    im.complete && im.naturalWidth ? fit() : im.addEventListener('load', fit, { once: true });
  });
}

function renderThemePasses(el) {
  el.innerHTML = `<span>${L('פסים לפי נושאים:', 'Themed passes:')}</span>` + THEME_PASSES.map(([n, slug]) => `<a href="${T(slug)}" ${ext}>${n}</a>`).join('');
}

// ---------- line-up as a cloud of names, coloured by day ----------
function renderCloud(el) {
  const count = id => SHOWS.filter(s => id ? s.day === id : ONCE(s)).length;
  const chip = (id, label) => `<button type="button" class="${id ? 'd-' + id : 'all'}${id ? '' : ' on'}" data-day="${id}" aria-pressed="${!id}">
    ${id ? '<i aria-hidden="true"></i>' : ''}<span>${label}</span><b>${count(id)}</b></button>`;
  el.innerHTML = `
    <div class="cloud-filter" role="group" aria-label="${L('סינון לפי יום', 'Filter by day')}">
      ${chip('', L('כל הימים', 'All days'))}${DAYS.map(d => chip(d.id, `${dayName(d)} ${d.date}`)).join('')}
    </div>
    <ul class="cloud">${SHOWS.filter(ONCE).map(s => `
      <li data-day="${s.every ? DAYS.map(d => d.id).join(' ') : s.day}" style="--i:${SHOWS.indexOf(s)}"><button type="button" class="pill d-${s.day}" data-show="${s.id}" aria-haspopup="dialog">
        <span class="n">${tr(s, 'title')}</span>
        <span class="sr-only">${when(s)} · ${s.time} · ${tr(s, 'venue')}</span>
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
    items.forEach(li => { li.hidden = !!b.dataset.day && !li.dataset.day.split(' ').includes(b.dataset.day); });
    if (reduceMotion) return;
    // the names that stay glide to their new places; names that return grow back in
    items.filter(li => !li.hidden).forEach(li => {
      const a = before.get(li), z = li.getBoundingClientRect();
      li.animate(a ? [{ transform: `translate(${a.left - z.left}px, ${a.top - z.top}px)` }, { transform: 'none' }]
                   : [{ opacity: 0, transform: 'scale(.7)' }, { opacity: 1, transform: 'none' }],
        { duration: 420, easing: 'cubic-bezier(.23, 1, .32, 1)' });
    });
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
          <button type="button" class="tt-open" data-show="${s.id}" aria-haspopup="dialog"><b>${tr(s, 'title')}</b><small>${hhmm(start)}–${hhmm(end)}</small></button>
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
  // a star set from a show's dialog
  addEventListener('rjf-favs', () => { favs.clear(); readFavs().forEach(k => favs.add(k)); draw(); });
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

// ---------- one page per show: a dialog with the full text, line-up and video ----------
// Every element with data-show="<id>" opens it. Each show has its own address: lineup.html#<id>
const showById = id => SHOWS.find(s => s.id === id);
const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const showUrl = s => location.origin + page('lineup.html') + '#' + s.id;
// "Add to Google Calendar" link for a show: Israel local time, length from dur (90 min if unknown)
const calUrl = s => {
  const d = dayOf(s.day), [h, m] = s.time.split(':').map(Number), mins = s.dur || 90;
  const end = new Date(Date.UTC(2000, 0, 1, h, m + mins));
  const ymd = d.iso.replace(/-/g, ''), pad = n => String(n).padStart(2, '0');
  const endDay = end.getUTCDate() > 1 ? new Date(Date.parse(d.iso) + 864e5).toISOString().slice(0, 10).replace(/-/g, '') : ymd;
  const dates = `${ymd}T${pad(h)}${pad(m)}00/${endDay}T${pad(end.getUTCHours())}${pad(end.getUTCMinutes())}00`;
  const q = new URLSearchParams({ action: 'TEMPLATE', text: `${tr(s, 'title')} – ${L('פסטיבל הג׳אז רעננה', 'Raanana Jazz Festival')}`, dates, ctz: 'Asia/Jerusalem',
    details: `${tr(s, 'sub') ? tr(s, 'sub') + '\n\n' : ''}${showUrl(s)}`, location: `${tr(s, 'venue')}, ${L('מרכז פיס למוזיקה רעננה', 'Raanana Pais Music Center')}` });
  return 'https://calendar.google.com/calendar/render?' + q;
};
const ytThumb = id => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
let showBox = null;

// "name – role · name – role" → rows; "label: name" and plain notes are kept as they are
function castRows(line) {
  return line.split(' · ').map(p => {
    const k = p.lastIndexOf(' – ');
    return k > 0 ? `<li><b>${esc(p.slice(0, k))}</b><span>${esc(p.slice(k + 3))}</span></li>` : `<li><b>${esc(p)}</b></li>`;
  }).join('');
}

function videoBlock(s) {
  const yt = s.yt || [];
  if (!yt.length && !s.drive) return '';
  const main = s.drive
    ? `<button type="button" class="sb-play" data-drive="${s.drive}" ${s.img ? `style="background-image:url(${img(s.img.replace(/\.jpe?g$/, '-800.webp'))})"` : ''} aria-label="${L('ניגון הסרטון', 'Play the video')}"><i aria-hidden="true"></i></button>`
    : `<button type="button" class="sb-play" data-yt="${yt[0]}" style="background-image:url(${ytThumb(yt[0])})" aria-label="${L('ניגון הסרטון', 'Play the video')}"><i aria-hidden="true"></i></button>`;
  const more = (s.drive ? yt : yt.slice(1)).map((id, k) =>
    `<button type="button" class="sb-thumb" data-yt="${id}" style="background-image:url(${ytThumb(id)})" aria-label="${L('סרטון נוסף', 'Another video')} ${k + 1}"></button>`).join('');
  return `<section class="sb-sec"><h3>${L('וידאו', 'Video')}</h3><div class="sb-video">${main}</div>
    ${more ? `<div class="sb-more">${more}</div>` : ''}
    ${s.playlist ? `<a class="sb-link" href="https://www.youtube.com/playlist?list=${s.playlist}" ${ext}>${L('לעוד הופעות ביוטיוב', 'More live videos on YouTube')} ${ARROW}</a>` : ''}</section>`;
}

function showHtml(s) {
  const LIST = SHOWS.filter(x => ONCE(x) || x === s), d = dayOf(s.day), i = LIST.indexOf(s), prev = LIST[i - 1], next = LIST[i + 1];
  const on = readFavs().has(showKey(s));
  const list = k => (EN && s[k + '_en']) || s[k] || [];
  const quotes = list('quotes').map(q => {
    const m = q.match(/^(.*[”"])\s*–\s*(.+)$/);
    return m ? `<blockquote><p>${esc(m[1])}</p><cite>${esc(m[2])}</cite></blockquote>` : `<blockquote><p>${esc(q)}</p></blockquote>`;
  }).join('');
  const tickets = s.slug
    ? `<a class="btn primary" href="${T(s.slug)}" ${ext}>${s.free ? L('לכרטיס חינם', 'Free ticket') : L('לכרטיסים', 'Tickets')} ${ARROW}</a>`
    : s.free ? '' : `<span class="sb-soon">${L('הכרטיסים יעלו למכירה בקרוב', 'Tickets on sale soon')}</span>`;
  return `
    <button type="button" class="sb-close" aria-label="${L('סגירה', 'Close')}">✕</button>
    <figure class="sb-ph${s.img ? '' : ' noimg'}${s.img2 ? (s.guest ? ' has-guest' : ' two') : ''} d-${s.day}">
      ${s.img ? `<div class="sb-shot"><img src="${img(s.img.replace(/\.jpe?g$/, '-1600.webp'))}" alt="" decoding="async"${s.pos ? ` style="object-position:${s.pos}"` : ''}>${stickers(s)}
        ${s.credit ? `<figcaption>${L('צילום', 'Photo')}: ${esc(tr(s, 'credit'))}</figcaption>` : ''}</div>` : '<span class="sb-ph-logo" aria-hidden="true"></span>'}
      ${s.img2 && s.guest ? `<div class="sb-guest"><img src="${img(s.img2.replace(/\.jpe?g$/, '-800.webp'))}" alt="" decoding="async"${s.pos2 ? ` style="object-position:${s.pos2}"` : ''}>
        <span>${esc(EN ? s.guest.en : s.guest.he)}</span></div>${s.credit2 ? `<figcaption class="sb-cred2">${esc(tr(s, 'credit2'))}</figcaption>` : ''}`
      : s.img2 ? `<div class="sb-shot"><img src="${img(s.img2.replace(/\.jpe?g$/, '-800.webp'))}" alt="" decoding="async"${s.pos2 ? ` style="object-position:${s.pos2}"` : ''}>
        ${s.credit2 ? `<figcaption>${esc(tr(s, 'credit2'))}</figcaption>` : ''}</div>` : ''}
    </figure>
    <div class="sb-body">
      <p class="sb-meta d-${s.day}"><i aria-hidden="true"></i>${s.every || s.repeat ? L('בכל לילה', 'Every night') : `${dayName(d)} ${d.date}`} · <time>${s.time}</time> · ${venueLink(s)}${s.dur ? ` · ${s.dur} ${L('דק׳', 'min')}` : ''}</p>
      <h2 id="sb-title"><bdi>${esc(tr(s, 'title'))}</bdi></h2>
      ${tr(s, 'sub') ? `<p class="sb-sub">${esc(tr(s, 'sub'))}</p>` : ''}
      <div class="sb-tags">${s.kids && !(s.tags || []).includes('kids20') ? kidsTag : ''}</div>
      <div class="sb-actions">
        ${tickets}
        <button type="button" class="sb-fav" data-key="${showKey(s)}" aria-pressed="${on}">${on ? '★' : '☆'} ${L('לליינאפ שלי', 'My line-up')}</button>
        <button type="button" class="sb-share">${L('שיתוף', 'Share')}</button>
        <a class="sb-cal" href="${esc(calUrl(s))}" target="_blank" rel="noopener">${L('הוספה ליומן', 'Add to calendar')}</a>
      </div>
      ${list('about').length ? `<div class="sb-about">${list('about').map(p => `<p>${esc(p)}</p>`).join('')}${s.link ? `<p class="sb-link"><a class="g-text" href="${esc(s.link)}" target="_blank" rel="noopener">${esc(tr(s, 'link_label'))} ${ARROW}</a></p>` : ''}</div>` : `<p class="sb-about">${L('פרטים נוספים יפורסמו בקרוב.', 'More details coming soon.')}</p>`}
      ${quotes}
      ${list('cast').length ? `<section class="sb-sec"><h3>${s.film ? L('על הסרט', 'About the film') : L('על הבמה', 'On stage')}</h3><ul class="sb-cast">${list('cast').map(castRows).join('')}</ul></section>` : ''}
      ${videoBlock(s)}
      <nav class="sb-nav" aria-label="${L('הופעות נוספות', 'More shows')}">
        ${prev ? `<button type="button" class="prev" data-show="${prev.id}"><small>${EN ? '←' : '→'} ${L('הקודם', 'Previous')}</small><bdi>${esc(tr(prev, 'title'))}</bdi></button>` : '<span></span>'}
        ${next ? `<button type="button" class="next" data-show="${next.id}"><small>${L('הבא', 'Next')} ${EN ? '→' : '←'}</small><bdi>${esc(tr(next, 'title'))}</bdi></button>` : '<span></span>'}
      </nav>
    </div>`;
}

// The stage name in a show's dialog links to that stage on the building map.
function venueLink(s) {
  const v = VENUES.find(x => x.name === s.venue);
  return v && v.map ? `<a class="sb-venue" href="${page('venue.html')}#map-${v.id}">${tr(s, 'venue')}</a>` : tr(s, 'venue');
}

function openShow(id) {
  const s = showById(id);
  if (!s) return;
  if (!showBox) {
    showBox = document.createElement('dialog');
    showBox.className = 'show-box';
    showBox.setAttribute('aria-labelledby', 'sb-title');
    showBox.innerHTML = '<span class="sb-grab" aria-hidden="true"></span><div class="sb-card"></div>';
    document.body.appendChild(showBox);
    showBox.addEventListener('cancel', e => { e.preventDefault(); closeShow(); });   // Esc
    swipeToClose(showBox);
    showBox.addEventListener('click', e => {
      if (e.target === showBox) return closeShow();               // a click on the dimmed backdrop
      if (e.target.closest('.sb-close')) return closeShow();
      if (e.target.closest('.sb-venue')) closeShow();             // the link then goes to the stage on the map
      const play = e.target.closest('.sb-play, .sb-thumb');
      if (play) {
        const box = showBox.querySelector('.sb-video');
        box.innerHTML = play.dataset.drive
          ? `<iframe src="https://drive.google.com/file/d/${play.dataset.drive}/preview" allow="autoplay; fullscreen" allowfullscreen title="${L('וידאו', 'Video')}"></iframe>`
          : `<iframe src="https://www.youtube-nocookie.com/embed/${play.dataset.yt}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen title="${L('וידאו', 'Video')}"></iframe>`;
        return;
      }
      const fav = e.target.closest('.sb-fav');
      if (fav) {
        const f = readFavs(), k = fav.dataset.key;
        f.has(k) ? f.delete(k) : f.add(k);
        saveFavs(f);
        fav.setAttribute('aria-pressed', f.has(k));
        fav.textContent = `${f.has(k) ? '★' : '☆'} ${L('לליינאפ שלי', 'My line-up')}`;
        dispatchEvent(new Event('rjf-favs'));
        return;
      }
      const share = e.target.closest('.sb-share');
      if (share) {
        const s = showById(showBox.dataset.id), url = showUrl(s);
        if (navigator.share) navigator.share({ title: tr(s, 'title'), url }).catch(() => {});
        else navigator.clipboard.writeText(url).then(() => { share.textContent = L('הקישור הועתק', 'Link copied'); });
      }
    });
    showBox.addEventListener('close', () => {
      showBox.querySelector('.sb-card').innerHTML = '';           // stops a playing video
      if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    });
  }
  const card = showBox.querySelector('.sb-card');
  showBox.dataset.id = s.id;
  card.innerHTML = showHtml(s);
  card.scrollTop = 0;
  if (location.hash !== '#' + s.id) history.replaceState(null, '', '#' + s.id);
  if (!showBox.open) { showBox.classList.remove('settle', 'closing'); showBox.showModal(); }
  else if (!reduceMotion) card.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 240, easing: 'cubic-bezier(.23, 1, .32, 1)' });
  showBox.querySelector('.sb-close').focus({ preventScroll: true });
}

// close with a short animation (a slide down on phones), then really close
function closeShow() {
  if (!showBox || !showBox.open || showBox.classList.contains('closing')) return;
  if (reduceMotion) return showBox.close();
  showBox.classList.remove('settle');
  showBox.classList.add('closing');
  const done = () => { showBox.classList.remove('closing'); showBox.style.removeProperty('--drag'); showBox.style.transform = ''; showBox.close(); };
  showBox.addEventListener('animationend', done, { once: true });
  setTimeout(() => showBox.classList.contains('closing') && done(), 500);   // in case the animation never ends
}

// phones: drag the sheet down from its top to close it
function swipeToClose(box) {
  const card = box.querySelector('.sb-card');
  let y0 = null, dy = 0, t0 = 0;
  box.addEventListener('touchstart', e => {
    if (!matchMedia('(max-width: 700px)').matches || card.scrollTop > 0) { y0 = null; return; }
    y0 = e.touches[0].clientY; dy = 0; t0 = Date.now();
  }, { passive: true });
  box.addEventListener('touchmove', e => {
    if (y0 === null) return;
    dy = Math.max(0, e.touches[0].clientY - y0);
    if (dy > 0 && card.scrollTop <= 0) {
      if (e.cancelable) e.preventDefault();                       // hold the page still while the sheet follows the finger
      box.classList.add('dragging');
      box.style.transform = `translateY(${dy}px)`;
    }
  }, { passive: false });
  box.addEventListener('touchend', () => {
    if (y0 === null) return;
    y0 = null;
    box.classList.remove('dragging');
    const fast = dy / Math.max(1, Date.now() - t0) > .5;           // a quick flick closes too
    if (dy > 120 || (fast && dy > 30)) { box.style.setProperty('--drag', dy + 'px'); box.style.transform = ''; closeShow(); }
    else if (dy) { box.classList.add('settle'); box.style.transform = ''; }
  });
}

const SHOW_PHOTO = '.ph, .sp-slide, .dy-th';
const SHOW_ITEM = '.showrow, .card, .lead, .others li, .sp-slide, .dy-list li';
function showDialogs() {
  document.addEventListener('click', e => {
    let t = e.target.closest('[data-show]');
    // a click on a show's photo opens it too: use the show button that sits in the same card/row/slide
    if (!t && e.target.closest(SHOW_PHOTO) && !e.target.closest('a, button')) t = e.target.closest(SHOW_ITEM)?.querySelector('[data-show]');
    if (!t || (showBox && showBox.contains(t) && !t.closest('.sb-nav'))) return;
    e.preventDefault();
    openShow(t.dataset.show);
  });
  const fromHash = () => { const id = decodeURIComponent(location.hash.slice(1)); if (showById(id)) openShow(id); };
  addEventListener('hashchange', fromHash);
  fromHash();
}

buildChrome();
document.querySelectorAll('[data-render]').forEach(el => {
  const fn = { schedule: renderSchedule, cards: renderCards, featured: renderFeatured, stages: renderStages, spotlight: renderSpotlight, days: renderDays, free: renderFree, now: nowOnStage, showlist: renderShowList, teachers: renderTeachers,
    people: el => renderTeachers(el, false), 'people-bios': el => renderTeachers(el, false, true), 'teacher-strip': renderTeacherStrip, moments: renderMoments, partners: renderPartners, themes: renderThemePasses,
    cloud: renderCloud, timetable: renderTimetable, venuemap: renderVenueMap }[el.dataset.render];
  fn && fn(el);
});
document.querySelectorAll('[data-href]').forEach(a => {
  const v = a.dataset.href;
  if (v === 'form' && !SITE.workshopForm) {            // sign-up link not out yet
    a.removeAttribute('href'); a.removeAttribute('target'); a.setAttribute('aria-disabled', 'true'); a.classList.add('is-soon');
    a.textContent = L('קישור להרשמה – בקרוב', 'Sign-up link – coming soon');
    return;
  }
  a.href = v === 'tickets' ? SITE.tickets : v === 'daypass' ? (SITE.dayPass ? T(SITE.dayPass) : SITE.tickets) : v === 'fullpass' ? (SITE.fullPass ? T(SITE.fullPass) : SITE.tickets) : v === 'form' ? SITE.workshopForm : v === 'program' ? SITE.program : '#';
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
  '.person', '.tbio', '.stat', '.stage', '.free-in', '.tix-in > *', '.stats-h', '.prose > *', '.sec-h', '.sec-h + p', '.daytabs', '.cta-band > *', '.map',
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
  if (/tickets(\.html)?$/.test(location.pathname)) return;
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
  a11yMenu();
  heroVideo();
  illustrationsSway();
  factsMotion();
  lazyBackgrounds();
  scrollReveal();
  countdown();
  stickyCta();
  guideTabs();
  smoothDetails();
  scrollRing();
  showDialogs();
});

// ---------- photo gallery: small thumbnails in batches, a larger view on click ----------
// GALLERY_2025 (assets/gallery-2025.js) lists [width, height] per photo; files are images/gallery-2025/NNN-480.webp and NNN-1200.webp
function renderGallery(el, list, dir) {
  if (!el || !list) return;
  // mix the album: photos are stored in shooting order, so neighbours are near-duplicates of the same show.
  // Step through it with a stride near n/φ (coprime to n) – a fixed order that spreads every show across the whole gallery.
  const n = list.length, gcd = (a, b) => b ? gcd(b, a % b) : a;
  let step = Math.round(n * 0.618); while (gcd(step, n) !== 1) step++;
  const order = Array.from({ length: n }, (_, k) => (k * step) % n);
  list = order.map(o => list[o]);
  const BATCH = 48, file = (i, w) => `${ROOT}/images/${dir}/${String(order[i] + 1).padStart(3, '0')}-${w}.webp`;
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
    <button type="button" class="gal-prev" aria-label="${L('התמונה הקודמת', 'Previous photo')}"><span dir="ltr">${EN ? '‹' : '›'}</span></button>
    <button type="button" class="gal-next" aria-label="${L('התמונה הבאה', 'Next photo')}"><span dir="ltr">${EN ? '›' : '‹'}</span></button>`;
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
