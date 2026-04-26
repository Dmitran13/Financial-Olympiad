interface Props {
  cash?: number;
  totalProfit?: number;
  satisfaction?: number;
  currentTurn?: number;
}

export default function BusinessStatus({ cash = 0, totalProfit = 0, satisfaction = 0, currentTurn = 0 }: Props) {
  const satColor = satisfaction > 60 ? "bg-green-500" : satisfaction > 40 ? "bg-yellow-500" : "bg-red-500";
  const fmt = (n: number) => n.toLocaleString("ru");

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl bg-slate-800 p-4">
        <div className="text-xs text-slate-400 mb-1">💰 Касса</div>
        <div className={`text-xl font-bold ${cash >= 0 ? "text-emerald-400" : "text-red-400"}`}>
          {cash >= 0 ? "" : "−"}{fmt(Math.abs(cash))} ₽
        </div>
      </div>
      <div className="rounded-xl bg-slate-800 p-4">
        <div className="text-xs text-slate-400 mb-1">📈 Прибыль</div>
        <div className={`text-xl font-bold ${totalProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
          {totalProfit >= 0 ? "+" : ""}{fmt(totalProfit)} ₽
        </div>
      </div>
      <div className="rounded-xl bg-slate-800 p-4">
        <div className="text-xs text-slate-400 mb-1">😊 Лояльность</div>
        <div className="text-xl font-bold text-white mb-2">{satisfaction}%</div>
        <div className="bg-slate-700 rounded-full h-2">
          <div className={`${satColor} h-2 rounded-full transition-all`} style={{ width: `${satisfaction}%` }} />
        </div>
      </div>
      <div className="rounded-xl bg-slate-800 p-4">
        <div className="text-xs text-slate-400 mb-1">📅 Ход</div>
        <div className="text-xl font-bold text-white">{currentTurn} / 6</div>
      </div>
    </div>
  );
}
