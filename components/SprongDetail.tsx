"use client";

import { useState } from "react";
import { SprongModal } from "./SprongModal";

interface Props {
  children: React.ReactNode;
  sprongNum: number | null;
}

export function SprongDetail({ children, sprongNum }: Props) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full text-left cursor-pointer hover:opacity-80 transition-opacity"
      >
        {children}
      </button>
      <SprongModal sprongNum={sprongNum} isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
