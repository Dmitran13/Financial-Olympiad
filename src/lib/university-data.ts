import type { ArchetypeId } from "@/types/game";

export interface UniversityMatch {
  id: string;
  name: string;
  emoji: string;
  description: string;
  website: string;
  programs: string[];
  archetypeAlign: Record<ArchetypeId, number>;
}

export const UNIVERSITIES: UniversityMatch[] = [
  // SNIPER (Аналитик, точные вычисления)
  {
    id: "mfti",
    name: "МФТИ (Московский физико-технический институт)",
    emoji: "🧮",
    description: "Точные вычисления, финансовая инженерия, оптимизация",
    website: "https://mipt.ru",
    programs: ["Прикладная математика", "Финансовая инженерия", "Компьютерные системы"],
    archetypeAlign: { SNIPER: 95, STRATEGIST: 70, VISIONARY: 60, MARKETER: 40, CRISIS_MANAGER: 50 },
  },
  {
    id: "msu-mech",
    name: "МГУ – механико-математический факультет",
    emoji: "📐",
    description: "Высшая математика, теоретическая физика, операционные исследования",
    website: "https://msu.ru",
    programs: ["Математика", "Механика", "Компьютерные науки"],
    archetypeAlign: { SNIPER: 88, STRATEGIST: 65, VISIONARY: 50, MARKETER: 35, CRISIS_MANAGER: 45 },
  },

  // STRATEGIST (Стратег, баланс и рост)
  {
    id: "hse",
    name: "ВШЭ (Высшая школа экономики)",
    emoji: "📊",
    description: "Стратегический менеджмент, бизнес-стратегия, организационное развитие",
    website: "https://hse.ru",
    programs: ["Экономика", "Менеджмент", "Бизнес-информатика"],
    archetypeAlign: { STRATEGIST: 95, SNIPER: 75, VISIONARY: 80, MARKETER: 70, CRISIS_MANAGER: 85 },
  },
  {
    id: "rea",
    name: "РЭА имени Плеханова",
    emoji: "💼",
    description: "Экономический анализ, управление ресурсами, стратегическое планирование",
    website: "https://rea.ru",
    programs: ["Экономика", "Менеджмент", "Финансы"],
    archetypeAlign: { STRATEGIST: 90, SNIPER: 70, VISIONARY: 75, MARKETER: 65, CRISIS_MANAGER: 80 },
  },

  // MARKETER (Маркетолог, рост и клиенты)
  {
    id: "gsom",
    name: "Школа управления GSOM СПбГУ",
    emoji: "🎯",
    description: "Маркетинг, бренд-менеджмент, поведение потребителя",
    website: "https://gsom.spbu.ru",
    programs: ["Маркетинг", "Бренд-менеджмент", "Цифровой маркетинг"],
    archetypeAlign: { MARKETER: 92, VISIONARY: 85, STRATEGIST: 75, SNIPER: 50, CRISIS_MANAGER: 60 },
  },
  {
    id: "mgimo",
    name: "МГИМО (Московский государственный институт международных отношений)",
    emoji: "🌍",
    description: "Международный бизнес, глобальные рынки, лидерство",
    website: "https://mgimo.ru",
    programs: ["Международные отношения", "Мировая экономика", "Международный бизнес"],
    archetypeAlign: { MARKETER: 85, VISIONARY: 88, STRATEGIST: 80, SNIPER: 60, CRISIS_MANAGER: 70 },
  },

  // VISIONARY (Визионер, риск и рост)
  {
    id: "skolkovo",
    name: "Московская школа управления СКОЛКОВО",
    emoji: "🚀",
    description: "Предпринимательство, инновации, стартап-экосистема, венчурный капитал",
    website: "https://skolkovo.ru",
    programs: ["MBA", "Предпринимательство", "Инновационный менеджмент"],
    archetypeAlign: { VISIONARY: 95, MARKETER: 85, STRATEGIST: 80, SNIPER: 60, CRISIS_MANAGER: 65 },
  },
  {
    id: "tinkoff-fintech",
    name: "Tinkoff Generation (Финтех & предпринимательство)",
    emoji: "⚡",
    description: "Финтех, цифровые инновации, быстрый рост, агрессивное развитие",
    website: "https://fintech.tinkoff.ru",
    programs: ["Финтех", "Цифровые инновации", "Стартапы"],
    archetypeAlign: { VISIONARY: 90, MARKETER: 80, STRATEGIST: 70, SNIPER: 65, CRISIS_MANAGER: 60 },
  },

  // CRISIS_MANAGER (Антикризисник, управление под давлением)
  {
    id: "msu-admin",
    name: "МГУ – Факультет управления",
    emoji: "🛡️",
    description: "Управление организациями, кризис-менеджмент, лидерство",
    website: "https://msu.ru",
    programs: ["Государственное управление", "Менеджмент", "Организационное развитие"],
    archetypeAlign: { CRISIS_MANAGER: 92, STRATEGIST: 85, SNIPER: 70, MARKETER: 65, VISIONARY: 70 },
  },
  {
    id: "insead",
    name: "INSEAD Business School (партнёрская программа в России)",
    emoji: "🌟",
    description: "Лидерство в кризис, организационное развитие, executive education",
    website: "https://www.insead.edu",
    programs: ["Leadership", "Crisis Management", "Executive MBA"],
    archetypeAlign: { CRISIS_MANAGER: 95, STRATEGIST: 90, SNIPER: 75, MARKETER: 75, VISIONARY: 80 },
  },
];

export function getRecommendationsByArchetype(
  archetypeId: ArchetypeId,
  limit: number = 3
): UniversityMatch[] {
  return UNIVERSITIES.sort((a, b) => {
    const alignA = a.archetypeAlign[archetypeId] || 0;
    const alignB = b.archetypeAlign[archetypeId] || 0;
    return alignB - alignA;
  }).slice(0, limit);
}
