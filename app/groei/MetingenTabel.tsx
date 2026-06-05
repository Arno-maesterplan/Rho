"use client";

interface Meting {
  id: string;
  date: string;
  weight_grams?: number;
  height_mm?: number;
  head_cm?: number;
}

interface Props {
  measurements: Meting[];
}

export function MetingenTabel({ measurements }: Props) {
  if (measurements.length === 0) {
    return <div className="text-[var(--rho-cream)]/40 py-4 text-sm">Nog geen metingen</div>;
  }

  // Sort by date, newest first
  const sorted = [...measurements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-[var(--rho-cream)]/5 border border-[var(--rho-cream)]/10 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--rho-cream)]/10 bg-[var(--rho-cream)]/3">
              <th className="text-left px-4 py-3 text-[var(--rho-cream)]/60 font-body font-medium">Datum</th>
              <th className="text-right px-4 py-3 text-[var(--rho-cream)]/60 font-body font-medium">Gewicht</th>
              <th className="text-right px-4 py-3 text-[var(--rho-cream)]/60 font-body font-medium">Lengte</th>
              <th className="text-right px-4 py-3 text-[var(--rho-cream)]/60 font-body font-medium">Hoofd</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--rho-cream)]/5">
            {sorted.map((m) => (
              <tr key={m.id} className="hover:bg-[var(--rho-cream)]/5 transition-colors">
                <td className="px-4 py-3 text-[var(--rho-cream)] font-body">
                  {new Date(m.date).toLocaleDateString("nl-NL")}
                </td>
                <td className="text-right px-4 py-3 text-[var(--rho-cream)] font-body">
                  {m.weight_grams ? `${(m.weight_grams / 1000).toFixed(2)} kg` : "—"}
                </td>
                <td className="text-right px-4 py-3 text-[var(--rho-cream)] font-body">
                  {m.height_mm ? `${(m.height_mm / 10).toFixed(1)} cm` : "—"}
                </td>
                <td className="text-right px-4 py-3 text-[var(--rho-cream)] font-body">
                  {m.head_cm ? `${m.head_cm.toFixed(1)} cm` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
