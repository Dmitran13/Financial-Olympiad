"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ARCHETYPE_EMOJI: Record<string, string> = { VISIONARY: "🚀", SNIPER: "🎯", MARKETER: "💝", CRISIS_MANAGER: "🛡️", STRATEGIST: "♟️" };
const ARCHETYPE_NAME: Record<string, string> = { VISIONARY: "Визионер", SNIPER: "Снайпер", MARKETER: "Маркетолог", CRISIS_MANAGER: "Антикризисник", STRATEGIST: "Стратег" };

const MOCK = [
  { rank: 1, nickname: "АнтонК", city: "Москва", totalProfit: 312000, customerSatisfaction: 88, archetype: "SNIPER", templateName: "Магазин" },
  { rank: 2, nickname: "МашаФ", city: "Санкт-Петербург", totalProfit: 287500, customerSatisfaction: 91, archetype: "MARKETER", templateName: "Кафе" },
  { rank: 3, nickname: "ДимаС", city: "Казань", totalProfit: 251000, customerSatisfaction: 76, archetype: "STRATEGIST", templateName: "Магазин" },
  { rank: 4, nickname: "ОляП", city: "Екатеринбург", totalProfit: 198000, customerSatisfaction: 65, archetype: "VISIONARY", templateName: "Кафе" },
  { rank: 5, nickname: "КиряМ", city: "Новосибирск", totalProfit: 175000, customerSatisfaction: 58, archetype: "CRISIS_MANAGER", templateName: "Магазин" },
  { rank: 6, nickname: "АляН", city: "Краснодар", totalProfit: 143000, customerSatisfaction: 70, archetype: "SNIPER", templateName: "Кафе" },
  { rank: 7, nickname: "ВаняР", city: "Уфа", totalProfit: 121000, customerSatisfaction: 55, archetype: "STRATEGIST", templateName: "Магазин" },
  { rank: 8, nickname: "СашаЛ", city: "Воронеж", totalProfit: 98000, customerSatisfaction: 62, archetype: "MARKETER", templateName: "Кафе" },
  { rank: 9, nickname: "ПетяВ", city: "Тула", totalProfit: 67000, customerSatisfaction: 48, archetype: "VISIONARY", templateName: "Магазин" },
  { rank: 10, nickname: "НатаШ", city: "Пермь", totalProfit: 34000, customerSatisfaction: 41, archetype: "CRISIS_MANAGER", templateName: "Кафе" },
];

const RANK_MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };
type Row = typeof MOCK[number];

export default function LeaderboardPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>(MOCK);
  const [templateFilter, setTemplateFilter] = useState("all");

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((d) => { if (d.rows?.length) setRows(d.rows); })
      .catch(() => {});
  }, []);

  const filtered = templateFilter === "all" ? rows
    : rows.filter((r) => r.templateName === (templateFilter === "shop" ? "Магазин" : "Кафе"));

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold">🏆 Таблица лидеров</h1>
          <button onClick={() => router.push("/play")}
            className="rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-5 py-2 text-sm font-bold text-white hover:opacity-90 transition-opacity">
            Играть
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[["all", "Все"], ["shop", "🛒 Магазин"], ["cafe", "☕ Кафе"]].map(([val, label]) => (
            <button key={val} onClick={() => setTemplateFilter(val)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${templateFilter === val ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden ring-1 ring-slate-800">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900 text-xs text-slate-400 uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Место</th>
                <th className="px-4 py-3 text-left">Игрок</th>
                <th className="px-4 py-3 text-right">Прибыль</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">Лояльность</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Архетип</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={row.rank} className={i % 2 === 0 ? "bg-slate-900" : "bg-slate-800/50"}>
                  <td className="px-4 py-3 font-bold text-lg">
                    {RANK_MEDAL[row.rank] ?? <span className="text-slate-500 text-sm">{row.rank}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold shrink-0">
                        {row.nickname[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{row.nickname}</div>
                        <div className="text-xs text-slate-500">{row.city}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-400">
                    +{row.totalProfit.toLocaleString("ru")} ₽
                  </td>
                  <td className="px-4 py-3 text-right text-slate-300 hidden sm:table-cell">
                    {row.customerSatisfaction}%
                  </td>
                  <td className="px-4 py-3 text-right hidden md:table-cell">
                    <span className="bg-slate-700 px-2 py-1 rounded text-sm">
                      {ARCHETYPE_EMOJI[row.archetype]} {ARCHETYPE_NAME[row.archetype]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
