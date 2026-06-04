interface AvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-base" };

export function Avatar({ name, avatarUrl, size = "md" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover border-2 border-[var(--rho-cream)]/30`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} rounded-full bg-[var(--rho-gold)] text-[var(--rho-red-dark)] font-display font-bold flex items-center justify-center flex-shrink-0`}
    >
      {initials}
    </div>
  );
}
