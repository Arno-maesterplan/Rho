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
  const safeMetings = measurements || [];

  try {
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
              measurements={safeMetings}
              type="weight"
              label="Gewicht"
              unit="kg"
              onAddClick={() => onAddClick("weight")}
            />
          )}

          {activeTab === "lengte" && (
            <GroeiTabContent
              measurements={safeMetings}
              type="length"
              label="Lengte"
              unit="cm"
              onAddClick={() => onAddClick("length")}
            />
          )}

          {activeTab === "hoofd" && (
            <GroeiTabContent
              measurements={safeMetings}
              type="head"
              label="Hoofdomtrek"
              unit="cm"
              onAddClick={() => onAddClick("head")}
            />
          )}

          {activeTab === "overzicht" && (
            <GroeiOverzichtTab measurements={safeMetings} onAddClick={() => onAddClick()} />
          )}
        </div>
      </div>
    );
  } catch (err) {
    console.error("GroeiTabs render error:", err);
    return (
      <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4">
        <p className="text-red-300 text-sm">Error rendering growth tabs</p>
      </div>
    );
  }
}
