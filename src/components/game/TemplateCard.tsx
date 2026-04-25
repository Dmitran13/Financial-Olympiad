"use client";

interface Props {
  emoji: string;
  name: string;
  description: string;
  startCash: number;
  onClick: () => void;
  isLoading: boolean;
}

export default function TemplateCard({ emoji, name, description, startCash, onClick, isLoading }: Props) {
  return (
    <button onClick={onClick} disabled={isLoading}
      className="relative text-left rounded-2xl bg-slate-900 p-8 border border-slate-700 cursor-pointer hover:border-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-500/20 disabled:opacity-70 w-full">
      <div className="text-6xl mb-4">{emoji}</div>
      <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
      <p className="text-slate-400 text-sm mb-4">{description}</p>
      <div className="text-indigo-400 text-sm font-medium">
        Начальный капитал: {startCash.toLocaleString("ru")} ₽
      </div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-900/80">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
        </div>
      )}
    </button>
  );
}
