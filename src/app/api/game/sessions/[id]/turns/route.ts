import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  simulateTurn,
  pickEvent,
  aggregateBehaviorProfile,
  determineArchetype,
  computeUniversityRecommendations,
  TURNS_TOTAL,
} from "@/lib/game-engine";
import type { TemplateConfig, TurnDecisions, BehaviorMetrics } from "@/types/game";

// POST /api/game/sessions/[id]/turns — сделать ход
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: sessionId } = await params;
  const decisions = (await req.json()) as TurnDecisions;

  const gameSession = await prisma.gameSession.findUnique({
    where: { id: sessionId },
    include: { template: true, turns: { orderBy: { turnNumber: "asc" } } },
  });

  if (!gameSession || gameSession.userId !== session.user.id) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
  if (gameSession.status !== "ACTIVE") {
    return NextResponse.json({ error: "Session already completed" }, { status: 400 });
  }

  const turnNumber = gameSession.currentTurn + 1;
  if (turnNumber > TURNS_TOTAL) {
    return NextResponse.json({ error: "Max turns reached" }, { status: 400 });
  }

  // Pick a random event
  const allEvents = await prisma.gameEvent.findMany();
  const event = pickEvent(allEvents, turnNumber, gameSession.ageGroup);

  const templateConfig = gameSession.template.config as unknown as TemplateConfig;

  // Compute current staff from previous turns
  const currentStaff = gameSession.turns.reduce(
    (staff: number, t: { staffDelta: number }) => Math.max(1, staff + t.staffDelta),
    templateConfig.startStaff
  );

  // Run simulation
  const result = simulateTurn(
    templateConfig,
    decisions,
    gameSession.customerSatisfaction,
    currentStaff,
    event
  );

  const isLastTurn = turnNumber === TURNS_TOTAL;

  // Save turn
  await prisma.gameTurn.create({
    data: {
      sessionId,
      turnNumber,
      price: decisions.price,
      adSpend: decisions.adSpend,
      staffDelta: decisions.staffDelta ?? 0,
      creditTaken: decisions.creditTaken,
      invested: decisions.invested,
      revenue: result.revenue,
      expenses: result.expenses,
      profit: result.profit,
      customers: result.customers,
      satisfaction: result.satisfaction,
      eventId: event?.id,
      eventImpact: result.eventImpact as unknown as object ?? undefined,
      explanation: result.explanation,
      behaviorMetrics: result.behaviorMetrics as unknown as object,
    },
  });

  // Aggregate final result on last turn
  let businessArchetype: string | null = null;
  let recommendations = null;
  if (isLastTurn) {
    const allMetrics = [...gameSession.turns, { behaviorMetrics: result.behaviorMetrics }]
      .map((t) => t.behaviorMetrics as BehaviorMetrics)
      .filter(Boolean);
    const profile = aggregateBehaviorProfile(allMetrics);
    businessArchetype = determineArchetype(
      profile,
      gameSession.totalProfit + result.profit
    );
    recommendations = computeUniversityRecommendations(
      businessArchetype as any,
      profile,
      gameSession.ageGroup
    );

    await prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        status: "COMPLETED",
        currentTurn: turnNumber,
        cash: gameSession.cash + result.profit + (decisions.creditTaken ?? 0),
        totalRevenue: gameSession.totalRevenue + result.revenue,
        totalExpenses: gameSession.totalExpenses + result.expenses,
        totalProfit: gameSession.totalProfit + result.profit,
        customerSatisfaction: result.satisfaction,
        businessArchetype,
        behaviorProfile: aggregateBehaviorProfile(allMetrics) as unknown as object,
        universityRecommendations: recommendations as unknown as object,
        completedAt: new Date(),
      },
    });
  } else {
    await prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        currentTurn: turnNumber,
        cash: gameSession.cash + result.profit + (decisions.creditTaken ?? 0),
        totalRevenue: gameSession.totalRevenue + result.revenue,
        totalExpenses: gameSession.totalExpenses + result.expenses,
        totalProfit: gameSession.totalProfit + result.profit,
        customerSatisfaction: result.satisfaction,
      },
    });
  }

  return NextResponse.json({
    turnNumber,
    ...result,
    isLastTurn,
    businessArchetype,
  });
}
