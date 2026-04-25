const GRADIENTS: Record<string, string> = {
  VISIONARY: "from-violet-600 to-indigo-700",
  SNIPER: "from-emerald-600 to-teal-700",
  MARKETER: "from-pink-600 to-rose-700",
  CRISIS_MANAGER: "from-orange-600 to-amber-700",
  STRATEGIST: "from-blue-600 to-cyan-700",
};

interface Props { id: string; name: string; emoji: string; description: string }

export default function ArchetypeCard({ id, name, emoji, description }: Props) {
  const gradient = GRADIENTS[id] ?? "from-slate-600 to-slate-700";
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-8 text-white`}>
      <div className="text-xs uppercase tracking-widest text-white/70 mb-2">Твой бизнес-архетип</div>
      <div className="text-8xl text-center my-4">{emoji}</div>
      <div className="text-3xl font-bold text-center">{name}</div>
      <div className="text-center text-white/80 text-lg mt-2">{description}</div>
    </div>
  );
}
