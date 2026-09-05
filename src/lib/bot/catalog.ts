export type Lang = "hi" | "en";

export type ServiceId =
  | "kundli"
  | "milan"
  | "marriage"
  | "career"
  | "child"
  | "education"
  | "abroad"
  | "health"
  | "property"
  | "finance"
  | "gemstone"
  | "vastu"
  | "palmistry"
  | "lalkitab"
  | "numerology"
  | "reiki";

export const BUSINESS = {
  name: "Astro-Vision",
  legal: "Astro-Vision Astrological Centre (Regd.)",
  astrologer: "Harvinder Singh Dhillon",
  since: 1986,
  phones: ["+91-98140-28644", "+91-98761-28644"],
  email: "astrovision@msn.com",
  address:
    "#14850, St. No. 07, Parbhat Nagar, Dholewal, Ludhiana-141003, Punjab, India",
  city: "Ludhiana",
  youtube: "https://www.youtube.com/channel/UCcvNVnhoVoAAI0pp_az-1UA",
  website: "https://astro-vision.co.in",
};

export const MENU_ITEMS: { id: ServiceId | "book" | "contact"; num: number; title: { hi: string; en: string } }[] =
  [
    { id: "kundli", num: 1, title: { hi: "Janam Kundli / Horoscope", en: "Birth chart / Horoscope" } },
    { id: "milan", num: 2, title: { hi: "Kundli Milan / Match making", en: "Kundli matching" } },
    { id: "marriage", num: 3, title: { hi: "Shaadi / Love marriage", en: "Marriage & love" } },
    { id: "career", num: 4, title: { hi: "Business / Naukri", en: "Business / Career" } },
    { id: "child", num: 5, title: { hi: "Santaan yog", en: "Child / Santaan" } },
    { id: "education", num: 6, title: { hi: "Padhai / Exam", en: "Education" } },
    { id: "abroad", num: 7, title: { hi: "Videsh yatra", en: "Foreign settlement" } },
    { id: "health", num: 8, title: { hi: "Swasthya", en: "Health" } },
    { id: "property", num: 9, title: { hi: "Property / Ghar", en: "Property" } },
    { id: "finance", num: 10, title: { hi: "Dhan / Finance", en: "Money / Finance" } },
    { id: "gemstone", num: 11, title: { hi: "Ratna / Gemstone", en: "Gemstones" } },
    { id: "vastu", num: 12, title: { hi: "Vastu Shastra", en: "Vastu" } },
    { id: "palmistry", num: 13, title: { hi: "Hast rekha", en: "Palmistry" } },
    { id: "lalkitab", num: 14, title: { hi: "Lal Kitab", en: "Lal Kitab" } },
    { id: "numerology", num: 15, title: { hi: "Numerology", en: "Numerology" } },
    { id: "reiki", num: 16, title: { hi: "Reiki healing", en: "Reiki" } },
    { id: "book", num: 17, title: { hi: "Appointment book karein", en: "Book an appointment" } },
    { id: "contact", num: 18, title: { hi: "Pata aur phone", en: "Address & phone" } },
  ];

type Copy = { hi: string; en: string };

export const SERVICES: Record<
  ServiceId,
  {
    keywords: string[];
    title: Copy;
    reply: Copy;
  }
> = {
  kundli: {
    keywords: [
      "kundli",
      "kundali",
      "horoscope",
      "janam",
      "janampatri",
      "janam patri",
      "birth chart",
      "rasi",
      "rashi",
      "lagna",
      "dasha",
      "mahadasha",
    ],
    title: { hi: "Janam Kundli", en: "Birth chart" },
    reply: {
      hi: `Janam Kundli aapki poori zindagi ka naksha hai — graha, rashi, dasha aur yog.

Astro-Vision par Pandit Harvinder Singh Dhillon ji Vedic paddhati se kundli padhte hain: shaadi, naukri, dhan, sehat aur samay ka phal.

Personal reading ke liye janam tithi, samay aur sthan chahiye.

Appointment book karni hai? "Haan" likhein, ya 17 bhejein.`,
      en: `A birth chart is the map of the sky at your exact time of birth — planets, signs, dashas and yogas.

Pandit Harvinder Singh Dhillon reads Vedic charts for marriage, career, money, health and timing.

For a personal reading we need date, time and place of birth.

Book an appointment? Reply Yes, or send 17.`,
    },
  },
  milan: {
    keywords: [
      "milan",
      "matching",
      "match making",
      "matchmaking",
      "gun milan",
      "guna",
      "ashtakoot",
      "manglik",
      "mangal dosh",
      "kuja",
      "compatibility",
    ],
    title: { hi: "Kundli Milan", en: "Match making" },
    reply: {
      hi: `Kundli Milan / Ashtakoot gun milan se dono janam kundli ki compatibility dekhi jati hai — man, ghar, santaan aur lambi shaadi.

Mangal dosh, dasha sandhi aur papa samya bhi check hota hai. Sirf score nahi, samajhdar salah.

Dono ki janam tithi, samay, sthan bhejein — ya appointment book karein.

"Haan" likhein booking ke liye.`,
      en: `Kundli matching (Ashtakoot) checks compatibility of two charts — mind, home, children and a lasting marriage.

We also review Mangal dosh, dasha sandhi and papa samya. Not just a score — practical counsel.

Send both birth details, or book a sitting.

Reply Yes to book.`,
    },
  },
  marriage: {
    keywords: [
      "shaadi",
      "shadi",
      "vivah",
      "marriage",
      "love marriage",
      "love problem",
      "rishta",
      "roka",
      "delay marriage",
      "shaadi kab",
      "married life",
      "patni",
      "pati",
      "divorce",
      "talaq",
    ],
    title: { hi: "Shaadi / Love", en: "Marriage" },
    reply: {
      hi: `Shaadi ka samay, love marriage, rishta rukna, ya ghar mein tanav — yeh sab Saptam bhaav, Venus/Jupiter aur dasha se padha jata hai.

Astro-Vision par:
• Vivah yog aur timing
• Love marriage vs arranged
• Married life ke upaay
• Love problems ke liye salah

Personal jawab ke liye kundli chahiye. Appointment? "Haan" likhein.`,
      en: `Marriage timing, love vs arranged, delayed rishta or tension at home — we read the 7th house, Venus/Jupiter and running dashas.

Astro-Vision covers:
• Marriage yoga and timing
• Love marriage questions
• Married-life remedies
• Relationship counsel

A chart is needed for a personal answer. Reply Yes to book.`,
    },
  },
  career: {
    keywords: [
      "naukri",
      "job",
      "career",
      "business",
      "vyapar",
      "promotion",
      "interview",
      "transfer",
      "sarkari",
      "government job",
      "paisa kamana",
      "work",
    ],
    title: { hi: "Business / Naukri", en: "Career" },
    reply: {
      hi: `Dasam bhaav career aur samajik sthan batata hai — naukri vs business, promotion, interview, ya naya vyapar.

Pandit ji dekhte hain kaunsa samay shubh hai shuruat, interview ya partnership ke liye.

Apni janam details bhejein, ya "Haan" likhkar appointment lein.`,
      en: `The 10th house speaks to career and standing — job vs business, promotion, interviews or a new venture.

We time starts, interviews and partnerships from the chart.

Send birth details, or reply Yes to book.`,
    },
  },
  child: {
    keywords: [
      "santaan",
      "santan",
      "child",
      "baby",
      "garbh",
      "pregnancy",
      "aulaad",
      "putra",
      "infertility",
      "baccha",
      "bachcha",
    ],
    title: { hi: "Santaan yog", en: "Children" },
    reply: {
      hi: `Santaan yog Pancham bhaav, Jupiter aur relevant dasha se padha jata hai. Bahut couples ko timing aur upaay se disha milti hai.

Yeh medical ilaaj ki jagah nahi — Jyotish sahayata hai. Personal reading ke liye dono ki kundli madadgar hoti hai.

Appointment ke liye "Haan" likhein.`,
      en: `Child yoga is read from the 5th house, Jupiter and the running dashas. Many couples find timing and remedies useful.

This supports, not replaces, medical care. Both charts help a personal reading.

Reply Yes to book.`,
    },
  },
  education: {
    keywords: [
      "padhai",
      "education",
      "exam",
      "study",
      "school",
      "college",
      "result",
      "competition",
      "ias",
      "neet",
      "jee",
    ],
    title: { hi: "Padhai / Exam", en: "Education" },
    reply: {
      hi: `Padhai, exam aur competition — Pancham/Navam bhaav, Mercury aur dasha se dekha jata hai. Bacche ki kundli se subject, focus aur shubh samay ki salah milti hai.

Janam tithi, samay, sthan bhejein. Appointment? "Haan" likhein.`,
      en: `Studies, exams and competitions are read from the 5th/9th houses, Mercury and dashas. A child's chart helps with focus, stream and timing.

Send birth details. Reply Yes to book.`,
    },
  },
  abroad: {
    keywords: [
      "videsh",
      "abroad",
      "foreign",
      "canada",
      "usa",
      "uk",
      "australia",
      "visa",
      "settlement",
      "immigration",
      "bahar",
      "overseas",
      "pr",
    ],
    title: { hi: "Videsh yatra", en: "Foreign settlement" },
    reply: {
      hi: `Videsh yog — 9th/12th bhaav, Rahu aur dasha se padha jata hai. Kab travel, study, job ya settlement ka samay zyada madadgar hai, yeh kundli se clear hota hai.

Visa approval ki guarantee koi nahi de sakta. Timing aur upaay ki salah milti hai.

"Haan" likhein appointment ke liye.`,
      en: `Foreign settlement is read from the 9th/12th houses, Rahu and dashas — travel, study, work or living abroad.

No one can guarantee a visa. We advise on timing and remedies.

Reply Yes to book.`,
    },
  },
  health: {
    keywords: [
      "sehat",
      "swasthya",
      "health",
      "bimari",
      "illness",
      "disease",
      "hospital",
      "operation",
    ],
    title: { hi: "Swasthya", en: "Health" },
    reply: {
      hi: `Kundli mein 6th/8th/12th bhaav sehat ke sensitive points dikhate hain. Pehle se savdhani aur upaay ki salah di jati hai.

Yeh doctor ki jagah nahi. Ilaaj zaroor karwayein, Jyotish saath mein sahayata karta hai.

Appointment ke liye "Haan" likhein.`,
      en: `The 6th, 8th and 12th houses show sensitive health points. We advise caution and remedies in advance.

This does not replace a doctor. Please take medical care; Jyotish supports alongside.

Reply Yes to book.`,
    },
  },
  property: {
    keywords: [
      "property",
      "ghar",
      "plot",
      "makan",
      "house",
      "flat",
      "zameen",
      "land",
      "sale",
      "purchase",
      "registry",
    ],
    title: { hi: "Property", en: "Property" },
    reply: {
      hi: `Ghar, plot, kharid-farokht ya vivad — 4th bhaav aur dasha se dekha jata hai. Property aapke grahon ke anukool hai ya nahi, iski bhi salah milti hai.

Vastu ke saath milakar reading zyada clear hoti hai.

"Haan" likhein booking ke liye.`,
      en: `Home, plot, buying/selling or disputes — read from the 4th house and dashas. We also advise whether a property sits well with your chart.

Paired with Vastu, the reading is clearer.

Reply Yes to book.`,
    },
  },
  finance: {
    keywords: [
      "dhan",
      "money",
      "finance",
      "paise",
      "wealth",
      "loan",
      "debt",
      "karz",
      "income",
      "loss",
      "profit",
      "share",
      "stock",
    ],
    title: { hi: "Dhan / Finance", en: "Finance" },
    reply: {
      hi: `Dhan yog, kharch, karz aur recovery — 2nd/11th bhaav aur dasha se padha jata hai. Kab rukawat khulegi, kab naya kaam shubh hai, iski salah milti hai.

Personal forecast ke liye kundli zaroori hai. "Haan" likhein.`,
      en: `Wealth, expenses, debt and recovery — 2nd/11th houses and dashas. We time openings and caution periods.

A chart is required for a personal forecast. Reply Yes.`,
    },
  },
  gemstone: {
    keywords: [
      "ratna",
      "gem",
      "gemstone",
      "stone",
      "pukhraj",
      "neelam",
      "manik",
      "ruby",
      "emerald",
      "panna",
      "moonga",
      "coral",
      "moti",
      "pearl",
      "gomed",
      "hessonite",
      "lahasunya",
      "cats eye",
      "cat's eye",
      "opal",
      "heera",
      "diamond",
      "yellow sapphire",
      "blue sapphire",
    ],
    title: { hi: "Ratna", en: "Gemstones" },
    reply: {
      hi: `Ratna grahon ko shant / prabal karne ke liye pehne jate hain. Galat pathar nuksaan bhi kar sakta hai — isliye kundli dekh kar hi salah.

Astro-Vision par:
Moti, Manik, Moonga, Neelam, Pukhraj, Panna, Heera/Opal, Lahasunya, Gomedh

Kaunsa, kaunsi ungli, kaunsa dhatu, kaunsa din — yeh personal hota hai.

Appointment? "Haan" likhein. Koi stone ka naam bhejein to uski jaankari de dunga.`,
      en: `Gems are worn to steady or strengthen planets. The wrong stone can harm — so we recommend only after reading the chart.

We advise on Moti, Manik, Moonga, Neelam, Pukhraj, Panna, Diamond/Opal, Cat's eye and Gomedh: which gem, finger, metal and day.

Reply Yes to book. Or send a stone name for general info.`,
    },
  },
  vastu: {
    keywords: [
      "vastu",
      "vaastu",
      "direction",
      "disha",
      "main door",
      "kitchen vastu",
    ],
    title: { hi: "Vastu", en: "Vastu" },
    reply: {
      hi: `Vastu ghar aur dukan ki disha, pravesh dwar, kitchen aur bedroom set karti hai. Pandit Harvinder Singh Dhillon Vastu consultant bhi hain.

Naya ghar, plot chunna, ya purane ghar mein dosh — site visit / nakshe ke saath salah.

Appointment ke liye "Haan" likhein ya 18 par address dekhein.`,
      en: `Vastu sets direction, entrance, kitchen and bedrooms for home and shop. Pandit Harvinder Singh Dhillon also consults on Vastu.

New house, plot choice, or dosh in an existing home — we work from a plan or visit.

Reply Yes to book, or 18 for the address.`,
    },
  },
  palmistry: {
    keywords: [
      "palm",
      "palmistry",
      "hast",
      "hath",
      "hasta rekha",
      "hand reading",
      "lines",
    ],
    title: { hi: "Hast rekha", en: "Palmistry" },
    reply: {
      hi: `Hast rekha se swabhav, health line, career aur shaadi ke sanket padhe jate hain. Kundli ke saath milane par picture clear hoti hai.

In-person reading best rehti hai — Ludhiana centre par.

Appointment? "Haan" likhein.`,
      en: `Palmistry reads character, health, career and marriage marks. Together with the chart, the picture is clearer.

Best done in person at the Ludhiana centre.

Reply Yes to book.`,
    },
  },
  lalkitab: {
    keywords: [
      "lal kitab",
      "lalkitab",
      "red book",
      "upay",
      "upaay",
      "totka",
    ],
    title: { hi: "Lal Kitab", en: "Lal Kitab" },
    reply: {
      hi: `Lal Kitab ke upaay seedhe aur ghar baithe kiye ja sakte hain. Punjab mein Astro-Vision isi visheshagya ke liye jaana jata hai.

Kundli dekh kar hi upaay bataye jate hain — generic totke nahi.

"Haan" likhein appointment ke liye.`,
      en: `Lal Kitab remedies are practical and can be done at home. Astro-Vision is known in Punjab for this work.

Remedies are given only after the chart — not generic tricks.

Reply Yes to book.`,
    },
  },
  numerology: {
    keywords: [
      "numerology",
      "number",
      "ank",
      "mulank",
      "bhagyank",
      "name number",
      "mobile number",
    ],
    title: { hi: "Numerology", en: "Numerology" },
    reply: {
      hi: `Numerology mein janam ank, bhagya ank aur naam ka ank dekha jata hai. Naam, mobile number ya business name ki spelling par salah milti hai.

Apna poora naam aur janam tithi bhejein, ya appointment lein.

"Haan" likhein.`,
      en: `Numerology looks at birth number, destiny number and name number — useful for name, mobile or business spelling.

Send full name and date of birth, or book a sitting.

Reply Yes.`,
    },
  },
  reiki: {
    keywords: ["reiki", "healing", "energy healing"],
    title: { hi: "Reiki", en: "Reiki" },
    reply: {
      hi: `Reiki ek energy healing paddhati hai — tanav, ghar ke mahaul aur spiritual balance ke liye. Jyotish ke saath use kiya jata hai.

Ludhiana centre par session book ho sakta hai. "Haan" likhein.`,
      en: `Reiki is an energy-healing practice for stress, home atmosphere and balance. Used alongside Jyotish.

Sessions at the Ludhiana centre. Reply Yes to book.`,
    },
  },
};

export const GEMSTONES: {
  keys: string[];
  name: Copy;
  planet: Copy;
  finger: Copy;
  day: Copy;
  metal: Copy;
}[] = [
  {
    keys: ["moti", "pearl", "white pearl"],
    name: { hi: "Moti (White Pearl)", en: "White Pearl (Moti)" },
    planet: { hi: "Chandra", en: "Moon" },
    finger: { hi: "kanishthika (little finger)", en: "little finger" },
    day: { hi: "Somvaar", en: "Monday" },
    metal: { hi: "Chandi", en: "Silver" },
  },
  {
    keys: ["manik", "ruby", "maanik"],
    name: { hi: "Manik (Ruby)", en: "Ruby (Manik)" },
    planet: { hi: "Surya", en: "Sun" },
    finger: { hi: "anamika (ring finger)", en: "ring finger" },
    day: { hi: "Ravivaar", en: "Sunday" },
    metal: { hi: "Sona / Tambe", en: "Gold / Copper" },
  },
  {
    keys: ["moonga", "coral", "red coral", "moonga"],
    name: { hi: "Moonga (Red Coral)", en: "Red Coral (Moonga)" },
    planet: { hi: "Mangal", en: "Mars" },
    finger: { hi: "anamika (ring finger)", en: "ring finger" },
    day: { hi: "Mangalvaar", en: "Tuesday" },
    metal: { hi: "Sona / Tambe", en: "Gold / Copper" },
  },
  {
    keys: ["neelam", "blue sapphire", "neelam"],
    name: { hi: "Neelam (Blue Sapphire)", en: "Blue Sapphire (Neelam)" },
    planet: { hi: "Shani", en: "Saturn" },
    finger: { hi: "madhyama (middle finger)", en: "middle finger" },
    day: { hi: "Shanivaar", en: "Saturday" },
    metal: { hi: "Sona / Chandi", en: "Gold / Silver" },
  },
  {
    keys: ["pukhraj", "yellow sapphire", "pukhraj"],
    name: { hi: "Pukhraj (Yellow Sapphire)", en: "Yellow Sapphire (Pukhraj)" },
    planet: { hi: "Guru (Brihaspati)", en: "Jupiter" },
    finger: { hi: "tarjani (index finger)", en: "index finger" },
    day: { hi: "Guruvaar", en: "Thursday" },
    metal: { hi: "Sona", en: "Gold" },
  },
  {
    keys: ["panna", "emerald"],
    name: { hi: "Panna (Emerald)", en: "Emerald (Panna)" },
    planet: { hi: "Budh", en: "Mercury" },
    finger: { hi: "kanishthika (little finger)", en: "little finger" },
    day: { hi: "Budhvaar", en: "Wednesday" },
    metal: { hi: "Sona / Chandi", en: "Gold / Silver" },
  },
  {
    keys: ["heera", "diamond", "opal", "white opal"],
    name: { hi: "Heera / Opal", en: "Diamond / Opal" },
    planet: { hi: "Shukra", en: "Venus" },
    finger: { hi: "madhyama (middle finger)", en: "middle finger" },
    day: { hi: "Shukravaar", en: "Friday" },
    metal: { hi: "Chandi", en: "Silver" },
  },
  {
    keys: ["lahasunya", "lahsuniya", "cat eye", "cat's eye", "cats eye"],
    name: { hi: "Lahasunya (Cat's Eye)", en: "Cat's Eye (Lahasunya)" },
    planet: { hi: "Ketu", en: "Ketu" },
    finger: { hi: "madhyama (middle finger)", en: "middle finger" },
    day: { hi: "Shanivaar", en: "Saturday" },
    metal: { hi: "Chandi", en: "Silver" },
  },
  {
    keys: ["gomed", "gomedh", "gaumed", "hessonite", "garnet"],
    name: { hi: "Gomedh (Hessonite)", en: "Hessonite (Gomedh)" },
    planet: { hi: "Rahu", en: "Rahu" },
    finger: { hi: "madhyama (middle finger)", en: "middle finger" },
    day: { hi: "Shanivaar", en: "Saturday" },
    metal: { hi: "Chandi", en: "Silver" },
  },
];

export const RASHIS: { keys: string[]; name: Copy }[] = [
  { keys: ["mesh", "aries"], name: { hi: "Mesh", en: "Aries" } },
  { keys: ["vrishabh", "vrish", "taurus"], name: { hi: "Vrishabh", en: "Taurus" } },
  { keys: ["mithun", "gemini"], name: { hi: "Mithun", en: "Gemini" } },
  { keys: ["kark", "karka", "cancer"], name: { hi: "Kark", en: "Cancer" } },
  { keys: ["singh", "leo"], name: { hi: "Singh", en: "Leo" } },
  { keys: ["kanya", "virgo"], name: { hi: "Kanya", en: "Virgo" } },
  { keys: ["tula", "libra"], name: { hi: "Tula", en: "Libra" } },
  { keys: ["vrishchik", "scorpio", "vrischik"], name: { hi: "Vrishchik", en: "Scorpio" } },
  { keys: ["dhanu", "sagittarius"], name: { hi: "Dhanu", en: "Sagittarius" } },
  { keys: ["makar", "capricorn"], name: { hi: "Makar", en: "Capricorn" } },
  { keys: ["kumbh", "aquarius"], name: { hi: "Kumbh", en: "Aquarius" } },
  { keys: ["meen", "pisces"], name: { hi: "Meen", en: "Pisces" } },
];

export function welcomeMessage(lang: Lang): string {
  if (lang === "hi") {
    return [
      `Namaste ji,`,
      `*${BUSINESS.name}* — Ludhiana`,
      `Pandit ${BUSINESS.astrologer} · ${BUSINESS.since} se Jyotish, Lal Kitab, Vastu.`,
      ``,
      `*Seva — number bhejein:*`,
      `1 Kundli   2 Milan   3 Shaadi   4 Naukri`,
      `5 Santaan  6 Padhai  7 Videsh   8 Sehat`,
      `9 Property  10 Dhan  11 Ratna   12 Vastu`,
      `13 Hast rekha  14 Lal Kitab  15 Numerology`,
      `16 Reiki   17 Appointment   18 Pata`,
      ``,
      `Seedha sawal bhi likh sakte hain, jaise "shaadi kab hogi".`,
      `Call: ${phonesLine()}`,
    ].join("\n");
  }
  return [
    `Namaste,`,
    `*${BUSINESS.name}* — Ludhiana`,
    `Pandit ${BUSINESS.astrologer} · Jyotish, Lal Kitab, Vastu since ${BUSINESS.since}.`,
    ``,
    `*Send a number:*`,
    `1 Chart   2 Matching   3 Marriage   4 Career`,
    `5 Child   6 Education  7 Abroad     8 Health`,
    `9 Property  10 Money  11 Gems      12 Vastu`,
    `13 Palmistry  14 Lal Kitab  15 Numerology`,
    `16 Reiki   17 Book appointment   18 Address`,
    ``,
    `Or type a question, e.g. "when will I marry".`,
    `Call: ${phonesLine()}`,
  ].join("\n");
}

export function contactMessage(lang: Lang): string {
  if (lang === "hi") {
    return [
      `*${BUSINESS.legal}*`,
      `Pandit ${BUSINESS.astrologer}`,
      ``,
      `Phone: ${BUSINESS.phones[0]}`,
      `WhatsApp / alt: ${BUSINESS.phones[1]}`,
      `Email: ${BUSINESS.email}`,
      ``,
      `Pata:`,
      BUSINESS.address,
      ``,
      `Appointment ke liye 17 bhejein, ya "Haan" likhein.`,
    ].join("\n");
  }
  return [
    `*${BUSINESS.legal}*`,
    `Pandit ${BUSINESS.astrologer}`,
    ``,
    `Phone: ${BUSINESS.phones[0]}`,
    `WhatsApp / alt: ${BUSINESS.phones[1]}`,
    `Email: ${BUSINESS.email}`,
    ``,
    `Address:`,
    BUSINESS.address,
    ``,
    `Send 17 or Yes to book an appointment.`,
  ].join("\n");
}


export function t(copy: Copy, lang: Lang): string {
  return copy[lang];
}

export function phonesLine(): string {
  return BUSINESS.phones.join("  |  ");
}
