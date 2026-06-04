"use client";

import { useState, useEffect } from "react";

export function useNaam() {
  const [naam, setNaam] = useState<string>("");

  useEffect(() => {
    setNaam(localStorage.getItem("rho_naam") ?? "");

    const handler = () => setNaam(localStorage.getItem("rho_naam") ?? "");
    window.addEventListener("rho_naam_gewijzigd", handler);
    return () => window.removeEventListener("rho_naam_gewijzigd", handler);
  }, []);

  return naam;
}
