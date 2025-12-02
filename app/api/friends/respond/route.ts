import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { requestId, action } = await req.json();
  const userId = session.user.id;

  if (!requestId || !["ACCEPT", "REJECT"].includes(action)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const friendship = await prisma.friendship.findFirst({
    where: {
      id: requestId,
      addresseeId: userId,
      status: "PENDING",
    },
  });

  if (!friendship) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  if (action === "ACCEPT") {
    await prisma.$transaction([
      prisma.friendship.update({
        where: { id: requestId },
        data: { status: "ACCEPTED" },
      }),
      prisma.user.update({
        where: { id: friendship.requesterId },
        data: { friendsCount: { increment: 1 } },
      }),
      prisma.user.update({
        where: { id: friendship.addresseeId },
        data: { friendsCount: { increment: 1 } },
      }),
    ]);
  } else {
    await prisma.friendship.update({
      where: { id: requestId },
      data: { status: "REJECTED" },
    });
  }

  return NextResponse.json({ ok: true });
}
