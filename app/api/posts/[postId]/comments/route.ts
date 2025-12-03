import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";



export async function POST(req: NextRequest,
  { params }: { params: Promise<{ postId: string }>}) {
  const session = await auth.api.getSession(
    {
      headers:await headers()
    }
  );
  const user = session?.user;

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const postId = (await params).postId;
  const body = await req.json().catch(() => null);

  if (!body || !body.content || typeof body.content !== "string") {
    return new NextResponse("Invalid body", { status: 400 });
  }

  const content = body.content.trim();
  const parentId = body.parentId as string | undefined;

  if (!content) {
    return new NextResponse("Empty content", { status: 400 });
  }

  if (parentId) {
    // Ensure parent comment belongs to same post
    const parent = await prisma.comment.findUnique({
      where: { id: parentId },
      select: { postId: true },
    });

    if (!parent || parent.postId !== postId) {
      return new NextResponse("Invalid parent comment", { status: 400 });
    }
  }

  const comment = await prisma.$transaction(async (tx) => {
    const created = await tx.comment.create({
      data: {
        postId,
        authorId: user.id,
        content,
        parentId: parentId ?? null,
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    // increment commentCount on post
    await tx.post.update({
      where: { id: postId },
      data: { commentCount: { increment: 1 } },
    });

    return created;
  });

  return NextResponse.json(comment);
}

export async function GET(req: NextRequest,
  { params }: { params: Promise<{ postId: string }>}) {
  const  postId  = (await params).postId;

  const comments = await prisma.comment.findMany({
    where: {
      postId,
      parentId: null,
    },
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
      replies: {
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(comments);
}
