// =====================================================================
//  Festival content — edit this file to update the whole site.
//  Images live in /images, ticket links point to tickets.raanana.muni.il
// =====================================================================

const SITE = {
  year: 2025,
  dates: '18–20.12',
  datesLatin: '18–20 <small>DEC 2025</small>',
  director: 'עמית פרידמן',
  venueName: 'המרכז למוזיקה פאיס רעננה',
  tickets: 'https://tickets.raanana.muni.il/',
  fullPass: 'season/1983',
  workshopForm: 'https://forms.gle/R8FgQLkncVsUcWbs9',
  instagram: 'https://www.instagram.com/raananamusiccenter/',
  facebook: 'https://www.facebook.com/raananapaismusiccenter',
  // TODO: replace with the festival's real contact email
  email: 'info@raananajazzfestival.com',
  logo: 'images/44f224268148.png',
  program: 'images/413f2429c54a.png',
};

const DAYS = [
  { id: 'thu', name: 'חמישי', date: '18.12', pass: 'season/1980' },
  { id: 'fri', name: 'שישי', date: '19.12', pass: 'season/1981' },
  { id: 'sat', name: 'שבת', date: '20.12', pass: 'season/1982' },
];

// day, time, title, venue, description, image, ticket slug, free entry, featured on home
const SHOWS = [
  { day: 'thu', time: '17:30', title: 'ביג בנד רעננה – ג׳אז צעיר לכל המשפחה', venue: 'רחבת הפסטיבל', free: true,
    desc: 'הביג בנד הצעיר של רעננה פותח את הפסטיבל במופע סווינג לכל המשפחה.',
    img: '41fe4793261f.jpg', slug: '%D7%91%D7%99%D7%92_%D7%91%D7%A0%D7%93_%D7%A8%D7%A2%D7%A0%D7%A0%D7%94_%D7%9C%D7%9B%D7%9C_%D7%94%D7%9E%D7%A9%D7%A4%D7%97%D7%94' },
  { day: 'thu', time: '18:30', title: 'Hind Ennaira (מרוקו) ועומרי מור', venue: 'אולם ערן', featured: true,
    desc: 'חגיגת קצב מרוקאית – מופע הפתיחה של הפסטיבל מפגיש לראשונה את שני האמנים האנרגטיים והכריזמטיים.',
    img: '65ff5bebae7b.jpg', slug: 'Hind_Ennaira__%D7%9E%D7%A8%D7%95%D7%A7%D7%95__%D7%95%D7%A2%D7%95%D7%9E%D7%A8%D7%99_%D7%9E%D7%95%D7%A8' },
  { day: 'thu', time: '20:00', title: 'רביעיית אהרל׳ה קמינסקי', venue: 'מועדון הסלון',
    desc: 'מחווה לג׳ון קולטריין, אלווין ג׳ונס וסוני רולינס.',
    img: '457a7b076e96.jpg', slug: '%D7%A8%D7%91%D7%99%D7%A2%D7%99%D7%99%D7%AA_%D7%90%D7%94%D7%A8%D7%9C_%D7%94_%D7%A7%D7%9E%D7%99%D7%A0%D7%A1%D7%A7%D7%99_-_%D7%9E%D7%97%D7%95%D7%95%D7%94_%D7%9C%D7%92_%D7%95%D7%9F_%D7%A7%D7%95%D7%9C%D7%98%D7%A8%D7%99%D7%99%D7%9F_%D7%95%D7%90%D7%9C%D7%95%D7%95%D7%99%D7%A1_%D7%92_%D7%95%D7%A0%D7%A1' },
  { day: 'thu', time: '20:00', title: 'Zero Point – הדר נויברג וקטיה טובול', venue: 'המועדון הקאמרי',
    desc: 'עם רביעיית מודוסיקה – מסע מוזיקלי שבו הגבולות בין סגנונות מיטשטשים.',
    img: '50e33ee3a584.jpg', slug: 'Zero_Point___%D7%94%D7%93%D7%A8_%D7%A0%D7%95%D7%99%D7%91%D7%A8%D7%92_%D7%95%D7%A7%D7%98%D7%99%D7%94_%D7%98%D7%95%D7%91%D7%95%D7%9C_%D7%A2%D7%9D_%D7%A8%D7%91%D7%99%D7%A2%D7%99%D7%99%D7%AA_%D7%9E%D7%95%D7%93%D7%95%D7%A1%D7%99%D7%A7%D7%94' },
  { day: 'thu', time: '21:30', title: 'גלעד הקסלמן טריו', venue: 'אולם ערן', featured: true,
    desc: 'גיטריסט העל מניו יורק בביקור מולדת.',
    img: '58f1f2752a22.jpg', slug: '%D7%A9%D7%9C%D7%99%D7%A9%D7%99%D7%99%D7%AA_%D7%92%D7%9C%D7%A2%D7%93_%D7%94%D7%A7%D7%A1%D7%9C%D7%9E%D7%9F' },

  { day: 'fri', time: '17:30', title: 'הישראדיקסי בנד – The Isradixie Band', venue: 'רחבת הפסטיבל', free: true,
    desc: 'מופע חגיגי של דיקסי לכל המשפחה.',
    img: '92a2e4ad85b1.jpg', slug: '%D7%94%D7%99%D7%A9%D7%A8%D7%90%D7%93%D7%99%D7%A7%D7%A1%D7%99_%D7%91%D7%A0%D7%93___The_Isradixie_Band' },
  { day: 'fri', time: '18:30', title: 'אנסמבל שם טוב לוי', venue: 'אולם ערן',
    desc: 'שם טוב לוי והאנסמבל מגישים מבט מרוכז וחד על מיטב יצירתו – מההרכבים האיקוניים ועד עבודותיו עם אריק איינשטיין.',
    img: 'fe4d926b965d.jpg', slug: '%D7%90%D7%A0%D7%A1%D7%9E%D7%91%D7%9C_%D7%A9%D7%9D_%D7%98%D7%95%D7%91_%D7%9C%D7%95%D7%99' },
  { day: 'fri', time: '20:00', title: 'Leonid Nesterov Quartet', venue: 'הסלון הקאמרי',
    desc: 'הרכב בינלאומי עכשווי המשלב את מיטב הכישרונות הבינלאומיים והישראליים בסצנת הג׳אז.',
    img: '60d45e600820.jpg', slug: 'Leonid_Nesterov_Quartet__%D7%A7%D7%A4%D7%A8%D7%99%D7%A1%D7%99%D7%9F_' },
  { day: 'fri', time: '20:00', title: 'Taulant Mehmeti Balkan Quartet', venue: 'המועדון הקאמרי',
    desc: 'ג׳אז בניחוח בלקני.',
    img: '11e83fd3108a.jpg', slug: 'Taulant_Mehmeti_Balkan_Jazz_Quartet' },
  { day: 'fri', time: '21:30', title: 'Jerzy Malek – IQ Project', venue: 'אולם ערן', featured: true,
    desc: 'הרכב בינלאומי יוצא דופן: Jerzy Malek, Andy Middleton, Kalman Oláh, Doug Weiss ו־Alan Jones בפרויקט מקורי חדש.',
    img: 'b10be8da554f.jpg', slug: 'Jerzy_Malek_IQ_Project__%D7%A4%D7%95%D7%9C%D7%99%D7%9F_-_%D7%90%D7%A8%D7%94_%D7%91_' },

  { day: 'sat', time: '11:00', title: 'ילדוג׳אז', venue: 'רחבת הפסטיבל', free: true,
    desc: 'שירי הילדות היפים בעיבודי ג׳אז סוחפים – מופע אינטראקטיבי לכל המשפחה.',
    img: '30b3759118a3.jpg', slug: '%D7%99%D7%9C%D7%93%D7%95%D7%92_%D7%90%D7%96___%D7%A9%D7%99%D7%A8%D7%99_%D7%94%D7%99%D7%9C%D7%93%D7%95%D7%AA_%D7%94%D7%99%D7%A4%D7%99%D7%9D_%D7%91%D7%A2%D7%99%D7%91%D7%95%D7%93%D7%99_%D7%92_%D7%90%D7%96_%D7%A1%D7%95%D7%97%D7%A4%D7%99%D7%9D' },
  { day: 'sat', time: '12:00', title: 'ד״ר רז יצחקי מארח את הזמרת חן לוי', venue: 'אולם ערן',
    desc: 'אלה פיצג׳רלד – הקול של הג׳אז. הרצאה ליד הפסנתר על סיפור חייה של הגדולה מכולן.',
    img: '68c50191e3aa.jpg' },
  { day: 'sat', time: '17:30', title: 'הופעת הרכבי הסדנאות', venue: 'רחבת הפסטיבל', free: true,
    desc: 'משתתפי סדנאות הפסטיבל עולים לבמה עם מה שבנו במהלך שלושת הימים.' },
  { day: 'sat', time: '18:30', title: 'אבישי כהן ובקה גוצ׳יאשווילי (גאורגיה)', venue: 'אולם ערן', featured: true,
    desc: 'שיחה מוזיקלית בין שני ענקים – הפקה מיוחדת לפסטיבל.',
    img: '8300ce79d8cf.jpg', slug: '%D7%90%D7%91%D7%99%D7%A9%D7%99_%D7%9B%D7%94%D7%9F_%D7%95%D7%91%D7%A7%D7%94_%D7%92%D7%95%D7%A6_%D7%99%D7%90%D7%A9%D7%95%D7%95%D7%99%D7%9C%D7%99___%D7%A9%D7%99%D7%97%D7%94_%D7%9E%D7%95%D7%96%D7%99%D7%A7%D7%9C%D7%99%D7%AA_%D7%91%D7%99%D7%9F_%D7%A9%D7%A0%D7%99_%D7%A2%D7%A0%D7%A7%D7%99%D7%9D' },
  { day: 'sat', time: '20:00', title: 'רביעיית תמוז נסים ויורגוס נזוס (יוון)', venue: 'מועדון הסלון', featured: true,
    desc: 'תל אביב – יוון – ניו יורק: מסע מוזיקלי חוצה יבשות, משירים מקוריים ועד עיבודים מיוחדים לקלאסיקות.',
    img: '212b107b7cd4.jpg', slug: '%D7%A8%D7%91%D7%99%D7%A2%D7%99%D7%99%D7%AA_%D7%AA%D7%9E%D7%95%D7%96_%D7%A0%D7%A1%D7%99%D7%9D_%D7%95%D7%99%D7%95%D7%A8%D7%92%D7%95%D7%A1_%D7%A0%D7%96%D7%95%D7%A1__%D7%99%D7%95%D7%95%D7%9F_' },
  { day: 'sat', time: '20:00', title: 'עמית פרידמן קאמרי ג׳אז', venue: 'המועדון הקאמרי', featured: true,
    desc: 'מפגש עולמות מיוחד בין הג׳אז הישראלי לבין רביעיית מיתרים קלאסית.',
    img: '29ff85388999.jpg', slug: '%D7%A7%D7%90%D7%9E%D7%A8%D7%99_%D7%92_%D7%90%D7%96_-_%D7%A9%D7%99%D7%A9%D7%99%D7%99%D7%AA_%D7%A2%D7%9E%D7%99%D7%AA_%D7%A4%D7%A8%D7%99%D7%93%D7%9E%D7%9F' },
  { day: 'sat', time: '21:30', title: 'ביג בנד רעננה – חגיגת סיום', venue: 'אולם ערן',
    desc: 'חגיגת הסיום של הפסטיבל עם אמני הפסטיבל.',
    img: '41fe4793261f.jpg', slug: '%D7%91%D7%99%D7%92_%D7%91%D7%A0%D7%93_%D7%A8%D7%A2%D7%A0%D7%A0%D7%94___%D7%91%D7%97%D7%92%D7%99%D7%92%D7%AA_%D7%A1%D7%99%D7%95%D7%9D_%D7%A2%D7%9D_%D7%90%D7%9E%D7%A0%D7%99_%D7%94%D7%A4%D7%A1%D7%98%D7%99%D7%91%D7%9C' },
];

const THEME_PASSES = [
  ['Jazz', 'Jazz_Pass'], ['World', 'World_Pass'], ['Vocal', 'Vocal_Pass'], ['Music', 'Music_Pass'],
];

const TEACHERS = [
  ['58f1f2752a22.jpg', 'גלעד הקסלמן', 'גיטרה · ניו יורק'],
  ['5e26945bd669.jpg', 'Doug Weiss', 'בס · ברלין–ניו יורק'],
  ['d51c0279d5e3.jpg', 'Jerzy Małek', 'חצוצרה · פולין'],
  ['bc8143617deb.jpg', 'תמוז נסים', 'שירה · ניו יורק'],
  ['77f62589d50f.jpg', 'Andy Middleton', 'סקסופון · וינה'],
  ['fac37d05a7b3.jpg', 'Allan Jones', 'תופים · ארה״ב'],
  ['3266fc1fd5df.jpg', 'Kalman Oláh', 'פסנתר · הונגריה'],
];

const MOMENTS = [
  ['41fe4793261f.jpg', 'ביג בנד רעננה'],
  ['92a2e4ad85b1.jpg', 'הישראדיקסי בנד'],
  ['fe4d926b965d.jpg', 'אנסמבל שם טוב לוי'],
  ['457a7b076e96.jpg', 'רביעיית אהרל׳ה קמינסקי'],
  ['60d45e600820.jpg', 'Leonid Nesterov Quartet'],
  ['11e83fd3108a.jpg', 'Taulant Mehmeti Balkan Quartet'],
  ['30b3759118a3.jpg', 'ילדוג׳אז'],
  ['68c50191e3aa.jpg', 'ד״ר רז יצחקי וחן לוי'],
];

const VENUES = [
  { name: 'אולם ערן', desc: 'האולם המרכזי של הפסטיבל – כאן מתקיימים מופעי השיא, הפקות המקור וחגיגת הסיום.' },
  { name: 'מועדון הסלון', desc: 'אווירת מועדון ג׳אז אינטימית, קרוב לבמה ולנגנים.' },
  { name: 'המועדון הקאמרי', desc: 'במה קטנה למפגשים מוזיקליים מיוחדים בין סגנונות ועולמות.' },
  { name: 'רחבת הפסטיבל', desc: 'הלב הפתוח של הפסטיבל – מופעים לכל המשפחה, והכניסה חופשית.' },
];

const PARTNERS = [
  ['69298d5eb049.png', 'Raanana Pais Music Center'],
  ['a8830166eec8.png', 'עיריית רעננה'],
  ['998addde5757.png', 'המשרד לשיתוף פעולה אזורי'],
];
