"use client";

import { useState, useEffect, useCallback } from "react";

interface Reaction {
  id: string;
  author_name: string;
  emoji: string;
}

interface Props {
  itemId: string;
  itemType: "milestone" | "update";
  currentUserName: string;
}

const EMOJI_KEUZES = ["❤️", "🥹", "😍", "😂", "👏", "🎉"];

export function EmojiReactions({ itemId, itemType, currentUserName }: Props) {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [kiezerOpen, setKiezerOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/reactions?itemId=${itemId}&itemType=${itemType}`);
      if (res.ok) setReactions(await res.json());
    } catch (err) {
      console.error("Reacties laden mislukt:", err);
    }
  }, [itemId, itemType]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggle(emoji: string) {
    if (busy || !currentUserName) return;
    setBusy(true);
    setKiezerOpen(false);

    // Optimistic update
    const mijnBestaande = reactions.find(
      (r) => r.author_name === currentUserName && r.emoji === emoji
    );
    if (mijnBestaande) {
      setReactions((prev) => prev.filter((r) => r.id !== mijnBestaande.id));
    } else {
      setReactions((prev) => [
        ...prev,
        { id: `tmp-${Date.now()}`, author_name: currentUserName, emoji },
      ]);
    }

    try {
      await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, itemType, authorName: currentUserName, emoji }),
      });
      await load();
    } catch (err) {
      console.error("Reactie opslaan mislukt:", err);
      await load();
    } finally {
      setBusy(false);
    }
  }

  // Groepeer per emoji
  const gegroepeerd = EMOJI_KEUZES.map((emoji) => {
    const items = reactions.filter((r) => r.emoji === emoji);
    return {
      emoji,
      count: items.length,
      vanMij: items.some((r) => r.author_name === currentUserName),
      namen: items.map((r) => r.author_name).join(", "),
    };
  }).filter((g) => g.count > 0);

  return (
    <div className="flex items-center gap-1.5 flex-wrap relative">
      {gegroepeerd.map((g) => (
        <button
          key={g.emoji}
          onClick={() => toggle(g.emoji)}
          title={g.namen}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-all border ${
            g.vanMij
              ? "bg-[var(--rho-gold)]/25 border-[var(--rho-gold)]/50"
              : "bg-[var(--rho-cream)]/8 border-[var(--rho-cream)]/15 hover:bg-[var(--rho-cream)]/15"
          }`}
        >
          <span>{g.emoji}</span>
          <span className="text-[var(--rho-cream)]/70 text-xs font-body">{g.count}</span>
        </button>
      ))}

      {/* + knop om reactie te kiezen */}
      <button
        onClick={() => setKiezerOpen((v) => !v)}
        className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--rho-cream)]/8 border border-[var(--rho-cream)]/15 hover:bg-[var(--rho-cream)]/15 text-[var(--rho-cream)]/60 text-sm transition-all"
        aria-label="Reageer met emoji"
      >
        {kiezerOpen ? "×" : "+"}
      </button>

      {kiezerOpen && (
        <div className="absolute bottom-full left-0 mb-2 z-20 flex gap-1 bg-[#1a0810] border border-[var(--rho-cream)]/20 rounded-full px-2 py-1.5 shadow-xl">
          {EMOJI_KEUZES.map((emoji) => (
            <button
              key={emoji}
              onClick={() => toggle(emoji)}
              className="text-xl hover:scale-125 transition-transform px-0.5"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
