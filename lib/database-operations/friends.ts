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
   
    const excludedIds = new Set<string>();

    excludedIds.add(userId); // exclude myself
    allRelations.forEach(r=>{
        excludedIds.add(r.requesterId);
        excludedIds.add(r.addresseeId);
    })
  
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

export async function getIncomingFriendRequests(userId:string){
    const requests = await prisma.friendship.findMany({
        where:{
            status:"PENDING",
            addresseeId:userId,
        },
        include:{
            requester:{
                select:{id:true,name:true,image:true},
            },
        },
    });

    return requests.map(r=>({
        id:r.id,
        requester:r.requester,
    }));
}