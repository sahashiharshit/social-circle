import { prisma } from "@/lib/prisma";

export async function getFriends(userId: string) {
    const friendships = await prisma.friendship.findMany({
        where: {
            status: "ACCEPTED",
            OR: [
                { requesterId: userId },
                { addresseeId: userId },
            ],
        },
        include: {
            requester: true,
            addressee: true,
        },
    });
    return friendships.map(f => f.requesterId === userId ? f.addressee : f.requester);
}

export async function getFriendSuggestions(userId: string) {
    const allRelations = await prisma.friendship.findMany({
        where: {
            OR: [
                { requesterId: userId },
                { addresseeId: userId },
            ],
        },
        select: {
            requesterId: true,
            addresseeId: true,
        }

    });
    // Extract blocked IDs (already connected in any way)
    const excludedIds = new Set(
        allRelations.flatMap(r => [r.requesterId, r.addresseeId])
    );

    excludedIds.add(userId); // exclude myself

    // Suggest users not connected to us
    const suggestions = await prisma.user.findMany({
        where: {
            id: {
                notIn: Array.from(excludedIds),
            },
        },
        select: {
            id: true,
            name: true,
            image: true,
        },
        take: 10,
    });

    return suggestions;
}