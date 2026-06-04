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
  // Speciaal
  { emoji: "🛁", title: "Eerste bad thuis", category: "speciaal" },
  { emoji: "🚗", title: "Eerste autorit", category: "speciaal" },
  { emoji: "🌳", title: "Eerste keer buiten", category: "speciaal" },
  { emoji: "👴👵", title: "Eerste ontmoeting grootouders", category: "speciaal" },
  { emoji: "✈️", title: "Eerste vliegtuig", category: "speciaal" },
  { emoji: "🏖️", title: "Eerste vakantie", category: "speciaal" },
  { emoji: "🎄", title: "Eerste Kerstmis", category: "speciaal" },
  { emoji: "🎂", title: "Eerste verjaardag", category: "speciaal" },
] as const;

export const CATEGORIES: Record<string, string> = {
  sociaal: "Sociaal",
  motorisch: "Motorisch",
  communicatie: "Communicatie",
  eten: "Eten",
  slapen: "Slapen",
  speciaal: "Speciaal",
};
