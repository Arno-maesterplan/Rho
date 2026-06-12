import { differenceInWeeks, differenceInDays, addWeeks, format } from "date-fns";
import { nl } from "date-fns/locale";

export const BIRTH_DATE = new Date("2026-05-13");

// Uitgerekende datum — sprongen (Wonder Weeks) worden hierop berekend,
// niet op de geboortedatum
export const DUE_DATE = new Date("2026-05-19");

export function getRhoAge() {
  const today = new Date();
  const totalDays = differenceInDays(today, BIRTH_DATE);
  const weeks = differenceInWeeks(today, BIRTH_DATE);
  const days = totalDays % 7;
  const months = Math.floor(totalDays / 30.44);
  return { weeks, days, months, totalDays };
}

// Leeftijd in weken vanaf de uitgerekende datum (voor sprongberekening)
export function getLeapWeeks() {
  return differenceInWeeks(new Date(), DUE_DATE);
}

export function formatDutchDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "d MMMM yyyy", { locale: nl });
}

const WONDER_WEEKS_RAW = [
  {
    number: 1,
    name: "De Wereld van Gewaarwordingen",
    emoji: "🌊",
    weekStart: 5,
    weekEnd: 6,
    dateStart: "2026-06-17",
    dateEnd: "2026-06-24",
    description:
      "Rho merkt plots veel meer: lichten, geluiden, aanrakingen. Haar zenuwstelsel verwerkt een stortvloed aan nieuwe prikkels.",
    symptoms: ["Meer huilen", "Moeilijker troosten", "Meer aan borst willen", "Slechter slapen"],
    tips: ["Houd haar dicht bij je", "Rustige omgeving", "Huid-op-huid contact", "Geduld — dit duurt max 2 weken"],
    duration: "1-2 weken",
  },
  {
    number: 2,
    name: "De Wereld van Patronen",
    emoji: "⭕",
    weekStart: 8,
    weekEnd: 9,
    dateStart: "2026-07-08",
    dateEnd: "2026-07-15",
    description: "Rho ontdekt patronen: in gezichten, geluiden, bewegingen. Ze herkent nu dingen.",
    symptoms: ["Meer huilen", "Wil constant gedragen worden", "Slecht slapen"],
    tips: ["Toon haar je gezicht van dichtbij", "Praat met haar", "Regelmaat helpt"],
    duration: "1-2 weken",
  },
  {
    number: 3,
    name: "De Wereld van Overgangen",
    emoji: "🔄",
    weekStart: 12,
    weekEnd: 13,
    dateStart: "2026-08-05",
    dateEnd: "2026-08-12",
    description:
      "Rho begrijpt verandering: van stilte naar geluid, van licht naar donker. Continuïteit in de wereld.",
    symptoms: ["Erg huilig", "Wil alleen bij mama/papa zijn", "Slaapproblemen"],
    tips: ["Laat haar veranderingen observeren", "Zwaai voor haar", "Muziek aan/uit"],
    duration: "1-2 weken",
  },
  {
    number: 4,
    name: "De Wereld van Gebeurtenissen",
    emoji: "⚡",
    weekStart: 19,
    weekEnd: 20,
    dateStart: "2026-09-23",
    dateEnd: "2026-09-30",
    description:
      "Rho begrijpt dat handelingen een begin en einde hebben. Ze ziet oorzaak en gevolg.",
    symptoms: ["Grote huilbuien", "Wil continu aandacht", "Slaap compleet van slag"],
    tips: [
      "Speel kiekeboe",
      "Laat haar dingen laten vallen en oprapen",
      "Veel praten over wat je doet",
    ],
    duration: "2-3 weken",
  },
  {
    number: 5,
    name: "De Wereld van Relaties",
    emoji: "↔️",
    weekStart: 26,
    weekEnd: 27,
    dateStart: "2026-11-11",
    dateEnd: "2026-11-18",
    description:
      "Rho ontdekt afstand en ruimte: hoe ver dingen van elkaar zijn, hoe ze zichzelf verhouden tot de wereld.",
    symptoms: ["Scheidingsangst", "Huilt als je wegloopt", "Constant vasthouden willen"],
    tips: ["Geef haar een spiegel", "Verstoppertje spelen", "Kruip samen op de grond"],
    duration: "2-3 weken",
  },
  {
    number: 6,
    name: "De Wereld van Categorieën",
    emoji: "🗂️",
    weekStart: 37,
    weekEnd: 38,
    dateStart: "2027-02-03",
    dateEnd: "2027-02-10",
    description:
      "Rho sorteert de wereld in groepen: dieren, mensen, voedsel. Een enorme mentale sprong.",
    symptoms: ["Driftbuien", "Selectief eten", "Slaapproblemen"],
    tips: ["Boekjes met categorieën", "Dieren tonen", "Consistent in grenzen"],
    duration: "3-4 weken",
  },
  {
    number: 7,
    name: "De Wereld van Opeenvolgingen",
    emoji: "📋",
    weekStart: 46,
    weekEnd: 47,
    dateStart: "2027-04-14",
    dateEnd: "2027-04-21",
    description:
      "Rho begrijpt dat dingen in een volgorde gebeuren. Ze kan een simpel plan uitvoeren.",
    symptoms: ["Koppig", "Wil zelf alles doen", "Frustratie als iets niet lukt"],
    tips: ["Laat haar helpen", "Stap-voor-stap uitleggen", "Geduld met zelfstandigheid"],
    duration: "3-4 weken",
  },
  {
    number: 8,
    name: "De Wereld van Programma's",
    emoji: "🎯",
    weekStart: 55,
    weekEnd: 56,
    dateStart: "2027-06-16",
    dateEnd: "2027-06-23",
    description:
      "Rho combineert handelingen tot flexibele programma's. Ze past zich aan situaties aan.",
    symptoms: ["Intense driftbuien", "Manipulatief gedrag testen", "Slaap chaos"],
    tips: ["Duidelijke grenzen", "Consequent zijn", "Haar 'programma's' bewonderen"],
    duration: "4-5 weken",
  },
  {
    number: 9,
    name: "De Wereld van Principes",
    emoji: "⚖️",
    weekStart: 64,
    weekEnd: 65,
    dateStart: "2027-08-18",
    dateEnd: "2027-08-25",
    description:
      "Rho begrijpt regels en principes. Ze test grenzen bewust en begrijpt 'eerlijk'.",
    symptoms: ["Grenzen testen", "Jaloezie", "Heftige emoties"],
    tips: ["Uitleggen waarom", "Consequent in regels", "Haar gevoel benoemen"],
    duration: "4-5 weken",
  },
  {
    number: 10,
    name: "De Wereld van Systemen",
    emoji: "🌍",
    weekStart: 75,
    weekEnd: 76,
    dateStart: "2027-11-03",
    dateEnd: "2027-11-10",
    description:
      "De grootste sprong: Rho begrijpt dat de wereld een systeem is. Ze heeft haar eigen waarden en identiteit.",
    symptoms: ["Grote emotionele schommelingen", "Identiteitszoeken", "Complexe driftbuien"],
    tips: ["Haar identiteit bevestigen", "Veel praten", "Stabiele thuisbasis bieden"],
    duration: "4-6 weken",
  },
];

// Sprongdata afgeleid van de uitgerekende datum (DUE_DATE), niet de geboortedatum
export const WONDER_WEEKS = WONDER_WEEKS_RAW.map((ww) => ({
  ...ww,
  dateStart: format(addWeeks(DUE_DATE, ww.weekStart), "yyyy-MM-dd"),
  dateEnd: format(addWeeks(DUE_DATE, ww.weekEnd), "yyyy-MM-dd"),
}));

// weekStart/weekEnd zijn weken vanaf de uitgerekende datum, dus we vergelijken
// met de leeftijd vanaf DUE_DATE — het weeks-argument wordt genegeerd (compat)
export function getCurrentLeap(_weeks?: number) {
  const weeks = getLeapWeeks();
  const activeLeap = WONDER_WEEKS.find(
    (leap) => weeks >= leap.weekStart - 1 && weeks <= leap.weekEnd + 1
  );
  const nextLeap = WONDER_WEEKS.find((leap) => weeks < leap.weekStart);
  const isInStorm = !!activeLeap && weeks >= activeLeap.weekStart && weeks <= activeLeap.weekEnd;

  return { activeLeap, nextLeap, isInStorm };
}
