"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BusinessStatus from "./BusinessStatus";
import DecisionPanel from "./DecisionPanel";
import TurnResultCard from "./TurnResultCard";

type AgeGroup = "JUNIOR" | "MIDDLE" | "SENIOR";

interface GameState {
  cash: number;
  totalProfit: number;
  customerSatisfaction: number;
  currentTurn: number;
  ageGroup: AgeGroup;
  templateName?: string;
}

interface TurnResult {
  revenue: number;
  expenses: number;
  profit: number;
  satisfaction: number;
  explanation: string;
  eventImpact: { description: string } | null;
  isLastTurn: boolean;
}

interface Decisions {
  price: number;
  adSpend: number;
  staffDelta: number;
  creditTaken?: number;
  invested?: number;
}

const MOCK: GameState = {
  cash: 50000, totalProfit: 0, customerSatisfaction: 50,
  currentTurn: 0, ageGroup: "JUNIOR", templateName: "Магазин",
};

export default function GameBoard({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>(MOCK);
  const [decisions, setDecisions] = useState<Decisions>({ price: 150, adSpend: 5000, staffDelta: 0 });
  const [lastResult, setLastResult] = useState<TurnResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phase, setPhase] = useState<"deciding" | "result">("deciding");

  useEffect(() => {
    fetch(`/api/game/sessions/${sessionId}`)
      .then((r) => r.json())
      .then((data) => setGameState(data))
      .catch(() => setGameState(MOCK));
  }, [sessionId]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/game/sessions/${sessionId}/turns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(decisions),
      });
      const data: TurnResult = await res.json();
      setLastResult(data);
      setGameState((prev) => ({
        ...prev,
        cash: prev.cash + data.profit,
        totalProfit: prev.totalProfit + data.profit,
        customerSatisfaction: data.satisfaction,
        currentTurn: prev.currentTurn + 1,
      }));
      setPhase("result");
    } catch {
      alert("Ошибка при отправке хода. Попробуй ещё раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (lastResult?.isLastTurn) {
      router.push(`/results/${sessionId}`);
    } else {
      setLastResult(null);
      setPhase("deciding");
    }
  };

  const progress = (gameState.currentTurn / 6) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Ход {gameState.currentTurn} из 6</span>
            <span>{gameState.templateName ?? "Бизнес"}</span>
          </div>
          <div className="bg-slate-800 rounded-full h-2">
            <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }} />
          </div>
        </div>

        <BusinessStatus
          cash={gameState.cash}
          totalProfit={gameState.totalProfit}
          satisfaction={gameState.customerSatisfaction}
          currentTurn={gameState.currentTurn}
        />

        {phase === "deciding" && (
          <>
            <DecisionPanel ageGroup={gameState.ageGroup} decisions={decisions} onChange={setDecisions} />
            <button onClick={handleSubmit} disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 font-bold text-lg disabled:opacity-50 hover:opacity-90 transition-opacity">
              {isSubmitting ? "Считаем результаты..." : "Закрыть месяц →"}
            </button>
          </>
        )}

        {phase === "result" && lastResult && (
          <TurnResultCard result={lastResult} onNext={handleNext} />
        )}
      </div>
    </div>
  );
}
