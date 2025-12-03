import { prisma } from "@/lib/prisma";
import { FeedPost } from "@/types/Post";


export async function getVisiblePosts(currentUserId: string, limit = 20, cursor?: string|null):Promise<{posts:FeedPost[];nextCursor:string|null}> {

    const friends = await prisma.friendship.findMany({
        where: {
            status: "ACCEPTED",
            OR: [
                { requesterId: currentUserId },
                { addresseeId: currentUserId }
            ]
        },
        select: {
            requesterId: true,
            addresseeId: true
        }
    });

    const friendIds = friends.map(f => f.requesterId === currentUserId ? f.addresseeId : f.requesterId);
    const postsRaw = await prisma.post.findMany({
        where: {
            OR: [
                {
                    privacy: "PUBLIC"
                },
                {
                    privacy: "FRIENDS_ONLY",
                    OR:[
                        {authorId:currentUserId},
                        {authorId: { in: friendIds }},
                        
                        
                    ]
                     },
                {
                    privacy: "PRIVATE",
                    authorId: currentUserId
                }
            ]
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    image: true
                },
            },
            likes:{
                select:{userId:true},
            },
        },
        orderBy: { createdAt: "desc" },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        skip: cursor ? 1 : 0
    });
    let nextCursor: string | null = null;
    if (postsRaw.length > limit) {
        const next = postsRaw.pop();
        nextCursor = next?.id ?? null;
    }
    const posts:FeedPost[]=postsRaw.map((post)=>({
        ...post,
        likedByMe:post.likes.some((l)=>l.userId===currentUserId),
    }));
    return {
        posts,
        nextCursor
    };
}