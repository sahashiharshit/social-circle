"use server";

import { useSession } from "@/context/SessionContext";
import { getVisiblePosts } from "@/lib/database-operations/post-feed";

export async function loadMorePosts(cursor:string|null) {
    const session = useSession();
    const currentUserId = session?.user.id;
    if(!currentUserId) return null
    const {posts,nextCursor} = await getVisiblePosts(currentUserId,20,cursor||undefined);
    return {posts,nextCursor}
}