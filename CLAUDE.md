# Rho — CLAUDE.md

## Wat is dit project?

Een persoonlijke webapp voor Rho De Beule-Maes, geboren op 13 mei 2025.
De app is bedoeld voor de naaste familie (ouders, grootouders, meter/peter) om Rho's eerste levensjaar samen te beleven en op te volgen.

Gebouwd door: Arno (vader, indie developer, non-technical maar leert snel)

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database + Auth + Storage:** Supabase
- **Hosting:** Vercel
- **Styling:** Tailwind CSS + custom CSS variables
- **Taal UI:** Nederlands

### Credentials (zet in .env.local, nooit committen)
```
NEXT_PUBLIC_SUPABASE_URL=https://hdjqoomnbucluhjvcmys.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkanFvb21uYnVjbHVoanZjbXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2MDQyOTQsImV4cCI6MjA5NjE4MDI5NH0.9lKB3iVFNQG3pQ_BgJdAb5FPamb7uEvKQpKRFE8XZQE
```

---

## Design Systeem

### Inspiratie
Het geboortekaartje van Rho: dieprode achtergrond (#C8102E), crème/gebroken wit illustraties (#F5ECD7), kalligrafisch lettertype voor namen, fijne lijnillustraties van kinderen, katten, sterren, maan, bloemen.

### Kleurenpalet
```css
--rho-red:     #C8102E;   /* hoofdkleur achtergrond */
--rho-cream:   #F5ECD7;   /* tekst, illustraties */
--rho-cream-soft: #FAF3E8; /* lichte secties */
--rho-red-dark: #9B0D22;  /* hover states, accenten */
--rho-gold:    #D4A853;   /* highlights, iconen */
```

### Typografie
- **Display/titels:** `Playfair Display` of `Cormorant Garamond` (Google Fonts) — kalligrafisch, warm
- **Body:** `Lora` — leesbaar, warm serif
- **Nooit:** Inter, Roboto, Arial, system fonts

### Sfeer
Warm, illustratief, organisch. Geen harde hoeken. Subtiele textuur op achtergronden. Fijne lijnen. Gevoel van een persoonlijk dagboek, niet van een tech-app.

---

## Rollen & Authenticatie

### Twee rollen via Supabase Auth:
1. **Ouders** (`role: parent`) — Arno & Céline
   - Kunnen alles: foto's uploaden, milestones toevoegen, gewicht/lengte ingeven, updates schrijven
   - Login via email/wachtwoord
2. **Familie** (`role: family`) — grootouders, meter (Delfien), peter (Thomas)
   - Kunnen lezen, reageren op updates, hartjes geven
   - Login via magic link (geen wachtwoord nodig — makkelijk voor grootouders)

### Supabase RLS (Row Level Security):
- Alles is leesbaar voor ingelogde gebruikers
- Schrijven/uploaden alleen voor `parent` rol
- Reageren voor alle ingelogde gebruikers

---

## Database Schema

Maak deze tabellen aan in Supabase (SQL editor):

```sql
-- Profielen
create table profiles (
  id uuid references auth.users primary key,
  name text not null,
  role text check (role in ('parent', 'family')) default 'family',
  avatar_url text,
  created_at timestamptz default now()
);

-- Gewicht & lengte metingen
create table measurements (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  weight_grams int,        -- gewicht in gram
  height_mm int,           -- lengte in mm
  head_cm numeric(4,1),    -- hoofdomtrek in cm
  note text,
  created_at timestamptz default now()
);

-- Milestones (eerste glimlach, eerste stapje, etc.)
create table milestones (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  title text not null,      -- "Eerste glimlach"
  description text,
  emoji text,               -- visueel icoon
  photo_url text,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- Updates / dagboekberichten van ouders
create table updates (
  id uuid primary key default gen_random_uuid(),
  title text,
  body text not null,
  photo_urls text[],        -- array van foto URLs
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- Reacties van familie
create table reactions (
  id uuid primary key default gen_random_uuid(),
  update_id uuid references updates(id) on delete cascade,
  author_id uuid references profiles(id),
  message text,
  created_at timestamptz default now()
);
```

---

## Wonder Weeks — De 10 Sprongen

Rho's geboortedatum: **13 mei 2025**
Alle sprongen zijn berekend in weken vanaf geboorte (naar verwachting, ±1 week normaal).

```javascript
export const WONDER_WEEKS = [
  {
    number: 1,
    name: "De Wereld van Gewaarwordingen",
    emoji: "🌊",
    weekStart: 5,
    weekEnd: 6,
    dateStart: "2025-06-17",
    dateEnd: "2025-06-24",
    storm: true, // moeilijke periode
    description: "Rho merkt plots veel meer: lichten, geluiden, aanrakingen. Haar zenuwstelsel verwerkt een stortvloed aan nieuwe prikkels.",
    symptoms: ["Meer huilen", "Moeilijker troosten", "Meer aan borst willen", "Slechter slapen"],
    tips: ["Houd haar dicht bij je", "Rustige omgeving", "Huid-op-huid contact", "Geduld — dit duurt max 2 weken"],
    duration: "1-2 weken storm, daarna zonneschijn"
  },
  {
    number: 2,
    name: "De Wereld van Patronen",
    emoji: "⭕",
    weekStart: 8,
    weekEnd: 9,
    dateStart: "2025-07-08",
    dateEnd: "2025-07-15",
    storm: true,
    description: "Rho ontdekt patronen: in gezichten, geluiden, bewegingen. Ze herkent nu dingen.",
    symptoms: ["Meer huilen", "Wil constant gedragen worden", "Slecht slapen"],
    tips: ["Toon haar je gezicht van dichtbij", "Praat met haar", "Regelmaat helpt"],
    duration: "1-2 weken"
  },
  {
    number: 3,
    name: "De Wereld van Overgangen",
    emoji: "🔄",
    weekStart: 12,
    weekEnd: 13,
    dateStart: "2025-08-05",
    dateEnd: "2025-08-12",
    storm: true,
    description: "Rho begrijpt verandering: van stilte naar geluid, van licht naar donker. Continuïteit in de wereld.",
    symptoms: ["Erg huilig", "Wil alleen bij mama/papa zijn", "Slaapproblemen"],
    tips: ["Laat haar veranderingen observeren", "Zwaai voor haar", "Muziek aan/uit"],
    duration: "1-2 weken"
  },
  {
    number: 4,
    name: "De Wereld van Gebeurtenissen",
    emoji: "⚡",
    weekStart: 19,
    weekEnd: 20,
    dateStart: "2025-09-23",
    dateEnd: "2025-09-30",
    storm: true,
    description: "Rho begrijpt dat handelingen een begin en einde hebben. Ze ziet oorzaak en gevolg.",
    symptoms: ["Grote huilbuien", "Wil continu aandacht", "Slaap compleet van slag"],
    tips: ["Speel kiekeboe", "Laat haar dingen laten vallen en oprapen", "Veel praten over wat je doet"],
    duration: "2-3 weken"
  },
  {
    number: 5,
    name: "De Wereld van Relaties",
    emoji: "↔️",
    weekStart: 26,
    weekEnd: 27,
    dateStart: "2025-11-11",
    dateEnd: "2025-11-18",
    storm: true,
    description: "Rho ontdekt afstand en ruimte: hoe ver dingen van elkaar zijn, hoe ze zichzelf verhouden tot de wereld.",
    symptoms: ["Scheidingsangst", "Huilt als je wegloopt", "Constant vasthouden willen"],
    tips: ["Geef haar een spiegel", "Verstoppertje spelen", "Kruip samen op de grond"],
    duration: "2-3 weken"
  },
  {
    number: 6,
    name: "De Wereld van Categorieën",
    emoji: "🗂️",
    weekStart: 37,
    weekEnd: 38,
    dateStart: "2026-02-03",
    dateEnd: "2026-02-10",
    storm: true,
    description: "Rho sorteert de wereld in groepen: dieren, mensen, voedsel. Een enorme mentale sprong.",
    symptoms: ["Driftbuien", "Selectief eten", "Slaapproblemen"],
    tips: ["Boekjes met categorieën", "Dieren tonen", "Consistent in grenzen"],
    duration: "3-4 weken"
  },
  {
    number: 7,
    name: "De Wereld van Opeenvolgingen",
    emoji: "📋",
    weekStart: 46,
    weekEnd: 47,
    dateStart: "2026-04-14",
    dateEnd: "2026-04-21",
    storm: true,
    description: "Rho begrijpt dat dingen in een volgorde gebeuren. Ze kan een simpel plan uitvoeren.",
    symptoms: ["Koppig", "Wil zelf alles doen", "Frustratie als iets niet lukt"],
    tips: ["Laat haar helpen", "Stap-voor-stap uitleggen", "Geduld met zelfstandigheid"],
    duration: "3-4 weken"
  },
  {
    number: 8,
    name: "De Wereld van Programma's",
    emoji: "🎯",
    weekStart: 55,
    weekEnd: 56,
    dateStart: "2026-06-16",
    dateEnd: "2026-06-23",
    storm: true,
    description: "Rho combineert handelingen tot flexibele programma's. Ze past zich aan situaties aan.",
    symptoms: ["Intense driftbuien", "Manipulatief gedrag testen", "Slaap chaos"],
    tips: ["Duidelijke grenzen", "Consequent zijn", "Haar 'programma's' bewonderen"],
    duration: "4-5 weken"
  },
  {
    number: 9,
    name: "De Wereld van Principes",
    emoji: "⚖️",
    weekStart: 64,
    weekEnd: 65,
    dateStart: "2026-08-18",
    dateEnd: "2026-08-25",
    storm: true,
    description: "Rho begrijpt regels en principes. Ze test grenzen bewust en begrijpt 'eerlijk'.",
    symptoms: ["Grenzen testen", "Jaloezie", "Heftige emoties"],
    tips: ["Uitleggen waarom", "Consequent in regels", "Haar gevoel benoemen"],
    duration: "4-5 weken"
  },
  {
    number: 10,
    name: "De Wereld van Systemen",
    emoji: "🌍",
    weekStart: 75,
    weekEnd: 76,
    dateStart: "2026-11-03",
    dateEnd: "2026-11-10",
    storm: true,
    description: "De grootste sprong: Rho begrijpt dat de wereld een systeem is. Ze heeft haar eigen waarden en identiteit.",
    symptoms: ["Grote emotionele schommelingen", "Identiteitszoeken", "Complexe driftbuien"],
    tips: ["Haar identiteit bevestigen", "Veel praten", "Stabiele thuisbasis bieden"],
    duration: "4-6 weken"
  }
];
```

---

## Milestones om bij te houden

Voorgedefinieerde milestones die ouders kunnen aanvinken + datum toevoegen:

```javascript
export const MILESTONE_TEMPLATES = [
  // Sociaal
  { emoji: "😊", title: "Eerste glimlach", category: "sociaal" },
  { emoji: "😄", title: "Eerste sociale glimlach (op een gezicht)", category: "sociaal" },
  { emoji: "😂", title: "Eerste lach", category: "sociaal" },
  { emoji: "👋", title: "Herkent mama en papa", category: "sociaal" },
  
  // Motorisch
  { emoji: "🦒", title: "Kan hoofd rechtop houden", category: "motorisch" },
  { emoji: "🔄", title: "Rolt van buik naar rug", category: "motorisch" },
  { emoji: "🔄", title: "Rolt van rug naar buik", category: "motorisch" },
  { emoji: "🪑", title: "Zit rechtop zonder steun", category: "motorisch" },
  { emoji: "🐛", title: "Begint te kruipen", category: "motorisch" },
  { emoji: "🚶", title: "Staat rechtop met steun", category: "motorisch" },
  { emoji: "👣", title: "Eerste stapjes", category: "motorisch" },
  
  // Communicatie
  { emoji: "🗣️", title: "Eerste koer/babbelgeluiden", category: "communicatie" },
  { emoji: "💬", title: "Eerste 'mama' of 'papa'", category: "communicatie" },
  { emoji: "📢", title: "Eerste woordje (ander dan mama/papa)", category: "communicatie" },
  
  // Eten & slapen
  { emoji: "🥄", title: "Eerste hapje vast voedsel", category: "eten" },
  { emoji: "🌙", title: "Eerste nacht van 5u aan één stuk", category: "slapen" },
  { emoji: "🌙", title: "Slaapt door de nacht", category: "slapen" },
  
  // Leuk & speciaal
  { emoji: "🛁", title: "Eerste bad thuis", category: "speciaal" },
  { emoji: "🚗", title: "Eerste autorit", category: "speciaal" },
  { emoji: "🌳", title: "Eerste keer buiten", category: "speciaal" },
  { emoji: "👴👵", title: "Eerste ontmoeting grootouders", category: "speciaal" },
  { emoji: "✈️", title: "Eerste vliegtuig", category: "speciaal" },
  { emoji: "🏖️", title: "Eerste vakantie", category: "speciaal" },
  { emoji: "🎄", title: "Eerste Kerstmis", category: "speciaal" },
  { emoji: "🎂", title: "Eerste verjaardag", category: "speciaal" },
];
```

---

## Groeicurves

Gebruik de WHO Child Growth Standards voor meisjes (0-12 maanden).
Toon P3, P15, P50, P85, P97 percentielen als referentielijnen.
Metingen worden opgeslagen in de `measurements` tabel.

Grafieken te bouwen met **Recharts** (al beschikbaar in Next.js ecosysteem).

---

## App Structuur (pagina's)

```
/                    → Dashboard: huidige status Rho, huidige sprong, laatste update
/tijdlijn            → Alle 10 Wonder Weeks sprongen visueel op een tijdlijn
/groei               → Gewicht/lengte curves met ingave formulier
/milestones          → Grid van alle milestones, aangevinkt of niet
/updates             → Feed van ouders (foto's + tekst), familie kan reageren
/login               → Magic link voor familie, email/ww voor ouders
```

---

## Dashboard (/) — De kern van de app

Dit is de eerste pagina die iedereen ziet. Moet in één oogopslag duidelijk maken:

1. **Hoe oud is Rho vandaag** — in weken én in maanden (bv. "3 weken en 2 dagen")
2. **Huidige sprong** — zit ze in een storm of in een rustige periode?
   - Storm: visueel donkere wolk met animatie, uitleg wat er speelt
   - Rustig: zon/sterren, uitleg wat ze aan het ontwikkelen is
3. **Volgende sprong** — over hoeveel dagen/weken
4. **Laatste milestone** die toegevoegd werd
5. **Laatste update** van de ouders

### Visuele metafoor voor sprongen (GEEN zon/wolk zoals Wonder Weeks):
Gebruik **weer gebaseerd op de Vlaamse seizoenen** maar poëtisch:
- **Storm/sprong:** Nachtelijke hemel met bewegende wolken, bliksem in de verte
- **Rustige periode:** Gouden avondlicht, sterren die langzaam verschijnen
- **Net na een sprong (zonneschijn):** Ochtendlicht dat doorbreekt

---

## Fase 1 — Bouw in deze volgorde

1. **Project setup**
   - `npx create-next-app@latest rho --typescript --tailwind --app`
   - Installeer: `@supabase/supabase-js`, `@supabase/auth-helpers-nextjs`, `recharts`, `date-fns`
   - Maak `.env.local` aan met credentials
   - Push naar GitHub: `https://github.com/Arno-maesterplan/Rho.git`

2. **Supabase setup**
   - Voer het SQL schema uit (zie boven)
   - Enable RLS op alle tabellen
   - Maak storage bucket aan: `photos` (public read, authenticated write)
   - Stel auth in: email magic link inschakelen

3. **Design systeem**
   - Stel CSS variables in (kleuren, fonts)
   - Importeer Google Fonts: Playfair Display + Lora
   - Maak globale componenten: `Button`, `Card`, `Avatar`

4. **Auth flow**
   - `/login` pagina met magic link optie
   - Middleware voor beschermde routes
   - Profiel aanmaken bij eerste login

5. **Dashboard** (`/`)
   - Leeftijdsberekening vanaf 13 mei 2025
   - Wonder Weeks logica (huidige sprong bepalen)
   - Visuele weersmetafoor

6. **Tijdlijn** (`/tijdlijn`)
   - Alle 10 sprongen op een horizontale of verticale tijdlijn
   - Huidige positie gemarkeerd
   - Klikbaar voor detail per sprong

7. **Groei** (`/groei`)
   - Formulier voor ouders om meting in te geven
   - Grafiek met WHO percentielen
   - Laatste 5 metingen in tabel

8. **Milestones** (`/milestones`)
   - Grid van alle milestone templates
   - Aanvinken met datum + optionele foto
   - Visueel onderscheid: behaald vs. nog te komen

9. **Updates feed** (`/updates`)
   - Ouders kunnen post maken (tekst + foto's)
   - Familie ziet feed chronologisch
   - Reageren met tekst

---

## Belangrijke implementatiedetails

### Leeftijd berekening
```javascript
import { differenceInWeeks, differenceInDays } from 'date-fns';

const BIRTH_DATE = new Date('2025-05-13');

export function getRhoAge() {
  const today = new Date();
  const weeks = differenceInWeeks(today, BIRTH_DATE);
  const days = differenceInDays(today, BIRTH_DATE) % 7;
  return { weeks, days };
}
```

### Huidige sprong bepalen
```javascript
export function getCurrentLeap(weeks) {
  const activeLeap = WONDER_WEEKS.find(
    leap => weeks >= leap.weekStart - 1 && weeks <= leap.weekEnd + 1
  );
  const nextLeap = WONDER_WEEKS.find(leap => weeks < leap.weekStart);
  const isInStorm = activeLeap && weeks >= activeLeap.weekStart && weeks <= activeLeap.weekEnd;
  
  return { activeLeap, nextLeap, isInStorm };
}
```

### Foto upload naar Supabase Storage
```javascript
const { data, error } = await supabase.storage
  .from('photos')
  .upload(`updates/${Date.now()}-${file.name}`, file);
```

---

## Tone & Copy

- Warm, persoonlijk, nooit klinisch
- Schrijf alsof je tegen de familie praat, niet tegen een gebruiker
- Gebruik "Rho" niet "het kind" of "de baby"
- Datums altijd in het Nederlands (13 mei, niet May 13)
- Sprong = sprong (niet "leap"), Storm = storm, Zonneschijn = zonneschijn

---

## Wat NIET bouwen in Fase 1

- Push notificaties (Fase 2)
- PDF export / fotoboek (Fase 3)
- Commentaar notificaties per email (Fase 2)
- Multi-kind ondersteuning (nooit nodig, dit is voor Rho)

---

## Start commando voor Claude Code

Gebruik dit als eerste prompt in Claude Code:

> "Lees CLAUDE.md volledig. Bouw Fase 1, stap 1 t/m 4: project setup, Supabase configuratie, design systeem en auth flow. Gebruik de exacte kleuren, fonts en credentials uit CLAUDE.md. Commit elke stap naar GitHub."
