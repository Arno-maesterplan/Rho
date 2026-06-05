"use client";

import { useState } from "react";
import { SprongModal } from "@/components/SprongModal";

interface Props {
  children: React.ReactNode;
}

export function TijdlijnClient({ children }: Props) {
  const [selectedSprong, setSelectedSprong] = useState<number | null>(null);

  return (
    <>
      <div
        onClick={(e) => {
          const target = e.target as HTMLElement;
          // Check if user clicked on sprong title/number
          if (target.closest("[data-sprong-num]")) {
            const sprongNum = parseInt(target.closest("[data-sprong-num]")?.getAttribute("data-sprong-num") || "0");
            setSelectedSprong(sprongNum);
          }
        }}
      >
        {children}
      </div>
      <SprongModal sprongNum={selectedSprong} isOpen={!!selectedSprong} onClose={() => setSelectedSprong(null)} />
    </>
  );
}
