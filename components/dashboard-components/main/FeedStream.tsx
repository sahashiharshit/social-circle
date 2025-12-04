import { getVisiblePosts } from "@/lib/database-operations/post-feed";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";
import PostCard from "./Postcard";

import Feed from "./Feed";
import FeedSkeleton from "@/components/skeletons/FeedSkeleton";

export default async function FeedStream() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const { posts, nextCursor } = await getVisiblePosts(session.user.id, 20);

  return (
    <>
      {/* STREAM POSTS INDIVIDUALLY */}
      <div className="space-y-4">
        {posts.map( (post) => (
          <Suspense key={post.id} fallback={<FeedSkeleton />}>
            <PostCard post={ post} />
          </Suspense>
        ))}
      </div>

      {/* Pass nextCursor to Feed client component for infinite scroll */}
      <Feed initialCursor={nextCursor}  />
    </>
  );
}
