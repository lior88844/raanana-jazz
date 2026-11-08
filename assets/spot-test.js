// Temporary: three spotlight designs to choose from (spot-options.html). Every design shows the whole photo.
const SIZES = {"2026-marsh.jpg":[2400,1600],"2026-paquito-film.jpg":[555,356],"2026-ella.jpg":[2000,1285],"2026-ny-junction-5.jpg":[1600,900],"2026-magen-renert.jpg":[2000,1333],"2026-chichportiche-3.jpg":[1600,900],"2026-paquito.jpg":[1920,1280],"2026-jam3-thu.jpg":[1200,800],"2026-rani-golan.jpg":[1280,854],"2026-swing-lesson.jpg":[800,533],"2026-preminger.jpg":[2000,1336],"2026-friedman-host7.jpg":[1600,900],"2026-tenors-4.jpg":[1600,1000],"2026-avishai.jpg":[2000,1446],"2026-cyrille-show.jpg":[2000,1333],"2026-raz-chen.jpg":[1746,1745],"2026-yaldojazz.jpg":[2000,1177],"2026-workshops.jpg":[1200,800],"2026-big-band.jpg":[1600,1066],"2026-capivara.jpg":[2000,1643],"2026-zeiner-ravitz.jpg":[2000,1333],"2026-adis-ken-split.jpg":[1600,900]};
const SPOT = SHOWS.filter(ONCE).filter(s => s.img);
const pic = (s, w = 1600) => img(s.img.replace(/\.jpe?g$/, `-${w}.webp`));
const ratio = s => { const z = SIZES[s.img]; return z ? z[0] / z[1] : 1.5; };
const meta = s => `${when(s)} · <bdi>${s.time}</bdi> · ${tr(s, 'venue')}`;
const tags = s => { const k = (s.free ? ['free'] : []).concat(s.tags || []); return k.map(x => `<span class="stk stk-${x}">${L(...STICKERS[x])}</span>`).join(''); };
const nav = n => `<div class="sp-ctl"><button type="button" class="sp-arr" data-step="-1" aria-label="${L('הקודם', 'Previous')}">${EN ? '←' : '→'}</button>
  <span class="o-count" aria-live="polite"></span><button type="button" class="sp-arr" data-step="1" aria-label="${L('הבא', 'Next')}">${EN ? '→' : '←'}</button></div>`;
function cycler(el, n, show, every = 5000) {
  let i = 0, hold = false;
  const go = k => { i = (k + n) % n; show(i); el.querySelector('.o-count').textContent = `${i + 1} / ${n}`; };
  el.querySelectorAll('.sp-arr').forEach(b => b.addEventListener('click', () => go(i + +b.dataset.step)));
  el.addEventListener('mouseenter', () => { hold = true; }); el.addEventListener('mouseleave', () => { hold = false; });
  if (!reduceMotion) setInterval(() => { if (!hold && !stilled()) go(i + 1); }, every);
  go(0);
}

// 1 · split card: photo whole on one side, a panel in the day colour on the other
function renderSpotSplit(el) {
  el.innerHTML = `<div class="o1">${SPOT.map((s, i) => `
    <article class="o1-card d-${s.day}${i ? '' : ' on'}" aria-hidden="${!!i}">
      <div class="o1-ph"><img src="${pic(s)}" alt="" loading="${i < 2 ? 'eager' : 'lazy'}"></div>
      <div class="o1-in">
        <div class="o1-tags">${tags(s)}</div>
        <p class="o1-meta">${meta(s)}</p>
        <h3><bdi>${tr(s, 'title')}</bdi></h3>
        ${tr(s, 'sub') ? `<p class="o1-sub">${tr(s, 'sub')}</p>` : ''}
        <button type="button" class="btn primary" data-show="${s.id}" aria-haspopup="dialog">${L('לכל הפרטים', 'Full details')} ${ARROW}</button>
      </div>
    </article>`).join('')}</div>${nav()}`;
  const cards = [...el.querySelectorAll('.o1-card')];
  cycler(el, cards.length, i => cards.forEach((c, j) => { c.classList.toggle('on', j === i); c.setAttribute('aria-hidden', j !== i); }));
}

// 2 · photo strip: every photo at its own shape, drifting slowly; drag or swipe it
function renderSpotStrip(el) {
  const row = SPOT.map(s => `<button type="button" class="o2-it d-${s.day}" data-show="${s.id}" aria-haspopup="dialog" style="--r:${ratio(s).toFixed(3)}">
      <span class="o2-ph"><img src="${pic(s, 800)}" alt="" loading="lazy">${s.free || s.tags ? `<span class="stk-wrap">${tags(s)}</span>` : ''}</span>
      <small>${meta(s)}</small><b><bdi>${tr(s, 'title')}</bdi></b></button>`).join('');
  el.innerHTML = `<div class="o2"><div class="o2-track">${row}</div></div>`;
  const box = el.querySelector('.o2');
  let hold = false, last = 0;
  ['mouseenter', 'touchstart', 'focusin'].forEach(e => box.addEventListener(e, () => { hold = true; }, { passive: true }));
  ['mouseleave', 'touchend', 'focusout'].forEach(e => box.addEventListener(e, () => { hold = false; }, { passive: true }));
  if (reduceMotion) return;
  const dir = document.dir === 'rtl' ? -1 : 1;
  const step = t => { if (!hold && !stilled() && last) {
      box.scrollLeft += dir * (t - last) * 0.03;
      const max = box.scrollWidth - box.clientWidth;
      if (Math.abs(box.scrollLeft) >= max - 1) box.scrollLeft = 0;
    } last = t; requestAnimationFrame(step); };
  requestAnimationFrame(step);
}

// 3 · polaroid deck: tilted stack, the front photo whole in a white frame
function renderSpotDeck(el) {
  el.innerHTML = `<div class="o3">${SPOT.map((s, i) => `
    <figure class="o3-card d-${s.day}" style="--r:${ratio(s).toFixed(3)};--t:${((i * 37) % 9) - 4}deg" data-i="${i}">
      <div class="o3-ph"><img src="${pic(s)}" alt="" loading="${i < 3 ? 'eager' : 'lazy'}">${s.free || s.tags ? `<span class="stk-wrap">${tags(s)}</span>` : ''}</div>
      <figcaption><small>${meta(s)}</small><button type="button" data-show="${s.id}" aria-haspopup="dialog"><bdi>${tr(s, 'title')}</bdi></button></figcaption>
    </figure>`).join('')}</div>${nav()}`;
  const cards = [...el.querySelectorAll('.o3-card')], n = cards.length;
  cycler(el, n, i => cards.forEach((c, j) => {
    const k = (j - i + n) % n;                 // 0 = front
    c.style.zIndex = n - k;
    c.dataset.k = k < 4 ? k : 'x';
    c.setAttribute('aria-hidden', k !== 0);
  }), 4500);
}

document.querySelectorAll('[data-spot]').forEach(el => ({ split: renderSpotSplit, strip: renderSpotStrip, deck: renderSpotDeck })[el.dataset.spot](el));
