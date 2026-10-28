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
    he: 'התוכנייה של פסטיבל 2026 כבר כאן', en: 'The 2026 programme is out',
    link: 'ללוח ההופעות', link_en: 'See the line-up', href: 'lineup.html',
  },
};

// ---------- Festival 2026 (10–12.12.2026) ----------
// iso = the calendar date of each festival day (used by the "now on stage" strip)
// pass = ticket slug for a day pass; add it when the 2026 passes go on sale
const DAYS = [
  { id: 'thu', name: 'חמישי', name_en: 'Thursday', date: '10.12', iso: '2026-12-10' },
  { id: 'fri', name: 'שישי', name_en: 'Friday', date: '11.12', iso: '2026-12-11' },
  { id: 'sat', name: 'שבת', name_en: 'Saturday', date: '12.12', iso: '2026-12-12' },
];

// day, time, dur (minutes), title, venue, description, image, credit, free entry, kids, featured on home
// slug = ticket link on tickets.raanana.muni.il; add it when tickets go on sale
const SHOWS = [
  { day: 'thu', time: '11:00', dur: 55, kids: true, title: 'תנינים על הראש – מארש דונדורמה', title_en: 'Crocodiles on the Head – Marsh Dondurma', venue: 'רחבת הפסטיבל', venue_en: 'Festival Plaza',
    desc: 'סיפורים מוזיקליים לכל המשפחה: התזמורת הירושלמית האהובה וקולו של השחקן יואב יפת, במסע בין ערבות אפריקה, מדרכות העיר והמקלחת שמחכה לכולנו בסוף היום. לגילאי 4 ומעלה.',
    desc_en: 'Musical stories for the whole family: the beloved Jerusalem brass band and the voice of actor Yoav Yefet, on a journey from the African savannah to city pavements. Ages 4 and up.' },
  { day: 'thu', time: '17:00', dur: 50, free: true, featured: true, title: 'אלה שרה אלה – אלה תדמור במחווה לאלה פיצג׳רלד', title_en: 'Ella Sings Ella – Ella Tadmor’s tribute to Ella Fitzgerald', venue: 'רחבת הפסטיבל', venue_en: 'Festival Plaza',
    desc: 'ערב של סווינג ונשמה למלכת הג׳אז: Summertime, Cheek to Cheek, Misty, How High the Moon ועוד, עם עומר ריז׳י, ירון אוזנה, רם ארז ורועי אוליאל.',
    desc_en: 'An evening of swing and soul for the First Lady of Song: Summertime, Cheek to Cheek, Misty, How High the Moon and more, with Omer Rizi, Yaron Ouzana, Ram Erez and Roy Oliel.',
    img: '2026-ella.jpg', credit: 'Luiza Salomon' },
  { day: 'thu', time: '18:00', dur: 75, title: 'Sam Yahel N.Y Quartet', title_en: 'Sam Yahel N.Y Quartet', venue: 'אולם ערן', venue_en: 'Eran Hall',
    desc: 'רביעיית ניו יורק של סם יהל פותחת את ערב הפתיחה באולם המרכזי.', desc_en: 'Sam Yahel’s New York quartet opens the first evening in the main hall.' },
  { day: 'thu', time: '19:30', dur: 60, featured: true, title: 'דאבל סטנדרט – אלי מגן ועדי רנרט', title_en: 'Double Standard – Eli Magen & Adi Renert', venue: 'מועדון הסלון', venue_en: 'The Salon Club',
    desc: 'שירים ישראליים פוגשים סטנדרטים אמריקאיים: שלום חנוך, נעמי שמר וסשה ארגוב לצד דיוק אלינגטון, ארווין ברלין וג׳ורג׳ גרשווין. אלי מגן – קונטרבס ושירה, עדי רנרט – פסנתר, פלוגלהורן ועיבודים.',
    desc_en: 'Israeli songs meet American standards: Shalom Hanoch, Naomi Shemer and Sasha Argov alongside Duke Ellington, Irving Berlin and George Gershwin. Eli Magen – bass and vocals, Adi Renert – piano, flugelhorn and arrangements.',
    img: '2026-magen-renert.jpg', credit: 'Yael Offenbach' },
  { day: 'thu', time: '19:30', dur: 60, featured: true, title: 'אדם שישפורטיש טריו – עם אריאל ברט והילה קרני', title_en: 'Adam Chichportiche Trio – with Ariel Bart & Hila Karni', venue: 'המועדון הקאמרי', venue_en: 'The Chamber Club',
    desc: 'מוזיקה עכשווית בהשראת המקאם, ההרמוניה המערבית והג׳אז המודרני. אדם שישפורטיש – לאבטה, אריאל ברט – מפוחית, הילה קרני – צ׳לו.',
    desc_en: 'Contemporary music inspired by maqam, Western harmony and modern jazz. Adam Chichportiche – lavta, Ariel Bart – harmonica, Hila Karni – cello.',
    img: '2026-chichportiche.jpg', credit: 'Tal Hagi' },
  { day: 'thu', time: '21:00', dur: 75, tba: true, title: 'הופעת הלילה תוכרז בקרוב', title_en: 'Late show – to be announced', venue: 'האוהל', venue_en: 'The Tent',
    desc: 'ההופעה שסוגרת את הערב הראשון תוכרז בקרוב.', desc_en: 'The show that closes the first night will be announced soon.' },

  { day: 'fri', time: '11:00', dur: 60, kids: true, title: 'תנו לי תו – רני גולן', title_en: 'Give Me a Note – Rani Golan', venue: 'רחבת הפסטיבל', venue_en: 'Festival Plaza',
    desc: 'מופע מוזיקלי לכל המשפחה: טקסטים של שלומית כהן אסיף, יהונתן גפן, ברק פלדמן, חיה שנהב ואחרים בלחנים חדשים של רני גולן – והילדים וההורים הופכים לחלק מההרכב.',
    desc_en: 'A musical show for the whole family: words by Shlomit Cohen-Assif, Yehonatan Geffen, Barak Feldman, Haya Shenhav and others set to new music by Rani Golan – with children and parents joining the band.' },
  { day: 'fri', time: '17:00', dur: 50, free: true, title: 'ערב סווינג – שיעור ריקוד ושישיית הסווינג של אלי פרמינגר', title_en: 'Swing night – a dance lesson and the Eli Preminger Swing Sextet', venue: 'רחבת הפסטיבל', venue_en: 'Festival Plaza',
    desc: 'שיעור ריקודי סווינג פתוח לכולם, ורקדנים שמופיעים לאורך כל הערב לצלילי שישיית הסווינג של אלי פרמינגר.',
    desc_en: 'A swing dance lesson open to all, with dancers performing through the evening to the Eli Preminger Swing Sextet.' },
  { day: 'fri', time: '18:00', dur: 75, title: 'עמית פרידמן והרכב סימפוני מארחים את ז׳וקה פרפיניאן', title_en: 'Amit Friedman & symphonic ensemble host Joca Perpignan', venue: 'אולם ערן', venue_en: 'Eran Hall',
    desc: 'המנהל האמנותי של הפסטיבל, עמית פרידמן, והרכב סימפוני מארחים את ז׳וקה פרפיניאן בהפקה מיוחדת באולם המרכזי.',
    desc_en: 'The festival’s artistic director, Amit Friedman, and a symphonic ensemble host Joca Perpignan in a special production in the main hall.' },
  { day: 'fri', time: '19:30', dur: 60, featured: true, title: 'Sax Millennials – דור העתיד של נגני הסקסופון הטנור', title_en: 'Sax Millennials – the next generation of tenor saxophone', venue: 'מועדון הסלון', venue_en: 'The Salon Club',
    desc: 'הפקה מיוחדת עם הקולות הצעירים של הסקסופון הטנור בישראל, בהם אסף חריס ואלכסנדר לוין.',
    desc_en: 'A special production with the young voices of Israeli tenor saxophone, among them Asaf Haris and Alexander Levin.',
    img: '2026-haris.jpg', credit: 'Elia David' },
  { day: 'fri', time: '19:30', dur: 60, featured: true, lead: true, title: 'שישיית יונתן אבישי', title_en: 'Yonatan Avishai Sextet', venue: 'המועדון הקאמרי', venue_en: 'The Chamber Club',
    desc: 'ההרכב החדש של הפסנתרן יונתן אבישי (ECM), לקראת האלבום Walk with Me שייצא ב־2027. עם שחר חזיזה, רוני עברין, הדר נויברג, יונתן אלבלק ומאיו שבירו.',
    desc_en: 'Pianist Yonatan Avishai’s (ECM) new ensemble, ahead of the album Walk with Me, due in 2027. With Shahar Haziza, Roni Ivrin, Hadar Noiberg, Yonatan Albalak and Mayu Shviro.',
    img: '2026-avishai.jpg', credit: 'Yossi Zwecker' },
  { day: 'fri', time: '21:00', dur: 75, title: 'סיריל', title_en: 'Cyril', venue: 'האוהל', venue_en: 'The Tent',
    desc: 'הופעת הלילה של יום שישי באוהל.', desc_en: 'Friday’s late show in the Tent.' },

  { day: 'sat', time: '11:00', dur: 60, kids: true, title: 'ילדוג׳אז', title_en: 'Yaldojazz', venue: 'רחבת הפסטיבל', venue_en: 'Festival Plaza',
    desc: 'בוקר של ג׳אז לילדים ולכל המשפחה.', desc_en: 'A morning of jazz for children and the whole family.' },
  { day: 'sat', time: '12:00', dur: 60, featured: true, title: 'ד״ר רז יצחקי מארח את חן לוי – המאפיה היהודית שולטת בסמטת מחבתות הפח', title_en: 'Dr. Raz Yitzhaki hosts Chen Levi – how Jewish songwriters ruled Tin Pan Alley', venue: 'אולם ערן', venue_en: 'Eran Hall',
    desc: 'הרצאה ליד הפסנתר על ברלין, גרשווין, קרן, רוג׳רס וחבריהם – הכותבים היהודים שעיצבו את השיר האמריקאי ואת הג׳אז. מה סוד הצלחתם?',
    desc_en: 'A talk at the piano about Berlin, Gershwin, Kern, Rodgers and their peers – the Jewish songwriters who shaped the American song and jazz. What was their secret?',
    img: '2026-raz-chen.jpg' },
  { day: 'sat', time: '17:00', dur: 50, free: true, title: 'הופעת הרכבי הסדנאות', title_en: 'Workshop ensembles in concert', venue: 'רחבת הפסטיבל', venue_en: 'Festival Plaza',
    desc: 'הנגנים הצעירים של סדנאות הפסטיבל עולים לבמה עם מה שיצרו במהלך שלושת הימים.',
    desc_en: 'The young musicians of the festival workshops take the stage with what they created over the three days.' },
  { day: 'sat', time: '18:00', dur: 75, title: 'ביג בנד רעננה בניהול עמית פרידמן – עם אורחי הפסטיבל', title_en: 'Raanana Big Band led by Amit Friedman – with festival guests', venue: 'אולם ערן', venue_en: 'Eran Hall',
    desc: 'הביג בנד של רעננה בניהולו של עמית פרידמן, עם אורחי הפסטיבל.', desc_en: 'The Raanana Big Band, led by Amit Friedman, with the festival’s guest artists.' },
  { day: 'sat', time: '19:30', dur: 60, title: 'סלעית ומרסלו', title_en: 'Selait & Marcelo', venue: 'מועדון הסלון', venue_en: 'The Salon Club',
    desc: 'מופע אינטימי במועדון הסלון.', desc_en: 'An intimate show in the Salon Club.' },
  { day: 'sat', time: '19:30', dur: 60, title: 'Verena Zeiner & Ziv Ravitz (אוסטריה/ישראל)', title_en: 'Verena Zeiner & Ziv Ravitz (Austria/Israel)', venue: 'המועדון הקאמרי', venue_en: 'The Chamber Club',
    desc: 'דואו של פסנתר, תופים ואלקטרוניקה: הפסנתרנית הווינאית ורנה ציינר והמתופף זיו רביץ בלחנים משותפים.',
    desc_en: 'A duo of piano, drums and electronics: Viennese pianist Verena Zeiner and drummer Ziv Ravitz in their own compositions.' },
  { day: 'sat', time: '21:00', dur: 75, title: 'אדיס קן – אורח: אהוד בנאי', title_en: 'Adis Ken – guest: Ehud Banai', venue: 'האוהל', venue_en: 'The Tent',
    desc: 'הופעת הסיום של הפסטיבל, עם אהוד בנאי כאורח.', desc_en: 'The festival’s closing show, with Ehud Banai as guest.' },
];

// ---------- Festival 2025 (18–20.12.2025) – the past-editions page and the photo archive ----------
const DAYS_2025 = [
  { id: 'thu', name: 'חמישי', name_en: 'Thursday', date: '18.12', iso: '2025-12-18', pass: 'season/1980' },
  { id: 'fri', name: 'שישי', name_en: 'Friday', date: '19.12', iso: '2025-12-19', pass: 'season/1981' },
  { id: 'sat', name: 'שבת', name_en: 'Saturday', date: '20.12', iso: '2025-12-20', pass: 'season/1982' },
];

const SHOWS_2025 = [
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

// moments from the 2025 festival (photos from the "World.Jazz.Music 2025" album; the full set is the gallery on festival-2025.html)
const MOMENTS = [
  ['moment-2025-1.jpg', 'על הבמה', 'On stage'],
  ['moment-2025-9.jpg', 'רביעייה על הבמה', 'A quartet on stage'],
  ['moment-2025-3.jpg', 'אולם מלא', 'A full house'],
  ['moment-2025-4.jpg', 'קרוב לבמה', 'Up close'],
  ['moment-2025-10.jpg', 'הקהל בהופעת ערב', 'The audience at an evening show'],
  ['moment-2025-6.jpg', 'גיטרה וקונטרבס', 'Guitar and bass'],
  ['moment-2025-11.jpg', 'הדלקת נר חנוכה בלובי', 'Lighting the Hanukkah candles in the lobby'],
  ['moment-2025-8.jpg', 'בלובי בין ההופעות', 'In the lobby between shows'],
];

const VENUES = [
  { name: 'אולם ערן', name_en: 'Eran Hall', desc_en: "The festival's main hall – home to the headline shows, original productions and the closing celebration.", desc: 'האולם המרכזי של הפסטיבל – כאן מתקיימים מופעי השיא, הפקות המקור וחגיגת הסיום.' },
  { name: 'מועדון הסלון', name_en: 'The Salon Club', desc_en: 'An intimate jazz-club atmosphere, close to the stage and the players.', desc: 'אווירת מועדון ג׳אז אינטימית, קרוב לבמה ולנגנים.' },
  { name: 'המועדון הקאמרי', name_en: 'The Chamber Club', desc_en: 'A small stage for special encounters between styles and worlds.', desc: 'במה קטנה למפגשים מוזיקליים מיוחדים בין סגנונות ועולמות.' },
  { name: 'רחבת הפסטיבל', name_en: 'Festival Plaza', desc_en: 'The open heart of the festival – shows for the whole family, free entry.', desc: 'הלב הפתוח של הפסטיבל – מופעים לכל המשפחה, והכניסה חופשית.' },
  { name: 'האוהל', name_en: 'The Tent', desc_en: 'New in 2026: the late-night stage, where every evening ends.', desc: 'חדש ב־2026: במת הלילה, שבה נגמר כל ערב.' },
];

const PARTNERS = [
  ['69298d5eb049.png', 'Raanana Pais Music Center', 'Raanana Pais Music Center'],
  ['a8830166eec8.png', 'עיריית רעננה', 'Raanana Municipality'],
  ['998addde5757.png', 'המשרד לשיתוף פעולה אזורי', 'Ministry of Regional Cooperation'],
];
