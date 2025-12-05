
import { Prisma } from "@/lib/generated/prisma/client";
export type FeedPostRaw = Prisma.PostGetPayload<{
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
export type FeedPost = FeedPostRaw & {
    likedByMe: boolean
}
export type FeedResponse = {
    posts: FeedPost[];
    nextCursor: string | null;
};

export type SelectedPhoto = {
    file: File;
    previewUrl: string;
};
export type Location = {
    name: string;
    lat: string;
    lon: string;
};
