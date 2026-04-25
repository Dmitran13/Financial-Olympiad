const MONTHS = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"];

interface Props { turns: { turnNumber: number; profit: number }[] }

export default function ProfitChart({ turns }: Props) {
  const maxAbs = Math.max(1, ...turns.map((t) => Math.abs(t.profit)));
  const barH = (p: number) => Math.round((Math.abs(p) / maxAbs) * 80);
  const baseline = 100;

  return (
    <div className="bg-slate-800 rounded-xl p-4 overflow-x-auto">
      <svg viewBox="0 0 420 160" className="w-full" style={{ minWidth: 300 }}>
        {turns.map((t, i) => {
          const x = 30 + i * 60;
          const h = barH(t.profit);
          const positive = t.profit >= 0;
          const y = positive ? baseline - h : baseline;
          const label = t.profit >= 0 ? `+${(t.profit / 1000).toFixed(0)}к` : `${(t.profit / 1000).toFixed(0)}к`;
          const labelY = positive ? y - 6 : y + h + 14;
          return (
            <g key={i}>
              <rect x={x - 18} y={y} width={36} height={Math.max(2, h)} fill={positive ? "#22c55e" : "#ef4444"} rx={3} />
              <text x={x} y={labelY} textAnchor="middle" fontSize={10} fill={positive ? "#86efac" : "#fca5a5"}>{label}</text>
              <text x={x} y={baseline + 16} textAnchor="middle" fontSize={11} fill="#94a3b8">{MONTHS[i]}</text>
            </g>
          );
        })}
        <line x1={12} y1={baseline} x2={408} y2={baseline} stroke="#334155" strokeWidth={1} />
      </svg>
    </div>
  );
}
