"use client";

import { UniversityRecommendation } from "@/lib/game-engine";

interface Props {
  recommendations: UniversityRecommendation[] | undefined;
  archetype?: { emoji: string; name: string };
}

export default function UniversityRecommendations({ recommendations, archetype }: Props) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">🎓 Рекомендации вузов</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {recommendations.map((uni) => (
          <a
            key={uni.id}
            href={uni.website}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-indigo-500 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-3 mb-2">
              <span className="text-2xl">{uni.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-white truncate">{uni.name}</div>
                <div className="text-xs text-emerald-400 font-semibold">
                  Совместимость: {uni.alignmentScore}%
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-400 line-clamp-3 mb-3">{uni.reason}</p>
            <div className="text-xs text-indigo-400 hover:text-indigo-300">Подробнее →</div>
          </a>
        ))}
      </div>
    </section>
  );
}
