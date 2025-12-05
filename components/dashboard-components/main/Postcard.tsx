"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import CommentButton from "@/components/ui/commentButton";
import CommentSection from "@/components/ui/commentSection";
import LikeButton from "@/components/ui/likeButton";
import { FALLBACK_AVATAR } from "@/lib/fallbackImage";
import { FeedPost } from "@/types/Post";
import Image from "next/image";
import { useState } from "react";
import { FaLocationArrow } from "react-icons/fa";

export default function PostCard({
  post,
  isOptimistic = false,
}: {
  post: FeedPost;
  isOptimistic?: boolean;
}) {
  const [openComments, setOpenComments] = useState(false);

  const location = post.fullLocation as {
    name?: string;
    lat?: string | null;
    lon?: string | null;
  } | null;

  return (
    <Card className="mb-4 shadow-sm bg-accent animate-in fade-in">
      {/* ---------- HEADER ---------- */}
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
            {isOptimistic ? (
              <div className="animate-pulse w-full h-full bg-gray-400" />
            ) : (
              <AvatarImage
                src={post.author.image || FALLBACK_AVATAR}
                className="object-cover w-full h-full"
              />
            )}
            <AvatarFallback>Image</AvatarFallback>
          </Avatar>

          <div>
            <p className="font-semibold">
              {isOptimistic ? (
                <div className="h-3 w-28 bg-gray-300 rounded animate-pulse" />
              ) : (
                post.author.name
              )}
            </p>

            {isOptimistic ? (
              <div className="h-2 w-16 bg-gray-300 rounded animate-pulse mt-1" />
            ) : (
              <p className="text-xs opacity-60">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      {/* ---------- CONTENT ---------- */}
      <CardContent className="space-y-3">
       
        {isOptimistic ? (
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gray-300 rounded animate-pulse w-1/2" />
          </div>
        ) : (
          post.content && <p>{post.content}</p>
        )}

        
        {post.imageUrl && (
          <div className="rounded-md overflow-hidden">
            {isOptimistic ? (
              <div className="h-40 bg-gray-300 animate-pulse w-full rounded-md" />
            ) : (
              <Image
                src={post.imageUrl}
                width={650}
                height={400}
                alt="Post image"
                className="rounded-md"
                unoptimized
                loading="lazy"
              />
            )}
          </div>
        )}

        {/* Location */}
        {location?.name && (
          <div className="flex items-center gap-2 text-sm opacity-70">
            <FaLocationArrow /> {location.name}
          </div>
        )}
      </CardContent>

      {/* ---------- FOOTER ---------- */}
      <CardFooter>
        {isOptimistic ? (
          <div className="flex gap-10 opacity-40 text-sm">
            <div className="h-3 w-10 bg-gray-300 animate-pulse rounded" />
            <div className="h-3 w-10 bg-gray-300 animate-pulse rounded" />
          </div>
        ) : (
          <div className="flex justify-start gap-10 w-full text-sm opacity-70">
            <LikeButton
              postId={post.id}
              initialLiked={post.likedByMe}
              initialCount={post.likeCount}
            />
            <CommentButton
              postId={post.id}
              commentCount={post.commentCount}
              onToggle={() => setOpenComments(!openComments)}
            />
          </div>
        )}
      </CardFooter>

     
      {openComments && !isOptimistic && (
        <div className="px-4 pb-3">
          <CommentSection postId={post.id} />
        </div>
      )}
    </Card>
  );
}
