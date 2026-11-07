// Country Quiz dataset & 4-choice question generator for STRAFE.
// Owned by Messi (Data & Geography Specialist).
// Supports filtering by zone ("world" | "asia" | "europe" | "americas" | "africa" | "oceania")
// and difficulty ("easy" | "medium" | "hard" | "hardcore").

import type { GeoZone, ZoneFilter } from "./locations-wikidata";

export type QuizZone = ZoneFilter;
export type QuizDifficulty = "easy" | "medium" | "hard" | "hardcore" | "expert";
export type QuizQuestionType = "capital" | "flag" | "clue" | "reverse-capital" | "mixed";

export interface CountryQuizItem {
  id: string;
  /** Canonical country name (matches Flag component & locations dataset) */
  country: string;
  /** Alias for country name */
  name: string;
  /** ISO 3166-1 alpha-2 code */
  isoCode: string;
  /** Flag slug in /flags/<slug>.svg */
  flag: string;
  /** Direct URL path to SVG flag */
  flagUrl: string;
  /** Unicode flag emoji */
  flagEmoji: string;
  /** Official or de facto capital city */
  capital: string;
  /** Continental zone */
  zone: GeoZone;
  /** Geographic subregion (e.g., "Western Europe", "South America") */
  subregion: string;
  /** Formatted population string (e.g., "68.2M") */
  population: string;
  /** Official currency name & code */
  currency: string;
  /** Official or primary spoken languages */
  languages: string[];
  /** Approximate geographic center latitude */
  lat: number;
  /** Approximate geographic center longitude */
  lng: number;
  /** Difficulty tier label */
  difficulty: "easy" | "medium" | "hard" | "hardcore";
  /** Numeric difficulty tier (1 = easy ... 4 = hardcore) */
  tier: 1 | 2 | 3 | 4;
  /** Concise primary geography hint */
  hint: string;
  /** Progressive factual clues for Country Quiz & SmartClue */
  clues: string[];
  /** Bordering countries or ["Island nation"] */
  neighbors: string[];
}

export interface CountryQuizQuestion {
  id: string;
  type: "capital" | "flag" | "clue" | "reverse-capital";
  /** Main question prompt shown to the player */
  prompt: string;
  /** Optional subtitle / secondary clue */
  subtitle?: string;
  /** Target country item for this question */
  target: CountryQuizItem;
  /** The correct option string (matches options[correctIndex]) */
  correctAnswer: string;
  /** 0..3 index of the correct answer in options & optionItems */
  correctIndex: number;
  /** 4 answer labels */
  options: string[];
  /** Full CountryQuizItem objects for the 4 choices (in the same order as options) */
  optionItems: CountryQuizItem[];
  /** Concise hint string (e.g. for Lust Sin card or SmartClue) */
  hint: string;
  /** Progressive clue facts */
  clues: string[];
  zone: GeoZone;
  difficulty: "easy" | "medium" | "hard" | "hardcore";
}

export const COUNTRY_QUIZ_ITEMS: CountryQuizItem[] = [
  {
    "id": "country-quiz-0-united-kingdom",
    "country": "United Kingdom",
    "name": "United Kingdom",
    "isoCode": "GB",
    "flag": "united-kingdom",
    "flagUrl": "/flags/united-kingdom.svg",
    "flagEmoji": "🇬🇧",
    "capital": "London",
    "zone": "europe",
    "subregion": "Northern Europe",
    "population": "67.7M",
    "currency": "Pound sterling (GBP)",
    "languages": [
      "English"
    ],
    "lat": 54,
    "lng": -2,
    "difficulty": "easy",
    "tier": 1,
    "hint": "Island nation off northwestern Europe comprising England, Scotland, Wales, and Northern Ireland.",
    "clues": [
      "Island nation off northwestern Europe comprising England, Scotland, Wales, and Northern Ireland.",
      "Bordered by the Atlantic Ocean, North Sea, English Channel, and Irish Sea.",
      "Home to Stonehenge, the Scottish Highlands, and the River Thames.",
      "Its monarch is head of the Commonwealth; drives on the left.",
      "Capital: London · Population: ~67.7M · Currency: Pound sterling (GBP)"
    ],
    "neighbors": [
      "Ireland"
    ]
  },
  {
    "id": "country-quiz-1-france",
    "country": "France",
    "name": "France",
    "isoCode": "FR",
    "flag": "france",
    "flagUrl": "/flags/france.svg",
    "flagEmoji": "🇫🇷",
    "capital": "Paris",
    "zone": "europe",
    "subregion": "Western Europe",
    "population": "68.2M",
    "currency": "Euro (EUR)",
    "languages": [
      "French"
    ],
    "lat": 46.2,
    "lng": 2.2,
    "difficulty": "easy",
    "tier": 1,
    "hint": "Hexagon-shaped Western European nation stretching from the English Channel to the Mediterranean Sea.",
    "clues": [
      "Hexagon-shaped Western European nation stretching from the English Channel to the Mediterranean Sea.",
      "Includes the snow-capped Alps (Mont Blanc), Pyrenees, and the Loire Valley.",
      "World's most visited country, famed for the Eiffel Tower, Louvre, and Bordeaux wines.",
      "Shares land borders with 8 European neighbors plus Brazil via French Guiana.",
      "Capital: Paris · Population: ~68.2M · Currency: Euro (EUR)"
    ],
    "neighbors": [
      "Spain",
      "Italy",
      "Switzerland",
      "Germany",
      "Belgium",
      "Luxembourg",
      "Andorra",
      "Monaco"
    ]
  },
  {
    "id": "country-quiz-2-germany",
    "country": "Germany",
    "name": "Germany",
    "isoCode": "DE",
    "flag": "germany",
    "flagUrl": "/flags/germany.svg",
    "flagEmoji": "🇩🇪",
    "capital": "Berlin",
    "zone": "europe",
    "subregion": "Western Europe",
    "population": "84.4M",
    "currency": "Euro (EUR)",
    "languages": [
      "German"
    ],
    "lat": 51.2,
    "lng": 10.4,
    "difficulty": "easy",
    "tier": 1,
    "hint": "Central Europe's most populous nation, stretching from the North and Baltic seas to the Bavarian Alps.",
    "clues": [
      "Central Europe's most populous nation, stretching from the North and Baltic seas to the Bavarian Alps.",
      "Major rivers include the Rhine, Elbe, and Danube; home to the Black Forest.",
      "Europe's largest economy, famous for the Brandenburg Gate, Neuschwanstein Castle, and Oktoberfest.",
      "Reunified in 1990 after the fall of the Berlin Wall; borders 9 countries.",
      "Capital: Berlin · Population: ~84.4M · Currency: Euro (EUR)"
    ],
    "neighbors": [
      "France",
      "Poland",
      "Czechia",
      "Austria",
      "Switzerland",
      "Netherlands",
      "Belgium",
      "Luxembourg",
      "Denmark"
    ]
  },
  {
    "id": "country-quiz-3-italy",
    "country": "Italy",
    "name": "Italy",
    "isoCode": "IT",
    "flag": "italy",
    "flagUrl": "/flags/italy.svg",
    "flagEmoji": "🇮🇹",
    "capital": "Rome",
    "zone": "europe",
    "subregion": "Southern Europe",
    "population": "58.9M",
    "currency": "Euro (EUR)",
    "languages": [
      "Italian"
    ],
    "lat": 42.8,
    "lng": 12.8,
    "difficulty": "easy",
    "tier": 1,
    "hint": "Boot-shaped Mediterranean peninsula along with the large islands of Sicily and Sardinia.",
    "clues": [
      "Boot-shaped Mediterranean peninsula along with the large islands of Sicily and Sardinia.",
      "Encloses two independent microstates: Vatican City and San Marino.",
      "Heart of the Roman Empire and the Renaissance; home to the Colosseum, Venice canals, and Florence.",
      "Contains more UNESCO World Heritage Sites than any other country on Earth.",
      "Capital: Rome · Population: ~58.9M · Currency: Euro (EUR)"
    ],
    "neighbors": [
      "France",
      "Switzerland",
      "Austria",
      "Slovenia",
      "San Marino",
      "Vatican City"
    ]
  },
  {
    "id": "country-quiz-4-spain",
    "country": "Spain",
    "name": "Spain",
    "isoCode": "ES",
    "flag": "spain",
    "flagUrl": "/flags/spain.svg",
    "flagEmoji": "🇪🇸",
    "capital": "Madrid",
    "zone": "europe",
    "subregion": "Southern Europe",
    "population": "48.3M",
    "currency": "Euro (EUR)",
    "languages": [
      "Spanish"
    ],
    "lat": 40.5,
    "lng": -3.7,
    "difficulty": "easy",
    "tier": 1,
    "hint": "Occupies about 85% of the Iberian Peninsula plus the Balearic and Canary Islands.",
    "clues": [
      "Occupies about 85% of the Iberian Peninsula plus the Balearic and Canary Islands.",
      "Separated from France by the Pyrenees and from Africa by the narrow Strait of Gibraltar.",
      "Renowned for the Alhambra in Granada, Gaudí's Sagrada Família in Barcelona, and flamenco.",
      "Second most mountainous country in Western Europe with the high Meseta Central plateau.",
      "Capital: Madrid · Population: ~48.3M · Currency: Euro (EUR)"
    ],
    "neighbors": [
      "Portugal",
      "France",
      "Andorra",
      "United Kingdom"
    ]
  },
  {
    "id": "country-quiz-5-portugal",
    "country": "Portugal",
    "name": "Portugal",
    "isoCode": "PT",
    "flag": "portugal",
    "flagUrl": "/flags/portugal.svg",
    "flagEmoji": "🇵🇹",
    "capital": "Lisbon",
    "zone": "europe",
    "subregion": "Southern Europe",
    "population": "10.5M",
    "currency": "Euro (EUR)",
    "languages": [
      "Portuguese"
    ],
    "lat": 39.4,
    "lng": -8.2,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Westernmost country of mainland Europe, facing the Atlantic Ocean along the Iberian Peninsula.",
    "clues": [
      "Westernmost country of mainland Europe, facing the Atlantic Ocean along the Iberian Peninsula.",
      "Includes the volcanic archipelagos of the Azores and Madeira in the Atlantic.",
      "Historic maritime pioneer of the Age of Discovery; famous for Port wine from the Douro Valley and Fado music.",
      "Shares its entire land border with a single neighbor: Spain.",
      "Capital: Lisbon · Population: ~10.5M · Currency: Euro (EUR)"
    ],
    "neighbors": [
      "Spain"
    ]
  },
  {
    "id": "country-quiz-6-netherlands",
    "country": "Netherlands",
    "name": "Netherlands",
    "isoCode": "NL",
    "flag": "netherlands",
    "flagUrl": "/flags/netherlands.svg",
    "flagEmoji": "🇳🇱",
    "capital": "Amsterdam",
    "zone": "europe",
    "subregion": "Western Europe",
    "population": "17.9M",
    "currency": "Euro (EUR)",
    "languages": [
      "Dutch"
    ],
    "lat": 52.1,
    "lng": 5.3,
    "difficulty": "easy",
    "tier": 1,
    "hint": "Low-lying coastal nation in Northwestern Europe where roughly a quarter of the land lies below sea level.",
    "clues": [
      "Low-lying coastal nation in Northwestern Europe where roughly a quarter of the land lies below sea level.",
      "Located at the delta of the Rhine, Meuse, and Scheldt rivers facing the North Sea.",
      "Famous for windmills, tulip fields, cycling culture, canals, and the port of Rotterdam.",
      "While Amsterdam is the constitutional capital, the seat of government and International Court of Justice sit in The Hague.",
      "Capital: Amsterdam · Population: ~17.9M · Currency: Euro (EUR)"
    ],
    "neighbors": [
      "Germany",
      "Belgium"
    ]
  },
  {
    "id": "country-quiz-7-belgium",
    "country": "Belgium",
    "name": "Belgium",
    "isoCode": "BE",
    "flag": "belgium",
    "flagUrl": "/flags/belgium.svg",
    "flagEmoji": "🇧🇪",
    "capital": "Brussels",
    "zone": "europe",
    "subregion": "Western Europe",
    "population": "11.7M",
    "currency": "Euro (EUR)",
    "languages": [
      "Dutch",
      "French",
      "German"
    ],
    "lat": 50.8,
    "lng": 4.5,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Compact Western European kingdom divided between Dutch-speaking Flanders and French-speaking Wallonia.",
    "clues": [
      "Compact Western European kingdom divided between Dutch-speaking Flanders and French-speaking Wallonia.",
      "Has a short coastline along the North Sea and rolling forests in the Ardennes.",
      "Hosts the headquarters of the European Union and NATO; famed for medieval Bruges, chocolate, and waffles.",
      "Site of the historic 1815 Battle of Waterloo just south of its capital.",
      "Capital: Brussels · Population: ~11.7M · Currency: Euro (EUR)"
    ],
    "neighbors": [
      "France",
      "Germany",
      "Netherlands",
      "Luxembourg"
    ]
  },
  {
    "id": "country-quiz-8-switzerland",
    "country": "Switzerland",
    "name": "Switzerland",
    "isoCode": "CH",
    "flag": "switzerland",
    "flagUrl": "/flags/switzerland.svg",
    "flagEmoji": "🇨🇭",
    "capital": "Bern",
    "zone": "europe",
    "subregion": "Western Europe",
    "population": "8.8M",
    "currency": "Swiss franc (CHF)",
    "languages": [
      "German",
      "French",
      "Italian",
      "Romansh"
    ],
    "lat": 46.8,
    "lng": 8.2,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Landlocked Alpine confederation in Central Europe renowned for centuries of armed neutrality.",
    "clues": [
      "Landlocked Alpine confederation in Central Europe renowned for centuries of armed neutrality.",
      "Dominated by the Alps (including the Matterhorn) and Jura mountains, with lakes Geneva and Zurich.",
      "Has four official languages and hosts the Red Cross and European UN headquarters in Geneva.",
      "Its de facto federal city is Bern on the Aare River, not Zurich or Geneva.",
      "Capital: Bern · Population: ~8.8M · Currency: Swiss franc (CHF)"
    ],
    "neighbors": [
      "France",
      "Germany",
      "Italy",
      "Austria",
      "Liechtenstein"
    ]
  },
  {
    "id": "country-quiz-9-austria",
    "country": "Austria",
    "name": "Austria",
    "isoCode": "AT",
    "flag": "austria",
    "flagUrl": "/flags/austria.svg",
    "flagEmoji": "🇦🇹",
    "capital": "Vienna",
    "zone": "europe",
    "subregion": "Western Europe",
    "population": "9.1M",
    "currency": "Euro (EUR)",
    "languages": [
      "German"
    ],
    "lat": 47.5,
    "lng": 14.6,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Landlocked Alpine republic in Central Europe traversed by the Danube River.",
    "clues": [
      "Landlocked Alpine republic in Central Europe traversed by the Danube River.",
      "Nearly two-thirds of its territory is covered by the Eastern Alps.",
      "Historic heart of the Habsburg Empire and classical music capital of Mozart, Haydn, and Strauss.",
      "Shares borders with 8 countries including Germany, Italy, Czechia, and Hungary.",
      "Capital: Vienna · Population: ~9.1M · Currency: Euro (EUR)"
    ],
    "neighbors": [
      "Germany",
      "Czechia",
      "Slovakia",
      "Hungary",
      "Slovenia",
      "Italy",
      "Switzerland",
      "Liechtenstein"
    ]
  },
  {
    "id": "country-quiz-10-poland",
    "country": "Poland",
    "name": "Poland",
    "isoCode": "PL",
    "flag": "poland",
    "flagUrl": "/flags/poland.svg",
    "flagEmoji": "🇵🇱",
    "capital": "Warsaw",
    "zone": "europe",
    "subregion": "Central Europe",
    "population": "36.8M",
    "currency": "Polish złoty (PLN)",
    "languages": [
      "Polish"
    ],
    "lat": 52.1,
    "lng": 19.4,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Large Central European nation stretching from the Baltic Sea coast to the Tatra Mountains in the south.",
    "clues": [
      "Large Central European nation stretching from the Baltic Sea coast to the Tatra Mountains in the south.",
      "Bisected by the Vistula River and bordered to the west by the Oder River.",
      "Birthplace of Nicolaus Copernicus, Frédéric Chopin, and Marie Skłodowska-Curie; home to medieval Kraków.",
      "Contains the primeval Białowieża Forest, home to European bison.",
      "Capital: Warsaw · Population: ~36.8M · Currency: Polish złoty (PLN)"
    ],
    "neighbors": [
      "Germany",
      "Czechia",
      "Slovakia",
      "Ukraine",
      "Belarus",
      "Lithuania",
      "Russia"
    ]
  },
  {
    "id": "country-quiz-11-czechia",
    "country": "Czechia",
    "name": "Czechia",
    "isoCode": "CZ",
    "flag": "czechia",
    "flagUrl": "/flags/czechia.svg",
    "flagEmoji": "🇨🇿",
    "capital": "Prague",
    "zone": "europe",
    "subregion": "Central Europe",
    "population": "10.8M",
    "currency": "Czech koruna (CZK)",
    "languages": [
      "Czech"
    ],
    "lat": 49.8,
    "lng": 15.5,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Landlocked Central European republic ringed by the Bohemian Forest, Ore Mountains, and Sudetes.",
    "clues": [
      "Landlocked Central European republic ringed by the Bohemian Forest, Ore Mountains, and Sudetes.",
      "Composed of the historic regions of Bohemia, Moravia, and Czech Silesia.",
      "Famous for Prague Castle, the Charles Bridge over the Vltava River, and the highest beer consumption per capita.",
      "Peacefully split from Slovakia on January 1, 1993 in the 'Velvet Divorce'.",
      "Capital: Prague · Population: ~10.8M · Currency: Czech koruna (CZK)"
    ],
    "neighbors": [
      "Germany",
      "Poland",
      "Slovakia",
      "Austria"
    ]
  },
  {
    "id": "country-quiz-12-hungary",
    "country": "Hungary",
    "name": "Hungary",
    "isoCode": "HU",
    "flag": "hungary",
    "flagUrl": "/flags/hungary.svg",
    "flagEmoji": "🇭🇺",
    "capital": "Budapest",
    "zone": "europe",
    "subregion": "Central Europe",
    "population": "9.6M",
    "currency": "Hungarian forint (HUF)",
    "languages": [
      "Hungarian"
    ],
    "lat": 47.2,
    "lng": 19.5,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Landlocked nation in the Carpathian Basin, bisected north-to-south by the Danube River.",
    "clues": [
      "Landlocked nation in the Carpathian Basin, bisected north-to-south by the Danube River.",
      "Home to Lake Balaton, the largest lake in Central Europe, and the flat Great Alföld plain.",
      "Its Finno-Ugric language is unrelated to surrounding Indo-European tongues; famed for thermal baths and paprika.",
      "Its capital was formed in 1873 by uniting Buda, Óbuda, and Pest across the Danube.",
      "Capital: Budapest · Population: ~9.6M · Currency: Hungarian forint (HUF)"
    ],
    "neighbors": [
      "Austria",
      "Slovakia",
      "Ukraine",
      "Romania",
      "Serbia",
      "Croatia",
      "Slovenia"
    ]
  },
  {
    "id": "country-quiz-13-sweden",
    "country": "Sweden",
    "name": "Sweden",
    "isoCode": "SE",
    "flag": "sweden",
    "flagUrl": "/flags/sweden.svg",
    "flagEmoji": "🇸🇪",
    "capital": "Stockholm",
    "zone": "europe",
    "subregion": "Northern Europe",
    "population": "10.5M",
    "currency": "Swedish krona (SEK)",
    "languages": [
      "Swedish"
    ],
    "lat": 62,
    "lng": 15,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Largest Nordic country by area and population, occupying the eastern side of the Scandinavian Peninsula.",
    "clues": [
      "Largest Nordic country by area and population, occupying the eastern side of the Scandinavian Peninsula.",
      "Stretches from temperate southern plains across vast boreal forests up into the Arctic Circle.",
      "Home of the Nobel Prize, ABBA, IKEA, and a capital built across 14 islands where Lake Mälaren meets the Baltic.",
      "Connected to Denmark via the 16-km Øresund Bridge-Tunnel.",
      "Capital: Stockholm · Population: ~10.5M · Currency: Swedish krona (SEK)"
    ],
    "neighbors": [
      "Norway",
      "Finland"
    ]
  },
  {
    "id": "country-quiz-14-norway",
    "country": "Norway",
    "name": "Norway",
    "isoCode": "NO",
    "flag": "norway",
    "flagUrl": "/flags/norway.svg",
    "flagEmoji": "🇳🇴",
    "capital": "Oslo",
    "zone": "europe",
    "subregion": "Northern Europe",
    "population": "5.5M",
    "currency": "Norwegian krone (NOK)",
    "languages": [
      "Norwegian"
    ],
    "lat": 61,
    "lng": 8.5,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Mountainous Nordic kingdom along the western and northern coast of the Scandinavian Peninsula.",
    "clues": [
      "Mountainous Nordic kingdom along the western and northern coast of the Scandinavian Peninsula.",
      "World-famous for deep glacial fjords (like Geirangerfjord and Sognefjord), midnight sun, and the Svalbard archipelago.",
      "A major offshore energy and hydropower producer that consistently tops the UN Human Development Index.",
      "Awards the Nobel Peace Prize in its capital each December.",
      "Capital: Oslo · Population: ~5.5M · Currency: Norwegian krone (NOK)"
    ],
    "neighbors": [
      "Sweden",
      "Finland",
      "Russia"
    ]
  },
  {
    "id": "country-quiz-15-denmark",
    "country": "Denmark",
    "name": "Denmark",
    "isoCode": "DK",
    "flag": "denmark",
    "flagUrl": "/flags/denmark.svg",
    "flagEmoji": "🇩🇰",
    "capital": "Copenhagen",
    "zone": "europe",
    "subregion": "Northern Europe",
    "population": "5.9M",
    "currency": "Danish krone (DKK)",
    "languages": [
      "Danish"
    ],
    "lat": 56,
    "lng": 10,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Nordic nation consisting of the Jutland Peninsula and over 400 islands between the North and Baltic seas.",
    "clues": [
      "Nordic nation consisting of the Jutland Peninsula and over 400 islands between the North and Baltic seas.",
      "The Kingdom also includes the autonomous territories of Greenland and the Faroe Islands.",
      "Birthplace of Hans Christian Andersen, LEGO, and Viking maritime heritage.",
      "Flattest country in Europe, with its highest natural point rising only 170 meters above sea level.",
      "Capital: Copenhagen · Population: ~5.9M · Currency: Danish krone (DKK)"
    ],
    "neighbors": [
      "Germany"
    ]
  },
  {
    "id": "country-quiz-16-finland",
    "country": "Finland",
    "name": "Finland",
    "isoCode": "FI",
    "flag": "finland",
    "flagUrl": "/flags/finland.svg",
    "flagEmoji": "🇫🇮",
    "capital": "Helsinki",
    "zone": "europe",
    "subregion": "Northern Europe",
    "population": "5.6M",
    "currency": "Euro (EUR)",
    "languages": [
      "Finnish",
      "Swedish"
    ],
    "lat": 64,
    "lng": 26,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Nordic nation known as the 'Land of a Thousand Lakes' (actually ~188,000 lakes) and dense boreal forests.",
    "clues": [
      "Nordic nation known as the 'Land of a Thousand Lakes' (actually ~188,000 lakes) and dense boreal forests.",
      "Borders the Gulf of Bothnia to the west and the Gulf of Finland to the south, extending into Lapland in the Arctic.",
      "Famous for sauna culture, Nokia, the Northern Lights, and Rovaniemi (Santa Claus Village).",
      "Shares a 1,340-km eastern land border with Russia, plus northern borders with Sweden and Norway.",
      "Capital: Helsinki · Population: ~5.6M · Currency: Euro (EUR)"
    ],
    "neighbors": [
      "Sweden",
      "Norway",
      "Russia"
    ]
  },
  {
    "id": "country-quiz-17-iceland",
    "country": "Iceland",
    "name": "Iceland",
    "isoCode": "IS",
    "flag": "iceland",
    "flagUrl": "/flags/iceland.svg",
    "flagEmoji": "🇮🇸",
    "capital": "Reykjavík",
    "zone": "europe",
    "subregion": "Northern Europe",
    "population": "390K",
    "currency": "Icelandic króna (ISK)",
    "languages": [
      "Icelandic"
    ],
    "lat": 65,
    "lng": -18,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Volcanic island nation in the North Atlantic sitting directly atop the Mid-Atlantic Ridge just south of the Arctic Circle.",
    "clues": [
      "Volcanic island nation in the North Atlantic sitting directly atop the Mid-Atlantic Ridge just south of the Arctic Circle.",
      "Land of fire and ice featuring Vatnajökull glacier, geysers, black-sand beaches, and geothermal lagoons.",
      "Home to the Alþingi (founded 930 AD), one of the world's oldest parliamentary institutions.",
      "Has no standing army, no mosquitoes, and runs almost entirely on geothermal and hydroelectric energy.",
      "Capital: Reykjavík · Population: ~390K · Currency: Icelandic króna (ISK)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-18-ireland",
    "country": "Ireland",
    "name": "Ireland",
    "isoCode": "IE",
    "flag": "ireland",
    "flagUrl": "/flags/ireland.svg",
    "flagEmoji": "🇮🇪",
    "capital": "Dublin",
    "zone": "europe",
    "subregion": "Northern Europe",
    "population": "5.3M",
    "currency": "Euro (EUR)",
    "languages": [
      "Irish",
      "English"
    ],
    "lat": 53.3,
    "lng": -8,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Occupies five-sixths of the lush 'Emerald Isle' in the North Atlantic west of Great Britain.",
    "clues": [
      "Occupies five-sixths of the lush 'Emerald Isle' in the North Atlantic west of Great Britain.",
      "Features rugged Atlantic cliffs like the Cliffs of Moher, the River Shannon, and central peat bogs.",
      "Famous for St. Patrick's Day, Celtic harp symbol, Guinness, and literary giants Joyce, Yeats, and Wilde.",
      "Shares its only land border with Northern Ireland (part of the United Kingdom).",
      "Capital: Dublin · Population: ~5.3M · Currency: Euro (EUR)"
    ],
    "neighbors": [
      "United Kingdom"
    ]
  },
  {
    "id": "country-quiz-19-greece",
    "country": "Greece",
    "name": "Greece",
    "isoCode": "GR",
    "flag": "greece",
    "flagUrl": "/flags/greece.svg",
    "flagEmoji": "🇬🇷",
    "capital": "Athens",
    "zone": "europe",
    "subregion": "Southern Europe",
    "population": "10.4M",
    "currency": "Euro (EUR)",
    "languages": [
      "Greek"
    ],
    "lat": 39,
    "lng": 22,
    "difficulty": "easy",
    "tier": 1,
    "hint": "Southern Balkan nation at the crossroads of Europe, Asia, and Africa, surrounded by the Aegean, Ionian, and Mediterranean seas.",
    "clues": [
      "Southern Balkan nation at the crossroads of Europe, Asia, and Africa, surrounded by the Aegean, Ionian, and Mediterranean seas.",
      "Roughly 80% mountainous (peaking at Mount Olympus) with thousands of islands including Crete, Rhodes, and Santorini.",
      "Cradle of Western civilization, democracy, the Olympic Games, and the Parthenon atop the Acropolis.",
      "Has the longest coastline on the Mediterranean Basin due to its vast archipelago.",
      "Capital: Athens · Population: ~10.4M · Currency: Euro (EUR)"
    ],
    "neighbors": [
      "Albania",
      "North Macedonia",
      "Bulgaria",
      "Türkiye"
    ]
  },
  {
    "id": "country-quiz-20-turkiye",
    "country": "Türkiye",
    "name": "Türkiye",
    "isoCode": "TR",
    "flag": "turkey",
    "flagUrl": "/flags/turkey.svg",
    "flagEmoji": "🇹🇷",
    "capital": "Ankara",
    "zone": "asia",
    "subregion": "Western Asia / Southeastern Europe",
    "population": "85.3M",
    "currency": "Turkish lira (TRY)",
    "languages": [
      "Turkish"
    ],
    "lat": 39,
    "lng": 35,
    "difficulty": "easy",
    "tier": 1,
    "hint": "Transcontinental republic bridging Anatolian Asia and Balkan Europe across the Bosphorus and Dardanelles straits.",
    "clues": [
      "Transcontinental republic bridging Anatolian Asia and Balkan Europe across the Bosphorus and Dardanelles straits.",
      "Bordered by the Black Sea to the north, the Aegean to the west, and the Mediterranean to the south.",
      "Home to Istanbul (former Constantinople), Hagia Sophia, Cappadocia's fairy chimneys, and ancient Troy.",
      "Its largest city is Istanbul, while its inland plateau capital since 1923 is Ankara.",
      "Capital: Ankara · Population: ~85.3M · Currency: Turkish lira (TRY)"
    ],
    "neighbors": [
      "Greece",
      "Bulgaria",
      "Georgia",
      "Armenia",
      "Azerbaijan",
      "Iran",
      "Iraq",
      "Syria"
    ]
  },
  {
    "id": "country-quiz-21-russia",
    "country": "Russia",
    "name": "Russia",
    "isoCode": "RU",
    "flag": "russia",
    "flagUrl": "/flags/russia.svg",
    "flagEmoji": "🇷🇺",
    "capital": "Moscow",
    "zone": "europe",
    "subregion": "Eastern Europe / Northern Asia",
    "population": "144.0M",
    "currency": "Russian ruble (RUB)",
    "languages": [
      "Russian"
    ],
    "lat": 61.5,
    "lng": 90,
    "difficulty": "easy",
    "tier": 1,
    "hint": "World's largest country by land area, spanning 11 time zones across Eastern Europe and Northern Asia (Siberia).",
    "clues": [
      "World's largest country by land area, spanning 11 time zones across Eastern Europe and Northern Asia (Siberia).",
      "Contains Europe's longest river (the Volga), highest peak (Mount Elbrus), and the world's deepest lake (Lake Baikal).",
      "Famous for the Kremlin, Saint Basil's Cathedral on Red Square, the Hermitage in St. Petersburg, and the Trans-Siberian Railway.",
      "Shares land borders with 14 countries from Norway and Finland in the west to China and North Korea in the east.",
      "Capital: Moscow · Population: ~144.0M · Currency: Russian ruble (RUB)"
    ],
    "neighbors": [
      "Norway",
      "Finland",
      "Estonia",
      "Latvia",
      "Lithuania",
      "Poland",
      "Belarus",
      "Ukraine",
      "Georgia",
      "Azerbaijan",
      "Kazakhstan",
      "China",
      "Mongolia",
      "North Korea"
    ]
  },
  {
    "id": "country-quiz-22-ukraine",
    "country": "Ukraine",
    "name": "Ukraine",
    "isoCode": "UA",
    "flag": "ukraine",
    "flagUrl": "/flags/ukraine.svg",
    "flagEmoji": "🇺🇦",
    "capital": "Kyiv",
    "zone": "europe",
    "subregion": "Eastern Europe",
    "population": "38.0M",
    "currency": "Ukrainian hryvnia (UAH)",
    "languages": [
      "Ukrainian"
    ],
    "lat": 49,
    "lng": 32,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Second-largest country by area in Europe, stretching from the Carpathian Mountains to the Black and Azov seas.",
    "clues": [
      "Second-largest country by area in Europe, stretching from the Carpathian Mountains to the Black and Azov seas.",
      "Bisected by the Dnieper River and covered in fertile black chernozem soil ('Breadbasket of Europe').",
      "Its historic capital on the Dnieper features golden-domed Saint Sophia Cathedral and Kyiv Pechersk Lavra.",
      "Borders 7 European countries including Poland, Slovakia, Hungary, Romania, and Moldova.",
      "Capital: Kyiv · Population: ~38.0M · Currency: Ukrainian hryvnia (UAH)"
    ],
    "neighbors": [
      "Poland",
      "Slovakia",
      "Hungary",
      "Romania",
      "Moldova",
      "Belarus",
      "Russia"
    ]
  },
  {
    "id": "country-quiz-23-romania",
    "country": "Romania",
    "name": "Romania",
    "isoCode": "RO",
    "flag": "romania",
    "flagUrl": "/flags/romania.svg",
    "flagEmoji": "🇷🇴",
    "capital": "Bucharest",
    "zone": "europe",
    "subregion": "Southeastern Europe",
    "population": "19.0M",
    "currency": "Romanian leu (RON)",
    "languages": [
      "Romanian"
    ],
    "lat": 45.9,
    "lng": 24.9,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Southeastern European nation defined by the sweeping arc of the Carpathian Mountains and the lower Danube River.",
    "clues": [
      "Southeastern European nation defined by the sweeping arc of the Carpathian Mountains and the lower Danube River.",
      "Empties into the Black Sea via the biodiverse Danube Delta.",
      "Includes the historic region of Transylvania (Bran Castle, Sibiu, Brașov) and speaks a Romance language.",
      "Its capital's Palace of the Parliament is the heaviest building in the world.",
      "Capital: Bucharest · Population: ~19.0M · Currency: Romanian leu (RON)"
    ],
    "neighbors": [
      "Ukraine",
      "Moldova",
      "Bulgaria",
      "Serbia",
      "Hungary"
    ]
  },
  {
    "id": "country-quiz-24-bulgaria",
    "country": "Bulgaria",
    "name": "Bulgaria",
    "isoCode": "BG",
    "flag": "bulgaria",
    "flagUrl": "/flags/bulgaria.svg",
    "flagEmoji": "🇧🇬",
    "capital": "Sofia",
    "zone": "europe",
    "subregion": "Southeastern Europe",
    "population": "6.4M",
    "currency": "Bulgarian lev (BGN)",
    "languages": [
      "Bulgarian"
    ],
    "lat": 42.7,
    "lng": 25.5,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Balkan nation bordered by the Danube River to the north and the Black Sea to the east.",
    "clues": [
      "Balkan nation bordered by the Danube River to the north and the Black Sea to the east.",
      "Crossed by the Balkan (Stara Planina), Rila, and Rhodope mountain ranges.",
      "Birthplace of the Cyrillic alphabet (9th century) and world-leading producer of rose oil from the Rose Valley.",
      "Home to Plovdiv, one of Europe's oldest continuously inhabited cities.",
      "Capital: Sofia · Population: ~6.4M · Currency: Bulgarian lev (BGN)"
    ],
    "neighbors": [
      "Romania",
      "Serbia",
      "North Macedonia",
      "Greece",
      "Türkiye"
    ]
  },
  {
    "id": "country-quiz-25-serbia",
    "country": "Serbia",
    "name": "Serbia",
    "isoCode": "RS",
    "flag": "serbia",
    "flagUrl": "/flags/serbia.svg",
    "flagEmoji": "🇷🇸",
    "capital": "Belgrade",
    "zone": "europe",
    "subregion": "Southeastern Europe",
    "population": "6.6M",
    "currency": "Serbian dinar (RSD)",
    "languages": [
      "Serbian"
    ],
    "lat": 44,
    "lng": 20.9,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Landlocked Balkan nation at the crossroads of the Pannonian Plain and central Balkans.",
    "clues": [
      "Landlocked Balkan nation at the crossroads of the Pannonian Plain and central Balkans.",
      "Its capital sits at the strategic confluence of the Sava and Danube rivers.",
      "Homeland of inventor Nikola Tesla and tennis legend Novak Djokovic.",
      "Borders 8 countries across Central and Southeastern Europe.",
      "Capital: Belgrade · Population: ~6.6M · Currency: Serbian dinar (RSD)"
    ],
    "neighbors": [
      "Hungary",
      "Romania",
      "Bulgaria",
      "North Macedonia",
      "Croatia",
      "Bosnia and Herzegovina",
      "Montenegro",
      "Albania"
    ]
  },
  {
    "id": "country-quiz-26-croatia",
    "country": "Croatia",
    "name": "Croatia",
    "isoCode": "HR",
    "flag": "croatia",
    "flagUrl": "/flags/croatia.svg",
    "flagEmoji": "🇭🇷",
    "capital": "Zagreb",
    "zone": "europe",
    "subregion": "Southeastern Europe",
    "population": "3.9M",
    "currency": "Euro (EUR)",
    "languages": [
      "Croatian"
    ],
    "lat": 45.1,
    "lng": 15.2,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Crescent-shaped nation stretching from the Pannonian plains across the Dinaric Alps to the Adriatic Sea.",
    "clues": [
      "Crescent-shaped nation stretching from the Pannonian plains across the Dinaric Alps to the Adriatic Sea.",
      "Boasts over 1,200 islands along its Dalmatian coast, plus the terraced waterfalls of Plitvice Lakes.",
      "Famous for the medieval walled city of Dubrovnik, Diocletian's Palace in Split, and inventing the necktie (cravat).",
      "Joined both the Eurozone and Schengen Area on January 1, 2023.",
      "Capital: Zagreb · Population: ~3.9M · Currency: Euro (EUR)"
    ],
    "neighbors": [
      "Slovenia",
      "Hungary",
      "Serbia",
      "Bosnia and Herzegovina",
      "Montenegro"
    ]
  },
  {
    "id": "country-quiz-27-slovenia",
    "country": "Slovenia",
    "name": "Slovenia",
    "isoCode": "SI",
    "flag": "slovenia",
    "flagUrl": "/flags/slovenia.svg",
    "flagEmoji": "🇸🇮",
    "capital": "Ljubljana",
    "zone": "europe",
    "subregion": "Central Europe",
    "population": "2.1M",
    "currency": "Euro (EUR)",
    "languages": [
      "Slovene"
    ],
    "lat": 46.1,
    "lng": 14.8,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Compact green nation where the Julian Alps, Mediterranean Adriatic, Pannonian Plain, and Karst plateau meet.",
    "clues": [
      "Compact green nation where the Julian Alps, Mediterranean Adriatic, Pannonian Plain, and Karst plateau meet.",
      "Over half its land is forested; its highest peak, Mount Triglav, is featured on its coat of arms and flag.",
      "Famous for fairy-tale Lake Bled with its island church, Postojna Cave, and Lipizzaner horses.",
      "Has a 47-km coastline along the Gulf of Trieste on the Adriatic Sea.",
      "Capital: Ljubljana · Population: ~2.1M · Currency: Euro (EUR)"
    ],
    "neighbors": [
      "Italy",
      "Austria",
      "Hungary",
      "Croatia"
    ]
  },
  {
    "id": "country-quiz-28-slovakia",
    "country": "Slovakia",
    "name": "Slovakia",
    "isoCode": "SK",
    "flag": "slovakia",
    "flagUrl": "/flags/slovakia.svg",
    "flagEmoji": "🇸🇰",
    "capital": "Bratislava",
    "zone": "europe",
    "subregion": "Central Europe",
    "population": "5.4M",
    "currency": "Euro (EUR)",
    "languages": [
      "Slovak"
    ],
    "lat": 48.7,
    "lng": 19.7,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Landlocked mountainous Central European nation dominated by the Carpathian arc and High Tatras.",
    "clues": [
      "Landlocked mountainous Central European nation dominated by the Carpathian arc and High Tatras.",
      "Its capital on the Danube directly borders two countries: Austria and Hungary (just 60 km from Vienna).",
      "Boasts one of the highest concentrations of medieval castles and châteaux per capita in the world (e.g., Spiš Castle).",
      "Uses the Euro and is a major European hub for automobile manufacturing per capita.",
      "Capital: Bratislava · Population: ~5.4M · Currency: Euro (EUR)"
    ],
    "neighbors": [
      "Czechia",
      "Poland",
      "Ukraine",
      "Hungary",
      "Austria"
    ]
  },
  {
    "id": "country-quiz-29-estonia",
    "country": "Estonia",
    "name": "Estonia",
    "isoCode": "EE",
    "flag": "estonia",
    "flagUrl": "/flags/estonia.svg",
    "flagEmoji": "🇪🇪",
    "capital": "Tallinn",
    "zone": "europe",
    "subregion": "Northern Europe",
    "population": "1.4M",
    "currency": "Euro (EUR)",
    "languages": [
      "Estonian"
    ],
    "lat": 58.6,
    "lng": 25,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Northernmost of the three Baltic states, bordered by the Gulf of Finland and Baltic Sea with over 2,000 islands.",
    "clues": [
      "Northernmost of the three Baltic states, bordered by the Gulf of Finland and Baltic Sea with over 2,000 islands.",
      "Linguistically and culturally close to Finland, speaking a Finnic language rather than a Baltic one.",
      "Pioneered digital e-Residency, online voting, and tech startups (including Skype and Bolt); Tallinn has a preserved Hanseatic Old Town.",
      "Shares a land border with Latvia to the south and Russia (across Lake Peipus and the Narva River) to the east.",
      "Capital: Tallinn · Population: ~1.4M · Currency: Euro (EUR)"
    ],
    "neighbors": [
      "Latvia",
      "Russia"
    ]
  },
  {
    "id": "country-quiz-30-latvia",
    "country": "Latvia",
    "name": "Latvia",
    "isoCode": "LV",
    "flag": "latvia",
    "flagUrl": "/flags/latvia.svg",
    "flagEmoji": "🇱🇻",
    "capital": "Riga",
    "zone": "europe",
    "subregion": "Northern Europe",
    "population": "1.9M",
    "currency": "Euro (EUR)",
    "languages": [
      "Latvian"
    ],
    "lat": 56.9,
    "lng": 24.6,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Middle of the three Baltic states, curving around the Gulf of Riga on the eastern Baltic Sea.",
    "clues": [
      "Middle of the three Baltic states, curving around the Gulf of Riga on the eastern Baltic Sea.",
      "Characterized by wide sandy beaches (Jūrmala), pine forests, and the Daugava River.",
      "Its capital Riga is famous for the highest concentration of Art Nouveau architecture in the world.",
      "Speaks Latvian, one of only two surviving Baltic languages alongside Lithuanian.",
      "Capital: Riga · Population: ~1.9M · Currency: Euro (EUR)"
    ],
    "neighbors": [
      "Estonia",
      "Lithuania",
      "Belarus",
      "Russia"
    ]
  },
  {
    "id": "country-quiz-31-lithuania",
    "country": "Lithuania",
    "name": "Lithuania",
    "isoCode": "LT",
    "flag": "lithuania",
    "flagUrl": "/flags/lithuania.svg",
    "flagEmoji": "🇱🇹",
    "capital": "Vilnius",
    "zone": "europe",
    "subregion": "Northern Europe",
    "population": "2.9M",
    "currency": "Euro (EUR)",
    "languages": [
      "Lithuanian"
    ],
    "lat": 55.2,
    "lng": 23.9,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Southernmost and largest of the three Baltic states, featuring the sandy Curonian Spit along the Baltic Sea.",
    "clues": [
      "Southernmost and largest of the three Baltic states, featuring the sandy Curonian Spit along the Baltic Sea.",
      "In the 14th–16th centuries, the Grand Duchy of Lithuania was one of the largest states in Europe.",
      "Famous for the Hill of Crosses, Trakai Island Castle, Baroque Vilnius, and a national passion for basketball.",
      "Unlike its Baltic neighbors, its capital sits inland near the southeastern border.",
      "Capital: Vilnius · Population: ~2.9M · Currency: Euro (EUR)"
    ],
    "neighbors": [
      "Latvia",
      "Belarus",
      "Poland",
      "Russia"
    ]
  },
  {
    "id": "country-quiz-32-belarus",
    "country": "Belarus",
    "name": "Belarus",
    "isoCode": "BY",
    "flag": "belarus",
    "flagUrl": "/flags/belarus.svg",
    "flagEmoji": "🇧🇾",
    "capital": "Minsk",
    "zone": "europe",
    "subregion": "Eastern Europe",
    "population": "9.2M",
    "currency": "Belarusian ruble (BYN)",
    "languages": [
      "Belarusian",
      "Russian"
    ],
    "lat": 53.7,
    "lng": 27.9,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Landlocked Eastern European country characterized by flat lowlands, marshes (Polesia), and ancient forests.",
    "clues": [
      "Landlocked Eastern European country characterized by flat lowlands, marshes (Polesia), and ancient forests.",
      "Traversed by major rivers including the Dnieper, Berezina, and Pripyat.",
      "Home to Mir and Nesvizh castles (UNESCO sites) and the eastern half of Białowieża Forest.",
      "Bordered by Russia, Ukraine, Poland, Lithuania, and Latvia.",
      "Capital: Minsk · Population: ~9.2M · Currency: Belarusian ruble (BYN)"
    ],
    "neighbors": [
      "Russia",
      "Ukraine",
      "Poland",
      "Lithuania",
      "Latvia"
    ]
  },
  {
    "id": "country-quiz-33-moldova",
    "country": "Moldova",
    "name": "Moldova",
    "isoCode": "MD",
    "flag": "moldova",
    "flagUrl": "/flags/moldova.svg",
    "flagEmoji": "🇲🇩",
    "capital": "Chisinau",
    "zone": "europe",
    "subregion": "Eastern Europe",
    "population": "2.5M",
    "currency": "Moldovan leu (MDL)",
    "languages": [
      "Romanian"
    ],
    "lat": 47.2,
    "lng": 28.5,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Landlocked Eastern European republic wedged between the Prut and Dniester rivers.",
    "clues": [
      "Landlocked Eastern European republic wedged between the Prut and Dniester rivers.",
      "Sandwiched entirely between Romania to the west and Ukraine to the north, east, and south.",
      "Renowned for its centuries-old wine industry and Mileștii Mici, the world's largest underground wine cellar.",
      "Shares deep linguistic and historical ties with neighboring Romania.",
      "Capital: Chisinau · Population: ~2.5M · Currency: Moldovan leu (MDL)"
    ],
    "neighbors": [
      "Romania",
      "Ukraine"
    ]
  },
  {
    "id": "country-quiz-34-albania",
    "country": "Albania",
    "name": "Albania",
    "isoCode": "AL",
    "flag": "albania",
    "flagUrl": "/flags/albania.svg",
    "flagEmoji": "🇦🇱",
    "capital": "Tirana",
    "zone": "europe",
    "subregion": "Southeastern Europe",
    "population": "2.8M",
    "currency": "Albanian lek (ALL)",
    "languages": [
      "Albanian"
    ],
    "lat": 41.2,
    "lng": 20.2,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Mountainous Balkan nation facing both the Adriatic and Ionian seas across the Strait of Otranto from Italy.",
    "clues": [
      "Mountainous Balkan nation facing both the Adriatic and Ionian seas across the Strait of Otranto from Italy.",
      "Home to the Albanian Alps (Accursed Mountains) and ancient lakes Ohrid, Prespa, and Shkodër.",
      "Known natively as Shqipëria ('Land of the Eagles') with a black double-headed eagle on a red flag.",
      "Features UNESCO-listed Ottoman stone towns Berat ('Town of a Thousand Windows') and Gjirokastër.",
      "Capital: Tirana · Population: ~2.8M · Currency: Albanian lek (ALL)"
    ],
    "neighbors": [
      "Montenegro",
      "Kosovo",
      "North Macedonia",
      "Greece"
    ]
  },
  {
    "id": "country-quiz-35-north-macedonia",
    "country": "North Macedonia",
    "name": "North Macedonia",
    "isoCode": "MK",
    "flag": "north-macedonia",
    "flagUrl": "/flags/north-macedonia.svg",
    "flagEmoji": "🇲🇰",
    "capital": "Skopje",
    "zone": "europe",
    "subregion": "Southeastern Europe",
    "population": "1.8M",
    "currency": "Macedonian denar (MKD)",
    "languages": [
      "Macedonian",
      "Albanian"
    ],
    "lat": 41.6,
    "lng": 21.7,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Landlocked Balkan nation bisected by the Vardar River valley and ringed by rugged mountains.",
    "clues": [
      "Landlocked Balkan nation bisected by the Vardar River valley and ringed by rugged mountains.",
      "Home to Lake Ohrid, one of Europe's oldest and deepest lakes and a dual natural/cultural UNESCO site.",
      "Its capital Skopje is the birthplace of Mother Teresa and features the historic Ottoman Stone Bridge.",
      "Adopted its current constitutional name in 2019 following the Prespa Agreement with Greece.",
      "Capital: Skopje · Population: ~1.8M · Currency: Macedonian denar (MKD)"
    ],
    "neighbors": [
      "Serbia",
      "Kosovo",
      "Bulgaria",
      "Greece",
      "Albania"
    ]
  },
  {
    "id": "country-quiz-36-bosnia-and-herzegovina",
    "country": "Bosnia and Herzegovina",
    "name": "Bosnia and Herzegovina",
    "isoCode": "BA",
    "flag": "bosnia-herzegovina",
    "flagUrl": "/flags/bosnia-herzegovina.svg",
    "flagEmoji": "🇧🇦",
    "capital": "Sarajevo",
    "zone": "europe",
    "subregion": "Southeastern Europe",
    "population": "3.2M",
    "currency": "Convertible mark (BAM)",
    "languages": [
      "Bosnian",
      "Croatian",
      "Serbian"
    ],
    "lat": 43.9,
    "lng": 17.7,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Heart-shaped Balkan country almost entirely landlocked except for a 20-km Adriatic outlet at Neum.",
    "clues": [
      "Heart-shaped Balkan country almost entirely landlocked except for a 20-km Adriatic outlet at Neum.",
      "Dominated by the rugged Dinaric Alps and emerald rivers like the Neretva, Una, and Drina.",
      "Famous for the 16th-century Stari Most (Old Bridge) in Mostar and Sarajevo's blend of East and West.",
      "Sarajevo hosted the 1984 Winter Olympics and was the site of the 1914 assassination of Archduke Franz Ferdinand.",
      "Capital: Sarajevo · Population: ~3.2M · Currency: Convertible mark (BAM)"
    ],
    "neighbors": [
      "Croatia",
      "Serbia",
      "Montenegro"
    ]
  },
  {
    "id": "country-quiz-37-montenegro",
    "country": "Montenegro",
    "name": "Montenegro",
    "isoCode": "ME",
    "flag": "montenegro",
    "flagUrl": "/flags/montenegro.svg",
    "flagEmoji": "🇲🇪",
    "capital": "Podgorica",
    "zone": "europe",
    "subregion": "Southeastern Europe",
    "population": "620K",
    "currency": "Euro (EUR)",
    "languages": [
      "Montenegrin"
    ],
    "lat": 42.7,
    "lng": 19.4,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Small Balkan country whose name translates to 'Black Mountain', combining dramatic Adriatic fjords and high peaks.",
    "clues": [
      "Small Balkan country whose name translates to 'Black Mountain', combining dramatic Adriatic fjords and high peaks.",
      "Features the fortified Venetian Bay of Kotor, Durmitor National Park, and the deep Tara River Canyon.",
      "Unilaterally uses the Euro as its currency despite not yet being a formal member of the European Union.",
      "Regained independence in 2006 after dissolving its state union with Serbia.",
      "Capital: Podgorica · Population: ~620K · Currency: Euro (EUR)"
    ],
    "neighbors": [
      "Croatia",
      "Bosnia and Herzegovina",
      "Serbia",
      "Kosovo",
      "Albania"
    ]
  },
  {
    "id": "country-quiz-38-kosovo",
    "country": "Kosovo",
    "name": "Kosovo",
    "isoCode": "XK",
    "flag": "kosovo",
    "flagUrl": "/flags/kosovo.svg",
    "flagEmoji": "🇽🇰",
    "capital": "Pristina",
    "zone": "europe",
    "subregion": "Southeastern Europe",
    "population": "1.8M",
    "currency": "Euro (EUR)",
    "languages": [
      "Albanian",
      "Serbian"
    ],
    "lat": 42.6,
    "lng": 20.9,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Landlocked territory in the central Balkans framed by the Šar Mountains and Accursed Mountains.",
    "clues": [
      "Landlocked territory in the central Balkans framed by the Šar Mountains and Accursed Mountains.",
      "Comprises two main plains: the Kosovo Basin in the east and Metohija/Dukagjini in the west.",
      "Declared independence in 2008 and has one of the youngest median populations in Europe.",
      "Uses the Euro as its de facto currency and is home to historic Prizren.",
      "Capital: Pristina · Population: ~1.8M · Currency: Euro (EUR)"
    ],
    "neighbors": [
      "Serbia",
      "North Macedonia",
      "Albania",
      "Montenegro"
    ]
  },
  {
    "id": "country-quiz-39-luxembourg",
    "country": "Luxembourg",
    "name": "Luxembourg",
    "isoCode": "LU",
    "flag": "luxembourg",
    "flagUrl": "/flags/luxembourg.svg",
    "flagEmoji": "🇱🇺",
    "capital": "Luxembourg",
    "zone": "europe",
    "subregion": "Western Europe",
    "population": "660K",
    "currency": "Euro (EUR)",
    "languages": [
      "Luxembourgish",
      "French",
      "German"
    ],
    "lat": 49.8,
    "lng": 6.1,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Landlocked Western European nation and the world's only remaining sovereign Grand Duchy.",
    "clues": [
      "Landlocked Western European nation and the world's only remaining sovereign Grand Duchy.",
      "Divided between the forested Ardennes hills (Oesling) in the north and rolling Gutland in the south.",
      "One of the founding members of the EU, hosting the European Court of Justice and having the highest GDP per capita.",
      "Became the first country in the world to make all public transport nationwide completely free in 2020.",
      "Capital: Luxembourg · Population: ~660K · Currency: Euro (EUR)"
    ],
    "neighbors": [
      "Belgium",
      "France",
      "Germany"
    ]
  },
  {
    "id": "country-quiz-40-malta",
    "country": "Malta",
    "name": "Malta",
    "isoCode": "MT",
    "flag": "malta",
    "flagUrl": "/flags/malta.svg",
    "flagEmoji": "🇲🇹",
    "capital": "Valletta",
    "zone": "europe",
    "subregion": "Southern Europe",
    "population": "540K",
    "currency": "Euro (EUR)",
    "languages": [
      "Maltese",
      "English"
    ],
    "lat": 35.9,
    "lng": 14.4,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Densely populated Mediterranean archipelago located 80 km south of Sicily between Europe and North Africa.",
    "clues": [
      "Densely populated Mediterranean archipelago located 80 km south of Sicily between Europe and North Africa.",
      "Comprises three inhabited islands: Malta, Gozo, and Comino.",
      "Ruled historically by the Knights Hospitaller; home to prehistoric megalithic temples older than the Pyramids.",
      "Its national language, Maltese, is the only Semitic language written in the Latin script and official in the EU.",
      "Capital: Valletta · Population: ~540K · Currency: Euro (EUR)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-41-cyprus",
    "country": "Cyprus",
    "name": "Cyprus",
    "isoCode": "CY",
    "flag": "cyprus",
    "flagUrl": "/flags/cyprus.svg",
    "flagEmoji": "🇨🇾",
    "capital": "Nicosia",
    "zone": "europe",
    "subregion": "Southern Europe / Western Asia",
    "population": "1.3M",
    "currency": "Euro (EUR)",
    "languages": [
      "Greek",
      "Turkish"
    ],
    "lat": 35.1,
    "lng": 33.4,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Third-largest and third-most populous island in the Mediterranean Sea, located south of Anatolia.",
    "clues": [
      "Third-largest and third-most populous island in the Mediterranean Sea, located south of Anatolia.",
      "Features the forested Troodos Mountains in the center and sunny coastal plains.",
      "Mythological birthplace of Aphrodite; its flag uniquely displays the copper-colored silhouette of the island itself.",
      "Its capital, Nicosia (Lefkosia), is the world's last divided capital city.",
      "Capital: Nicosia · Population: ~1.3M · Currency: Euro (EUR)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-42-andorra",
    "country": "Andorra",
    "name": "Andorra",
    "isoCode": "AD",
    "flag": "andorra",
    "flagUrl": "/flags/andorra.svg",
    "flagEmoji": "🇦🇩",
    "capital": "Andorra la Vella",
    "zone": "europe",
    "subregion": "Southern Europe",
    "population": "80K",
    "currency": "Euro (EUR)",
    "languages": [
      "Catalan"
    ],
    "lat": 42.5,
    "lng": 1.5,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Landlocked microstate nestled high in the eastern Pyrenees between France and Spain.",
    "clues": [
      "Landlocked microstate nestled high in the eastern Pyrenees between France and Spain.",
      "Its capital at 1,023 meters is the highest capital city by elevation in Europe.",
      "Governed as a unique diarchy with two Co-Princes: the President of France and the Bishop of Urgell.",
      "Catalan is its sole official language, and ski tourism drives its economy.",
      "Capital: Andorra la Vella · Population: ~80K · Currency: Euro (EUR)"
    ],
    "neighbors": [
      "France",
      "Spain"
    ]
  },
  {
    "id": "country-quiz-43-monaco",
    "country": "Monaco",
    "name": "Monaco",
    "isoCode": "MC",
    "flag": "monaco",
    "flagUrl": "/flags/monaco.svg",
    "flagEmoji": "🇲🇨",
    "capital": "Monaco",
    "zone": "europe",
    "subregion": "Western Europe",
    "population": "39K",
    "currency": "Euro (EUR)",
    "languages": [
      "French"
    ],
    "lat": 43.7,
    "lng": 7.4,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Sovereign city-state on the French Riviera (Côte d'Azur), bordered on three sides by France and one by the Mediterranean.",
    "clues": [
      "Sovereign city-state on the French Riviera (Côte d'Azur), bordered on three sides by France and one by the Mediterranean.",
      "Second-smallest independent state in the world by area (~2.1 km²) and the most densely populated.",
      "World-famous for the Monte Carlo Casino, the Formula 1 Monaco Grand Prix, and the House of Grimaldi.",
      "Has no income tax for residents and a harbor packed with superyachts.",
      "Capital: Monaco · Population: ~39K · Currency: Euro (EUR)"
    ],
    "neighbors": [
      "France"
    ]
  },
  {
    "id": "country-quiz-44-liechtenstein",
    "country": "Liechtenstein",
    "name": "Liechtenstein",
    "isoCode": "LI",
    "flag": "liechtenstein",
    "flagUrl": "/flags/liechtenstein.svg",
    "flagEmoji": "🇱🇮",
    "capital": "Vaduz",
    "zone": "europe",
    "subregion": "Western Europe",
    "population": "40K",
    "currency": "Swiss franc (CHF)",
    "languages": [
      "German"
    ],
    "lat": 47.2,
    "lng": 9.6,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Alpine German-speaking microstate in the Upper Rhine valley between Switzerland and Austria.",
    "clues": [
      "Alpine German-speaking microstate in the Upper Rhine valley between Switzerland and Austria.",
      "One of only two doubly landlocked countries in the world (alongside Uzbekistan).",
      "Constitutional monarchy headed by the Prince of Liechtenstein, perched at Vaduz Castle above the capital.",
      "Uses the Swiss franc and forms a customs and monetary union with Switzerland.",
      "Capital: Vaduz · Population: ~40K · Currency: Swiss franc (CHF)"
    ],
    "neighbors": [
      "Switzerland",
      "Austria"
    ]
  },
  {
    "id": "country-quiz-45-san-marino",
    "country": "San Marino",
    "name": "San Marino",
    "isoCode": "SM",
    "flag": "san-marino",
    "flagUrl": "/flags/san-marino.svg",
    "flagEmoji": "🇸🇲",
    "capital": "San Marino",
    "zone": "europe",
    "subregion": "Southern Europe",
    "population": "34K",
    "currency": "Euro (EUR)",
    "languages": [
      "Italian"
    ],
    "lat": 43.9,
    "lng": 12.5,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Enclaved microstate completely surrounded by north-central Italy on the slopes of Mount Titano.",
    "clues": [
      "Enclaved microstate completely surrounded by north-central Italy on the slopes of Mount Titano.",
      "Claims to be the world's oldest surviving sovereign republic, founded in 301 AD by a Christian stonemason.",
      "Famous for the Three Towers perched atop the three peaks of Monte Titano.",
      "Governed by two Captains Regent elected every six months.",
      "Capital: San Marino · Population: ~34K · Currency: Euro (EUR)"
    ],
    "neighbors": [
      "Italy"
    ]
  },
  {
    "id": "country-quiz-46-vatican-city",
    "country": "Vatican City",
    "name": "Vatican City",
    "isoCode": "VA",
    "flag": "vatican-city",
    "flagUrl": "/flags/vatican-city.svg",
    "flagEmoji": "🇻🇦",
    "capital": "Vatican City",
    "zone": "europe",
    "subregion": "Southern Europe",
    "population": "800",
    "currency": "Euro (EUR)",
    "languages": [
      "Italian",
      "Latin"
    ],
    "lat": 41.9,
    "lng": 12.45,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Walled enclave within the city of Rome and the smallest sovereign state in the world by both area (49 hectares) and population.",
    "clues": [
      "Walled enclave within the city of Rome and the smallest sovereign state in the world by both area (49 hectares) and population.",
      "Serves as the spiritual and administrative headquarters of the Roman Catholic Church and the Holy See.",
      "Home to St. Peter's Basilica, the Sistine Chapel painted by Michelangelo, and the Vatican Museums.",
      "Protected by the colorful Pontifical Swiss Guard since 1506.",
      "Capital: Vatican City · Population: ~800 · Currency: Euro (EUR)"
    ],
    "neighbors": [
      "Italy"
    ]
  },
  {
    "id": "country-quiz-47-china",
    "country": "China",
    "name": "China",
    "isoCode": "CN",
    "flag": "china",
    "flagUrl": "/flags/china.svg",
    "flagEmoji": "🇨🇳",
    "capital": "Beijing",
    "zone": "asia",
    "subregion": "East Asia",
    "population": "1.41B",
    "currency": "Renminbi / Yuan (CNY)",
    "languages": [
      "Mandarin Chinese"
    ],
    "lat": 35.9,
    "lng": 104.2,
    "difficulty": "easy",
    "tier": 1,
    "hint": "Vast East Asian nation stretching from the Pacific coastline to the Himalayas, Tibetan Plateau, and Gobi Desert.",
    "clues": [
      "Vast East Asian nation stretching from the Pacific coastline to the Himalayas, Tibetan Plateau, and Gobi Desert.",
      "Cradle of civilization along the Yellow (Huang He) and Yangtze (Chang Jiang) rivers.",
      "Home to the Great Wall, Forbidden City, Terracotta Army in Xi'an, and Shanghai's skyline.",
      "Tied with Russia for the most land borders of any country (14 neighboring states).",
      "Capital: Beijing · Population: ~1.41B · Currency: Renminbi / Yuan (CNY)"
    ],
    "neighbors": [
      "Russia",
      "Mongolia",
      "North Korea",
      "Vietnam",
      "Laos",
      "Myanmar",
      "India",
      "Bhutan",
      "Nepal",
      "Pakistan",
      "Afghanistan",
      "Tajikistan",
      "Kyrgyzstan",
      "Kazakhstan"
    ]
  },
  {
    "id": "country-quiz-48-japan",
    "country": "Japan",
    "name": "Japan",
    "isoCode": "JP",
    "flag": "japan",
    "flagUrl": "/flags/japan.svg",
    "flagEmoji": "🇯🇵",
    "capital": "Tokyo",
    "zone": "asia",
    "subregion": "East Asia",
    "population": "124.5M",
    "currency": "Japanese yen (JPY)",
    "languages": [
      "Japanese"
    ],
    "lat": 36.2,
    "lng": 138.3,
    "difficulty": "easy",
    "tier": 1,
    "hint": "Volcanic island archipelago of over 14,000 islands curving along the Pacific Ring of Fire off East Asia.",
    "clues": [
      "Volcanic island archipelago of over 14,000 islands curving along the Pacific Ring of Fire off East Asia.",
      "Four main islands—Honshu, Hokkaido, Kyushu, and Shikoku—make up 97% of its land area.",
      "Known as the 'Land of the Rising Sun', famed for Mount Fuji, Shinkansen bullet trains, Kyoto temples, and anime.",
      "Its capital metropolitan area (Greater Tokyo) is the most populous urban agglomeration on Earth.",
      "Capital: Tokyo · Population: ~124.5M · Currency: Japanese yen (JPY)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-49-south-korea",
    "country": "South Korea",
    "name": "South Korea",
    "isoCode": "KR",
    "flag": "south-korea",
    "flagUrl": "/flags/south-korea.svg",
    "flagEmoji": "🇰🇷",
    "capital": "Seoul",
    "zone": "asia",
    "subregion": "East Asia",
    "population": "51.7M",
    "currency": "South Korean won (KRW)",
    "languages": [
      "Korean"
    ],
    "lat": 35.9,
    "lng": 127.8,
    "difficulty": "easy",
    "tier": 1,
    "hint": "Occupies the southern half of the Korean Peninsula, bordered by the Yellow Sea and East Sea (Sea of Japan).",
    "clues": [
      "Occupies the southern half of the Korean Peninsula, bordered by the Yellow Sea and East Sea (Sea of Japan).",
      "Separated from its northern neighbor along the heavily fortified 38th Parallel Demilitarized Zone (DMZ).",
      "Global powerhouse in semiconductors, K-pop, cinema, and high-speed technology; includes volcanic Jeju Island.",
      "Roughly half of its entire population lives in the Seoul Capital Area along the Han River.",
      "Capital: Seoul · Population: ~51.7M · Currency: South Korean won (KRW)"
    ],
    "neighbors": [
      "North Korea"
    ]
  },
  {
    "id": "country-quiz-50-north-korea",
    "country": "North Korea",
    "name": "North Korea",
    "isoCode": "KP",
    "flag": "north-korea",
    "flagUrl": "/flags/north-korea.svg",
    "flagEmoji": "🇰🇵",
    "capital": "Pyongyang",
    "zone": "asia",
    "subregion": "East Asia",
    "population": "26.1M",
    "currency": "North Korean won (KPW)",
    "languages": [
      "Korean"
    ],
    "lat": 40.3,
    "lng": 127.5,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Mountainous state occupying the northern half of the Korean Peninsula between the Yalu/Tumen rivers and the DMZ.",
    "clues": [
      "Mountainous state occupying the northern half of the Korean Peninsula between the Yalu/Tumen rivers and the DMZ.",
      "Its highest peak is volcanic Mount Paektu on the Chinese border, featuring Heaven Lake in its caldera.",
      "Officially the Democratic People's Republic of Korea (DPRK), founded in 1948.",
      "Shares land borders with China, a short 17-km river border with Russia, and South Korea.",
      "Capital: Pyongyang · Population: ~26.1M · Currency: North Korean won (KPW)"
    ],
    "neighbors": [
      "China",
      "Russia",
      "South Korea"
    ]
  },
  {
    "id": "country-quiz-51-india",
    "country": "India",
    "name": "India",
    "isoCode": "IN",
    "flag": "india",
    "flagUrl": "/flags/india.svg",
    "flagEmoji": "🇮🇳",
    "capital": "New Delhi",
    "zone": "asia",
    "subregion": "South Asia",
    "population": "1.43B",
    "currency": "Indian rupee (INR)",
    "languages": [
      "Hindi",
      "English"
    ],
    "lat": 20.6,
    "lng": 79,
    "difficulty": "easy",
    "tier": 1,
    "hint": "World's most populous nation, forming a massive triangular peninsula between the Arabian Sea and Bay of Bengal.",
    "clues": [
      "World's most populous nation, forming a massive triangular peninsula between the Arabian Sea and Bay of Bengal.",
      "Bounded to the north by the Himalayas and watered by the sacred Ganges, Indus, and Brahmaputra rivers.",
      "World's largest democracy; home to the Taj Mahal in Agra, Bollywood in Mumbai, and tech hub Bengaluru.",
      "Birthplace of four major world religions: Hinduism, Buddhism, Jainism, and Sikhism.",
      "Capital: New Delhi · Population: ~1.43B · Currency: Indian rupee (INR)"
    ],
    "neighbors": [
      "Pakistan",
      "China",
      "Nepal",
      "Bhutan",
      "Bangladesh",
      "Myanmar"
    ]
  },
  {
    "id": "country-quiz-52-pakistan",
    "country": "Pakistan",
    "name": "Pakistan",
    "isoCode": "PK",
    "flag": "pakistan",
    "flagUrl": "/flags/pakistan.svg",
    "flagEmoji": "🇵🇰",
    "capital": "Islamabad",
    "zone": "asia",
    "subregion": "South Asia",
    "population": "241.5M",
    "currency": "Pakistani rupee (PKR)",
    "languages": [
      "Urdu",
      "English"
    ],
    "lat": 30.4,
    "lng": 69.3,
    "difficulty": "medium",
    "tier": 2,
    "hint": "South Asian nation stretching from the Arabian Sea coast up the fertile Indus River valley to the Karakoram peaks.",
    "clues": [
      "South Asian nation stretching from the Arabian Sea coast up the fertile Indus River valley to the Karakoram peaks.",
      "Home to K2 (8,611 m), the world's second-highest mountain, where the Himalayas, Karakoram, and Hindu Kush meet.",
      "Contains ancient Indus Valley sites like Mohenjo-daro and the Mughal landmarks of Lahore.",
      "In the 1960s, it moved its capital from the coastal megacity of Karachi to the planned northern city of Islamabad.",
      "Capital: Islamabad · Population: ~241.5M · Currency: Pakistani rupee (PKR)"
    ],
    "neighbors": [
      "India",
      "China",
      "Afghanistan",
      "Iran"
    ]
  },
  {
    "id": "country-quiz-53-bangladesh",
    "country": "Bangladesh",
    "name": "Bangladesh",
    "isoCode": "BD",
    "flag": "bangladesh",
    "flagUrl": "/flags/bangladesh.svg",
    "flagEmoji": "🇧🇩",
    "capital": "Dhaka",
    "zone": "asia",
    "subregion": "South Asia",
    "population": "173.0M",
    "currency": "Bangladeshi taka (BDT)",
    "languages": [
      "Bengali"
    ],
    "lat": 23.7,
    "lng": 90.4,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Lush, low-lying South Asian nation sitting on the world's largest river delta formed by the Ganges and Brahmaputra.",
    "clues": [
      "Lush, low-lying South Asian nation sitting on the world's largest river delta formed by the Ganges and Brahmaputra.",
      "Almost completely surrounded by India on three sides, with a short southeastern border with Myanmar and the Bay of Bengal.",
      "Home to the Sundarbans, the world's largest mangrove forest and habitat of the Royal Bengal Tiger.",
      "One of the most densely populated large countries in the world and a global leader in textile exports.",
      "Capital: Dhaka · Population: ~173.0M · Currency: Bangladeshi taka (BDT)"
    ],
    "neighbors": [
      "India",
      "Myanmar"
    ]
  },
  {
    "id": "country-quiz-54-sri-lanka",
    "country": "Sri Lanka",
    "name": "Sri Lanka",
    "isoCode": "LK",
    "flag": "sri-lanka",
    "flagUrl": "/flags/sri-lanka.svg",
    "flagEmoji": "🇱🇰",
    "capital": "Colombo",
    "zone": "asia",
    "subregion": "South Asia",
    "population": "22.0M",
    "currency": "Sri Lankan rupee (LKR)",
    "languages": [
      "Sinhala",
      "Tamil"
    ],
    "lat": 7.9,
    "lng": 80.8,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Tear-drop-shaped island nation in the Indian Ocean separated from southeastern India by the Palk Strait.",
    "clues": [
      "Tear-drop-shaped island nation in the Indian Ocean separated from southeastern India by the Palk Strait.",
      "Features misty central highlands famous for Ceylon tea plantations, ancient Buddhist stupas, and sandy beaches.",
      "Home to the 5th-century Sigiriya ('Lion Rock') fortress and the Temple of the Sacred Tooth Relic in Kandy.",
      "Colombo is its commercial and executive hub, while adjacent Sri Jayawardenepura Kotte is the legislative seat.",
      "Capital: Colombo · Population: ~22.0M · Currency: Sri Lankan rupee (LKR)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-55-nepal",
    "country": "Nepal",
    "name": "Nepal",
    "isoCode": "NP",
    "flag": "nepal",
    "flagUrl": "/flags/nepal.svg",
    "flagEmoji": "🇳🇵",
    "capital": "Kathmandu",
    "zone": "asia",
    "subregion": "South Asia",
    "population": "30.9M",
    "currency": "Nepalese rupee (NPR)",
    "languages": [
      "Nepali"
    ],
    "lat": 28.4,
    "lng": 84.1,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Landlocked Himalayan nation wedged between China (Tibet) to the north and India to the south, east, and west.",
    "clues": [
      "Landlocked Himalayan nation wedged between China (Tibet) to the north and India to the south, east, and west.",
      "Contains 8 of the world's 10 highest peaks, including Mount Everest (Sagarmatha) at 8,848.86 meters.",
      "Birthplace of Siddhartha Gautama (the Buddha) at Lumbini in the southern Terai plains.",
      "Has the only non-quadrilateral national flag in the world, formed by two stacked crimson pennants.",
      "Capital: Kathmandu · Population: ~30.9M · Currency: Nepalese rupee (NPR)"
    ],
    "neighbors": [
      "China",
      "India"
    ]
  },
  {
    "id": "country-quiz-56-bhutan",
    "country": "Bhutan",
    "name": "Bhutan",
    "isoCode": "BT",
    "flag": "bhutan",
    "flagUrl": "/flags/bhutan.svg",
    "flagEmoji": "🇧🇹",
    "capital": "Thimphu",
    "zone": "asia",
    "subregion": "South Asia",
    "population": "780K",
    "currency": "Bhutanese ngultrum (BTN)",
    "languages": [
      "Dzongkha"
    ],
    "lat": 27.5,
    "lng": 90.4,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Landlocked Buddhist kingdom in the Eastern Himalayas known natively as Druk Yul ('Land of the Thunder Dragon').",
    "clues": [
      "Landlocked Buddhist kingdom in the Eastern Himalayas known natively as Druk Yul ('Land of the Thunder Dragon').",
      "Famous for measuring progress by Gross National Happiness (GNH) and being carbon-negative due to >70% forest cover.",
      "Iconic for Paro Taktsang (Tiger's Nest Monastery), clinging to a sheer cliffside 900 meters above the valley.",
      "Its capital Thimphu is famous for having no traffic lights, relying on white-gloved police officers instead.",
      "Capital: Thimphu · Population: ~780K · Currency: Bhutanese ngultrum (BTN)"
    ],
    "neighbors": [
      "China",
      "India"
    ]
  },
  {
    "id": "country-quiz-57-maldives",
    "country": "Maldives",
    "name": "Maldives",
    "isoCode": "MV",
    "flag": "maldives",
    "flagUrl": "/flags/maldives.svg",
    "flagEmoji": "🇲🇻",
    "capital": "Malé",
    "zone": "asia",
    "subregion": "South Asia",
    "population": "520K",
    "currency": "Maldivian rufiyaa (MVR)",
    "languages": [
      "Dhivehi"
    ],
    "lat": 3.2,
    "lng": 73.2,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Archipelago of 26 coral atolls and ~1,192 islands stretching across the equator in the Indian Ocean.",
    "clues": [
      "Archipelago of 26 coral atolls and ~1,192 islands stretching across the equator in the Indian Ocean.",
      "Asia's smallest country by land area and the world's lowest-lying nation, with an average elevation of just 1.5 meters.",
      "World-famous for overwater bungalows, turquoise lagoons, and coral reefs teeming with manta rays and whale sharks.",
      "Its densely packed island capital Malé covers roughly 8 km².",
      "Capital: Malé · Population: ~520K · Currency: Maldivian rufiyaa (MVR)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-58-thailand",
    "country": "Thailand",
    "name": "Thailand",
    "isoCode": "TH",
    "flag": "thailand",
    "flagUrl": "/flags/thailand.svg",
    "flagEmoji": "🇹🇭",
    "capital": "Bangkok",
    "zone": "asia",
    "subregion": "Southeast Asia",
    "population": "71.8M",
    "currency": "Thai baht (THB)",
    "languages": [
      "Thai"
    ],
    "lat": 15.9,
    "lng": 100.9,
    "difficulty": "easy",
    "tier": 1,
    "hint": "Mainland Southeast Asian kingdom with coastlines along both the Gulf of Thailand and the Andaman Sea.",
    "clues": [
      "Mainland Southeast Asian kingdom with coastlines along both the Gulf of Thailand and the Andaman Sea.",
      "Historically known as Siam until 1939; the only Southeast Asian nation never colonized by a European power.",
      "Renowned for ornate Buddhist temples (Wat Arun, Wat Phra Kaew), street food, Chiang Mai, and Phuket.",
      "Its capital's ceremonial Thai name (Krung Thep Maha Nakhon...) is the longest city name in the world.",
      "Capital: Bangkok · Population: ~71.8M · Currency: Thai baht (THB)"
    ],
    "neighbors": [
      "Myanmar",
      "Laos",
      "Cambodia",
      "Malaysia"
    ]
  },
  {
    "id": "country-quiz-59-vietnam",
    "country": "Vietnam",
    "name": "Vietnam",
    "isoCode": "VN",
    "flag": "vietnam",
    "flagUrl": "/flags/vietnam.svg",
    "flagEmoji": "🇻🇳",
    "capital": "Hanoi",
    "zone": "asia",
    "subregion": "Southeast Asia",
    "population": "98.9M",
    "currency": "Vietnamese đồng (VND)",
    "languages": [
      "Vietnamese"
    ],
    "lat": 14.1,
    "lng": 108.3,
    "difficulty": "medium",
    "tier": 2,
    "hint": "S-shaped coastal nation stretching 1,650 km along the eastern edge of the Indochinese Peninsula on the South China Sea.",
    "clues": [
      "S-shaped coastal nation stretching 1,650 km along the eastern edge of the Indochinese Peninsula on the South China Sea.",
      "Anchored by the Red River Delta in the north (Hanoi) and the Mekong Delta in the south (Ho Chi Minh City).",
      "Famous for the limestone karsts of Ha Long Bay, imperial Hue, lantern-lit Hoi An, and Son Doong (world's largest cave).",
      "World's second-largest coffee exporter after Brazil and famed for pho and banh mi.",
      "Capital: Hanoi · Population: ~98.9M · Currency: Vietnamese đồng (VND)"
    ],
    "neighbors": [
      "China",
      "Laos",
      "Cambodia"
    ]
  },
  {
    "id": "country-quiz-60-indonesia",
    "country": "Indonesia",
    "name": "Indonesia",
    "isoCode": "ID",
    "flag": "indonesia",
    "flagUrl": "/flags/indonesia.svg",
    "flagEmoji": "🇮🇩",
    "capital": "Jakarta",
    "zone": "asia",
    "subregion": "Southeast Asia",
    "population": "277.5M",
    "currency": "Indonesian rupiah (IDR)",
    "languages": [
      "Indonesian"
    ],
    "lat": 0.8,
    "lng": 113.9,
    "difficulty": "easy",
    "tier": 1,
    "hint": "World's largest archipelagic state, comprising over 17,000 islands spanning 5,000 km along the Equator.",
    "clues": [
      "World's largest archipelagic state, comprising over 17,000 islands spanning 5,000 km along the Equator.",
      "Major islands include Java (most populous island on Earth), Sumatra, Borneo (Kalimantan), Sulawesi, and New Guinea (Papua).",
      "Home to Borobudur (world's largest Buddhist temple), Hindu-majority Bali, Komodo dragons, and active volcanoes.",
      "Building a new planned forest capital, Nusantara, in East Kalimantan to relieve sinking Jakarta.",
      "Capital: Jakarta · Population: ~277.5M · Currency: Indonesian rupiah (IDR)"
    ],
    "neighbors": [
      "Malaysia",
      "Papua New Guinea",
      "Timor-Leste"
    ]
  },
  {
    "id": "country-quiz-61-philippines",
    "country": "Philippines",
    "name": "Philippines",
    "isoCode": "PH",
    "flag": "philippines",
    "flagUrl": "/flags/philippines.svg",
    "flagEmoji": "🇵🇭",
    "capital": "Manila",
    "zone": "asia",
    "subregion": "Southeast Asia",
    "population": "117.3M",
    "currency": "Philippine peso (PHP)",
    "languages": [
      "Filipino",
      "English"
    ],
    "lat": 12.9,
    "lng": 121.8,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Western Pacific archipelago of 7,641 islands divided into three main geographic groups: Luzon, Visayas, and Mindanao.",
    "clues": [
      "Western Pacific archipelago of 7,641 islands divided into three main geographic groups: Luzon, Visayas, and Mindanao.",
      "Lies along the Pacific Ring of Fire and typhoon belt; bordered by the Philippine Sea and South China Sea.",
      "Known for the Banaue Rice Terraces, Chocolate Hills of Bohol, Palawan's underground river, and colorful jeepneys.",
      "Named after King Philip II of Spain in the 16th century; Asia's largest Catholic-majority nation.",
      "Capital: Manila · Population: ~117.3M · Currency: Philippine peso (PHP)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-62-malaysia",
    "country": "Malaysia",
    "name": "Malaysia",
    "isoCode": "MY",
    "flag": "malaysia",
    "flagUrl": "/flags/malaysia.svg",
    "flagEmoji": "🇲🇾",
    "capital": "Kuala Lumpur",
    "zone": "asia",
    "subregion": "Southeast Asia",
    "population": "34.3M",
    "currency": "Malaysian ringgit (MYR)",
    "languages": [
      "Malay"
    ],
    "lat": 4.2,
    "lng": 101.9,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Southeast Asian federation split by the South China Sea into Peninsular Malaysia and East Malaysia (Sabah & Sarawak on Borneo).",
    "clues": [
      "Southeast Asian federation split by the South China Sea into Peninsular Malaysia and East Malaysia (Sabah & Sarawak on Borneo).",
      "Controls the strategic Strait of Malacca, one of the busiest shipping lanes in the world.",
      "Famous for the 452-meter Petronas Twin Towers, Mount Kinabalu, Penang's culinary heritage, and tropical rainforests.",
      "While Kuala Lumpur is the national and royal capital, Putrajaya serves as the administrative center.",
      "Capital: Kuala Lumpur · Population: ~34.3M · Currency: Malaysian ringgit (MYR)"
    ],
    "neighbors": [
      "Thailand",
      "Indonesia",
      "Brunei",
      "Singapore"
    ]
  },
  {
    "id": "country-quiz-63-singapore",
    "country": "Singapore",
    "name": "Singapore",
    "isoCode": "SG",
    "flag": "singapore",
    "flagUrl": "/flags/singapore.svg",
    "flagEmoji": "🇸🇬",
    "capital": "Singapore",
    "zone": "asia",
    "subregion": "Southeast Asia",
    "population": "5.9M",
    "currency": "Singapore dollar (SGD)",
    "languages": [
      "English",
      "Malay",
      "Mandarin",
      "Tamil"
    ],
    "lat": 1.35,
    "lng": 103.82,
    "difficulty": "easy",
    "tier": 1,
    "hint": "Sovereign island city-state at the southern tip of the Malay Peninsula, just 137 km north of the Equator.",
    "clues": [
      "Sovereign island city-state at the southern tip of the Malay Peninsula, just 137 km north of the Equator.",
      "Separated from Malaysia by the Johor Strait and from Indonesia's Riau Islands by the Singapore Strait.",
      "Global financial and maritime hub famous for Marina Bay Sands, Gardens by the Bay, and Changi Airport.",
      "One of only three surviving sovereign city-states in the world (alongside Monaco and Vatican City).",
      "Capital: Singapore · Population: ~5.9M · Currency: Singapore dollar (SGD)"
    ],
    "neighbors": [
      "Malaysia"
    ]
  },
  {
    "id": "country-quiz-64-cambodia",
    "country": "Cambodia",
    "name": "Cambodia",
    "isoCode": "KH",
    "flag": "cambodia",
    "flagUrl": "/flags/cambodia.svg",
    "flagEmoji": "🇰🇭",
    "capital": "Phnom Penh",
    "zone": "asia",
    "subregion": "Southeast Asia",
    "population": "16.9M",
    "currency": "Cambodian riel (KHR)",
    "languages": [
      "Khmer"
    ],
    "lat": 12.6,
    "lng": 104.9,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Southeast Asian kingdom centered on the low-lying basin of the Tonlé Sap lake and the Mekong River.",
    "clues": [
      "Southeast Asian kingdom centered on the low-lying basin of the Tonlé Sap lake and the Mekong River.",
      "Heart of the powerful medieval Khmer Empire that ruled much of mainland Southeast Asia.",
      "Its flag is the only national flag in the world to feature an actual building: the temple complex of Angkor Wat.",
      "Tonlé Sap uniquely reverses its flow direction twice a year with the monsoon season.",
      "Capital: Phnom Penh · Population: ~16.9M · Currency: Cambodian riel (KHR)"
    ],
    "neighbors": [
      "Thailand",
      "Laos",
      "Vietnam"
    ]
  },
  {
    "id": "country-quiz-65-laos",
    "country": "Laos",
    "name": "Laos",
    "isoCode": "LA",
    "flag": "laos",
    "flagUrl": "/flags/laos.svg",
    "flagEmoji": "🇱🇦",
    "capital": "Vientiane",
    "zone": "asia",
    "subregion": "Southeast Asia",
    "population": "7.6M",
    "currency": "Lao kip (LAK)",
    "languages": [
      "Lao"
    ],
    "lat": 19.9,
    "lng": 102.5,
    "difficulty": "hard",
    "tier": 3,
    "hint": "The only landlocked country in Southeast Asia, heavily forested and rugged along the Mekong River.",
    "clues": [
      "The only landlocked country in Southeast Asia, heavily forested and rugged along the Mekong River.",
      "Bordered by Myanmar, China, Vietnam, Cambodia, and Thailand.",
      "Famous for the UNESCO royal town of Luang Prabang, the mysterious Plain of Jars, and Pha That Luang stupa.",
      "Known as the 'Battery of Southeast Asia' for its extensive Mekong hydroelectric power exports.",
      "Capital: Vientiane · Population: ~7.6M · Currency: Lao kip (LAK)"
    ],
    "neighbors": [
      "China",
      "Vietnam",
      "Cambodia",
      "Thailand",
      "Myanmar"
    ]
  },
  {
    "id": "country-quiz-66-myanmar",
    "country": "Myanmar",
    "name": "Myanmar",
    "isoCode": "MM",
    "flag": "myanmar",
    "flagUrl": "/flags/myanmar.svg",
    "flagEmoji": "🇲🇲",
    "capital": "Naypyidaw",
    "zone": "asia",
    "subregion": "Southeast Asia",
    "population": "54.6M",
    "currency": "Myanmar kyat (MMK)",
    "languages": [
      "Burmese"
    ],
    "lat": 21.9,
    "lng": 95.9,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Largest country in mainland Southeast Asia, stretching from Himalayan peaks down the Irrawaddy River to the Andaman Sea.",
    "clues": [
      "Largest country in mainland Southeast Asia, stretching from Himalayan peaks down the Irrawaddy River to the Andaman Sea.",
      "Formerly known as Burma; home to over 2,000 ancient Buddhist temples and stupas on the plains of Bagan.",
      "Yangon (Rangoon) is its largest city and home to the golden Shwedagon Pagoda.",
      "In 2005, the government abruptly moved the capital inland to the purpose-built city of Naypyidaw.",
      "Capital: Naypyidaw · Population: ~54.6M · Currency: Myanmar kyat (MMK)"
    ],
    "neighbors": [
      "India",
      "Bangladesh",
      "China",
      "Laos",
      "Thailand"
    ]
  },
  {
    "id": "country-quiz-67-brunei",
    "country": "Brunei",
    "name": "Brunei",
    "isoCode": "BN",
    "flag": "brunei",
    "flagUrl": "/flags/brunei.svg",
    "flagEmoji": "🇧🇳",
    "capital": "Bandar Seri Begawan",
    "zone": "asia",
    "subregion": "Southeast Asia",
    "population": "450K",
    "currency": "Brunei dollar (BND)",
    "languages": [
      "Malay"
    ],
    "lat": 4.5,
    "lng": 114.7,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Small, oil-rich Islamic sultanate on the northern coast of the island of Borneo facing the South China Sea.",
    "clues": [
      "Small, oil-rich Islamic sultanate on the northern coast of the island of Borneo facing the South China Sea.",
      "Split into two non-contiguous territories completely surrounded on land by the Malaysian state of Sarawak.",
      "Famous for the golden-domed Omar Ali Saifuddien Mosque and Kampong Ayer, a historic stilt water village.",
      "Its currency is pegged 1:1 with the Singapore dollar and both currencies are legal tender in each country.",
      "Capital: Bandar Seri Begawan · Population: ~450K · Currency: Brunei dollar (BND)"
    ],
    "neighbors": [
      "Malaysia"
    ]
  },
  {
    "id": "country-quiz-68-timor-leste",
    "country": "Timor-Leste",
    "name": "Timor-Leste",
    "isoCode": "TL",
    "flag": "east-timor",
    "flagUrl": "/flags/east-timor.svg",
    "flagEmoji": "🇹🇱",
    "capital": "Dili",
    "zone": "asia",
    "subregion": "Southeast Asia",
    "population": "1.36M",
    "currency": "United States dollar (USD)",
    "languages": [
      "Tetum",
      "Portuguese"
    ],
    "lat": -8.8,
    "lng": 125.7,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Occupies the eastern half of the island of Timor (plus the Oecusse exclave) north of the Timor Sea.",
    "clues": [
      "Occupies the eastern half of the island of Timor (plus the Oecusse exclave) north of the Timor Sea.",
      "Became the first new sovereign state of the 21st century in May 2002 after Indonesian occupation and earlier Portuguese rule.",
      "One of only two predominantly Catholic nations in Asia (alongside the Philippines).",
      "Uses the US dollar as its official currency and Portuguese alongside Tetum as official languages.",
      "Capital: Dili · Population: ~1.36M · Currency: United States dollar (USD)"
    ],
    "neighbors": [
      "Indonesia"
    ]
  },
  {
    "id": "country-quiz-69-mongolia",
    "country": "Mongolia",
    "name": "Mongolia",
    "isoCode": "MN",
    "flag": "mongolia",
    "flagUrl": "/flags/mongolia.svg",
    "flagEmoji": "🇲🇳",
    "capital": "Ulaanbaatar",
    "zone": "asia",
    "subregion": "East Asia",
    "population": "3.4M",
    "currency": "Mongolian tögrög (MNT)",
    "languages": [
      "Mongolian"
    ],
    "lat": 46.9,
    "lng": 103.8,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Vast landlocked nation of steppes, mountains, and the Gobi Desert sandwiched between Russia and China.",
    "clues": [
      "Vast landlocked nation of steppes, mountains, and the Gobi Desert sandwiched between Russia and China.",
      "The most sparsely populated sovereign country in the world (~2 people per km²), known as the 'Land of the Eternal Blue Sky'.",
      "Homeland of Genghis Khan, who founded the largest contiguous land empire in human history in 1206.",
      "Its capital Ulaanbaatar is the coldest national capital in the world by annual average temperature.",
      "Capital: Ulaanbaatar · Population: ~3.4M · Currency: Mongolian tögrög (MNT)"
    ],
    "neighbors": [
      "Russia",
      "China"
    ]
  },
  {
    "id": "country-quiz-70-taiwan",
    "country": "Taiwan",
    "name": "Taiwan",
    "isoCode": "TW",
    "flag": "taiwan",
    "flagUrl": "/flags/taiwan.svg",
    "flagEmoji": "🇹🇼",
    "capital": "Taipei",
    "zone": "asia",
    "subregion": "East Asia",
    "population": "23.4M",
    "currency": "New Taiwan dollar (TWD)",
    "languages": [
      "Mandarin Chinese"
    ],
    "lat": 23.7,
    "lng": 121,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Mountainous island in East Asia separated from southeastern mainland China by the 180-km Taiwan Strait.",
    "clues": [
      "Mountainous island in East Asia separated from southeastern mainland China by the 180-km Taiwan Strait.",
      "Bisected by the Tropic of Cancer and dominated by the Central Mountain Range (peaking at Yushan, 3,952 m).",
      "Produces the majority of the world's most advanced semiconductor microchips; famous for Taipei 101 and night markets.",
      "Historically called Ilha Formosa ('Beautiful Island') by 16th-century Portuguese sailors.",
      "Capital: Taipei · Population: ~23.4M · Currency: New Taiwan dollar (TWD)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-71-kazakhstan",
    "country": "Kazakhstan",
    "name": "Kazakhstan",
    "isoCode": "KZ",
    "flag": "kazakhstan",
    "flagUrl": "/flags/kazakhstan.svg",
    "flagEmoji": "🇰🇿",
    "capital": "Astana",
    "zone": "asia",
    "subregion": "Central Asia",
    "population": "20.0M",
    "currency": "Kazakhstani tenge (KZT)",
    "languages": [
      "Kazakh",
      "Russian"
    ],
    "lat": 48,
    "lng": 66.9,
    "difficulty": "medium",
    "tier": 2,
    "hint": "World's largest landlocked country, stretching from the Caspian Sea across vast Eurasian steppes to the Altai Mountains.",
    "clues": [
      "World's largest landlocked country, stretching from the Caspian Sea across vast Eurasian steppes to the Altai Mountains.",
      "Houses the Baikonur Cosmodrome, from which Sputnik 1 and Yuri Gagarin launched into space.",
      "Moved its capital in 1997 from southern Almaty (at the foot of the Tian Shan) to northern Astana.",
      "Rich in oil, uranium, and mineral resources; borders Russia, China, Kyrgyzstan, Uzbekistan, and Turkmenistan.",
      "Capital: Astana · Population: ~20.0M · Currency: Kazakhstani tenge (KZT)"
    ],
    "neighbors": [
      "Russia",
      "China",
      "Kyrgyzstan",
      "Uzbekistan",
      "Turkmenistan"
    ]
  },
  {
    "id": "country-quiz-72-uzbekistan",
    "country": "Uzbekistan",
    "name": "Uzbekistan",
    "isoCode": "UZ",
    "flag": "uzbekistan",
    "flagUrl": "/flags/uzbekistan.svg",
    "flagEmoji": "🇺🇿",
    "capital": "Tashkent",
    "zone": "asia",
    "subregion": "Central Asia",
    "population": "36.4M",
    "currency": "Uzbekistani sum (UZS)",
    "languages": [
      "Uzbek"
    ],
    "lat": 41.4,
    "lng": 64.6,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Central Asia's most populous nation and one of only two doubly landlocked countries on Earth (alongside Liechtenstein).",
    "clues": [
      "Central Asia's most populous nation and one of only two doubly landlocked countries on Earth (alongside Liechtenstein).",
      "Lies between the Amu Darya and Syr Darya rivers, including the southern Kyzylkum Desert and shrinking Aral Sea.",
      "Heart of the ancient Silk Road, famed for the turquoise-tiled madrasas of Samarkand (Registan), Bukhara, and Khiva.",
      "Borders all four other Central Asian 'stans' plus Afghanistan.",
      "Capital: Tashkent · Population: ~36.4M · Currency: Uzbekistani sum (UZS)"
    ],
    "neighbors": [
      "Kazakhstan",
      "Kyrgyzstan",
      "Tajikistan",
      "Afghanistan",
      "Turkmenistan"
    ]
  },
  {
    "id": "country-quiz-73-kyrgyzstan",
    "country": "Kyrgyzstan",
    "name": "Kyrgyzstan",
    "isoCode": "KG",
    "flag": "kyrgyzstan",
    "flagUrl": "/flags/kyrgyzstan.svg",
    "flagEmoji": "🇰🇬",
    "capital": "Bishkek",
    "zone": "asia",
    "subregion": "Central Asia",
    "population": "7.1M",
    "currency": "Kyrgyzstani som (KGS)",
    "languages": [
      "Kyrgyz",
      "Russian"
    ],
    "lat": 41.2,
    "lng": 74.8,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Landlocked Central Asian republic covered over 80% by the towering peaks of the Tian Shan mountain range.",
    "clues": [
      "Landlocked Central Asian republic covered over 80% by the towering peaks of the Tian Shan mountain range.",
      "Centered around Issyk-Kul, the second-largest high-altitude alpine lake in the world after Lake Titicaca.",
      "Celebrates nomadic horse culture, yurts (whose crown, the tunduk, appears on the national flag), and the Epic of Manas.",
      "Shares borders with Kazakhstan, Uzbekistan, Tajikistan, and China.",
      "Capital: Bishkek · Population: ~7.1M · Currency: Kyrgyzstani som (KGS)"
    ],
    "neighbors": [
      "Kazakhstan",
      "Uzbekistan",
      "Tajikistan",
      "China"
    ]
  },
  {
    "id": "country-quiz-74-tajikistan",
    "country": "Tajikistan",
    "name": "Tajikistan",
    "isoCode": "TJ",
    "flag": "tajikistan",
    "flagUrl": "/flags/tajikistan.svg",
    "flagEmoji": "🇹🇯",
    "capital": "Dushanbe",
    "zone": "asia",
    "subregion": "Central Asia",
    "population": "10.1M",
    "currency": "Tajikistani somoni (TJS)",
    "languages": [
      "Tajik"
    ],
    "lat": 38.9,
    "lng": 71.3,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Smallest Central Asian country by area, with over 90% of its territory covered by the Pamir and Alay mountains ('Roof of the World').",
    "clues": [
      "Smallest Central Asian country by area, with over 90% of its territory covered by the Pamir and Alay mountains ('Roof of the World').",
      "Unlike its Turkic-speaking Central Asian neighbors, its official language is Tajik, a variety of Persian.",
      "Traversed by the high-altitude Pamir Highway (M41) along the Afghan border.",
      "Its capital Dushanbe literally means 'Monday' in Persian, named after a historic Monday bazaar.",
      "Capital: Dushanbe · Population: ~10.1M · Currency: Tajikistani somoni (TJS)"
    ],
    "neighbors": [
      "Uzbekistan",
      "Kyrgyzstan",
      "China",
      "Afghanistan"
    ]
  },
  {
    "id": "country-quiz-75-turkmenistan",
    "country": "Turkmenistan",
    "name": "Turkmenistan",
    "isoCode": "TM",
    "flag": "turkmenistan",
    "flagUrl": "/flags/turkmenistan.svg",
    "flagEmoji": "🇹🇲",
    "capital": "Ashgabat",
    "zone": "asia",
    "subregion": "Central Asia",
    "population": "6.5M",
    "currency": "Turkmenistani manat (TMT)",
    "languages": [
      "Turkmen"
    ],
    "lat": 39,
    "lng": 59.6,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Central Asian republic bordered by the Caspian Sea to the west and covered 80% by the Karakum Desert.",
    "clues": [
      "Central Asian republic bordered by the Caspian Sea to the west and covered 80% by the Karakum Desert.",
      "Home to the Darvaza gas crater ('Door to Hell'), a desert sinkhole burning continuously since 1971.",
      "Its capital Ashgabat holds the Guinness World Record for the highest density of white marble-clad buildings.",
      "Possesses some of the world's largest natural gas reserves and maintains UN-recognized permanent neutrality.",
      "Capital: Ashgabat · Population: ~6.5M · Currency: Turkmenistani manat (TMT)"
    ],
    "neighbors": [
      "Kazakhstan",
      "Uzbekistan",
      "Afghanistan",
      "Iran"
    ]
  },
  {
    "id": "country-quiz-76-afghanistan",
    "country": "Afghanistan",
    "name": "Afghanistan",
    "isoCode": "AF",
    "flag": "afghanistan",
    "flagUrl": "/flags/afghanistan.svg",
    "flagEmoji": "🇦🇫",
    "capital": "Kabul",
    "zone": "asia",
    "subregion": "South / Central Asia",
    "population": "42.2M",
    "currency": "Afghan afghani (AFN)",
    "languages": [
      "Pashto",
      "Dari"
    ],
    "lat": 33.9,
    "lng": 67.7,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Landlocked mountainous country at the crossroads of Central and South Asia, bisected by the Hindu Kush range.",
    "clues": [
      "Landlocked mountainous country at the crossroads of Central and South Asia, bisected by the Hindu Kush range.",
      "Features the narrow Wakhan Corridor in the northeast, which reaches a 76-km high-altitude border with China.",
      "Known for the turquoise lakes of Band-e-Amir, the Minaret of Jam, and lapis lazuli mines worked for millennia.",
      "Historically a strategic nexus along the Silk Road connecting Persia, India, and Central Asia.",
      "Capital: Kabul · Population: ~42.2M · Currency: Afghan afghani (AFN)"
    ],
    "neighbors": [
      "Pakistan",
      "Iran",
      "Turkmenistan",
      "Uzbekistan",
      "Tajikistan",
      "China"
    ]
  },
  {
    "id": "country-quiz-77-iran",
    "country": "Iran",
    "name": "Iran",
    "isoCode": "IR",
    "flag": "iran",
    "flagUrl": "/flags/iran.svg",
    "flagEmoji": "🇮🇷",
    "capital": "Tehran",
    "zone": "asia",
    "subregion": "Western Asia",
    "population": "89.2M",
    "currency": "Iranian rial (IRR)",
    "languages": [
      "Persian"
    ],
    "lat": 32.4,
    "lng": 53.7,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Large mountainous nation between the Caspian Sea in the north and the Persian Gulf and Gulf of Oman in the south.",
    "clues": [
      "Large mountainous nation between the Caspian Sea in the north and the Persian Gulf and Gulf of Oman in the south.",
      "Ringed by the Alborz Mountains (peaking at volcanic Mount Damavand) and Zagros Mountains around a central plateau.",
      "Heir to ancient Persia; home to Persepolis, the turquoise mosques of Isfahan's Naqsh-e Jahan Square, and Shiraz.",
      "Its capital Tehran sits at the southern foot of the snow-capped Alborz range.",
      "Capital: Tehran · Population: ~89.2M · Currency: Iranian rial (IRR)"
    ],
    "neighbors": [
      "Iraq",
      "Türkiye",
      "Armenia",
      "Azerbaijan",
      "Turkmenistan",
      "Afghanistan",
      "Pakistan"
    ]
  },
  {
    "id": "country-quiz-78-iraq",
    "country": "Iraq",
    "name": "Iraq",
    "isoCode": "IQ",
    "flag": "iraq",
    "flagUrl": "/flags/iraq.svg",
    "flagEmoji": "🇮🇶",
    "capital": "Baghdad",
    "zone": "asia",
    "subregion": "Western Asia",
    "population": "45.5M",
    "currency": "Iraqi dinar (IQD)",
    "languages": [
      "Arabic",
      "Kurdish"
    ],
    "lat": 33.2,
    "lng": 43.7,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Encompasses ancient Mesopotamia ('Land Between the Rivers'), watered by the Tigris and Euphrates rivers.",
    "clues": [
      "Encompasses ancient Mesopotamia ('Land Between the Rivers'), watered by the Tigris and Euphrates rivers.",
      "Has a narrow 58-km coastline on the northern tip of the Persian Gulf via the Shatt al-Arab waterway.",
      "Cradle of Sumerian, Akkadian, Babylonian, and Assyrian civilizations, where writing (cuneiform) and the wheel emerged.",
      "Baghdad was the intellectual center of the Islamic Golden Age during the Abbasid Caliphate.",
      "Capital: Baghdad · Population: ~45.5M · Currency: Iraqi dinar (IQD)"
    ],
    "neighbors": [
      "Iran",
      "Türkiye",
      "Syria",
      "Jordan",
      "Saudi Arabia",
      "Kuwait"
    ]
  },
  {
    "id": "country-quiz-79-saudi-arabia",
    "country": "Saudi Arabia",
    "name": "Saudi Arabia",
    "isoCode": "SA",
    "flag": "saudi-arabia",
    "flagUrl": "/flags/saudi-arabia.svg",
    "flagEmoji": "🇸🇦",
    "capital": "Riyadh",
    "zone": "asia",
    "subregion": "Western Asia",
    "population": "36.9M",
    "currency": "Saudi riyal (SAR)",
    "languages": [
      "Arabic"
    ],
    "lat": 23.9,
    "lng": 45.1,
    "difficulty": "easy",
    "tier": 1,
    "hint": "Occupies about four-fifths of the Arabian Peninsula, bordered by the Red Sea to the west and Persian Gulf to the east.",
    "clues": [
      "Occupies about four-fifths of the Arabian Peninsula, bordered by the Red Sea to the west and Persian Gulf to the east.",
      "Contains the Rub' al Khali ('Empty Quarter'), the largest contiguous sand desert in the world.",
      "Birthplace of Islam and custodian of its two holiest cities, Mecca and Medina; also home to Nabataean Hegra (Al-Ula).",
      "The largest country in the world without a single permanent natural river.",
      "Capital: Riyadh · Population: ~36.9M · Currency: Saudi riyal (SAR)"
    ],
    "neighbors": [
      "Jordan",
      "Iraq",
      "Kuwait",
      "Qatar",
      "United Arab Emirates",
      "Oman",
      "Yemen"
    ]
  },
  {
    "id": "country-quiz-80-united-arab-emirates",
    "country": "United Arab Emirates",
    "name": "United Arab Emirates",
    "isoCode": "AE",
    "flag": "united-arab-emirates",
    "flagUrl": "/flags/united-arab-emirates.svg",
    "flagEmoji": "🇦🇪",
    "capital": "Abu Dhabi",
    "zone": "asia",
    "subregion": "Western Asia",
    "population": "9.5M",
    "currency": "UAE dirham (AED)",
    "languages": [
      "Arabic"
    ],
    "lat": 23.4,
    "lng": 53.8,
    "difficulty": "easy",
    "tier": 1,
    "hint": "Federation of seven emirates along the southeastern coast of the Persian Gulf and Gulf of Oman.",
    "clues": [
      "Federation of seven emirates along the southeastern coast of the Persian Gulf and Gulf of Oman.",
      "Dubai and Abu Dhabi are the two largest emirates by population and economic weight.",
      "Home to the Burj Khalifa (world's tallest building at 828 m), Palm Jumeirah, and Sheikh Zayed Grand Mosque.",
      "While Dubai is the most populous city, Abu Dhabi is the federal capital and largest emirate by area.",
      "Capital: Abu Dhabi · Population: ~9.5M · Currency: UAE dirham (AED)"
    ],
    "neighbors": [
      "Saudi Arabia",
      "Oman"
    ]
  },
  {
    "id": "country-quiz-81-qatar",
    "country": "Qatar",
    "name": "Qatar",
    "isoCode": "QA",
    "flag": "qatar",
    "flagUrl": "/flags/qatar.svg",
    "flagEmoji": "🇶🇦",
    "capital": "Doha",
    "zone": "asia",
    "subregion": "Western Asia",
    "population": "2.7M",
    "currency": "Qatari riyal (QAR)",
    "languages": [
      "Arabic"
    ],
    "lat": 25.3,
    "lng": 51.2,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Thumb-shaped desert peninsula jutting northward from Arabia into the Persian Gulf.",
    "clues": [
      "Thumb-shaped desert peninsula jutting northward from Arabia into the Persian Gulf.",
      "Shares its sole land border at the southern base of the peninsula with Saudi Arabia.",
      "Possesses the world's third-largest natural gas reserves (North Field) and hosted the 2022 FIFA World Cup.",
      "Home to Al Jazeera, Qatar Airways, and the I.M. Pei-designed Museum of Islamic Art in Doha.",
      "Capital: Doha · Population: ~2.7M · Currency: Qatari riyal (QAR)"
    ],
    "neighbors": [
      "Saudi Arabia"
    ]
  },
  {
    "id": "country-quiz-82-kuwait",
    "country": "Kuwait",
    "name": "Kuwait",
    "isoCode": "KW",
    "flag": "kuwait",
    "flagUrl": "/flags/kuwait.svg",
    "flagEmoji": "🇰🇼",
    "capital": "Kuwait City",
    "zone": "asia",
    "subregion": "Western Asia",
    "population": "4.3M",
    "currency": "Kuwaiti dinar (KWD)",
    "languages": [
      "Arabic"
    ],
    "lat": 29.3,
    "lng": 47.5,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Compact oil-rich emirate at the northwestern tip of the Persian Gulf between Iraq and Saudi Arabia.",
    "clues": [
      "Compact oil-rich emirate at the northwestern tip of the Persian Gulf between Iraq and Saudi Arabia.",
      "Centered around Kuwait Bay, a deep natural harbor in the desert.",
      "Its currency, the Kuwaiti dinar, is the highest-valued currency unit per face value in the world.",
      "Iconic for the striped blue spheres of the Kuwait Towers along the Persian Gulf waterfront.",
      "Capital: Kuwait City · Population: ~4.3M · Currency: Kuwaiti dinar (KWD)"
    ],
    "neighbors": [
      "Iraq",
      "Saudi Arabia"
    ]
  },
  {
    "id": "country-quiz-83-bahrain",
    "country": "Bahrain",
    "name": "Bahrain",
    "isoCode": "BH",
    "flag": "bahrain",
    "flagUrl": "/flags/bahrain.svg",
    "flagEmoji": "🇧🇭",
    "capital": "Manama",
    "zone": "asia",
    "subregion": "Western Asia",
    "population": "1.5M",
    "currency": "Bahraini dinar (BHD)",
    "languages": [
      "Arabic"
    ],
    "lat": 26,
    "lng": 50.6,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Archipelago of 50 natural and 33 artificial islands in the Persian Gulf off the eastern coast of Saudi Arabia.",
    "clues": [
      "Archipelago of 50 natural and 33 artificial islands in the Persian Gulf off the eastern coast of Saudi Arabia.",
      "Connected to Saudi Arabia via the 25-km King Fahd Causeway.",
      "Center of the ancient Dilmun civilization and historic pearl diving; hosts the Bahrain Formula 1 Grand Prix.",
      "Smallest country by land area in the Middle East.",
      "Capital: Manama · Population: ~1.5M · Currency: Bahraini dinar (BHD)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-84-oman",
    "country": "Oman",
    "name": "Oman",
    "isoCode": "OM",
    "flag": "oman",
    "flagUrl": "/flags/oman.svg",
    "flagEmoji": "🇴🇲",
    "capital": "Muscat",
    "zone": "asia",
    "subregion": "Western Asia",
    "population": "5.1M",
    "currency": "Omani rial (OMR)",
    "languages": [
      "Arabic"
    ],
    "lat": 21.5,
    "lng": 55.9,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Occupies the southeastern coast of the Arabian Peninsula along the Arabian Sea and Gulf of Oman.",
    "clues": [
      "Occupies the southeastern coast of the Arabian Peninsula along the Arabian Sea and Gulf of Oman.",
      "Includes the strategic Musandam exclave guarding the Strait of Hormuz, separated by UAE territory.",
      "Oldest continuously independent state in the Arab world, famous for the Hajar Mountains, wadis, and frankincense in Dhofar.",
      "Its capital Muscat is known for whitewashed low-rise architecture and the Sultan Qaboos Grand Mosque.",
      "Capital: Muscat · Population: ~5.1M · Currency: Omani rial (OMR)"
    ],
    "neighbors": [
      "United Arab Emirates",
      "Saudi Arabia",
      "Yemen"
    ]
  },
  {
    "id": "country-quiz-85-yemen",
    "country": "Yemen",
    "name": "Yemen",
    "isoCode": "YE",
    "flag": "yemen",
    "flagUrl": "/flags/yemen.svg",
    "flagEmoji": "🇾🇪",
    "capital": "Sanaa",
    "zone": "asia",
    "subregion": "Western Asia",
    "population": "34.4M",
    "currency": "Yemeni rial (YER)",
    "languages": [
      "Arabic"
    ],
    "lat": 15.6,
    "lng": 48.5,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Occupies the southwestern corner of the Arabian Peninsula at the Bab-el-Mandeb strait linking the Red Sea and Gulf of Aden.",
    "clues": [
      "Occupies the southwestern corner of the Arabian Peninsula at the Bab-el-Mandeb strait linking the Red Sea and Gulf of Aden.",
      "Includes the UNESCO island of Socotra, famous for its alien-looking Dragon's Blood Trees.",
      "Known in antiquity as Arabia Felix ('Fortunate Arabia'); famed for the mud-brick skyscrapers of Shibam and Old Sanaa.",
      "Gave its port name Mocha (Al-Mokha) to the global coffee trade.",
      "Capital: Sanaa · Population: ~34.4M · Currency: Yemeni rial (YER)"
    ],
    "neighbors": [
      "Saudi Arabia",
      "Oman"
    ]
  },
  {
    "id": "country-quiz-86-jordan",
    "country": "Jordan",
    "name": "Jordan",
    "isoCode": "JO",
    "flag": "jordan",
    "flagUrl": "/flags/jordan.svg",
    "flagEmoji": "🇯🇴",
    "capital": "Amman",
    "zone": "asia",
    "subregion": "Western Asia",
    "population": "11.3M",
    "currency": "Jordanian dinar (JOD)",
    "languages": [
      "Arabic"
    ],
    "lat": 30.6,
    "lng": 36.2,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Levantine kingdom on the East Bank of the Jordan River, with a short 26-km Red Sea coastline at Aqaba.",
    "clues": [
      "Levantine kingdom on the East Bank of the Jordan River, with a short 26-km Red Sea coastline at Aqaba.",
      "Shares the Dead Sea—the lowest land elevation on Earth (-430 m)—with Israel and the West Bank.",
      "Home to the rose-red Nabataean rock-cut city of Petra (a New7Wonder) and the desert Mars-like valleys of Wadi Rum.",
      "Amman, built across hilly jabals, was known in Greco-Roman antiquity as Philadelphia.",
      "Capital: Amman · Population: ~11.3M · Currency: Jordanian dinar (JOD)"
    ],
    "neighbors": [
      "Syria",
      "Iraq",
      "Saudi Arabia",
      "Israel",
      "Palestine"
    ]
  },
  {
    "id": "country-quiz-87-israel",
    "country": "Israel",
    "name": "Israel",
    "isoCode": "IL",
    "flag": "israel",
    "flagUrl": "/flags/israel.svg",
    "flagEmoji": "🇮🇱",
    "capital": "Jerusalem",
    "zone": "asia",
    "subregion": "Western Asia",
    "population": "9.8M",
    "currency": "Israeli new shekel (ILS)",
    "languages": [
      "Hebrew",
      "Arabic"
    ],
    "lat": 31,
    "lng": 34.9,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Levantine nation along the southeastern coast of the Mediterranean Sea with a southern tip on the Red Sea at Eilat.",
    "clues": [
      "Levantine nation along the southeastern coast of the Mediterranean Sea with a southern tip on the Red Sea at Eilat.",
      "Stretches from the Sea of Galilee and Jordan Rift Valley in the north across the Negev Desert in the south.",
      "Contains sacred sites of Judaism, Christianity, and Islam, alongside the Bauhaus tech hub of Tel Aviv.",
      "Pioneered desert drip irrigation and seawater desalination.",
      "Capital: Jerusalem · Population: ~9.8M · Currency: Israeli new shekel (ILS)"
    ],
    "neighbors": [
      "Lebanon",
      "Syria",
      "Jordan",
      "Palestine",
      "Egypt"
    ]
  },
  {
    "id": "country-quiz-88-palestine",
    "country": "Palestine",
    "name": "Palestine",
    "isoCode": "PS",
    "flag": "palestine",
    "flagUrl": "/flags/palestine.svg",
    "flagEmoji": "🇵🇸",
    "capital": "Ramallah",
    "zone": "asia",
    "subregion": "Western Asia",
    "population": "5.4M",
    "currency": "Israeli new shekel / Jordanian dinar",
    "languages": [
      "Arabic"
    ],
    "lat": 31.9,
    "lng": 35.2,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Levantine polity comprising the West Bank (between the Jordan River and Dead Sea) and the Mediterranean Gaza Strip.",
    "clues": [
      "Levantine polity comprising the West Bank (between the Jordan River and Dead Sea) and the Mediterranean Gaza Strip.",
      "Includes historic cities of Bethlehem (Church of the Nativity), Jericho (one of the oldest inhabited cities), and Hebron.",
      "Claims East Jerusalem as its capital while administrative institutions operate from Ramallah.",
      "Renowned for centuries-old olive groves, tatreez embroidery, and terraced hills.",
      "Capital: Ramallah · Population: ~5.4M · Currency: Israeli new shekel / Jordanian dinar"
    ],
    "neighbors": [
      "Israel",
      "Jordan",
      "Egypt"
    ]
  },
  {
    "id": "country-quiz-89-lebanon",
    "country": "Lebanon",
    "name": "Lebanon",
    "isoCode": "LB",
    "flag": "lebanon",
    "flagUrl": "/flags/lebanon.svg",
    "flagEmoji": "🇱🇧",
    "capital": "Beirut",
    "zone": "asia",
    "subregion": "Western Asia",
    "population": "5.4M",
    "currency": "Lebanese pound (LBP)",
    "languages": [
      "Arabic"
    ],
    "lat": 33.9,
    "lng": 35.9,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Narrow mountainous country on the eastern shore of the Mediterranean Sea, framed by the Mount Lebanon and Anti-Lebanon ranges.",
    "clues": [
      "Narrow mountainous country on the eastern shore of the Mediterranean Sea, framed by the Mount Lebanon and Anti-Lebanon ranges.",
      "Homeland of the ancient seafaring Phoenicians (Byblos, Tyre, Sidon) who spread the phonetic alphabet across the Mediterranean.",
      "Its flag features the iconic green Lebanon Cedar tree in the center.",
      "Home to the colossal Roman temple ruins of Baalbek in the fertile Beqaa Valley.",
      "Capital: Beirut · Population: ~5.4M · Currency: Lebanese pound (LBP)"
    ],
    "neighbors": [
      "Syria",
      "Israel"
    ]
  },
  {
    "id": "country-quiz-90-syria",
    "country": "Syria",
    "name": "Syria",
    "isoCode": "SY",
    "flag": "syria",
    "flagUrl": "/flags/syria.svg",
    "flagEmoji": "🇸🇾",
    "capital": "Damascus",
    "zone": "asia",
    "subregion": "Western Asia",
    "population": "23.2M",
    "currency": "Syrian pound (SYP)",
    "languages": [
      "Arabic"
    ],
    "lat": 34.8,
    "lng": 39,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Levantine country stretching from the Mediterranean coast across the Euphrates River valley and Syrian Desert.",
    "clues": [
      "Levantine country stretching from the Mediterranean coast across the Euphrates River valley and Syrian Desert.",
      "Damascus and Aleppo rank among the oldest continuously inhabited cities in human history.",
      "Home to the desert oasis ruins of Palmyra and the medieval Crusader castle Krak des Chevaliers.",
      "Borders Türkiye, Iraq, Jordan, Israel, and Lebanon.",
      "Capital: Damascus · Population: ~23.2M · Currency: Syrian pound (SYP)"
    ],
    "neighbors": [
      "Türkiye",
      "Iraq",
      "Jordan",
      "Israel",
      "Lebanon"
    ]
  },
  {
    "id": "country-quiz-91-georgia",
    "country": "Georgia",
    "name": "Georgia",
    "isoCode": "GE",
    "flag": "georgia",
    "flagUrl": "/flags/georgia.svg",
    "flagEmoji": "🇬🇪",
    "capital": "Tbilisi",
    "zone": "asia",
    "subregion": "Caucasus",
    "population": "3.7M",
    "currency": "Georgian lari (GEL)",
    "languages": [
      "Georgian"
    ],
    "lat": 42.3,
    "lng": 43.4,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Transcaucasian nation between the Greater Caucasus mountain range and the eastern shore of the Black Sea.",
    "clues": [
      "Transcaucasian nation between the Greater Caucasus mountain range and the eastern shore of the Black Sea.",
      "Has its own unique 33-letter alphabet (Mkhedruli) and an 8,000-year-old clay-vessel (qvevri) winemaking tradition.",
      "Home to high-altitude medieval stone defensive towers in Ushguli (Svaneti) and sulfur baths in Tbilisi.",
      "In Greek mythology, its western region of Colchis was the destination of Jason and the Argonauts seeking the Golden Fleece.",
      "Capital: Tbilisi · Population: ~3.7M · Currency: Georgian lari (GEL)"
    ],
    "neighbors": [
      "Russia",
      "Azerbaijan",
      "Armenia",
      "Türkiye"
    ]
  },
  {
    "id": "country-quiz-92-armenia",
    "country": "Armenia",
    "name": "Armenia",
    "isoCode": "AM",
    "flag": "armenia",
    "flagUrl": "/flags/armenia.svg",
    "flagEmoji": "🇦🇲",
    "capital": "Yerevan",
    "zone": "asia",
    "subregion": "Caucasus",
    "population": "3.0M",
    "currency": "Armenian dram (AMD)",
    "languages": [
      "Armenian"
    ],
    "lat": 40.1,
    "lng": 45,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Landlocked highland nation in the South Caucasus centered around alpine Lake Sevan.",
    "clues": [
      "Landlocked highland nation in the South Caucasus centered around alpine Lake Sevan.",
      "In 301 AD, it became the first state in the world to adopt Christianity as its official state religion.",
      "Uses a unique alphabet created by Mesrop Mashtots in 405 AD; Yerevan is known as the 'Pink City' for its volcanic tuff stone.",
      "Overlooks snow-capped Mount Ararat (just across the closed western border in Türkiye), its national symbol.",
      "Capital: Yerevan · Population: ~3.0M · Currency: Armenian dram (AMD)"
    ],
    "neighbors": [
      "Georgia",
      "Azerbaijan",
      "Iran",
      "Türkiye"
    ]
  },
  {
    "id": "country-quiz-93-azerbaijan",
    "country": "Azerbaijan",
    "name": "Azerbaijan",
    "isoCode": "AZ",
    "flag": "azerbaijan",
    "flagUrl": "/flags/azerbaijan.svg",
    "flagEmoji": "🇦🇿",
    "capital": "Baku",
    "zone": "asia",
    "subregion": "Caucasus",
    "population": "10.1M",
    "currency": "Azerbaijani manat (AZN)",
    "languages": [
      "Azerbaijani"
    ],
    "lat": 40.1,
    "lng": 47.6,
    "difficulty": "hard",
    "tier": 3,
    "hint": "South Caucasus nation along the western shore of the Caspian Sea, including the Nakhchivan exclave.",
    "clues": [
      "South Caucasus nation along the western shore of the Caspian Sea, including the Nakhchivan exclave.",
      "Known as the 'Land of Fire' due to natural subterranean gas vents (like Yanar Dag) and mud volcanoes.",
      "Its capital Baku sits 28 meters below sea level—the lowest-lying national capital in the world—and features the Flame Towers.",
      "One of the birthplaces of the modern petroleum industry in the late 19th century.",
      "Capital: Baku · Population: ~10.1M · Currency: Azerbaijani manat (AZN)"
    ],
    "neighbors": [
      "Russia",
      "Georgia",
      "Armenia",
      "Iran",
      "Türkiye"
    ]
  },
  {
    "id": "country-quiz-94-united-states",
    "country": "United States",
    "name": "United States",
    "isoCode": "US",
    "flag": "united-states",
    "flagUrl": "/flags/united-states.svg",
    "flagEmoji": "🇺🇸",
    "capital": "Washington, D.C.",
    "zone": "americas",
    "subregion": "North America",
    "population": "335.0M",
    "currency": "United States dollar (USD)",
    "languages": [
      "English"
    ],
    "lat": 39.8,
    "lng": -98.6,
    "difficulty": "easy",
    "tier": 1,
    "hint": "Federal republic of 50 states spanning North America from the Atlantic to the Pacific, plus Alaska and Hawaii.",
    "clues": [
      "Federal republic of 50 states spanning North America from the Atlantic to the Pacific, plus Alaska and Hawaii.",
      "Features the Rocky Mountains, Appalachian range, Great Lakes, Mississippi-Missouri river system, and Grand Canyon.",
      "World's largest economy by nominal GDP; home to New York City, Hollywood, Silicon Valley, and Yellowstone.",
      "Shares the world's longest international land border (8,891 km) with Canada to the north and borders Mexico to the south.",
      "Capital: Washington, D.C. · Population: ~335.0M · Currency: United States dollar (USD)"
    ],
    "neighbors": [
      "Canada",
      "Mexico"
    ]
  },
  {
    "id": "country-quiz-95-canada",
    "country": "Canada",
    "name": "Canada",
    "isoCode": "CA",
    "flag": "canada",
    "flagUrl": "/flags/canada.svg",
    "flagEmoji": "🇨🇦",
    "capital": "Ottawa",
    "zone": "americas",
    "subregion": "North America",
    "population": "40.5M",
    "currency": "Canadian dollar (CAD)",
    "languages": [
      "English",
      "French"
    ],
    "lat": 56.1,
    "lng": -106.3,
    "difficulty": "easy",
    "tier": 1,
    "hint": "World's second-largest country by total area, touching three oceans: Atlantic, Pacific, and Arctic.",
    "clues": [
      "World's second-largest country by total area, touching three oceans: Atlantic, Pacific, and Arctic.",
      "Contains more lakes than the rest of the world combined and the longest coastline of any nation (243,042 km).",
      "Divided into 10 provinces and 3 territories; famous for Niagara Falls, Banff in the Rockies, maple syrup, and ice hockey.",
      "Its bilingual federal capital Ottawa sits on the Ottawa River between Toronto and Montreal.",
      "Capital: Ottawa · Population: ~40.5M · Currency: Canadian dollar (CAD)"
    ],
    "neighbors": [
      "United States"
    ]
  },
  {
    "id": "country-quiz-96-mexico",
    "country": "Mexico",
    "name": "Mexico",
    "isoCode": "MX",
    "flag": "mexico",
    "flagUrl": "/flags/mexico.svg",
    "flagEmoji": "🇲🇽",
    "capital": "Mexico City",
    "zone": "americas",
    "subregion": "North America",
    "population": "129.0M",
    "currency": "Mexican peso (MXN)",
    "languages": [
      "Spanish"
    ],
    "lat": 23.6,
    "lng": -102.6,
    "difficulty": "easy",
    "tier": 1,
    "hint": "Southernmost country of North America, bounded by the Pacific Ocean, Gulf of Mexico, and Caribbean Sea.",
    "clues": [
      "Southernmost country of North America, bounded by the Pacific Ocean, Gulf of Mexico, and Caribbean Sea.",
      "Includes the Baja California and Yucatán peninsulas, crossed by the Sierra Madre mountain ranges.",
      "Cradle of Olmec, Maya (Chichén Itzá), and Aztec (Tenochtitlan) civilizations; world's most populous Spanish-speaking country.",
      "Originated cacao (chocolate), maize (corn), chili peppers, avocados, and tomatoes.",
      "Capital: Mexico City · Population: ~129.0M · Currency: Mexican peso (MXN)"
    ],
    "neighbors": [
      "United States",
      "Guatemala",
      "Belize"
    ]
  },
  {
    "id": "country-quiz-97-brazil",
    "country": "Brazil",
    "name": "Brazil",
    "isoCode": "BR",
    "flag": "brazil",
    "flagUrl": "/flags/brazil.svg",
    "flagEmoji": "🇧🇷",
    "capital": "Brasília",
    "zone": "americas",
    "subregion": "South America",
    "population": "203.1M",
    "currency": "Brazilian real (BRL)",
    "languages": [
      "Portuguese"
    ],
    "lat": -14.2,
    "lng": -51.9,
    "difficulty": "easy",
    "tier": 1,
    "hint": "Largest country in South America and fifth-largest in the world, covering nearly half the continent.",
    "clues": [
      "Largest country in South America and fifth-largest in the world, covering nearly half the continent.",
      "Contains 60% of the Amazon Rainforest and the Amazon River (world's largest river by water discharge), plus the Pantanal wetlands.",
      "The only Portuguese-speaking nation in the Americas; famous for Rio's Christ the Redeemer, Carnival, and 5 FIFA World Cup titles.",
      "Borders every single South American country except Chile and Ecuador; moved its capital from Rio to modernist Brasília in 1960.",
      "Capital: Brasília · Population: ~203.1M · Currency: Brazilian real (BRL)"
    ],
    "neighbors": [
      "Argentina",
      "Uruguay",
      "Paraguay",
      "Bolivia",
      "Peru",
      "Colombia",
      "Venezuela",
      "Guyana",
      "Suriname",
      "French Guiana"
    ]
  },
  {
    "id": "country-quiz-98-argentina",
    "country": "Argentina",
    "name": "Argentina",
    "isoCode": "AR",
    "flag": "argentina",
    "flagUrl": "/flags/argentina.svg",
    "flagEmoji": "🇦🇷",
    "capital": "Buenos Aires",
    "zone": "americas",
    "subregion": "South America",
    "population": "46.6M",
    "currency": "Argentine peso (ARS)",
    "languages": [
      "Spanish"
    ],
    "lat": -38.4,
    "lng": -63.6,
    "difficulty": "easy",
    "tier": 1,
    "hint": "Eighth-largest country in the world, stretching 3,650 km from subtropical Iguazu Falls across the Pampas to Tierra del Fuego.",
    "clues": [
      "Eighth-largest country in the world, stretching 3,650 km from subtropical Iguazu Falls across the Pampas to Tierra del Fuego.",
      "Contains both the highest peak in the Western Hemisphere (Aconcagua, 6,961 m) and its lowest point (Laguna del Carbón).",
      "Famous for tango in Buenos Aires, gaucho steak and Malbec wine in Mendoza, Patagonia's Perito Moreno Glacier, and Lionel Messi.",
      "Ushuaia on the Beagle Channel is widely regarded as the world's southernmost city.",
      "Capital: Buenos Aires · Population: ~46.6M · Currency: Argentine peso (ARS)"
    ],
    "neighbors": [
      "Chile",
      "Bolivia",
      "Paraguay",
      "Brazil",
      "Uruguay"
    ]
  },
  {
    "id": "country-quiz-99-chile",
    "country": "Chile",
    "name": "Chile",
    "isoCode": "CL",
    "flag": "chile",
    "flagUrl": "/flags/chile.svg",
    "flagEmoji": "🇨🇱",
    "capital": "Santiago",
    "zone": "americas",
    "subregion": "South America",
    "population": "19.6M",
    "currency": "Chilean peso (CLP)",
    "languages": [
      "Spanish"
    ],
    "lat": -35.7,
    "lng": -71.5,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Ribbon-like country averaging just 177 km wide but stretching 4,300 km between the Andes crest and the Pacific Ocean.",
    "clues": [
      "Ribbon-like country averaging just 177 km wide but stretching 4,300 km between the Andes crest and the Pacific Ocean.",
      "Spans from the hyper-arid Atacama Desert (driest non-polar desert on Earth) in the north to Patagonian fjords in the south.",
      "Includes Polynesian Easter Island (Rapa Nui) with its stone Moai statues 3,500 km offshore in the Pacific.",
      "World's largest producer of copper and home to major astronomical observatories.",
      "Capital: Santiago · Population: ~19.6M · Currency: Chilean peso (CLP)"
    ],
    "neighbors": [
      "Peru",
      "Bolivia",
      "Argentina"
    ]
  },
  {
    "id": "country-quiz-100-peru",
    "country": "Peru",
    "name": "Peru",
    "isoCode": "PE",
    "flag": "peru",
    "flagUrl": "/flags/peru.svg",
    "flagEmoji": "🇵🇪",
    "capital": "Lima",
    "zone": "americas",
    "subregion": "South America",
    "population": "34.4M",
    "currency": "Peruvian sol (PEN)",
    "languages": [
      "Spanish",
      "Quechua",
      "Aymara"
    ],
    "lat": -9.2,
    "lng": -75,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Andean South American nation comprising three distinct zones: arid Pacific coast, high Andes mountains, and Amazon jungle.",
    "clues": [
      "Andean South American nation comprising three distinct zones: arid Pacific coast, high Andes mountains, and Amazon jungle.",
      "Heartland of the Inca Empire (centered at Cusco) and Machu Picchu, plus the mysterious geoglyphs of the Nazca Lines.",
      "The headwaters of the Amazon River rise in its southern Andes before flowing past Iquitos.",
      "Shares Lake Titicaca—the world's highest navigable lake—with neighboring Bolivia.",
      "Capital: Lima · Population: ~34.4M · Currency: Peruvian sol (PEN)"
    ],
    "neighbors": [
      "Ecuador",
      "Colombia",
      "Brazil",
      "Bolivia",
      "Chile"
    ]
  },
  {
    "id": "country-quiz-101-colombia",
    "country": "Colombia",
    "name": "Colombia",
    "isoCode": "CO",
    "flag": "colombia",
    "flagUrl": "/flags/colombia.svg",
    "flagEmoji": "🇨🇴",
    "capital": "Bogotá",
    "zone": "americas",
    "subregion": "South America",
    "population": "52.2M",
    "currency": "Colombian peso (COP)",
    "languages": [
      "Spanish"
    ],
    "lat": 4.6,
    "lng": -74.3,
    "difficulty": "medium",
    "tier": 2,
    "hint": "The only South American country with coastlines on both the Pacific Ocean and the Caribbean Sea.",
    "clues": [
      "The only South American country with coastlines on both the Pacific Ocean and the Caribbean Sea.",
      "Here the Andes split into three parallel ranges (Cordillera Occidental, Central, and Oriental); joins Panama at the Darién Gap.",
      "Second most biodiverse country on Earth and the world's #1 in bird and orchid species; famed for emeralds, coffee, and Cartagena.",
      "Its capital Bogotá sits at 2,640 meters elevation on a high Andean plateau.",
      "Capital: Bogotá · Population: ~52.2M · Currency: Colombian peso (COP)"
    ],
    "neighbors": [
      "Panama",
      "Venezuela",
      "Brazil",
      "Peru",
      "Ecuador"
    ]
  },
  {
    "id": "country-quiz-102-venezuela",
    "country": "Venezuela",
    "name": "Venezuela",
    "isoCode": "VE",
    "flag": "venezuela",
    "flagUrl": "/flags/venezuela.svg",
    "flagEmoji": "🇻🇪",
    "capital": "Caracas",
    "zone": "americas",
    "subregion": "South America",
    "population": "28.8M",
    "currency": "Venezuelan bolívar (VES)",
    "languages": [
      "Spanish"
    ],
    "lat": 6.4,
    "lng": -66.6,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Northern South American nation on the Caribbean Sea featuring the Orinoco River basin and flat-topped tepui mountains.",
    "clues": [
      "Northern South American nation on the Caribbean Sea featuring the Orinoco River basin and flat-topped tepui mountains.",
      "Home to Angel Falls (Kerepakupai Merú), the world's highest uninterrupted waterfall at 979 meters.",
      "Contains Lake Maracaibo (famed for relentless Catatumbo lightning) and the world's largest proven crude oil reserves.",
      "Birthplace of Simón Bolívar ('El Libertador') in Caracas.",
      "Capital: Caracas · Population: ~28.8M · Currency: Venezuelan bolívar (VES)"
    ],
    "neighbors": [
      "Colombia",
      "Brazil",
      "Guyana"
    ]
  },
  {
    "id": "country-quiz-103-ecuador",
    "country": "Ecuador",
    "name": "Ecuador",
    "isoCode": "EC",
    "flag": "ecuador",
    "flagUrl": "/flags/ecuador.svg",
    "flagEmoji": "🇪🇨",
    "capital": "Quito",
    "zone": "americas",
    "subregion": "South America",
    "population": "18.2M",
    "currency": "United States dollar (USD)",
    "languages": [
      "Spanish"
    ],
    "lat": -1.8,
    "lng": -78.2,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Andean country on South America's northwest Pacific coast named directly after the Equator, which crosses just north of its capital.",
    "clues": [
      "Andean country on South America's northwest Pacific coast named directly after the Equator, which crosses just north of its capital.",
      "Includes the volcanic Galápagos Islands 1,000 km offshore, which inspired Charles Darwin's theory of evolution.",
      "Mount Chimborazo's summit is the farthest point from the center of the Earth due to the planet's equatorial bulge.",
      "Adopted the US dollar as its official currency in 2000; Quito is the closest capital to the Equator.",
      "Capital: Quito · Population: ~18.2M · Currency: United States dollar (USD)"
    ],
    "neighbors": [
      "Colombia",
      "Peru"
    ]
  },
  {
    "id": "country-quiz-104-bolivia",
    "country": "Bolivia",
    "name": "Bolivia",
    "isoCode": "BO",
    "flag": "bolivia",
    "flagUrl": "/flags/bolivia.svg",
    "flagEmoji": "🇧🇴",
    "capital": "La Paz",
    "zone": "americas",
    "subregion": "South America",
    "population": "12.4M",
    "currency": "Bolivian boliviano (BOB)",
    "languages": [
      "Spanish",
      "Quechua",
      "Aymara"
    ],
    "lat": -16.3,
    "lng": -63.6,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Landlocked South American nation spanning the high Andean Altiplano plateau and eastern Amazonian lowlands.",
    "clues": [
      "Landlocked South American nation spanning the high Andean Altiplano plateau and eastern Amazonian lowlands.",
      "Home to Salar de Uyuni, the world's largest salt flat (10,582 km²) and a massive lithium reserve.",
      "Has two capitals: Sucre is the constitutional/judicial capital, while La Paz (at 3,640 m) is the highest seat of government on Earth.",
      "Lost its Pacific coastline to Chile in the 19th-century War of the Pacific.",
      "Capital: La Paz · Population: ~12.4M · Currency: Bolivian boliviano (BOB)"
    ],
    "neighbors": [
      "Peru",
      "Chile",
      "Argentina",
      "Paraguay",
      "Brazil"
    ]
  },
  {
    "id": "country-quiz-105-paraguay",
    "country": "Paraguay",
    "name": "Paraguay",
    "isoCode": "PY",
    "flag": "paraguay",
    "flagUrl": "/flags/paraguay.svg",
    "flagEmoji": "🇵🇾",
    "capital": "Asunción",
    "zone": "americas",
    "subregion": "South America",
    "population": "6.8M",
    "currency": "Paraguayan guaraní (PYG)",
    "languages": [
      "Spanish",
      "Guaraní"
    ],
    "lat": -23.4,
    "lng": -58.4,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Landlocked South American nation divided by the Paraguay River into the eastern Paraná region and western Gran Chaco.",
    "clues": [
      "Landlocked South American nation divided by the Paraguay River into the eastern Paraná region and western Gran Chaco.",
      "One of only two landlocked countries in the Americas; famously bilingual where both Spanish and indigenous Guaraní are spoken by most citizens.",
      "Co-operates the massive Itaipu Dam on the Paraná River with Brazil, generating nearly 100% renewable hydroelectricity.",
      "Its flag is unique for having two different emblems on its obverse (front) and reverse (back) sides.",
      "Capital: Asunción · Population: ~6.8M · Currency: Paraguayan guaraní (PYG)"
    ],
    "neighbors": [
      "Argentina",
      "Brazil",
      "Bolivia"
    ]
  },
  {
    "id": "country-quiz-106-uruguay",
    "country": "Uruguay",
    "name": "Uruguay",
    "isoCode": "UY",
    "flag": "uruguay",
    "flagUrl": "/flags/uruguay.svg",
    "flagEmoji": "🇺🇾",
    "capital": "Montevideo",
    "zone": "americas",
    "subregion": "South America",
    "population": "3.4M",
    "currency": "Uruguayan peso (UYU)",
    "languages": [
      "Spanish"
    ],
    "lat": -32.5,
    "lng": -55.8,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Rolling pampas nation on the Atlantic coast wedged between the Río de la Plata estuary and Brazil.",
    "clues": [
      "Rolling pampas nation on the Atlantic coast wedged between the Río de la Plata estuary and Brazil.",
      "Second-smallest sovereign nation in South America (after Suriname), with half its population living in Montevideo.",
      "Hosted and won the very first FIFA World Cup in 1930 (and won again in 1950); renowned for mate tea and gaucho cattle ranches.",
      "Consistently ranks first in Latin America for democracy, low corruption, and renewable wind/hydro power.",
      "Capital: Montevideo · Population: ~3.4M · Currency: Uruguayan peso (UYU)"
    ],
    "neighbors": [
      "Argentina",
      "Brazil"
    ]
  },
  {
    "id": "country-quiz-107-guyana",
    "country": "Guyana",
    "name": "Guyana",
    "isoCode": "GY",
    "flag": "guyana",
    "flagUrl": "/flags/guyana.svg",
    "flagEmoji": "🇬🇾",
    "capital": "Georgetown",
    "zone": "americas",
    "subregion": "South America",
    "population": "810K",
    "currency": "Guyanese dollar (GYD)",
    "languages": [
      "English"
    ],
    "lat": 4.9,
    "lng": -58.9,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Located on the northern Atlantic shoulder of South America, covered over 80% by pristine tropical rainforest.",
    "clues": [
      "Located on the northern Atlantic shoulder of South America, covered over 80% by pristine tropical rainforest.",
      "The only South American nation in which English is the official language and a member of the Caribbean Community (CARICOM).",
      "Home to Kaieteur Falls on the Potaro River, one of the world's largest single-drop waterfalls by volume.",
      "Experiencing a massive offshore oil boom in the Stabroek Block since 2019.",
      "Capital: Georgetown · Population: ~810K · Currency: Guyanese dollar (GYD)"
    ],
    "neighbors": [
      "Venezuela",
      "Brazil",
      "Suriname"
    ]
  },
  {
    "id": "country-quiz-108-suriname",
    "country": "Suriname",
    "name": "Suriname",
    "isoCode": "SR",
    "flag": "suriname",
    "flagUrl": "/flags/suriname.svg",
    "flagEmoji": "🇸🇷",
    "capital": "Paramaribo",
    "zone": "americas",
    "subregion": "South America",
    "population": "620K",
    "currency": "Surinamese dollar (SRD)",
    "languages": [
      "Dutch"
    ],
    "lat": 3.9,
    "lng": -56,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Smallest sovereign country in South America by area and population, on the northeastern Atlantic coast.",
    "clues": [
      "Smallest sovereign country in South America by area and population, on the northeastern Atlantic coast.",
      "Formerly Dutch Guiana until independence in 1975; the only sovereign state outside Europe where Dutch is the sole official language.",
      "Over 90% of its land is covered in dense Amazonian rainforest, making it the most forested country on Earth.",
      "Its wooden colonial historic center in Paramaribo is a UNESCO World Heritage Site.",
      "Capital: Paramaribo · Population: ~620K · Currency: Surinamese dollar (SRD)"
    ],
    "neighbors": [
      "Guyana",
      "Brazil",
      "French Guiana"
    ]
  },
  {
    "id": "country-quiz-109-cuba",
    "country": "Cuba",
    "name": "Cuba",
    "isoCode": "CU",
    "flag": "cuba",
    "flagUrl": "/flags/cuba.svg",
    "flagEmoji": "🇨🇺",
    "capital": "Havana",
    "zone": "americas",
    "subregion": "Caribbean",
    "population": "11.1M",
    "currency": "Cuban peso (CUP)",
    "languages": [
      "Spanish"
    ],
    "lat": 21.5,
    "lng": -77.8,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Largest island nation in the Caribbean, situated at the confluence of the Gulf of Mexico, Atlantic Ocean, and Caribbean Sea.",
    "clues": [
      "Largest island nation in the Caribbean, situated at the confluence of the Gulf of Mexico, Atlantic Ocean, and Caribbean Sea.",
      "Shaped like a long alligator stretching 1,250 km from west to east.",
      "Famous for Old Havana's colorful colonial plazas, 1950s classic American cars, tobacco cigars in Viñales, and salsa/son music.",
      "Lies just 150 km south of Key West, Florida across the Straits of Florida.",
      "Capital: Havana · Population: ~11.1M · Currency: Cuban peso (CUP)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-110-jamaica",
    "country": "Jamaica",
    "name": "Jamaica",
    "isoCode": "JM",
    "flag": "jamaica",
    "flagUrl": "/flags/jamaica.svg",
    "flagEmoji": "🇯🇲",
    "capital": "Kingston",
    "zone": "americas",
    "subregion": "Caribbean",
    "population": "2.8M",
    "currency": "Jamaican dollar (JMD)",
    "languages": [
      "English"
    ],
    "lat": 18.1,
    "lng": -77.3,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Third-largest island of the Greater Antilles in the Caribbean Sea, crossed by the lush Blue Mountains.",
    "clues": [
      "Third-largest island of the Greater Antilles in the Caribbean Sea, crossed by the lush Blue Mountains.",
      "Global cultural powerhouse as the birthplace of reggae music (Bob Marley) and world-record sprinters (Usain Bolt).",
      "Its green, gold, and black flag is the only national flag in the world that contains no red, white, or blue.",
      "Famous for Blue Mountain coffee, Montego Bay, and jerk seasoning.",
      "Capital: Kingston · Population: ~2.8M · Currency: Jamaican dollar (JMD)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-111-dominican-republic",
    "country": "Dominican Republic",
    "name": "Dominican Republic",
    "isoCode": "DO",
    "flag": "dominican-republic",
    "flagUrl": "/flags/dominican-republic.svg",
    "flagEmoji": "🇩🇴",
    "capital": "Santo Domingo",
    "zone": "americas",
    "subregion": "Caribbean",
    "population": "11.3M",
    "currency": "Dominican peso (DOP)",
    "languages": [
      "Spanish"
    ],
    "lat": 18.7,
    "lng": -70.2,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Occupies the eastern five-eighths of the Caribbean island of Hispaniola, which it shares with Haiti.",
    "clues": [
      "Occupies the eastern five-eighths of the Caribbean island of Hispaniola, which it shares with Haiti.",
      "Contains both the highest peak in the Caribbean (Pico Duarte, 3,098 m) and the lowest point (Lake Enriquillo).",
      "Santo Domingo, founded in 1496, is the oldest continuously inhabited European-established settlement in the Americas.",
      "Famous for Punta Cana beaches, merengue and bachata music, and producing dozens of Major League Baseball stars.",
      "Capital: Santo Domingo · Population: ~11.3M · Currency: Dominican peso (DOP)"
    ],
    "neighbors": [
      "Haiti"
    ]
  },
  {
    "id": "country-quiz-112-haiti",
    "country": "Haiti",
    "name": "Haiti",
    "isoCode": "HT",
    "flag": "haiti",
    "flagUrl": "/flags/haiti.svg",
    "flagEmoji": "🇭🇹",
    "capital": "Port-au-Prince",
    "zone": "americas",
    "subregion": "Caribbean",
    "population": "11.7M",
    "currency": "Haitian gourde (HTG)",
    "languages": [
      "French",
      "Haitian Creole"
    ],
    "lat": 19,
    "lng": -72.3,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Occupies the mountainous western third of the Caribbean island of Hispaniola; its Taíno name Ayiti means 'Land of High Mountains'.",
    "clues": [
      "Occupies the mountainous western third of the Caribbean island of Hispaniola; its Taíno name Ayiti means 'Land of High Mountains'.",
      "In 1804, following a slave revolution led by Toussaint Louverture and Jean-Jacques Dessalines, it became the world's first Black republic.",
      "Second independent nation in the Western Hemisphere (after the United States) and the only independent francophone nation in the Caribbean.",
      "Home to the mountaintop fortress Citadelle Laferrière, the largest fortress in the Americas.",
      "Capital: Port-au-Prince · Population: ~11.7M · Currency: Haitian gourde (HTG)"
    ],
    "neighbors": [
      "Dominican Republic"
    ]
  },
  {
    "id": "country-quiz-113-bahamas",
    "country": "Bahamas",
    "name": "Bahamas",
    "isoCode": "BS",
    "flag": "bahamas",
    "flagUrl": "/flags/bahamas.svg",
    "flagEmoji": "🇧🇸",
    "capital": "Nassau",
    "zone": "americas",
    "subregion": "Caribbean / North Atlantic",
    "population": "410K",
    "currency": "Bahamian dollar (BSD)",
    "languages": [
      "English"
    ],
    "lat": 25,
    "lng": -77.4,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Lucayan archipelago of over 700 coral islands and 2,400 cays in the Atlantic Ocean north of Cuba and southeast of Florida.",
    "clues": [
      "Lucayan archipelago of over 700 coral islands and 2,400 cays in the Atlantic Ocean north of Cuba and southeast of Florida.",
      "Site of Christopher Columbus's first landfall in the New World in 1492 on the island of San Salvador (Guanahani).",
      "Its capital Nassau sits on New Providence Island, while Grand Bahama and Great Abaco lie to the north.",
      "Famous for crystal-clear turquoise banks, pink-sand beaches on Harbour Island, and swimming pigs in Exuma.",
      "Capital: Nassau · Population: ~410K · Currency: Bahamian dollar (BSD)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-114-trinidad-and-tobago",
    "country": "Trinidad and Tobago",
    "name": "Trinidad and Tobago",
    "isoCode": "TT",
    "flag": "trinidad-tobago",
    "flagUrl": "/flags/trinidad-tobago.svg",
    "flagEmoji": "🇹🇹",
    "capital": "Port of Spain",
    "zone": "americas",
    "subregion": "Caribbean",
    "population": "1.5M",
    "currency": "Trinidad and Tobago dollar (TTD)",
    "languages": [
      "English"
    ],
    "lat": 10.7,
    "lng": -61.2,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Southernmost island nation in the Caribbean, lying just 11 km off the northeastern coast of Venezuela.",
    "clues": [
      "Southernmost island nation in the Caribbean, lying just 11 km off the northeastern coast of Venezuela.",
      "Industrialized energy exporter (oil, LNG, and petrochemicals) and home to the Pitch Lake, the world's largest natural deposit of asphalt.",
      "Birthplace of the steelpan (the only acoustic musical instrument invented in the 20th century), calypso, soca, and the limbo dance.",
      "Celebrates one of the most vibrant pre-Lenten Carnivals in the world in Port of Spain.",
      "Capital: Port of Spain · Population: ~1.5M · Currency: Trinidad and Tobago dollar (TTD)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-115-barbados",
    "country": "Barbados",
    "name": "Barbados",
    "isoCode": "BB",
    "flag": "barbados",
    "flagUrl": "/flags/barbados.svg",
    "flagEmoji": "🇧🇧",
    "capital": "Bridgetown",
    "zone": "americas",
    "subregion": "Caribbean",
    "population": "282K",
    "currency": "Barbadian dollar (BBD)",
    "languages": [
      "English"
    ],
    "lat": 13.2,
    "lng": -59.5,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Coral-limestone island in the western Atlantic Ocean, lying 100 km east of the Windward Islands chain.",
    "clues": [
      "Coral-limestone island in the western Atlantic Ocean, lying 100 km east of the Windward Islands chain.",
      "Transitioned from a Commonwealth realm to the world's newest parliamentary republic in November 2021.",
      "Birthplace of global music icon Rihanna, commercial rum production (Mount Gay, 1703), and legendary West Indies cricketers.",
      "Its flag features a broken black trident on a gold band between two ultramarine stripes.",
      "Capital: Bridgetown · Population: ~282K · Currency: Barbadian dollar (BBD)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-116-guatemala",
    "country": "Guatemala",
    "name": "Guatemala",
    "isoCode": "GT",
    "flag": "guatemala",
    "flagUrl": "/flags/guatemala.svg",
    "flagEmoji": "🇬🇹",
    "capital": "Guatemala City",
    "zone": "americas",
    "subregion": "Central America",
    "population": "18.1M",
    "currency": "Guatemalan quetzal (GTQ)",
    "languages": [
      "Spanish"
    ],
    "lat": 15.8,
    "lng": -90.2,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Most populous country in Central America, bordered by Mexico, Belize, Honduras, and El Salvador with Pacific and Caribbean coasts.",
    "clues": [
      "Most populous country in Central America, bordered by Mexico, Belize, Honduras, and El Salvador with Pacific and Caribbean coasts.",
      "Heart of the ancient Maya civilization; home to the towering jungle pyramids of Tikal in the Petén basin.",
      "Features volcanic Lake Atitlán and the colonial Baroque city of Antigua Guatemala ringed by three volcanoes.",
      "Its currency and national emblem are named after the resplendent quetzal bird.",
      "Capital: Guatemala City · Population: ~18.1M · Currency: Guatemalan quetzal (GTQ)"
    ],
    "neighbors": [
      "Mexico",
      "Belize",
      "Honduras",
      "El Salvador"
    ]
  },
  {
    "id": "country-quiz-117-costa-rica",
    "country": "Costa Rica",
    "name": "Costa Rica",
    "isoCode": "CR",
    "flag": "costa-rica",
    "flagUrl": "/flags/costa-rica.svg",
    "flagEmoji": "🇨🇷",
    "capital": "San José",
    "zone": "americas",
    "subregion": "Central America",
    "population": "5.2M",
    "currency": "Costa Rican colón (CRC)",
    "languages": [
      "Spanish"
    ],
    "lat": 9.7,
    "lng": -83.8,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Central American republic between Nicaragua and Panama with coastlines on both the Caribbean Sea and Pacific Ocean.",
    "clues": [
      "Central American republic between Nicaragua and Panama with coastlines on both the Caribbean Sea and Pacific Ocean.",
      "Harbors roughly 5% of the world's total biodiversity despite covering only 0.03% of Earth's surface (Monteverde Cloud Forest, Arenal Volcano).",
      "Permanently abolished its standing military in 1948 to redirect funds into education, healthcare, and conservation.",
      "Known globally for its national motto and greeting 'Pura Vida' ('Pure Life').",
      "Capital: San José · Population: ~5.2M · Currency: Costa Rican colón (CRC)"
    ],
    "neighbors": [
      "Nicaragua",
      "Panama"
    ]
  },
  {
    "id": "country-quiz-118-panama",
    "country": "Panama",
    "name": "Panama",
    "isoCode": "PA",
    "flag": "panama",
    "flagUrl": "/flags/panama.svg",
    "flagEmoji": "🇵🇦",
    "capital": "Panama City",
    "zone": "americas",
    "subregion": "Central America",
    "population": "4.5M",
    "currency": "Panamanian balboa / US dollar",
    "languages": [
      "Spanish"
    ],
    "lat": 8.5,
    "lng": -80.8,
    "difficulty": "medium",
    "tier": 2,
    "hint": "S-shaped isthmus linking Central and South America, famous for the 82-km engineering marvel connecting the Atlantic and Pacific oceans.",
    "clues": [
      "S-shaped isthmus linking Central and South America, famous for the 82-km engineering marvel connecting the Atlantic and Pacific oceans.",
      "Because of the S-curve of the isthmus, the Pacific entrance of the Panama Canal is actually further east than the Atlantic entrance.",
      "Only place in the world where you can watch the sun rise on the Pacific and set on the Atlantic from the same mountain peak (Volcán Barú).",
      "Uses the US dollar alongside Balboa coins and has a dramatic skyscraper skyline bordering tropical rainforest.",
      "Capital: Panama City · Population: ~4.5M · Currency: Panamanian balboa / US dollar"
    ],
    "neighbors": [
      "Costa Rica",
      "Colombia"
    ]
  },
  {
    "id": "country-quiz-119-honduras",
    "country": "Honduras",
    "name": "Honduras",
    "isoCode": "HN",
    "flag": "honduras",
    "flagUrl": "/flags/honduras.svg",
    "flagEmoji": "🇭🇳",
    "capital": "Tegucigalpa",
    "zone": "americas",
    "subregion": "Central America",
    "population": "10.6M",
    "currency": "Honduran lempira (HNL)",
    "languages": [
      "Spanish"
    ],
    "lat": 15.2,
    "lng": -86.2,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Mountainous Central American republic with a broad northern Caribbean coast and a narrow southern Pacific outlet on the Gulf of Fonseca.",
    "clues": [
      "Mountainous Central American republic with a broad northern Caribbean coast and a narrow southern Pacific outlet on the Gulf of Fonseca.",
      "Home to the ancient Maya city of Copán, renowned for its intricate stone stelae and Hieroglyphic Stairway.",
      "Its Caribbean Bay Islands (Roatán, Utila) sit along the Mesoamerican Barrier Reef, the second-largest coral reef system on Earth.",
      "Its currency is named after Lempira, a 16th-century indigenous Lenca chieftain who resisted Spanish conquest.",
      "Capital: Tegucigalpa · Population: ~10.6M · Currency: Honduran lempira (HNL)"
    ],
    "neighbors": [
      "Guatemala",
      "El Salvador",
      "Nicaragua"
    ]
  },
  {
    "id": "country-quiz-120-el-salvador",
    "country": "El Salvador",
    "name": "El Salvador",
    "isoCode": "SV",
    "flag": "el-salvador",
    "flagUrl": "/flags/el-salvador.svg",
    "flagEmoji": "🇸🇻",
    "capital": "San Salvador",
    "zone": "americas",
    "subregion": "Central America",
    "population": "6.3M",
    "currency": "United States dollar (USD)",
    "languages": [
      "Spanish"
    ],
    "lat": 13.8,
    "lng": -88.9,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Smallest and most densely populated country in Central America, and the only one without a Caribbean coastline (Pacific only).",
    "clues": [
      "Smallest and most densely populated country in Central America, and the only one without a Caribbean coastline (Pacific only).",
      "Known as the 'Land of Volcanoes' with over 20 volcanoes across its compact territory.",
      "Famous for Pacific surf breaks, pupusas (stuffed corn tortillas), and the 'Pompeii of the Americas' Maya village of Joya de Cerén.",
      "Uses the US dollar and in 2021 became the first country in the world to adopt Bitcoin as legal tender.",
      "Capital: San Salvador · Population: ~6.3M · Currency: United States dollar (USD)"
    ],
    "neighbors": [
      "Guatemala",
      "Honduras"
    ]
  },
  {
    "id": "country-quiz-121-nicaragua",
    "country": "Nicaragua",
    "name": "Nicaragua",
    "isoCode": "NI",
    "flag": "nicaragua",
    "flagUrl": "/flags/nicaragua.svg",
    "flagEmoji": "🇳🇮",
    "capital": "Managua",
    "zone": "americas",
    "subregion": "Central America",
    "population": "7.0M",
    "currency": "Nicaraguan córdoba (NIO)",
    "languages": [
      "Spanish"
    ],
    "lat": 12.9,
    "lng": -85.2,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Largest country by land area in Central America, stretching from the Pacific Ocean to the Mosquito Coast on the Caribbean.",
    "clues": [
      "Largest country by land area in Central America, stretching from the Pacific Ocean to the Mosquito Coast on the Caribbean.",
      "Known as the 'Land of Lakes and Volcanoes', featuring vast Lake Nicaragua (Cocibolca) with twin-volcano Ometepe Island and freshwater sharks.",
      "Home to colorful colonial cities Granada and León, and volcanic ash-boarding down Cerro Negro.",
      "Borders Honduras to the north and Costa Rica to the south.",
      "Capital: Managua · Population: ~7.0M · Currency: Nicaraguan córdoba (NIO)"
    ],
    "neighbors": [
      "Honduras",
      "Costa Rica"
    ]
  },
  {
    "id": "country-quiz-122-belize",
    "country": "Belize",
    "name": "Belize",
    "isoCode": "BZ",
    "flag": "belize",
    "flagUrl": "/flags/belize.svg",
    "flagEmoji": "🇧🇿",
    "capital": "Belmopan",
    "zone": "americas",
    "subregion": "Central America",
    "population": "410K",
    "currency": "Belize dollar (BZD)",
    "languages": [
      "English"
    ],
    "lat": 17.2,
    "lng": -88.5,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Located on the northeastern Caribbean coast of Central America; the only Central American country where English is the official language.",
    "clues": [
      "Located on the northeastern Caribbean coast of Central America; the only Central American country where English is the official language.",
      "Formerly known as British Honduras until 1973; gained full independence in 1981.",
      "Home to the Great Blue Hole (a giant marine sinkhole), the Belize Barrier Reef, and Maya ruins like Caracol and Xunantunich.",
      "After Hurricane Hattie devastated coastal Belize City in 1961, it built a new inland capital at Belmopan.",
      "Capital: Belmopan · Population: ~410K · Currency: Belize dollar (BZD)"
    ],
    "neighbors": [
      "Mexico",
      "Guatemala"
    ]
  },
  {
    "id": "country-quiz-123-egypt",
    "country": "Egypt",
    "name": "Egypt",
    "isoCode": "EG",
    "flag": "egypt",
    "flagUrl": "/flags/egypt.svg",
    "flagEmoji": "🇪🇬",
    "capital": "Cairo",
    "zone": "africa",
    "subregion": "North Africa",
    "population": "112.7M",
    "currency": "Egyptian pound (EGP)",
    "languages": [
      "Arabic"
    ],
    "lat": 26.8,
    "lng": 30.8,
    "difficulty": "easy",
    "tier": 1,
    "hint": "Transcontinental nation linking Northeast Africa with the Middle East via the Sinai Peninsula and the Suez Canal.",
    "clues": [
      "Transcontinental nation linking Northeast Africa with the Middle East via the Sinai Peninsula and the Suez Canal.",
      "Over 95% of its population lives along the narrow green ribbon and delta of the Nile River surrounded by the Sahara.",
      "Home to the Great Pyramid of Giza (the only surviving Ancient Wonder), the Sphinx, Valley of the Kings in Luxor, and Abu Simbel.",
      "Its capital Cairo is the largest metropolitan area in both the Arab world and Africa.",
      "Capital: Cairo · Population: ~112.7M · Currency: Egyptian pound (EGP)"
    ],
    "neighbors": [
      "Libya",
      "Sudan",
      "Israel",
      "Palestine"
    ]
  },
  {
    "id": "country-quiz-124-south-africa",
    "country": "South Africa",
    "name": "South Africa",
    "isoCode": "ZA",
    "flag": "south-africa",
    "flagUrl": "/flags/south-africa.svg",
    "flagEmoji": "🇿🇦",
    "capital": "Pretoria",
    "zone": "africa",
    "subregion": "Southern Africa",
    "population": "60.4M",
    "currency": "South African rand (ZAR)",
    "languages": [
      "Zulu",
      "Xhosa",
      "Afrikaans",
      "English"
    ],
    "lat": -30.6,
    "lng": 22.9,
    "difficulty": "easy",
    "tier": 1,
    "hint": "Occupies the southern tip of Africa where the Atlantic and Indian oceans meet near Cape Agulhas and the Cape of Good Hope.",
    "clues": [
      "Occupies the southern tip of Africa where the Atlantic and Indian oceans meet near Cape Agulhas and the Cape of Good Hope.",
      "Uniquely divides government branches among three capitals: Pretoria (executive), Cape Town (legislative), and Bloemfontein (judicial).",
      "Completely surrounds the enclaved mountain kingdom of Lesotho and nearly surrounds Eswatini.",
      "Known as the 'Rainbow Nation' with 12 official languages, Nelson Mandela's legacy, Table Mountain, and Kruger National Park.",
      "Capital: Pretoria · Population: ~60.4M · Currency: South African rand (ZAR)"
    ],
    "neighbors": [
      "Namibia",
      "Botswana",
      "Zimbabwe",
      "Mozambique",
      "Eswatini",
      "Lesotho"
    ]
  },
  {
    "id": "country-quiz-125-nigeria",
    "country": "Nigeria",
    "name": "Nigeria",
    "isoCode": "NG",
    "flag": "nigeria",
    "flagUrl": "/flags/nigeria.svg",
    "flagEmoji": "🇳🇬",
    "capital": "Abuja",
    "zone": "africa",
    "subregion": "West Africa",
    "population": "223.8M",
    "currency": "Nigerian naira (NGN)",
    "languages": [
      "English",
      "Hausa",
      "Yoruba",
      "Igbo"
    ],
    "lat": 9.1,
    "lng": 8.7,
    "difficulty": "easy",
    "tier": 1,
    "hint": "Africa's most populous nation, located on the Gulf of Guinea where the Niger and Benue rivers meet in a Y-shape.",
    "clues": [
      "Africa's most populous nation, located on the Gulf of Guinea where the Niger and Benue rivers meet in a Y-shape.",
      "Features coastal megacity Lagos (one of the fastest-growing cities on Earth) and the planned central capital Abuja (since 1991).",
      "Cultural superpower behind Afrobeats music, Nollywood (one of the world's largest film industries), and Nobel laureate Wole Soyinka.",
      "Major African oil producer with over 250 ethnic groups and 500 spoken languages.",
      "Capital: Abuja · Population: ~223.8M · Currency: Nigerian naira (NGN)"
    ],
    "neighbors": [
      "Benin",
      "Niger",
      "Chad",
      "Cameroon"
    ]
  },
  {
    "id": "country-quiz-126-kenya",
    "country": "Kenya",
    "name": "Kenya",
    "isoCode": "KE",
    "flag": "kenya",
    "flagUrl": "/flags/kenya.svg",
    "flagEmoji": "🇰🇪",
    "capital": "Nairobi",
    "zone": "africa",
    "subregion": "East Africa",
    "population": "55.1M",
    "currency": "Kenyan shilling (KES)",
    "languages": [
      "Swahili",
      "English"
    ],
    "lat": 0.02,
    "lng": 37.9,
    "difficulty": "medium",
    "tier": 2,
    "hint": "East African nation bisected by both the Equator and the Great Rift Valley, stretching from the Indian Ocean to Lake Victoria.",
    "clues": [
      "East African nation bisected by both the Equator and the Great Rift Valley, stretching from the Indian Ocean to Lake Victoria.",
      "Named after snow-capped Mount Kenya (5,199 m), the second-highest mountain in Africa.",
      "World-famous for the Great Wildebeest Migration in the Maasai Mara, world-dominant marathon runners, and mobile money pioneer M-Pesa.",
      "Its capital Nairobi is the only major city in the world with a wildlife safari national park directly bordering its skyline.",
      "Capital: Nairobi · Population: ~55.1M · Currency: Kenyan shilling (KES)"
    ],
    "neighbors": [
      "Tanzania",
      "Uganda",
      "South Sudan",
      "Ethiopia",
      "Somalia"
    ]
  },
  {
    "id": "country-quiz-127-ethiopia",
    "country": "Ethiopia",
    "name": "Ethiopia",
    "isoCode": "ET",
    "flag": "ethiopia",
    "flagUrl": "/flags/ethiopia.svg",
    "flagEmoji": "🇪🇹",
    "capital": "Addis Ababa",
    "zone": "africa",
    "subregion": "East Africa",
    "population": "126.5M",
    "currency": "Ethiopian birr (ETB)",
    "languages": [
      "Amharic"
    ],
    "lat": 9.1,
    "lng": 40.5,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Africa's most populous landlocked country, located in the Horn of Africa and dominated by the rugged Ethiopian Highlands.",
    "clues": [
      "Africa's most populous landlocked country, located in the Horn of Africa and dominated by the rugged Ethiopian Highlands.",
      "Never colonized during the European Scramble for Africa (defeating Italy at Adwa in 1896); headquarters of the African Union.",
      "Birthplace of Arabica coffee, home to the 12th-century rock-hewn churches of Lalibela, and source of the Blue Nile (Lake Tana).",
      "Follows its own 13-month Ge'ez calendar that sits roughly seven to eight years behind the Gregorian calendar.",
      "Capital: Addis Ababa · Population: ~126.5M · Currency: Ethiopian birr (ETB)"
    ],
    "neighbors": [
      "Eritrea",
      "Djibouti",
      "Somalia",
      "Kenya",
      "South Sudan",
      "Sudan"
    ]
  },
  {
    "id": "country-quiz-128-morocco",
    "country": "Morocco",
    "name": "Morocco",
    "isoCode": "MA",
    "flag": "morocco",
    "flagUrl": "/flags/morocco.svg",
    "flagEmoji": "🇲🇦",
    "capital": "Rabat",
    "zone": "africa",
    "subregion": "North Africa",
    "population": "37.8M",
    "currency": "Moroccan dirham (MAD)",
    "languages": [
      "Arabic",
      "Berber"
    ],
    "lat": 31.8,
    "lng": -7.1,
    "difficulty": "easy",
    "tier": 1,
    "hint": "Northwestern African kingdom with coastlines on both the Atlantic Ocean and the Mediterranean Sea across the Strait of Gibraltar.",
    "clues": [
      "Northwestern African kingdom with coastlines on both the Atlantic Ocean and the Mediterranean Sea across the Strait of Gibraltar.",
      "Crossed by the snow-capped Atlas Mountains (peaking at Toubkal) before descending into the Sahara Desert.",
      "Famous for the red-walled medina of Marrakesh, blue-painted Chefchaouen, ancient tanneries of Fes, and Casablanca.",
      "First nation in the world to formally recognize the independence of the United States (1777) and first African team in a FIFA World Cup semifinal.",
      "Capital: Rabat · Population: ~37.8M · Currency: Moroccan dirham (MAD)"
    ],
    "neighbors": [
      "Algeria",
      "Spain"
    ]
  },
  {
    "id": "country-quiz-129-algeria",
    "country": "Algeria",
    "name": "Algeria",
    "isoCode": "DZ",
    "flag": "algeria",
    "flagUrl": "/flags/algeria.svg",
    "flagEmoji": "🇩🇿",
    "capital": "Algiers",
    "zone": "africa",
    "subregion": "North Africa",
    "population": "45.6M",
    "currency": "Algerian dinar (DZD)",
    "languages": [
      "Arabic",
      "Berber"
    ],
    "lat": 28,
    "lng": 1.7,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Largest country in Africa (and the Arab world) by land area since the 2011 split of Sudan.",
    "clues": [
      "Largest country in Africa (and the Arab world) by land area since the 2011 split of Sudan.",
      "Stretches from a fertile Mediterranean coastline ('Algiers the White') across the Tell Atlas into the vast Sahara Desert (over 80% of its area).",
      "Home to impressive Roman ruins at Timgad and Djémila, and prehistoric Saharan rock art at Tassili n'Ajjer.",
      "Major exporter of natural gas via pipelines under the Mediterranean to Europe.",
      "Capital: Algiers · Population: ~45.6M · Currency: Algerian dinar (DZD)"
    ],
    "neighbors": [
      "Morocco",
      "Tunisia",
      "Libya",
      "Niger",
      "Mali",
      "Mauritania"
    ]
  },
  {
    "id": "country-quiz-130-tunisia",
    "country": "Tunisia",
    "name": "Tunisia",
    "isoCode": "TN",
    "flag": "tunisia",
    "flagUrl": "/flags/tunisia.svg",
    "flagEmoji": "🇹🇳",
    "capital": "Tunis",
    "zone": "africa",
    "subregion": "North Africa",
    "population": "12.5M",
    "currency": "Tunisian dinar (TND)",
    "languages": [
      "Arabic"
    ],
    "lat": 33.9,
    "lng": 9.5,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Northernmost country in Africa, jutting into the Mediterranean Sea just 140 km across the Strait of Sicily from Italy.",
    "clues": [
      "Northernmost country in Africa, jutting into the Mediterranean Sea just 140 km across the Strait of Sicily from Italy.",
      "Heart of the ancient Phoenician empire of Carthage (home of Hannibal) and the well-preserved Roman amphitheater of El Djem.",
      "Its desert oasis town of Tataouine and troglodyte homes of Matmata inspired the planet Tatooine in Star Wars.",
      "Smallest country in the North African Maghreb region.",
      "Capital: Tunis · Population: ~12.5M · Currency: Tunisian dinar (TND)"
    ],
    "neighbors": [
      "Algeria",
      "Libya"
    ]
  },
  {
    "id": "country-quiz-131-tanzania",
    "country": "Tanzania",
    "name": "Tanzania",
    "isoCode": "TZ",
    "flag": "tanzania",
    "flagUrl": "/flags/tanzania.svg",
    "flagEmoji": "🇹🇿",
    "capital": "Dodoma",
    "zone": "africa",
    "subregion": "East Africa",
    "population": "67.4M",
    "currency": "Tanzanian shilling (TZS)",
    "languages": [
      "Swahili",
      "English"
    ],
    "lat": -6.4,
    "lng": 34.9,
    "difficulty": "medium",
    "tier": 2,
    "hint": "East African nation bordering the Indian Ocean and Africa's three largest lakes: Victoria, Tanganyika, and Nyasa (Malawi).",
    "clues": [
      "East African nation bordering the Indian Ocean and Africa's three largest lakes: Victoria, Tanganyika, and Nyasa (Malawi).",
      "Formed in 1964 by the union of mainland Tanganyika and the spice island archipelago of Zanzibar (generating its portmanteau name).",
      "Contains both the highest point in Africa (Mount Kilimanjaro, 5,895 m) and world-renowned Serengeti and Ngorongoro Crater.",
      "Dar es Salaam is its largest city and main port, while inland Dodoma is the official capital.",
      "Capital: Dodoma · Population: ~67.4M · Currency: Tanzanian shilling (TZS)"
    ],
    "neighbors": [
      "Kenya",
      "Uganda",
      "Rwanda",
      "Burundi",
      "DR Congo",
      "Zambia",
      "Malawi",
      "Mozambique"
    ]
  },
  {
    "id": "country-quiz-132-ghana",
    "country": "Ghana",
    "name": "Ghana",
    "isoCode": "GH",
    "flag": "ghana",
    "flagUrl": "/flags/ghana.svg",
    "flagEmoji": "🇬🇭",
    "capital": "Accra",
    "zone": "africa",
    "subregion": "West Africa",
    "population": "34.1M",
    "currency": "Ghanaian cedi (GHS)",
    "languages": [
      "English"
    ],
    "lat": 7.9,
    "lng": -1,
    "difficulty": "medium",
    "tier": 2,
    "hint": "West African republic on the Gulf of Guinea, close to the intersection of the Prime Meridian (0° longitude) and the Equator (0° latitude).",
    "clues": [
      "West African republic on the Gulf of Guinea, close to the intersection of the Prime Meridian (0° longitude) and the Equator (0° latitude).",
      "In 1957, under Kwame Nkrumah, the former British Gold Coast became the first sub-Saharan African colony to achieve independence.",
      "Home to Lake Volta, the largest artificial reservoir in the world by surface area, and traditional Ashanti kente cloth.",
      "Second-largest cocoa producer in the world and Africa's largest gold producer.",
      "Capital: Accra · Population: ~34.1M · Currency: Ghanaian cedi (GHS)"
    ],
    "neighbors": [
      "Côte d'Ivoire",
      "Burkina Faso",
      "Togo"
    ]
  },
  {
    "id": "country-quiz-133-senegal",
    "country": "Senegal",
    "name": "Senegal",
    "isoCode": "SN",
    "flag": "senegal",
    "flagUrl": "/flags/senegal.svg",
    "flagEmoji": "🇸🇳",
    "capital": "Dakar",
    "zone": "africa",
    "subregion": "West Africa",
    "population": "17.7M",
    "currency": "West African CFA franc (XOF)",
    "languages": [
      "French"
    ],
    "lat": 14.5,
    "lng": -14.5,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Occupies the westernmost point of the African mainland (Cap-Vert peninsula), where its capital Dakar juts into the Atlantic.",
    "clues": [
      "Occupies the westernmost point of the African mainland (Cap-Vert peninsula), where its capital Dakar juts into the Atlantic.",
      "Almost completely surrounds the narrow river-hugging enclave nation of The Gambia.",
      "Known for Gorée Island, pink-colored Lake Retba (Lac Rose), the giant African Renaissance Monument, and teranga hospitality.",
      "Takes its name from the Senegal River that forms its northern border with Mauritania.",
      "Capital: Dakar · Population: ~17.7M · Currency: West African CFA franc (XOF)"
    ],
    "neighbors": [
      "Mauritania",
      "Mali",
      "Guinea",
      "Guinea-Bissau",
      "Gambia"
    ]
  },
  {
    "id": "country-quiz-134-cote-d-ivoire",
    "country": "Côte d'Ivoire",
    "name": "Côte d'Ivoire",
    "isoCode": "CI",
    "flag": "ivory-coast",
    "flagUrl": "/flags/ivory-coast.svg",
    "flagEmoji": "🇨🇮",
    "capital": "Yamoussoukro",
    "zone": "africa",
    "subregion": "West Africa",
    "population": "28.9M",
    "currency": "West African CFA franc (XOF)",
    "languages": [
      "French"
    ],
    "lat": 7.5,
    "lng": -5.5,
    "difficulty": "hard",
    "tier": 3,
    "hint": "West African nation on the Gulf of Guinea that is the world's #1 producer and exporter of cocoa beans (over 40% of global supply).",
    "clues": [
      "West African nation on the Gulf of Guinea that is the world's #1 producer and exporter of cocoa beans (over 40% of global supply).",
      "Abidjan ('The Pearl of the Lagoons') is its economic metropolis, while inland Yamoussoukro has been the official capital since 1983.",
      "Yamoussoukro houses the Basilica of Our Lady of Peace, the largest Christian church building in the world by exterior area.",
      "Its orange, white, and green vertical tricolor is the mirror image of Ireland's flag.",
      "Capital: Yamoussoukro · Population: ~28.9M · Currency: West African CFA franc (XOF)"
    ],
    "neighbors": [
      "Liberia",
      "Guinea",
      "Mali",
      "Burkina Faso",
      "Ghana"
    ]
  },
  {
    "id": "country-quiz-135-dr-congo",
    "country": "DR Congo",
    "name": "DR Congo",
    "isoCode": "CD",
    "flag": "democratic-republic-congo",
    "flagUrl": "/flags/democratic-republic-congo.svg",
    "flagEmoji": "🇨🇩",
    "capital": "Kinshasa",
    "zone": "africa",
    "subregion": "Central Africa",
    "population": "102.3M",
    "currency": "Congolese franc (CDF)",
    "languages": [
      "French"
    ],
    "lat": -4,
    "lng": 21.8,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Second-largest country in Africa by area, straddling the Equator across the vast tropical rainforest basin of the Congo River.",
    "clues": [
      "Second-largest country in Africa by area, straddling the Equator across the vast tropical rainforest basin of the Congo River.",
      "Has a tiny 37-km Atlantic coastline at the mouth of the Congo River while bordering 9 countries inland.",
      "Its capital Kinshasa faces Brazzaville (capital of the Republic of the Congo) directly across the Congo River—the closest pair of capitals after Rome/Vatican.",
      "Immense mineral wealth including over 70% of the world's cobalt supply, plus Virunga mountain gorillas and okapis.",
      "Capital: Kinshasa · Population: ~102.3M · Currency: Congolese franc (CDF)"
    ],
    "neighbors": [
      "Republic of the Congo",
      "Central African Republic",
      "South Sudan",
      "Uganda",
      "Rwanda",
      "Burundi",
      "Tanzania",
      "Zambia",
      "Angola"
    ]
  },
  {
    "id": "country-quiz-136-uganda",
    "country": "Uganda",
    "name": "Uganda",
    "isoCode": "UG",
    "flag": "uganda",
    "flagUrl": "/flags/uganda.svg",
    "flagEmoji": "🇺🇬",
    "capital": "Kampala",
    "zone": "africa",
    "subregion": "East Africa",
    "population": "48.6M",
    "currency": "Ugandan shilling (UGX)",
    "languages": [
      "English",
      "Swahili"
    ],
    "lat": 1.4,
    "lng": 32.3,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Landlocked East African nation dubbed the 'Pearl of Africa' by Winston Churchill, sitting on the northern shore of Lake Victoria.",
    "clues": [
      "Landlocked East African nation dubbed the 'Pearl of Africa' by Winston Churchill, sitting on the northern shore of Lake Victoria.",
      "Source of the White Nile at Jinja, and home to the snow-capped Rwenzori ('Mountains of the Moon').",
      "Bwindi Impenetrable Forest shelters roughly half of the world's remaining wild mountain gorillas.",
      "Features the grey crowned crane at the center of its black, yellow, and red striped flag.",
      "Capital: Kampala · Population: ~48.6M · Currency: Ugandan shilling (UGX)"
    ],
    "neighbors": [
      "South Sudan",
      "Kenya",
      "Tanzania",
      "Rwanda",
      "DR Congo"
    ]
  },
  {
    "id": "country-quiz-137-rwanda",
    "country": "Rwanda",
    "name": "Rwanda",
    "isoCode": "RW",
    "flag": "rwanda",
    "flagUrl": "/flags/rwanda.svg",
    "flagEmoji": "🇷🇼",
    "capital": "Kigali",
    "zone": "africa",
    "subregion": "East Africa",
    "population": "14.1M",
    "currency": "Rwandan franc (RWF)",
    "languages": [
      "Kinyarwanda",
      "English",
      "French",
      "Swahili"
    ],
    "lat": -1.9,
    "lng": 29.9,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Small, densely populated landlocked country in the African Great Lakes region known as the 'Land of a Thousand Hills'.",
    "clues": [
      "Small, densely populated landlocked country in the African Great Lakes region known as the 'Land of a Thousand Hills'.",
      "Home to Volcanoes National Park (where Dian Fossey studied mountain gorillas) and Lake Kivu.",
      "Its capital Kigali is widely praised as one of the cleanest and safest cities in Africa, helped by monthly community Umuganda.",
      "Holds the world record for the highest percentage of women serving in a national parliament (>60%).",
      "Capital: Kigali · Population: ~14.1M · Currency: Rwandan franc (RWF)"
    ],
    "neighbors": [
      "Uganda",
      "Tanzania",
      "Burundi",
      "DR Congo"
    ]
  },
  {
    "id": "country-quiz-138-cameroon",
    "country": "Cameroon",
    "name": "Cameroon",
    "isoCode": "CM",
    "flag": "cameroon",
    "flagUrl": "/flags/cameroon.svg",
    "flagEmoji": "🇨🇲",
    "capital": "Yaoundé",
    "zone": "africa",
    "subregion": "Central / West Africa",
    "population": "28.6M",
    "currency": "Central African CFA franc (XAF)",
    "languages": [
      "French",
      "English"
    ],
    "lat": 7.4,
    "lng": 12.4,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Often called 'Africa in Miniature' because it encompasses beaches, desert plains, mountains (active Mount Cameroon), rainforest, and savanna.",
    "clues": [
      "Often called 'Africa in Miniature' because it encompasses beaches, desert plains, mountains (active Mount Cameroon), rainforest, and savanna.",
      "Sits at the hinge of West and Central Africa along the Bight of Bonny.",
      "Douala is its largest port city, while highland Yaoundé serves as the political capital.",
      "Named by 15th-century Portuguese explorers after 'Rio dos Camarões' ('River of Prawns').",
      "Capital: Yaoundé · Population: ~28.6M · Currency: Central African CFA franc (XAF)"
    ],
    "neighbors": [
      "Nigeria",
      "Chad",
      "Central African Republic",
      "Republic of the Congo",
      "Gabon",
      "Equatorial Guinea"
    ]
  },
  {
    "id": "country-quiz-139-angola",
    "country": "Angola",
    "name": "Angola",
    "isoCode": "AO",
    "flag": "angola",
    "flagUrl": "/flags/angola.svg",
    "flagEmoji": "🇦🇴",
    "capital": "Luanda",
    "zone": "africa",
    "subregion": "Southern / Central Africa",
    "population": "36.7M",
    "currency": "Angolan kwanza (AOA)",
    "languages": [
      "Portuguese"
    ],
    "lat": -11.2,
    "lng": 17.9,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Large Portuguese-speaking nation on the southwestern Atlantic coast of Africa, including the oil-rich Cabinda exclave.",
    "clues": [
      "Large Portuguese-speaking nation on the southwestern Atlantic coast of Africa, including the oil-rich Cabinda exclave.",
      "Rises from an arid coastal strip (Namib Desert extension) to the vast central Bié Plateau, source of the Zambezi and Okavango rivers.",
      "Major sub-Saharan producer of crude oil and diamonds; famous for Kalandula Falls and the giant sable antelope.",
      "Gained independence from Portugal in 1975.",
      "Capital: Luanda · Population: ~36.7M · Currency: Angolan kwanza (AOA)"
    ],
    "neighbors": [
      "Namibia",
      "Zambia",
      "DR Congo",
      "Republic of the Congo"
    ]
  },
  {
    "id": "country-quiz-140-mozambique",
    "country": "Mozambique",
    "name": "Mozambique",
    "isoCode": "MZ",
    "flag": "mozanbique",
    "flagUrl": "/flags/mozanbique.svg",
    "flagEmoji": "🇲🇿",
    "capital": "Maputo",
    "zone": "africa",
    "subregion": "Southern / East Africa",
    "population": "33.9M",
    "currency": "Mozambican metical (MZN)",
    "languages": [
      "Portuguese"
    ],
    "lat": -18.7,
    "lng": 35.5,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Stretches 2,470 km along the southeastern Indian Ocean coast of Africa opposite the island of Madagascar.",
    "clues": [
      "Stretches 2,470 km along the southeastern Indian Ocean coast of Africa opposite the island of Madagascar.",
      "Cut in two by the lower Zambezi River and home to the coral islands of the Bazaruto and Quirimbas archipelagos.",
      "Former Portuguese colony and the only member of the Commonwealth of Nations that was never part of the British Empire (alongside Rwanda, Gabon, Togo).",
      "Its flag is the only national flag in the world to feature a modern assault rifle (crossed with a hoe over an open book).",
      "Capital: Maputo · Population: ~33.9M · Currency: Mozambican metical (MZN)"
    ],
    "neighbors": [
      "Tanzania",
      "Malawi",
      "Zambia",
      "Zimbabwe",
      "South Africa",
      "Eswatini"
    ]
  },
  {
    "id": "country-quiz-141-zambia",
    "country": "Zambia",
    "name": "Zambia",
    "isoCode": "ZM",
    "flag": "zambia",
    "flagUrl": "/flags/zambia.svg",
    "flagEmoji": "🇿🇲",
    "capital": "Lusaka",
    "zone": "africa",
    "subregion": "Southern Africa",
    "population": "20.6M",
    "currency": "Zambian kwacha (ZMW)",
    "languages": [
      "English"
    ],
    "lat": -13.1,
    "lng": 27.8,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Landlocked plateau nation in south-central Africa named after the Zambezi River, which forms its southern border.",
    "clues": [
      "Landlocked plateau nation in south-central Africa named after the Zambezi River, which forms its southern border.",
      "Shares the thundering curtain of Victoria Falls (Mosi-oa-Tunya, 'The Smoke That Thunders') and Lake Kariba with Zimbabwe.",
      "One of the world's major copper producers, centered on its northern Copperbelt Province.",
      "Borders 8 countries including Tanzania, Malawi, Mozambique, Zimbabwe, Botswana, Namibia, Angola, and DR Congo.",
      "Capital: Lusaka · Population: ~20.6M · Currency: Zambian kwacha (ZMW)"
    ],
    "neighbors": [
      "DR Congo",
      "Tanzania",
      "Malawi",
      "Mozambique",
      "Zimbabwe",
      "Botswana",
      "Namibia",
      "Angola"
    ]
  },
  {
    "id": "country-quiz-142-zimbabwe",
    "country": "Zimbabwe",
    "name": "Zimbabwe",
    "isoCode": "ZW",
    "flag": "zimbabwe",
    "flagUrl": "/flags/zimbabwe.svg",
    "flagEmoji": "🇿🇼",
    "capital": "Harare",
    "zone": "africa",
    "subregion": "Southern Africa",
    "population": "16.7M",
    "currency": "Zimbabwe Gold (ZiG) / USD",
    "languages": [
      "English",
      "Shona",
      "Ndebele"
    ],
    "lat": -19,
    "lng": 29.2,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Landlocked Southern African country situated on a high plateau between the Zambezi and Limpopo rivers.",
    "clues": [
      "Landlocked Southern African country situated on a high plateau between the Zambezi and Limpopo rivers.",
      "Takes its name from Great Zimbabwe, a medieval 11th–15th century dry-stone walled city whose soapstone bird appears on the flag.",
      "Shares Victoria Falls—the world's largest sheet of falling water—with neighboring Zambia.",
      "Home to Hwange National Park and the balancing granite boulders of Matobo Hills.",
      "Capital: Harare · Population: ~16.7M · Currency: Zimbabwe Gold (ZiG) / USD"
    ],
    "neighbors": [
      "Zambia",
      "Mozambique",
      "South Africa",
      "Botswana"
    ]
  },
  {
    "id": "country-quiz-143-botswana",
    "country": "Botswana",
    "name": "Botswana",
    "isoCode": "BW",
    "flag": "botswana",
    "flagUrl": "/flags/botswana.svg",
    "flagEmoji": "🇧🇼",
    "capital": "Gaborone",
    "zone": "africa",
    "subregion": "Southern Africa",
    "population": "2.7M",
    "currency": "Botswana pula (BWP)",
    "languages": [
      "English",
      "Tswana"
    ],
    "lat": -22.3,
    "lng": 24.7,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Landlocked Southern African nation covered ~70% by the Kalahari Desert and home to the largest elephant population on Earth.",
    "clues": [
      "Landlocked Southern African nation covered ~70% by the Kalahari Desert and home to the largest elephant population on Earth.",
      "Features the inland Okavango Delta, a lush labyrinth of lagoons and islands that evaporates into the Kalahari without reaching the sea.",
      "One of Africa's most stable democracies since 1966 and a top global producer of gem-quality diamonds.",
      "Its currency, the Pula, literally means 'Rain' in Setswana because rain is so precious in the Kalahari.",
      "Capital: Gaborone · Population: ~2.7M · Currency: Botswana pula (BWP)"
    ],
    "neighbors": [
      "South Africa",
      "Namibia",
      "Zambia",
      "Zimbabwe"
    ]
  },
  {
    "id": "country-quiz-144-namibia",
    "country": "Namibia",
    "name": "Namibia",
    "isoCode": "NA",
    "flag": "namibia",
    "flagUrl": "/flags/namibia.svg",
    "flagEmoji": "🇳🇦",
    "capital": "Windhoek",
    "zone": "africa",
    "subregion": "Southern Africa",
    "population": "2.6M",
    "currency": "Namibian dollar (NAD)",
    "languages": [
      "English"
    ],
    "lat": -22.9,
    "lng": 18.5,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Southwestern African nation named after the coastal Namib Desert, considered the oldest desert in the world.",
    "clues": [
      "Southwestern African nation named after the coastal Namib Desert, considered the oldest desert in the world.",
      "Features the towering red sand dunes of Sossusvlei, the shipwreck-strewn Skeleton Coast, Etosha salt pan, and Fish River Canyon.",
      "Includes the narrow 450-km Caprivi Strip (Zambezi Region) panhandle reaching east to the Zambezi River.",
      "Second most sparsely populated sovereign country on Earth after Mongolia.",
      "Capital: Windhoek · Population: ~2.6M · Currency: Namibian dollar (NAD)"
    ],
    "neighbors": [
      "Angola",
      "Zambia",
      "Botswana",
      "South Africa"
    ]
  },
  {
    "id": "country-quiz-145-madagascar",
    "country": "Madagascar",
    "name": "Madagascar",
    "isoCode": "MG",
    "flag": "madagascar",
    "flagUrl": "/flags/madagascar.svg",
    "flagEmoji": "🇲🇬",
    "capital": "Antananarivo",
    "zone": "africa",
    "subregion": "East Africa / Indian Ocean",
    "population": "30.3M",
    "currency": "Malagasy ariary (MGA)",
    "languages": [
      "Malagasy",
      "French"
    ],
    "lat": -18.8,
    "lng": 46.9,
    "difficulty": "medium",
    "tier": 2,
    "hint": "World's fourth-largest island (and second-largest island country), separated from southeastern Africa by the Mozambique Channel.",
    "clues": [
      "World's fourth-largest island (and second-largest island country), separated from southeastern Africa by the Mozambique Channel.",
      "Split from the Indian subcontinent 88 million years ago, resulting in ~90% of its wildlife (like ring-tailed lemurs and fossas) existing nowhere else.",
      "Famous for the Avenue of the Baobabs, razor-sharp limestone Tsingy de Bemaraha, and producing ~80% of the world's natural vanilla.",
      "Its language and ancestry blend Austronesian (Borneo) seafarers with Bantu East African heritage.",
      "Capital: Antananarivo · Population: ~30.3M · Currency: Malagasy ariary (MGA)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-146-mauritius",
    "country": "Mauritius",
    "name": "Mauritius",
    "isoCode": "MU",
    "flag": "mauritius",
    "flagUrl": "/flags/mauritius.svg",
    "flagEmoji": "🇲🇺",
    "capital": "Port Louis",
    "zone": "africa",
    "subregion": "East Africa / Indian Ocean",
    "population": "1.3M",
    "currency": "Mauritian rupee (MUR)",
    "languages": [
      "English",
      "French"
    ],
    "lat": -20.3,
    "lng": 57.6,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Volcanic island nation in the Mascarene archipelago of the Indian Ocean, about 900 km east of Madagascar.",
    "clues": [
      "Volcanic island nation in the Mascarene archipelago of the Indian Ocean, about 900 km east of Madagascar.",
      "Sole historical habitat of the extinct flightless Dodo bird, which still stands as a supporter on its national coat of arms.",
      "Famous for the Le Morne Brabant peninsula, Seven Coloured Earths of Chamarel, and an 'underwater waterfall' optical illusion.",
      "One of Africa's highest-income economies with a multicultural population of Indian, Creole, Chinese, and French heritage.",
      "Capital: Port Louis · Population: ~1.3M · Currency: Mauritian rupee (MUR)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-147-seychelles",
    "country": "Seychelles",
    "name": "Seychelles",
    "isoCode": "SC",
    "flag": "seychelles",
    "flagUrl": "/flags/seychelles.svg",
    "flagEmoji": "🇸🇨",
    "capital": "Victoria",
    "zone": "africa",
    "subregion": "East Africa / Indian Ocean",
    "population": "107K",
    "currency": "Seychellois rupee (SCR)",
    "languages": [
      "Seychellois Creole",
      "English",
      "French"
    ],
    "lat": -4.7,
    "lng": 55.5,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Archipelago of 115 granite and coral islands in the western Indian Ocean north of Madagascar; smallest African nation by population.",
    "clues": [
      "Archipelago of 115 granite and coral islands in the western Indian Ocean north of Madagascar; smallest African nation by population.",
      "Famous for giant Aldabra tortoises, smooth pink granite beach boulders on La Digue, and the massive double-lobed Coco de Mer palm nut.",
      "Its capital Victoria on Mahé Island is the smallest capital city in Africa.",
      "Has the highest nominal GDP per capita of any African nation.",
      "Capital: Victoria · Population: ~107K · Currency: Seychellois rupee (SCR)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-148-sudan",
    "country": "Sudan",
    "name": "Sudan",
    "isoCode": "SD",
    "flag": "sudan",
    "flagUrl": "/flags/sudan.svg",
    "flagEmoji": "🇸🇩",
    "capital": "Khartoum",
    "zone": "africa",
    "subregion": "North / East Africa",
    "population": "48.1M",
    "currency": "Sudanese pound (SDG)",
    "languages": [
      "Arabic",
      "English"
    ],
    "lat": 12.9,
    "lng": 30.2,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Northeastern African country bordering the Red Sea, centered on the confluence of the Blue Nile and White Nile at Khartoum.",
    "clues": [
      "Northeastern African country bordering the Red Sea, centered on the confluence of the Blue Nile and White Nile at Khartoum.",
      "Home to ancient Nubian kingdoms (Kingdom of Kush) at Meroë, which built more pyramids (~200+) than exist in all of Egypt.",
      "Was the largest country in Africa until South Sudan seceded in 2011; still the third-largest on the continent.",
      "Shares borders with 7 countries including Egypt, Ethiopia, Eritrea, South Sudan, Chad, Libya, and CAR.",
      "Capital: Khartoum · Population: ~48.1M · Currency: Sudanese pound (SDG)"
    ],
    "neighbors": [
      "Egypt",
      "Eritrea",
      "Ethiopia",
      "South Sudan",
      "Central African Republic",
      "Chad",
      "Libya"
    ]
  },
  {
    "id": "country-quiz-149-south-sudan",
    "country": "South Sudan",
    "name": "South Sudan",
    "isoCode": "SS",
    "flag": "south-sudan",
    "flagUrl": "/flags/south-sudan.svg",
    "flagEmoji": "🇸🇸",
    "capital": "Juba",
    "zone": "africa",
    "subregion": "East Africa",
    "population": "11.1M",
    "currency": "South Sudanese pound (SSP)",
    "languages": [
      "English"
    ],
    "lat": 6.9,
    "lng": 31.3,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Landlocked East-Central African nation and the world's newest widely recognized sovereign country (independent July 9, 2011).",
    "clues": [
      "Landlocked East-Central African nation and the world's newest widely recognized sovereign country (independent July 9, 2011).",
      "Bisected by the White Nile, which forms the vast Sudd wetland—one of the largest tropical freshwater swamps in the world.",
      "Home to massive antelope migrations across Boma and Bandingilo national parks.",
      "Its capital Juba sits on the banks of the White Nile (Bahr al Jabal).",
      "Capital: Juba · Population: ~11.1M · Currency: South Sudanese pound (SSP)"
    ],
    "neighbors": [
      "Sudan",
      "Ethiopia",
      "Kenya",
      "Uganda",
      "DR Congo",
      "Central African Republic"
    ]
  },
  {
    "id": "country-quiz-150-libya",
    "country": "Libya",
    "name": "Libya",
    "isoCode": "LY",
    "flag": "libya",
    "flagUrl": "/flags/libya.svg",
    "flagEmoji": "🇱🇾",
    "capital": "Tripoli",
    "zone": "africa",
    "subregion": "North Africa",
    "population": "6.9M",
    "currency": "Libyan dinar (LYD)",
    "languages": [
      "Arabic"
    ],
    "lat": 26.3,
    "lng": 17.2,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Fourth-largest country in Africa, with the longest Mediterranean coastline of any African nation (~1,770 km) and 90% Saharan desert.",
    "clues": [
      "Fourth-largest country in Africa, with the longest Mediterranean coastline of any African nation (~1,770 km) and 90% Saharan desert.",
      "Comprises three historic regions: Tripolitania in the northwest, Cyrenaica in the east (Benghazi), and Fezzan in the southwest desert.",
      "Home to spectacular Greco-Roman ruins on the Mediterranean coast at Leptis Magna, Sabratha, and Cyrene.",
      "Holds the largest proven crude oil reserves on the African continent.",
      "Capital: Tripoli · Population: ~6.9M · Currency: Libyan dinar (LYD)"
    ],
    "neighbors": [
      "Tunisia",
      "Algeria",
      "Niger",
      "Chad",
      "Sudan",
      "Egypt"
    ]
  },
  {
    "id": "country-quiz-151-mali",
    "country": "Mali",
    "name": "Mali",
    "isoCode": "ML",
    "flag": "mali",
    "flagUrl": "/flags/mali.svg",
    "flagEmoji": "🇲🇱",
    "capital": "Bamako",
    "zone": "africa",
    "subregion": "West Africa",
    "population": "23.3M",
    "currency": "West African CFA franc (XOF)",
    "languages": [
      "Bambara",
      "French"
    ],
    "lat": 17.6,
    "lng": -4,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Large landlocked West African country spanning the Sahara in the north and the Niger River basin in the south.",
    "clues": [
      "Large landlocked West African country spanning the Sahara in the north and the Niger River basin in the south.",
      "Heart of the medieval Mali Empire of Mansa Musa (often cited as the wealthiest individual in history) and the legendary caravan city of Timbuktu.",
      "Famous for the Great Mosque of Djenné—the largest mud-brick (adobe) building in the world—and Bandiagara Escarpment.",
      "Its capital Bamako sits on the rapids of the Niger River.",
      "Capital: Bamako · Population: ~23.3M · Currency: West African CFA franc (XOF)"
    ],
    "neighbors": [
      "Algeria",
      "Niger",
      "Burkina Faso",
      "Côte d'Ivoire",
      "Guinea",
      "Senegal",
      "Mauritania"
    ]
  },
  {
    "id": "country-quiz-152-niger",
    "country": "Niger",
    "name": "Niger",
    "isoCode": "NE",
    "flag": "niger",
    "flagUrl": "/flags/niger.svg",
    "flagEmoji": "🇳🇪",
    "capital": "Niamey",
    "zone": "africa",
    "subregion": "West Africa",
    "population": "27.2M",
    "currency": "West African CFA franc (XOF)",
    "languages": [
      "French",
      "Hausa"
    ],
    "lat": 17.6,
    "lng": 8.1,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Largest landlocked country in West Africa, over 80% covered by the Sahara Desert and Aïr Mountains.",
    "clues": [
      "Largest landlocked country in West Africa, over 80% covered by the Sahara Desert and Aïr Mountains.",
      "Named after the Niger River, which flows through its southwestern corner past the capital Niamey.",
      "Home to the historic Saharan caravan crossroads of Agadez and a major global source of uranium ore.",
      "Has the youngest median age of any population in the world (~15 years old).",
      "Capital: Niamey · Population: ~27.2M · Currency: West African CFA franc (XOF)"
    ],
    "neighbors": [
      "Algeria",
      "Libya",
      "Chad",
      "Nigeria",
      "Benin",
      "Burkina Faso",
      "Mali"
    ]
  },
  {
    "id": "country-quiz-153-chad",
    "country": "Chad",
    "name": "Chad",
    "isoCode": "TD",
    "flag": "chad",
    "flagUrl": "/flags/chad.svg",
    "flagEmoji": "🇹🇩",
    "capital": "N'Djamena",
    "zone": "africa",
    "subregion": "Central Africa",
    "population": "18.3M",
    "currency": "Central African CFA franc (XAF)",
    "languages": [
      "French",
      "Arabic"
    ],
    "lat": 15.5,
    "lng": 18.7,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Large landlocked country at the crossroads of North and Central Africa, stretching from the Tibesti Mountains in the Sahara to fertile southern savannas.",
    "clues": [
      "Large landlocked country at the crossroads of North and Central Africa, stretching from the Tibesti Mountains in the Sahara to fertile southern savannas.",
      "Named after Lake Chad on its western border, a shallow endorheic lake that has shrunk dramatically since the 1960s.",
      "Home to Zakouma National Park and the sandstone arches and crocodile-inhabited desert oasis of the Ennedi Plateau.",
      "Its blue, yellow, and red vertical tricolor is virtually identical to the flag of Romania.",
      "Capital: N'Djamena · Population: ~18.3M · Currency: Central African CFA franc (XAF)"
    ],
    "neighbors": [
      "Libya",
      "Sudan",
      "Central African Republic",
      "Cameroon",
      "Nigeria",
      "Niger"
    ]
  },
  {
    "id": "country-quiz-154-burkina-faso",
    "country": "Burkina Faso",
    "name": "Burkina Faso",
    "isoCode": "BF",
    "flag": "burkina-faso",
    "flagUrl": "/flags/burkina-faso.svg",
    "flagEmoji": "🇧🇫",
    "capital": "Ouagadougou",
    "zone": "africa",
    "subregion": "West Africa",
    "population": "23.3M",
    "currency": "West African CFA franc (XOF)",
    "languages": [
      "French",
      "Mooré"
    ],
    "lat": 12.2,
    "lng": -1.6,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Landlocked Sahelian country in West Africa surrounded by six neighbors inside the bend of the Niger River.",
    "clues": [
      "Landlocked Sahelian country in West Africa surrounded by six neighbors inside the bend of the Niger River.",
      "Formerly the Republic of Upper Volta until Thomas Sankara renamed it Burkina Faso ('Land of Incorruptible People') in 1984.",
      "Its capital Ouagadougou hosts FESPACO, the largest biennial pan-African film and television festival on the continent.",
      "Drained by the Mouhoun (Black), Nakambé (White), and Nazinon (Red) Volta rivers.",
      "Capital: Ouagadougou · Population: ~23.3M · Currency: West African CFA franc (XOF)"
    ],
    "neighbors": [
      "Mali",
      "Niger",
      "Benin",
      "Togo",
      "Ghana",
      "Côte d'Ivoire"
    ]
  },
  {
    "id": "country-quiz-155-somalia",
    "country": "Somalia",
    "name": "Somalia",
    "isoCode": "SO",
    "flag": "somalia",
    "flagUrl": "/flags/somalia.svg",
    "flagEmoji": "🇸🇴",
    "capital": "Mogadishu",
    "zone": "africa",
    "subregion": "East Africa",
    "population": "18.1M",
    "currency": "Somali shilling (SOS)",
    "languages": [
      "Somali",
      "Arabic"
    ],
    "lat": 5.2,
    "lng": 46.2,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Forms the outer '7'-shaped tip of the Horn of Africa along the Gulf of Aden and the Indian Ocean.",
    "clues": [
      "Forms the outer '7'-shaped tip of the Horn of Africa along the Gulf of Aden and the Indian Ocean.",
      "Possesses the longest coastline on the African mainland (~3,025 km).",
      "Home to the ancient Neolithic cave paintings of Laas Geel and centuries of maritime trade in frankincense and myrrh.",
      "Its light-blue flag features a single five-pointed white star representing the five regions inhabited by Somali people.",
      "Capital: Mogadishu · Population: ~18.1M · Currency: Somali shilling (SOS)"
    ],
    "neighbors": [
      "Djibouti",
      "Ethiopia",
      "Kenya"
    ]
  },
  {
    "id": "country-quiz-156-eritrea",
    "country": "Eritrea",
    "name": "Eritrea",
    "isoCode": "ER",
    "flag": "eritrea",
    "flagUrl": "/flags/eritrea.svg",
    "flagEmoji": "🇪🇷",
    "capital": "Asmara",
    "zone": "africa",
    "subregion": "East Africa",
    "population": "3.7M",
    "currency": "Eritrean nakfa (ERN)",
    "languages": [
      "Tigrinya",
      "Arabic",
      "English"
    ],
    "lat": 15.2,
    "lng": 39.8,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Horn of Africa nation stretching ~1,150 km along the southwestern shore of the Red Sea, including the Dahlak Archipelago.",
    "clues": [
      "Horn of Africa nation stretching ~1,150 km along the southwestern shore of the Red Sea, including the Dahlak Archipelago.",
      "Its highland capital Asmara (at 2,325 m) is a UNESCO World Heritage Site renowned for remarkably preserved 1930s Italian modernist/Art Deco architecture.",
      "Gained formal independence from Ethiopia in 1993 after a 30-year struggle.",
      "Contains the scorching Danakil Depression along its southern border.",
      "Capital: Asmara · Population: ~3.7M · Currency: Eritrean nakfa (ERN)"
    ],
    "neighbors": [
      "Sudan",
      "Ethiopia",
      "Djibouti"
    ]
  },
  {
    "id": "country-quiz-157-djibouti",
    "country": "Djibouti",
    "name": "Djibouti",
    "isoCode": "DJ",
    "flag": "djibouti",
    "flagUrl": "/flags/djibouti.svg",
    "flagEmoji": "🇩🇯",
    "capital": "Djibouti",
    "zone": "africa",
    "subregion": "East Africa",
    "population": "1.1M",
    "currency": "Djiboutian franc (DJF)",
    "languages": [
      "French",
      "Arabic"
    ],
    "lat": 11.8,
    "lng": 42.6,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Small strategic country in the Horn of Africa guarding the Bab-el-Mandeb strait between the Red Sea and Gulf of Aden.",
    "clues": [
      "Small strategic country in the Horn of Africa guarding the Bab-el-Mandeb strait between the Red Sea and Gulf of Aden.",
      "Contains Lake Assal (-155 m), a hypersaline crater lake that is the lowest point on the African continent and third-lowest on Earth.",
      "Serves as the primary maritime port for landlocked neighbor Ethiopia and hosts multiple international military bases.",
      "Over two-thirds of the nation's population lives in its eponymous capital city.",
      "Capital: Djibouti · Population: ~1.1M · Currency: Djiboutian franc (DJF)"
    ],
    "neighbors": [
      "Eritrea",
      "Ethiopia",
      "Somalia"
    ]
  },
  {
    "id": "country-quiz-158-malawi",
    "country": "Malawi",
    "name": "Malawi",
    "isoCode": "MW",
    "flag": "malawi",
    "flagUrl": "/flags/malawi.svg",
    "flagEmoji": "🇲🇼",
    "capital": "Lilongwe",
    "zone": "africa",
    "subregion": "Southern / East Africa",
    "population": "20.9M",
    "currency": "Malawian kwacha (MWK)",
    "languages": [
      "English",
      "Chichewa"
    ],
    "lat": -13.3,
    "lng": 34.3,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Narrow landlocked nation in southeastern Africa cradling Lake Malawi (Lake Nyasa), which covers nearly a third of its area.",
    "clues": [
      "Narrow landlocked nation in southeastern Africa cradling Lake Malawi (Lake Nyasa), which covers nearly a third of its area.",
      "Known affectionately as the 'Warm Heart of Africa' and famous for Mount Mulanje and tea estates.",
      "Lake Malawi contains more species of fish—especially colorful cichlids—than any other lake on Earth.",
      "Formerly known as Nyasaland prior to independence in 1964.",
      "Capital: Lilongwe · Population: ~20.9M · Currency: Malawian kwacha (MWK)"
    ],
    "neighbors": [
      "Tanzania",
      "Mozambique",
      "Zambia"
    ]
  },
  {
    "id": "country-quiz-159-lesotho",
    "country": "Lesotho",
    "name": "Lesotho",
    "isoCode": "LS",
    "flag": "lesotho",
    "flagUrl": "/flags/lesotho.svg",
    "flagEmoji": "🇱🇸",
    "capital": "Maseru",
    "zone": "africa",
    "subregion": "Southern Africa",
    "population": "2.3M",
    "currency": "Lesotho loti (LSL)",
    "languages": [
      "Sesotho",
      "English"
    ],
    "lat": -29.6,
    "lng": 28.2,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "High-altitude 'Kingdom in the Sky' completely enclaved within South Africa (one of only three enclaved countries in the world).",
    "clues": [
      "High-altitude 'Kingdom in the Sky' completely enclaved within South Africa (one of only three enclaved countries in the world).",
      "The only independent state on Earth that lies 100% above 1,000 meters in elevation (its lowest point is 1,400 m!).",
      "Famous for the Maloti/Drakensberg mountains, Basotho wool blankets, and the conical mokorotlo straw hat shown on its flag.",
      "Exports hydroelectric power and fresh water to South Africa's Gauteng region.",
      "Capital: Maseru · Population: ~2.3M · Currency: Lesotho loti (LSL)"
    ],
    "neighbors": [
      "South Africa"
    ]
  },
  {
    "id": "country-quiz-160-eswatini",
    "country": "Eswatini",
    "name": "Eswatini",
    "isoCode": "SZ",
    "flag": "eswatini",
    "flagUrl": "/flags/eswatini.svg",
    "flagEmoji": "🇸🇿",
    "capital": "Mbabane",
    "zone": "africa",
    "subregion": "Southern Africa",
    "population": "1.2M",
    "currency": "Swazi lilangeni (SZL)",
    "languages": [
      "Swazi",
      "English"
    ],
    "lat": -26.5,
    "lng": 31.5,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Small landlocked absolute monarchy in Southern Africa bordered by South Africa and Mozambique; formerly known as Swaziland until 2018.",
    "clues": [
      "Small landlocked absolute monarchy in Southern Africa bordered by South Africa and Mozambique; formerly known as Swaziland until 2018.",
      "Features a traditional Nguni shield and spears on its blue, yellow, and crimson flag.",
      "Mbabane is its administrative capital, while Lobamba serves as the royal and legislative capital.",
      "Known for the annual Umhlanga (Reed Dance) cultural festival and Sibebe Rock (a massive exposed granite pluton).",
      "Capital: Mbabane · Population: ~1.2M · Currency: Swazi lilangeni (SZL)"
    ],
    "neighbors": [
      "South Africa",
      "Mozambique"
    ]
  },
  {
    "id": "country-quiz-161-australia",
    "country": "Australia",
    "name": "Australia",
    "isoCode": "AU",
    "flag": "australia",
    "flagUrl": "/flags/australia.svg",
    "flagEmoji": "🇦🇺",
    "capital": "Canberra",
    "zone": "oceania",
    "subregion": "Australia and New Zealand",
    "population": "26.6M",
    "currency": "Australian dollar (AUD)",
    "languages": [
      "English"
    ],
    "lat": -25.3,
    "lng": 133.8,
    "difficulty": "easy",
    "tier": 1,
    "hint": "World's sixth-largest country and the only nation that governs an entire continent (plus the island state of Tasmania).",
    "clues": [
      "World's sixth-largest country and the only nation that governs an entire continent (plus the island state of Tasmania).",
      "Home to the Great Barrier Reef (world's largest coral reef system), the red sandstone monolith of Uluru in the Outback, and the Sydney Opera House.",
      "Unique marsupial and monotreme wildlife including kangaroos, koalas, wombats, and the platypus.",
      "Its inland capital Canberra was purpose-built in 1913 as a compromise between rivals Sydney and Melbourne.",
      "Capital: Canberra · Population: ~26.6M · Currency: Australian dollar (AUD)"
    ],
    "neighbors": [
      "Island continent"
    ]
  },
  {
    "id": "country-quiz-162-new-zealand",
    "country": "New Zealand",
    "name": "New Zealand",
    "isoCode": "NZ",
    "flag": "new-zealand",
    "flagUrl": "/flags/new-zealand.svg",
    "flagEmoji": "🇳🇿",
    "capital": "Wellington",
    "zone": "oceania",
    "subregion": "Australia and New Zealand",
    "population": "5.2M",
    "currency": "New Zealand dollar (NZD)",
    "languages": [
      "English",
      "Māori"
    ],
    "lat": -40.9,
    "lng": 174.9,
    "difficulty": "easy",
    "tier": 1,
    "hint": "Southwestern Pacific island nation consisting of the volcanic North Island and glacier-carved South Island (separated by Cook Strait).",
    "clues": [
      "Southwestern Pacific island nation consisting of the volcanic North Island and glacier-carved South Island (separated by Cook Strait).",
      "Known in Māori as Aotearoa ('Land of the Long White Cloud'); one of the last major landmasses settled by humans (~13th century).",
      "Famous for Milford Sound, the Southern Alps (Aoraki / Mount Cook), flightless kiwi birds, All Blacks rugby, and Lord of the Rings filming locations.",
      "Wellington, at the southern tip of the North Island, is the southernmost national capital in the world.",
      "Capital: Wellington · Population: ~5.2M · Currency: New Zealand dollar (NZD)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-163-papua-new-guinea",
    "country": "Papua New Guinea",
    "name": "Papua New Guinea",
    "isoCode": "PG",
    "flag": "papua-new-guinea",
    "flagUrl": "/flags/papua-new-guinea.svg",
    "flagEmoji": "🇵🇬",
    "capital": "Port Moresby",
    "zone": "oceania",
    "subregion": "Melanesia",
    "population": "10.3M",
    "currency": "Papua New Guinean kina (PGK)",
    "languages": [
      "English",
      "Tok Pisin",
      "Hiri Motu"
    ],
    "lat": -6.3,
    "lng": 143.9,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Occupies the eastern half of New Guinea (world's second-largest island) plus New Britain, New Ireland, and Bougainville in Melanesia.",
    "clues": [
      "Occupies the eastern half of New Guinea (world's second-largest island) plus New Britain, New Ireland, and Bougainville in Melanesia.",
      "The most linguistically diverse country on Earth, with over 840 living indigenous languages spoken across rugged highland valleys.",
      "Famous for the Kokoda Track, Rabaul volcanoes, and the Raggiana bird-of-paradise depicted on its black-and-red flag.",
      "Shares its only land border with Indonesia's Papua provinces along the 141st meridian east.",
      "Capital: Port Moresby · Population: ~10.3M · Currency: Papua New Guinean kina (PGK)"
    ],
    "neighbors": [
      "Indonesia"
    ]
  },
  {
    "id": "country-quiz-164-fiji",
    "country": "Fiji",
    "name": "Fiji",
    "isoCode": "FJ",
    "flag": "fiji",
    "flagUrl": "/flags/fiji.svg",
    "flagEmoji": "🇫🇯",
    "capital": "Suva",
    "zone": "oceania",
    "subregion": "Melanesia",
    "population": "936K",
    "currency": "Fijian dollar (FJD)",
    "languages": [
      "English",
      "Fijian",
      "Fiji Hindi"
    ],
    "lat": -17.7,
    "lng": 178.1,
    "difficulty": "hard",
    "tier": 3,
    "hint": "South Pacific archipelago of over 330 islands (about 110 inhabited), dominated by Viti Levu and Vanua Levu.",
    "clues": [
      "South Pacific archipelago of over 330 islands (about 110 inhabited), dominated by Viti Levu and Vanua Levu.",
      "Serves as a major transport, educational, and economic hub of the South Pacific; crossed by the 180th meridian on Taveuni.",
      "World power in Rugby Sevens (winning Fiji's first Olympic gold medals in 2016 and 2020) and famed for kava ceremonies and soft coral reefs.",
      "Suva on Viti Levu is the capital, while Nadi on the west coast hosts the main international airport.",
      "Capital: Suva · Population: ~936K · Currency: Fijian dollar (FJD)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-165-solomon-islands",
    "country": "Solomon Islands",
    "name": "Solomon Islands",
    "isoCode": "SB",
    "flag": "solomon-islands",
    "flagUrl": "/flags/solomon-islands.svg",
    "flagEmoji": "🇸🇧",
    "capital": "Honiara",
    "zone": "oceania",
    "subregion": "Melanesia",
    "population": "740K",
    "currency": "Solomon Islands dollar (SBD)",
    "languages": [
      "English"
    ],
    "lat": -9.6,
    "lng": 160.2,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Melanesian nation of six major islands and over 900 smaller islands east of Papua New Guinea.",
    "clues": [
      "Melanesian nation of six major islands and over 900 smaller islands east of Papua New Guinea.",
      "Its largest island, Guadalcanal (home to capital Honiara), was the site of a pivotal World War II Pacific campaign in 1942–1943.",
      "Includes East Rennell, the largest raised coral atoll in the world and a UNESCO World Heritage Site.",
      "Commonwealth realm with a blue-and-green diagonal flag divided by a yellow stripe and five white stars.",
      "Capital: Honiara · Population: ~740K · Currency: Solomon Islands dollar (SBD)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-166-vanuatu",
    "country": "Vanuatu",
    "name": "Vanuatu",
    "isoCode": "VU",
    "flag": "vanuatu",
    "flagUrl": "/flags/vanuatu.svg",
    "flagEmoji": "🇻🇺",
    "capital": "Port Vila",
    "zone": "oceania",
    "subregion": "Melanesia",
    "population": "335K",
    "currency": "Vanuatu vatu (VUV)",
    "languages": [
      "Bislama",
      "English",
      "French"
    ],
    "lat": -15.4,
    "lng": 166.9,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Y-shaped volcanic archipelago of 83 islands in Melanesia, formerly the Anglo-French Condominium of the New Hebrides until 1980.",
    "clues": [
      "Y-shaped volcanic archipelago of 83 islands in Melanesia, formerly the Anglo-French Condominium of the New Hebrides until 1980.",
      "Home to Mount Yasur on Tanna Island (one of the world's most accessible active volcanoes) and Pentecost Island's Naghol land-diving ritual (precursor to bungee jumping).",
      "Features a curved boar's tusk and crossed namele fern fronds inside a black triangle on its flag.",
      "Port Vila sits on the island of Efate.",
      "Capital: Port Vila · Population: ~335K · Currency: Vanuatu vatu (VUV)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-167-samoa",
    "country": "Samoa",
    "name": "Samoa",
    "isoCode": "WS",
    "flag": "samoa",
    "flagUrl": "/flags/samoa.svg",
    "flagEmoji": "🇼🇸",
    "capital": "Apia",
    "zone": "oceania",
    "subregion": "Polynesia",
    "population": "225K",
    "currency": "Samoan tālā (WST)",
    "languages": [
      "Samoan",
      "English"
    ],
    "lat": -13.8,
    "lng": -172.1,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Polynesian island nation consisting of two main volcanic islands—Savai'i and Upolu (home to capital Apia)—and smaller islets.",
    "clues": [
      "Polynesian island nation consisting of two main volcanic islands—Savai'i and Upolu (home to capital Apia)—and smaller islets.",
      "Cradle of 3,000-year-old Lapita/Polynesian navigation culture (Fa'a Sāmoa) and traditional pe'a tattooing.",
      "In December 2011, it skipped an entire calendar day by shifting west across the International Date Line to align trade hours with Australia and New Zealand.",
      "Final home and resting place of Scottish author Robert Louis Stevenson ('Tusitala') at Vailima above Apia.",
      "Capital: Apia · Population: ~225K · Currency: Samoan tālā (WST)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-168-tonga",
    "country": "Tonga",
    "name": "Tonga",
    "isoCode": "TO",
    "flag": "tonga",
    "flagUrl": "/flags/tonga.svg",
    "flagEmoji": "🇹🇴",
    "capital": "Nuku'alofa",
    "zone": "oceania",
    "subregion": "Polynesia",
    "population": "107K",
    "currency": "Tongan pa'anga (TOP)",
    "languages": [
      "Tongan",
      "English"
    ],
    "lat": -21.2,
    "lng": -175.2,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Polynesian archipelago of 171 islands known as the 'Friendly Islands' (named by Captain James Cook in 1773).",
    "clues": [
      "Polynesian archipelago of 171 islands known as the 'Friendly Islands' (named by Captain James Cook in 1773).",
      "The only Pacific island nation that never formally ceded its indigenous sovereignty to a foreign colonial power, remaining an independent Kingdom.",
      "Home to the prehistoric Ha'amonga 'a Maui coral trilithon arch on the main island of Tongatapu.",
      "Site of the massive January 2022 Hunga Tonga–Hunga Ha'apai submarine volcanic eruption.",
      "Capital: Nuku'alofa · Population: ~107K · Currency: Tongan pa'anga (TOP)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-169-kiribati",
    "country": "Kiribati",
    "name": "Kiribati",
    "isoCode": "KI",
    "flag": "kiribati",
    "flagUrl": "/flags/kiribati.svg",
    "flagEmoji": "🇰🇮",
    "capital": "Tarawa",
    "zone": "oceania",
    "subregion": "Micronesia / Polynesia",
    "population": "133K",
    "currency": "Australian dollar (AUD)",
    "languages": [
      "English",
      "Gilbertese"
    ],
    "lat": 1.9,
    "lng": -157.4,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Consists of 32 coral atolls and one raised coral island (Banaba) scattered across 3.5 million km² of the central Pacific.",
    "clues": [
      "Consists of 32 coral atolls and one raised coral island (Banaba) scattered across 3.5 million km² of the central Pacific.",
      "The only country in the world situated in all four hemispheres (Northern, Southern, Eastern, and Western) as it straddles both the Equator and the 180th meridian.",
      "Includes Kiritimati (Christmas Island), the largest coral atoll by land area on Earth and the first inhabited place to welcome each New Year (UTC+14).",
      "Its flag depicts a yellow frigatebird flying over a rising sun and blue-and-white ocean waves.",
      "Capital: Tarawa · Population: ~133K · Currency: Australian dollar (AUD)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-170-tuvalu",
    "country": "Tuvalu",
    "name": "Tuvalu",
    "isoCode": "TV",
    "flag": "tuvalu",
    "flagUrl": "/flags/tuvalu.svg",
    "flagEmoji": "🇹🇻",
    "capital": "Funafuti",
    "zone": "oceania",
    "subregion": "Polynesia",
    "population": "11.4K",
    "currency": "Tuvaluan dollar / AUD",
    "languages": [
      "Tuvaluan",
      "English"
    ],
    "lat": -7.1,
    "lng": 177.6,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Polynesian nation of nine low-lying coral islands and atolls midway between Hawaii and Australia.",
    "clues": [
      "Polynesian nation of nine low-lying coral islands and atolls midway between Hawaii and Australia.",
      "Fourth-smallest sovereign country in the world by land area (26 km²) and second-least populous after Vatican City.",
      "Generates a substantial portion of its national government revenue by licensing its coveted '.tv' country-code internet domain.",
      "Formerly known as the Ellice Islands before separating from the Gilbert Islands (Kiribati) and gaining independence in 1978.",
      "Capital: Funafuti · Population: ~11.4K · Currency: Tuvaluan dollar / AUD"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-171-micronesia",
    "country": "Micronesia",
    "name": "Micronesia",
    "isoCode": "FM",
    "flag": "micronesia",
    "flagUrl": "/flags/micronesia.svg",
    "flagEmoji": "🇫🇲",
    "capital": "Palikir",
    "zone": "oceania",
    "subregion": "Micronesia",
    "population": "115K",
    "currency": "United States dollar (USD)",
    "languages": [
      "English"
    ],
    "lat": 6.9,
    "lng": 158.2,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Federated States of Micronesia (FSM) comprises four island states—Yap, Chuuk, Pohnpei (home to capital Palikir), and Kosrae—across over 600 islands.",
    "clues": [
      "Federated States of Micronesia (FSM) comprises four island states—Yap, Chuuk, Pohnpei (home to capital Palikir), and Kosrae—across over 600 islands.",
      "Home to Nan Madol on Pohnpei, a ruined ancient city built atop artificial basalt-log islets ('Venice of the Pacific').",
      "Yap is famous for Rai stones—giant carved limestone disks used as traditional ceremonial money—and Chuuk Lagoon is a world-renowned WWII wreck-diving site.",
      "In a Compact of Free Association with the United States and uses the US dollar.",
      "Capital: Palikir · Population: ~115K · Currency: United States dollar (USD)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-172-marshall-islands",
    "country": "Marshall Islands",
    "name": "Marshall Islands",
    "isoCode": "MH",
    "flag": "marshall-islands",
    "flagUrl": "/flags/marshall-islands.svg",
    "flagEmoji": "🇲🇭",
    "capital": "Majuro",
    "zone": "oceania",
    "subregion": "Micronesia",
    "population": "42K",
    "currency": "United States dollar (USD)",
    "languages": [
      "Marshallese",
      "English"
    ],
    "lat": 7.1,
    "lng": 171.2,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Micronesian republic of 29 coral atolls and 5 islands arranged in two parallel chains: Ratak ('Sunrise') and Ralik ('Sunset').",
    "clues": [
      "Micronesian republic of 29 coral atolls and 5 islands arranged in two parallel chains: Ratak ('Sunrise') and Ralik ('Sunset').",
      "Includes Bikini and Enewetak atolls (sites of post-WWII US nuclear testing) and Kwajalein, one of the largest coral lagoons on Earth.",
      "Renowned for traditional Marshallese stick charts built from coconut fronds and shells to map ocean swell refraction between atolls.",
      "One of the world's largest maritime ship-registry nations.",
      "Capital: Majuro · Population: ~42K · Currency: United States dollar (USD)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-173-palau",
    "country": "Palau",
    "name": "Palau",
    "isoCode": "PW",
    "flag": "palau",
    "flagUrl": "/flags/palau.svg",
    "flagEmoji": "🇵🇼",
    "capital": "Ngerulmud",
    "zone": "oceania",
    "subregion": "Micronesia",
    "population": "18K",
    "currency": "United States dollar (USD)",
    "languages": [
      "Palauan",
      "English"
    ],
    "lat": 7.5,
    "lng": 134.6,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Western Pacific archipelago of over 300 islands in the Caroline chain, famous for the mushroom-shaped limestone Rock Islands and Jellyfish Lake.",
    "clues": [
      "Western Pacific archipelago of over 300 islands in the Caroline chain, famous for the mushroom-shaped limestone Rock Islands and Jellyfish Lake.",
      "In 2006, it moved its capital from Koror to Ngerulmud on Babeldaob Island—making Ngerulmud the least populous national capital seat in the world.",
      "Created the world's first shark sanctuary in 2009 and requires visitors to sign the eco-focused 'Palau Pledge' stamped into their passports.",
      "Its flag features a golden full moon offset on a sky-blue field representing the Pacific Ocean.",
      "Capital: Ngerulmud · Population: ~18K · Currency: United States dollar (USD)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-174-nauru",
    "country": "Nauru",
    "name": "Nauru",
    "isoCode": "NR",
    "flag": "nauru",
    "flagUrl": "/flags/nauru.svg",
    "flagEmoji": "🇳🇷",
    "capital": "Yaren",
    "zone": "oceania",
    "subregion": "Micronesia",
    "population": "12.8K",
    "currency": "Australian dollar (AUD)",
    "languages": [
      "Nauruan",
      "English"
    ],
    "lat": -0.52,
    "lng": 166.93,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Single oval-shaped raised coral island in Micronesia just 55 km south of the Equator.",
    "clues": [
      "Single oval-shaped raised coral island in Micronesia just 55 km south of the Equator.",
      "Third-smallest country in the world by area (21 km², after Vatican City and Monaco) and the smallest independent republic on Earth.",
      "Has no official de jure capital city, though government buildings and parliament sit in the southern district of Yaren.",
      "Once boasted the world's highest GDP per capita in the 1970s from rich guano phosphate mining across its central plateau.",
      "Capital: Yaren · Population: ~12.8K · Currency: Australian dollar (AUD)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-175-burundi",
    "country": "Burundi",
    "name": "Burundi",
    "isoCode": "BI",
    "flag": "burundi",
    "flagUrl": "/flags/burundi.svg",
    "flagEmoji": "🇧🇮",
    "capital": "Gitega",
    "zone": "africa",
    "subregion": "East Africa",
    "population": "13.2M",
    "currency": "Burundian franc (BIF)",
    "languages": [
      "Kirundi",
      "French"
    ],
    "lat": -3.4,
    "lng": 29.9,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Small landlocked country in the African Great Lakes region cradling the northeastern shore of Lake Tanganyika.",
    "clues": [
      "Small landlocked country in the African Great Lakes region cradling the northeastern shore of Lake Tanganyika.",
      "Bujumbura on Lake Tanganyika is its largest city and economic hub, while central Gitega became the political capital in 2019.",
      "Renowned for the UNESCO-listed Royal Drummers of Burundi and the southernmost headwater source of the Nile.",
      "Shares deep cultural and linguistic ties with neighboring Rwanda.",
      "Capital: Gitega · Population: ~13.2M · Currency: Burundian franc (BIF)"
    ],
    "neighbors": [
      "Rwanda",
      "Tanzania",
      "DR Congo"
    ]
  },
  {
    "id": "country-quiz-176-benin",
    "country": "Benin",
    "name": "Benin",
    "isoCode": "BJ",
    "flag": "benin",
    "flagUrl": "/flags/benin.svg",
    "flagEmoji": "🇧🇯",
    "capital": "Porto-Novo",
    "zone": "africa",
    "subregion": "West Africa",
    "population": "13.7M",
    "currency": "West African CFA franc (XOF)",
    "languages": [
      "French"
    ],
    "lat": 9.3,
    "lng": 2.3,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Keyhole-shaped West African country on the Bight of Benin between Togo and Nigeria.",
    "clues": [
      "Keyhole-shaped West African country on the Bight of Benin between Togo and Nigeria.",
      "Historic heart of the Kingdom of Dahomey (Royal Palaces of Abomey) and the birthplace of the Vodun (Voodoo) religion in Ouidah.",
      "Porto-Novo is the official capital, while Cotonou is the largest city and seat of government.",
      "Features Ganvié on Lake Nokoué, a large stilt village dubbed the 'Venice of Africa'.",
      "Capital: Porto-Novo · Population: ~13.7M · Currency: West African CFA franc (XOF)"
    ],
    "neighbors": [
      "Togo",
      "Burkina Faso",
      "Niger",
      "Nigeria"
    ]
  },
  {
    "id": "country-quiz-177-togo",
    "country": "Togo",
    "name": "Togo",
    "isoCode": "TG",
    "flag": "togo",
    "flagUrl": "/flags/togo.svg",
    "flagEmoji": "🇹🇬",
    "capital": "Lomé",
    "zone": "africa",
    "subregion": "West Africa",
    "population": "9.1M",
    "currency": "West African CFA franc (XOF)",
    "languages": [
      "French"
    ],
    "lat": 8.6,
    "lng": 0.8,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Narrow West African strip averaging just 115 km wide, stretching 550 km north from the Gulf of Guinea to Burkina Faso.",
    "clues": [
      "Narrow West African strip averaging just 115 km wide, stretching 550 km north from the Gulf of Guinea to Burkina Faso.",
      "Its capital Lomé sits directly on the southwestern border with Ghana.",
      "Home to Koutammakou, the Land of the Batammariba, famous for two-story mud tower-houses (Takienta).",
      "Major global exporter of phosphate rock.",
      "Capital: Lomé · Population: ~9.1M · Currency: West African CFA franc (XOF)"
    ],
    "neighbors": [
      "Ghana",
      "Burkina Faso",
      "Benin"
    ]
  },
  {
    "id": "country-quiz-178-sierra-leone",
    "country": "Sierra Leone",
    "name": "Sierra Leone",
    "isoCode": "SL",
    "flag": "sierra-leone",
    "flagUrl": "/flags/sierra-leone.svg",
    "flagEmoji": "🇸🇱",
    "capital": "Freetown",
    "zone": "africa",
    "subregion": "West Africa",
    "population": "8.8M",
    "currency": "Sierra Leonean leone (SLE)",
    "languages": [
      "English"
    ],
    "lat": 8.5,
    "lng": -11.8,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Coastal West African nation whose name come from Portuguese 'Serra Leoa' ('Lion Mountains').",
    "clues": [
      "Coastal West African nation whose name come from Portuguese 'Serra Leoa' ('Lion Mountains').",
      "Its capital Freetown was founded in 1792 as a home for freed formerly enslaved peoples and boasts one of the world's largest natural harbors.",
      "Rich in alluvial diamonds, titanium ore (rutile), and bauxite, with white-sand beaches on the Freetown Peninsula.",
      "Bordered by Guinea to the north and east and Liberia to the southeast.",
      "Capital: Freetown · Population: ~8.8M · Currency: Sierra Leonean leone (SLE)"
    ],
    "neighbors": [
      "Guinea",
      "Liberia"
    ]
  },
  {
    "id": "country-quiz-179-liberia",
    "country": "Liberia",
    "name": "Liberia",
    "isoCode": "LR",
    "flag": "liberia",
    "flagUrl": "/flags/liberia.svg",
    "flagEmoji": "🇱🇷",
    "capital": "Monrovia",
    "zone": "africa",
    "subregion": "West Africa",
    "population": "5.4M",
    "currency": "Liberian dollar (LRD)",
    "languages": [
      "English"
    ],
    "lat": 6.4,
    "lng": -9.4,
    "difficulty": "hard",
    "tier": 3,
    "hint": "West African coastal republic founded in 1822 by freed African Americans and declared independent in 1847—Africa's oldest modern republic.",
    "clues": [
      "West African coastal republic founded in 1822 by freed African Americans and declared independent in 1847—Africa's oldest modern republic.",
      "Its capital Monrovia is one of only two world capitals named after a US President (James Monroe).",
      "Home to Sapo National Park, preserving a vast tract of Upper Guinean rainforest and pygmy hippos.",
      "Maintains one of the largest merchant shipping registries ('flags of convenience') in the world.",
      "Capital: Monrovia · Population: ~5.4M · Currency: Liberian dollar (LRD)"
    ],
    "neighbors": [
      "Sierra Leone",
      "Guinea",
      "Côte d'Ivoire"
    ]
  },
  {
    "id": "country-quiz-180-guinea",
    "country": "Guinea",
    "name": "Guinea",
    "isoCode": "GN",
    "flag": "guinea",
    "flagUrl": "/flags/guinea.svg",
    "flagEmoji": "🇬🇳",
    "capital": "Conakry",
    "zone": "africa",
    "subregion": "West Africa",
    "population": "14.2M",
    "currency": "Guinean franc (GNF)",
    "languages": [
      "French"
    ],
    "lat": 9.9,
    "lng": -9.7,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Crescent-shaped West African country often called the 'Water Tower of West Africa' as the source of the Niger, Senegal, and Gambia rivers.",
    "clues": [
      "Crescent-shaped West African country often called the 'Water Tower of West Africa' as the source of the Niger, Senegal, and Gambia rivers.",
      "Possesses the world's largest proven reserves of bauxite (aluminum ore) and high-grade iron ore at Simandou.",
      "Its capital Conakry stretches along the narrow Kaloum Peninsula jutting into the Atlantic.",
      "First French sub-Saharan African colony to vote for immediate independence in 1958.",
      "Capital: Conakry · Population: ~14.2M · Currency: Guinean franc (GNF)"
    ],
    "neighbors": [
      "Guinea-Bissau",
      "Senegal",
      "Mali",
      "Côte d'Ivoire",
      "Liberia",
      "Sierra Leone"
    ]
  },
  {
    "id": "country-quiz-181-guinea-bissau",
    "country": "Guinea-Bissau",
    "name": "Guinea-Bissau",
    "isoCode": "GW",
    "flag": "guinea-bissau",
    "flagUrl": "/flags/guinea-bissau.svg",
    "flagEmoji": "🇬🇼",
    "capital": "Bissau",
    "zone": "africa",
    "subregion": "West Africa",
    "population": "2.2M",
    "currency": "West African CFA franc (XOF)",
    "languages": [
      "Portuguese"
    ],
    "lat": 11.8,
    "lng": -15.2,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Small Portuguese-speaking country on the West African Atlantic coast between Senegal and Guinea.",
    "clues": [
      "Small Portuguese-speaking country on the West African Atlantic coast between Senegal and Guinea.",
      "Includes the pristine Bijagós Archipelago of 88 islands, home to rare saltwater-swimming hippos and sacred matriarchal traditions.",
      "Major exporter of raw cashew nuts, which provide livelihoods for most rural households.",
      "Added its capital's name ('-Bissau') upon independence in 1974 to distinguish itself from neighboring Guinea.",
      "Capital: Bissau · Population: ~2.2M · Currency: West African CFA franc (XOF)"
    ],
    "neighbors": [
      "Senegal",
      "Guinea"
    ]
  },
  {
    "id": "country-quiz-182-gambia",
    "country": "Gambia",
    "name": "Gambia",
    "isoCode": "GM",
    "flag": "gambia",
    "flagUrl": "/flags/gambia.svg",
    "flagEmoji": "🇬🇲",
    "capital": "Banjul",
    "zone": "africa",
    "subregion": "West Africa",
    "population": "2.8M",
    "currency": "Gambian dalasi (GMD)",
    "languages": [
      "English"
    ],
    "lat": 13.4,
    "lng": -15.3,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Smallest country on the African mainland, shaped like a narrow finger (never wider than 50 km) following the lower Gambia River.",
    "clues": [
      "Smallest country on the African mainland, shaped like a narrow finger (never wider than 50 km) following the lower Gambia River.",
      "Completely surrounded on land by Senegal except for its short 80-km Atlantic Ocean coastline.",
      "Its capital Banjul sits on St. Mary's Island where the Gambia River enters the Atlantic.",
      "Home to Kunta Kinteh Island (formerly James Island) and over 500 species of tropical birds.",
      "Capital: Banjul · Population: ~2.8M · Currency: Gambian dalasi (GMD)"
    ],
    "neighbors": [
      "Senegal"
    ]
  },
  {
    "id": "country-quiz-183-mauritania",
    "country": "Mauritania",
    "name": "Mauritania",
    "isoCode": "MR",
    "flag": "mauritania",
    "flagUrl": "/flags/mauritania.svg",
    "flagEmoji": "🇲🇷",
    "capital": "Nouakchott",
    "zone": "africa",
    "subregion": "West / North Africa",
    "population": "4.9M",
    "currency": "Mauritanian ouguiya (MRU)",
    "languages": [
      "Arabic"
    ],
    "lat": 21,
    "lng": -10.9,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Vast Saharan desert nation bridging the Arab Maghreb and sub-Saharan West Africa along the Atlantic coast.",
    "clues": [
      "Vast Saharan desert nation bridging the Arab Maghreb and sub-Saharan West Africa along the Atlantic coast.",
      "Home to the Richat Structure ('Eye of the Sahara'), a 40-km concentric geological dome clearly visible from space.",
      "Operates the Mauritania Railway iron-ore train, one of the longest and heaviest freight trains in the world (up to 3 km long).",
      "Features ancient Saharan caravan libraries at Chinguetti and wading bird sanctuaries at Banc d'Arguin.",
      "Capital: Nouakchott · Population: ~4.9M · Currency: Mauritanian ouguiya (MRU)"
    ],
    "neighbors": [
      "Morocco",
      "Algeria",
      "Mali",
      "Senegal"
    ]
  },
  {
    "id": "country-quiz-184-cape-verde",
    "country": "Cape Verde",
    "name": "Cape Verde",
    "isoCode": "CV",
    "flag": "cape-verde",
    "flagUrl": "/flags/cape-verde.svg",
    "flagEmoji": "🇨🇻",
    "capital": "Praia",
    "zone": "africa",
    "subregion": "West Africa / Atlantic",
    "population": "598K",
    "currency": "Cape Verdean escudo (CVE)",
    "languages": [
      "Portuguese"
    ],
    "lat": 16,
    "lng": -24,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Horseshoe-shaped volcanic archipelago of 10 islands (9 inhabited) located 570 km off the coast of Senegal in the central Atlantic.",
    "clues": [
      "Horseshoe-shaped volcanic archipelago of 10 islands (9 inhabited) located 570 km off the coast of Senegal in the central Atlantic.",
      "Divided into the Barlavento (windward) and Sotavento (leeward) island groups; highest peak is the active volcano Pico do Fogo.",
      "Famous for soulful morna music popularized globally by 'Barefoot Diva' Cesária Évora.",
      "Uninhabited until Portuguese explorers arrived in the 1450s.",
      "Capital: Praia · Population: ~598K · Currency: Cape Verdean escudo (CVE)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-185-gabon",
    "country": "Gabon",
    "name": "Gabon",
    "isoCode": "GA",
    "flag": "gabon",
    "flagUrl": "/flags/gabon.svg",
    "flagEmoji": "🇬🇦",
    "capital": "Libreville",
    "zone": "africa",
    "subregion": "Central Africa",
    "population": "2.4M",
    "currency": "Central African CFA franc (XAF)",
    "languages": [
      "French"
    ],
    "lat": -0.8,
    "lng": 11.6,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Equatorial Central African nation on the Atlantic coast covered nearly 88% by dense Congo Basin rainforest.",
    "clues": [
      "Equatorial Central African nation on the Atlantic coast covered nearly 88% by dense Congo Basin rainforest.",
      "Home to Loango National Park, where forest elephants, gorillas, and hippos famously walk onto wild Atlantic beaches.",
      "Its capital Libreville ('Free Town') was founded in 1849 by freed enslaved people from a captured slave ship.",
      "Oil wealth and low population give it one of sub-Saharan Africa's highest per-capita incomes.",
      "Capital: Libreville · Population: ~2.4M · Currency: Central African CFA franc (XAF)"
    ],
    "neighbors": [
      "Equatorial Guinea",
      "Cameroon",
      "Republic of the Congo"
    ]
  },
  {
    "id": "country-quiz-186-republic-of-the-congo",
    "country": "Republic of the Congo",
    "name": "Republic of the Congo",
    "isoCode": "CG",
    "flag": "republic-congo",
    "flagUrl": "/flags/republic-congo.svg",
    "flagEmoji": "🇨🇬",
    "capital": "Brazzaville",
    "zone": "africa",
    "subregion": "Central Africa",
    "population": "6.1M",
    "currency": "Central African CFA franc (XAF)",
    "languages": [
      "French"
    ],
    "lat": -0.2,
    "lng": 15.8,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Central African nation straddling the Equator, often called Congo-Brazzaville to distinguish it from its larger eastern neighbor.",
    "clues": [
      "Central African nation straddling the Equator, often called Congo-Brazzaville to distinguish it from its larger eastern neighbor.",
      "Brazzaville sits directly across the Congo River from Kinshasa—the world's closest pair of national capitals outside Rome/Vatican.",
      "Preserves vast intact tropical peatlands and western lowland gorillas in Odzala-Kokoua National Park.",
      "Pointe-Noire on the Atlantic is its oil industry hub and main deep-water port.",
      "Capital: Brazzaville · Population: ~6.1M · Currency: Central African CFA franc (XAF)"
    ],
    "neighbors": [
      "Gabon",
      "Cameroon",
      "Central African Republic",
      "DR Congo",
      "Angola"
    ]
  },
  {
    "id": "country-quiz-187-central-african-republic",
    "country": "Central African Republic",
    "name": "Central African Republic",
    "isoCode": "CF",
    "flag": "central-african-republic",
    "flagUrl": "/flags/central-african-republic.svg",
    "flagEmoji": "🇨🇫",
    "capital": "Bangui",
    "zone": "africa",
    "subregion": "Central Africa",
    "population": "5.7M",
    "currency": "Central African CFA franc (XAF)",
    "languages": [
      "Sango",
      "French"
    ],
    "lat": 6.6,
    "lng": 20.9,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Landlocked nation in the geographic heart of Africa between the Congo River basin and the Lake Chad basin.",
    "clues": [
      "Landlocked nation in the geographic heart of Africa between the Congo River basin and the Lake Chad basin.",
      "Its capital Bangui sits on the northern bank of the Ubangi River along the border with DR Congo.",
      "Home to Dzanga-Sangha Special Reserve, famous for forest clearings (bais) where over a hundred forest elephants gather daily.",
      "One of the least light-polluted countries on Earth and rich in alluvial diamonds and timber.",
      "Capital: Bangui · Population: ~5.7M · Currency: Central African CFA franc (XAF)"
    ],
    "neighbors": [
      "Chad",
      "Sudan",
      "South Sudan",
      "DR Congo",
      "Republic of the Congo",
      "Cameroon"
    ]
  },
  {
    "id": "country-quiz-188-equatorial-guinea",
    "country": "Equatorial Guinea",
    "name": "Equatorial Guinea",
    "isoCode": "GQ",
    "flag": "equatorial-guinea",
    "flagUrl": "/flags/equatorial-guinea.svg",
    "flagEmoji": "🇬🇶",
    "capital": "Malabo",
    "zone": "africa",
    "subregion": "Central Africa",
    "population": "1.7M",
    "currency": "Central African CFA franc (XAF)",
    "languages": [
      "Spanish",
      "French",
      "Portuguese"
    ],
    "lat": 1.7,
    "lng": 10.3,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Central African nation consisting of a mainland section (Río Muni) and five volcanic islands, notably Bioko.",
    "clues": [
      "Central African nation consisting of a mainland section (Río Muni) and five volcanic islands, notably Bioko.",
      "The only sovereign country in Africa where Spanish is an official language.",
      "Uniquely, its capital Malabo sits on offshore Bioko Island (near Cameroon) rather than on its larger continental mainland, though a new mainland city (Ciudad de la Paz) is under construction.",
      "Despite its name, the Equator actually passes slightly south of its mainland, between Río Muni and tiny Annobón Island.",
      "Capital: Malabo · Population: ~1.7M · Currency: Central African CFA franc (XAF)"
    ],
    "neighbors": [
      "Cameroon",
      "Gabon"
    ]
  },
  {
    "id": "country-quiz-189-comoros",
    "country": "Comoros",
    "name": "Comoros",
    "isoCode": "KM",
    "flag": "comoros",
    "flagUrl": "/flags/comoros.svg",
    "flagEmoji": "🇰🇲",
    "capital": "Moroni",
    "zone": "africa",
    "subregion": "East Africa / Indian Ocean",
    "population": "850K",
    "currency": "Comorian franc (KMF)",
    "languages": [
      "Comorian",
      "Arabic",
      "French"
    ],
    "lat": -11.9,
    "lng": 43.3,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Volcanic archipelago of three main islands (Grande Comore, Mohéli, Anjouan) at the northern mouth of the Mozambique Channel.",
    "clues": [
      "Volcanic archipelago of three main islands (Grande Comore, Mohéli, Anjouan) at the northern mouth of the Mozambique Channel.",
      "Known as the 'Perfume Islands' as the world's leading producer of ylang-ylang essence (used in luxury perfumes like Chanel No. 5), plus cloves and vanilla.",
      "Capital Moroni sits at the foot of Mount Karthala, a massive active shield volcano.",
      "Only nation that is a member of both the African Union and the Arab League located entirely in the Southern Hemisphere.",
      "Capital: Moroni · Population: ~850K · Currency: Comorian franc (KMF)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-190-sao-tome-and-principe",
    "country": "São Tomé and Príncipe",
    "name": "São Tomé and Príncipe",
    "isoCode": "ST",
    "flag": "sao-tome-and-principe",
    "flagUrl": "/flags/sao-tome-and-principe.svg",
    "flagEmoji": "🇸🇹",
    "capital": "São Tomé",
    "zone": "africa",
    "subregion": "Central Africa / Gulf of Guinea",
    "population": "232K",
    "currency": "São Tomé and Príncipe dobra (STN)",
    "languages": [
      "Portuguese"
    ],
    "lat": 0.2,
    "lng": 6.6,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Second-smallest African country, consisting of two volcanic archipelago islands in the Gulf of Guinea straddling the Equator.",
    "clues": [
      "Second-smallest African country, consisting of two volcanic archipelago islands in the Gulf of Guinea straddling the Equator.",
      "Famous for the dramatic needle-like volcanic plug of Pico Cão Grande rising 663 meters out of the jungle.",
      "In the early 20th century, it was the largest producer of cocoa in the world ('The Chocolate Islands').",
      "In 1919, British astronomer Arthur Eddington photographed a solar eclipse on Príncipe, providing the first experimental proof of Einstein's general relativity.",
      "Capital: São Tomé · Population: ~232K · Currency: São Tomé and Príncipe dobra (STN)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-191-puerto-rico",
    "country": "Puerto Rico",
    "name": "Puerto Rico",
    "isoCode": "PR",
    "flag": "puerto-rico",
    "flagUrl": "/flags/puerto-rico.svg",
    "flagEmoji": "🇵🇷",
    "capital": "San Juan",
    "zone": "americas",
    "subregion": "Caribbean",
    "population": "3.2M",
    "currency": "United States dollar (USD)",
    "languages": [
      "Spanish",
      "English"
    ],
    "lat": 18.2,
    "lng": -66.6,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Caribbean island territory of the United States located east of Hispaniola at the edge of the Greater Antilles.",
    "clues": [
      "Caribbean island territory of the United States located east of Hispaniola at the edge of the Greater Antilles.",
      "Famous for blue-cobblestone Old San Juan, the 16th-century El Morro fortress, El Yunque tropical rainforest, and bioluminescent bays.",
      "Global powerhouse in reggaeton and Latin trap music (Bad Bunny, Daddy Yankee) and salsa.",
      "Just north of its coast lies the Puerto Rico Trench, the deepest point in the entire Atlantic Ocean (8,376 m).",
      "Capital: San Juan · Population: ~3.2M · Currency: United States dollar (USD)"
    ],
    "neighbors": [
      "Island territory"
    ]
  },
  {
    "id": "country-quiz-192-greenland",
    "country": "Greenland",
    "name": "Greenland",
    "isoCode": "GL",
    "flag": "greenland",
    "flagUrl": "/flags/greenland.svg",
    "flagEmoji": "🇬🇱",
    "capital": "Nuuk",
    "zone": "americas",
    "subregion": "North America / Arctic",
    "population": "57K",
    "currency": "Danish krone (DKK)",
    "languages": [
      "Greenlandic",
      "Danish"
    ],
    "lat": 71.7,
    "lng": -42.6,
    "difficulty": "medium",
    "tier": 2,
    "hint": "World's largest non-continental island (2.16 million km²), located between the Arctic and Atlantic oceans east of the Canadian Arctic.",
    "clues": [
      "World's largest non-continental island (2.16 million km²), located between the Arctic and Atlantic oceans east of the Canadian Arctic.",
      "Geographically part of North America, politically an autonomous constituent country within the Kingdom of Denmark.",
      "Roughly 80% of its surface is buried beneath the Greenland Ice Sheet, the second-largest ice body on Earth after Antarctica.",
      "Has no intercity road network connecting its coastal towns—all travel between towns is by boat, plane, helicopter, or dogsled.",
      "Capital: Nuuk · Population: ~57K · Currency: Danish krone (DKK)"
    ],
    "neighbors": [
      "Canada (Hans Island)"
    ]
  },
  {
    "id": "country-quiz-193-french-guiana",
    "country": "French Guiana",
    "name": "French Guiana",
    "isoCode": "GF",
    "flag": "french-guiana",
    "flagUrl": "/flags/french-guiana.svg",
    "flagEmoji": "🇬🇫",
    "capital": "Cayenne",
    "zone": "americas",
    "subregion": "South America",
    "population": "310K",
    "currency": "Euro (EUR)",
    "languages": [
      "French"
    ],
    "lat": 3.9,
    "lng": -53.1,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Overseas department of France on the northeastern Atlantic shoulder of South America between Suriname and Brazil.",
    "clues": [
      "Overseas department of France on the northeastern Atlantic shoulder of South America between Suriname and Brazil.",
      "Because it is an integral part of France, it is part of the European Union and uses the Euro—making France's longest land border the one with Brazil (730 km)!",
      "Home to the Guiana Space Centre in Kourou, Europe's primary spaceport near the Equator where Ariane and James Webb launched.",
      "Offshore lies Devil's Island (Îles du Salut), the infamous former French penal colony.",
      "Capital: Cayenne · Population: ~310K · Currency: Euro (EUR)"
    ],
    "neighbors": [
      "Brazil",
      "Suriname"
    ]
  },
  {
    "id": "country-quiz-194-dominica",
    "country": "Dominica",
    "name": "Dominica",
    "isoCode": "DM",
    "flag": "dominica",
    "flagUrl": "/flags/dominica.svg",
    "flagEmoji": "🇩🇲",
    "capital": "Roseau",
    "zone": "americas",
    "subregion": "Caribbean",
    "population": "73K",
    "currency": "East Caribbean dollar (XCD)",
    "languages": [
      "English"
    ],
    "lat": 15.4,
    "lng": -61.4,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Mountainous volcanic island in the Lesser Antilles known as the 'Nature Island of the Caribbean'.",
    "clues": [
      "Mountainous volcanic island in the Lesser Antilles known as the 'Nature Island of the Caribbean'.",
      "Home to Boiling Lake (the world's second-largest hot spring), Morne Trois Pitons National Park, and the endangered Sisserou parrot.",
      "Its flag is one of only two national flags in the world to contain the color purple (on the chest of the Sisserou parrot).",
      "Named by Christopher Columbus for Sunday ('Domenica'), the day he spotted the island in November 1493.",
      "Capital: Roseau · Population: ~73K · Currency: East Caribbean dollar (XCD)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-195-saint-lucia",
    "country": "Saint Lucia",
    "name": "Saint Lucia",
    "isoCode": "LC",
    "flag": "saint-lucia",
    "flagUrl": "/flags/saint-lucia.svg",
    "flagEmoji": "🇱🇨",
    "capital": "Castries",
    "zone": "americas",
    "subregion": "Caribbean",
    "population": "180K",
    "currency": "East Caribbean dollar (XCD)",
    "languages": [
      "English",
      "Saint Lucian Creole"
    ],
    "lat": 13.9,
    "lng": -61,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Volcanic Windward Island in the eastern Caribbean iconic for the twin green volcanic spires of the Pitons (Gros Piton and Petit Piton).",
    "clues": [
      "Volcanic Windward Island in the eastern Caribbean iconic for the twin green volcanic spires of the Pitons (Gros Piton and Petit Piton).",
      "The only sovereign country in the world named after a historical woman (Saint Lucy of Syracuse).",
      "Boasts the highest number of Nobel Prize laureates per capita (poet Derek Walcott and economist Sir Arthur Lewis).",
      "Features Sulphur Springs near Soufrière, billed as the world's only drive-in volcano.",
      "Capital: Castries · Population: ~180K · Currency: East Caribbean dollar (XCD)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-196-grenada",
    "country": "Grenada",
    "name": "Grenada",
    "isoCode": "GD",
    "flag": "grenada",
    "flagUrl": "/flags/grenada.svg",
    "flagEmoji": "🇬🇩",
    "capital": "Saint George's",
    "zone": "americas",
    "subregion": "Caribbean",
    "population": "126K",
    "currency": "East Caribbean dollar (XCD)",
    "languages": [
      "English"
    ],
    "lat": 12.1,
    "lng": -61.7,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Southern Windward Island nation known globally as the 'Island of Spice' for its abundant nutmeg and mace production.",
    "clues": [
      "Southern Windward Island nation known globally as the 'Island of Spice' for its abundant nutmeg and mace production.",
      "A nutmeg pod is proudly displayed on the left side of its red, gold, and green national flag.",
      "Home to the world's first Underwater Sculpture Park in Molinere Bay and Grand Anse Beach.",
      "Its horseshoe-shaped harbor capital, St. George's, is surrounded by volcanic crater hills.",
      "Capital: Saint George's · Population: ~126K · Currency: East Caribbean dollar (XCD)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-197-saint-kitts-and-nevis",
    "country": "Saint Kitts and Nevis",
    "name": "Saint Kitts and Nevis",
    "isoCode": "KN",
    "flag": "saint-kitts-nevis",
    "flagUrl": "/flags/saint-kitts-nevis.svg",
    "flagEmoji": "🇰🇳",
    "capital": "Basseterre",
    "zone": "americas",
    "subregion": "Caribbean",
    "population": "48K",
    "currency": "East Caribbean dollar (XCD)",
    "languages": [
      "English"
    ],
    "lat": 17.3,
    "lng": -62.7,
    "difficulty": "hardcore",
    "tier": 4,
    "hint": "Twin-island federation in the Leeward Islands that is the smallest sovereign state in the Western Hemisphere in both area and population.",
    "clues": [
      "Twin-island federation in the Leeward Islands that is the smallest sovereign state in the Western Hemisphere in both area and population.",
      "Separated by a 3-km channel called The Narrows; Nevis is dominated by the symmetrical volcanic cone of Nevis Peak.",
      "Home to the UNESCO-listed Brimstone Hill Fortress ('Gibraltar of the West Indies') and the St. Kitts Scenic Railway.",
      "Birthplace of US Founding Father Alexander Hamilton (born in Charlestown, Nevis).",
      "Capital: Basseterre · Population: ~48K · Currency: East Caribbean dollar (XCD)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-198-french-polynesia",
    "country": "French Polynesia",
    "name": "French Polynesia",
    "isoCode": "PF",
    "flag": "french-polynesia",
    "flagUrl": "/flags/french-polynesia.svg",
    "flagEmoji": "🇵🇫",
    "capital": "Papeete",
    "zone": "oceania",
    "subregion": "Polynesia",
    "population": "308K",
    "currency": "CFP franc (XPF)",
    "languages": [
      "French",
      "Tahitian"
    ],
    "lat": -17.7,
    "lng": -149.4,
    "difficulty": "medium",
    "tier": 2,
    "hint": "South Pacific collectivity of 121 islands spread across five archipelagos (including the Society, Tuamotu, and Marquesas islands).",
    "clues": [
      "South Pacific collectivity of 121 islands spread across five archipelagos (including the Society, Tuamotu, and Marquesas islands).",
      "Its most famous islands are Tahiti (home to capital Papeete) and Bora Bora, renowned for overwater bungalows and volcanic Mount Otemanu.",
      "The word 'tattoo' comes from the Tahitian word 'tatau', recorded during Captain James Cook's 1769 voyage.",
      "Teahupo'o on Tahiti hosted the surfing competition of the 2024 Olympic Games.",
      "Capital: Papeete · Population: ~308K · Currency: CFP franc (XPF)"
    ],
    "neighbors": [
      "Island territory"
    ]
  },
  {
    "id": "country-quiz-199-new-caledonia",
    "country": "New Caledonia",
    "name": "New Caledonia",
    "isoCode": "NC",
    "flag": "new-caledonia",
    "flagUrl": "/flags/new-caledonia.svg",
    "flagEmoji": "🇳🇨",
    "capital": "Nouméa",
    "zone": "oceania",
    "subregion": "Melanesia",
    "population": "290K",
    "currency": "CFP franc (XPF)",
    "languages": [
      "French"
    ],
    "lat": -21.3,
    "lng": 165.4,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Melanesian archipelago in the southwest Pacific east of Australia, anchored by the long main island of Grande Terre and the Loyalty Islands.",
    "clues": [
      "Melanesian archipelago in the southwest Pacific east of Australia, anchored by the long main island of Grande Terre and the Loyalty Islands.",
      "Surrounded by the New Caledonian Barrier Reef, the world's largest continuous lagoon and a UNESCO World Heritage Site.",
      "Holds roughly a quarter of the world's known nickel reserves and is home to the flightless kagu bird.",
      "Named by Captain James Cook in 1774 because its pine-covered hills reminded him of Scotland (Caledonia).",
      "Capital: Nouméa · Population: ~290K · Currency: CFP franc (XPF)"
    ],
    "neighbors": [
      "Island territory"
    ]
  },
  {
    "id": "country-quiz-200-cook-islands",
    "country": "Cook Islands",
    "name": "Cook Islands",
    "isoCode": "CK",
    "flag": "cook-islands",
    "flagUrl": "/flags/cook-islands.svg",
    "flagEmoji": "🇨🇰",
    "capital": "Avarua",
    "zone": "oceania",
    "subregion": "Polynesia",
    "population": "17K",
    "currency": "New Zealand dollar (NZD)",
    "languages": [
      "English",
      "Cook Islands Māori"
    ],
    "lat": -21.2,
    "lng": -159.8,
    "difficulty": "medium",
    "tier": 2,
    "hint": "Self-governing Polynesian island nation in free association with New Zealand, comprising 15 islands across 2.2 million km² of ocean.",
    "clues": [
      "Self-governing Polynesian island nation in free association with New Zealand, comprising 15 islands across 2.2 million km² of ocean.",
      "Rarotonga is its volcanic, mountainous main island (home to capital Avarua), while Aitutaki is world-famous for its triangular turquoise lagoon.",
      "No building on Rarotonga is permitted by law to be taller than a coconut tree.",
      "Uses the New Zealand dollar alongside its own distinctive triangular $2 coin and $3 banknote.",
      "Capital: Avarua · Population: ~17K · Currency: New Zealand dollar (NZD)"
    ],
    "neighbors": [
      "Island nation"
    ]
  },
  {
    "id": "country-quiz-201-niue",
    "country": "Niue",
    "name": "Niue",
    "isoCode": "NU",
    "flag": "niue",
    "flagUrl": "/flags/niue.svg",
    "flagEmoji": "🇳🇺",
    "capital": "Alofi",
    "zone": "oceania",
    "subregion": "Polynesia",
    "population": "1.9K",
    "currency": "New Zealand dollar (NZD)",
    "languages": [
      "Niuean",
      "English"
    ],
    "lat": -19.1,
    "lng": -169.9,
    "difficulty": "hard",
    "tier": 3,
    "hint": "Single raised coral atoll in Polynesia known affectionately as 'The Rock of Polynesia', in free association with New Zealand.",
    "clues": [
      "Single raised coral atoll in Polynesia known affectionately as 'The Rock of Polynesia', in free association with New Zealand.",
      "One of the largest raised coral islands on Earth, ringed by dramatic limestone sea chasms, caves (Avaiki, Talava Arches), and humpback whales.",
      "In 2003, it became the first nation in the world to provide free wireless internet (Wi-Fi) to all residents, and in 2020 became the first entire country accredited as an International Dark Sky Place.",
      "Alofi is the second-smallest national capital by population in the world.",
      "Capital: Alofi · Population: ~1.9K · Currency: New Zealand dollar (NZD)"
    ],
    "neighbors": [
      "Island nation"
    ]
  }
];

/** Normalize difficulty ("expert" -> "hardcore") and map to numeric tier range. */
const DIFFICULTY_TIER_RANGE: Record<"easy" | "medium" | "hard" | "hardcore", [number, number]> = {
  easy: [1, 2],
  medium: [1, 3],
  hard: [2, 4],
  hardcore: [3, 4],
};

function normalizeDifficulty(diff?: QuizDifficulty): "easy" | "medium" | "hard" | "hardcore" {
  if (!diff) return "medium";
  if (diff === "expert") return "hardcore";
  return diff;
}

/** Look up a CountryQuizItem by country name or ISO code. */
export function getCountryQuizItem(countryOrIso: string): CountryQuizItem | undefined {
  const key = (countryOrIso.split("/")[0] ?? countryOrIso).trim().toLowerCase();
  return COUNTRY_QUIZ_ITEMS.find(
    (item) =>
      item.country.toLowerCase() === key ||
      item.isoCode.toLowerCase() === key ||
      item.flag.toLowerCase() === key,
  );
}

/**
 * Filter COUNTRY_QUIZ_ITEMS by zone ("world" | "asia" | "europe" | "americas" | "africa" | "oceania")
 * and difficulty ("easy" | "medium" | "hard" | "hardcore").
 * Always guarantees at least 4 items by relaxing difficulty within the zone if needed.
 */
export function getCountriesByZoneAndDifficulty(
  zone: QuizZone = "world",
  difficulty: QuizDifficulty = "medium",
): CountryQuizItem[] {
  const normDiff = normalizeDifficulty(difficulty);
  const [minTier, maxTier] = DIFFICULTY_TIER_RANGE[normDiff];

  const zonePool =
    zone === "world"
      ? COUNTRY_QUIZ_ITEMS
      : COUNTRY_QUIZ_ITEMS.filter((item) => item.zone === zone);

  // First try exact difficulty match or tier range
  const exactPool = zonePool.filter((item) => item.difficulty === normDiff);
  if (exactPool.length >= 6) return exactPool;

  const rangePool = zonePool.filter((item) => item.tier >= minTier && item.tier <= maxTier);
  if (rangePool.length >= 4) return rangePool;

  return zonePool.length >= 4 ? zonePool : COUNTRY_QUIZ_ITEMS;
}

function shuffleWithRng<T>(arr: readonly T[], rng: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = tmp;
  }
  return copy;
}

/**
 * Generate a single 4-choice Country Quiz question filtered by zone and difficulty.
 * Distractors are preferentially chosen from the same zone/subregion for realistic challenge!
 */
export function generateCountryQuizQuestion(options?: {
  zone?: QuizZone;
  difficulty?: QuizDifficulty;
  type?: QuizQuestionType;
  rng?: () => number;
  excludeCountries?: string[];
  targetItem?: CountryQuizItem;
}): CountryQuizQuestion {
  const zone = options?.zone ?? "world";
  const normDiff = normalizeDifficulty(options?.difficulty);
  const rng = options?.rng ?? Math.random;
  const exclude = new Set((options?.excludeCountries ?? []).map((c) => c.toLowerCase()));

  const candidateTargets = getCountriesByZoneAndDifficulty(zone, normDiff).filter(
    (item) => !exclude.has(item.country.toLowerCase()),
  );
  const pool =
    candidateTargets.length > 0
      ? candidateTargets
      : getCountriesByZoneAndDifficulty(zone, normDiff);

  const target =
    options?.targetItem ?? pool[Math.floor(rng() * pool.length)] ?? COUNTRY_QUIZ_ITEMS[0]!;

  // Pick 3 distractors preferably from the same zone and similar difficulty
  const sameZoneDistractors = COUNTRY_QUIZ_ITEMS.filter(
    (item) =>
      item.country !== target.country &&
      item.zone === target.zone &&
      Math.abs(item.tier - target.tier) <= 1,
  );
  const broaderZoneDistractors = COUNTRY_QUIZ_ITEMS.filter(
    (item) => item.country !== target.country && item.zone === target.zone,
  );
  const globalDistractors = COUNTRY_QUIZ_ITEMS.filter(
    (item) => item.country !== target.country,
  );

  const distractorSource =
    sameZoneDistractors.length >= 3
      ? sameZoneDistractors
      : broaderZoneDistractors.length >= 3
        ? broaderZoneDistractors
        : globalDistractors;

  const distractors = shuffleWithRng(distractorSource, rng).slice(0, 3);
  const optionItems = shuffleWithRng([target, ...distractors], rng);
  const correctIndex = optionItems.findIndex((item) => item.country === target.country);

  const questionTypes: Array<"capital" | "flag" | "clue" | "reverse-capital"> = [
    "clue",
    "capital",
    "flag",
    "reverse-capital",
  ];
  const resolvedType: "capital" | "flag" | "clue" | "reverse-capital" =
    !options?.type || options.type === "mixed"
      ? questionTypes[Math.floor(rng() * questionTypes.length)]!
      : options.type;

  let prompt = "";
  let subtitle = "";
  let optionLabels: string[] = optionItems.map((item) => item.country);
  let correctAnswer = target.country;

  if (resolvedType === "capital") {
    prompt = `Which country has the capital city of ${target.capital}?`;
    subtitle = `${target.subregion} · Population ~${target.population}`;
  } else if (resolvedType === "reverse-capital") {
    prompt = `What is the capital city of ${target.country}?`;
    subtitle = `${target.subregion} · ${target.hint}`;
    optionLabels = optionItems.map((item) => item.capital);
    correctAnswer = target.capital;
  } else if (resolvedType === "flag") {
    prompt = "Which country does this national flag belong to?";
    subtitle = `${target.subregion} · ${target.clues[1] ?? target.hint}`;
  } else {
    // "clue"
    const primaryClue = normDiff === "hardcore" ? (target.clues[2] ?? target.hint) : target.hint;
    prompt = primaryClue;
    subtitle = `${target.subregion} · Borders: ${target.neighbors.slice(0, 3).join(", ")}`;
  }

  return {
    id: `quiz-${target.isoCode.toLowerCase()}-${resolvedType}-${Math.floor(rng() * 1e6)}`,
    type: resolvedType,
    prompt,
    subtitle,
    target,
    correctAnswer,
    correctIndex,
    options: optionLabels,
    optionItems,
    hint: `${target.subregion} · Capital: ${target.capital} · Pop ~${target.population}`,
    clues: target.clues,
    zone: target.zone,
    difficulty: normDiff,
  };
}

/**
 * Generate an entire multi-round set of unique 4-choice Country Quiz questions
 * filtered by zone and difficulty.
 */
export function generateCountryQuizRounds(
  count: number = 5,
  zone: QuizZone = "world",
  difficulty: QuizDifficulty = "medium",
  rng: () => number = Math.random,
  type: QuizQuestionType = "mixed",
): CountryQuizQuestion[] {
  const usedCountries: string[] = [];
  const questions: CountryQuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const q = generateCountryQuizQuestion({
      zone,
      difficulty,
      type,
      rng,
      excludeCountries: usedCountries,
    });
    usedCountries.push(q.target.country);
    questions.push(q);
  }
  return questions;
}
