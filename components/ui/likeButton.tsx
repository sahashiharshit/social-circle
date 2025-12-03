"use client";

import { useState } from "react";
import { FaThumbsUp } from "react-icons/fa";

export default function LikeButton({
  postId,
  initialLiked,
  initialCount
}: {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
}) {

  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function toggleLike() {
    if (loading) return;
    setLoading(true);
     const prevLiked = liked;
    const prevCount = count;
    // Optimistic UI
    setLiked(!prevLiked);
    setCount(prevLiked?prevCount-1:prevCount+1);
    const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });

    if (res.ok) {
      const data:{liked:boolean;likeCount:number} = await res.json();
      setLiked(data.liked);
      setCount(data.likeCount);
    } else {
      // Rollback if failed
      setLiked(prevLiked);
      setCount(prevCount);
    }

    setLoading(false);
  }

  return (
    <button
      className={`flex items-center gap-1 cursor-pointer ${
        liked ? "text-primary font-semibold" : "opacity-70"
      }`}
      onClick={toggleLike}
    >
      <FaThumbsUp size={20} />
      <span>{count}</span>
    </button>
  );
}
