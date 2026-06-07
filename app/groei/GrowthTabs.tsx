"use client";

import { useState } from "react";
import { GrowthChartSVG } from "./GrowthChartSVG";

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
    <div className="space-y-0">
      {/* Tab buttons - pill-shaped, VERY compact */}
      <div className="flex gap-1 justify-center flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-2 py-0.5 rounded-full font-body text-[9px] transition-all ${
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
          <GrowthChartSVG measurements={measurements} type={tab.id} label={tab.label} unit={tab.unit} />
        </div>
      ))}
    </div>
  );
}
