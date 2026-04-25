import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { AgeGroup } from "@prisma/client";

// POST /api/game/sessions — начать новую игровую сессию
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { templateSlug } = body as { templateSlug: string };

  const template = await prisma.businessTemplate.findUnique({
    where: { slug: templateSlug, isActive: true },
  });
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const config = template.config as { startCash: number };

  const gameSession = await prisma.gameSession.create({
    data: {
      userId: user.id,
      templateId: template.id,
      ageGroup: user.ageGroup as AgeGroup,
      cash: config.startCash,
    },
  });

  return NextResponse.json({ sessionId: gameSession.id, status: "ACTIVE" });
}
