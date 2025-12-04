"use client";

import { useEffect, useState } from "react";
import PostCard from "@/components/dashboard-components/main/Postcard";

import type { FeedPost, FeedResponse } from "@/types/Post";

export default function Feed({
    initialCursor
}: {
    initialCursor: string | null;
}) {
    const [posts, setPosts] = useState<FeedPost[]>([]);
    const [cursor, setCursor] = useState<string | null>(initialCursor);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    useEffect(() => {
        function handler(e: any) {
            const optimistic = e.detail;
            setPosts((prev) => [optimistic, ...prev]);
        }
        window.addEventListener("new-optimistic-post", handler);

        return () =>
            window.removeEventListener("new-optimistic-post", handler);
    }, []);

    async function handleLoadMore() {
        if (!cursor || loading || done) return;
        setLoading(true);

        const res = await fetch(`/api/feed?cursor=${cursor}&limit=20`);
        if (!res.ok) {
            setLoading(false);
            return; // you might want toast/error here
        }
        const data: FeedResponse = await res.json();
        if (!data.posts.length) {
            setDone(true)
        } else {
            setPosts(prev => [...prev, ...data.posts]);
            setCursor(data.nextCursor);
            if (!data.nextCursor) setDone(true);
        }

        setLoading(false);
    }

    // Infinite scroll listener
    useEffect(() => {
        function onScroll() {
            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 250
            ) {
                handleLoadMore();
            }
        }

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [cursor, loading, done]);

    return (
        <div className="mt-4 space-y-4">
            {posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}

            {loading && (
                <p className="text-center py-4 opacity-70">Loading more...</p>
            )}
            {done && (
                <p className="text-center text-xs opacity-60 py-4">
                    You&apos;re all caught up 🎉
                </p>
            )}
        </div>
    );
}
