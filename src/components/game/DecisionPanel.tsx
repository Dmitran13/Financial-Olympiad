"use client";

interface Decisions {
  price: number;
  adSpend: number;
  staffDelta: number;
  creditTaken?: number;
  invested?: number;
}

interface Props {
  ageGroup: "JUNIOR" | "MIDDLE" | "SENIOR";
  decisions: Decisions;
  onChange: (d: Decisions) => void;
}

const fmt = (n: number) => n.toLocaleString("ru");

export default function DecisionPanel({ ageGroup, decisions, onChange }: Props) {
  const set = (key: keyof Decisions) => (val: number) => onChange({ ...decisions, [key]: val });

  return (
    <div className="rounded-2xl bg-slate-900 ring-1 ring-slate-800 p-6 space-y-6">
      <h3 className="text-lg font-bold text-white">Решения на месяц</h3>

      {/* Price */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-slate-300">Цена товара</label>
          <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded font-bold">{fmt(decisions.price)} ₽</span>
        </div>
        <input type="range" min={50} max={300} step={10} value={decisions.price}
          onChange={(e) => set("price")(Number(e.target.value))}
          className="w-full accent-indigo-500" />
        <div className="flex justify-between text-xs text-slate-500 mt-1"><span>50 ₽</span><span>300 ₽</span></div>
      </div>

      {/* Ad spend */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-slate-300">Реклама в месяц</label>
          <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded font-bold">{fmt(decisions.adSpend)} ₽</span>
        </div>
        <input type="range" min={0} max={30000} step={1000} value={decisions.adSpend}
          onChange={(e) => set("adSpend")(Number(e.target.value))}
          className="w-full accent-indigo-500" />
        <div className="flex justify-between text-xs text-slate-500 mt-1"><span>0 ₽</span><span>30 000 ₽</span></div>
      </div>

      {/* Staff — MIDDLE and SENIOR */}
      {(ageGroup === "MIDDLE" || ageGroup === "SENIOR") && (
        <div>
          <label className="text-sm font-medium text-slate-300 block mb-2">Сотрудники</label>
          <div className="flex items-center gap-4">
            <button onClick={() => set("staffDelta")(Math.max(-3, decisions.staffDelta - 1))}
              className="w-10 h-10 rounded-lg bg-slate-800 text-white font-bold text-lg hover:bg-slate-700 transition-colors">−</button>
            <span className="text-white font-bold text-lg w-20 text-center">
              {decisions.staffDelta > 0 ? `+${decisions.staffDelta}` : decisions.staffDelta} чел.
            </span>
            <button onClick={() => set("staffDelta")(Math.min(3, decisions.staffDelta + 1))}
              className="w-10 h-10 rounded-lg bg-slate-800 text-white font-bold text-lg hover:bg-slate-700 transition-colors">+</button>
          </div>
        </div>
      )}

      {/* Credit + Invest — SENIOR only */}
      {ageGroup === "SENIOR" && (
        <>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300">Кредит</label>
              <span className="bg-orange-600 text-white text-xs px-2 py-0.5 rounded font-bold">{fmt(decisions.creditTaken ?? 0)} ₽</span>
            </div>
            <input type="range" min={0} max={50000} step={5000} value={decisions.creditTaken ?? 0}
              onChange={(e) => set("creditTaken")(Number(e.target.value))}
              className="w-full accent-orange-500" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300">Инвестиции в оборудование</label>
              <span className="bg-violet-600 text-white text-xs px-2 py-0.5 rounded font-bold">{fmt(decisions.invested ?? 0)} ₽</span>
            </div>
            <input type="range" min={0} max={30000} step={5000} value={decisions.invested ?? 0}
              onChange={(e) => set("invested")(Number(e.target.value))}
              className="w-full accent-violet-500" />
          </div>
        </>
      )}
    </div>
  );
}
