"use client";

import { WONDER_WEEKS } from "@/lib/rho";
import { Button } from "./Button";

interface Props {
  sprongNum: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SprongModal({ sprongNum, isOpen, onClose }: Props) {
  if (!isOpen || sprongNum === null || sprongNum < 1 || sprongNum > 10) return null;

  const sprong = WONDER_WEEKS[sprongNum - 1];
  if (!sprong) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm px-4 pb-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm bg-[#1a0810] border border-[var(--rho-cream)]/20 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div>
          <p className="text-[var(--rho-gold)] text-xs font-body uppercase tracking-wider mb-2">Sprong {sprongNum}</p>
          <h2 className="font-display text-2xl text-[var(--rho-cream)] leading-tight">{sprong.name}</h2>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-[var(--rho-cream)]/60 text-xs font-body uppercase tracking-wider mb-1">Week</p>
            <p className="text-[var(--rho-cream)] font-body text-sm">{sprong.weekStart} - {sprong.weekEnd}</p>
          </div>

          <div>
            <p className="text-[var(--rho-cream)]/60 text-xs font-body uppercase tracking-wider mb-1">Wat verwacht je?</p>
            <p className="text-[var(--rho-cream)]/80 font-body text-sm leading-relaxed">{sprong.description}</p>
          </div>

          <div>
            <p className="text-[var(--rho-cream)]/60 text-xs font-body uppercase tracking-wider mb-1">Symptomen</p>
            <ul className="space-y-1">
              {sprong.symptoms?.map((sym, i) => (
                <li key={i} className="text-[var(--rho-cream)]/70 text-sm font-body">
                  • {sym}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[var(--rho-cream)]/60 text-xs font-body uppercase tracking-wider mb-1">Tips</p>
            <ul className="space-y-1">
              {sprong.tips?.map((tip, i) => (
                <li key={i} className="text-[var(--rho-cream)]/70 text-sm font-body">
                  • {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Button variant="ghost" className="w-full" onClick={onClose}>
          Sluiten
        </Button>
      </div>
    </div>
  );
}
