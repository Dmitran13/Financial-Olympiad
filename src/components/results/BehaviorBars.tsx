"use client";
import { useEffect, useState } from "react";

interface Props { analyticalScore: number; marketingScore: number; riskScore: number; stabilityScore: number }

const METRICS = [
  { key: "analyticalScore" as const, label: "🧮 Аналитик", color: "bg-indigo-500" },
  { key: "marketingScore" as const, label: "📣 Маркетолог", color: "bg-pink-500" },
  { key: "riskScore" as const, label: "⚡ Риск-аппетит", color: "bg-orange-500" },
  { key: "stabilityScore" as const, label: "⚖️ Стабильность", color: "bg-green-500" },
];

export default function BehaviorBars(props: Props) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 100); return () => clearTimeout(t); }, []);

  return (
    <div className="space-y-4">
      {METRICS.map((m) => (
        <div key={m.key}>
          <div className="flex justify-between text-sm text-slate-300 mb-1">
            <span>{m.label}</span>
            <span className="text-slate-400">{props[m.key]}/100</span>
          </div>
          <div className="bg-slate-700 rounded-full h-3">
            <div className={`${m.color} h-3 rounded-full transition-all duration-1000 ease-out`}
              style={{ width: animated ? `${props[m.key]}%` : "0%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
