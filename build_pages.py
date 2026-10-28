# Generates the static HTML pages in Hebrew (/) and English (/en/).
# Each page is a function of `t(he, en)`, so both languages live side by side.
# Run: python3 build_pages.py
import os
import re
import shutil
import subprocess
import sys
import time

import hashlib

os.chdir(os.path.dirname(os.path.abspath(__file__)))

# ---------------------------------------------------------------------
#  Where the site lives
#  Before launch the whole site (pages, assets, images) sits in one hidden
#  folder whose name is the secret path, and the main address shows a
#  "coming soon" page. The folder is found automatically: it is the
#  top-level folder that holds assets/site.js, so its name is written
#  nowhere else. To launch, run: python3 build_pages.py --launch
#  (see README).
# ---------------------------------------------------------------------
def find_site_dir():
    if os.path.isfile('assets/site.js'):
        return ''
    for d in sorted(os.listdir('.')):
        if os.path.isfile(os.path.join(d, 'assets', 'site.js')):
            return d
    raise SystemExit('No site found: expected assets/site.js at the root or in one top-level folder.')


SITE_DIR = find_site_dir()          # '' = live at the domain root


def launch():
    """python3 build_pages.py --launch: drop the coming-soon page, move the
    hidden site to the root, then rebuild it as the public site."""
    if not SITE_DIR:
        raise SystemExit('The site is already at the root.')
    subprocess.run(['git', 'rm', '-q', '-r', '--ignore-unmatch', 'index.html', '404.html', 'soon'], check=True)

    def move(src, dst):
        if os.path.isdir(src) and os.path.isdir(dst):      # merge into a folder that already exists
            for name in os.listdir(src):
                move(os.path.join(src, name), os.path.join(dst, name))
            os.rmdir(src)
        elif subprocess.run(['git', 'mv', src, dst], capture_output=True).returncode:
            os.replace(src, dst)                            # untracked file: plain move
    for name in os.listdir(SITE_DIR):
        move(os.path.join(SITE_DIR, name), name)
    os.rmdir(SITE_DIR)
    print('Moved the site to the root. Rebuilding…')
    os.execv(sys.executable, [sys.executable, os.path.abspath(__file__)])


if '--launch' in sys.argv:
    launch()

HIDDEN = bool(SITE_DIR)
ROOT = '/' + SITE_DIR if HIDDEN else ''
OUT = SITE_DIR or '.'

# cache-busting version = hash of the shared assets, so any change gets a new URL
VER = hashlib.sha1(b''.join(open(os.path.join(OUT, f), 'rb').read() for f in ('assets/site.css', 'assets/site.js', 'assets/data.js'))).hexdigest()[:10]
SITE_URL = 'https://raananajazzfestival.com'
LANGS = {
    'he': dict(dir='rtl', base='/', out=OUT, suffix=' | פסטיבל הג׳אז רעננה', arrow='<i class="arr" aria-hidden="true">←</i>'),
    'en': dict(dir='ltr', base='/en/', out=os.path.join(OUT, 'en'), suffix=' | Raanana Jazz Festival', arrow='<i class="arr" aria-hidden="true">→</i>'),
}
# hidden pages stay out of search engines
ROBOTS = '<meta name="robots" content="noindex, nofollow">' if HIDDEN else ''


def rooted(html):
    """Pages are written as if they sat at the domain root; move every
    root-relative URL (href="/…", src="/…", url(/…)) into ROOT."""
    if not ROOT:
        return html
    html = re.sub(r'(\s[\w:-]+=")/(?!/)', lambda m: m.group(1) + ROOT + '/', html)
    return re.sub(r"url\((['\"]?)/(?!/)", lambda m: 'url(' + m.group(1) + ROOT + '/', html)


HEAD = '''<!doctype html>
<html lang="{lang}" dir="{dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
{robots}
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
        desc=t('פסטיבל הג׳אז רעננה – World Jazz Music. 10–12 בדצמבר 2026, שלושה ימים של מוזיקה חיה במרכז למוזיקה רעננה.',
               'Raanana Jazz Festival – World Jazz Music. 10–12 December 2026: three days of live music at the Raanana Music Center.'),
        no_suffix=True,
        body=f'''
<section class="hero grain">
  <div class="hero-inner">
    <div>
      <h1 class="hero-title">
        <img class="hw hw-fest" src="/images/word-festival-{t('he','en')}.png" width="{t('411','597')}" height="{t('125','90')}" alt="">
        <span class="logo-dots"><img class="main-logo" src="/images/logo-nodots.png" width="1052" height="794" alt="{t('World Jazz Music – פסטיבל הג׳אז רעננה 2026', 'World Jazz Music – Raanana Jazz Festival 2026')}"><img class="ld ld1" src="/images/logo-dot1.png" alt=""><img class="ld ld2" src="/images/logo-dot2.png" alt=""><img class="ld ld3" src="/images/logo-dot3.png" alt=""></span>
        <img class="hw hw-raan" src="/images/word-raanana-{t('he','en')}.png" width="{t('416','604')}" height="{t('109','101')}" alt="">
      </h1>
      <div class="meta">
        <div class="dates" aria-label="10–12 DEC 2026"><span class="d-num">10–12</span><small>DEC 2026</small></div>
        <div class="dir"><span>{t('ניהול אומנותי:', 'Artistic director:')}</span> {t('עמית פרידמן', 'Amit Friedman')}</div>
        <div class="ctas">
          <a href="{P('lineup.html')}" class="btn primary">{t('ללוח ההופעות 2026', 'See the 2026 line-up')}</a>
          <a href="#programme-2026" class="btn ghost">{t('מה בתוכנייה', 'What’s on')} ↓</a>
        </div>
      </div>
    </div>
  </div>
  <div class="cd-strip">
    <div class="cd-in">
      <p class="cd-label" id="cdLabel">{t('הפסטיבל נפתח בעוד:', 'The festival opens in:')}</p>
      <div class="countdown" id="countdown" role="timer" aria-labelledby="cdLabel" hidden>
        <div class="u"><b data-k="d">00</b><small>{t('ימים', 'days')}</small></div>
        <div class="u"><b data-k="h">00</b><small>{t('שעות', 'hours')}</small></div>
        <div class="u"><b data-k="m">00</b><small>{t('דקות', 'minutes')}</small></div>
        <div class="u sec"><b data-k="s">00</b><small>{t('שניות', 'seconds')}</small></div>
      </div>
    </div>
  </div>
</section>

<section class="now-strip" data-render="now" hidden aria-live="polite"></section>

<section class="next" aria-labelledby="next-h">
  <h2 id="next-h">{t('פסטיבל 2026', 'Festival 2026')}</h2>
  <p>{t('שלושה ימים של ג׳אז ומוזיקת עולם במרכז למוזיקה רעננה – אמנים מישראל ומרחבי העולם, הפקות מקור, סדנאות לנגנים צעירים ומופעים לכל המשפחה.',
        'Three days of jazz and world music at the Raanana Music Center – artists from Israel and around the world, original productions, workshops for young musicians and shows for the whole family.')}</p>
  <ul class="facts">
    <li><b>10–12.12</b><span>{t('שלושה ימים, חמישי עד שבת', 'Three days, Thursday to Saturday')}</span></li>
    <li><b>18</b><span>{t('הופעות בחמש במות – כולל האוהל, במת הלילה החדשה', 'shows on five stages – including the Tent, our new late-night stage')}</span></li>
    <li><b>14–25</b><span>{t('סדנאות לנגנים צעירים – ההרשמה תיפתח בקרוב.', 'Workshops for young musicians – sign-up opens soon.')}</span><a href="{P('workshops.html')}">{t('על הסדנאות', 'About the workshops')} {A}</a></li>
  </ul>
</section>

<section id="programme-2026" aria-labelledby="p26-h">
  <div class="stitle">
    <h2 id="p26-h">{t('התוכנייה 2026', 'The 2026 programme')}</h2>
    <p>{t('10–12 בדצמבר 2026 · פרטי הכרטיסים יפורסמו בקרוב.', '10–12 December 2026 · ticket details coming soon.')}</p>
  </div>
  <section class="featured" data-render="featured" aria-label="{t('הופעות נבחרות', 'Selected shows')}"></section>

  <h3 class="subhead" id="lineup">{t('לוח ההופעות', 'Line-up')}</h3>
  <section class="schedule" data-render="schedule"></section>
  <p class="sched-more"><a class="g-text" href="{P('lineup.html')}">{t('ללו״ז המלא לפי במות, עם ״הליינאפ שלי״', 'Full timetable by stage, with “My line-up”')} {A}</a></p>
</section>

<section id="festival-2025" aria-labelledby="f25-h">
  <div class="stitle">
    <h2 id="f25-h">{t('פסטיבל 2025', 'Festival 2025')}</h2>
    <p>{t('18–20 בדצמבר 2025 · רגעים מהשנה שעברה.', '18–20 December 2025 · moments from last year.')} <a class="g-text" href="{P('festival-2025.html')}#gallery">{t('לגלריה המלאה – 665 תמונות', 'The full gallery – 665 photos')} {A}</a></p>
  </div>
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
        desc=t('לוח ההופעות של פסטיבל הג׳אז רעננה. פסטיבל 2026: 10–12 בדצמבר.', 'The Raanana Jazz Festival line-up. Festival 2026: 10–12 December.'),
        body=hero(t('10–12 בדצמבר 2026', '10–12 December 2026'), t('לוח הופעות 2026', 'Line-up 2026'), '',
                  t('שלושה ימים, חמש במות ו־18 הופעות – מבוקר לילדים ועד הופעות הלילה באוהל. פרטי הכרטיסים יפורסמו בקרוב.',
                    'Three days, five stages and 18 shows – from children’s mornings to late nights in the Tent. Ticket details coming soon.'),
                  f'<a href="{P("guide.html")}" class="btn primary">{t("מידע למבקרים", "Visitor info")}</a>'
                  f'<a href="{P("tickets.html")}" class="btn ghost">{t("כרטיסים", "Tickets")} {A}</a>') + f'''
<section class="wrap section lu">
  <h2 class="sec-h">{t('האמנים', 'The artists')}</h2>
  <p>{t('לחצו על שם כדי לראות מתי ואיפה.', 'Tap a name to see when and where.')}</p>
  <div data-render="cloud"></div>
</section>
<section class="wrap section">
  <h2 class="sec-h">{t('לו״ז לפי במות', 'Timetable by stage')}</h2>
  <p>{t('סמנו ☆ על ההופעות שלא תרצו לפספס – הן יישמרו ב״הליינאפ שלי״ בדפדפן הזה.', 'Mark ☆ on the shows you don’t want to miss – they stay in “My line-up” in this browser.')}</p>
  <div data-render="timetable"></div>
</section>
<section class="wrap section">
  <h2 class="sec-h">{t('כל ההופעות', 'All shows')}</h2>
  <div class="daytabs" role="tablist">
    <button class="on" data-day="">{t('כל הימים', 'All days')}</button>
    <button data-day="thu">{t('חמישי 10.12', 'Thu 10.12')}</button>
    <button data-day="fri">{t('שישי 11.12', 'Fri 11.12')}</button>
    <button data-day="sat">{t('שבת 12.12', 'Sat 12.12')}</button>
  </div>
  <div class="showlist" id="showlist" data-render="showlist"></div>
</section>
<section class="cta-band">
  <h2>{t('לפני שמגיעים', 'Before you go')}</h2>
  <p>{t('הגעה, חניה, משפחות, נגישות ושאלות נפוצות – הכל בעמוד אחד.', 'Getting here, parking, families, accessibility and FAQ – all on one page.')}</p>
  <a href="{P('guide.html')}" class="btn">{t('למידע למבקרים', 'Visitor info')} {A}</a>
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
        title=t('פסטיבל 2025', 'Festival 2025'),
        desc=t('פסטיבל הג׳אז רעננה 2025 בתמונות: רגעים מההופעות, מהקהל ומהלובי, ולוח ההופעות של אותה שנה.',
               'The 2025 Raanana Jazz Festival in photos: moments from the shows, the audience and the lobby, and that year’s line-up.'),
        body=hero(t('מהדורות קודמות', 'Past editions'), t('פסטיבל 2025', 'Festival 2025'), '',
                  t('18–20 בדצמבר 2025: שלושה ימים של ג׳אז ומוזיקת עולם במרכז למוזיקה רעננה – כך זה נראה מהקהל, מהבמה ומהלובי.',
                    '18–20 December 2025: three days of jazz and world music at the Raanana Music Center – as seen from the audience, the stage and the lobby.')) + f'''
<section class="wrap section" id="gallery" aria-labelledby="gal-h">
  <h2 class="sec-h" id="gal-h">{t('גלריה מהפסטיבל', 'Festival gallery')}</h2>
  <p>{t('לחצו על תמונה כדי לראות אותה בגדול.', 'Tap a photo to see it larger.')}</p>
  <div id="gal2025"></div>
</section>
<section class="wrap section" aria-labelledby="lu25-h">
  <h2 class="sec-h" id="lu25-h">{t('מי הופיע ב־2025', 'Who played in 2025')}</h2>
  <div class="schedule" id="lineup2025"></div>
</section>
<section class="cta-band">
  <h2>{t('להורדת התוכנייה של 2025', 'Download the 2025 programme')}</h2>
  <p>{t('כל ההופעות, השעות והבמות בעמוד אחד.', 'Every show, time and stage on one page.')}</p>
  <a href="/images/413f2429c54a.png" download="raanana-jazz-program-2025.png" class="btn">{t('להורדה', 'Download')} ↓</a>
</section>
''',
        script='''<script>
  document.getElementById('lineup2025').innerHTML = DAYS_2025.map(d => `
    <div class="daycol">
      <header><h3>${dayName(d)}</h3><span>${d.date}</span></header>
      ${SHOWS_2025.filter(s => s.day === d.id).map(s => `
        <div class="slot"><time>${s.time}</time><div><div class="t">${tr(s, 'title')}</div><div class="v">${tr(s, 'venue')}</div></div></div>`).join('')}
    </div>`).join('');
</script>''' + f'''
<script src="/assets/gallery-2025.js?v={VER}"></script>
<script>renderGallery(document.getElementById('gal2025'), window.GALLERY_2025, 'gallery-2025');</script>''')


def page_venue(t, P, A):
    maps_q = '%D7%94%D7%9E%D7%A8%D7%9B%D7%96+%D7%9C%D7%9E%D7%95%D7%96%D7%99%D7%A7%D7%94+%D7%A4%D7%99%D7%A1+%D7%A8%D7%A2%D7%A0%D7%A0%D7%94'
    return dict(
        title=t('המתחם', 'The Venue'),
        desc=t('חמש הבמות של פסטיבל הג׳אז רעננה במרכז למוזיקה פיס רעננה.', 'The five stages of the Raanana Jazz Festival at the Raanana Pais Music Center.'),
        body=hero(t('המרכז למוזיקה פיס רעננה', 'Raanana Pais Music Center'), t('המתחם', 'The Venue'), t('5 במות', '5 stages'),
                  t('מהאולם המרכזי ועד הרחבה הפתוחה – כל הפסטיבל מתקיים במתחם אחד, כך שאפשר לעבור בין הופעות בכמה צעדים.',
                    'From the main hall to the open plaza, the whole festival happens in one place – every show is just a few steps away.')) + f'''
<section class="wrap section">
  <h2 class="sec-h">{t('הבמות', 'The stages')}</h2>
  <p>{t('לכל במה אופי משלה. כך נראה לוח ההופעות לפי במה:', 'Each stage has its own character. Here is the line-up by stage:')}</p>
  <div class="venues" id="venues"></div>
</section>
<section class="wrap section">
  <h2 class="sec-h">{t('איך מגיעים', 'Getting here')}</h2>
  <p>{t('הפסטיבל מתקיים ב<b>מרכז למוזיקה פיס רעננה</b>.', 'The festival takes place at the <b>Raanana Pais Music Center</b>.')}</p>
  <iframe class="map" loading="lazy" title="{t('מפה – המרכז למוזיקה רעננה', 'Map – Raanana Music Center')}"
    src="https://www.google.com/maps?q={maps_q}&output=embed"></iframe>
  <p style="margin-top:14px"><a class="g-text" target="_blank" rel="noopener"
    href="https://www.google.com/maps/search/?api=1&query={maps_q}">{t('לפתיחה ב־Google Maps', 'Open in Google Maps')} {A}</a></p>
</section>
''',
        script='''<script>
  document.getElementById('venues').innerHTML = VENUES.map(v => `
    <div class="venue-card">
      <h3>${tr(v, 'name')}</h3>
      <p>${tr(v, 'desc')}</p>
      <ul>${SHOWS.filter(s => s.venue === v.name).map(s =>
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
  <div class="stats-h"><h2>{t('פסטיבל 2025', 'Festival 2025')}</h2><small>{t('במספרים · הפסטיבל הבא: 10–12 בדצמבר 2026', 'By the numbers · Next festival: 10–12 December 2026')}</small></div>
  <div class="stats">
    <div class="stat"><b>3</b><span>{t('ימים של מוזיקה חיה<br>18–20 בדצמבר', 'days of live music<br>18–20 December')}</span></div>
    <div class="stat"><b>17</b><span>{t('מופעים, מהם הפקות מקור<br>שנוצרו לפסטיבל', 'shows, including original<br>festival productions')}</span></div>
    <div class="stat"><b>4</b><span>{t('במות במתחם אחד', 'stages in one venue')}</span></div>
    <div class="stat"><b>9</b><span>{t('מדינות על הבמה', 'countries on stage')}</span></div>
  </div>
</section>
<section class="narrow section prose">
  <h2>{t('מי אנחנו', 'Who we are')}</h2>
  <p>{t('הפסטיבל מופק על ידי <b>המרכז למוזיקה פיס רעננה</b> ו<b>עיריית רעננה</b>, בתמיכת המשרד לשיתוף פעולה אזורי. הניהול האומנותי בידי הפסנתרן והמלחין <b>עמית פרידמן</b>.',
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
  document.getElementById('pressPhotos').innerHTML = SHOWS.concat(SHOWS_2025).filter(s => s.img).filter((s, i, a) => a.findIndex(x => x.img === s.img) === i).map(s => `
    <div class="dl"><div class="th photo" data-bg="${img(s.img)}"></div><h3>${tr(s, 'title')}</h3><a href="${img(s.img)}" download>${L('להורדה', 'Download')} ↓</a></div>`).join('');
</script>''')


def page_tickets(t, P, A):
    return dict(
        title=t('כרטיסים', 'Tickets'),
        desc=t('כרטיסים לפסטיבל הג׳אז רעננה 2026.', 'Tickets for the 2026 Raanana Jazz Festival.'),
        body=hero(t('10–12 בדצמבר 2026', '10–12 December 2026'), t('כרטיסים', 'Tickets'), '',
                  t('פרטי הכרטיסים והפסים לפסטיבל 2026 יפורסמו בקרוב. המופעים ברחבת הפסטיבל – בכניסה חופשית.',
                    'Ticket and pass details for the 2026 festival will be published soon. Shows on the Festival Plaza are free.'),
                  f'<a href="https://www.instagram.com/world.jazz.music/" target="_blank" rel="noopener" class="btn primary">{t("לעדכונים באינסטגרם", "Updates on Instagram")}</a>'
                  f'<a href="{P("lineup.html")}" class="btn ghost">{t("ללוח ההופעות", "See the line-up")} {A}</a>') + f'''
<section class="wrap section">
  <h2 class="sec-h">{t('בכניסה חופשית', 'Free entry')}</h2>
  <p>{t('ההופעות האלה ברחבת הפסטיבל פתוחות לכולם, בלי כרטיס.', 'These Festival Plaza shows are open to everyone, no ticket needed.')}</p>
  <div class="showlist" id="freeShows"></div>
</section>
''',
        script='''<script>
  renderShowList(document.getElementById('freeShows'));
  document.querySelectorAll('#freeShows .showrow').forEach((row, i) => { if (!SHOWS[i].free && !SHOWS[i].kids) row.remove(); });
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
  <p>{t('לפרטים על הסדרי הנגישות במרכז למוזיקה פיס רעננה (חניה, גישה לאולמות ומקומות ישיבה נגישים) – פנו אלינו בפרטים שלמטה.',
        'For accessibility arrangements at the Raanana Pais Music Center (parking, hall access and accessible seating), contact us using the details below.')}</p>
  <h2>{t('מגבלות ידועות', 'Known limitations')}</h2>
  <ul>
    <li>{t('רכישת הכרטיסים מתבצעת באתר הכרטיסים של עיריית רעננה, שאינו בשליטתנו.', 'Tickets are sold on the Raanana Municipality ticket site, which we do not control.')}</li>
    <li>{t('התוכנייה המלאה מוצגת כתמונה; כל המידע שבה זמין גם כטקסט בעמוד לוח ההופעות.', 'The full programme is shown as an image; all of its information is also available as text on the Line-up page.')}</li>
  </ul>
  <h2>{t('נתקלתם בבעיה?', 'Found a problem?')}</h2>
  <p id="a11yAsk">{t('נשמח לשמוע ולתקן. פנו אלינו:', 'Tell us and we will fix it. Contact us:')}</p>
  <p class="note" id="a11yContact"></p>
  <p>{t('ההצהרה עודכנה לאחרונה:', 'Last updated:')} <span id="a11yDate"></span></p>
</section>
''',
        script='''<script>
  const c = SITE.a11yContact || {};
  const lines = [c.name, c.phone, c.email || SITE.email].filter(Boolean);
  if (c.name) document.getElementById('a11yAsk').textContent = L('נשמח לשמוע ולתקן. פנו לרכז/ת הנגישות:', 'Tell us and we will fix it. Contact the accessibility coordinator:');
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


def page_guide(t, P, A):
    maps_q = '%D7%94%D7%9E%D7%A8%D7%9B%D7%96+%D7%9C%D7%9E%D7%95%D7%96%D7%99%D7%A7%D7%94+%D7%A4%D7%99%D7%A1+%D7%A8%D7%A2%D7%A0%D7%A0%D7%94'
    tabs = [
        ('arrive', t('הגעה', 'Getting here'), t('הגעה למתחם', 'Getting here'), f"""
      <p>{t('כל הפסטיבל מתקיים במתחם אחד – <b>המרכז למוזיקה פיס רעננה</b>. חמש הבמות קרובות זו לזו, כך שאפשר לעבור בין הופעות בכמה צעדים.',
            'The whole festival takes place in one venue – <b>the Raanana Pais Music Center</b>. The five stages are close together, so every show is a few steps away.')}</p>
      <p>{t('<b>חניה:</b> החניה בכל אזור המרכז חופשית (מדרכה אפורה), ואפשר לחנות בכל מקום. אם הסביבה עמוסה, אפשר לחנות בחניון אשכול הפיס בפינת הרחובות החייל והנשיאים – גם שם החניה חופשית.',
            '<b>Parking:</b> parking all around the center is free (grey kerb), so you can park anywhere. If the area is busy, use the Eshkol HaPais car park at the corner of HaChayal and HaNesi’im streets – also free.')}</p>
      <div class="g-links">
        <a class="btn primary" target="_blank" rel="noopener" href="https://waze.com/ul?q={maps_q}&navigate=yes">{t('ניווט ב־Waze', 'Navigate with Waze')}</a>
        <a class="g-text" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query={maps_q}">{t('לפתיחה ב־Google Maps', 'Open in Google Maps')} {A}</a>
      </div>
      <p class="g-more"><a href="{P('venue.html')}">{t('למתחם ולבמות', 'The venue and its stages')} {A}</a></p>"""),
        ('tickets', t('כרטיסים', 'Tickets'), t('כרטיסים ופסים', 'Tickets and passes'), f"""
      <p>{t('הכרטיסים נמכרים באתר הכרטיסים של עיריית רעננה. אפשר לקנות כרטיס להופעה אחת, <b>פס יומי</b> לכל מופעי היום, <b>פס לכל הפסטיבל</b> או פס לפי נושא.',
            'Tickets are sold on the Raanana Municipality ticket site. You can buy a ticket for one show, a <b>day pass</b> for all of that day’s shows, a <b>full festival pass</b> or a themed pass.')}</p>
      <p>{t('המופעים ברחבת הפסטיבל – בכניסה חופשית.', 'Shows on the Festival Plaza are free.')}</p>
      <p class="g-note">{t('התוכנייה של 2026 כבר באתר; פרטי הכרטיסים לפסטיבל 2026 יפורסמו בקרוב.', 'The 2026 programme is out; ticket details for 2026 will be published soon.')}</p>
      <p class="g-more"><a href="{P('tickets.html')}">{t('לעמוד הכרטיסים', 'Tickets page')} {A}</a></p>"""),
        ('families', t('משפחות', 'Families'), t('משפחות וילדים', 'Families and children'), f"""
      <p>{t('רחבת הפסטיבל היא הלב הפתוח של הפסטיבל: מופעים לכל המשפחה, בכניסה חופשית.',
            'The Festival Plaza is the open heart of the festival: shows for the whole family, free of charge.')}</p>
      <p>{t('בכל בוקר ב־11:00 – הופעה לילדים: ״תנינים על הראש״ עם מארש דונדורמה (חמישי), ״תנו לי תו״ עם רני גולן (שישי) ו״ילדוג׳אז״ (שבת). וב־17:00 כל יום – הופעה בכניסה חופשית ברחבה.',
            'Every morning at 11:00 there is a children’s show: “Crocodiles on the Head” with Marsh Dondurma (Thursday), “Give Me a Note” with Rani Golan (Friday) and “Yaldojazz” (Saturday). And every day at 17:00 there is a free show on the Plaza.')}</p>
      <p class="g-more"><a href="{P('lineup.html')}">{t('ללוח ההופעות', 'See the line-up')} {A}</a></p>"""),
        ('access', t('נגישות', 'Accessibility'), t('נגישות', 'Accessibility'), f"""
      <p>{t('אנחנו רוצים שכולם יוכלו ליהנות מהפסטיבל. פרטים על הסדרי הנגישות ועל דרכי הפנייה בנושא נמצאים בהצהרת הנגישות.',
            'We want everyone to enjoy the festival. Details of the accessibility arrangements and how to contact us about them are in the accessibility statement.')}</p>
      <p class="g-more"><a href="{P('accessibility.html')}">{t('להצהרת הנגישות', 'Accessibility statement')} {A}</a></p>"""),
        ('shabbat', t('שבת', 'Saturday'), t('שבת בפסטיבל', 'Saturday at the festival'), f"""
      <p>{t('הפסטיבל נמשך עד מוצאי שבת. בשבת, 12 בדצמבר: ״ילדוג׳אז״ ב־11:00, הרצאה של ד״ר רז יצחקי עם הזמרת חן לוי ב־12:00, הופעת הרכבי הסדנאות בכניסה חופשית ב־17:00, ומופעי הערב מ־18:00 ועד הופעת הסיום באוהל ב־21:00.',
            'The festival runs until Saturday night. On Saturday 12 December: “Yaldojazz” at 11:00, a talk by Dr. Raz Yitzhaki with singer Chen Levi at 12:00, the free workshop-ensembles concert at 17:00, and the evening shows from 18:00 to the closing show in the Tent at 21:00.')}</p>"""),
        ('workshops', t('סדנאות', 'Workshops'), t('סדנאות לנגנים צעירים', 'Workshops for young musicians'), f"""
      <p>{t('לצד ההופעות מתקיימות סדנאות ג׳אז לנגנים בגילאי 14–25: נגינה בהרכבים, סדנאות כלי וכיתות אמן עם אמנים בינלאומיים – ובסוף, הופעה על במת הפסטיבל.',
            'Alongside the shows there are jazz workshops for musicians aged 14–25: ensemble playing, instrument workshops and masterclasses with international artists – ending with a performance on the festival stage.')}</p>
      <p class="g-more"><a href="{P('workshops.html')}">{t('פרטים והרשמה', 'Details and sign-up')} {A}</a></p>"""),
    ]
    ig = 'https://www.instagram.com/world.jazz.music/'
    faq = [
        (t('כרטיסים', 'Tickets'), [
            (t('איפה קונים כרטיסים?', 'Where do I buy tickets?'),
             t(f'באתר הכרטיסים של עיריית רעננה. כל הקישורים נמצאים <a href="{P("tickets.html")}">בעמוד הכרטיסים</a>.',
               f'On the Raanana Municipality ticket site. All the links are on <a href="{P("tickets.html")}">the tickets page</a>.')),
            (t('יש פס יומי?', 'Is there a day pass?'),
             t('כן. פס יומי מכסה את כל מופעי היום במחיר משתלם.', "Yes. A day pass covers all of that day's shows at a better price.")),
            (t('יש פס לכל הפסטיבל?', 'Is there a full festival pass?'),
             t('כן, וגם פסים לפי נושאים.', 'Yes, and themed passes too.')),
            (t('אפשר לבטל כרטיס?', 'Can I cancel a ticket?'),
             t(f'כן. ביטול עד 24 שעות לפני תחילת המופע מזכה בהחזר מלא. לביטול – <a href="{P("contact.html")}">פנו אלינו</a>.',
               f'Yes. Cancel up to 24 hours before the show starts for a full refund. To cancel, <a href="{P("contact.html")}">contact us</a>.')),
            (t('כל המופעים בתשלום?', 'Are all shows ticketed?'),
             t('לא. המופעים ברחבת הפסטיבל בכניסה חופשית.', 'No. Shows on the Festival Plaza are free.')),
        ]),
        (t('מידע כללי', 'General'), [
            (t('מתי הפסטיבל?', 'When is the festival?'),
             t('10–12 בדצמבר 2026, חמישי עד שבת.', '10–12 December 2026, Thursday to Saturday.')),
            (t('איפה הפסטיבל מתקיים?', 'Where does it take place?'),
             t(f'במרכז למוזיקה פיס רעננה, בחמש במות. <a href="{P("venue.html")}">על המתחם</a>.',
               f'At the Raanana Pais Music Center, on five stages. <a href="{P("venue.html")}">About the venue</a>.')),
            (t('איפה התוכנייה של 2026?', 'Where is the 2026 programme?'),
             t(f'כבר באתר – <a href="{P("lineup.html")}">בלוח ההופעות</a>. עדכונים נוספים <a href="{ig}" target="_blank" rel="noopener">באינסטגרם של World Jazz Music</a>.',
               f'It’s out – see <a href="{P("lineup.html")}">the line-up</a>. More news on <a href="{ig}" target="_blank" rel="noopener">World Jazz Music on Instagram</a>.')),
            (t('איפה חונים?', 'Where do I park?'),
             t('החניה בכל אזור המרכז חופשית (מדרכה אפורה). אם הסביבה עמוסה – בחניון אשכול הפיס בפינת הרחובות החייל והנשיאים, גם הוא בחינם.',
               'Parking around the center is free (grey kerb). If it’s busy, use the Eshkol HaPais car park at the corner of HaChayal and HaNesi’im streets – also free.')),
            (t('יש מופעים לילדים?', 'Are there shows for children?'),
             t('כן. ברחבת הפסטיבל יש מופעים לכל המשפחה, בכניסה חופשית.', 'Yes. The Festival Plaza has shows for the whole family, free of charge.')),
            (t('הפסטיבל נגיש?', 'Is the festival accessible?'),
             t(f'כל הפרטים <a href="{P("accessibility.html")}">בהצהרת הנגישות</a>.',
               f'All the details are in <a href="{P("accessibility.html")}">the accessibility statement</a>.')),
        ]),
        (t('השתתפות', 'Taking part'), [
            (t('אפשר להשתתף בסדנאות?', 'Can I join the workshops?'),
             t(f'הסדנאות מיועדות לנגנים בגילאי 14–25. <a href="{P("workshops.html")}">פרטים והרשמה</a>.',
               f'The workshops are for musicians aged 14–25. <a href="{P("workshops.html")}">Details and sign-up</a>.')),
            (t('איך יוצרים איתכם קשר?', 'How do I contact you?'),
             t(f'דרך <a href="{P("contact.html")}">עמוד יצירת הקשר</a>.', f'Through <a href="{P("contact.html")}">the contact page</a>.')),
        ]),
    ]
    tablist = ''.join(
        f'<button type="button" role="tab" id="tab-{k}" data-tab="{k}" aria-controls="g-{k}"><em>{i + 1:02d}</em>{label}</button>'
        for i, (k, label, _, _) in enumerate(tabs))
    panels = ''.join(
        f'\n    <section class="g-panel" role="tabpanel" id="g-{k}" aria-labelledby="tab-{k}">\n      <h3><em>{i + 1:02d}</em>{head}</h3>{body}\n    </section>'
        for i, (k, _, head, body) in enumerate(tabs))
    groups = ''.join(
        f'\n  <div class="faq-group">\n    <h3><em>{i + 1:02d}</em>{name}</h3>\n    '
        + ''.join(f'<details><summary>{q}</summary><div>{a}</div></details>' for q, a in items)
        + '\n  </div>'
        for i, (name, items) in enumerate(faq))
    nofaq = t(f'לא מצאתם תשובה? <a href="{P("contact.html")}">כתבו לנו</a>.', f'Didn’t find your answer? <a href="{P("contact.html")}">Write to us</a>.')
    return dict(
        title=t('מידע למבקרים', 'Visitor info'),
        desc=t('כל מה שכדאי לדעת לפני שמגיעים לפסטיבל הג׳אז רעננה: הגעה, כרטיסים, משפחות, נגישות, שבת, סדנאות ושאלות נפוצות.',
               'Everything to know before you come to the Raanana Jazz Festival: getting here, tickets, families, accessibility, Saturday, workshops and FAQ.'),
        body=hero(t('לפני שמגיעים', 'Before you go'), t('מידע למבקרים', 'Visitor info'), '',
                  t('הגעה, כרטיסים, משפחות, נגישות, שבת וסדנאות – ולמטה, תשובות לשאלות הנפוצות.',
                    'Getting here, tickets, families, accessibility, Saturday and workshops – and below, answers to common questions.'))
        + f'''
<section class="wrap section">
  <h2 class="sr-only">{t('מידע לפי נושא', 'Information by topic')}</h2>
  <div class="guide">
    <div class="g-tabs" role="tablist" aria-label="{t('נושאים', 'Topics')}">{tablist}</div>{panels}
  </div>
</section>
<section class="wrap section faq" id="faq">
  <h2 class="sec-h">{t('שאלות נפוצות', 'FAQ')}</h2>
  <p>{nofaq}</p>{groups}
</section>
''')


def legal_body(t, P, sections, updated):
    """sections: list of (heading_he, heading_en, [(he, en) | ('ul', [(he, en), ...])])"""
    out = ''
    for hh, he_, items in sections:
        out += f'\n  <h2>{t(hh, he_)}</h2>'
        for it in items:
            if it[0] == 'ul':
                out += '\n  <ul>' + ''.join(f'<li>{t(a, b)}</li>' for a, b in it[1]) + '</ul>'
            else:
                out += f'\n  <p>{t(it[0], it[1])}</p>'
    out += f'\n  <p class="note">{t("עודכן לאחרונה: " + updated, "Last updated: " + updated)}</p>'
    return f'\n<section class="narrow section prose">{out}\n</section>\n'


def page_privacy(t, P, A):
    contact = f'<a href="{P("contact.html")}">{t("עמוד יצירת הקשר", "the contact page")}</a>'
    tickets = '<a href="https://tickets.raanana.muni.il/" target="_blank" rel="noopener">tickets.raanana.muni.il</a>'
    S = [
        ('כללי', 'General', [
            ('מדיניות פרטיות זו חלה על אתר פסטיבל הג׳אז רעננה – World Jazz Music, בכתובת raananajazzfestival.com (״האתר״). הפסטיבל מתקיים במרכז למוזיקה פיס רעננה (״הפסטיבל״, ״אנחנו״).',
             'This privacy policy applies to the Raanana Jazz Festival – World Jazz Music website at raananajazzfestival.com (“the site”). The festival takes place at the Raanana Pais Music Center (“the festival”, “we”).'),
            ('אנו מכבדים את פרטיותכם. המדיניות מסבירה איזה מידע נאסף בזמן השימוש באתר, למה הוא משמש ואילו אפשרויות עומדות לרשותכם. השימוש באתר מהווה הסכמה למדיניות זו.',
             'We respect your privacy. This policy explains what information is collected when you use the site, what it is used for and what choices you have. Using the site means you accept this policy.'),
            (f'לשאלות בנושא פרטיות אפשר לפנות אלינו דרך {contact}. משתמשים מתחת לגיל 18 מתבקשים לקרוא את המדיניות יחד עם הורה או אפוטרופוס.',
             f'For privacy questions, reach us through {contact}. Users under 18 should read this policy with a parent or guardian.'),
            ('ייתכן שנעדכן מדיניות זו מעת לעת. הנוסח המעודכן יפורסם בעמוד זה ויחול ממועד פרסומו.',
             'We may update this policy from time to time. The current version is always on this page and applies from the day it is published.'),
        ]),
        ('איזה מידע נאסף', 'What information is collected', [
            ('האתר אינו דורש הרשמה ואינו מבקש מכם פרטים אישיים כדי לגלוש בו.',
             'The site needs no registration and does not ask for personal details to browse it.'),
            ('ul', [
                ('<b>מידע טכני:</b> כמו בכל אתר, בזמן הגלישה מועבר מידע טכני – למשל כתובת IP וסוג הדפדפן – לספק האחסון של האתר (GitHub Pages) ולשירות הגופנים של Google (Google Fonts). מידע זה אינו מזהה אתכם באופן ישיר.',
                 '<b>Technical information:</b> as with any website, technical details such as your IP address and browser type reach the site’s host (GitHub Pages) and Google’s font service (Google Fonts). This does not identify you directly.'),
                ('<b>שמירה בדפדפן:</b> האתר שומר בדפדפן שלכם (localStorage) את בחירת השפה ואת ההופעות שסימנתם ב„הליינאפ שלי”. המידע נשאר במכשיר שלכם ואינו נשלח אלינו. אפשר למחוק אותו בהגדרות הדפדפן.',
                 '<b>Stored in your browser:</b> the site keeps your language choice and the shows you starred in “My line-up” in your browser (localStorage). It stays on your device and is never sent to us. You can clear it in your browser settings.'),
                ('<b>בלי עוגיות מעקב:</b> האתר אינו משתמש בעוגיות פרסום, בכלי סטטיסטיקה או במעקב אחר הגלישה.',
                 '<b>No tracking cookies:</b> the site uses no advertising cookies, analytics tools or browsing trackers.'),
            ]),
        ]),
        ('רכישת כרטיסים', 'Buying tickets', [
            (f'הכרטיסים נמכרים באתר הכרטיסים של עיריית רעננה ({tickets}), ולא באתר זה. הפרטים האישיים ופרטי התשלום שתמסרו ברכישה נמסרים ישירות למערכת הכרטיסים ואינם עוברים דרכנו. על הרכישה חלה מדיניות הפרטיות של מערכת הכרטיסים, ומומלץ לקרוא אותה.',
             f'Tickets are sold on the Raanana Municipality ticket site ({tickets}), not on this site. The personal and payment details you give when buying go straight to the ticket system and never pass through us. The ticket system’s own privacy policy applies to purchases, and we recommend reading it.'),
        ]),
        ('הרשמה לסדנאות ופניות', 'Workshop sign-up and enquiries', [
            ('ההרשמה לסדנאות נעשית בטופס Google. הפרטים שתמלאו בטופס נשמרים אצל הפסטיבל ומשמשים רק לטיפול בהרשמה וליצירת קשר בנושא הסדנאות. פרטים שתשלחו לנו בפנייה משמשים רק כדי לענות לכם.',
             'Workshop sign-up uses a Google Form. The details you enter are kept by the festival and used only to handle your registration and contact you about the workshops. Details you send us in a message are used only to reply to you.'),
            ('נשלח לכם עדכונים ודברי פרסומת רק אם ביקשתם זאת, ותוכלו לבקש להסיר את עצמכם מרשימת התפוצה בכל עת.',
             'We will only send you news or marketing if you asked for it, and you can ask to be removed from the mailing list at any time.'),
            ('לא נעביר מידע אישי שמסרתם לנו לצד שלישי בלי הסכמתכם, אלא אם הדבר נדרש לפי דין, צו שיפוטי או דרישה של רשות מוסמכת.',
             'We will not pass personal information you gave us to a third party without your consent, unless required by law, a court order or a competent authority.'),
        ]),
        ('קישורים ושירותים חיצוניים', 'Links and outside services', [
            ('באתר יש קישורים ושירותים של גורמים אחרים – למשל אתר הכרטיסים, אינסטגרם, פייסבוק, Waze ומפת Google המוטמעת בעמוד המתחם. כשאתם משתמשים בהם חלה מדיניות הפרטיות של אותם גורמים, ואין לנו שליטה עליה.',
             'The site links to and embeds services run by others – for example the ticket site, Instagram, Facebook, Waze and the Google map on the venue page. Their own privacy policies apply when you use them, and we have no control over them.'),
        ]),
        ('אבטחת מידע', 'Security', [
            ('אנו נוקטים אמצעים סבירים כדי לשמור על המידע שמגיע אלינו. עם זאת, אין שיטה שמבטיחה הגנה מוחלטת מפני תקלה או פעולה זדונית. אם ייוודע לנו על פגיעה במידע אישי, נפעל להודיע על כך למי שנפגע.',
             'We take reasonable steps to protect the information that reaches us. Still, no method guarantees complete protection against faults or malicious acts. If we learn that personal information has been compromised, we will work to tell the people affected.'),
        ]),
        ('עיון, תיקון ומחיקה', 'Access, correction and deletion', [
            (f'אפשר לבקש בכל עת לעיין במידע שמסרתם לנו, לתקן אותו או למחוק אותו – דרך {contact}. נטפל בבקשה בהקדם.',
             f'You can ask at any time to see, correct or delete information you gave us, through {contact}. We will handle your request promptly.'),
        ]),
        ('שונות', 'Other', [
            (f'מדיניות זו היא חלק מ<a href="{P("terms.html")}">תנאי השימוש</a> באתר. על המדיניות חל הדין הישראלי.',
             f'This policy is part of the site’s <a href="{P("terms.html")}">terms of use</a>. Israeli law applies to it.'),
        ]),
    ]
    return dict(
        title=t('מדיניות פרטיות', 'Privacy policy'),
        desc=t('מדיניות הפרטיות של אתר פסטיבל הג׳אז רעננה – World Jazz Music.', 'Privacy policy of the Raanana Jazz Festival – World Jazz Music website.'),
        body=hero(t('פרטיות', 'Privacy'), t('מדיניות פרטיות', 'Privacy policy'), '',
                  t('מה נאסף כשאתם גולשים באתר, ומה עושים עם זה.', 'What is collected when you use the site, and what is done with it.'))
        + legal_body(t, P, S, '18.10.2026'))


def page_terms(t, P, A):
    contact = f'<a href="{P("contact.html")}">{t("עמוד יצירת הקשר", "the contact page")}</a>'
    tickets = '<a href="https://tickets.raanana.muni.il/" target="_blank" rel="noopener">tickets.raanana.muni.il</a>'
    S = [
        ('כללי', 'General', [
            ('התנאים שלהלן חלים על השימוש באתר פסטיבל הג׳אז רעננה – World Jazz Music, בכתובת raananajazzfestival.com (״האתר״). הפסטיבל מתקיים במרכז למוזיקה פיס רעננה (״הפסטיבל״, ״אנחנו״).',
             'These terms apply to the use of the Raanana Jazz Festival – World Jazz Music website at raananajazzfestival.com (“the site”). The festival takes place at the Raanana Pais Music Center (“the festival”, “we”).'),
            (f'התנאים, יחד עם <a href="{P("privacy.html")}">מדיניות הפרטיות</a>, מסדירים את השימוש באתר. השימוש באתר מהווה הסכמה לתנאים. אם אינכם מסכימים להם, אנא הימנעו משימוש באתר.',
             f'These terms, together with the <a href="{P("privacy.html")}">privacy policy</a>, govern the use of the site. Using the site means you accept them. If you do not agree, please do not use the site.'),
            ('ייתכן שנעדכן את התנאים מעת לעת. הנוסח המעודכן יפורסם בעמוד זה ויחול ממועד פרסומו.',
             'We may update these terms from time to time. The current version is always on this page and applies from the day it is published.'),
        ]),
        ('מה יש באתר', 'What the site offers', [
            ('האתר מציג מידע על הפסטיבל: התוכנייה, האמנים, המתחם, מידע למבקרים, הסדנאות וקישורים לרכישת כרטיסים. האתר עצמו אינו מוכר כרטיסים ואינו גובה תשלום.',
             'The site gives information about the festival: the programme, the artists, the venue, visitor information, the workshops and links for buying tickets. The site itself does not sell tickets or take payments.'),
        ]),
        ('כרטיסים וביטולים', 'Tickets and cancellations', [
            (f'הכרטיסים נמכרים באתר הכרטיסים של עיריית רעננה ({tickets}), ועל הרכישה חלים גם התנאים של מערכת הכרטיסים.',
             f'Tickets are sold on the Raanana Municipality ticket site ({tickets}), and that system’s terms also apply to your purchase.'),
            ('ul', [
                ('<b>ביטול עד 24 שעות לפני המופע:</b> החזר כספי מלא.', '<b>Cancel up to 24 hours before the show:</b> full refund.'),
                ('<b>ביטול מאוחר יותר:</b> לא יינתן החזר.', '<b>Later cancellations:</b> no refund.'),
            ]),
            (f'לביטול כרטיס פנו אלינו דרך {contact}. האמור כפוף להוראות חוק הגנת הצרכן, התשמ״א–1981 ותקנותיו.',
             f'To cancel a ticket, contact us through {contact}. All of this is subject to the Israeli Consumer Protection Law, 1981, and its regulations.'),
            ('המקומות שמורים עד שעת תחילת המופע. כניסת מאחרים תתאפשר רק בשיקול דעת ההפקה וכשהדבר אינו מפריע למופע.',
             'Seats are held until the show starts. Latecomers may be let in only at the production’s discretion and when it does not disturb the show.'),
        ]),
        ('שינויים בתוכנית', 'Programme changes', [
            ('ההפקה רשאית לשנות מועדים, שעות, במות ואמנים. על שינוי או ביטול של מופע נודיע באתר ובערוצי הפסטיבל, וההחזר הכספי יינתן בהתאם לתנאי מערכת הכרטיסים ולכל דין.',
             'The production may change dates, times, stages and artists. We will announce any change or cancellation of a show on the site and the festival’s channels, and refunds will follow the ticket system’s terms and the law.'),
        ]),
        ('קניין רוחני', 'Intellectual property', [
            ('כל התכנים באתר – טקסטים, עיצוב, לוגו, צילומים וסרטונים – שייכים לפסטיבל או לבעלי הזכויות בהם (בהם צלמים ואמנים), ומוגנים בדיני זכויות יוצרים. אין להעתיק, לפרסם או להשתמש בהם בלי אישור מראש ובכתב.',
             'All content on the site – text, design, logo, photos and videos – belongs to the festival or to its rights holders (including photographers and artists) and is protected by copyright. Do not copy, publish or use it without prior written permission.'),
            (f'חומרי העיתונות ב<a href="{P("media.html")}">עמוד המדיה</a> מותרים לשימוש לצורך סיקור הפסטיבל, עם קרדיט לצלם כשמופיע.',
             f'Press materials on <a href="{P("media.html")}">the media page</a> may be used to cover the festival, crediting the photographer where given.'),
        ]),
        ('קישורים לאתרים אחרים', 'Links to other sites', [
            ('באתר יש קישורים לאתרים ולשירותים של גורמים אחרים, כמו אתר הכרטיסים, רשתות חברתיות ושירותי ניווט. איננו אחראים לתוכן של אתרים אלה או לשימוש בהם.',
             'The site links to sites and services run by others, such as the ticket site, social networks and navigation apps. We are not responsible for their content or for your use of them.'),
        ]),
        ('אחריות', 'Liability', [
            ('אנו משתדלים שהמידע באתר יהיה מדויק ועדכני, אך ייתכנו בו טעויות או שינויים. המידע מוצג כפי שהוא, ואיננו אחראים לנזק שייגרם כתוצאה מהסתמכות עליו או מתקלה בזמינות האתר, ככל שהדין מתיר.',
             'We try to keep the information on the site accurate and current, but it may contain errors or change. It is provided as is, and to the extent the law allows we are not liable for damage caused by relying on it or by the site being unavailable.'),
        ]),
        ('שימוש הוגן', 'Fair use', [
            ('אין לעשות באתר שימוש שעלול לפגוע בו, בפעילותו או במשתמשים אחרים, ואין להשתמש בו למטרה בלתי חוקית.',
             'Do not use the site in a way that could harm it, its operation or other users, or for any unlawful purpose.'),
        ]),
        ('דין וסמכות שיפוט', 'Law and jurisdiction', [
            ('על התנאים ועל השימוש באתר חל הדין הישראלי. אם ייקבע שסעיף כלשהו אינו בר אכיפה, יתר הסעיפים יעמדו בתוקפם.',
             'Israeli law applies to these terms and to the use of the site. If any clause is found unenforceable, the rest remain in force.'),
            (f'לשאלות על התנאים פנו אלינו דרך {contact}.', f'For questions about these terms, contact us through {contact}.'),
        ]),
    ]
    return dict(
        title=t('תנאי שימוש', 'Terms of use'),
        desc=t('תנאי השימוש באתר פסטיבל הג׳אז רעננה – World Jazz Music.', 'Terms of use of the Raanana Jazz Festival – World Jazz Music website.'),
        body=hero(t('תנאים', 'Terms'), t('תנאי שימוש', 'Terms of use'), '',
                  t('הכללים לשימוש באתר, לכרטיסים ולביטולים.', 'The rules for using the site, tickets and cancellations.'))
        + legal_body(t, P, S, '18.10.2026'))


PAGES = {
    'index.html': page_index, 'lineup.html': page_lineup, 'festival-2025.html': page_past,
    'venue.html': page_venue, 'about.html': page_about, 'workshops.html': page_workshops,
    'media.html': page_media, 'tickets.html': page_tickets, 'contact.html': page_contact,
    'accessibility.html': page_accessibility, 'guide.html': page_guide, 'privacy.html': page_privacy, 'terms.html': page_terms,
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
        html = HEAD.format(lang=lang, dir=cfg['dir'], title=title, desc=p['desc'], ver=VER, site=SITE_URL + ROOT, extra_head=p.get('head', ''),
                           robots=ROBOTS, self_path=url_path(cfg['base'], name),
                           he_path=url_path('/', name), en_path=url_path('/en/', name)) \
            + '<main id="main">\n' + p['body'] + '\n</main>\n' + FOOT.format(script=p.get('script', ''), ver=VER)
        with open(os.path.join(cfg['out'], name), 'w') as f:
            f.write(rooted(html))
    print(f'wrote {len(PAGES)} {lang} pages → {cfg["out"]}/')
    if lang == 'he' and not HIDDEN:
        p = page_404(t, P, cfg['arrow'])
        html = HEAD.format(lang=lang, dir=cfg['dir'], title=p['title'] + cfg['suffix'], desc=p['desc'], ver=VER, site=SITE_URL,
                           robots='', extra_head='<meta name="robots" content="noindex">', self_path='/404.html', he_path='/', en_path='/en/') \
            + '<main id="main">\n' + p['body'] + '\n</main>\n' + FOOT.format(script='', ver=VER)
        open('404.html', 'w').write(html)
        print('wrote 404.html')


# ---------------------------------------------------------------------
#  Coming-soon page at the main address (only while the site is hidden).
#  It uses its own copies of the logo, lettering and font in /soon/, so
#  nothing on it points into the hidden folder. Dates and venue come
#  from data.js.
# ---------------------------------------------------------------------
SOON_FILES = {
    'images/logo-nodots.png': 'logo.png', 'images/logo-dot1.png': 'dot1.png', 'images/logo-dot2.png': 'dot2.png',
    'images/logo-dot3.png': 'dot3.png', 'images/word-festival-he.png': 'word-festival.png',
    'images/word-raanana-he.png': 'word-raanana.png', 'images/paper.png': 'paper.png',
    'assets/fonts/xenon-ruckus.woff2': 'xenon-ruckus.woff2',
}

SOON = '''<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>פסטיבל הג׳אז רעננה 2026 | האתר החדש יעלה בקרוב</title>
__ROBOTS__
<meta name="description" content="World Jazz Music – פסטיבל הג׳אז רעננה, __DATES__. האתר החדש יעלה בקרוב.">
<meta property="og:title" content="פסטיבל הג׳אז רעננה 2026 · World Jazz Music">
<meta property="og:description" content="__DATES__ · האתר החדש יעלה בקרוב">
<meta property="og:image" content="__SITE__/soon/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/soon/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700;900&display=swap" rel="stylesheet">
<link rel="preload" href="/soon/xenon-ruckus.woff2" as="font" type="font/woff2" crossorigin>
<style>
@font-face { font-family: "Xenon Ruckus"; src: url("/soon/xenon-ruckus.woff2") format("woff2"); font-display: swap; unicode-range: U+0020-007E, U+2018-201D; }
:root { --field: #DB5230; --accent: #F7CE46; --ink: #3A1A14; --on-field: #FFFFFF; --ease-out: cubic-bezier(.23, 1, .32, 1); }
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
  margin: 0; min-height: 100vh; min-height: 100svh; display: flex; align-items: center; justify-content: center;
  padding: 32px 24px 28px; color: var(--on-field); background-color: var(--field); text-align: center;
  font-family: "Rubik", system-ui, sans-serif;
  background-image: url(/soon/paper.png), url(/soon/paper.png); background-size: 512px, 700px;
  background-position: 0 0, 230px 140px; background-blend-mode: multiply;
}
main { width: 100%; max-width: 560px; }
/* the whole page fits one screen: the logo shrinks on short screens */
h1 { width: min(100%, 480px, max(240px, calc((100svh - 500px) * 1.15))); margin: 0 auto; font-size: inherit; }
.hw { display: block; position: relative; z-index: 1; width: 44%; height: auto; }
.hw-fest { margin: 0 -9% -3% auto; }
.hw-raan { margin: 1% auto 0 -9%; }
@media (max-width: 640px) { .hw-fest { margin-right: 0; } .hw-raan { margin-left: 0; } }
.logo { position: relative; display: block; line-height: 0; }
.logo .main { width: 100%; height: auto; }
.logo .ld { position: absolute; width: 5.7%; height: 7.56%; }
.ld1 { left: 78.9%; top: 22.04%; } .ld2 { left: 87.17%; top: 56.42%; } .ld3 { left: 92.59%; top: 88.79%; }
.dates { display: inline-block; margin-top: 22px; direction: ltr; font-family: "Xenon Ruckus", "Rubik", sans-serif; font-size: 38px; line-height: 1; color: var(--accent); }
.dates b { display: block; font-weight: 400; font-size: 1.92em; line-height: .92; }
.dates small { display: block; font-size: 1em; color: var(--on-field); margin-top: -10px; letter-spacing: .06em; margin-right: -.06em; }
.soon { margin: 26px 0 0; font-weight: 900; font-size: clamp(30px, 7vw, 44px); line-height: 1.1; }
.soon-en { margin: 10px 0 0; font-weight: 500; font-size: 19px; }
.ig { display: inline-block; margin-top: 16px; padding: 12px 6px; color: var(--on-field); font-weight: 700; font-size: 19px;
  text-decoration: underline; text-decoration-color: var(--accent); text-decoration-thickness: 2px; text-underline-offset: 7px; }
.ig:focus-visible { outline: 3px solid var(--on-field); outline-offset: 4px; }
.ig:active { transform: scale(.97); }
@media (hover: hover) and (pointer: fine) { .ig:hover { text-decoration-thickness: 4px; } }
.venue { margin: 18px 0 0; font-size: 15px; font-weight: 500; }
@keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes pop { from { opacity: 0; transform: scale(.96); } to { opacity: 1; transform: none; } }
@keyframes beatIn { 0% { transform: scale(.3); opacity: 0; } 60% { transform: scale(1.35); opacity: 1; } 100% { transform: none; opacity: 1; } }
.logo .main { animation: pop 450ms var(--ease-out) both; }
.hw { animation: rise 380ms var(--ease-out) 120ms both; }
.ld { animation: beatIn 420ms cubic-bezier(.34, 1.56, .64, 1) both; }
.ld1 { animation-delay: 560ms; } .ld2 { animation-delay: 860ms; } .ld3 { animation-delay: 1160ms; }
.dates { animation: rise 380ms var(--ease-out) 80ms both; }
.soon, .soon-en { animation: rise 380ms var(--ease-out) 200ms both; }
.ig, .venue { animation: rise 380ms var(--ease-out) 260ms both; }
@media (prefers-reduced-motion: reduce) { .logo .main, .hw, .ld, .dates, .soon, .soon-en, .ig, .venue { animation: none; } }
</style>
</head>
<body>
<main>
  <h1>
    <img class="hw hw-fest" src="/soon/word-festival.png" width="411" height="125" alt="">
    <span class="logo"><img class="main" src="/soon/logo.png" width="1052" height="794" alt="World Jazz Music – פסטיבל הג׳אז רעננה 2026"><img class="ld ld1" src="/soon/dot1.png" alt=""><img class="ld ld2" src="/soon/dot2.png" alt=""><img class="ld ld3" src="/soon/dot3.png" alt=""></span>
    <img class="hw hw-raan" src="/soon/word-raanana.png" width="416" height="109" alt="">
  </h1>
  <div class="dates" aria-label="__DATES__"><b>__NUM__</b><small>__MONTH__</small></div>
  <p class="soon">האתר החדש יעלה בקרוב</p>
  <p class="soon-en" lang="en" dir="ltr">New website coming soon</p>
  <a class="ig" href="https://www.instagram.com/world.jazz.music/" target="_blank" rel="noopener">לעדכונים באינסטגרם</a>
  <p class="venue">__VENUE__</p>
</main>
</body>
</html>
'''


def data_str(key):
    m = re.search(key + r":\s*'([^']*)'", open(os.path.join(OUT, 'assets/data.js'), encoding='utf-8').read())
    return m.group(1) if m else ''


if HIDDEN:
    os.makedirs('soon', exist_ok=True)
    for src, dst in SOON_FILES.items():
        shutil.copy2(os.path.join(OUT, src), os.path.join('soon', dst))
    num, month = re.match(r'\s*(.*?)\s*<small>(.*?)</small>', data_str('datesLatin')).groups()
    soon = (SOON.replace('__SITE__', SITE_URL).replace('__DATES__', data_str('dates')).replace('__NUM__', num)
            .replace('__MONTH__', month).replace('__VENUE__', data_str('venueName')))
    open('index.html', 'w').write(soon.replace('__ROBOTS__\n', ''))
    open('404.html', 'w').write(soon.replace('__ROBOTS__', '<meta name="robots" content="noindex">'))
    print(f'wrote coming-soon index.html + 404.html; the site is at {ROOT}/ (noindex)')
    stale = [f for f in PAGES if f != 'index.html' and os.path.exists(f)] + (['en'] if os.path.isdir('en') else [])
    if stale:
        print('WARNING: old public pages still at the root, delete them:', ', '.join(stale))
elif os.path.isdir('soon'):
    print('Site is live at the root: the soon/ folder is no longer used and can be deleted.')
