// =====================================================================
//  Festival content — edit this file to update the whole site.
//  Images live in /images, ticket links point to tickets.raanana.muni.il
// =====================================================================

const SITE = {
  year: 2026,
  dates: '10–12.12.2026',
  datesLatin: '10–12 <small>DEC 2026</small>',
  director: 'עמית פרידמן',
  venueName: 'המרכז למוזיקה פיס רעננה',
  tickets: 'https://tickets.raanana.muni.il/',
  fullPass: 'season/1983',
  workshopForm: 'https://forms.gle/R8FgQLkncVsUcWbs9',
  instagram: 'https://www.instagram.com/raananamusiccenter/',
  facebook: 'https://www.facebook.com/raananapaismusiccenter',
  // TODO: replace with the festival's real contact email
  email: 'info@raananajazzfestival.com',
  // accessibility coordinator – none appointed yet; when empty the statement asks people to contact the festival
  a11yContact: { name: '', phone: '', email: '' },
  a11yUpdated: '14.10.2026',
  logo: '/images/logo-hero.png',
  logoDark: '/images/logo-dark.png',  // charcoal version for light backgrounds (menu)
  program: '/images/413f2429c54a.png',
  // the strip above the top bar; set to null to hide it
  notice: {
    he: 'התוכנייה של פסטיבל 2026 תפורסם בקרוב', en: 'The 2026 programme will be announced soon',
    link: 'לעדכונים', link_en: 'Get updates', href: 'https://www.instagram.com/world.jazz.music/',
  },
};

// iso = the calendar date of each festival day (used by the "now on stage" strip)
const DAYS = [
  { id: 'thu', name: 'חמישי', name_en: 'Thursday', date: '18.12', iso: '2025-12-18', pass: 'season/1980' },
  { id: 'fri', name: 'שישי', name_en: 'Friday', date: '19.12', iso: '2025-12-19', pass: 'season/1981' },
  { id: 'sat', name: 'שבת', name_en: 'Saturday', date: '20.12', iso: '2025-12-20', pass: 'season/1982' },
];

// day, time, title, venue, description, image, ticket slug, free entry, featured on home
const SHOWS = [
  { day: 'thu', time: '17:30', title: 'ביג בנד רעננה – ג׳אז צעיר לכל המשפחה', title_en: "Raanana Big Band – Young Jazz for the Whole Family", venue: 'רחבת הפסטיבל', venue_en: 'Festival Plaza', free: true,
    desc: 'הביג בנד הצעיר של רעננה פותח את הפסטיבל במופע סווינג לכל המשפחה.',
    desc_en: "Raanana's young big band opens the festival with a swing show for all ages.",
    img: '41fe4793261f.jpg', slug: '%D7%91%D7%99%D7%92_%D7%91%D7%A0%D7%93_%D7%A8%D7%A2%D7%A0%D7%A0%D7%94_%D7%9C%D7%9B%D7%9C_%D7%94%D7%9E%D7%A9%D7%A4%D7%97%D7%94' },
  { day: 'thu', time: '18:30', title: 'Hind Ennaira (מרוקו) ועומרי מור', title_en: "Hind Ennaira (Morocco) & Omri Mor", venue: 'אולם ערן', venue_en: 'Eran Hall', featured: true,
    desc: 'חגיגת קצב מרוקאית – מופע הפתיחה של הפסטיבל מפגיש לראשונה את שני האמנים האנרגטיים והכריזמטיים.',
    desc_en: "A Moroccan rhythm celebration – the festival's opening show brings these two charismatic, high-energy artists together for the first time.",
    img: '65ff5bebae7b.jpg', slug: 'Hind_Ennaira__%D7%9E%D7%A8%D7%95%D7%A7%D7%95__%D7%95%D7%A2%D7%95%D7%9E%D7%A8%D7%99_%D7%9E%D7%95%D7%A8' },
  { day: 'thu', time: '20:00', title: 'רביעיית אהרל׳ה קמינסקי', title_en: "Aharale Kaminsky Quartet", venue: 'מועדון הסלון', venue_en: 'The Salon Club',
    desc: 'מחווה לג׳ון קולטריין, אלווין ג׳ונס וסוני רולינס.',
    desc_en: "A tribute to John Coltrane, Elvin Jones and Sonny Rollins.",
    img: '457a7b076e96.jpg', credit: 'Yossi Zwecker', slug: '%D7%A8%D7%91%D7%99%D7%A2%D7%99%D7%99%D7%AA_%D7%90%D7%94%D7%A8%D7%9C_%D7%94_%D7%A7%D7%9E%D7%99%D7%A0%D7%A1%D7%A7%D7%99_-_%D7%9E%D7%97%D7%95%D7%95%D7%94_%D7%9C%D7%92_%D7%95%D7%9F_%D7%A7%D7%95%D7%9C%D7%98%D7%A8%D7%99%D7%99%D7%9F_%D7%95%D7%90%D7%9C%D7%95%D7%95%D7%99%D7%A1_%D7%92_%D7%95%D7%A0%D7%A1' },
  { day: 'thu', time: '20:00', title: 'Zero Point – הדר נויברג וקטיה טובול', title_en: "Zero Point – Hadar Noiberg & Katia Toubol", venue: 'המועדון הקאמרי', venue_en: 'The Chamber Club',
    desc: 'עם רביעיית מודוסיקה – מסע מוזיקלי שבו הגבולות בין סגנונות מיטשטשים.',
    desc_en: "With the Modusica Quartet – a musical journey where the lines between styles blur.",
    img: '50e33ee3a584.jpg', slug: 'Zero_Point___%D7%94%D7%93%D7%A8_%D7%A0%D7%95%D7%99%D7%91%D7%A8%D7%92_%D7%95%D7%A7%D7%98%D7%99%D7%94_%D7%98%D7%95%D7%91%D7%95%D7%9C_%D7%A2%D7%9D_%D7%A8%D7%91%D7%99%D7%A2%D7%99%D7%99%D7%AA_%D7%9E%D7%95%D7%93%D7%95%D7%A1%D7%99%D7%A7%D7%94' },
  { day: 'thu', time: '21:30', title: 'גלעד הקסלמן טריו', title_en: "Gilad Hekselman Trio", venue: 'אולם ערן', venue_en: 'Eran Hall', featured: true,
    desc: 'גיטריסט העל מניו יורק בביקור מולדת.',
    desc_en: "The New York guitar virtuoso comes home.",
    img: '58f1f2752a22.jpg', slug: '%D7%A9%D7%9C%D7%99%D7%A9%D7%99%D7%99%D7%AA_%D7%92%D7%9C%D7%A2%D7%93_%D7%94%D7%A7%D7%A1%D7%9C%D7%9E%D7%9F' },

  { day: 'fri', time: '17:30', title: 'הישראדיקסי בנד – The Isradixie Band', title_en: "The Isradixie Band", venue: 'רחבת הפסטיבל', venue_en: 'Festival Plaza', free: true,
    desc: 'מופע חגיגי של דיקסי לכל המשפחה.',
    desc_en: "A festive Dixieland show for the whole family.",
    img: '92a2e4ad85b1.jpg', slug: '%D7%94%D7%99%D7%A9%D7%A8%D7%90%D7%93%D7%99%D7%A7%D7%A1%D7%99_%D7%91%D7%A0%D7%93___The_Isradixie_Band' },
  { day: 'fri', time: '18:30', title: 'אנסמבל שם טוב לוי', title_en: "Shem Tov Levi Ensemble", venue: 'אולם ערן', venue_en: 'Eran Hall',
    desc: 'שם טוב לוי והאנסמבל מגישים מבט מרוכז וחד על מיטב יצירתו – מההרכבים האיקוניים ועד עבודותיו עם אריק איינשטיין.',
    desc_en: "Shem Tov Levi and his ensemble present a sharp, focused look at the best of his work – from his iconic bands to his collaborations with Arik Einstein.",
    img: 'fe4d926b965d.jpg', slug: '%D7%90%D7%A0%D7%A1%D7%9E%D7%91%D7%9C_%D7%A9%D7%9D_%D7%98%D7%95%D7%91_%D7%9C%D7%95%D7%99' },
  { day: 'fri', time: '20:00', title: 'Leonid Nesterov Quartet', title_en: "Leonid Nesterov Quartet", venue: 'מועדון הסלון', venue_en: 'The Salon Club',
    desc: 'הרכב בינלאומי עכשווי המשלב את מיטב הכישרונות הבינלאומיים והישראליים בסצנת הג׳אז.',
    desc_en: "A contemporary international ensemble bringing together top international and Israeli jazz talent.",
    img: '60d45e600820.jpg', slug: 'Leonid_Nesterov_Quartet__%D7%A7%D7%A4%D7%A8%D7%99%D7%A1%D7%99%D7%9F_' },
  { day: 'fri', time: '20:00', title: 'Taulant Mehmeti Balkan Quartet', title_en: "Taulant Mehmeti Balkan Quartet", venue: 'המועדון הקאמרי', venue_en: 'The Chamber Club',
    desc: 'ג׳אז בניחוח בלקני.',
    desc_en: "Jazz with a Balkan flavour.",
    img: '11e83fd3108a.jpg', slug: 'Taulant_Mehmeti_Balkan_Jazz_Quartet' },
  { day: 'fri', time: '21:30', title: 'Jerzy Malek – IQ Project', title_en: "Jerzy Malek – IQ Project", venue: 'אולם ערן', venue_en: 'Eran Hall', featured: true,
    desc: 'הרכב בינלאומי יוצא דופן: Jerzy Malek, Andy Middleton, Kalman Oláh, Doug Weiss ו־Alan Jones בפרויקט מקורי חדש.',
    desc_en: "An extraordinary international line-up: Jerzy Malek, Andy Middleton, Kalman Oláh, Doug Weiss and Alan Jones in a brand-new original project.",
    img: 'd51c0279d5e3.jpg', slug: 'Jerzy_Malek_IQ_Project__%D7%A4%D7%95%D7%9C%D7%99%D7%9F_-_%D7%90%D7%A8%D7%94_%D7%91_' },

  { day: 'sat', time: '11:00', title: 'ילדוג׳אז', title_en: "Yaldojazz – Kids' Jazz", venue: 'רחבת הפסטיבל', venue_en: 'Festival Plaza', free: true,
    desc: 'שירי הילדות היפים בעיבודי ג׳אז סוחפים – מופע אינטראקטיבי לכל המשפחה.',
    desc_en: "Beloved children's songs in irresistible jazz arrangements – an interactive show for the whole family.",
    img: '30b3759118a3.jpg', slug: '%D7%99%D7%9C%D7%93%D7%95%D7%92_%D7%90%D7%96___%D7%A9%D7%99%D7%A8%D7%99_%D7%94%D7%99%D7%9C%D7%93%D7%95%D7%AA_%D7%94%D7%99%D7%A4%D7%99%D7%9D_%D7%91%D7%A2%D7%99%D7%91%D7%95%D7%93%D7%99_%D7%92_%D7%90%D7%96_%D7%A1%D7%95%D7%97%D7%A4%D7%99%D7%9D' },
  { day: 'sat', time: '12:00', title: 'ד״ר רז יצחקי מארח את הזמרת חן לוי', title_en: "Dr. Raz Yitzhaki hosts singer Chen Levi", venue: 'אולם ערן', venue_en: 'Eran Hall',
    desc: 'אלה פיצג׳רלד – הקול של הג׳אז. הרצאה ליד הפסנתר על סיפור חייה של הגדולה מכולן.',
    desc_en: "Ella Fitzgerald – the voice of jazz. A talk at the piano on the life of the greatest of them all.",
    img: '68c50191e3aa.jpg' },
  { day: 'sat', time: '17:30', title: 'הופעת הרכבי הסדנאות', title_en: "Workshop Ensembles Showcase", venue: 'רחבת הפסטיבל', venue_en: 'Festival Plaza', free: true,
    desc: 'משתתפי סדנאות הפסטיבל עולים לבמה עם מה שבנו במהלך שלושת הימים.',
    desc_en: "Festival workshop participants take the stage with what they built over three days." },
  { day: 'sat', time: '18:30', title: 'אבישי כהן ובקה גוצ׳יאשווילי (גאורגיה)', title_en: "Avishai Cohen & Beka Gochiashvili (Georgia)", venue: 'אולם ערן', venue_en: 'Eran Hall', featured: true, lead: true,
    desc: 'שיחה מוזיקלית בין שני ענקים – הפקה מיוחדת לפסטיבל.',
    desc_en: "A musical conversation between two giants – a special festival production.",
    img: '8300ce79d8cf.jpg', slug: '%D7%90%D7%91%D7%99%D7%A9%D7%99_%D7%9B%D7%94%D7%9F_%D7%95%D7%91%D7%A7%D7%94_%D7%92%D7%95%D7%A6_%D7%99%D7%90%D7%A9%D7%95%D7%95%D7%99%D7%9C%D7%99___%D7%A9%D7%99%D7%97%D7%94_%D7%9E%D7%95%D7%96%D7%99%D7%A7%D7%9C%D7%99%D7%AA_%D7%91%D7%99%D7%9F_%D7%A9%D7%A0%D7%99_%D7%A2%D7%A0%D7%A7%D7%99%D7%9D' },
  { day: 'sat', time: '20:00', title: 'רביעיית תמוז נסים ויורגוס נזוס (יוון)', title_en: "Tamuz Nissim & Yorgos Nazos Quartet (Greece)", venue: 'מועדון הסלון', venue_en: 'The Salon Club', featured: true,
    desc: 'תל אביב – יוון – ניו יורק: מסע מוזיקלי חוצה יבשות, משירים מקוריים ועד עיבודים מיוחדים לקלאסיקות.',
    desc_en: "Tel Aviv – Greece – New York: a journey across continents, from original songs to fresh takes on classics.",
    img: '212b107b7cd4.jpg', slug: '%D7%A8%D7%91%D7%99%D7%A2%D7%99%D7%99%D7%AA_%D7%AA%D7%9E%D7%95%D7%96_%D7%A0%D7%A1%D7%99%D7%9D_%D7%95%D7%99%D7%95%D7%A8%D7%92%D7%95%D7%A1_%D7%A0%D7%96%D7%95%D7%A1__%D7%99%D7%95%D7%95%D7%9F_' },
  { day: 'sat', time: '20:00', title: 'עמית פרידמן קאמרי ג׳אז', title_en: "Amit Friedman Chamber Jazz", venue: 'המועדון הקאמרי', venue_en: 'The Chamber Club', featured: true,
    desc: 'מפגש עולמות מיוחד בין הג׳אז הישראלי לבין רביעיית מיתרים קלאסית.',
    desc_en: "A special meeting of Israeli jazz and a classical string quartet.",
    img: '29ff85388999.jpg', slug: '%D7%A7%D7%90%D7%9E%D7%A8%D7%99_%D7%92_%D7%90%D7%96_-_%D7%A9%D7%99%D7%A9%D7%99%D7%99%D7%AA_%D7%A2%D7%9E%D7%99%D7%AA_%D7%A4%D7%A8%D7%99%D7%93%D7%9E%D7%9F' },
  { day: 'sat', time: '21:30', title: 'ביג בנד רעננה – חגיגת סיום', title_en: "Raanana Big Band – Closing Celebration", venue: 'אולם ערן', venue_en: 'Eran Hall',
    desc: 'חגיגת הסיום של הפסטיבל עם אמני הפסטיבל.',
    desc_en: "The festival's closing celebration with the festival artists.",
    img: '41fe4793261f.jpg', slug: '%D7%91%D7%99%D7%92_%D7%91%D7%A0%D7%93_%D7%A8%D7%A2%D7%A0%D7%A0%D7%94___%D7%91%D7%97%D7%92%D7%99%D7%92%D7%AA_%D7%A1%D7%99%D7%95%D7%9D_%D7%A2%D7%9D_%D7%90%D7%9E%D7%A0%D7%99_%D7%94%D7%A4%D7%A1%D7%98%D7%99%D7%91%D7%9C' },
];

const THEME_PASSES = [
  ['Jazz', 'Jazz_Pass'], ['World', 'World_Pass'], ['Vocal', 'Vocal_Pass'], ['Music', 'Music_Pass'],
];

const TEACHERS = [
  ['58f1f2752a22.jpg', 'גלעד הקסלמן', 'גיטרה · ניו יורק', 'Gilad Hekselman', 'Guitar · New York'],
  ['5e26945bd669.jpg', 'Doug Weiss', 'בס · ברלין–ניו יורק', 'Doug Weiss', 'Bass · Berlin–New York'],
  ['d51c0279d5e3.jpg', 'Jerzy Małek', 'חצוצרה · פולין', 'Jerzy Małek', 'Trumpet · Poland'],
  ['bc8143617deb.jpg', 'תמוז נסים', 'שירה · ניו יורק', 'Tamuz Nissim', 'Voice · New York'],
  ['77f62589d50f.jpg', 'Andy Middleton', 'סקסופון · וינה', 'Andy Middleton', 'Saxophone · Vienna'],
  ['fac37d05a7b3.jpg', 'Allan Jones', 'תופים · ארה״ב', 'Allan Jones', 'Drums · USA'],
  ['3266fc1fd5df.jpg', 'Kalman Oláh', 'פסנתר · הונגריה', 'Kalman Oláh', 'Piano · Hungary'],
];

const MOMENTS = [
  ['41fe4793261f.jpg', 'ביג בנד רעננה', 'Raanana Big Band'],
  ['92a2e4ad85b1.jpg', 'הישראדיקסי בנד', 'The Isradixie Band'],
  ['fe4d926b965d.jpg', 'אנסמבל שם טוב לוי', 'Shem Tov Levi Ensemble'],
  ['457a7b076e96.jpg', 'רביעיית אהרל׳ה קמינסקי', 'Aharale Kaminsky Quartet', 'Yossi Zwecker'],
  ['60d45e600820.jpg', 'Leonid Nesterov Quartet', 'Leonid Nesterov Quartet'],
  ['11e83fd3108a.jpg', 'Taulant Mehmeti Balkan Quartet', 'Taulant Mehmeti Balkan Quartet'],
  ['30b3759118a3.jpg', 'ילדוג׳אז', 'Yaldojazz'],
  ['68c50191e3aa.jpg', 'ד״ר רז יצחקי וחן לוי', 'Dr. Raz Yitzhaki & Chen Levi'],
];

const VENUES = [
  { name: 'אולם ערן', name_en: 'Eran Hall', desc_en: "The festival's main hall – home to the headline shows, original productions and the closing celebration.", desc: 'האולם המרכזי של הפסטיבל – כאן מתקיימים מופעי השיא, הפקות המקור וחגיגת הסיום.' },
  { name: 'מועדון הסלון', name_en: 'The Salon Club', desc_en: 'An intimate jazz-club atmosphere, close to the stage and the players.', desc: 'אווירת מועדון ג׳אז אינטימית, קרוב לבמה ולנגנים.' },
  { name: 'המועדון הקאמרי', name_en: 'The Chamber Club', desc_en: 'A small stage for special encounters between styles and worlds.', desc: 'במה קטנה למפגשים מוזיקליים מיוחדים בין סגנונות ועולמות.' },
  { name: 'רחבת הפסטיבל', name_en: 'Festival Plaza', desc_en: 'The open heart of the festival – shows for the whole family, free entry.', desc: 'הלב הפתוח של הפסטיבל – מופעים לכל המשפחה, והכניסה חופשית.' },
];

const PARTNERS = [
  ['69298d5eb049.png', 'Raanana Pais Music Center', 'Raanana Pais Music Center'],
  ['a8830166eec8.png', 'עיריית רעננה', 'Raanana Municipality'],
  ['998addde5757.png', 'המשרד לשיתוף פעולה אזורי', 'Ministry of Regional Cooperation'],
];
