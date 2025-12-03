"use client";

import { FaComment } from "react-icons/fa";
import { useState } from "react";


export default function CommentButton({
  postId,
  commentCount,
  onToggle
}: {
  postId: string;
  commentCount: number;
  onToggle:()=>void;
}) {

  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col w-full">
      <button
        onClick={onToggle}
        className="flex items-center gap-1 opacity-70 hover:opacity-100"
      >
        <FaComment size={20} />
        <span>{commentCount}</span>
      </button>

    
    </div>
  );
}
