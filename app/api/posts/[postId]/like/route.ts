import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";



export async function POST(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {

  const session = await auth.api.getSession({
    headers: await headers()
  });
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  const user = session?.user;

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const postId = (await params).postId;

  const existingLike = await prisma.postLike.findUnique({
    where: {
      postId_userId: {
        postId,
        userId: user.id,
      },
    },
  });


  if (existingLike) {
    const [, updatedPost] = await prisma.$transaction([
      prisma.postLike.delete({
        where: { id: existingLike.id },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } },
        select: { likeCount: true },
      }),
    ]);

    return NextResponse.json({ liked: false, likeCount: updatedPost.likeCount });
  }


  const [, updatedPost] = await prisma.$transaction([
    prisma.postLike.create({
      data: {
        postId,
        userId: user.id,
      },
    }),
    prisma.post.update({
      where: { id: postId },
      data: { likeCount: { increment: 1 } },
      select: { likeCount: true }
    }),
  ]);

  return NextResponse.json({ liked: true, likeCount: updatedPost.likeCount });
}
