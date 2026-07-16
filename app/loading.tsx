// Globaal laadscherm: verschijnt meteen bij navigatie zodat de app
// direct reageert terwijl de pagina op de server wordt opgebouwd
export default function Loading() {
  return (
    <main className="min-h-screen max-w-lg mx-auto px-5 py-8 flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-[var(--rho-cream)]/20 border-t-[var(--rho-gold)] animate-spin" />
      <p className="text-[var(--rho-cream)]/40 text-sm font-body">Even geduld...</p>
    </main>
  );
}
