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
ROBOTS = '<meta name="robots" content="noindex, nofollow">' if HIDDEN else '<meta name="robots" content="max-image-preview:large">'


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
<meta property="og:image" content="{site}/images/{og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="{site}{self_path}">
<link rel="alternate" hreflang="he" href="{site}{he_path}">
<link rel="alternate" hreflang="en" href="{site}{en_path}">
<link rel="alternate" hreflang="x-default" href="{site}{he_path}">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" href="/images/favicon-512.png">
<link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
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


def hero(eyebrow, title, chip='', lead='', ctas='', top='', under=''):
    chip_html = ''   # tilted chips removed (design review item 12)
    lead_html = f'<p class="lead">{lead}</p>' if lead else ''
    cta_html = f'<div class="ctas">{ctas}</div>' if ctas else ''
    return f'''<section class="page-hero grain">
  {top}<div class="eyebrow">{eyebrow}</div>
  <h1>{title}{chip_html}</h1>
  {under}{lead_html}
  {cta_html}
</section>
'''



def moments_head(t, level='h3'):
    return f'''<div class="moments-h">
  <{level} class="subhead" id="f25-h" style="margin:0;padding:0">{t('רגעים מפסטיבל 2025', 'Moments from the 2025 festival')}</{level}>
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
        desc=t('פסטיבל הג׳אז רעננה – World Jazz Music. 10–12 בדצמבר 2026, שלושה ימים של מוזיקה חיה במרכז פיס למוזיקה רעננה.',
               'Raanana Jazz Festival – World Jazz Music. 10–12 December 2026: three days of live music at the Raanana Pais Music Center.'),
        no_suffix=True,
        body=f'''
<section class="hero grain">
  <div class="hero-sides" aria-hidden="true">
    <video class="hero-side side-a" muted loop playsinline preload="none" disablepictureinpicture data-src="/video/hero-side-a-v4.mp4" poster="/video/hero-side-a-v4-poster.jpg"></video>
    <video class="hero-side side-b" muted loop playsinline preload="none" disablepictureinpicture data-src="/video/hero-side-b-v3.mp4" poster="/video/hero-side-b-v3-poster.jpg" data-offset="1.25"></video>
  </div>
  <div class="hero-bg" aria-hidden="true">
    <video class="hero-vid" muted loop playsinline preload="none" disablepictureinpicture
      data-desktop="/video/hero-desktop.mp4" data-desktop-poster="/video/hero-desktop-poster.jpg"
      data-mobile="/video/hero-mobile.mp4" data-mobile-poster="/video/hero-mobile-poster.jpg"></video>
  </div>
  <div class="hero-inner">
    <div>
      <h1 class="hero-title">
        <img class="hw hw-fest" src="/images/word-festival-{t('he','en')}.png" width="{t('411','597')}" height="{t('125','90')}" alt="">
        <span class="logo-dots"><img class="main-logo" src="/images/logo-nodots.png" width="1052" height="794" alt="{t('World Jazz Music – פסטיבל הג׳אז רעננה 2026', 'World Jazz Music – Raanana Jazz Festival 2026')}"><img class="ld ld1" src="/images/logo-dot1.png" alt=""><img class="ld ld2" src="/images/logo-dot2.png" alt=""><img class="ld ld3" src="/images/logo-dot3.png" alt=""></span>
        <img class="hw hw-raan" src="/images/word-raanana-{t('he','en')}.png" width="{t('416','604')}" height="{t('109','101')}" alt="">
      </h1>
      <div class="meta">
        {t('<img class="hero-date" src="/images/date-he.webp" width="900" height="267" alt="10–12 בדצמבר 2026">', '<img class="hero-date" src="/images/date-en.webp" width="900" height="267" alt="10–12 December 2026">')}
        <div class="dir"><span>{t('ניהול אומנותי:', 'Artistic director:')}</span> {t('עמית פרידמן', 'Amit Friedman')}</div>
        <div class="ctas">
          <a href="{P('lineup.html')}" class="btn primary">{t('לוח ההופעות 2026', '2026 line-up')}</a>
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
  <img class="ill ill-sax" src="/images/ill/dekel-sax.webp" width="800" height="547" alt="" aria-hidden="true" loading="lazy">
  <h2 id="next-h">{t('פסטיבל 2026', 'Festival 2026')}</h2>
  <p>{t('שלושה ימים של ג׳אז ומוזיקת עולם במרכז פיס למוזיקה רעננה – אמנים מישראל ומרחבי העולם, הפקות מקור, סדנאות לנגנים צעירים ומופעים לכל המשפחה.',
        'Three days of jazz and world music at the Raanana Pais Music Center – artists from Israel and around the world, original productions, workshops for young musicians and shows for the whole family.')}</p>
  <ul class="facts">
    <li class="f-days"><b data-count>10–12.12</b><span>{t('חמישי – שישי – שבת', 'Thursday – Friday – Saturday')}</span><a class="f-cover" href="{P('lineup.html')}" aria-label="{t('לוח ההופעות', 'Line-up')}"></a></li>
    <li class="f-shows"><b data-count>20</b><span>{t('הופעות בחמש במות – כולל <bdi>Jazz Corner</bdi>, במת הלילה החדשה', 'shows on five stages – including Jazz Corner, our new late-night stage')}</span><a href="{P('lineup.html')}">{t('ללוח ההופעות', 'See the line-up')} {A}</a></li>
    <li class="f-work"><b data-count>14–25</b><span>{t('סדנאות למוזיקאים צעירים – ההרשמה פתוחה&nbsp;עד&nbsp;20.11!', 'Workshops for young musicians – sign-up open until 20.11!')}</span><a href="{P('workshops.html')}">{t('על הסדנאות', 'About the workshops')} {A}</a></li>
  </ul>
</section>

<section class="onstage" aria-labelledby="onstage-h">
  <div class="stitle">
    <h2 id="onstage-h">{t('ההופעות של 2026', 'The 2026 shows')}</h2>
    <p>{t('<bdi dir="ltr">10–12</bdi> בדצמבר 2026 · לפרטים לחצו על התמונה.', '10–12 December 2026 · click the photo for the details.')}</p>
  </div>
  <div class="spot" data-render="spotlight"></div>
  <div class="dy" data-render="days"></div>
  <p class="dy-more"><a class="btn primary" href="{P('lineup.html')}">{t('ללו״ז המלא לפי במות', 'Full timetable by stage')} {A}</a></p>
</section>

<section class="stages" aria-labelledby="stages-h">
  <div class="stitle">
    <h2 id="stages-h">{t('חמש במות, מתחם אחד', 'Five stages, one venue')}</h2>
    <p>{t('הפסטיבל מתקיים במרכז פיס למוזיקה רעננה, רחוב עציון 48.', 'The festival takes place at the Raanana Pais Music Center, 48 Etzion St.')}</p>
  </div>
  <div class="vmap" data-render="venuemap"></div>
  <div class="stage-row" data-render="stages"></div>
</section>

<section class="free-band" aria-labelledby="free-h" data-render="free"></section>

<section class="tix-box grain" aria-labelledby="tix-h">
  <span class="ill ill-drum" aria-hidden="true"><img src="/images/ill/dekel-drum.webp" width="600" height="593" alt="" loading="lazy"><img class="sticks" src="/images/ill/dekel-sticks.webp" width="600" height="132" alt="" loading="lazy"></span>
  <div class="tix-in">
    <div class="tix-copy">
      <p class="love">{t('כרטיסים ופסים', 'Tickets and passes')}</p>
      <h2 id="tix-h" class="big">{t('בקרוב', 'Coming soon')}</h2>
      <p>{t('המכירה לפסטיבל 2026 תיפתח בקרוב באתר הכרטיסים של עיריית רעננה. עקבו אחרינו כדי לשמוע ראשונים.', 'Sales for the 2026 festival open soon on the Raanana Municipality ticket site. Follow us to hear first.')}</p>
      <div class="ctas">
        <a href="https://www.instagram.com/world.jazz.music/" target="_blank" rel="noopener" class="btn primary">{t('לעדכונים באינסטגרם', 'Updates on Instagram')}</a>
        <a href="{P('tickets.html')}" class="btn ghost">{t('על הכרטיסים', 'About tickets')} {A}</a>
      </div>
    </div>
    <ul class="tix-opts">
      <li><b>{t('כרטיס להופעה', 'Single show')}</b><span>{t('לבחור הופעה אחת או כמה', 'Pick one show or a few')}</span></li>
      <li><b>{t('פס יומי', 'Day pass')}</b><span>{t('כל הופעות היום – חמישי, שישי או שבת', 'Every show that day – Thu, Fri or Sat')}</span></li>
      <li><b>{t('פס לכל הפסטיבל', 'Full festival pass')}</b><span>{t('שלושה ימים, הכי משתלם', 'Three days, the best value')}</span></li>
    </ul>
  </div>
</section>

<section id="festival-2025" aria-labelledby="f25-h">
  {moments_head(t, 'h2')}
  <section class="river" data-render="moments" aria-label="{t('רגעים מפסטיבל 2025', 'Moments from the 2025 festival')}"></section>
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
        body=hero(t('<bdi dir="ltr">10–12</bdi> בדצמבר 2026', '10–12 December 2026'), t('לוח הופעות 2026', 'Line-up 2026'), '',
                  t('שלושה ימים, חמש במות, 20 הופעות, סרט בהקרנת בכורה וג׳אם סשן בכל לילה – מבוקר לילדים ועד הופעות הלילה ב־<bdi>Jazz Corner</bdi>. לחצו על הופעה לכל הפרטים.',
                    'Three days, five stages, 20 shows, a premiere film screening and a jam session every night – from children’s mornings to late nights at Jazz Corner. Tap a show for the full details.'),
                  f'<a href="{P("guide.html")}" class="btn primary">{t("מידע למבקרים", "Visitor info")}</a>'
                  f'<a href="{P("tickets.html")}" class="btn ghost">{t("כרטיסים", "Tickets")} {A}</a>') + f'''
<section class="wrap section lu">
  <h2 class="sec-h">{t('האמנים', 'The artists')}</h2>
  <p>{t('לחצו על שם כדי לראות את כל פרטי ההופעה.', 'Tap a name for the full details of the show.')}</p>
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
                  t('18–20 בדצמבר 2025: שלושה ימים של ג׳אז ומוזיקת עולם במרכז פיס למוזיקה רעננה – כך זה נראה מהקהל, מהבמה ומהלובי.',
                    '18–20 December 2025: three days of jazz and world music at the Raanana Pais Music Center – as seen from the audience, the stage and the lobby.')) + f'''
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
  <a href="/images/program-2025.png" download="raanana-jazz-program-2025.png" class="btn">{t('להורדה', 'Download')} ↓</a>
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
        desc=t('חמש הבמות של פסטיבל הג׳אז רעננה במרכז פיס למוזיקה רעננה.', 'The five stages of the Raanana Jazz Festival at the Raanana Pais Music Center.'),
        body=hero(t('מרכז פיס למוזיקה רעננה', 'Raanana Pais Music Center'), t('המתחם', 'The Venue'), t('5 במות', '5 stages'),
                  t('מהאולם המרכזי ועד רחבת הפסטיבל – כל הפסטיבל מתקיים במתחם אחד, כך שאפשר לעבור בין הופעות בכמה צעדים.',
                    'From the main hall to the Festival Plaza, the whole festival happens in one place – every show is just a few steps away.')) + f'''
<section class="section" id="map" aria-labelledby="map-h">
  <div class="wrap">
    <h2 class="sec-h" id="map-h">{t('מפת המתחם', 'Venue map')}</h2>
    <p>{t('כל הבמות בבניין אחד, ו־<bdi>Jazz Corner</bdi> צמוד אליו. לחצו על במה כדי לראות באיזו קומה היא ומה מופיע בה.', 'All the stages are in one building, with Jazz Corner right beside it. Tap a stage to see its floor and what’s on.')}</p>
  </div>
  <div class="vmap" data-render="venuemap"></div>
</section>
<section class="wrap section">
  <h2 class="sec-h">{t('הבמות', 'The stages')}</h2>
  <p>{t('לכל במה אופי משלה. כך נראה לוח ההופעות לפי במות:', 'Each stage has its own character. Here is the line-up by stage:')}</p>
  <div class="venues" id="venues"></div>
</section>
<section class="wrap section">
  <h2 class="sec-h">{t('איך מגיעים', 'Getting here')}</h2>
  <p>{t('הפסטיבל מתקיים ב<b>מרכז פיס למוזיקה רעננה</b>.', 'The festival takes place at the <b>Raanana Pais Music Center</b>.')}</p>
  <iframe class="map" loading="lazy" title="{t('מפה – מרכז פיס למוזיקה רעננה', 'Map – Raanana Pais Music Center')}"
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
      <ul>${SHOWS.filter(s => s.venue === v.name && !s.repeat).map(s =>
        `<li><time>${s.every ? L('בכל לילה', 'Every night') : dayOf(s.day).date} · ${s.time}</time><button type="button" class="vc-show" data-show="${s.id}" aria-haspopup="dialog">${tr(s, 'title')}</button></li>`).join('')}</ul>
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
  <div class="stats-h"><h2>{t('פסטיבל 2025', 'Festival 2025')}</h2><small>{t('במספרים · הפסטיבל הבא: <bdi dir="ltr">10–12</bdi> בדצמבר 2026', 'By the numbers · Next festival: 10–12 December 2026')}</small></div>
  <div class="stats">
    <div class="stat"><b>3</b><span>{t('ימים של מוזיקה חיה<br>18–20 בדצמבר', 'days of live music<br>18–20 December')}</span></div>
    <div class="stat"><b>17</b><span>{t('מופעים, מהם הפקות מקור<br>שנוצרו לפסטיבל', 'shows, including original<br>festival productions')}</span></div>
    <div class="stat"><b>4</b><span>{t('במות במתחם אחד', 'stages in one venue')}</span></div>
    <div class="stat"><b>9</b><span>{t('מדינות על הבמה', 'countries on stage')}</span></div>
  </div>
</section>
<section class="narrow section prose">
  <h2>{t('מי אנחנו', 'Who we are')}</h2>
  <p>{t('הפסטיבל מופק על ידי <b>מרכז פיס למוזיקה רעננה</b> ו<b>עיריית רעננה</b>. הניהול האומנותי בידי הסקסופוניסט והמלחין <b>עמית פרידמן</b>.',
        'The festival is produced by the <b>Raanana Pais Music Center</b> and the <b>Raanana Municipality</b>. Artistic direction is by pianist and composer <b>Amit Friedman</b>.')}</p>
  <p>{t('לצד ההופעות, הפסטיבל הוא גם בית ספר: בכל שנה נגנים צעירים בגילאי 14–25 לומדים מאמנים בינלאומיים ומסיימים בהופעה על במת הפסטיבל.',
        'Alongside the concerts, the festival is also a school: every year young musicians aged 14–25 learn from international artists and finish with a performance on the festival stage.')}</p>
</section>
<section class="wrap section">
  <h2 class="sec-h">{t('המורים בסדנאות 2026', '2026 workshop faculty')}</h2>
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
        desc=t('סדנאות ג׳אז למוזיקאים בגילאי 14–25 עם אמנים בינלאומיים, 10–12 בדצמבר 2026 ברעננה.', 'Jazz workshops for musicians aged 14–25 with international artists, 10–12 December 2026 in Raanana.'),
        body=hero(t('למוזיקאים בגילאי 14–25', 'For musicians aged 14–25'), t('סדנאות', 'Workshops'), t('עד 20.11', 'Until 20.11'),
                  t('שלושה ימים של נגינה בהרכבים, סדנאות כלי וכיתות אמן עם אמנים מהשורה הראשונה בעולם, והופעה בפסטיבל. ההרשמה פתוחה&nbsp;עד&nbsp;20.11!',
                    'Three days of ensemble playing, instrument workshops and masterclasses with world-class artists, and a performance at the festival. Sign-up is open until&nbsp;20.11!'),
                  f'<a data-href="form" target="_blank" rel="noopener" class="btn primary">{t("להרשמה", "Sign up")}</a>',
                  top='<div class="t-strip t-top" data-render="teacher-strip"></div>') + f'''
<section class="wrap section">
  <div class="stats stats-3">
    <div class="stat"><b>3</b><span>{t('ימים · חמישי–שבת<br><bdi dir="ltr">10–12</bdi> בדצמבר (חופשת חנוכה)', 'days · Thursday–Saturday<br>10–12 December (Hanukkah break)')}</span><a class="stat-cover" data-href="form" target="_blank" rel="noopener" aria-label="{t('להרשמה לסדנאות', 'Sign up for the workshops')}"></a></div>
    <div class="stat"><b>9:30<em>–</em>17:00</b><span>{t('שעות הפעילות בכל יום', 'daily hours')}</span><a class="stat-cover" data-href="form" target="_blank" rel="noopener" aria-label="{t('להרשמה לסדנאות', 'Sign up for the workshops')}"></a></div>
    <div class="stat"><b>₪1,200</b><span>{t('כולל כניסה לכל הופעות הפסטיבל<br>על בסיס מקום פנוי', 'includes every festival show<br>subject to availability')}</span><a class="stat-cover" data-href="form" target="_blank" rel="noopener" aria-label="{t('להרשמה לסדנאות', 'Sign up for the workshops')}"></a></div>
  </div>
</section>
<section class="narrow section prose">
  <h2>{t('מה בתוכנית', "What's included")}</h2>
  <ul>
    <li>{t('נגינה בהרכבים', 'Ensemble playing')}</li>
    <li>{t('סדנאות כלי', 'Instrument workshops')}</li>
    <li>{t('כיתת אמן עם <b>פקיטו דה ריברה</b> (קובה–ארה״ב)', 'A masterclass with <b>Paquito D’Rivera</b> (Cuba–USA)')}</li>
    <li>{t('סדנה לזמרות ולזמרים עם <b>סיריל איימה</b> (צרפת–ארה״ב)', 'A vocal workshop with <b>Cyrille Aimée</b> (France–USA)')}</li>
    <li>{t('הופעה בפסטיבל', 'A performance at the festival')}</li>
  </ul>
  <h2>{t('פרטים', 'Details')}</h2>
  <p>{t('הסדנאות יתקיימו ברעננה, <span dir="ltr">10–12</span> בדצמבר 2026 (חופשת חנוכה), חמישי עד שבת, בשעות <span dir="ltr">9:30–17:00</span>.',
        'The workshops take place in Raanana, 10–12 December 2026 (Hanukkah break), Thursday to Saturday, 9:30–17:00.')}</p>
  <p>{t('<b>עלות:</b> 1,200 ש״ח – כולל כניסה לכל הופעות הפסטיבל, על בסיס מקום פנוי.',
        '<b>Cost:</b> ₪1,200 – including entry to every festival show, subject to availability.')}</p>
  <p>{t('<b>ההרשמה פתוחה עד 20.11!</b>', '<b>Sign-up is open until 20.11!</b>')}</p>
</section>
<section class="wrap section">
  <h2 class="sec-h">{t('סגל המורים', 'The faculty')}</h2>
  <div class="tbios" data-render="people-bios"></div>
</section>
''')


def page_media(t, P, A):
    return dict(
        title=t('מדיה ועיתונות', 'Media + Press'),
        desc=t('חומרים לעיתונות – לוגו ותמונות האמנים של פסטיבל הג׳אז רעננה 2026.', 'Press materials – logo and artist photos for the 2026 Raanana Jazz Festival.'),
        body=hero(t('לעיתונאים ולמדיה', 'For journalists and media'), t('מדיה ועיתונות', 'Media + Press'), 'Press',
                  t('כאן תמצאו את הלוגו ותמונות האמנים של פסטיבל 2026 להורדה. לבקשות אקרדיטציה, ראיונות וחומרים נוספים – צרו קשר.',
                    'Download the logo and photos of the 2026 artists here. For accreditation, interviews and more materials, get in touch.'),
                  f'<a id="pressMail" class="btn primary">{t("בקשת אקרדיטציה", "Request accreditation")}</a>') + f'''
<section class="wrap section">
  <h2 class="sec-h">{t('חומרים להורדה', 'Downloads')}</h2>
  <div class="dl-grid">
    <div class="dl"><div class="th" style="background-image:url(/images/44f224268148.png)"></div><h3>{t('לוגו הפסטיבל', 'Festival logo')}</h3><a href="/images/44f224268148.png" download="raanana-jazz-logo.png">{t('להורדה', 'Download')} (PNG) ↓</a></div>
    <div class="dl"><div class="th" style="background-image:url(/images/logo-dark.png);background-color:var(--ground)"></div><h3>{t('לוגו – כהה', 'Logo – dark')}</h3><a href="/images/logo-dark.png" download="raanana-jazz-logo-dark.png">{t('להורדה', 'Download')} (PNG) ↓</a></div>
  </div>
</section>
<section class="wrap section">
  <h2 class="sec-h">{t('תמונות אמני 2026', '2026 artist photos')}</h2>
  <p>{t('לחצו על תמונה להורדה ברזולוציה מלאה. בפרסום יש לציין את קרדיט הצלם כשהוא מופיע.', 'Click a photo to download it in full resolution. Please include the photo credit where one is given.')}</p>
  <div class="dl-grid" id="pressPhotos"></div>
</section>
''',
        script='''<script>
  document.getElementById('pressMail').href = `mailto:${SITE.email}?subject=${encodeURIComponent(L('בקשת אקרדיטציה – פסטיבל הג׳אז רעננה', 'Press accreditation – Raanana Jazz Festival'))}`;
  document.getElementById('pressPhotos').innerHTML = SHOWS.filter(s => s.img && !/^jam-/.test(s.id)).filter((s, i, a) => a.findIndex(x => x.img === s.img) === i).map(s => `
    <div class="dl"><div class="th photo" data-bg="${img(s.img)}"></div><h3>${tr(s, 'title')}</h3>${s.credit ? `<small class="credit">${L('צילום', 'Photo')}: ${tr(s, 'credit')}</small>` : ''}<a href="${img(s.img)}" download>${L('להורדה', 'Download')} ↓</a></div>`).join('');
</script>''')


def page_tickets(t, P, A):
    return dict(
        title=t('כרטיסים', 'Tickets'),
        desc=t('כרטיסים לפסטיבל הג׳אז רעננה 2026.', 'Tickets for the 2026 Raanana Jazz Festival.'),
        body=hero(t('<bdi dir="ltr">10–12</bdi> בדצמבר 2026', '10–12 December 2026'), t('כרטיסים', 'Tickets'), '',
                  t('פרטי הכרטיסים והפסים לפסטיבל 2026 יפורסמו בקרוב. חלק מהמופעים בכניסה חופשית.',
                    'Ticket and pass details for the 2026 festival will be published soon. Some shows are free.'),
                  f'<a href="https://www.instagram.com/world.jazz.music/" target="_blank" rel="noopener" class="btn primary">{t("לעדכונים באינסטגרם", "Updates on Instagram")}</a>'
                  f'<a href="{P("lineup.html")}" class="btn ghost">{t("ללוח ההופעות", "See the line-up")} {A}</a>') + f'''
<section class="wrap section">
  <h2 class="sec-h">{t('בכניסה חופשית', 'Free entry')}</h2>
  <p>{t('ההופעות האלה פתוחות לכולם בכניסה חופשית.', 'These shows are open to everyone, free of charge.')}</p>
  <div class="showlist" id="freeShows"></div>
</section>
''',
        script='''<script>
  renderShowList(document.getElementById('freeShows'));
  document.querySelectorAll('#freeShows .showrow').forEach((row, i) => { if (!SHOWS.filter(s => !s.repeat)[i].free) row.remove(); });
</script>''')


def page_contact(t, P, A):
    topics = [
        ('artists', t('אמנים – רוצים להופיע בפסטיבל', 'Artists – playing the festival')),
        ('workshops', t('סדנאות לנגנים צעירים', 'Workshops for young musicians')),
        ('tickets', t('כרטיסים ופסים', 'Tickets and passes')),
        ('access', t('נגישות', 'Accessibility')),
        ('press', t('תקשורת ועיתונות', 'Press and media')),
        ('partners', t('שותפים וחסויות', 'Partners and sponsors')),
        ('general', t('פנייה כללית', 'General question')),
    ]
    opts = ''.join(f'<option value="{k}">{label}</option>' for k, label in topics)
    req = f'<span class="req" aria-hidden="true">*</span>'
    return dict(
        title=t('צור קשר', 'Contact'),
        desc=t('יצירת קשר עם פסטיבל הג׳אז רעננה.', 'Get in touch with the Raanana Jazz Festival.'),
        body=hero(t('נשמח לשמוע מכם', "We'd love to hear from you"), t('צור קשר', 'Contact'), '',
                  t('בחרו את נושא הפנייה, כתבו לנו ונחזור אליכם בהקדם.', 'Pick a topic, write to us and we will get back to you soon.')) + f'''
<section class="wrap section contact-wrap">
  <form class="cform" id="contactForm" novalidate>
    <h2 class="sec-h">{t('טופס פנייה', 'Contact form')}</h2>
    <p class="cf-note">{t('שדות המסומנים ב־* הם שדות חובה.', 'Fields marked * are required.')}</p>
    <div class="cf-grid">
      <div class="cf-field">
        <label for="cf-name">{t('שם מלא', 'Full name')} {req}</label>
        <input id="cf-name" name="name" type="text" autocomplete="name" required aria-describedby="cf-name-err">
        <p class="cf-err" id="cf-name-err">{t('נא לכתוב שם.', 'Please enter your name.')}</p>
      </div>
      <div class="cf-field">
        <label for="cf-email">{t('אימייל', 'Email')} {req}</label>
        <input id="cf-email" name="email" type="email" autocomplete="email" dir="ltr" required aria-describedby="cf-email-err">
        <p class="cf-err" id="cf-email-err">{t('נא לכתוב כתובת אימייל תקינה.', 'Please enter a valid email address.')}</p>
      </div>
      <div class="cf-field">
        <label for="cf-phone">{t('טלפון', 'Phone')} <small>{t('(לא חובה)', '(optional)')}</small></label>
        <input id="cf-phone" name="phone" type="tel" autocomplete="tel" dir="ltr">
      </div>
      <div class="cf-field">
        <label for="cf-topic">{t('נושא הפנייה', 'Topic')} {req}</label>
        <div class="cf-select"><select id="cf-topic" name="topic" required aria-describedby="cf-topic-err">
          <option value="" disabled selected>{t('בחרו נושא', 'Choose a topic')}</option>{opts}
        </select></div>
        <p class="cf-err" id="cf-topic-err">{t('נא לבחור נושא.', 'Please choose a topic.')}</p>
      </div>
      <div class="cf-field cf-wide">
        <label for="cf-msg">{t('ההודעה', 'Message')} {req}</label>
        <textarea id="cf-msg" name="message" rows="6" required aria-describedby="cf-msg-err cf-hint"></textarea>
        <p class="cf-hint" id="cf-hint" hidden></p>
        <p class="cf-err" id="cf-msg-err">{t('נא לכתוב הודעה.', 'Please write a message.')}</p>
      </div>
      <input type="checkbox" name="botcheck" class="cf-bot" tabindex="-1" autocomplete="off" aria-hidden="true">
    </div>
    <p class="cf-privacy">{t(f'הפרטים ישמשו רק כדי לחזור אליכם. <a href="{P("privacy.html")}">מדיניות הפרטיות</a>', f'Your details are used only to reply to you. <a href="{P("privacy.html")}">Privacy policy</a>')}</p>
    <button type="submit" class="btn primary cf-send">{t('שליחה', 'Send')}</button>
    <p class="cf-status" role="status" aria-live="polite"></p>
  </form>
  <aside class="cf-side">
    <h2>{t('דרכים נוספות', 'Other ways')}</h2>
    <p>{t('אפשר גם לכתוב לנו באינסטגרם של הפסטיבל ובפייסבוק של מרכז פיס למוזיקה רעננה.', 'You can also message us on the festival Instagram or the Raanana Pais Music Center Facebook.')}</p>
    <p class="cf-links"><a class="g-text" href="https://www.instagram.com/world.jazz.music/" target="_blank" rel="noopener">Instagram {A}</a>
      <a class="g-text" href="https://www.facebook.com/raananamusiccenter" target="_blank" rel="noopener">Facebook {A}</a></p>
    <p>{t(f'שאלות נפוצות על הגעה, כרטיסים ונגישות – <a href="{P("guide.html")}">במידע למבקרים</a>.', f'Common questions about getting here, tickets and accessibility – <a href="{P("guide.html")}">in Visitor info</a>.')}</p>
  </aside>
</section>
''',
        script='''<script>contactForm(document.getElementById('contactForm'));</script>''')


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
  <h2>{t('תפריט הנגישות', 'The accessibility menu')}</h2>
  <p>{t('בכל עמוד באתר יש לשונית נגישות בצד המסך (סמל האדם). לחיצה עליה פותחת תפריט עם האפשרויות הבאות:',
        'Every page has an accessibility tab on the side of the screen (the person icon). It opens a menu with these options:')}</p>
  <ul>
    <li>{t('<b>עצירת כל התנועה והווידאו</b> – עוצרת את סרטוני הרקע, את רצועות התמונות הנעות, את הזרקור המתחלף ואת כל האנימציות.', '<b>Stop all motion and video</b> – stops the background videos, the moving photo strips, the rotating spotlight and every animation.')}</li>
    <li>{t('<b>הגדלת טקסט</b> – בשתי דרגות (A+ ו־A++), בכל האתר.', '<b>Larger text</b> – in two steps (A+ and A++), across the whole site.')}</li>
    <li>{t('<b>ניגודיות גבוהה</b> – רקע בהיר (טקסט שחור על לבן) או רקע כהה.', '<b>High contrast</b> – light (black text on white) or dark.')}</li>
    <li>{t('<b>שחור־לבן (מונוכרום)</b> – לאנשים עם עיוורון צבעים.', '<b>Black and white (monochrome)</b> – for people with colour blindness.')}</li>
    <li>{t('<b>קו תחתון לכל הקישורים</b>.', '<b>Underline all links</b>.')}</li>
    <li>{t('<b>הדגשת מיקוד המקלדת</b> – מסגרת עבה סביב הרכיב שנבחר בניווט במקלדת.', '<b>Strong keyboard focus</b> – a thick frame around the element selected with the keyboard.')}</li>
  </ul>
  <p>{t('ההגדרות נשמרות בדפדפן וממשיכות לפעול במעבר בין עמודים ובביקורים הבאים. הכפתור "איפוס הכל" מחזיר את התצוגה הרגילה. התפריט עצמו נגיש במקלדת ובקוראי מסך, ונבנה בתוך האתר ללא תוסף חיצוני.',
        'Your settings are saved in the browser and stay on as you move between pages and on later visits. "Reset all" returns the normal view. The menu itself works with the keyboard and screen readers, and is built into the site without an outside plugin.')}</p>
  <h2>{t('הסדרי נגישות בפסטיבל', 'Accessibility at the festival')}</h2>
  <p>{t('לפרטים על הסדרי הנגישות במרכז פיס למוזיקה רעננה (חניה, גישה לאולמות ומקומות ישיבה נגישים) – פנו אלינו בפרטים שלמטה.',
        'For accessibility arrangements at the Raanana Pais Music Center (parking, hall access and accessible seating), contact us using the details below.')}</p>
  <h2>{t('מגבלות ידועות', 'Known limitations')}</h2>
  <ul>
    <li>{t('רכישת הכרטיסים מתבצעת באתר הכרטיסים של עיריית רעננה, שאינו בשליטתנו.', 'Tickets are sold on the Raanana Municipality ticket site, which we do not control.')}</li>
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
  document.getElementById('a11yContact').innerHTML = lines.map(l => /@/.test(l) ? `<a href="mailto:${l}${l === SITE.email && SITE.emailCc ? `?cc=${SITE.emailCc}` : ''}">${l}</a>` : l).join('<br>');
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
      <p>{t('כל הפסטיבל מתקיים במתחם אחד – <b>מרכז פיס למוזיקה רעננה</b>. חמש הבמות קרובות זו לזו, כך שאפשר לעבור בין הופעות בכמה צעדים.',
            'The whole festival takes place in one venue – <b>the Raanana Pais Music Center</b>. The five stages are close together, so every show is a few steps away.')}</p>
      <p>{t('<b>חניה:</b> החניה בכל אזור המרכז חופשית (מדרכה אפורה), ואפשר לחנות בכל מקום. אם הסביבה עמוסה, אפשר לחנות בחניון אשכול הפיס בפינת הרחובות החייל והנשיאים – גם שם החניה חופשית.',
            '<b>Parking:</b> parking all around the center is free (grey kerb), so you can park anywhere. If the area is busy, use the Eshkol HaPais car park at the corner of HaChayal and HaNesi’im streets – also free.')}</p>
      <div class="g-links">
        <a class="btn primary" target="_blank" rel="noopener" href="https://waze.com/ul?q={maps_q}&navigate=yes">{t('ניווט ב־Waze', 'Navigate with Waze')}</a>
        <a class="g-text" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query={maps_q}">{t('לפתיחה ב־Google Maps', 'Open in Google Maps')} {A}</a>
      </div>
      <p class="g-more"><a href="{P('venue.html')}#map">{t('למפת המתחם והבמות', 'Venue map and stages')} {A}</a></p>"""),
        ('tickets', t('כרטיסים', 'Tickets'), t('כרטיסים ופסים', 'Tickets and passes'), f"""
      <p>{t(f'אפשר לקנות כרטיס להופעה אחת, <a href="{P("tickets.html")}"><b>פס יומי</b></a> לכל מופעי היום, או <a href="{P("tickets.html")}"><b>פס לכל הפסטיבל</b></a>.',
            f'You can buy a ticket for one show, a <a href="{P("tickets.html")}"><b>day pass</b></a> for all of that day’s shows, or a <a href="{P("tickets.html")}"><b>full festival pass</b></a>.')}</p>
      <p>{t('חלק מהמופעים בכניסה חופשית – הם מסומנים בלוח ההופעות.', 'Some shows are free – they are marked in the line-up.')}</p>
      <p class="g-more"><a href="{P('tickets.html')}">{t('לעמוד הכרטיסים', 'Tickets page')} {A}</a></p>"""),
        ('families', t('משפחות', 'Families'), t('משפחות וילדים', 'Families and children'), f"""
      <p>{t('רחבת הפסטיבל היא הלב הפתוח של הפסטיבל: מופעים לכל המשפחה.',
            'The Festival Plaza is the open heart of the festival: shows for the whole family.')}</p>
      <p>{t('בכל בוקר ב־11:00 – הופעה לילדים: מארש דונדורמה (חמישי), ״שירים חדשים של פעם״ עם רני גולן (שישי) ו״ילדוג׳אז״ (שבת). וב־17:00 כל יום – הופעה בכניסה חופשית ברחבה.',
            'Every morning at 11:00 there is a children’s show: Marsh Dondurma (Thursday), “New Old Songs” with Rani Golan (Friday) and “Yaldojazz” (Saturday). And every day at 17:00 there is a free show on the Plaza.')}</p>
      <p class="g-more"><a href="{P('lineup.html')}">{t('ללוח ההופעות', 'See the line-up')} {A}</a></p>"""),
        ('access', t('נגישות', 'Accessibility'), t('נגישות', 'Accessibility'), f"""
      <p>{t('אנחנו רוצים שכולם יוכלו ליהנות מהפסטיבל. פרטים על הסדרי הנגישות ועל דרכי הפנייה בנושא נמצאים בהצהרת הנגישות.',
            'We want everyone to enjoy the festival. Details of the accessibility arrangements and how to contact us about them are in the accessibility statement.')}</p>
      <p class="g-more"><a href="{P('accessibility.html')}">{t('להצהרת הנגישות', 'Accessibility statement')} {A}</a></p>"""),
        ('workshops', t('סדנאות', 'Workshops'), t('סדנאות לנגנים צעירים', 'Workshops for young musicians'), f"""
      <p>{t('לצד ההופעות מתקיימות סדנאות ג׳אז לנגנים בגילאי 14–25: נגינה בהרכבים, סדנאות כלי וכיתות אמן עם אמנים בינלאומיים – ובסוף, הופעה על במת הפסטיבל.',
            'Alongside the shows there are jazz workshops for musicians aged 14–25: ensemble playing, instrument workshops and masterclasses with international artists – ending with a performance on the festival stage.')}</p>
      <p class="g-more"><a href="{P('workshops.html')}">{t('פרטים והרשמה', 'Details and sign-up')} {A}</a></p>"""),
    ]
    ig = 'https://www.instagram.com/world.jazz.music/'
    faq = [
        (t('כרטיסים', 'Tickets'), [
            (t('איפה קונים כרטיסים?', 'Where do I buy tickets?'),
             t('<a data-href="tickets" target="_blank" rel="noopener">לרכישת כרטיסים</a>',
               '<a data-href="tickets" target="_blank" rel="noopener">Buy tickets</a>')),
            (t('יש פס יומי?', 'Is there a day pass?'),
             t('כן. פס יומי מכסה את כל מופעי היום במחיר משתלם. <a data-href="daypass" target="_blank" rel="noopener">לרכישת פס יומי</a>',
               "Yes. A day pass covers all of that day's shows at a better price. <a data-href=\"daypass\" target=\"_blank\" rel=\"noopener\">Buy a day pass</a>")),
            (t('יש פס לכל הפסטיבל?', 'Is there a full festival pass?'),
             t('כן. <a data-href="fullpass" target="_blank" rel="noopener">לרכישת פס לכל הפסטיבל</a>',
               'Yes. <a data-href="fullpass" target="_blank" rel="noopener">Buy a full festival pass</a>')),
            (t('אפשר לבטל כרטיס?', 'Can I cancel a ticket?'),
             t(f'כן. ביטול עד 24 שעות לפני תחילת המופע מזכה בהחזר מלא. לביטול – <a href="{P("contact.html")}">פנו אלינו</a>.',
               f'Yes. Cancel up to 24 hours before the show starts for a full refund. To cancel, <a href="{P("contact.html")}">contact us</a>.')),
            (t('כל המופעים בתשלום?', 'Are all shows ticketed?'),
             t(f'לא. חלק מהמופעים בכניסה חופשית – הם מסומנים <a href="{P("lineup.html")}">בלוח ההופעות</a>.', f'No. Some shows are free – they are marked in <a href="{P("lineup.html")}">the line-up</a>.')),
        ]),
        (t('מידע כללי', 'General'), [
            (t('מתי הפסטיבל?', 'When is the festival?'),
             t('<bdi dir="ltr">10–12</bdi> בדצמבר 2026, חמישי עד שבת.', '10–12 December 2026, Thursday to Saturday.')),
            (t('איפה הפסטיבל מתקיים?', 'Where does it take place?'),
             t(f'במרכז פיס למוזיקה רעננה, בחמש במות. <a href="{P("venue.html")}">על המתחם</a>.',
               f'At the Raanana Pais Music Center, on five stages. <a href="{P("venue.html")}">About the venue</a>.')),
            (t('איפה התוכנייה של 2026?', 'Where is the 2026 programme?'),
             t(f'<a href="{P("lineup.html")}">בלוח ההופעות</a>. עדכונים נוספים <a href="{ig}" target="_blank" rel="noopener">באינסטגרם של World Jazz Music</a>.',
               f'See <a href="{P("lineup.html")}">the line-up</a>. More news on <a href="{ig}" target="_blank" rel="noopener">World Jazz Music on Instagram</a>.')),
            (t('איפה חונים?', 'Where do I park?'),
             t('החניה בכל אזור המרכז חופשית (מדרכה אפורה). אם הסביבה עמוסה – בחניון אשכול הפיס בפינת הרחובות החייל והנשיאים, גם הוא בחינם.',
               'Parking around the center is free (grey kerb). If it’s busy, use the Eshkol HaPais car park at the corner of HaChayal and HaNesi’im streets – also free.')),
            (t('יש מופעים לילדים?', 'Are there shows for children?'),
             t(f'כן, ברחבת הפסטיבל – בכניסה חופשית או במחיר סמלי של 20 ש״ח. <a href="{P("lineup.html")}">ללוח ההופעות</a>',
               f'Yes, on the Festival Plaza – free or for a token ₪20. <a href="{P("lineup.html")}">See the line-up</a>')),
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
        desc=t('כל מה שכדאי לדעת לפני שמגיעים לפסטיבל הג׳אז רעננה: הגעה, כרטיסים, משפחות, נגישות, סדנאות ושאלות נפוצות.',
               'Everything to know before you come to the Raanana Jazz Festival: getting here, tickets, families, accessibility, workshops and FAQ.'),
        body=hero(t('לפני שמגיעים', 'Before you go'), t('מידע למבקרים', 'Visitor info'), '',
                  t('הגעה, כרטיסים, משפחות, נגישות וסדנאות – ולמטה, תשובות לשאלות הנפוצות.',
                    'Getting here, tickets, families, accessibility and workshops – and below, answers to common questions.'))
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
            ('מדיניות פרטיות זו חלה על אתר פסטיבל הג׳אז רעננה – World Jazz Music, בכתובת raananajazzfestival.com (״האתר״). הפסטיבל מתקיים במרכז פיס למוזיקה רעננה (״הפסטיבל״, ״אנחנו״).',
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
            ('התנאים שלהלן חלים על השימוש באתר פסטיבל הג׳אז רעננה – World Jazz Music, בכתובת raananajazzfestival.com (״האתר״). הפסטיבל מתקיים במרכז פיס למוזיקה רעננה (״הפסטיבל״, ״אנחנו״).',
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



def load_data():
    """Read SHOWS / DAYS / SITE out of assets/data.js with node (the file is plain JS)."""
    import subprocess, json as _json
    js = ("global.window={};const fs=require('fs');eval(fs.readFileSync(process.argv[1],'utf8').replace(/^const /gm,'var '));"
          "console.log(JSON.stringify({SHOWS,DAYS,SITE}))")
    try:
        out = subprocess.run(['node', '-e', js, os.path.join(OUT, 'assets', 'data.js')], capture_output=True, text=True, check=True).stdout
        return _json.loads(out)
    except Exception as e:
        print('structured data skipped:', e); return None

DATA = load_data()
PLACE = {'@type': 'Place', 'name': 'מרכז פיס למוזיקה רעננה',
         'address': {'@type': 'PostalAddress', 'streetAddress': 'רחוב עציון 48', 'addressLocality': 'רעננה', 'addressCountry': 'IL'}}

def ld_json(lang, name):
    """JSON-LD for the home page (the festival) and the line-up (every show)."""
    import json as _json
    if not DATA or name not in ('index.html', 'lineup.html'):
        return ''
    en = lang == 'en'
    site = SITE_URL + ('/en/' if en else '/')
    pick = lambda s, f: (s.get(f + '_en') if en and s.get(f + '_en') else s.get(f, ''))
    imgurl = lambda f: f'{SITE_URL}/images/' + f.rsplit('.', 1)[0] + '-1600.webp'
    days = {d['id']: d['iso'] for d in DATA['DAYS']}
    shows = [s for s in DATA['SHOWS'] if not s.get('repeat')]
    org = {'@type': 'Organization', 'name': 'World Jazz Music – Raanana Jazz Festival', 'url': SITE_URL + '/', 'logo': f'{SITE_URL}/images/favicon-512.png',
           'sameAs': ['https://www.instagram.com/world.jazz.music/']}
    if name == 'index.html':
        data = {'@context': 'https://schema.org', '@type': 'Festival',
                'name': 'Raanana Jazz Festival – World Jazz Music 2026' if en else 'פסטיבל ג׳אז ומוזיקת עולם רעננה 2026',
                'startDate': '2026-12-10', 'endDate': '2026-12-12', 'eventStatus': 'https://schema.org/EventScheduled',
                'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode', 'location': PLACE, 'url': site,
                'image': [f'{SITE_URL}/images/og-share.jpg'] + [imgurl(s['img']) for s in shows if s.get('img')][:8],
                'organizer': org, 'description': 'Three days of jazz and world music in Raanana, 10–12 December 2026.' if en else 'שלושה ימים של ג׳אז ומוזיקת עולם ברעננה, 10–12 בדצמבר 2026.'}
    else:
        evs = []
        for s in shows:
            e = {'@type': 'MusicEvent', 'name': pick(s, 'title'), 'startDate': f"{days[s['day']]}T{s['time']}:00+02:00",
                 'eventStatus': 'https://schema.org/EventScheduled', 'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
                 'location': dict(PLACE, name=PLACE['name'] + ' – ' + pick(s, 'venue')), 'url': f"{site}lineup#{s['id']}", 'organizer': org}
            if pick(s, 'sub'): e['description'] = pick(s, 'sub')
            if s.get('img'): e['image'] = imgurl(s['img'])
            if s.get('slug'): e['offers'] = {'@type': 'Offer', 'url': DATA['SITE']['tickets'] + s['slug'], 'availability': 'https://schema.org/InStock'}
            evs.append(e)
        data = {'@context': 'https://schema.org', '@graph': evs}
    return '<script type="application/ld+json">' + _json.dumps(data, ensure_ascii=False) + '</script>'

PAGES = {
    'index.html': page_index, 'lineup.html': page_lineup, 'festival-2025.html': page_past,
    'venue.html': page_venue, 'about.html': page_about, 'workshops.html': page_workshops,
    'tickets.html': page_tickets, 'contact.html': page_contact,
    'accessibility.html': page_accessibility, 'guide.html': page_guide, 'privacy.html': page_privacy, 'terms.html': page_terms,
}


def clean(f):
    # pretty addresses: 'lineup.html#x' -> 'lineup#x', 'index.html' -> '' (GitHub Pages serves lineup.html at /lineup)
    path, sep, rest = f.partition('#')
    path, qs, query = path.partition('?')
    if path.endswith('index.html'): path = path[:-len('index.html')]
    elif path.endswith('.html'): path = path[:-5]
    return path + qs + query + sep + rest


def url_path(base, name):
    return base + clean(name)


for lang, cfg in LANGS.items():
    t = (lambda he, en: he) if lang == 'he' else (lambda he, en: en)
    P = lambda f, base=cfg['base']: base + clean(f)
    os.makedirs(cfg['out'], exist_ok=True)
    for name, fn in PAGES.items():
        p = fn(t, P, cfg['arrow'])
        title = p['title'] if p.get('no_suffix') else p['title'] + cfg['suffix']
        html = HEAD.format(lang=lang, og='og-share.jpg' if lang == 'he' else 'og-share-en.jpg', dir=cfg['dir'], title=title, desc=p['desc'], ver=VER, site=SITE_URL + ROOT, extra_head=p.get('head', '') + ld_json(lang, name),
                           robots=ROBOTS, self_path=url_path(cfg['base'], name),
                           he_path=url_path('/', name), en_path=url_path('/en/', name)) \
            + '<main id="main">\n' + p['body'] + '\n</main>\n' + FOOT.format(script=p.get('script', ''), ver=VER)
        with open(os.path.join(cfg['out'], name), 'w') as f:
            f.write(rooted(html))
    print(f'wrote {len(PAGES)} {lang} pages → {cfg["out"]}/')

if not HIDDEN:
    urls = [SITE_URL + url_path(base, n) for base in ('/', '/en/') for n in PAGES]
    with open('sitemap.xml', 'w') as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                + ''.join(f'  <url><loc>{u}</loc></url>\n' for u in urls) + '</urlset>\n')
    with open('robots.txt', 'w') as f:
        f.write(f'User-agent: *\nAllow: /\nDisallow: /preview-uz9hsq/\n\nSitemap: {SITE_URL}/sitemap.xml\n')
    print('wrote sitemap.xml, robots.txt')
    if lang == 'he' and not HIDDEN:
        p = page_404(t, P, cfg['arrow'])
        html = HEAD.format(lang=lang, og='og-share.jpg', dir=cfg['dir'], title=p['title'] + cfg['suffix'], desc=p['desc'], ver=VER, site=SITE_URL,
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
<title>Save the Date · פסטיבל הג׳אז רעננה, __DATES__</title>
__ROBOTS__
<meta name="description" content="Save the Date: World Jazz Music – פסטיבל הג׳אז רעננה, __DATES__, __VENUE__.">
<meta property="og:title" content="Save the Date · פסטיבל הג׳אז רעננה 2026">
<meta property="og:description" content="World Jazz Music · __DATES__ · __VENUE__">
<meta property="og:image" content="__SITE__/soon/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/soon/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@700&family=Rubik:wght@500;700&display=swap" rel="stylesheet">
<style>
:root { --field: #DB5230; --accent: #F7CE46; --ink: #3A1A14; --white: #FFFFFF; --ease-out: cubic-bezier(.23, 1, .32, 1);
  /* one size drives the whole layout, so it always fits one screen */
  --u: min(32vw, 60svh); }
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body { margin: 0; overflow-x: hidden; color: var(--ink); background-color: var(--field); font-family: "Rubik", system-ui, sans-serif;
  background-image: url(/soon/paper.png), url(/soon/paper.png); background-size: 512px, 700px;
  background-position: 0 0, 230px 140px; background-blend-mode: multiply; }
.stage { position: relative; min-height: 100vh; min-height: 100svh; overflow: hidden; display: flex; flex-direction: column; align-items: center;
  padding: max(4svh, 22px) 16px calc(var(--u) * .5); }

/* partner logos on white paint shapes in the top corners */
.corner { position: absolute; top: 0; z-index: 2; line-height: 0; }
.corner .blob { display: block; width: 100%; height: auto; }
.corner .logo { position: absolute; height: auto; }
.c-pais { left: 0; width: calc(var(--u) * .56); }
.c-pais .logo { left: 13%; top: 17%; width: 65%; }
.c-raan { right: 0; width: calc(var(--u) * .36); }
.c-raan .logo { right: 30%; top: 7%; width: 33%; }

/* the lettering: פסטיבל / WORLD. JAZZ. MUSIC. / רעננה */
h1 { position: relative; z-index: 1; width: calc(var(--u) * 1); margin: 0; font-size: inherit; }
.hw { display: block; position: relative; z-index: 1; width: 44%; height: auto; }
.hw-fest { margin: 0 -9% -3% auto; }
.hw-raan { margin: 1% auto 0 -9%; }
.mark { position: relative; display: block; line-height: 0; }
.mark .main { width: 100%; height: auto; }
.mark .ld { position: absolute; width: 5.7%; height: 7.56%; }
.ld1 { left: 78.9%; top: 22.04%; } .ld2 { left: 87.17%; top: 56.42%; } .ld3 { left: 92.59%; top: 88.79%; }

/* SAVE THE DATE on a yellow brush stroke (real text over the paint) */
.std { position: relative; z-index: 1; display: grid; place-items: center; width: calc(var(--u) * 1.22); aspect-ratio: 1569 / 288;
  margin: calc(var(--u) * .03) 0 0; background: url(/soon/brush.webp) center / 100% 100% no-repeat; }
.std span { font-family: "Quicksand", "Rubik", sans-serif; font-weight: 700; font-size: calc(var(--u) * .1); letter-spacing: .01em; color: var(--ink); line-height: 1; padding-top: .06em; }
.date { position: relative; z-index: 1; display: block; width: calc(var(--u) * .7); height: auto; margin-top: calc(var(--u) * .05); rotate: 4deg; }

/* the piano ribbon along the bottom */
.piano { position: absolute; z-index: 0; left: -6vw; bottom: calc(var(--u) * -.1); width: 112vw; max-width: none; height: auto; pointer-events: none; }

@media (max-aspect-ratio: 4/5) {          /* phones and tall windows */
  :root { --u: min(78vw, 37svh); }
  .stage { padding-top: calc(var(--u) * .36); padding-bottom: calc(var(--u) * .78); justify-content: center; }
  .c-pais { width: calc(var(--u) * .52); } .c-raan { width: calc(var(--u) * .36); }
  .hw-fest { margin-right: 0; } .hw-raan { margin-left: 0; }
  .std { width: calc(var(--u) * 1.12); } .std span { font-size: calc(var(--u) * .095); }
  .piano { width: 442vw; left: -44vw; bottom: calc(var(--u) * -.3); }
  .date { width: calc(var(--u) * .95); }   /* a close-up of the ribbon's left end, big keys */
}

@keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes pop { from { opacity: 0; transform: scale(.96); } to { opacity: 1; transform: none; } }
@keyframes beatIn { 0% { transform: scale(.3); opacity: 0; } 60% { transform: scale(1.35); opacity: 1; } 100% { transform: none; opacity: 1; } }
@keyframes sweep { from { clip-path: inset(0 0 0 100%); } to { clip-path: inset(0 0 0 0); } }
@keyframes glide { from { opacity: 0; transform: translateX(-6vw); } to { opacity: 1; transform: none; } }
.mark .main { animation: pop 450ms var(--ease-out) both; }
.hw { animation: rise 380ms var(--ease-out) 120ms both; }
.ld { animation: beatIn 420ms cubic-bezier(.34, 1.56, .64, 1) both; }
.ld1 { animation-delay: 560ms; } .ld2 { animation-delay: 860ms; } .ld3 { animation-delay: 1160ms; }
.std { animation: sweep 700ms var(--ease-out) 300ms both; }
.date { animation: rise 420ms var(--ease-out) 650ms both; }
.piano { animation: glide 1100ms var(--ease-out) 200ms both; }
.corner { animation: rise 420ms var(--ease-out) both; }
@media (prefers-reduced-motion: reduce) { .mark .main, .hw, .ld, .std, .date, .piano, .corner { animation: none; } }
</style>
</head>
<body>
<main class="stage">
  <div class="corner c-pais"><img class="blob" src="/soon/blob-tl.webp" width="611" height="351" alt=""><img class="logo" src="/soon/logo-pais.webp" width="476" height="211" alt="מרכז פיס למוזיקה רעננה"></div>
  <div class="corner c-raan"><img class="blob" src="/soon/blob-tr.webp" width="557" height="399" alt=""><img class="logo" src="/soon/logo-raanana.webp" width="356" height="520" alt="עיריית רעננה"></div>
  <h1>
    <img class="hw hw-fest" src="/soon/word-festival.png" width="411" height="125" alt="">
    <span class="mark"><img class="main" src="/soon/logo.png" width="1052" height="794" alt="פסטיבל World Jazz Music רעננה"><img class="ld ld1" src="/soon/dot1.png" alt=""><img class="ld ld2" src="/soon/dot2.png" alt=""><img class="ld ld3" src="/soon/dot3.png" alt=""></span>
    <img class="hw hw-raan" src="/soon/word-raanana.png" width="416" height="109" alt="">
  </h1>
  <p class="std" lang="en" dir="ltr"><span>SAVE THE DATE</span></p>
  <img class="date" src="/soon/date.webp" width="900" height="267" alt="__DATES__ · __VENUE__">
  <img class="piano" src="/soon/piano.webp" width="2000" height="667" alt="" fetchpriority="low">
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
