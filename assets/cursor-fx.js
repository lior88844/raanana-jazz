// =====================================================================
//  Jazz-show pointer effects (test):
//   8 · Swing dot   – a gold dot trails the pointer "behind the beat",
//                     opening into a ring over anything clickable
//   1 · Spotlight   – a warm follow-spot on the dark sections and on
//                     show-card photos
//   4 · Brushes     – jazz-brush cursor over clickable things, a swish
//                     on hover and a snare "tap" ripple on click
//  Only on devices with a real mouse; motion is reduced when the visitor
//  asks for it.
// =====================================================================
(() => {
  const root = document.documentElement;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!finePointer) { root.classList.add('fx-none'); return; }

  const CLICKABLE = 'a[href], button, [role="button"], label, select, .card:has(.stretch), .showrow:has(.stretch)';
  const state = { swing: true, spot: true, brush: true };
  Object.keys(state).forEach(k => root.classList.add('fxon-' + k));   // page-level on/off flags

  const layer = document.createElement('div');
  layer.className = 'fx-layer';
  document.body.appendChild(layer);

  // ---------- 8 · Swing dot ----------
  const dot = document.createElement('div');
  dot.className = 'fx-dot hide';
  dot.innerHTML = '<i></i>';      // the <i> scales (dot ⇄ ring); the outer element only moves
  layer.appendChild(dot);
  let mx = -100, my = -100, x = mx, y = my, overEl = null;
  const LAG = reduce ? 1 : 0.13;           // lower = more laid-back
  let running = false;
  const loop = () => {
    x += (mx - x) * LAG; y += (my - y) * LAG;
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    // stop when the dot has caught up; the next pointermove restarts it
    if (Math.abs(mx - x) + Math.abs(my - y) > 0.3) requestAnimationFrame(loop);
    else running = false;
  };
  addEventListener('pointermove', e => {
    mx = e.clientX; my = e.clientY;
    dot.classList.remove('hide');
    if (!running) { running = true; requestAnimationFrame(loop); }
    const t = e.target.closest ? e.target.closest(CLICKABLE) : null;
    if (t !== overEl) {
      overEl = t;
      dot.classList.toggle('ring', !!t);
      if (t && state.brush && !reduce) swish(mx, my);
    }
  }, { passive: true });
  document.addEventListener('pointerleave', () => dot.classList.add('hide'));

  // ---------- 1 · Spotlight ----------
  const spotHosts = [
    ...document.querySelectorAll('.hero, .page-hero, .passes, .footer, .hero-photo'),
  ];
  function attachSpot(host, cls) {
    const s = document.createElement('div');
    s.className = 'fx-spot ' + (cls || '');
    host.classList.add('fx-spot-host');
    host.appendChild(s);
    const area = host.closest('.card') || host;
    area.addEventListener('pointermove', e => {
      if (!state.spot) return;
      const r = host.getBoundingClientRect();
      s.style.setProperty('--x', `${e.clientX - r.left}px`);
      s.style.setProperty('--y', `${e.clientY - r.top}px`);
      host.classList.add('lit');
    });
    area.addEventListener('pointerleave', () => host.classList.remove('lit'));
  }
  spotHosts.forEach(h => attachSpot(h));
  // show-card photos get a tighter follow-spot (cards are rendered by site.js first)
  document.querySelectorAll('.card .ph').forEach(ph => attachSpot(ph, 'card-spot'));

  // ---------- 4 · Brushes: swish on hover, tap on click ----------
  function swish(px, py) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('class', 'fx-swish');
    s.setAttribute('viewBox', '0 0 40 24');
    s.innerHTML = '<path d="M2 18 Q 18 0 38 10"/><path d="M6 21 Q 20 6 37 15"/>';
    s.style.left = px + 'px'; s.style.top = py + 'px';
    layer.appendChild(s);
    s.addEventListener('animationend', () => s.remove(), { once: true });
  }
  function tap(px, py) {
    const t = document.createElement('div');
    t.className = 'fx-tap';
    t.style.left = px + 'px'; t.style.top = py + 'px';
    t.innerHTML = '<i class="r1"></i><i class="r2"></i>' +
      Array.from({ length: 8 }, (_, i) => `<b style="--a:${i * 45 + 22}deg"></b>`).join('');
    layer.appendChild(t);
    setTimeout(() => t.remove(), 600);
  }
  addEventListener('pointerdown', e => {
    if (!state.brush || reduce) return;
    if (e.target.closest && e.target.closest(CLICKABLE)) tap(e.clientX, e.clientY);
    dot.classList.add('press');
  });
  addEventListener('pointerup', () => dot.classList.remove('press'));

  // ---------- toggles for the test panel ----------
  window.CursorFX = {
    set(key, on) {
      state[key] = on;
      root.classList.toggle('fxon-' + key, on);
      if (key === 'spot' && !on) document.querySelectorAll('.lit').forEach(h => h.classList.remove('lit'));
    },
  };
})();
