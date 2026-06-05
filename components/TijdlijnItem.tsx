"use client";

import { useState } from "react";
import { SprongModal } from "./SprongModal";

interface Props {
  type: "sprong" | "milestone" | "update" | "geboren";
  sprongNum?: number;
  children: React.ReactNode;
}

export function TijdlijnItem({ type, sprongNum, children }: Props) {
  const [showModal, setShowModal] = useState(false);

  // Niet clickable voor "geboren" en updates (die zijn al links)
  if (type === "geboren" || type === "update") {
    return <>{children}</>;
  }

  if (type === "sprong") {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="w-full text-left cursor-pointer hover:opacity-80 transition-opacity"
        >
          {children}
        </button>
        <SprongModal sprongNum={sprongNum ?? null} isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  // Milestone: toon in detail modal
  if (type === "milestone") {
    return (
      <button
        onClick={() => setShowModal(true)}
        className="w-full text-left cursor-pointer hover:opacity-80 transition-opacity"
      >
        {children}
      </button>
    );
  }

  return <>{children}</>;
}
