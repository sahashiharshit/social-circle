
import Post from "@/components/dashboard-components/main/CreatePostComponent";

import { getVisiblePosts } from "@/lib/database-operations/post-feed";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Feed from "@/components/dashboard-components/main/Feed";

export default async function MainContent() {
   
   const session = await auth.api.getSession({headers:await headers()})
    if(!session) return null;
    const currentUserId = session.user.id;
    const userImage = session.user.image;
    const {posts,nextCursor} = await getVisiblePosts(currentUserId,20);
    return (

        <div className="w-full flex-1 overflow-y-auto pb-10 px-30">
            <div className="flex">
                <Post image={userImage} />
            </div>
            <div className="mt-4 space-y-4">
                
                <Feed initialPosts={posts} initialCursor={nextCursor}/>
            </div>
        </div>
    );
}