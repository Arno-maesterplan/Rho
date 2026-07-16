import { getRhoAge } from "@/lib/rho";

// Klein regeltje "Rho is nu X weken en Y dagen" — voor in paginaheaders
export function LeeftijdRegel() {
  const { weeks, days } = getRhoAge();
  return (
    <p className="text-[var(--rho-cream)]/50 text-sm font-body mt-1">
      Rho is nu {weeks} {weeks === 1 ? "week" : "weken"}
      {days > 0 ? ` en ${days} ${days === 1 ? "dag" : "dagen"}` : ""} oud
    </p>
  );
}
