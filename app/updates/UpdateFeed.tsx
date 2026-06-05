"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Avatar } from "@/components/Avatar";
import { formatDutchDate } from "@/lib/rho";
import { useRouter } from "next/navigation";
import { useNaam } from "@/lib/useNaam";

type Reactie = { id: string; message: string; created_at: string; author_name: string };
type Update = {
  id: string;
  title: string | null;
  body: string;
  photo_urls: string[] | null;
  created_at: string;
  date: string | null;
  author_name: string;
  leap_number: number | null;
  reactions: Reactie[];
};

export function UpdateFeed({ updates }: { updates: Update[] }) {
  return (
    <div className="space-y-6">
      {updates.map((u) => <UpdateKaart key={u.id} update={u} />)}
    </div>
  );
}

function UpdateKaart({ update }: { update: Update }) {
  const router = useRouter();
  const naam = useNaam();
  const supabase = createClient();
  const [reactie, setReactie] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReacties, setShowReacties] = useState(false);

  async function stuurReactie() {
    if (!reactie.trim()) return;
    setLoading(true);
    await supabase.from("reactions").insert({
      update_id: update.id,
      message: reactie.trim(),
      author_name: naam || "Onbekend",
    });
    setReactie("");
    setLoading(false);
    router.refresh();
  }

  return (
    <article className="bg-[var(--rho-cream)]/5 border border-[var(--rho-cream)]/10 rounded-2xl overflow-hidden">
      {update.photo_urls && update.photo_urls.length > 0 && (
        <div className={`grid gap-0.5 ${update.photo_urls.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
          {update.photo_urls.slice(0, 4).map((url, i) => (
            <img
              key={i}
              src={url}
              alt=""
              className={`w-full object-cover ${update.photo_urls!.length === 1 ? "aspect-[4/3]" : "aspect-square"} ${update.photo_urls!.length === 3 && i === 0 ? "col-span-2" : ""}`}
            />
          ))}
        </div>
      )}

      <div className="p-5 space-y-3">
        <div className="flex items-center gap-3">
          <Avatar name={update.author_name ?? "?"} size="sm" />
          <div>
            <p className="text-[var(--rho-cream)] text-sm font-body font-medium">{update.author_name ?? "Onbekend"}</p>
            <p className="text-[var(--rho-cream)]/40 text-xs font-body">{formatDutchDate(update.date ?? update.created_at)}</p>
          </div>
        </div>

        {update.title && (
          <h3 className="font-display text-lg text-[var(--rho-cream)] leading-snug">{update.title}</h3>
        )}
        <p className="text-[var(--rho-cream)]/80 text-sm font-body leading-relaxed whitespace-pre-wrap">{update.body}</p>

        {update.reactions.length > 0 && (
          <div>
            <button
              onClick={() => setShowReacties(!showReacties)}
              className="text-[var(--rho-cream)]/40 text-xs font-body hover:text-[var(--rho-cream)]/60 transition-colors"
            >
              {showReacties ? "Verberg" : "Toon"} {update.reactions.length} reactie{update.reactions.length !== 1 ? "s" : ""}
            </button>
            {showReacties && (
              <div className="mt-3 space-y-2">
                {update.reactions.map((r) => (
                  <div key={r.id} className="flex gap-2">
                    <Avatar name={r.author_name ?? "?"} size="sm" />
                    <div className="bg-[var(--rho-cream)]/8 rounded-xl px-3 py-2 flex-1">
                      <p className="text-[var(--rho-cream)] text-xs font-body font-medium">{r.author_name}</p>
                      <p className="text-[var(--rho-cream)]/70 text-sm font-body">{r.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <input
            type="text"
            placeholder={naam ? `Reageer als ${naam}...` : "Reageer..."}
            value={reactie}
            onChange={(e) => setReactie(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && stuurReactie()}
            className="flex-1 bg-[var(--rho-cream)]/10 border border-[var(--rho-cream)]/15 rounded-full px-4 py-2 text-[var(--rho-cream)] placeholder:text-[var(--rho-cream)]/25 text-sm font-body focus:outline-none focus:border-[var(--rho-gold)]/40 transition-colors"
          />
          <button
            onClick={stuurReactie}
            disabled={!reactie.trim() || loading}
            className="w-9 h-9 rounded-full bg-[var(--rho-gold)] text-[var(--rho-red-dark)] flex items-center justify-center text-sm disabled:opacity-30 transition-opacity hover:opacity-90"
          >
            ↑
          </button>
        </div>
      </div>
    </article>
  );
}
