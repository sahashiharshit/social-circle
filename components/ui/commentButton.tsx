"use client";

import { FaComment } from "react-icons/fa";
import { useState } from "react";
import CommentSection from "@/components/ui/commentSection";

export default function CommentButton({
  postId,
  commentCount
}: {
  postId: string;
  commentCount: number;
}) {

  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col w-full">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 opacity-70 hover:opacity-100"
      >
        <FaComment size={15} />
        <span>{commentCount}</span>
      </button>

      {open && <CommentSection postId={postId} />}
    </div>
  );
}
