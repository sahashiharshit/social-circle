"use client";

import { useEffect, useState } from "react";

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/posts/${postId}/comments`);
      const data = await res.json();
      setComments(data);
      setLoading(false);
    }
    load();
  }, [postId]);

  async function submitComment() {
    if (!input.trim()) return;

    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input }),
    });

    const newComment = await res.json();

    setComments((prev) => [newComment, ...prev]);
    setInput("");
  }

  return (
    <div className="mt-3 space-y-3 border-t pt-3">
      {/* input */}
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-md border px-2 py-1 text-sm bg-background"
          placeholder="Write a comment..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={submitComment}
          className="px-3 py-1 bg-primary text-white text-xs rounded-md"
        >
          Post
        </button>
      </div>

      {/* comments */}
      {loading ? (
        <p className="text-xs opacity-70">Loading comments...</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="flex gap-2 text-xs opacity-80">
            <span className="font-semibold">{c.author.name}</span>
            <span>{c.content}</span>
          </div>
        ))
      )}
    </div>
  );
}
