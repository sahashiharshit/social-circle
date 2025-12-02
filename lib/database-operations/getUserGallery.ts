import { prisma } from "@/lib/prisma";

export async function getUserGallery(userId: string) {
    // 1. Fetch accepted friends
    const friendships = await prisma.friendship.findMany({
        where: {
            OR: [
                { requesterId: userId, status: "ACCEPTED" },
                { addresseeId: userId, status: "ACCEPTED" }
            ]
        }
    });
    const friendIds = friendships.map(f =>
        f.requesterId === userId ? f.addresseeId : f.requesterId
    );

    // 2. Fetch user's photos
    const userPhotos = await prisma.post.findMany({
        where: {
            authorId: userId,
            imageUrl: { not: null }
        },
        orderBy: { createdAt: "desc" }
    });
    // 3. Fetch friends' photos
    const friendsPhotos = await prisma.post.findMany({
        where: {
            authorId: { in: friendIds },
            imageUrl: { not: null },
            OR: [
                { privacy: "PUBLIC" },
                { privacy: "FRIENDS_ONLY" }
            ]
        },
        orderBy: { createdAt: "desc" }
    });

    return { userPhotos, friendsPhotos };
}