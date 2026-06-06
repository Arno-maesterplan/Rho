"use client";

import { useState } from "react";
import { GrowthChart } from "./GrowthChart";

interface Measurement {
  id: string;
  date: string;
  weight_grams?: number;
  height_mm?: number;
  head_cm?: number;
}

interface Props {
  measurements: Measurement[];
}

type TabType = "weight" | "length" | "head";

const TABS: { id: TabType; label: string; unit: string }[] = [
  { id: "weight", label: "Gewicht", unit: "kg" },
  { id: "length", label: "Lengte", unit: "cm" },
  { id: "head", label: "Hoofd", unit: "cm" },
];

export function GrowthTabs({ measurements }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("weight");

  return (
    <div className="space-y-6">
      {/* Tab buttons - pill-shaped */}
      <div className="flex gap-2 justify-center flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-full font-body text-sm transition-all ${
              activeTab === tab.id
                ? "bg-[var(--rho-cream)] text-[var(--rho-red-dark)]"
                : "bg-[var(--rho-cream)]/20 text-[var(--rho-cream)]/70 hover:text-[var(--rho-cream)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chart for active tab */}
      {TABS.map((tab) => (
        <div key={tab.id} className={activeTab === tab.id ? "block" : "hidden"}>
          <GrowthChart measurements={measurements} type={tab.id} label={tab.label} unit={tab.unit} />
        </div>
      ))}
    </div>
  );
}
