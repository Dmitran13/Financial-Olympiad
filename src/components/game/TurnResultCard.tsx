"use client";
import { useEffect, useState } from "react";
import EventBanner from "./EventBanner";

interface TurnResult {
  revenue: number;
  expenses: number;
  profit: number;
  explanation: string;
  eventImpact: { description: string } | null;
  isLastTurn: boolean;
}

interface Props {
  result: TurnResult;
  onNext: () => void;
}

export default function TurnResultCard({ result, onNext }: Props) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 50); return () => clearTimeout(t); }, []);

  const fmt = (n: number) => n.toLocaleString("ru");

  return (
    <div className={`transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className="rounded-2xl bg-slate-900 ring-1 ring-slate-700 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white">Итоги месяца</h3>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-slate-800 p-3">
            <div className="text-xs text-slate-400 mb-1">Выручка</div>
            <div className="font-bold text-emerald-400">{fmt(result.revenue)} ₽</div>
          </div>
          <div className="rounded-xl bg-slate-800 p-3">
            <div className="text-xs text-slate-400 mb-1">Расходы</div>
            <div className="font-bold text-red-400">{fmt(result.expenses)} ₽</div>
          </div>
          <div className="rounded-xl bg-slate-800 p-3">
            <div className="text-xs text-slate-400 mb-1">Прибыль</div>
            <div className={`font-bold ${result.profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {result.profit >= 0 ? "+" : ""}{fmt(result.profit)} ₽
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-indigo-500/30 bg-indigo-900/30 p-4 flex gap-3">
          <span className="text-lg">💡</span>
          <p className="text-sm text-indigo-200">{result.explanation}</p>
        </div>

        {result.eventImpact && <EventBanner description={result.eventImpact.description} />}

        <button onClick={onNext} className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 font-bold text-white hover:opacity-90 transition-opacity">
          {result.isLastTurn ? "Посмотреть итоги 🎉" : "Следующий ход →"}
        </button>
      </div>
    </div>
  );
}
