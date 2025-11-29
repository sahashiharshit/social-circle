


import { Prisma } from "@/lib/generated/prisma/client";


export type FeedPost = Prisma.PostGetPayload<{
    include: {
        author: {
            select: {
                id: true;
                name: true;
                image: true;
            };
        }
    };
}>;

export type FeedResponse = {
  posts: FeedPost[];
  nextCursor: string | null;
};