"use client";
import type { TemplateConfig } from "@/types/game";

interface Decisions {
  price: number;
  adSpend: number;
  staffDelta: number;
  creditTaken?: number;
  invested?: number;
  qualitySpend?: number;
}

interface Props {
  ageGroup: "JUNIOR" | "MIDDLE" | "SENIOR";
  decisions: Decisions;
  onChange: (d: Decisions) => void;
  templateConfig?: Partial<Pick<TemplateConfig, "priceRange" | "adRange" | "marketPrice" | "priceLabel" | "adLabel">>;
}

const fmt = (n: number) => n.toLocaleString("ru");

export default function DecisionPanel({ ageGroup, decisions, onChange, templateConfig }: Props) {
  const set = (key: keyof Decisions) => (val: number) => onChange({ ...decisions, [key]: val });

  const priceMin = templateConfig?.priceRange?.[0] ?? 50;
  const priceMax = templateConfig?.priceRange?.[1] ?? 300;
  const priceStep = Math.max(10, Math.round((priceMax - priceMin) / 30));
  const adMax = templateConfig?.adRange?.[1] ?? 30000;
  const priceLabel = templateConfig?.priceLabel ?? "Цена товара";
  const adLabel = templateConfig?.adLabel ?? "Реклама в месяц";
  const marketPrice = templateConfig?.marketPrice;

  return (
    <div className="rounded-2xl bg-slate-900 ring-1 ring-slate-800 p-6 space-y-6">
      <h3 className="text-lg font-bold text-white">Решения на месяц</h3>

      {/* Price */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-slate-300">{priceLabel}</label>
          <div className="flex items-center gap-2">
            {marketPrice && (
              <span className="text-xs text-slate-500">рынок: {fmt(marketPrice)} ₽</span>
            )}
            <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded font-bold">{fmt(decisions.price)} ₽</span>
          </div>
        </div>
        <input type="range" min={priceMin} max={priceMax} step={priceStep} value={decisions.price}
          onChange={(e) => set("price")(Number(e.target.value))}
          className="w-full accent-indigo-500" />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>{fmt(priceMin)} ₽</span><span>{fmt(priceMax)} ₽</span>
        </div>
      </div>

      {/* Ad spend */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-slate-300">{adLabel}</label>
          <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded font-bold">{fmt(decisions.adSpend)} ₽</span>
        </div>
        <input type="range" min={0} max={adMax} step={1000} value={decisions.adSpend}
          onChange={(e) => set("adSpend")(Number(e.target.value))}
          className="w-full accent-indigo-500" />
        <div className="flex justify-between text-xs text-slate-500 mt-1"><span>0 ₽</span><span>{fmt(adMax)} ₽</span></div>
      </div>

      {/* Quality — MIDDLE and SENIOR */}
      {(ageGroup === "MIDDLE" || ageGroup === "SENIOR") && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-slate-300">Качество сервиса</label>
            <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded font-bold">{fmt(decisions.qualitySpend ?? 0)} ₽</span>
          </div>
          <input type="range" min={0} max={20000} step={1000} value={decisions.qualitySpend ?? 0}
            onChange={(e) => set("qualitySpend")(Number(e.target.value))}
            className="w-full accent-emerald-500" />
          <div className="flex justify-between text-xs text-slate-500 mt-1"><span>0 ₽</span><span>20 000 ₽</span></div>
          <p className="text-xs text-slate-500 mt-1">Повышает лояльность клиентов и сарафанное радио</p>
        </div>
      )}

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
              <label className="text-sm font-medium text-slate-300">Кредит (15% в мес.)</label>
              <span className="bg-orange-600 text-white text-xs px-2 py-0.5 rounded font-bold">{fmt(decisions.creditTaken ?? 0)} ₽</span>
            </div>
            <input type="range" min={0} max={50000} step={5000} value={decisions.creditTaken ?? 0}
              onChange={(e) => set("creditTaken")(Number(e.target.value))}
              className="w-full accent-orange-500" />
            <div className="flex justify-between text-xs text-slate-500 mt-1"><span>0 ₽</span><span>50 000 ₽</span></div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300">Инвестиции в оборудование</label>
              <span className="bg-violet-600 text-white text-xs px-2 py-0.5 rounded font-bold">{fmt(decisions.invested ?? 0)} ₽</span>
            </div>
            <input type="range" min={0} max={30000} step={5000} value={decisions.invested ?? 0}
              onChange={(e) => set("invested")(Number(e.target.value))}
              className="w-full accent-violet-500" />
            <div className="flex justify-between text-xs text-slate-500 mt-1"><span>0 ₽</span><span>30 000 ₽</span></div>
          </div>
        </>
      )}
    </div>
  );
}
