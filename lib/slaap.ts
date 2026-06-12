// Slaapadvies per leeftijdsfase — geïnspireerd op o.a. "Slaap kindje slaap"
// en algemene richtlijnen (Kind en Gezin / AAP). Weken vanaf geboorte.

export type SlaapFase = {
  weekStart: number;
  weekEnd: number;
  titel: string;
  emoji: string;
  totaalSlaap: string;
  nachtSlaap: string;
  dutjes: string;
  wakkerTijd: string;
  uitleg: string;
  tips: string[];
};

export const SLAAP_FASES: SlaapFase[] = [
  {
    weekStart: 0,
    weekEnd: 6,
    titel: "Slapen zonder klok",
    emoji: "🌑",
    totaalSlaap: "16–18 uur per dag",
    nachtSlaap: "Blokjes van 2–4 uur",
    dutjes: "4–6 dutjes, geen vast patroon",
    wakkerTijd: "45–60 minuten",
    uitleg:
      "Rho heeft nog geen dag-nachtritme: haar biologische klok bestaat simpelweg nog niet. Ze wordt wakker van honger, en dat is gezond en nodig. Verwacht geen patroon — er is er geen.",
    tips: [
      "Maak overdag geen donker huis: licht en gewone geluiden overdag helpen haar klok zich te zetten",
      "Hou nachtvoedingen saai: gedempt licht, weinig praten, geen spelletjes",
      "Slaperig maar wakker neerleggen mag je al proberen, maar in slaap vallen aan de borst of op de arm is nu volkomen oké",
      "Volg haar signalen (geeuwen, wegkijken, jengelen) in plaats van de klok",
    ],
  },
  {
    weekStart: 7,
    weekEnd: 13,
    titel: "De klok begint te tikken",
    emoji: "🌒",
    totaalSlaap: "15–17 uur per dag",
    nachtSlaap: "Eén langer blok van 4–6 uur wordt mogelijk",
    dutjes: "4–5 dutjes",
    wakkerTijd: "60–90 minuten",
    uitleg:
      "Rond 6-8 weken begint Rho zelf melatonine aan te maken. Het langste slaapblok verschuift naar de nacht. Dit is hét moment om zachtjes een ritueel op te bouwen.",
    tips: [
      "Start een kort, vast bedritueel: badje of wasje, pyjama, voeding, liedje, bed — elke avond dezelfde volgorde",
      "Leg haar 's avonds in een donkere kamer; gebruik 's nachts enkel een zwak oranje lichtje",
      "Een vast opstamoment 's ochtends (bv. 7u) ankert het hele ritme",
      "Let op wakkertijden: na 60-90 minuten wakker zijn is ze meestal alweer moe",
    ],
  },
  {
    weekStart: 14,
    weekEnd: 19,
    titel: "De 4-maanden­sprong in slaap",
    emoji: "🌓",
    totaalSlaap: "14–16 uur per dag",
    nachtSlaap: "10–11 uur (met voedingen)",
    dutjes: "3–4 dutjes",
    wakkerTijd: "1,5–2 uur",
    uitleg:
      "Rond 4 maanden verandert Rho's slaapstructuur blijvend: ze slaapt voortaan in cycli zoals volwassenen, met lichte slaap tussenin. Vaker wakker worden is dus vooruitgang van haar hersenen — al voelt het als een terugval.",
    tips: [
      "Hou het bedritueel heilig: juist nu geeft voorspelbaarheid haar houvast",
      "Probeer haar vaker slaperig-maar-wakker neer te leggen, zodat ze leert zelf in slaap te vallen",
      "Wacht bij nachtelijk gemurmel even af: soms schakelt ze zelf door naar de volgende cyclus",
      "Een vast dutjesritme (in plaats van op de klok kijken) begint nu te lukken",
    ],
  },
  {
    weekStart: 20,
    weekEnd: 33,
    titel: "Ritme en doorslapen",
    emoji: "🌔",
    totaalSlaap: "14–15 uur per dag",
    nachtSlaap: "10–12 uur",
    dutjes: "2–3 dutjes (ochtend, middag, soms late namiddag)",
    wakkerTijd: "2–3 uur",
    uitleg:
      "Fysiek kan Rho nu langere nachten aan. Veel kindjes laten nachtvoedingen geleidelijk los. Een voorspelbaar dagritme — eten, spelen, slapen — wordt haar beste vriend én die van jullie.",
    tips: [
      "Werk naar een herkenbaar dagritme toe, maar blijf flexibel op groeispurt- en sprongdagen",
      "Leg de bedtijd vroeg genoeg: oververmoeide baby's slapen slechter in én door",
      "Bouw nachtvoedingen die ze niet meer nodig heeft rustig af (kortere voedingen of meer tijd ertussen)",
      "Slecht slapen tijdens een sprong of bij tandjes is tijdelijk — keer daarna terug naar het gewone patroon",
    ],
  },
  {
    weekStart: 34,
    weekEnd: 52,
    titel: "Grote slaper, kleine ontdekker",
    emoji: "🌕",
    totaalSlaap: "13–14 uur per dag",
    nachtSlaap: "11–12 uur",
    dutjes: "2 dutjes (ochtend + middag)",
    wakkerTijd: "3–4 uur",
    uitleg:
      "Rho kan nu in principe doorslapen. Maar: scheidingsangst, oefendrang (staan in bed!) en tandjes kunnen nachten tijdelijk verstoren. Het patroon is er — terugvallen zijn uitzonderingen, geen nieuw normaal.",
    tips: [
      "Wordt ze huilend wakker van scheidingsangst? Korte geruststelling werkt beter dan er een feestje van maken",
      "Laat haar overdag volop oefenen met staan en kruipen, dan hoeft het 's nachts minder",
      "Hou het middagdutje niet te laat: na 15u30 wakker betekent meestal makkelijker inslapen 's avonds",
      "Een vast knuffeltje of doekje (veilig vanaf 1 jaar in bed) wordt een troostbron",
    ],
  },
];

export function getHuidigeSlaapFase(weeks: number): SlaapFase | undefined {
  return SLAAP_FASES.find((f) => weeks >= f.weekStart && weeks <= f.weekEnd);
}
