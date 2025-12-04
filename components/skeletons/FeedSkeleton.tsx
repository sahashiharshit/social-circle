"use client";

import PostSkeleton from "@/components/skeletons/PostSkeleton";


export default function FeedSkeleton() {
  const count = Math.floor(Math.random() * 3) + 3;
  return (
    <div className="space-y-4 mt-4 animate-in fade-in duration-300">
      {Array.from({ length: count }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
}
