# Generates the static HTML pages from one shared <head> template.
# Run: python3 build_pages.py
import time
VER = time.strftime('%Y%m%d%H%M')
HEAD = '''<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="https://raananajazzfestival.com/images/44f224268148.png">
<link rel="icon" href="images/44f224268148.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Assistant:wght@400;600;700&family=Rubik:ital,wght@0,500;0,700;0,900;1,700;1,900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/site.css?v={ver}">
<script>document.documentElement.classList.add('js')</script>
</head>
<body>
'''
FOOT = '''
<script src="assets/data.js?v={ver}"></script>
<script src="assets/site.js?v={ver}"></script>
{script}
</body>
</html>
'''
SUFFIX = ' | פסטיבל הג׳אז רעננה'

def hero(eyebrow, title, chip='', lead='', ctas=''):
    chip_html = f'<span class="chip">{chip}</span>' if chip else ''
    lead_html = f'<p class="lead">{lead}</p>' if lead else ''
    cta_html = f'<div class="ctas">{ctas}</div>' if ctas else ''
    return f'''<section class="page-hero grain">
  <div class="eyebrow">{eyebrow}</div>
  <h1>{title}{chip_html}</h1>
  {lead_html}
  {cta_html}
</section>
'''

BURST = '''<svg class="burst" viewBox="0 0 200 200" aria-hidden="true">
    <polygon fill="#F2D36B" points="100,0 110,62 140,10 124,70 173,27 135,80 196,58 142,92 200,100 142,108 196,142 135,120 173,173 124,130 140,190 110,138 100,200 90,138 60,190 76,130 27,173 65,120 4,142 58,108 0,100 58,92 4,58 65,80 27,27 76,70 60,10 90,62"/>
    <text x="100" y="96" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="22" fill="#202C45">כניסה</text>
    <text x="100" y="120" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="22" fill="#D44836">חופשית</text>
    <text x="100" y="138" text-anchor="middle" font-family="Rubik" font-weight="700" font-size="11" fill="#202C45">לרחבת הפסטיבל</text>
  </svg>'''

PASSES_BOX = '''<section class="passes grain" id="passes">
  <div class="love">רוצים את כל הפסטיבל?</div><br>
  <div class="big">פסים</div><br>
  <span class="chip">במחיר משתלם</span>
  <p>פס יומי או פס לכל ימי הפסטיבל – <b>הדרך המשתלמת ביותר</b> לשמוע את כל ההופעות. אפשר גם לרכוש כרטיסים לפי מופע.</p>
  <div class="ctas">
    <a data-href="fullpass" target="_blank" rel="noopener" class="btn primary">פס לכל הפסטיבל</a>
    <a href="tickets.html" class="btn ghost">כל אפשרויות הכרטיסים ←</a>
  </div>
  <div class="themes" data-render="themes"></div>
</section>'''

PAGES = {}

# ---------------------------------------------------------------- Home
PAGES['index.html'] = dict(
  title='פסטיבל הג׳אז רעננה | Raanana Jazz Festival',
  desc='פסטיבל הג׳אז רעננה – World Jazz Music. 9–12 בדצמבר 2026, ארבעה ימים של מוזיקה חיה במרכז למוזיקה רעננה.',
  body=f'''
<section class="hero grain">
  <div class="hero-inner">
    <div>
      <img class="main-logo" src="images/44f224268148.png" alt="World Jazz Music – פסטיבל הג׳אז רעננה">
      <div class="meta">
        <div class="dates">9–12 <small>DEC 2026</small></div>
        <div class="dir"><span>ניהול אומנותי:</span> עמית פרידמן</div>
        <div class="countdown-label" id="cdLabel">הפסטיבל נפתח ביום רביעי, 9 בדצמבר 2026</div>
        <div class="countdown" id="countdown" role="timer" aria-labelledby="cdLabel" hidden>
          <div class="u"><b data-k="d">0</b><small>ימים</small></div>
          <div class="u"><b data-k="h">0</b><small>שעות</small></div>
          <div class="u"><b data-k="m">0</b><small>דקות</small></div>
          <div class="u sec"><b data-k="s">0</b><small>שניות</small></div>
        </div>
        <div class="ctas">
          <a href="tickets.html" class="btn primary">לרכישת כרטיסים</a>
          <a href="lineup.html" class="btn ghost">ללוח ההופעות ←</a>
        </div>
      </div>
    </div>
  </div>
</section>
<section class="hero-photo" style="background-image:url(images/8300ce79d8cf.jpg)" data-settle>
  <div class="cap">
    <div class="k">מפסטיבל 2025 · הפקה מיוחדת לפסטיבל</div>
    <h2>אבישי כהן ובקה גוצ׳יאשווילי – שיחה מוזיקלית בין שני ענקים</h2>
  </div>
</section>

<section class="intro">
  {BURST}
  <h2>פסטיבל הג׳אז רעננה <span>2026</span></h2>
  <p><b>9–12 בדצמבר 2026</b> · ארבעה ימים של מוזיקה חיה ברחבי המרכז למוזיקה רעננה – אמנים מישראל ומרחבי העולם, הפקות מקור, סדנאות אמן ומופעים לכל המשפחה.</p>
</section>

<div class="stitle"><h3>הופעות<span class="chip">רגעי שיא 2025</span></h3></div>
<section class="cards" data-render="cards"></section>

<div class="stitle" id="lineup"><h3>לוח הופעות<span class="chip">2025</span></h3></div>
<p class="sched-note">התוכנייה של 2026 תפורסם בקרוב. בינתיים – כך נראה הפסטיבל ב־18–20.12.2025.</p>
<section class="schedule" data-render="schedule"></section>

{PASSES_BOX}

<section class="duo">
  <div class="col">
    <h5>התוכנייה המלאה</h5>
    <a data-href="program" target="_blank" class="disc">לצפייה בתוכנייה ←</a>
    <div class="frame program"><img src="images/413f2429c54a.png" alt="תוכניית הפסטיבל" loading="lazy" width="880" height="1240"></div>
    <a href="images/413f2429c54a.png" download="raanana-jazz-program.png" class="hires">להורדת התוכנייה ↓</a>
  </div>
  <div class="col">
    <h5>סדנאות 2025</h5>
    <a href="workshops.html" class="disc">לכל הפרטים והרשמה ←</a>
    <div class="frame ws">
      <div class="k">סדנאות<span>למוזיקאים</span></div>
      <div class="info">לגילאי 14–25 · 18–20 בדצמבר (חופש חנוכה)<br>חמישי–שבת · 10:00–17:00<br>נגינה בהרכבים, סדנאות כלי, כיתות אמן והופעה במתחם הפסטיבל</div>
      <ul data-render="teachers"></ul>
      <div class="price">2,000 ₪ · כולל כניסה להופעות*</div>
    </div>
    <span class="hires">*על בסיס מקום פנוי</span>
  </div>
</section>

<div class="moments-h">
  <h6>רגעים מהפסטיבל</h6>
  <div class="yr">2025</div>
  <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6"><path d="M12 3v18M5 14l7 7 7-7"/></svg>
</div>
<section class="grid" data-render="moments"></section>

<section class="partners" id="partners">
  <h2>תודה מיוחדת<span class="l2">לשותפים ולתומכים</span><span class="l3">שלנו</span></h2>
  <p class="sub">הפסטיבל לא היה מתקיים בלעדיכם.</p>
  <div class="cat">מפיקים ותומכים</div>
  <div class="logos" data-render="partners"></div>
</section>
''')

# ---------------------------------------------------------------- Lineup (Upcoming shows)
PAGES['lineup.html'] = dict(
  title='לוח הופעות' + SUFFIX,
  desc='לוח ההופעות של פסטיבל הג׳אז רעננה. פסטיבל 2026: 9–12 בדצמבר.',
  body=hero('פסטיבל 2026 · 9–12 בדצמבר', 'לוח הופעות', '2025',
            'התוכנייה של פסטיבל 2026 תפורסם בקרוב. בינתיים, כך נראה לוח ההופעות של פסטיבל 2025 (18–20.12.2025).',
            '<a data-href="fullpass" target="_blank" rel="noopener" class="btn primary">פס לכל הפסטיבל</a><a href="tickets.html" class="btn ghost">כל אפשרויות הכרטיסים ←</a>') + '''
<section class="wrap">
  <div class="daytabs" role="tablist">
    <button class="on" data-day="">כל הימים</button>
    <button data-day="thu">חמישי 18.12</button>
    <button data-day="fri">שישי 19.12</button>
    <button data-day="sat">שבת 20.12</button>
  </div>
  <div class="showlist" id="showlist" data-render="showlist"></div>
</section>
<section class="cta-band">
  <h2>חוזרים כל ערב?</h2>
  <p>פס יומי במחיר משתלם מכסה את כל מופעי היום.</p>
  <a href="tickets.html" class="btn">לפסים היומיים ←</a>
</section>
''',
  script='''<script>
  document.querySelectorAll('.daytabs button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.daytabs button').forEach(x => x.classList.toggle('on', x === b));
    renderShowList(document.getElementById('showlist'), b.dataset.day);
  }));
</script>''')

# ---------------------------------------------------------------- Past editions
PAGES['festival-2025.html'] = dict(
  title='פסטיבל 2025 – האמנים' + SUFFIX,
  desc='האמנים שהופיעו בפסטיבל הג׳אז רעננה 2025.',
  body=hero('מהדורות קודמות', 'פסטיבל', '2025',
            'האמנים שהפכו את פסטיבל 2025 לבלתי נשכח – מישראל, ממרוקו, מפולין, מהונגריה, מאוסטריה, מגאורגיה, מיוון, מקפריסין ומארה״ב.') + '''
<div class="year-bar" style="margin-top:-40px;position:relative;z-index:2">
  <label for="year">החליפו שנה</label>
  <select id="year"><option selected>2025</option><option disabled>2026 – בקרוב</option></select>
</div>
<section class="artists" id="artists"></section>
<div class="moments-h">
  <h6>רגעים מהפסטיבל</h6>
  <div class="yr">2025</div>
  <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6"><path d="M12 3v18M5 14l7 7 7-7"/></svg>
</div>
<section class="grid" data-render="moments"></section>
<section class="cta-band" style="margin-top:0">
  <h2>להורדת התוכנייה של 2025</h2>
  <p>כל ההופעות, השעות והבמות בעמוד אחד.</p>
  <a href="images/413f2429c54a.png" download="raanana-jazz-program-2025.png" class="btn">להורדה ↓</a>
</section>
''',
  script='''<script>
  document.getElementById('artists').innerHTML = SHOWS.filter(s => s.img && !s.title.startsWith('ביג בנד רעננה – חגיגת')).map(s => `
    <a class="artist" href="lineup.html" data-bg="${img(s.img)}">
      <div class="in"><small>יום ${dayOf(s.day).name} · ${s.venue}</small><h3>${s.title}</h3><p>${s.desc}</p></div>
    </a>`).join('');
</script>''')

# ---------------------------------------------------------------- Venue (Bloor-Yorkville equivalent)
PAGES['venue.html'] = dict(
  title='המתחם' + SUFFIX,
  desc='ארבע הבמות של פסטיבל הג׳אז רעננה במרכז למוזיקה פאיס רעננה.',
  body=hero('המרכז למוזיקה פאיס רעננה', 'המתחם', '4 במות',
            'מהאולם המרכזי ועד הרחבה הפתוחה – כל הפסטיבל מתקיים במתחם אחד, כך שאפשר לעבור בין הופעות בכמה צעדים.') + '''
<section class="wrap section">
  <h2 class="sec-h">הבמות</h2>
  <p>לכל במה אופי משלה. כך נראה לוח ההופעות לפי במה:</p>
  <div class="venues" id="venues"></div>
</section>
<section class="wrap section">
  <h2 class="sec-h">איך מגיעים</h2>
  <p>הפסטיבל מתקיים ב<b>מרכז למוזיקה פאיס רעננה</b>.</p>
  <iframe class="map" loading="lazy" title="מפה – המרכז למוזיקה רעננה"
    src="https://www.google.com/maps?q=%D7%94%D7%9E%D7%A8%D7%9B%D7%96+%D7%9C%D7%9E%D7%95%D7%96%D7%99%D7%A7%D7%94+%D7%A4%D7%90%D7%99%D7%A1+%D7%A8%D7%A2%D7%A0%D7%A0%D7%94&output=embed"></iframe>
  <p style="margin-top:14px"><a class="tix" style="font-family:var(--display);font-weight:700;border-bottom:3px solid var(--gold)" target="_blank" rel="noopener"
    href="https://www.google.com/maps/search/?api=1&query=%D7%94%D7%9E%D7%A8%D7%9B%D7%96+%D7%9C%D7%9E%D7%95%D7%96%D7%99%D7%A7%D7%94+%D7%A4%D7%90%D7%99%D7%A1+%D7%A8%D7%A2%D7%A0%D7%A0%D7%94">לפתיחה ב־Google Maps ←</a></p>
</section>
''',
  script='''<script>
  document.getElementById('venues').innerHTML = VENUES.map(v => `
    <div class="venue-card">
      <h3>${v.name}</h3>
      <p>${v.desc}</p>
      <ul>${SHOWS.filter(s => s.venue === v.name || (v.name === 'המועדון הקאמרי' && s.venue === 'הסלון הקאמרי')).map(s =>
        `<li><time>${dayOf(s.day).date} · ${s.time}</time><span>${s.title}</span></li>`).join('')}</ul>
    </div>`).join('');
</script>''')

# ---------------------------------------------------------------- About
PAGES['about.html'] = dict(
  title='אודות' + SUFFIX,
  desc='על פסטיבל הג׳אז רעננה – World Jazz Music.',
  body=hero('אודות', 'World Jazz Music', '',
            'פסטיבל הג׳אז רעננה מביא לעיר ימים של ג׳אז ומוזיקת עולם – אמנים מישראל ומרחבי העולם, הפקות מקור שנוצרות במיוחד לפסטיבל, סדנאות לנגנים צעירים ומופעים פתוחים לכל המשפחה.') + '''
<section class="wrap section">
  <div class="stats-h"><h2>פסטיבל 2025</h2><small>במספרים · הפסטיבל הבא: 9–12 בדצמבר 2026</small></div>
  <div class="stats">
    <div class="stat"><b>3</b><span>ימים של מוזיקה חיה<br>18–20 בדצמבר</span></div>
    <div class="stat"><b>17</b><span>מופעים, מהם הפקות מקור<br>שנוצרו לפסטיבל</span></div>
    <div class="stat"><b>4</b><span>במות במתחם אחד</span></div>
    <div class="stat"><b>9</b><span>מדינות על הבמה</span></div>
  </div>
</section>
<section class="narrow section prose">
  <h2>מי אנחנו</h2>
  <p>הפסטיבל מופק על ידי <b>המרכז למוזיקה פאיס רעננה</b> ו<b>עיריית רעננה</b>, בתמיכת המשרד לשיתוף פעולה אזורי. הניהול האומנותי בידי הפסנתרן והמלחין <b>עמית פרידמן</b>.</p>
  <p>לצד ההופעות, הפסטיבל הוא גם בית ספר: בכל שנה נגנים צעירים בגילאי 14–25 לומדים מאמנים בינלאומיים ומסיימים בהופעה על במת הפסטיבל.</p>
</section>
<section class="wrap section">
  <h2 class="sec-h">המורים בסדנאות 2025</h2>
  <div class="people" data-render="people"></div>
</section>
<section class="partners" style="margin-top:110px">
  <h2>השותפים<span class="l2">שמאפשרים את</span><span class="l3">הפסטיבל</span></h2>
  <div class="logos" data-render="partners" style="margin-top:50px"></div>
</section>
''')

# ---------------------------------------------------------------- Workshops (Artist submissions equivalent)
PAGES['workshops.html'] = dict(
  title='סדנאות' + SUFFIX,
  desc='סדנאות ג׳אז לנגנים בגילאי 14–25 עם אמנים בינלאומיים.',
  body=hero('לנגנים בגילאי 14–25', 'סדנאות', 'אודישן',
            'שלושה ימים של נגינה בהרכבים, סדנאות כלי וכיתות אמן עם אמנים מניו יורק, מברלין, מפולין, מוינה ומהונגריה – ובסוף, הופעה על במת הפסטיבל.',
            '<a data-href="form" target="_blank" rel="noopener" class="btn primary">לטופס הרשמה ואודישן</a>') + '''
<section class="wrap section">
  <div class="stats">
    <div class="stat"><b>3</b><span>ימים · חמישי–שבת<br>18–20 בדצמבר (חופש חנוכה)</span></div>
    <div class="stat"><b>10<em>–</em>17</b><span>שעות הפעילות</span></div>
    <div class="stat"><b>7</b><span>מורים בינלאומיים</span></div>
    <div class="stat"><b>₪2,000</b><span>כולל כניסה להופעות הפסטיבל<br>על בסיס מקום פנוי</span></div>
  </div>
</section>
<section class="narrow section prose">
  <h2>מה בתוכנית</h2>
  <ul>
    <li>נגינה בהרכבים בהדרכת מורי הפסטיבל</li>
    <li>סדנאות כלי – גיטרה, בס, חצוצרה, שירה, סקסופון, תופים ופסנתר</li>
    <li>כיתות אמן עם אמני הפסטיבל</li>
    <li>הופעת סיום של הרכבי הסדנאות ברחבת הפסטיבל</li>
  </ul>
  <h2>איך נרשמים</h2>
  <p>ממלאים את <a data-href="form" target="_blank" rel="noopener">טופס ההרשמה</a> ושולחים אודישן מוקלט.</p>
</section>
<section class="wrap section">
  <h2 class="sec-h">המורים</h2>
  <div class="people" data-render="people"></div>
</section>
<section class="cta-band">
  <h2>מוכנים לעלות לבמה?</h2>
  <p>ההרשמה כוללת שליחת אודישן מוקלט.</p>
  <a data-href="form" target="_blank" rel="noopener" class="btn">לטופס ההרשמה ←</a>
</section>
''')

# ---------------------------------------------------------------- Media / press
PAGES['media.html'] = dict(
  title='מדיה ועיתונות' + SUFFIX,
  desc='חומרים לעיתונות – לוגו, תוכנייה ותמונות מפסטיבל הג׳אז רעננה.',
  body=hero('לעיתונאים ולמדיה', 'מדיה ועיתונות', 'Press',
            'כאן תמצאו את הלוגו, התוכנייה ותמונות להורדה. לבקשות אקרדיטציה, ראיונות וחומרים נוספים – צרו קשר.',
            '<a id="pressMail" class="btn primary">בקשת אקרדיטציה</a>') + '''
<section class="wrap section">
  <h2 class="sec-h">חומרים להורדה</h2>
  <div class="dl-grid">
    <div class="dl"><div class="th" style="background-image:url(images/44f224268148.png)"></div><h3>לוגו הפסטיבל</h3><a href="images/44f224268148.png" download="raanana-jazz-logo.png">להורדה (PNG) ↓</a></div>
    <div class="dl"><div class="th" style="background-image:url(images/413f2429c54a.png);background-color:var(--red)"></div><h3>תוכנייה 2025</h3><a href="images/413f2429c54a.png" download="raanana-jazz-program-2025.png">להורדה (PNG) ↓</a></div>
    <div class="dl"><div class="th photo" style="background-image:url(images/8300ce79d8cf.jpg)"></div><h3>אבישי כהן ובקה גוצ׳יאשווילי</h3><a href="images/8300ce79d8cf.jpg" download>להורדה (JPG) ↓</a></div>
  </div>
</section>
<section class="wrap section">
  <h2 class="sec-h">תמונות אמנים</h2>
  <p>לחצו על תמונה להורדה ברזולוציה מלאה.</p>
  <div class="dl-grid" id="pressPhotos"></div>
</section>
''',
  script='''<script>
  document.getElementById('pressMail').href = `mailto:${SITE.email}?subject=${encodeURIComponent('בקשת אקרדיטציה – פסטיבל הג׳אז רעננה')}`;
  document.getElementById('pressPhotos').innerHTML = SHOWS.filter(s => s.img).filter((s, i, a) => a.findIndex(x => x.img === s.img) === i).map(s => `
    <div class="dl"><div class="th photo" data-bg="${img(s.img)}"></div><h3>${s.title}</h3><a href="${img(s.img)}" download>להורדה ↓</a></div>`).join('');
</script>''')

# ---------------------------------------------------------------- Tickets (Donate equivalent)
PAGES['tickets.html'] = dict(
  title='כרטיסים ופסים' + SUFFIX,
  desc='כרטיסים, פסים יומיים ופסים לפי נושאים לפסטיבל הג׳אז רעננה.',
  body=hero('כרטיסים', 'כרטיסים ופסים', 'במחיר משתלם',
            'פס לכל הפסטיבל, פס יומי, פס לפי נושא – או כרטיס למופע בודד. הכניסה לרחבת הפסטיבל חופשית.') + '''
<section class="wrap section">
  <h2 class="sec-h">פסים</h2>
  <p>הדרך המשתלמת ביותר לשמוע הכי הרבה מוזיקה.</p>
  <div class="ticket-grid" id="dayPasses"></div>
</section>
<section class="wrap section">
  <h2 class="sec-h">פסים לפי נושאים</h2>
  <p>בוחרים סגנון – ומקבלים את המופעים שמתאימים לו.</p>
  <div class="ticket-grid" id="themePasses"></div>
</section>
<section class="wrap section">
  <h2 class="sec-h">כרטיסים לפי מופע</h2>
  <p>כל מופע עם כרטיס משלו.</p>
  <div class="showlist" data-render="showlist"></div>
</section>
''',
  script='''<script>
  document.getElementById('dayPasses').innerHTML =
    `<a class="tcard hot" href="${T(SITE.fullPass)}" ${ext}><small>הכי משתלם</small><h3>פס לכל הפסטיבל</h3><p>כל שלושת ימי הפסטיבל.</p><span class="go">לרכישה ←</span></a>` +
    DAYS.map(d => `<a class="tcard" href="${T(d.pass)}" ${ext}><small>פס יומי</small><h3>יום ${d.name} ${d.date}</h3><p>${SHOWS.filter(s => s.day === d.id && s.slug).length} מופעים בכרטיס אחד.</p><span class="go">לרכישה ←</span></a>`).join('');
  document.getElementById('themePasses').innerHTML = THEME_PASSES.map(([n, slug]) =>
    `<a class="tcard" href="${T(slug)}" ${ext}><small>פס נושא</small><h3 style="direction:ltr;text-align:right">${n} Pass</h3><p>מבחר מופעים בסגנון ${n}.</p><span class="go">לרכישה ←</span></a>`).join('');
</script>''')

# ---------------------------------------------------------------- Contact
PAGES['contact.html'] = dict(
  title='צור קשר' + SUFFIX,
  desc='יצירת קשר עם פסטיבל הג׳אז רעננה.',
  body=hero('נשמח לשמוע מכם', 'צור קשר', '',
            'בחרו את נושא הפנייה – ייפתח מייל עם הנושא הנכון.') + '''
<section class="wrap section">
  <div class="contact-grid" id="contactGrid"></div>
</section>
<section class="narrow section prose" style="text-align:center">
  <p>אפשר גם לכתוב לנו באינסטגרם ובפייסבוק של המרכז למוזיקה רעננה.</p>
</section>
''',
  script='''<script>
  const TOPICS = [
    ['אמנים', 'רוצים להופיע בפסטיבל? ספרו לנו על ההרכב ושלחו קישורים להקלטות.', 'פנייה של אמן/ית'],
    ['סדנאות', 'שאלות על הסדנאות, האודישן וההרשמה.', 'שאלה על הסדנאות'],
    ['שותפים וחסויות', 'מעוניינים לתמוך בפסטיבל או לשתף פעולה?', 'שותפות / חסות'],
    ['פנייה כללית', 'כל שאלה אחרת – כרטיסים, הגעה, נגישות.', 'פנייה כללית'],
  ];
  document.getElementById('contactGrid').innerHTML = TOPICS.map(([h, p, subj]) =>
    `<a class="cbtn" href="mailto:${SITE.email}?subject=${encodeURIComponent(subj + ' – פסטיבל הג׳אז רעננה')}"><h3>${h}</h3><p>${p}</p><span>לכתיבת מייל ←</span></a>`).join('');
</script>''')

for name, p in PAGES.items():
    html = HEAD.format(title=p['title'], desc=p['desc'], ver=VER) + p['body'] + FOOT.format(script=p.get('script', ''), ver=VER)
    open(name, 'w').write(html)
    print('wrote', name)
