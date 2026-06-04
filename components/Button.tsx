"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "gold";
  loading?: boolean;
}

export function Button({
  variant = "primary",
  loading,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-body text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[var(--rho-cream)] text-[var(--rho-red)] hover:bg-[var(--rho-cream-soft)] focus-visible:outline-[var(--rho-cream)]",
    ghost:
      "border border-[var(--rho-cream)]/40 text-[var(--rho-cream)] hover:bg-[var(--rho-cream)]/10 focus-visible:outline-[var(--rho-cream)]",
    gold:
      "bg-[var(--rho-gold)] text-[var(--rho-red-dark)] hover:opacity-90 focus-visible:outline-[var(--rho-gold)]",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
