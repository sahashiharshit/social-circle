
import Post from "@/components/dashboard-components/main/CreatePostComponent";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";
import FeedStream from "./FeedStream";
import PostSkeleton from "@/components/skeletons/PostSkeleton";

export default async function MainContent() {

    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return null;
    const userImage = session.user.image;

    return (

        <div className="w-full flex-1 overflow-y-auto no-scrollbar pb-10 px-30">
            <div className="flex">
                <Post image={userImage} />
            </div>
            <div className="mt-4 space-y-4">
                <Suspense fallback={<PostSkeleton />}>
                    <FeedStream />
                </Suspense>
            </div>
        </div>
    );
}