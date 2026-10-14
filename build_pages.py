# Generates the static HTML pages in Hebrew (/) and English (/en/).
# Each page is a function of `t(he, en)`, so both languages live side by side.
# Run: python3 build_pages.py
import os
import time

import hashlib
# cache-busting version = hash of the shared assets, so any change gets a new URL
VER = hashlib.sha1(b''.join(open(f, 'rb').read() for f in ('assets/site.css', 'assets/site.js', 'assets/data.js'))).hexdigest()[:10]
SITE_URL = 'https://raananajazzfestival.com'
LANGS = {
    'he': dict(dir='rtl', base='/', out='.', suffix=' | פסטיבל הג׳אז רעננה', arrow='←'),
    'en': dict(dir='ltr', base='/en/', out='en', suffix=' | Raanana Jazz Festival', arrow='→'),
}

HEAD = '''<!doctype html>
<html lang="{lang}" dir="{dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{site}/images/44f224268148.png">
<link rel="canonical" href="{site}{self_path}">
<link rel="alternate" hreflang="he" href="{site}{he_path}">
<link rel="alternate" hreflang="en" href="{site}{en_path}">
<link rel="alternate" hreflang="x-default" href="{site}{he_path}">
<link rel="icon" href="/images/44f224268148.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700;900&display=swap" rel="stylesheet">
<link rel="preload" href="/assets/fonts/xenon-ruckus.woff2" as="font" type="font/woff2" crossorigin>
{extra_head}
<link rel="stylesheet" href="/assets/site.css?v={ver}">
<script>document.documentElement.classList.add('js')</script>
</head>
<body>
'''
FOOT = '''
<script src="/assets/data.js?v={ver}"></script>
<script src="/assets/site.js?v={ver}"></script>
{script}
</body>
</html>
'''


def hero(eyebrow, title, chip='', lead='', ctas=''):
    chip_html = ''   # tilted chips removed (design review item 12)
    lead_html = f'<p class="lead">{lead}</p>' if lead else ''
    cta_html = f'<div class="ctas">{ctas}</div>' if ctas else ''
    return f'''<section class="page-hero grain">
  <div class="eyebrow">{eyebrow}</div>
  <h1>{title}{chip_html}</h1>
  {lead_html}
  {cta_html}
</section>
'''



def moments_head(t, level='h3'):
    return f'''<div class="moments-h">
  <{level} class="subhead" style="margin:0;padding:0">{t('רגעים מהפסטיבל', 'Moments captured')}</{level}>
</div>'''


def passes_box(t, P, A):
    return f'''<section class="passes grain" id="passes">
  <div class="love">{t('רוצים את כל הפסטיבל?', 'Want the whole festival?')}</div><br>
  <div class="big">{t('פסים', 'Passes')}</div>
  <p>{t('פס יומי או פס לכל ימי הפסטיבל – <b>הדרך המשתלמת ביותר</b> לשמוע את כל ההופעות. אפשר גם לרכוש כרטיסים לפי מופע.',
       'A day pass or a full-festival pass is <b>the best-value way</b> to catch every show. Single-show tickets are available too.')}</p>
  <div class="ctas">
    <a data-href="fullpass" target="_blank" rel="noopener" class="btn primary">{t('פס לכל הפסטיבל', 'Full festival pass')}</a>
    <a href="{P('tickets.html')}" class="btn ghost">{t('כל אפשרויות הכרטיסים', 'All ticket options')} {A}</a>
  </div>
  <div class="themes" data-render="themes"></div>
</section>'''


# ---------------------------------------------------------------- pages
def page_index(t, P, A):
    return dict(
        title=t('פסטיבל הג׳אז רעננה | Raanana Jazz Festival', 'Raanana Jazz Festival | World Jazz Music'),
        desc=t('פסטיבל הג׳אז רעננה – World Jazz Music. 9–12 בדצמבר 2026, ארבעה ימים של מוזיקה חיה במרכז למוזיקה רעננה.',
               'Raanana Jazz Festival – World Jazz Music. 9–12 December 2026: four days of live music at the Raanana Music Center.'),
        no_suffix=True,
        body=f'''
<section class="hero grain">
  <div class="hero-inner">
    <div>
      <h1><img class="main-logo" src="/images/44f224268148.png" width="974" height="794" alt="{t('World Jazz Music – פסטיבל הג׳אז רעננה 2026', 'World Jazz Music – Raanana Jazz Festival 2026')}"></h1>
      <div class="meta">
        <div class="dates" aria-label="9–12 DEC 2026"><span class="d-num">9–12</span><small>DEC 2026</small></div>
        <div class="dir"><span>{t('ניהול אומנותי:', 'Artistic director:')}</span> {t('עמית פרידמן', 'Amit Friedman')}</div>
        <div class="countdown-label" id="cdLabel">{t('הפסטיבל נפתח ביום רביעי, 9 בדצמבר 2026', 'The festival opens Wednesday, 9 December 2026')}</div>
        <div class="countdown" id="countdown" role="timer" aria-labelledby="cdLabel" hidden>
          <div class="u days"><b data-k="d">0</b><small>{t('ימים', 'Days')}</small></div>
          <div class="hms">
            <div class="u"><b data-k="h">00</b><small>{t('שעות', 'Hours')}</small></div>
            <div class="u"><b data-k="m">00</b><small>{t('דקות', 'Minutes')}</small></div>
            <div class="u sec"><b data-k="s">00</b><small>{t('שניות', 'Seconds')}</small></div>
          </div>
        </div>
        <div class="ctas">
          <a href="https://www.instagram.com/world.jazz.music/" target="_blank" rel="noopener" class="btn primary">{t('לעדכונים על התוכנייה', 'Get programme updates')}</a>
          <a href="#festival-2025" class="btn ghost">{t('מה היה ב־2025', 'See 2025')} ↓</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="now-strip" data-render="now" hidden aria-live="polite"></section>

<section class="next" aria-labelledby="next-h">
  <h2 id="next-h">{t('פסטיבל 2026', 'Festival 2026')}</h2>
  <p>{t('ארבעה ימים של ג׳אז ומוזיקת עולם במרכז למוזיקה רעננה – אמנים מישראל ומרחבי העולם, הפקות מקור, סדנאות לנגנים צעירים ומופעים לכל המשפחה.',
        'Four days of jazz and world music at the Raanana Music Center – artists from Israel and around the world, original productions, workshops for young musicians and shows for the whole family.')}</p>
  <ul class="facts">
    <li><b>9–12.12</b><span>{t('ארבעה ימים, רביעי עד שבת', 'Four days, Wednesday to Saturday')}</span></li>
    <li><b>4</b><span>{t('במות במרכז למוזיקה פאיס רעננה', 'stages at the Raanana Pais Music Center')}</span></li>
    <li><b>14–25</b><span>{t('סדנאות לנגנים צעירים – ההרשמה תיפתח בקרוב.', 'Workshops for young musicians – sign-up opens soon.')}</span><a href="{P('workshops.html')}">{t('על הסדנאות', 'About the workshops')} {A}</a></li>
  </ul>
  <p class="soon">{t('התוכנייה המלאה של 2026 תפורסם בקרוב. עקבו אחרינו באינסטגרם כדי לשמוע ראשונים.', 'The full 2026 programme will be announced soon. Follow us on Instagram to hear first.')}</p>
</section>

<section id="festival-2025" aria-labelledby="f25-h">
  <div class="stitle">
    <h2 id="f25-h">{t('פסטיבל 2025', 'Festival 2025')}</h2>
    <p>{t('18–20 בדצמבר 2025 · כך נראה הפסטיבל בשנה שעברה.', '18–20 December 2025 · how last year’s festival looked.')}</p>
  </div>
  <section class="featured" data-render="featured" aria-label="{t('הופעות נבחרות', 'Selected shows')}"></section>

  <h3 class="subhead" id="lineup">{t('לוח ההופעות', 'Line-up')}</h3>
  <section class="schedule" data-render="schedule"></section>

  {passes_box(t, P, A)}

  <section class="duo">
    <div class="col">
      <h3 class="subhead" style="margin:0;padding:0">{t('התוכנייה', 'Programme')}</h3>
      <a data-href="program" target="_blank" class="disc">{t('לצפייה בתוכנייה', 'View the programme')} {A}</a>
      <div class="frame program"><img src="/images/413f2429c54a.png" alt="{t('תוכניית פסטיבל 2025', '2025 festival programme')}" loading="lazy" width="880" height="1240"></div>
      <a href="/images/413f2429c54a.png" download="raanana-jazz-program-2025.png" class="hires">{t('להורדת התוכנייה', 'Download the programme')} ↓</a>
    </div>
    <div class="col">
      <h3 class="subhead" style="margin:0;padding:0">{t('הסדנאות', 'Workshops')}</h3>
      <a href="{P('workshops.html')}" class="disc">{t('לכל הפרטים', 'All the details')} {A}</a>
      <div class="frame ws">
        <div class="k">{t('סדנאות<span>למוזיקאים</span>', 'Workshops<span>for musicians</span>')}</div>
        <div class="info">{t('לגילאי 14–25 · 18–20 בדצמבר 2025<br>חמישי–שבת · 10:00–17:00<br>נגינה בהרכבים, סדנאות כלי, כיתות אמן והופעה במתחם הפסטיבל',
                             'Ages 14–25 · 18–20 December 2025<br>Thursday–Saturday · 10:00–17:00<br>Ensemble playing, instrument workshops, masterclasses and a performance at the festival')}</div>
        <ul data-render="teachers"></ul>
        <div class="price">{t('2,000 ₪ · כולל כניסה להופעות*', '₪2,000 · includes festival shows*')}</div>
      </div>
      <span class="hires">{t('*על בסיס מקום פנוי', '*subject to availability')}</span>
    </div>
  </section>

  {moments_head(t)}
  <section class="grid" data-render="moments"></section>
</section>

<section class="partners" id="partners">
  <h2>{t('תודה לשותפים ולתומכים', 'Thank you to our partners')}</h2>
  <p class="sub">{t('הפסטיבל לא היה מתקיים בלעדיכם.', "The festival wouldn't happen without you.")}</p>
  <div class="cat">{t('מפיקים ותומכים', 'Producers + supporters')}</div>
  <div class="logos" data-render="partners"></div>
</section>
''')


def page_lineup(t, P, A):
    return dict(
        title=t('לוח הופעות', 'Line-up'),
        desc=t('לוח ההופעות של פסטיבל הג׳אז רעננה. פסטיבל 2026: 9–12 בדצמבר.', 'The Raanana Jazz Festival line-up. Festival 2026: 9–12 December.'),
        body=hero(t('הפסטיבל הבא: 9–12 בדצמבר 2026', 'Next festival: 9–12 December 2026'), t('לוח הופעות 2025', 'Line-up 2025'), '',
                  t('התוכנייה של פסטיבל 2026 תפורסם בקרוב. בינתיים, כך נראה לוח ההופעות של פסטיבל 2025 (18–20.12.2025).',
                    'The 2026 programme will be announced soon. Meanwhile, here is the 2025 festival line-up (18–20 December 2025).'),
                  f'<a data-href="fullpass" target="_blank" rel="noopener" class="btn primary">{t("פס לכל הפסטיבל", "Full festival pass")}</a>'
                  f'<a href="{P("tickets.html")}" class="btn ghost">{t("כל אפשרויות הכרטיסים", "All ticket options")} {A}</a>') + f'''
<section class="wrap">
  <div class="daytabs" role="tablist">
    <button class="on" data-day="">{t('כל הימים', 'All days')}</button>
    <button data-day="thu">{t('חמישי 18.12', 'Thu 18.12')}</button>
    <button data-day="fri">{t('שישי 19.12', 'Fri 19.12')}</button>
    <button data-day="sat">{t('שבת 20.12', 'Sat 20.12')}</button>
  </div>
  <h2 class="sr-only">{t('כל ההופעות', 'All shows')}</h2>
  <div class="showlist" id="showlist" data-render="showlist"></div>
</section>
<section class="cta-band">
  <h2>{t('חוזרים כל ערב?', 'Coming every night?')}</h2>
  <p>{t('פס יומי במחיר משתלם מכסה את כל מופעי היום.', "A day pass covers all of that day's shows at a better price.")}</p>
  <a href="{P('tickets.html')}" class="btn">{t('לפסים היומיים', 'Day passes')} {A}</a>
</section>
''',
        script='''<script>
  document.querySelectorAll('.daytabs button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.daytabs button').forEach(x => x.classList.toggle('on', x === b));
    renderShowList(document.getElementById('showlist'), b.dataset.day);
    lazyBackgrounds();
  }));
</script>''')


def page_past(t, P, A):
    return dict(
        title=t('פסטיבל 2025 – האמנים', 'Festival 2025 – Artists'),
        desc=t('האמנים שהופיעו בפסטיבל הג׳אז רעננה 2025.', 'The artists who played the 2025 Raanana Jazz Festival.'),
        body=hero(t('מהדורות קודמות', 'Past editions'), t('פסטיבל 2025', 'Festival 2025'), '',
                  t('האמנים שהפכו את פסטיבל 2025 לבלתי נשכח – מישראל, ממרוקו, מפולין, מהונגריה, מאוסטריה, מגאורגיה, מיוון, מקפריסין ומארה״ב.',
                    'The artists who made 2025 unforgettable – from Israel, Morocco, Poland, Hungary, Austria, Georgia, Greece, Cyprus and the USA.')) + f'''
<div class="year-bar" style="margin-top:-40px;position:relative;z-index:2">
  <label for="year">{t('החליפו שנה', 'Switch year')}</label>
  <select id="year"><option selected>2025</option><option disabled>{t('2026 – בקרוב', '2026 – coming soon')}</option></select>
</div>
<h2 class="sr-only">{t('האמנים', 'The artists')}</h2>
<section class="artists" id="artists"></section>
{moments_head(t, 'h2')}
<section class="grid" data-render="moments"></section>
<section class="cta-band" style="margin-top:0">
  <h2>{t('להורדת התוכנייה של 2025', 'Download the 2025 programme')}</h2>
  <p>{t('כל ההופעות, השעות והבמות בעמוד אחד.', 'Every show, time and stage on one page.')}</p>
  <a href="/images/413f2429c54a.png" download="raanana-jazz-program-2025.png" class="btn">{t('להורדה', 'Download')} ↓</a>
</section>
''',
        script='''<script>
  document.getElementById('artists').innerHTML = SHOWS.filter(s => s.img && !s.title.startsWith('ביג בנד רעננה – חגיגת')).map(s => `
    <a class="artist" href="${page('lineup.html')}" data-bg="${img(s.img)}">
      <div class="in"><small>${dayName(dayOf(s.day))} · ${tr(s, 'venue')}</small><h3>${tr(s, 'title')}</h3><p>${tr(s, 'desc')}</p></div>
    </a>`).join('');
</script>''')


def page_venue(t, P, A):
    maps_q = '%D7%94%D7%9E%D7%A8%D7%9B%D7%96+%D7%9C%D7%9E%D7%95%D7%96%D7%99%D7%A7%D7%94+%D7%A4%D7%90%D7%99%D7%A1+%D7%A8%D7%A2%D7%A0%D7%A0%D7%94'
    return dict(
        title=t('המתחם', 'The Venue'),
        desc=t('ארבע הבמות של פסטיבל הג׳אז רעננה במרכז למוזיקה פאיס רעננה.', 'The four stages of the Raanana Jazz Festival at the Raanana Pais Music Center.'),
        body=hero(t('המרכז למוזיקה פאיס רעננה', 'Raanana Pais Music Center'), t('המתחם', 'The Venue'), t('4 במות', '4 stages'),
                  t('מהאולם המרכזי ועד הרחבה הפתוחה – כל הפסטיבל מתקיים במתחם אחד, כך שאפשר לעבור בין הופעות בכמה צעדים.',
                    'From the main hall to the open plaza, the whole festival happens in one place – every show is just a few steps away.')) + f'''
<section class="wrap section">
  <h2 class="sec-h">{t('הבמות', 'The stages')}</h2>
  <p>{t('לכל במה אופי משלה. כך נראה לוח ההופעות לפי במה:', 'Each stage has its own character. Here is the line-up by stage:')}</p>
  <div class="venues" id="venues"></div>
</section>
<section class="wrap section">
  <h2 class="sec-h">{t('איך מגיעים', 'Getting here')}</h2>
  <p>{t('הפסטיבל מתקיים ב<b>מרכז למוזיקה פאיס רעננה</b>.', 'The festival takes place at the <b>Raanana Pais Music Center</b>.')}</p>
  <iframe class="map" loading="lazy" title="{t('מפה – המרכז למוזיקה רעננה', 'Map – Raanana Music Center')}"
    src="https://www.google.com/maps?q={maps_q}&output=embed"></iframe>
  <p style="margin-top:14px"><a class="tix" style="font-family:var(--display);font-weight:700;border-bottom:3px solid var(--gold)" target="_blank" rel="noopener"
    href="https://www.google.com/maps/search/?api=1&query={maps_q}">{t('לפתיחה ב־Google Maps', 'Open in Google Maps')} {A}</a></p>
</section>
''',
        script='''<script>
  document.getElementById('venues').innerHTML = VENUES.map(v => `
    <div class="venue-card">
      <h3>${tr(v, 'name')}</h3>
      <p>${tr(v, 'desc')}</p>
      <ul>${SHOWS.filter(s => s.venue === v.name || (v.name === 'המועדון הקאמרי' && s.venue === 'הסלון הקאמרי')).map(s =>
        `<li><time>${dayOf(s.day).date} · ${s.time}</time><span>${tr(s, 'title')}</span></li>`).join('')}</ul>
    </div>`).join('');
</script>''')


def page_about(t, P, A):
    return dict(
        title=t('אודות', 'About'),
        desc=t('על פסטיבל הג׳אז רעננה – World Jazz Music.', 'About the Raanana Jazz Festival – World Jazz Music.'),
        body=hero(t('אודות', 'About'), 'World Jazz Music', '',
                  t('פסטיבל הג׳אז רעננה מביא לעיר ימים של ג׳אז ומוזיקת עולם – אמנים מישראל ומרחבי העולם, הפקות מקור שנוצרות במיוחד לפסטיבל, סדנאות לנגנים צעירים ומופעים פתוחים לכל המשפחה.',
                    'The Raanana Jazz Festival brings days of jazz and world music to the city – artists from Israel and around the world, original productions created for the festival, workshops for young musicians and open shows for the whole family.')) + f'''
<section class="wrap section">
  <div class="stats-h"><h2>{t('פסטיבל 2025', 'Festival 2025')}</h2><small>{t('במספרים · הפסטיבל הבא: 9–12 בדצמבר 2026', 'By the numbers · Next festival: 9–12 December 2026')}</small></div>
  <div class="stats">
    <div class="stat"><b>3</b><span>{t('ימים של מוזיקה חיה<br>18–20 בדצמבר', 'days of live music<br>18–20 December')}</span></div>
    <div class="stat"><b>17</b><span>{t('מופעים, מהם הפקות מקור<br>שנוצרו לפסטיבל', 'shows, including original<br>festival productions')}</span></div>
    <div class="stat"><b>4</b><span>{t('במות במתחם אחד', 'stages in one venue')}</span></div>
    <div class="stat"><b>9</b><span>{t('מדינות על הבמה', 'countries on stage')}</span></div>
  </div>
</section>
<section class="narrow section prose">
  <h2>{t('מי אנחנו', 'Who we are')}</h2>
  <p>{t('הפסטיבל מופק על ידי <b>המרכז למוזיקה פאיס רעננה</b> ו<b>עיריית רעננה</b>, בתמיכת המשרד לשיתוף פעולה אזורי. הניהול האומנותי בידי הפסנתרן והמלחין <b>עמית פרידמן</b>.',
        'The festival is produced by the <b>Raanana Pais Music Center</b> and the <b>Raanana Municipality</b>, with the support of the Ministry of Regional Cooperation. Artistic direction is by pianist and composer <b>Amit Friedman</b>.')}</p>
  <p>{t('לצד ההופעות, הפסטיבל הוא גם בית ספר: בכל שנה נגנים צעירים בגילאי 14–25 לומדים מאמנים בינלאומיים ומסיימים בהופעה על במת הפסטיבל.',
        'Alongside the concerts, the festival is also a school: every year young musicians aged 14–25 learn from international artists and finish with a performance on the festival stage.')}</p>
</section>
<section class="wrap section">
  <h2 class="sec-h">{t('המורים בסדנאות 2025', '2025 workshop faculty')}</h2>
  <div class="people" data-render="people"></div>
</section>
<section class="partners" style="margin-top:110px">
  <h2>{t('השותפים שלנו', 'Our partners')}</h2>
  <div class="logos" data-render="partners" style="margin-top:50px"></div>
</section>
''')


def page_workshops(t, P, A):
    return dict(
        title=t('סדנאות', 'Workshops'),
        desc=t('סדנאות ג׳אז לנגנים בגילאי 14–25 עם אמנים בינלאומיים.', 'Jazz workshops for musicians aged 14–25 with international artists.'),
        body=hero(t('לנגנים בגילאי 14–25', 'For musicians aged 14–25'), t('סדנאות', 'Workshops'), t('אודישן', 'Audition'),
                  t('שלושה ימים של נגינה בהרכבים, סדנאות כלי וכיתות אמן עם אמנים מניו יורק, מברלין, מפולין, מוינה ומהונגריה – ובסוף, הופעה על במת הפסטיבל.',
                    'Three days of ensemble playing, instrument workshops and masterclasses with artists from New York, Berlin, Poland, Vienna and Hungary – ending with a performance on the festival stage.'),
                  f'<a data-href="form" target="_blank" rel="noopener" class="btn primary">{t("לטופס הרשמה ואודישן", "Sign-up and audition form")}</a>') + f'''
<section class="wrap section">
  <div class="stats">
    <div class="stat"><b>3</b><span>{t('ימים · חמישי–שבת<br>18–20 בדצמבר (חופש חנוכה)', 'days · Thursday–Saturday<br>18–20 December (Hanukkah break)')}</span></div>
    <div class="stat"><b>10<em>–</em>17</b><span>{t('שעות הפעילות', 'daily hours')}</span></div>
    <div class="stat"><b>7</b><span>{t('מורים בינלאומיים', 'international teachers')}</span></div>
    <div class="stat"><b>₪2,000</b><span>{t('כולל כניסה להופעות הפסטיבל<br>על בסיס מקום פנוי', 'includes festival shows<br>subject to availability')}</span></div>
  </div>
</section>
<section class="narrow section prose">
  <h2>{t('מה בתוכנית', "What's included")}</h2>
  <ul>
    <li>{t('נגינה בהרכבים בהדרכת מורי הפסטיבל', 'Ensemble playing coached by the festival faculty')}</li>
    <li>{t('סדנאות כלי – גיטרה, בס, חצוצרה, שירה, סקסופון, תופים ופסנתר', 'Instrument workshops – guitar, bass, trumpet, voice, saxophone, drums and piano')}</li>
    <li>{t('כיתות אמן עם אמני הפסטיבל', 'Masterclasses with festival artists')}</li>
    <li>{t('הופעת סיום של הרכבי הסדנאות ברחבת הפסטיבל', 'A final performance by the workshop ensembles on the Festival Plaza')}</li>
  </ul>
  <h2>{t('איך נרשמים', 'How to apply')}</h2>
  <p>{t('ממלאים את <a data-href="form" target="_blank" rel="noopener">טופס ההרשמה</a> ושולחים אודישן מוקלט.',
        'Fill in the <a data-href="form" target="_blank" rel="noopener">sign-up form</a> and send a recorded audition.')}</p>
</section>
<section class="wrap section">
  <h2 class="sec-h">{t('המורים', 'The faculty')}</h2>
  <div class="people" data-render="people"></div>
</section>
<section class="cta-band">
  <h2>{t('מוכנים לעלות לבמה?', 'Ready to take the stage?')}</h2>
  <p>{t('ההרשמה כוללת שליחת אודישן מוקלט.', 'Applying includes sending a recorded audition.')}</p>
  <a data-href="form" target="_blank" rel="noopener" class="btn">{t('לטופס ההרשמה', 'Go to the form')} {A}</a>
</section>
''')


def page_media(t, P, A):
    return dict(
        title=t('מדיה ועיתונות', 'Media + Press'),
        desc=t('חומרים לעיתונות – לוגו, תוכנייה ותמונות מפסטיבל הג׳אז רעננה.', 'Press materials – logo, programme and photos from the Raanana Jazz Festival.'),
        body=hero(t('לעיתונאים ולמדיה', 'For journalists and media'), t('מדיה ועיתונות', 'Media + Press'), 'Press',
                  t('כאן תמצאו את הלוגו, התוכנייה ותמונות להורדה. לבקשות אקרדיטציה, ראיונות וחומרים נוספים – צרו קשר.',
                    'Download the logo, programme and photos here. For accreditation, interviews and more materials, get in touch.'),
                  f'<a id="pressMail" class="btn primary">{t("בקשת אקרדיטציה", "Request accreditation")}</a>') + f'''
<section class="wrap section">
  <h2 class="sec-h">{t('חומרים להורדה', 'Downloads')}</h2>
  <div class="dl-grid">
    <div class="dl"><div class="th" style="background-image:url(/images/44f224268148.png)"></div><h3>{t('לוגו הפסטיבל', 'Festival logo')}</h3><a href="/images/44f224268148.png" download="raanana-jazz-logo.png">{t('להורדה', 'Download')} (PNG) ↓</a></div>
    <div class="dl"><div class="th" style="background-image:url(/images/logo-dark.png);background-color:var(--ground)"></div><h3>{t('לוגו – כהה', 'Logo – dark')}</h3><a href="/images/logo-dark.png" download="raanana-jazz-logo-dark.png">{t('להורדה', 'Download')} (PNG) ↓</a></div>
    <div class="dl"><div class="th" style="background-image:url(/images/413f2429c54a.png);background-color:var(--red)"></div><h3>{t('תוכנייה 2025', '2025 programme')}</h3><a href="/images/413f2429c54a.png" download="raanana-jazz-program-2025.png">{t('להורדה', 'Download')} (PNG) ↓</a></div>
  </div>
</section>
<section class="wrap section">
  <h2 class="sec-h">{t('תמונות אמנים', 'Artist photos')}</h2>
  <p>{t('לחצו על תמונה להורדה ברזולוציה מלאה.', 'Click a photo to download it in full resolution.')}</p>
  <div class="dl-grid" id="pressPhotos"></div>
</section>
''',
        script='''<script>
  document.getElementById('pressMail').href = `mailto:${SITE.email}?subject=${encodeURIComponent(L('בקשת אקרדיטציה – פסטיבל הג׳אז רעננה', 'Press accreditation – Raanana Jazz Festival'))}`;
  document.getElementById('pressPhotos').innerHTML = SHOWS.filter(s => s.img).filter((s, i, a) => a.findIndex(x => x.img === s.img) === i).map(s => `
    <div class="dl"><div class="th photo" data-bg="${img(s.img)}"></div><h3>${tr(s, 'title')}</h3><a href="${img(s.img)}" download>${L('להורדה', 'Download')} ↓</a></div>`).join('');
</script>''')


def page_tickets(t, P, A):
    return dict(
        title=t('כרטיסים ופסים', 'Tickets + Passes'),
        desc=t('כרטיסים, פסים יומיים ופסים לפי נושאים לפסטיבל הג׳אז רעננה.', 'Tickets, day passes and themed passes for the Raanana Jazz Festival.'),
        body=hero(t('כרטיסים', 'Tickets'), t('כרטיסים ופסים', 'Tickets + Passes'), t('במחיר משתלם', 'Best value'),
                  t('פס לכל הפסטיבל, פס יומי, פס לפי נושא – או כרטיס למופע בודד. הכניסה לרחבת הפסטיבל חופשית.',
                    'A full-festival pass, a day pass, a themed pass – or a single-show ticket. Entry to the Festival Plaza is free. Tickets are sold on the Raanana Municipality ticket site (in Hebrew).')) + f'''
<section class="wrap section">
  <h2 class="sec-h">{t('פסים', 'Passes')}</h2>
  <p>{t('הדרך המשתלמת ביותר לשמוע הכי הרבה מוזיקה.', 'The best-value way to hear the most music.')}</p>
  <div class="ticket-grid" id="dayPasses"></div>
</section>
<section class="wrap section">
  <h2 class="sec-h">{t('פסים לפי נושאים', 'Themed passes')}</h2>
  <p>{t('בוחרים סגנון – ומקבלים את המופעים שמתאימים לו.', 'Pick a style and get the shows that match it.')}</p>
  <div class="ticket-grid" id="themePasses"></div>
</section>
<section class="wrap section">
  <h2 class="sec-h">{t('כרטיסים לפי מופע', 'Single-show tickets')}</h2>
  <p>{t('כל מופע עם כרטיס משלו.', 'Every show has its own ticket.')}</p>
  <div class="showlist" data-render="showlist"></div>
</section>
''',
        script='''<script>
  const buy = L('לרכישה', 'Buy') + ' ' + ARROW;
  document.getElementById('dayPasses').innerHTML =
    `<a class="tcard hot" href="${T(SITE.fullPass)}" ${ext}><small>${L('הכי משתלם', 'Best value')}</small><h3>${L('פס לכל הפסטיבל', 'Full festival pass')}</h3><p>${L('כל שלושת ימי הפסטיבל.', 'All three festival days.')}</p><span class="go">${buy}</span></a>` +
    DAYS.map(d => `<a class="tcard" href="${T(d.pass)}" ${ext}><small>${L('פס יומי', 'Day pass')}</small><h3>${dayName(d)} ${d.date}</h3><p>${SHOWS.filter(s => s.day === d.id && s.slug).length} ${L('מופעים בכרטיס אחד.', 'shows on one ticket.')}</p><span class="go">${buy}</span></a>`).join('');
  document.getElementById('themePasses').innerHTML = THEME_PASSES.map(([n, slug]) =>
    `<a class="tcard" href="${T(slug)}" ${ext}><small>${L('פס נושא', 'Themed pass')}</small><h3 style="direction:ltr;text-align:${EN ? 'left' : 'right'}">${n} Pass</h3><p>${L('מבחר מופעים בסגנון ' + n + '.', 'A selection of ' + n + ' shows.')}</p><span class="go">${buy}</span></a>`).join('');
</script>''')


def page_contact(t, P, A):
    return dict(
        title=t('צור קשר', 'Contact'),
        desc=t('יצירת קשר עם פסטיבל הג׳אז רעננה.', 'Get in touch with the Raanana Jazz Festival.'),
        body=hero(t('נשמח לשמוע מכם', "We'd love to hear from you"), t('צור קשר', 'Contact'), '',
                  t('בחרו את נושא הפנייה – ייפתח מייל עם הנושא הנכון.', 'Choose a topic and an email will open with the right subject.')) + f'''
<section class="wrap section">
  <h2 class="sr-only">{t('נושאי פנייה', 'Topics')}</h2>
  <div class="contact-grid" id="contactGrid"></div>
</section>
<section class="narrow section prose" style="text-align:center">
  <p>{t('אפשר גם לכתוב לנו באינסטגרם ובפייסבוק של המרכז למוזיקה רעננה.', 'You can also message us on the Raanana Music Center Instagram and Facebook.')}</p>
</section>
''',
        script='''<script>
  const TOPICS = EN ? [
    ['Artists', 'Want to play the festival? Tell us about your band and send links to recordings.', 'Artist inquiry'],
    ['Workshops', 'Questions about the workshops, auditions and sign-up.', 'Workshop question'],
    ['Partners + sponsors', 'Interested in supporting the festival or working with us?', 'Partnership / sponsorship'],
    ['General', 'Anything else – tickets, getting here, accessibility.', 'General inquiry'],
  ] : [
    ['אמנים', 'רוצים להופיע בפסטיבל? ספרו לנו על ההרכב ושלחו קישורים להקלטות.', 'פנייה של אמן/ית'],
    ['סדנאות', 'שאלות על הסדנאות, האודישן וההרשמה.', 'שאלה על הסדנאות'],
    ['שותפים וחסויות', 'מעוניינים לתמוך בפסטיבל או לשתף פעולה?', 'שותפות / חסות'],
    ['פנייה כללית', 'כל שאלה אחרת – כרטיסים, הגעה, נגישות.', 'פנייה כללית'],
  ];
  const suffix = L(' – פסטיבל הג׳אז רעננה', ' – Raanana Jazz Festival');
  document.getElementById('contactGrid').innerHTML = TOPICS.map(([h, p, subj]) =>
    `<a class="cbtn" href="mailto:${SITE.email}?subject=${encodeURIComponent(subj + suffix)}"><h3>${h}</h3><p>${p}</p><span>${L('לכתיבת מייל', 'Write an email')} ${ARROW}</span></a>`).join('');
</script>''')


def page_accessibility(t, P, A):
    return dict(
        title=t('הצהרת נגישות', 'Accessibility statement'),
        desc=t('הצהרת הנגישות של אתר פסטיבל הג׳אז רעננה.', 'Accessibility statement for the Raanana Jazz Festival website.'),
        body=hero(t('נגישות', 'Accessibility'), t('הצהרת נגישות', 'Accessibility statement'), '',
                  t('אנו רואים חשיבות רבה בכך שכל אחד ואחת יוכלו להשתמש באתר הפסטיבל ולהגיע להופעות.',
                    'We want everyone to be able to use the festival website and come to the shows.')) + f'''
<section class="narrow section prose">
  <h2>{t('רמת הנגישות באתר', 'Accessibility level')}</h2>
  <p>{t('האתר נבנה בהתאם לתקן הישראלי ת״י 5568, המבוסס על הנחיות WCAG 2.1 ברמה AA, ולתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות).',
        'The site follows Israeli Standard IS 5568, based on the WCAG 2.1 guidelines at level AA, and the Israeli accessibility regulations for services.')}</p>
  <h2>{t('מה עשינו באתר', 'What the site does')}</h2>
  <ul>
    <li>{t('ניווט מלא במקלדת, עם סימון ברור של הרכיב שבפוקוס וקישור "דילוג לתוכן".', 'Full keyboard navigation with a clear focus outline and a "skip to content" link.')}</li>
    <li>{t('ניגודיות צבעים בהתאם לתקן בטקסט ובכפתורים.', 'Colour contrast that meets the standard for text and buttons.')}</li>
    <li>{t('מבנה כותרות תקין ותיאור טקסטואלי לתמונות.', 'A correct heading structure and text descriptions for images.')}</li>
    <li>{t('אזורי לחיצה בגודל מתאים למסכי מגע.', 'Tap targets sized for touch screens.')}</li>
    <li>{t('כיבוד הגדרת "הפחתת תנועה" במכשיר – האנימציות מצטמצמות.', 'The device setting "reduce motion" is respected – animations are reduced.')}</li>
    <li>{t('האתר זמין בעברית ובאנגלית ומותאם לטלפונים.', 'The site is available in Hebrew and English and works on phones.')}</li>
  </ul>
  <h2>{t('הסדרי נגישות בפסטיבל', 'Accessibility at the festival')}</h2>
  <p>{t('לפרטים על הסדרי הנגישות במרכז למוזיקה פאיס רעננה (חניה, גישה לאולמות ומקומות ישיבה נגישים) – פנו אלינו בפרטים שלמטה.',
        'For accessibility arrangements at the Raanana Pais Music Center (parking, hall access and accessible seating), contact us using the details below.')}</p>
  <h2>{t('מגבלות ידועות', 'Known limitations')}</h2>
  <ul>
    <li>{t('רכישת הכרטיסים מתבצעת באתר הכרטיסים של עיריית רעננה, שאינו בשליטתנו.', 'Tickets are sold on the Raanana Municipality ticket site, which we do not control.')}</li>
    <li>{t('התוכנייה המלאה מוצגת כתמונה; כל המידע שבה זמין גם כטקסט בעמוד לוח ההופעות.', 'The full programme is shown as an image; all of its information is also available as text on the Line-up page.')}</li>
  </ul>
  <h2>{t('נתקלתם בבעיה?', 'Found a problem?')}</h2>
  <p>{t('נשמח לשמוע ולתקן. פנו לרכז/ת הנגישות:', 'Tell us and we will fix it. Contact the accessibility coordinator:')}</p>
  <p class="note" id="a11yContact"></p>
  <p>{t('ההצהרה עודכנה לאחרונה:', 'Last updated:')} <span id="a11yDate"></span></p>
</section>
''',
        script='''<script>
  const c = SITE.a11yContact || {};
  const lines = [c.name, c.phone, c.email || SITE.email].filter(Boolean);
  document.getElementById('a11yContact').innerHTML = lines.map(l => /@/.test(l) ? `<a href="mailto:${l}">${l}</a>` : l).join('<br>');
  document.getElementById('a11yDate').textContent = SITE.a11yUpdated;
</script>''')


def page_404(t, P, A):
    return dict(
        title=t('העמוד לא נמצא', 'Page not found'),
        desc=t('העמוד שחיפשתם לא נמצא.', 'The page you were looking for was not found.'),
        body=f'''<section class="page-hero grain notfound">
  <div>
    <div class="eyebrow">404</div>
    <h1>{t('העמוד לא נמצא', 'Page not found')}</h1>
    <p class="lead">{t('אולי הקישור השתנה. כל ההופעות, הכרטיסים והסדנאות נמצאים כאן:', 'The link may have changed. Every show, ticket and workshop is here:')}</p>
    <div class="ctas">
      <a href="{P('index.html')}" class="btn primary">{t('לדף הבית', 'Home')}</a>
      <a href="{P('lineup.html')}" class="btn ghost">{t('ללוח ההופעות', 'Line-up')} {A}</a>
    </div>
    <p class="lead" lang="{t('en', 'he')}">{t('Page not found – <a href="/en/" style="text-decoration:underline">English site</a>', 'הדף לא נמצא – <a href="/" style="text-decoration:underline">לאתר בעברית</a>')}</p>
  </div>
</section>''')


PAGES = {
    'index.html': page_index, 'lineup.html': page_lineup, 'festival-2025.html': page_past,
    'venue.html': page_venue, 'about.html': page_about, 'workshops.html': page_workshops,
    'media.html': page_media, 'tickets.html': page_tickets, 'contact.html': page_contact,
    'accessibility.html': page_accessibility,
}


def url_path(base, name):
    return base + ('' if name == 'index.html' else name)


for lang, cfg in LANGS.items():
    t = (lambda he, en: he) if lang == 'he' else (lambda he, en: en)
    P = lambda f, base=cfg['base']: base + f
    os.makedirs(cfg['out'], exist_ok=True)
    for name, fn in PAGES.items():
        p = fn(t, P, cfg['arrow'])
        title = p['title'] if p.get('no_suffix') else p['title'] + cfg['suffix']
        html = HEAD.format(lang=lang, dir=cfg['dir'], title=title, desc=p['desc'], ver=VER, site=SITE_URL, extra_head=p.get('head', ''),
                           self_path=url_path(cfg['base'], name),
                           he_path=url_path('/', name), en_path=url_path('/en/', name)) \
            + '<main id="main">\n' + p['body'] + '\n</main>\n' + FOOT.format(script=p.get('script', ''), ver=VER)
        with open(os.path.join(cfg['out'], name), 'w') as f:
            f.write(html)
    print(f'wrote {len(PAGES)} {lang} pages → {cfg["out"]}/')
    if lang == 'he':
        p = page_404(t, P, cfg['arrow'])
        html = HEAD.format(lang=lang, dir=cfg['dir'], title=p['title'] + cfg['suffix'], desc=p['desc'], ver=VER, site=SITE_URL,
                           extra_head='<meta name="robots" content="noindex">', self_path='/404.html', he_path='/', en_path='/en/') \
            + '<main id="main">\n' + p['body'] + '\n</main>\n' + FOOT.format(script='', ver=VER)
        open('404.html', 'w').write(html)
        print('wrote 404.html')
