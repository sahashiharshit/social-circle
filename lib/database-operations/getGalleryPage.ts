

import { prisma } from "@/lib/prisma";
import { PostPrivacy } from "@/lib/generated/prisma/enums";

export type GalleryScope = "all" | "mine" | "friends";
const sortMap = {
    NEWEST: "desc",
    OLDEST: "asc",
} as const;


const PAGE_SIZE = 24;

export async function getGalleryPage(
    userId: string,
    opts: {
        cursor?: string | null;
        sort?: "NEWEST" | "OLDEST";
        scope?: GalleryScope;
    } = {}
) {
    const { cursor, sort = "NEWEST", scope = "all" } = opts;
    const sortKey: "NEWEST" | "OLDEST" = opts.sort ?? "NEWEST";


    const friendships = await prisma.friendship.findMany({
        where: {
            OR: [
                { requesterId: userId, status: "ACCEPTED" },
                { addresseeId: userId, status: "ACCEPTED" },
            ],
        },
    });

    const friendIds = friendships.map((f) =>
        f.requesterId === userId ? f.addresseeId : f.requesterId
    );

 
    const whereBase: any = {
        imageUrl: { not: null },
    };

 
    if (scope === "mine") {
        whereBase.authorId = userId;
    } else if (scope === "friends") {
        whereBase.authorId = { in: friendIds };
    } else {
        whereBase.OR = [
            { authorId: userId },
            { authorId: { in: friendIds } },
        ];
    }

    
    whereBase.AND = [
        {
            OR: [
                { authorId: userId }, // always
                {
                    AND: [
                        { authorId: { in: friendIds } },
                        { privacy: { in: ["PUBLIC", "FRIENDS_ONLY"] as PostPrivacy[] } },
                    ],
                },
            ],
        },
    ];



    const orderBy = {
        createdAt: sortMap[sortKey],
    };
    const take = PAGE_SIZE + 1;

    const posts = await prisma.post.findMany({
        where: whereBase,
        orderBy,
        take,
        ...(cursor
            ? {
                skip: 1,
                cursor: { id: cursor },
            }
            : {}),
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
        },
    });

    let nextCursor: string | null = null;
    if (posts.length > PAGE_SIZE) {
        const last = posts.pop()!;
        nextCursor = last.id;
    }

    return {
        items: posts,
        nextCursor,
    };
}
