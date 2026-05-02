"use client";
import type { TemplateConfig } from "@/types/game";

interface Decisions {
  price: number;
  adSpend: number;
  staffDelta: number;
  creditTaken?: number;
  invested?: number;
  qualitySpend?: number;
  staffTraining?: number;
  promoDiscount?: number;
  assortment?: number;
  loyaltyProgram?: number;
  partnership?: number;
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

  const isMiddle = ageGroup === "MIDDLE" || ageGroup === "SENIOR";
  const isSenior = ageGroup === "SENIOR";

  return (
    <div className="rounded-2xl bg-slate-900 ring-1 ring-slate-800 p-6 space-y-5">
      <h3 className="text-lg font-bold text-white">Решения на месяц</h3>

      {/* Цена */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-slate-300">{priceLabel}</label>
          <div className="flex items-center gap-2">
            {marketPrice && <span className="text-xs text-slate-500">рынок: {fmt(marketPrice)} ₽</span>}
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

      {/* Промо-акция — JUNIOR+ */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-slate-300">Промо-скидка</label>
          <span className="bg-rose-600 text-white text-xs px-2 py-0.5 rounded font-bold">
            {decisions.promoDiscount ?? 0}%
          </span>
        </div>
        <input type="range" min={0} max={30} step={5} value={decisions.promoDiscount ?? 0}
          onChange={(e) => set("promoDiscount")(Number(e.target.value))}
          className="w-full accent-rose-500" />
        <div className="flex justify-between text-xs text-slate-500 mt-1"><span>0%</span><span>30%</span></div>
        <p className="text-xs text-slate-500 mt-1">Больше клиентов, но ниже маржа</p>
      </div>

      {/* Реклама */}
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

      {/* Обучение персонала — JUNIOR+ */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-slate-300">Обучение персонала</label>
          <span className="bg-sky-600 text-white text-xs px-2 py-0.5 rounded font-bold">{fmt(decisions.staffTraining ?? 0)} ₽</span>
        </div>
        <input type="range" min={0} max={15000} step={1000} value={decisions.staffTraining ?? 0}
          onChange={(e) => set("staffTraining")(Number(e.target.value))}
          className="w-full accent-sky-500" />
        <div className="flex justify-between text-xs text-slate-500 mt-1"><span>0 ₽</span><span>15 000 ₽</span></div>
        <p className="text-xs text-slate-500 mt-1">Каждый сотрудник обслуживает больше клиентов</p>
      </div>

      {/* Качество сервиса — MIDDLE+ */}
      {isMiddle && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-slate-300">Качество сервиса</label>
            <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded font-bold">{fmt(decisions.qualitySpend ?? 0)} ₽</span>
          </div>
          <input type="range" min={0} max={20000} step={1000} value={decisions.qualitySpend ?? 0}
            onChange={(e) => set("qualitySpend")(Number(e.target.value))}
            className="w-full accent-emerald-500" />
          <div className="flex justify-between text-xs text-slate-500 mt-1"><span>0 ₽</span><span>20 000 ₽</span></div>
          <p className="text-xs text-slate-500 mt-1">Повышает лояльность и сарафанное радио</p>
        </div>
      )}

      {/* Расширение ассортимента — MIDDLE+ */}
      {isMiddle && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-slate-300">Расширение ассортимента</label>
            <span className="bg-amber-600 text-white text-xs px-2 py-0.5 rounded font-bold">{fmt(decisions.assortment ?? 0)} ₽</span>
          </div>
          <input type="range" min={0} max={20000} step={1000} value={decisions.assortment ?? 0}
            onChange={(e) => set("assortment")(Number(e.target.value))}
            className="w-full accent-amber-500" />
          <div className="flex justify-between text-xs text-slate-500 mt-1"><span>0 ₽</span><span>20 000 ₽</span></div>
          <p className="text-xs text-slate-500 mt-1">Больше позиций → выше средний чек</p>
        </div>
      )}

      {/* Программа лояльности — MIDDLE+ */}
      {isMiddle && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-slate-300">Программа лояльности</label>
            <span className="bg-pink-600 text-white text-xs px-2 py-0.5 rounded font-bold">{fmt(decisions.loyaltyProgram ?? 0)} ₽</span>
          </div>
          <input type="range" min={0} max={15000} step={1000} value={decisions.loyaltyProgram ?? 0}
            onChange={(e) => set("loyaltyProgram")(Number(e.target.value))}
            className="w-full accent-pink-500" />
          <div className="flex justify-between text-xs text-slate-500 mt-1"><span>0 ₽</span><span>15 000 ₽</span></div>
          <p className="text-xs text-slate-500 mt-1">Бонусы и кэшбэк удерживают постоянных клиентов</p>
        </div>
      )}

      {/* Сотрудники — MIDDLE+ */}
      {isMiddle && (
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

      {/* SENIOR: Кредит + Инвестиции + Партнёрство */}
      {isSenior && (
        <>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300">Партнёрство</label>
              <span className="bg-teal-600 text-white text-xs px-2 py-0.5 rounded font-bold">{fmt(decisions.partnership ?? 0)} ₽</span>
            </div>
            <input type="range" min={0} max={30000} step={2000} value={decisions.partnership ?? 0}
              onChange={(e) => set("partnership")(Number(e.target.value))}
              className="w-full accent-teal-500" />
            <div className="flex justify-between text-xs text-slate-500 mt-1"><span>0 ₽</span><span>30 000 ₽</span></div>
            <p className="text-xs text-slate-500 mt-1">Корпоративные клиенты и B2B-сделки</p>
          </div>
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
