import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { nickname, ageGroup, city } = body;

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(nickname && { nickname }),
      ...(ageGroup && { ageGroup }),
      ...(city && { city }),
    },
  });

  return NextResponse.json({ id: user.id, nickname: user.nickname, ageGroup: user.ageGroup, city: user.city });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, nickname: true, ageGroup: true, city: true, email: true, avatar: true },
  });

  return NextResponse.json(user);
}
