// Demo only: the page opens on a cream paper screen with a small terracotta dot.
// Scrolling opens the dot like an aperture until the whole hero is revealed,
// while the hero zooms out from close-up to its normal size.
(() => {
  const root = document.documentElement;
  const hero = document.querySelector('.hero');
  const wrap = document.createElement('div'); wrap.className = 'zoom-wrap';
  const stage = document.createElement('div'); stage.className = 'zoom-stage';
  hero.before(wrap); wrap.appendChild(stage); stage.appendChild(hero);
  const intro = document.createElement('div'); intro.className = 'zoom-intro';
  intro.innerHTML = `<div class="t t1">פסטיבל הג׳אז רעננה</div><div class="t t2"><b>10–12.12.2026</b> · המרכז למוזיקה פאיס רעננה</div><div class="hint">גללו כדי לפתוח<i></i></div>`;
  stage.prepend(intro);
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  let on = false;

  function frame() {
    if (!on) return;
    const total = wrap.offsetHeight - innerHeight;
    const p = clamp((scrollY - wrap.offsetTop) / total);
    const open = easeInOut(seg(p, 0, .72));                  // aperture opens over the first ~70%
    const full = Math.hypot(innerWidth, innerHeight) / 2 + 10;
    const start = Math.min(70, innerWidth * .08);
    hero.style.setProperty('--r', `${start + (full - start) * open}px`);
    hero.style.setProperty('--s', (1.6 - .6 * open).toFixed(4)); // close-up → normal
    intro.style.opacity = 1 - seg(p, 0, .25);
    intro.style.transform = `scale(${1 + seg(p, 0, .3) * .15})`;
  }
  let queued = false;
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; frame(); }); } }, { passive: true });
  addEventListener('resize', frame);

  function setZoom(v) {
    on = v; root.classList.toggle('zoom-on', v);
    intro.hidden = !v;
    if (!v) { hero.style.removeProperty('--r'); hero.style.removeProperty('--s'); }
    frame();
  }

  const panel = document.createElement('div');
  panel.className = 'zp';
  panel.innerHTML = `<b>דף ניסיון</b><small>הזום עדיין לא באתר האמיתי</small>
    <fieldset><legend>פתיחה עם זום</legend>
      <label><input type="radio" name="zm" value="1" checked> מופעל</label><label><input type="radio" name="zm" value="0"> כבוי</label></fieldset>
    <button type="button">↑ חזרה להתחלה</button>`;
  document.body.appendChild(panel);
  panel.querySelectorAll('[name=zm]').forEach(i => i.addEventListener('change', () => { scrollTo(0, 0); setZoom(i.value === '1'); }));
  panel.querySelector('button').addEventListener('click', () => scrollTo({ top: 0, behavior: 'instant' }));
  setZoom(true);
})();
