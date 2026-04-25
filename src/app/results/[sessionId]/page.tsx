"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ArchetypeCard from "@/components/results/ArchetypeCard";
import ProfitChart from "@/components/results/ProfitChart";
import BehaviorBars from "@/components/results/BehaviorBars";
import CertificatePreview from "@/components/results/CertificatePreview";

const MOCK = {
  session: { totalProfit: 187500, totalRevenue: 642000, totalExpenses: 454500, customerSatisfaction: 72, templateName: "Магазин" },
  turns: [
    { turnNumber: 1, profit: 12000 }, { turnNumber: 2, profit: -3000 },
    { turnNumber: 3, profit: 25000 }, { turnNumber: 4, profit: 18000 },
    { turnNumber: 5, profit: 31000 }, { turnNumber: 6, profit: 28000 },
  ],
  archetype: { id: "SNIPER", name: "Финансовый снайпер", emoji: "🎯", description: "Считает каждую копейку, высокая маржа" },
  behaviorProfile: { analyticalScore: 78, marketingScore: 35, riskScore: 20, stabilityScore: 82 },
  user: { nickname: "МаксиМ2025" },
};

type ResultData = typeof MOCK;

export default function ResultsPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const [data, setData] = useState<ResultData | null>(null);

  useEffect(() => {
    fetch(`/api/game/sessions/${sessionId}/result`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(MOCK));
  }, [sessionId]);

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const profit = data.session.totalProfit;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Hero */}
        <div className="text-center py-8">
          <div className="text-5xl mb-4">✨</div>
          <h1 className="text-3xl font-bold mb-2">Симуляция завершена!</h1>
          <div className={`text-5xl font-bold ${profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {profit >= 0 ? "+" : ""}{profit.toLocaleString("ru")} ₽
          </div>
          <p className="text-slate-400 mt-2">за 6 игровых месяцев</p>
        </div>

        <ArchetypeCard {...data.archetype} />

        <section>
          <h2 className="text-xl font-bold mb-4">📊 По месяцам</h2>
          <ProfitChart turns={data.turns} />
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">🧠 Поведенческий профиль</h2>
          <div className="bg-slate-900 rounded-xl p-6">
            <BehaviorBars {...data.behaviorProfile} />
          </div>
        </section>

        <CertificatePreview
          nickname={data.user.nickname ?? "Игрок"}
          archetype={data.archetype}
          totalProfit={data.session.totalProfit}
          templateName={data.session.templateName}
        />

        <div className="flex gap-4 pb-8">
          <button onClick={() => router.push("/play")}
            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 font-bold hover:opacity-90 transition-opacity">
            🔄 Сыграть снова
          </button>
          <button onClick={() => router.push("/leaderboard")}
            className="flex-1 py-4 rounded-xl border border-slate-600 font-bold hover:border-indigo-500 transition-colors">
            🏆 Таблица лидеров
          </button>
        </div>
      </div>
    </div>
  );
}
