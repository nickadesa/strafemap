// Geographic challenge dataset. Kept separate from game logic so it can grow.
export type Category = "capital" | "city" | "landmark" | "country" | "natural";
export interface Location {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  category: Category;
  /** 1 = well known … 4 = obscure */
  difficulty: 1 | 2 | 3 | 4;
  hint?: string | undefined;
}

type Row = [string, string, number, number, Category, 1 | 2 | 3 | 4, string?];

const rows: Row[] = [
  // Capitals
  ["London", "United Kingdom", 51.5074, -0.1278, "capital", 1, "On the Thames"],
  ["Paris", "France", 48.8566, 2.3522, "capital", 1, "On the Seine"],
  ["Tokyo", "Japan", 35.6762, 139.6503, "capital", 1, "Honshu island"],
  ["Washington, D.C.", "United States", 38.9072, -77.0369, "capital", 1, "On the Potomac"],
  ["Beijing", "China", 39.9042, 116.4074, "capital", 1],
  ["Moscow", "Russia", 55.7558, 37.6173, "capital", 1],
  ["Canberra", "Australia", -35.2809, 149.13, "capital", 2, "Not Sydney"],
  ["Ottawa", "Canada", 45.4215, -75.6972, "capital", 2, "Ontario, near Québec"],
  ["Brasília", "Brazil", -15.7975, -47.8919, "capital", 2, "Planned city on a plateau"],
  ["Nairobi", "Kenya", -1.2921, 36.8219, "capital", 2, "Just south of the equator"],
  ["Cairo", "Egypt", 30.0444, 31.2357, "capital", 1, "On the Nile"],
  ["Buenos Aires", "Argentina", -34.6037, -58.3816, "capital", 1, "Río de la Plata"],
  ["New Delhi", "India", 28.6139, 77.209, "capital", 1],
  ["Bangkok", "Thailand", 13.7563, 100.5018, "capital", 1, "On the Chao Phraya"],
  ["Reykjavík", "Iceland", 64.1466, -21.9426, "capital", 2],
  ["Ulaanbaatar", "Mongolia", 47.8864, 106.9057, "capital", 3],
  ["Astana", "Kazakhstan", 51.1694, 71.4491, "capital", 3],
  ["Windhoek", "Namibia", -22.5609, 17.0658, "capital", 3],
  ["La Paz", "Bolivia", -16.4897, -68.1193, "capital", 3, "Seat of government, very high"],
  ["Thimphu", "Bhutan", 27.4728, 89.639, "capital", 4, "Himalayas"],
  ["Ouagadougou", "Burkina Faso", 12.3714, -1.5197, "capital", 4, "West Africa, landlocked"],
  ["Tbilisi", "Georgia", 41.7151, 44.8271, "capital", 3, "Caucasus"],
  ["Wellington", "New Zealand", -41.2865, 174.7762, "capital", 2, "Southern tip of North Island"],
  ["Lima", "Peru", -12.0464, -77.0428, "capital", 2, "Pacific coast"],
  ["Hanoi", "Vietnam", 21.0278, 105.8342, "capital", 2],
  ["Helsinki", "Finland", 60.1699, 24.9384, "capital", 2],
  ["Dushanbe", "Tajikistan", 38.5598, 68.787, "capital", 4],
  ["Paramaribo", "Suriname", 5.852, -55.2038, "capital", 4, "South America's north coast"],
  ["Antananarivo", "Madagascar", -18.8792, 47.5079, "capital", 3],
  ["Nuuk", "Greenland", 64.1814, -51.6941, "capital", 4],
  // Cities
  ["New York City", "United States", 40.7128, -74.006, "city", 1],
  ["Sydney", "Australia", -33.8688, 151.2093, "city", 1],
  ["Rio de Janeiro", "Brazil", -22.9068, -43.1729, "city", 1],
  ["Istanbul", "Türkiye", 41.0082, 28.9784, "city", 1, "Spans two continents"],
  ["Cape Town", "South Africa", -33.9249, 18.4241, "city", 2],
  ["Vancouver", "Canada", 49.2827, -123.1207, "city", 2],
  ["Mumbai", "India", 19.076, 72.8777, "city", 1],
  ["Lagos", "Nigeria", 6.5244, 3.3792, "city", 2],
  ["Singapore", "Singapore", 1.3521, 103.8198, "city", 1],
  ["Anchorage", "United States", 61.2181, -149.9003, "city", 3],
  ["Ushuaia", "Argentina", -54.8019, -68.303, "city", 3, "Southernmost city"],
  ["Novosibirsk", "Russia", 55.0084, 82.9357, "city", 3],
  ["Perth", "Australia", -31.9505, 115.8605, "city", 2],
  ["Marrakesh", "Morocco", 31.6295, -7.9811, "city", 2],
  ["Honolulu", "United States", 21.3069, -157.8583, "city", 2],
  ["Tromsø", "Norway", 69.6492, 18.9553, "city", 4, "Above the Arctic Circle"],
  ["Chengdu", "China", 30.5728, 104.0668, "city", 3],
  ["Medellín", "Colombia", 6.2442, -75.5812, "city", 3],
  // Landmarks
  ["Eiffel Tower", "France", 48.8584, 2.2945, "landmark", 1],
  ["Machu Picchu", "Peru", -13.1631, -72.545, "landmark", 2, "Andes"],
  ["Great Pyramid of Giza", "Egypt", 29.9792, 31.1342, "landmark", 1],
  ["Taj Mahal", "India", 27.1751, 78.0421, "landmark", 1, "Agra"],
  ["Angkor Wat", "Cambodia", 13.4125, 103.867, "landmark", 2],
  ["Statue of Liberty", "United States", 40.6892, -74.0445, "landmark", 1],
  ["Petra", "Jordan", 30.3285, 35.4444, "landmark", 3],
  ["Christ the Redeemer", "Brazil", -22.9519, -43.2105, "landmark", 1],
  ["Easter Island Moai", "Chile", -27.1127, -109.3497, "landmark", 3, "Remote Pacific"],
  ["Sydney Opera House", "Australia", -33.8568, 151.2153, "landmark", 1],
  ["Chichén Itzá", "Mexico", 20.6843, -88.5678, "landmark", 2, "Yucatán"],
  ["Stonehenge", "United Kingdom", 51.1789, -1.8262, "landmark", 2],
  ["Borobudur", "Indonesia", -7.6079, 110.2038, "landmark", 3, "Java"],
  ["Great Zimbabwe", "Zimbabwe", -20.2674, 30.9338, "landmark", 4],
  // Natural
  ["Mount Everest", "Nepal", 27.9881, 86.925, "natural", 1],
  ["Grand Canyon", "United States", 36.1069, -112.1129, "natural", 1, "Arizona"],
  ["Victoria Falls", "Zambia", -17.9243, 25.8572, "natural", 2],
  ["Uluru", "Australia", -25.3444, 131.0369, "natural", 2, "Red centre"],
  ["Mount Kilimanjaro", "Tanzania", -3.0674, 37.3556, "natural", 2],
  ["Lake Baikal", "Russia", 53.5587, 108.165, "natural", 3, "Deepest lake"],
  ["Iguazu Falls", "Argentina", -25.6953, -54.4367, "natural", 3],
  ["Ha Long Bay", "Vietnam", 20.9101, 107.1839, "natural", 3],
  ["Mount Fuji", "Japan", 35.3606, 138.7274, "natural", 1],
  ["Dead Sea", "Israel / Jordan", 31.559, 35.4732, "natural", 2],
  ["Salar de Uyuni", "Bolivia", -20.1338, -67.4891, "natural", 3, "Salt flat"],
  ["Galápagos Islands", "Ecuador", -0.9538, -90.9656, "natural", 3],
  // Countries (target = approximate geographic centre)
  ["Brazil", "Brazil", -10.8, -52.9, "country", 1],
  ["Australia", "Australia", -25.7, 134.5, "country", 1],
  ["Canada", "Canada", 61.4, -98.3, "country", 1],
  ["Egypt", "Egypt", 26.6, 29.8, "country", 1],
  ["India", "India", 22.9, 79.6, "country", 1],
  ["Mexico", "Mexico", 23.9, -102.5, "country", 1],
  ["Kazakhstan", "Kazakhstan", 48.2, 67.3, "country", 2],
  ["Peru", "Peru", -9.2, -74.4, "country", 2],
  ["Poland", "Poland", 52.1, 19.4, "country", 2],
  ["Ethiopia", "Ethiopia", 8.6, 39.6, "country", 2],
  ["Mongolia", "Mongolia", 46.8, 103.0, "country", 2],
  ["Chad", "Chad", 15.3, 18.7, "country", 3],
  ["Laos", "Laos", 18.5, 103.8, "country", 3],
  ["Paraguay", "Paraguay", -23.2, -58.4, "country", 3],
  ["Uzbekistan", "Uzbekistan", 41.7, 63.2, "country", 3],
  ["Malawi", "Malawi", -13.2, 34.3, "country", 4],
  ["Kyrgyzstan", "Kyrgyzstan", 41.5, 74.6, "country", 4],
  ["Guyana", "Guyana", 4.8, -58.9, "country", 4],
  ["Moldova", "Moldova", 47.2, 28.5, "country", 4],
  ["Burundi", "Burundi", -3.4, 29.9, "country", 4],
];

import { EXTRA_LOCATIONS } from "./locations-extra";
import { WIKIDATA_LOCATIONS } from "./locations-wikidata";

export const LOCATIONS: Location[] = [
  ...rows.map(([name, country, lat, lng, category, difficulty, hint], i) => ({
    id: `${category}-${i}`,
    name, country, lat, lng, category, difficulty, hint,
  })),
  ...EXTRA_LOCATIONS,
  ...WIKIDATA_LOCATIONS,
];

