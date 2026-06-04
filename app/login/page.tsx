"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/Button";

export default function LoginPage() {
  const supabase = createClient();

  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleMagicLink() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/api/auth/callback` },
    });
    setLoading(false);
    if (error) {
      setError("Kon de link niet sturen. Probeer opnieuw.");
    } else {
      setSent(true);
    }
  }

  async function handlePassword() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Onjuist e-mailadres of wachtwoord.");
    }
    // middleware redirect bij succes
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Decoratieve sterren */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
        {(
          [
            { pos: "top-12 left-8", size: 12 },
            { pos: "top-24 right-16", size: 18 },
            { pos: "top-[40%] left-4", size: 14 },
            { pos: "bottom-24 right-8", size: 20 },
            { pos: "bottom-12 left-1/3", size: 10 },
          ] as { pos: string; size: number }[]
        ).map(({ pos, size }, i) => (
          <span
            key={i}
            className={`absolute ${pos} text-[var(--rho-cream)] opacity-20`}
            style={{ fontSize: `${size}px` }}
          >
            ✦
          </span>
        ))}
      </div>

      <div className="w-full max-w-sm space-y-8 relative">
        {/* Header */}
        <div className="text-center space-y-2">
          <p className="text-[var(--rho-gold)] text-sm tracking-widest uppercase font-body">
            Geboren 13 mei 2025
          </p>
          <h1 className="font-display text-5xl text-[var(--rho-cream)]">Rho</h1>
          <p className="text-[var(--rho-cream)]/70 font-body text-sm">
            Welkom bij het eerste jaar van Rho.
            <br />
            Meld je aan om te beginnen.
          </p>
        </div>

        {/* Kaart */}
        <div className="bg-[var(--rho-cream)]/10 border border-[var(--rho-cream)]/20 backdrop-blur-sm rounded-2xl p-8 space-y-6">
          {sent ? (
            <div className="text-center space-y-3">
              <div className="text-4xl">✉️</div>
              <h2 className="font-display text-xl text-[var(--rho-cream)]">Check je inbox</h2>
              <p className="text-[var(--rho-cream)]/70 text-sm font-body">
                We stuurden een aanmeldlink naar <strong>{email}</strong>.
                Klik op de link in de mail om in te loggen.
              </p>
              <button
                className="text-[var(--rho-gold)] text-xs underline underline-offset-2 font-body mt-2"
                onClick={() => setSent(false)}
              >
                Andere e-mail proberen
              </button>
            </div>
          ) : (
            <>
              {/* Mode tabs */}
              <div className="flex rounded-full border border-[var(--rho-cream)]/20 overflow-hidden">
                <button
                  onClick={() => setMode("magic")}
                  className={`flex-1 py-2 text-xs font-body transition-colors ${
                    mode === "magic"
                      ? "bg-[var(--rho-cream)] text-[var(--rho-red)]"
                      : "text-[var(--rho-cream)]/60 hover:text-[var(--rho-cream)]"
                  }`}
                >
                  Link via e-mail
                </button>
                <button
                  onClick={() => setMode("password")}
                  className={`flex-1 py-2 text-xs font-body transition-colors ${
                    mode === "password"
                      ? "bg-[var(--rho-cream)] text-[var(--rho-red)]"
                      : "text-[var(--rho-cream)]/60 hover:text-[var(--rho-cream)]"
                  }`}
                >
                  Wachtwoord
                </button>
              </div>

              {mode === "magic" && (
                <p className="text-[var(--rho-cream)]/60 text-xs font-body -mt-2">
                  Voor grootouders, meter en peter — geen wachtwoord nodig.
                </p>
              )}

              {/* Formulier */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[var(--rho-cream)]/80 text-xs font-body mb-1.5">
                    E-mailadres
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="naam@voorbeeld.be"
                    className="w-full bg-[var(--rho-cream)]/10 border border-[var(--rho-cream)]/20 rounded-xl px-4 py-3 text-[var(--rho-cream)] placeholder:text-[var(--rho-cream)]/30 text-sm font-body focus:outline-none focus:border-[var(--rho-gold)]/60 transition-colors"
                  />
                </div>

                {mode === "password" && (
                  <div>
                    <label className="block text-[var(--rho-cream)]/80 text-xs font-body mb-1.5">
                      Wachtwoord
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[var(--rho-cream)]/10 border border-[var(--rho-cream)]/20 rounded-xl px-4 py-3 text-[var(--rho-cream)] placeholder:text-[var(--rho-cream)]/30 text-sm font-body focus:outline-none focus:border-[var(--rho-gold)]/60 transition-colors"
                    />
                  </div>
                )}

                {error && (
                  <p className="text-red-300 text-xs font-body bg-red-900/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <Button
                  variant="primary"
                  loading={loading}
                  className="w-full"
                  onClick={mode === "magic" ? handleMagicLink : handlePassword}
                  disabled={!email || (mode === "password" && !password)}
                >
                  {mode === "magic" ? "Stuur aanmeldlink" : "Aanmelden"}
                </Button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-[var(--rho-cream)]/30 text-xs font-body">
          Enkel toegankelijk voor de familie van Rho
        </p>
      </div>
    </main>
  );
}
