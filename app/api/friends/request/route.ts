import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { toUserId } = await req.json();
  const fromUserId = session.user.id;

  if (!toUserId || toUserId === fromUserId) {
    return NextResponse.json({ error: "Invalid target" }, { status: 400 });
  }

  
  const existing = await prisma.friendship.findFirst({
    where: {
      OR: [
        { requesterId: fromUserId, addresseeId: toUserId },
        { requesterId: toUserId, addresseeId: fromUserId },
      ],
    },
  });

  if (existing) {
    return NextResponse.json({ error: "Already requested or friends" }, { status: 400 });
  }

  await prisma.friendship.create({
    data: {
      requesterId: fromUserId,
      addresseeId: toUserId,
      status: "PENDING",
    },
  });

  return NextResponse.json({ ok: true });
}
