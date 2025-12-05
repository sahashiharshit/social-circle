import { auth } from "@/lib/auth";
import { getVisiblePosts } from "@/lib/database-operations/post-feed";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get('cursor') ?? undefined;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Number(limitParam) || 20 : 20;
    const session = await auth.api.getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { posts, nextCursor } = await getVisiblePosts(
        session.user.id,
        limit,
        cursor
    );
    return NextResponse.json({ posts, nextCursor });
}