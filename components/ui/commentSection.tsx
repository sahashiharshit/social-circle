"use client";

import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/posts/${postId}/comments`);
        if (!res.ok) {
          throw new Error(`Error ${res.status}`);
        }
        let data;
        try {
          data = await res.json();
        } catch {
          data = [];
        }
        if (!Array.isArray(data)) data = [];
        if (!cancelled) {
          setComments(data);
        }
      } catch (error: any) {
        if (!cancelled) {
          setError("Failed to load Comments.");
          setComments([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };

  }, [postId]);

  async function submitComment() {
    if (!input.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.trim() }),
      });
      if (!res.ok) {
        throw new Error("Failed to post comment");
      }
      let newComment;
      try {
        newComment = await res.json();
      } catch {
        throw new Error("Invalid comment response");
      }
      if (!newComment || !newComment.id) {
        throw new Error("Comment response malformed");
      }
      setComments((prev) => [newComment, ...prev]);
      setInput("");
    } catch (error: any) {
      setError(error.message || "Failed to post comment.");
    } finally {
      setSubmitting(false);
    }


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
          disabled={submitting}
        />
        <button
          onClick={submitComment}
          className="px-3 py-1 bg-accent text-xs rounded-md disabled:opacity-50"
          disabled={submitting}
        >
          <FaArrowRight size={20}/>
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-500 opacity-80">{error}</p>
      )}
      {/* comments */}
      {loading && (
        <p className="text-xs opacity-70">Loading comments...</p>
      ) }
      {!loading && comments.length === 0 && !error && (
        <p className="text-xs opacity-50">No comments yet!</p>
      )}
      {!loading &&
        comments.map((c) => (
          <div key={c.id} className="flex gap-2 text-xs opacity-80">
            <span className="font-semibold">{c.author?.name ?? "User"}</span>
            <span>{c.content ?? ""}</span>
          </div>
        ))}
    </div>
  );
}
