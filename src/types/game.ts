import type { AgeGroup } from "@prisma/client";

export interface TemplateConfig {
  startCash: number;
  startStaff: number;
  fixedCosts: number;     // аренда + прочие фиксированные расходы в месяц
  staffCostPerUnit: number;
  cogsRatio: number;      // себестоимость как доля от выручки (0–1)
  baseCustomers: number;
  priceRange: [number, number];   // [min, max] допустимые цены
  adRange: [number, number];      // [min, max] допустимые расходы на рекламу
  marketPrice: number;            // рыночная цена конкурентов
  priceLabel?: string;            // "Цена товара" / "Цена абонемента" / "Стоимость курса"
  adLabel?: string;               // "Реклама" / "Продвижение" / "Маркетинг"
}

export interface TurnDecisions {
  price: number;
  adSpend: number;
  staffDelta: number;
  creditTaken?: number;
  invested?: number;
  qualitySpend?: number;
}

export interface TurnResult {
  revenue: number;
  expenses: number;
  profit: number;
  customers: number;
  satisfaction: number;
  eventImpact: EventImpact | null;
  explanation: string;
  behaviorMetrics: BehaviorMetrics;
}

export interface EventImpact {
  revenueMultiplier?: number;
  costDelta?: number;
  satisfactionDelta?: number;
  customerMultiplier?: number;
  description: string;
}

export interface BehaviorMetrics {
  riskScore: number;       // 0–100: насколько рискованные решения
  analyticalScore: number; // 0–100: точность в ценообразовании
  marketingScore: number;  // 0–100: инвестиции в рост
  stabilityScore: number;  // 0–100: сохранение стабильности
}

export interface SessionState {
  sessionId: string;
  templateId: string;
  ageGroup: AgeGroup;
  currentTurn: number;
  cash: number;
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  customerSatisfaction: number;
  status: "ACTIVE" | "COMPLETED" | "ABANDONED";
}

export const ARCHETYPES = {
  VISIONARY: {
    id: "VISIONARY",
    name: "Визионер",
    description: "Много рискует, инвестирует в рост",
    emoji: "🚀",
  },
  SNIPER: {
    id: "SNIPER",
    name: "Финансовый снайпер",
    description: "Считает каждую копейку, высокая маржа",
    emoji: "🎯",
  },
  MARKETER: {
    id: "MARKETER",
    name: "Маркетолог от бога",
    description: "Клиентская любовь ценой высоких расходов",
    emoji: "💝",
  },
  CRISIS_MANAGER: {
    id: "CRISIS_MANAGER",
    name: "Антикризисный менеджер",
    description: "Умеет выруливать из трудных ситуаций",
    emoji: "🛡️",
  },
  STRATEGIST: {
    id: "STRATEGIST",
    name: "Стратег",
    description: "Сбалансированный стабильный рост",
    emoji: "♟️",
  },
} as const;

export type ArchetypeId = keyof typeof ARCHETYPES;
