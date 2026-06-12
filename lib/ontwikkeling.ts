// Ontwikkelingsweetjes per leeftijdsfase — wetenschappelijk onderbouwd,
// warm geschreven. Weken zijn gerekend vanaf de geboortedatum.

export type WeetjeCategorie = "zien" | "horen" | "voelen" | "motoriek" | "sociaal" | "slaap";

export const CATEGORIE_INFO: Record<WeetjeCategorie, { label: string; emoji: string }> = {
  zien: { label: "Zien", emoji: "👁️" },
  horen: { label: "Horen", emoji: "👂" },
  voelen: { label: "Voelen", emoji: "🤲" },
  motoriek: { label: "Bewegen", emoji: "💪" },
  sociaal: { label: "Sociaal", emoji: "💛" },
  slaap: { label: "Slaap", emoji: "🌙" },
};

export type OntwikkelingsFase = {
  weekStart: number;
  weekEnd: number;
  titel: string;
  emoji: string;
  intro: string;
  weetjes: { categorie: WeetjeCategorie; tekst: string }[];
};

export const ONTWIKKELING: OntwikkelingsFase[] = [
  {
    weekStart: 0,
    weekEnd: 4,
    titel: "De allereerste weken",
    emoji: "🌱",
    intro:
      "Rho landt in een compleet nieuwe wereld. Alles is nog wazig en overweldigend — behalve jullie stem en geur, die kent ze al.",
    weetjes: [
      { categorie: "zien", tekst: "Rho ziet maar 20-30 cm ver — precies de afstand van de borst tot jullie gezicht. Geen toeval: de natuur heeft dit zo geregeld." },
      { categorie: "zien", tekst: "Ze ziet vooral contrast: zwart-wit en donker-licht. Kleuren kan haar netvlies nog amper onderscheiden. Zwart-wit boekjes zijn nu fascinerend voor haar." },
      { categorie: "horen", tekst: "Rho hoorde jullie stemmen al in de buik. Ze herkent mama's stem vanaf dag één en draait haar hoofdje naar bekende geluiden." },
      { categorie: "voelen", tekst: "Aanraking is haar sterkste zintuig. Huid-op-huid contact reguleert haar hartslag, temperatuur én stresshormonen. Knuffelen is letterlijk medicijn." },
      { categorie: "motoriek", tekst: "Haar bewegingen zijn nog reflexen: de grijpreflex (vingertje vastpakken!), de zuigreflex en de Moro-reflex (schrikken met gespreide armpjes)." },
      { categorie: "slaap", tekst: "Rho slaapt 16-18 uur per dag, maar in blokjes van 2-4 uur. Ze kent nog geen dag en nacht — haar biologische klok moet zich nog ontwikkelen." },
    ],
  },
  {
    weekStart: 5,
    weekEnd: 8,
    titel: "Ogen open voor de wereld",
    emoji: "✨",
    intro:
      "Rho wordt wakkerder en alerter. De eerste échte glimlach verschijnt — en die is voor jullie.",
    weetjes: [
      { categorie: "zien", tekst: "Rood is de eerste kleur die Rho kan zien, rond 6-8 weken. Daarna volgen groen en geel. Blauw komt het allerlaatst." },
      { categorie: "zien", tekst: "Ze begint gezichten echt te bestuderen, vooral ogen en mond. Jullie gezicht is haar favoriete 'speelgoed'." },
      { categorie: "sociaal", tekst: "De eerste sociale glimlach verschijnt rond 6 weken: ze lacht niet meer per ongeluk, maar omdat ze JOU ziet." },
      { categorie: "horen", tekst: "Rho begint geluidjes te maken: koeren en gorgelen. Praat terug! Deze 'gesprekjes' bouwen letterlijk haar taalnetwerk in de hersenen." },
      { categorie: "slaap", tekst: "Rond 6-8 weken begint haar melatonine-aanmaak. Daglicht overdag en duisternis 's nachts helpen haar interne klok zich te zetten." },
      { categorie: "motoriek", tekst: "Op haar buik kan ze haar hoofdje al even optillen. Korte momentjes buikligging (tummy time) maken haar nek- en rugspieren sterk." },
    ],
  },
  {
    weekStart: 9,
    weekEnd: 13,
    titel: "Kleuren en handjes ontdekken",
    emoji: "🌈",
    intro:
      "De wereld krijgt kleur — letterlijk. En Rho ontdekt dat die zwaaiende handjes van háár zijn.",
    weetjes: [
      { categorie: "zien", tekst: "Rho ziet nu de meeste kleuren, al blijft blauw nog moeilijk. Fel gekleurd speelgoed wordt plots interessant." },
      { categorie: "zien", tekst: "Ze kan bewegende dingen volgen met haar ogen, zonder haar hoofd te draaien. Volg-spelletjes met een rammelaar zijn nu top." },
      { categorie: "motoriek", tekst: "Rond 12 weken ontdekt ze haar eigen handjes: minutenlang staren, ze samenbrengen, eraan zuigen. Een mijlpaal in lichaamsbesef!" },
      { categorie: "sociaal", tekst: "Ze lacht nu hardop en heeft duidelijke voorkeuren voor bekende gezichten. Vreemden krijgen een onderzoekende blik." },
      { categorie: "horen", tekst: "Rho herkent de melodie van jullie taal. Baby's van deze leeftijd babbelen al met het 'accent' van hun moedertaal." },
      { categorie: "slaap", tekst: "Slaapcycli worden volwassener: ze doorloopt nu lichte en diepe slaap zoals wij. Daarom wordt ze soms vaker wakker — dat is vooruitgang, geen achteruitgang." },
    ],
  },
  {
    weekStart: 14,
    weekEnd: 19,
    titel: "Grijpen en draaien",
    emoji: "🤏",
    intro:
      "Rho wordt een doener: alles wat ze ziet wil ze vastpakken, en alles wat ze vastpakt gaat naar de mond.",
    weetjes: [
      { categorie: "motoriek", tekst: "Gericht grijpen lukt nu: zien, reiken, pakken. Dit lijkt simpel maar vraagt een enorme samenwerking tussen ogen, hersenen en spieren." },
      { categorie: "voelen", tekst: "Alles gaat naar de mond — niet om te eten, maar om te voelen. Haar mond heeft de meeste zenuwuiteinden en is haar beste 'voelinstrument'." },
      { categorie: "zien", tekst: "Dieptezicht ontwikkelt zich: ze ziet nu in 3D. Daarom kan ze plots goed inschatten hoe ver dat speeltje is." },
      { categorie: "motoriek", tekst: "De eerste keer omrollen (meestal van buik naar rug) gebeurt vaak in deze periode — soms tot haar eigen verbazing!" },
      { categorie: "sociaal", tekst: "Ze begint te 'praten' met klinkers en uithalen: 'aaah', 'oooh'. Imiteer haar geluidjes — ze leert dat communicatie tweerichtingsverkeer is." },
      { categorie: "slaap", tekst: "Veel baby's maken rond 4 maanden een slaapregressie door: de slaapstructuur verandert blijvend. Vast bedritueel helpt enorm." },
    ],
  },
  {
    weekStart: 20,
    weekEnd: 26,
    titel: "Zitten, proeven, brabbelen",
    emoji: "🥄",
    intro:
      "Een grote periode: de eerste hapjes, misschien al los zitten, en de eerste medeklinkers — 'bababa'!",
    weetjes: [
      { categorie: "motoriek", tekst: "Met steun zitten lukt steeds beter. Rond 6-8 maanden komt los zitten — elke baby op haar eigen tempo." },
      { categorie: "voelen", tekst: "Rond 5-6 maanden is haar darmstelsel klaar voor vaste voeding. Proeven is ontdekken: gezichtjes trekken bij nieuwe smaken is normaal en gezond." },
      { categorie: "horen", tekst: "Ze brabbelt nu met medeklinkers: 'mamama', 'bababa'. Nog zonder betekenis, maar de bouwstenen van échte woordjes zijn er." },
      { categorie: "zien", tekst: "Haar zicht is nu bijna zo scherp als dat van een volwassene. Ze herkent jullie van aan de andere kant van de kamer." },
      { categorie: "sociaal", tekst: "Ze begrijpt emoties in jullie stem en gezicht. Een boze of verdrietige toon voelt ze feilloos aan." },
      { categorie: "slaap", tekst: "De meeste baby's kunnen nu 2-3 dutjes per dag aan en langere nachtblokken. Doorslapen is fysiek mogelijk, maar nog lang niet vanzelfsprekend." },
    ],
  },
  {
    weekStart: 27,
    weekEnd: 39,
    titel: "Kruipen en eenkennigheid",
    emoji: "🐛",
    intro:
      "Rho komt in beweging — en ontdekt tegelijk dat mama en papa kunnen wéggaan. Spannend en soms eng.",
    weetjes: [
      { categorie: "motoriek", tekst: "Kruipen (of schuiven, of rollen — elke stijl telt) begint meestal tussen 7 en 10 maanden. De wereld wordt plots bereikbaar." },
      { categorie: "sociaal", tekst: "Eenkennigheid is een teken van slimme hersenen: ze begrijpt nu wie 'eigen' en wie 'vreemd' is, en dat jullie kunnen verdwijnen. Scheidingsangst hoort erbij." },
      { categorie: "sociaal", tekst: "Kiekeboe is nu hét spel: ze leert 'objectpermanentie' — dingen bestaan nog, ook als je ze niet ziet." },
      { categorie: "horen", tekst: "Ze begrijpt haar eerste woordjes, lang voor ze ze kan zeggen. 'Nee', haar naam, 'papa', 'mama' — het landt allemaal." },
      { categorie: "motoriek", tekst: "De pincetgreep ontwikkelt zich: kleine dingen oppakken tussen duim en wijsvinger. Hét moment voor stukjes zacht fruit." },
      { categorie: "slaap", tekst: "Nieuwe motorische vaardigheden 'spoken' vaak 's nachts: oefenen met omrollen of zitten in bed. Overdag veel laten oefenen helpt." },
    ],
  },
  {
    weekStart: 40,
    weekEnd: 52,
    titel: "Op weg naar de eerste stapjes",
    emoji: "👣",
    intro:
      "Het eerste jaar rond: staan, misschien stappen, eerste woordjes. Van baby naar dreumes.",
    weetjes: [
      { categorie: "motoriek", tekst: "Optrekken tot staan, langs meubels schuifelen ('cruisen'), en dan: de eerste losse stapjes. Gemiddeld rond 12-14 maanden, alles tussen 9 en 18 maanden is normaal." },
      { categorie: "sociaal", tekst: "Ze zwaait, klapt in de handjes en wijst. Wijzen is een mijlpaal: ze deelt nu bewust haar aandacht met jullie." },
      { categorie: "horen", tekst: "De eerste échte woordjes komen eraan. Gemiddeld zegt een kind rond 12 maanden 1-3 woordjes met betekenis." },
      { categorie: "zien", tekst: "Haar dieptezicht en oog-handcoördinatie zijn nu zo goed dat ze blokjes kan stapelen en dingen ín iets kan stoppen." },
      { categorie: "voelen", tekst: "Zelf eten met de handjes (en knoeien!) is belangrijke sensorische ontwikkeling. De rommel hoort erbij." },
      { categorie: "slaap", tekst: "De meeste kindjes gaan rond 12-15 maanden naar 1 middagdutje. Nachten van 10-12 uur worden de norm." },
    ],
  },
];

export function getHuidigeFase(weeks: number): OntwikkelingsFase | undefined {
  return ONTWIKKELING.find((f) => weeks >= f.weekStart && weeks <= f.weekEnd);
}
