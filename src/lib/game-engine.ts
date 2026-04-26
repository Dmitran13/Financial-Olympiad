import type { AgeGroup, GameEvent } from "@prisma/client";
import type {
  TemplateConfig,
  TurnDecisions,
  TurnResult,
  BehaviorMetrics,
  ArchetypeId,
  EventImpact,
} from "@/types/game";

const TURNS_TOTAL = 6;

// ─── Core simulation ──────────────────────────────────────────────────────────

export function simulateTurn(
  config: TemplateConfig,
  decisions: TurnDecisions,
  currentSatisfaction: number,
  currentStaff: number,
  event: GameEvent | null
): TurnResult {
  const { price, adSpend, staffDelta, creditTaken = 0, invested = 0 } = decisions;

  // Staff after decisions
  const newStaff = Math.max(1, currentStaff + staffDelta);

  // Price sensitivity: deviation from market price reduces customers
  const priceRatio = price / config.marketPrice;
  // priceRatio > 1 → more expensive → fewer customers
  // priceRatio < 1 → cheaper → more customers (but lower margin)
  const priceMultiplier = Math.max(0.2, 2 - priceRatio * 1.2);

  // Ad effect: diminishing returns
  const adEffect = Math.min(1.5, 1 + Math.sqrt(adSpend / 10000) * 0.3);

  // Satisfaction effect on retention
  const satisfactionMultiplier = 0.5 + (currentSatisfaction / 100) * 0.8;

  // Capacity: staff limits how many customers you can serve
  const staffCapacityMultiplier = Math.min(1.2, newStaff / config.startStaff);

  let customers = Math.round(
    config.baseCustomers *
      priceMultiplier *
      adEffect *
      satisfactionMultiplier *
      staffCapacityMultiplier
  );

  let revenue = customers * price;

  // Expenses
  const staffCosts = newStaff * config.staffCostPerUnit;
  const cogs = revenue * config.cogsRatio;
  let expenses =
    config.fixedCosts + staffCosts + adSpend + cogs + invested;

  // Credit adds cash but incurs 15% monthly interest cost
  if (creditTaken > 0) {
    expenses += creditTaken * 0.15;
  }

  // Apply random event
  let eventImpact: EventImpact | null = null;
  if (event) {
    const ec = event.effectConfig as {
      revenueMultiplier?: number;
      costDelta?: number;
      satisfactionDelta?: number;
      customerMultiplier?: number;
      description: string;
    };
    eventImpact = {
      revenueMultiplier: ec.revenueMultiplier,
      costDelta: ec.costDelta,
      satisfactionDelta: ec.satisfactionDelta,
      customerMultiplier: ec.customerMultiplier,
      description: ec.description,
    };
    if (ec.revenueMultiplier) revenue *= ec.revenueMultiplier;
    if (ec.costDelta) expenses += ec.costDelta;
    if (ec.customerMultiplier) customers = Math.round(customers * ec.customerMultiplier);
  }

  const profit = revenue - expenses;

  // Satisfaction: driven by price-vs-market and whether we served everyone
  let newSatisfaction = currentSatisfaction;
  // Cheaper → happier; expensive → unhappier
  newSatisfaction += (1 - priceRatio) * 15;
  // Low staff → frustration
  if (staffCapacityMultiplier < 0.8) newSatisfaction -= 10;
  // Ads signal quality / awareness
  if (adSpend > 5000) newSatisfaction += 5;
  if (eventImpact?.satisfactionDelta) newSatisfaction += eventImpact.satisfactionDelta;
  newSatisfaction = Math.max(0, Math.min(100, newSatisfaction));

  const explanation = buildExplanation(decisions, revenue, expenses, profit, eventImpact, priceRatio);
  const behaviorMetrics = computeBehaviorMetrics(decisions, config, profit, currentSatisfaction);

  return {
    revenue: Math.round(revenue),
    expenses: Math.round(expenses),
    profit: Math.round(profit),
    customers,
    satisfaction: Math.round(newSatisfaction),
    eventImpact,
    explanation,
    behaviorMetrics,
  };
}

// ─── Educational explanation ──────────────────────────────────────────────────

function buildExplanation(
  decisions: TurnDecisions,
  revenue: number,
  expenses: number,
  profit: number,
  event: EventImpact | null,
  priceRatio: number
): string {
  const parts: string[] = [];

  if (priceRatio > 1.2) {
    parts.push("Цена выше рыночной — часть покупателей ушла к конкурентам.");
  } else if (priceRatio < 0.8) {
    parts.push("Низкая цена привлекла больше клиентов, но снизила маржу.");
  }

  if (decisions.adSpend > 15000) {
    parts.push("Высокие расходы на рекламу привлекли новых покупателей.");
  } else if (decisions.adSpend < 1000) {
    parts.push("Минимальная реклама — клиенты узнают о вас хуже.");
  }

  if (decisions.staffDelta > 0) {
    parts.push(`Найм ${decisions.staffDelta} сотрудников увеличил расходы, но улучшил обслуживание.`);
  } else if (decisions.staffDelta < 0) {
    parts.push(`Сокращение ${Math.abs(decisions.staffDelta)} сотрудников сэкономило деньги.`);
  }

  if (event) {
    parts.push(event.description);
  }

  if (profit > 0) {
    parts.push(`Итог: прибыль ${profit.toLocaleString("ru")} ₽.`);
  } else {
    parts.push(`Итог: убыток ${Math.abs(profit).toLocaleString("ru")} ₽. Попробуйте скорректировать цену или расходы.`);
  }

  return parts.join(" ");
}

// ─── Behavior metrics for career profiling ────────────────────────────────────

function computeBehaviorMetrics(
  decisions: TurnDecisions,
  config: TemplateConfig,
  profit: number,
  satisfaction: number
): BehaviorMetrics {
  const priceRatio = decisions.price / config.marketPrice;
  const adRatio = decisions.adSpend / (config.adRange[1] * 0.5);

  return {
    // Risk: big credit, aggressive hiring, extreme prices
    riskScore: Math.min(
      100,
      (decisions.creditTaken ? 40 : 0) +
        (Math.abs(decisions.staffDelta) > 3 ? 30 : 0) +
        (priceRatio > 1.3 || priceRatio < 0.7 ? 30 : 0)
    ),
    // Analytical: price close to optimal market price
    analyticalScore: Math.round(Math.max(0, 100 - Math.abs(priceRatio - 0.95) * 100)),
    // Marketing: ad investment relative to budget
    marketingScore: Math.min(100, Math.round(adRatio * 100)),
    // Stability: positive profit + good satisfaction
    stabilityScore: Math.min(
      100,
      (profit > 0 ? 50 : 0) + Math.round(satisfaction / 2)
    ),
  };
}

// ─── Aggregate behavior profile across all turns ──────────────────────────────

export function aggregateBehaviorProfile(metrics: BehaviorMetrics[]): BehaviorMetrics {
  const n = metrics.length || 1;
  return {
    riskScore: Math.round(metrics.reduce((s, m) => s + m.riskScore, 0) / n),
    analyticalScore: Math.round(metrics.reduce((s, m) => s + m.analyticalScore, 0) / n),
    marketingScore: Math.round(metrics.reduce((s, m) => s + m.marketingScore, 0) / n),
    stabilityScore: Math.round(metrics.reduce((s, m) => s + m.stabilityScore, 0) / n),
  };
}

// ─── Archetype determination ──────────────────────────────────────────────────

export function determineArchetype(
  profile: BehaviorMetrics,
  totalProfit: number
): ArchetypeId {
  const { riskScore, analyticalScore, marketingScore, stabilityScore } = profile;

  if (riskScore > 60) return "VISIONARY";
  if (analyticalScore > 70 && stabilityScore > 60) return "SNIPER";
  if (marketingScore > 65) return "MARKETER";
  if (totalProfit < 0 && stabilityScore > 50) return "CRISIS_MANAGER";
  return "STRATEGIST";
}

// ─── Random event selection ───────────────────────────────────────────────────

export function pickEvent(
  events: GameEvent[],
  turnNumber: number,
  ageGroup: AgeGroup
): GameEvent | null {
  const ageOrder: AgeGroup[] = ["JUNIOR", "MIDDLE", "SENIOR"];
  const playerLevel = ageOrder.indexOf(ageGroup);

  const eligible = events.filter((e) => {
    const minLevel = ageOrder.indexOf(e.minAgeGroup);
    if (minLevel > playerLevel) return false;
    if (e.turnRange) {
      const [min, max] = e.turnRange as [number, number];
      if (turnNumber < min || turnNumber > max) return false;
    }
    return Math.random() < e.probability;
  });

  if (eligible.length === 0) return null;
  return eligible[Math.floor(Math.random() * eligible.length)];
}

// ─── University recommendations ───────────────────────────────────────────────

export interface UniversityRecommendation {
  id: string;
  name: string;
  emoji: string;
  alignmentScore: number; // 0-100
  reason: string;
  website: string;
}

export function computeUniversityRecommendations(
  archetype: ArchetypeId,
  profile: BehaviorMetrics,
  ageGroup: AgeGroup
): UniversityRecommendation[] {
  const { getRecommendationsByArchetype, UNIVERSITIES } = require("@/lib/university-data") as typeof import("@/lib/university-data");

  const topUniversities = getRecommendationsByArchetype(archetype, 4);

  return topUniversities.map((uni) => {
    const archetypeAlign = uni.archetypeAlign[archetype] || 50;
    const profileScore = Math.round((profile.analyticalScore + profile.marketingScore + profile.stabilityScore) / 3);
    const alignmentScore = Math.round(archetypeAlign * 0.7 + profileScore * 0.3);

    // Age-specific reasoning
    let reason = "";
    switch (ageGroup) {
      case "JUNIOR":
        reason = `Рекомендуем познакомиться с программами предподготовки и летними школами ${uni.name}. Отличный трамплин для будущего поступления!`;
        break;
      case "MIDDLE":
        reason = `${uni.name} предлагает специальные программы для учащихся 8–10 классов. Ваш профиль идеально соответствует направлениям: ${uni.programs[0]}, ${uni.programs[1]}.`;
        break;
      case "SENIOR":
        reason = `Самое время подать документы в ${uni.name}! Приём на программы: ${uni.programs.slice(0, 2).join(", ")}. Ваш архетип игрока идеально подходит для этого вуза.`;
        break;
    }

    return {
      id: uni.id,
      name: uni.name,
      emoji: uni.emoji,
      alignmentScore,
      reason,
      website: uni.website,
    };
  });
}

export { TURNS_TOTAL };
