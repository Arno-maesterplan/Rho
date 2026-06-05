"use client";

import { useState } from "react";
import { GroeiTabContent } from "./GroeiTabContent";
import { GroeiOverzichtTab } from "./GroeiOverzichtTab";

interface Meting {
  id: string;
  date: string;
  weight_grams?: number;
  height_mm?: number;
  head_cm?: number;
}

interface Props {
  measurements: Meting[];
  onAddClick: (type?: "weight" | "length" | "head") => void;
}

type TabType = "gewicht" | "lengte" | "hoofd" | "overzicht";

const TABS: Array<{ id: TabType; label: string }> = [
  { id: "gewicht", label: "Gewicht" },
  { id: "lengte", label: "Lengte" },
  { id: "hoofd", label: "Hoofd" },
  { id: "overzicht", label: "Overzicht" },
];

export function GroeiTabs({ measurements, onAddClick }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("gewicht");

  return (
    <div className="space-y-4">
      {/* Tab Buttons */}
      <div className="flex gap-2 border-b border-[var(--rho-cream)]/10 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-body text-sm transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "text-[var(--rho-gold)] border-b-2 border-[var(--rho-gold)]"
                : "text-[var(--rho-cream)]/60 hover:text-[var(--rho-cream)]/80"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "gewicht" && (
          <GroeiTabContent
            measurements={measurements}
            type="weight"
            label="Gewicht"
            unit="kg"
            onAddClick={() => onAddClick("weight")}
          />
        )}

        {activeTab === "lengte" && (
          <GroeiTabContent
            measurements={measurements}
            type="length"
            label="Lengte"
            unit="cm"
            onAddClick={() => onAddClick("length")}
          />
        )}

        {activeTab === "hoofd" && (
          <GroeiTabContent
            measurements={measurements}
            type="head"
            label="Hoofdomtrek"
            unit="cm"
            onAddClick={() => onAddClick("head")}
          />
        )}

        {activeTab === "overzicht" && <GroeiOverzichtTab measurements={measurements} onAddClick={() => onAddClick()} />}
      </div>
    </div>
  );
}
