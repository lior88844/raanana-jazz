// Temporary: five ways to show the 2026 line-up on the home page (lineup-options.html). Delete once Lior picks one.
(() => {
  const list = SHOWS.filter(s => !s.jam);
  const byDay = d => list.filter(s => s.day === d).sort((a, b) => a.time.localeCompare(b.time));
  const ordered = DAYS.flatMap(d => byDay(d.id));
  const photo = (s, size = 800) => s.img ? img(s.img.replace(/\.jpe?g$/, `-${size}.webp`)) : '';
  const when = s => `${dayName(dayOf(s.day))} ${dayOf(s.day).date} · ${s.time}`;
  const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pic = s => s.img
    ? `<img src="${photo(s)}" alt="" loading="lazy" decoding="async"${s.pos ? ` style="object-position:${s.pos}"` : ''}>`
    : `<span class="o-logo d-${s.day}" aria-hidden="true"></span>`;
  const btn = (s, inner, cls = '') => `<button type="button" class="${cls}" data-show="${s.id}" aria-haspopup="dialog">${inner}</button>`;

  const css = `
  .opt-intro { max-width: 1180px; margin: 0 auto; padding: 60px 40px 10px; }
  .opt-intro h1 { font-family: var(--brush); font-size: var(--fs-1); line-height: 1; }
  .opt-intro p { font-size: var(--fs-body); margin-top: 12px; }
  .opt-nav { display: flex; gap: 10px; margin-top: 20px; }
  .opt-nav a { width: 44px; height: 44px; display: grid; place-items: center; border-radius: 50%; background: var(--accent); font-family: var(--latin); font-size: 22px; }
  .opt { padding: 90px 0 30px; border-top: 2px dashed var(--rule); margin-top: 60px; }
  .opt-h { max-width: 1180px; margin: 0 auto 36px; padding: 0 40px; display: flex; gap: 18px; align-items: flex-start; }
  .opt-n { flex: none; width: 64px; height: 64px; border-radius: 50%; background: var(--field); color: var(--white); display: grid; place-items: center; font-family: var(--latin); font-size: 36px; }
  .opt-h h2 { font-family: var(--brush); font-size: var(--fs-1); line-height: 1; }
  .opt-h p { font-size: var(--fs-meta); margin-top: 8px; max-width: 640px; }
  .o-logo { display: block; width: 100%; height: 100%; background: var(--day) url(${img('logo-nodots.png')}) center / 55% no-repeat; }
  .opt button { border: 0; background: none; padding: 0; color: inherit; font: inherit; cursor: pointer; text-align: inherit; }

  /* 1 – names */
  .o1 { max-width: 1180px; margin: 0 auto; padding: 0 40px; font-family: var(--display); font-weight: 800; font-size: clamp(26px, 3.4vw, 50px); line-height: 1.2; }
  .o1 .nm { display: inline; opacity: .18; transition: opacity .5s ease, color .3s ease; }
  .o1 .nm.lit { opacity: 1; }
  .o1 .nm:hover { color: var(--field); }
  .o1 .dot { display: inline-block; width: .3em; height: .3em; border-radius: 50%; background: var(--day); margin: 0 .3em; vertical-align: .18em; }
  .o1-float { position: fixed; z-index: 50; width: 260px; aspect-ratio: 3/2; border-radius: 12px; overflow: hidden; pointer-events: none; opacity: 0; transform: scale(.85) rotate(-4deg);
    transition: opacity .25s ease, transform .35s var(--ease-out); box-shadow: 0 20px 40px -20px rgba(58,26,20,.6); }
  .o1-float.on { opacity: 1; transform: scale(1) rotate(-2deg); }
  .o1-float img, .o1-float .o-logo { width: 100%; height: 100%; object-fit: cover; }

  /* 2 – grid */
  .o2 { max-width: 1180px; margin: 0 auto; padding: 0 40px; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 14px; }
  .o2 .tile { display: block; text-align: start; opacity: 0; transform: translateY(30px); transition: opacity .6s ease, transform .7s var(--ease-out); transition-delay: var(--d); }
  .o2.in .tile { opacity: 1; transform: none; }
  .o2 .ph { display: block; aspect-ratio: 1; border-radius: 12px; overflow: hidden; background: var(--dark); }
  .o2 .ph img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.05); transition: filter .5s ease, transform .6s var(--ease-out); }
  .o2 .ph .o-logo { filter: grayscale(1); transition: filter .5s ease; }
  .o2 .tile:hover img, .o2 .tile.hot img, .o2 .tile:hover .o-logo, .o2 .tile.hot .o-logo { filter: none; }
  .o2 .tile:hover img { transform: scale(1.05); }
  .o2 b { display: block; margin-top: 10px; font-family: var(--display); font-weight: 800; font-size: var(--fs-meta); line-height: 1.25; }
  .o2 small { display: block; margin-top: 3px; font-size: var(--fs-small); color: var(--red-ink); font-weight: 600; }
  @media (max-width: 900px) { .o2 { grid-template-columns: repeat(2, minmax(0, 1fr)); padding: 0 16px; } }

  /* 3 – days */
  .o3 { max-width: 900px; margin: 0 auto; padding: 0 40px; }
  .o3-tabs { display: flex; gap: 8px; }
  .o3-tabs button { flex: 1; padding: 14px 10px; border-radius: 12px 12px 0 0; background: var(--day); opacity: .45; font-family: var(--display); font-weight: 800; font-size: var(--fs-body); text-align: center; transition: opacity .3s ease; }
  .o3-tabs button[aria-selected="true"] { opacity: 1; }
  .o3-tabs b { font-family: var(--latin); font-weight: 400; margin-inline-start: 6px; }
  .o3-panel { background: var(--day); border-radius: 0 0 14px 14px; padding: 10px 24px 18px; overflow: hidden; transition: background-color .4s ease; }
  .o3-list { list-style: none; padding: 0; margin: 0; }
  .o3-list.enter-l { animation: o3inL .5s var(--ease-out) both; } .o3-list.enter-r { animation: o3inR .5s var(--ease-out) both; }
  @keyframes o3inL { from { opacity: 0; transform: translateX(-60px); } } @keyframes o3inR { from { opacity: 0; transform: translateX(60px); } }
  .o3-list li { display: grid; grid-template-columns: 64px 56px 1fr; gap: 16px; align-items: center; padding: 12px 0; border-bottom: 1px dashed rgba(58,26,20,.3); }
  .o3-list li:last-child { border-bottom: 0; }
  .o3-list time { font-family: var(--latin); font-size: 22px; direction: ltr; text-align: start; }
  .o3-list .th { width: 56px; height: 56px; border-radius: 50%; overflow: hidden; background: var(--dark); }
  .o3-list .th img { width: 100%; height: 100%; object-fit: cover; }
  .o3-list b { display: block; font-family: var(--display); font-weight: 800; font-size: var(--fs-body); line-height: 1.25; }
  .o3-list small { display: block; font-size: var(--fs-small); font-weight: 600; margin-top: 2px; }
  .o3-list button:hover b { text-decoration: underline 2px; text-underline-offset: 4px; }
  @media (max-width: 700px) { .o3 { padding: 0 16px; } .o3-list li { grid-template-columns: 54px 46px 1fr; gap: 10px; } .o3-list .th { width: 46px; height: 46px; } .o3-panel { padding: 6px 14px 14px; } .o3-tabs button { font-size: var(--fs-meta); } }

  /* 4 – spotlight */
  .o4 { max-width: 1180px; margin: 0 auto; padding: 0 40px; }
  .o4-stage { position: relative; aspect-ratio: 16 / 7; border-radius: 18px; overflow: hidden; background: var(--dark); color: var(--white); }
  .o4-slide { position: absolute; inset: 0; opacity: 0; transition: opacity .9s ease; }
  .o4-slide.on { opacity: 1; }
  .o4-slide img, .o4-slide .o-logo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .o4-slide.on img { animation: o4kb 6s linear both; }
  @keyframes o4kb { from { transform: scale(1.02); } to { transform: scale(1.12); } }
  .o4-slide::after { content: ""; position: absolute; inset: 0; background: linear-gradient(transparent 35%, rgba(58,26,20,.85)); }
  .o4-cap { position: absolute; inset-inline: 40px; bottom: 34px; z-index: 2; }
  .o4-cap small { font-family: var(--display); font-weight: 700; font-size: var(--fs-meta); color: var(--accent); }
  .o4-cap button { display: block; font-family: var(--display); font-weight: 900; font-size: clamp(30px, 4vw, 58px); line-height: 1.05; margin-top: 6px; }
  .o4-slide.on .o4-cap { animation: o4up .8s var(--ease-out) both .2s; }
  @keyframes o4up { from { opacity: 0; transform: translateY(24px); } }
  .o4-ctl { display: flex; align-items: center; gap: 14px; margin-top: 16px; }
  .o4-ctl .arr { width: 44px; height: 44px; border-radius: 50%; background: var(--accent); font-size: 20px; display: grid; place-items: center; }
  .o4-dots { display: flex; flex-wrap: wrap; gap: 6px; }
  .o4-dots i { width: 9px; height: 9px; border-radius: 50%; background: var(--rule); transition: background .3s, transform .3s; }
  .o4-dots i.on { background: var(--field); transform: scale(1.35); }
  @media (max-width: 700px) { .o4 { padding: 0 16px; } .o4-stage { aspect-ratio: 4 / 5; } .o4-cap { inset-inline: 20px; bottom: 22px; } }

  /* 5 – postcards */
  .o5 { max-width: 1240px; margin: 0 auto; padding: 20px 30px 40px; display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }
  .o5 .card { width: 200px; background: var(--white); padding: 10px 10px 14px; border-radius: 6px; box-shadow: 0 10px 24px -14px rgba(58,26,20,.55), 0 1px 2px rgba(58,26,20,.15);
    transform: translate(var(--x), var(--y)) rotate(var(--r)); transition: transform .5s var(--ease-out), box-shadow .5s; text-align: start; position: relative; }
  .o5.pre .card { opacity: 0; transform: translate(var(--x), 160px) rotate(calc(var(--r) * 3)); }
  .o5.go .card { opacity: 1; transition: opacity .5s ease var(--d), transform .9s cubic-bezier(.2,.9,.25,1.12) var(--d); }
  .o5 .card:hover { transform: translate(var(--x), calc(var(--y) - 10px)) rotate(0deg) scale(1.06); z-index: 5; box-shadow: 0 24px 40px -18px rgba(58,26,20,.6); transition-delay: 0s; }
  .o5 .ph { display: block; aspect-ratio: 1; overflow: hidden; border-radius: 3px; background: var(--dark); }
  .o5 .ph img { width: 100%; height: 100%; object-fit: cover; }
  .o5 b { display: block; margin-top: 10px; font-family: var(--display); font-weight: 800; font-size: 16px; line-height: 1.25; }
  .o5 small { display: block; margin-top: 4px; font-family: var(--display); font-size: 13px; font-weight: 600; color: var(--red-ink); }
  @media (max-width: 700px) { .o5 { padding: 10px 8px 30px; gap: 2px; } .o5 .card { width: 46%; } }
  `;
  document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
  const $ = k => document.querySelector(`[data-opt="${k}"]`);
  const inView = (el, cb, opts = { threshold: .2 }) => { const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); cb(); } }, opts); io.observe(el); };

  // 1 – big name list, lights up with the scroll, photo follows the cursor
  {
    const el = $('names');
    el.innerHTML = `<p class="o1">${ordered.map(s => btn(s, `<bdi>${tr(s, 'title')}</bdi>`, `nm d-${s.day}`)).join('<span class="dot" aria-hidden="true"></span>')}</p>`;
    el.querySelectorAll('.dot').forEach((d, i) => d.classList.add('d-' + ordered[i + 1].day));
    const names = [...el.querySelectorAll('.nm')];
    const light = () => names.forEach(n => n.classList.toggle('lit', reduceMotion || n.getBoundingClientRect().top < innerHeight * .62));
    addEventListener('scroll', () => requestAnimationFrame(light), { passive: true }); light();
    if (matchMedia('(hover: hover)').matches) {
      const f = document.createElement('div'); f.className = 'o1-float'; document.body.append(f);
      names.forEach(n => {
        const s = SHOWS.find(x => x.id === n.dataset.show);
        n.addEventListener('mouseenter', () => { f.innerHTML = pic(s); f.classList.add('on'); });
        n.addEventListener('mouseleave', () => f.classList.remove('on'));
      });
      addEventListener('mousemove', e => { f.style.left = e.clientX + 24 + 'px'; f.style.top = e.clientY - 80 + 'px'; });
    }
  }

  // 2 – equal photo grid, colour on hover / in the middle of a phone screen
  {
    const el = $('grid');
    el.innerHTML = `<div class="o2">${ordered.map((s, i) => btn(s, `<span class="ph">${pic(s)}</span><b><bdi>${tr(s, 'title')}</bdi></b><small>${when(s)}</small>`, 'tile" style="--d:' + (i % 5) * 70 + 'ms')).join('')}</div>`;
    const grid = el.firstElementChild;
    reduceMotion ? grid.classList.add('in') : inView(grid, () => grid.classList.add('in'), { threshold: .05 });
    if (!matchMedia('(hover: hover)').matches) {
      const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('hot', e.isIntersecting)), { rootMargin: '-40% 0px -40% 0px' });
      grid.querySelectorAll('.tile').forEach(t => io.observe(t));
    }
  }

  // 3 – day switcher with a sliding timeline
  {
    const el = $('days');
    el.innerHTML = `<div class="o3"><div class="o3-tabs" role="tablist">${DAYS.map((d, i) => `<button type="button" role="tab" class="d-${d.id}" data-day="${d.id}" aria-selected="${!i}">${dayName(d)}<b>${d.date}</b></button>`).join('')}</div>
      <div class="o3-panel d-${DAYS[0].id}" role="tabpanel"></div></div>`;
    const panel = el.querySelector('.o3-panel'), tabs = [...el.querySelectorAll('[role=tab]')];
    let cur = 0;
    const show = (i, dir) => {
      const d = DAYS[i]; panel.className = `o3-panel d-${d.id}`;
      panel.innerHTML = `<ul class="o3-list${dir ? ' enter-' + dir : ''}">${byDay(d.id).map(s => `<li><time>${s.time}</time><span class="th">${pic(s)}</span>${btn(s, `<b><bdi>${tr(s, 'title')}</bdi></b><small>${tr(s, 'venue')}</small>`)}</li>`).join('')}</ul>`;
      tabs.forEach((t, j) => t.setAttribute('aria-selected', j === i));
    };
    tabs.forEach((t, i) => t.addEventListener('click', () => { if (i === cur) return; const dir = (i > cur) !== EN ? 'l' : 'r'; cur = i; show(i, reduceMotion ? '' : dir); }));
    show(0);
  }

  // 4 – rotating spotlight, random order
  {
    const el = $('spot'), order = shuffle(list);
    el.innerHTML = `<div class="o4"><div class="o4-stage">${order.map((s, i) => `<div class="o4-slide${i ? '' : ' on'}" aria-hidden="${!!i}">${s.img ? `<img src="${photo(s, 1600)}" alt="" loading="${i < 2 ? 'eager' : 'lazy'}"${s.pos ? ` style="object-position:${s.pos}"` : ''}>` : `<span class="o-logo d-${s.day}"></span>`}
      <div class="o4-cap"><small>${when(s)} · ${tr(s, 'venue')}</small>${btn(s, `<bdi>${tr(s, 'title')}</bdi>`)}</div></div>`).join('')}</div>
      <div class="o4-ctl"><button type="button" class="arr" data-step="-1" aria-label="${L('הקודם', 'Previous')}">${EN ? '←' : '→'}</button><button type="button" class="arr" data-step="1" aria-label="${L('הבא', 'Next')}">${EN ? '→' : '←'}</button><div class="o4-dots">${order.map(() => '<i></i>').join('')}</div></div></div>`;
    const slides = [...el.querySelectorAll('.o4-slide')], dots = [...el.querySelectorAll('.o4-dots i')];
    let i = 0, timer, hold = false;
    const go = n => { i = (n + slides.length) % slides.length; slides.forEach((s, j) => { s.classList.toggle('on', j === i); s.setAttribute('aria-hidden', j !== i); }); dots.forEach((d, j) => d.classList.toggle('on', j === i)); };
    const tick = () => { clearTimeout(timer); timer = setTimeout(() => { if (!hold) go(i + 1); tick(); }, 4000); };
    el.querySelectorAll('.arr').forEach(b => b.addEventListener('click', () => { go(i + +b.dataset.step); tick(); }));
    el.querySelector('.o4-stage').addEventListener('mouseenter', () => { hold = true; });
    el.querySelector('.o4-stage').addEventListener('mouseleave', () => { hold = false; });
    go(0); if (!reduceMotion) tick();
  }

  // 5 – postcards scattered on a table, new order each visit, landing as you scroll
  {
    const el = $('cards'), r = (a, b) => (Math.random() * (b - a) + a).toFixed(1);
    el.innerHTML = `<div class="o5 pre">${shuffle(list).map((s, i) => btn(s, `<span class="ph">${pic(s)}</span><b><bdi>${tr(s, 'title')}</bdi></b><small>${when(s)}</small>`,
      `card" style="--r:${r(-7, 7)}deg;--x:${r(-10, 10)}px;--y:${r(-14, 14)}px;--d:${i * 60}ms`)).join('')}</div>`;
    const wrap = el.firstElementChild;
    reduceMotion ? wrap.classList.replace('pre', 'go') : inView(wrap, () => wrap.classList.replace('pre', 'go'), { threshold: .08 });
  }
})();
