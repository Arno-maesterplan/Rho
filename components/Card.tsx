import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  soft?: boolean;
}

export function Card({ children, className = "", soft }: CardProps) {
  return (
    <div
      className={`rounded-2xl p-6 ${
        soft
          ? "bg-[var(--rho-cream-soft)] text-[var(--rho-red-dark)]"
          : "bg-[var(--rho-cream)]/10 border border-[var(--rho-cream)]/20 backdrop-blur-sm"
      } ${className}`}
    >
      {children}
    </div>
  );
}
