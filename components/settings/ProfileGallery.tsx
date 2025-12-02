"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";

type GallerySort = "NEWEST" | "OLDEST";
type GalleryScope = "all" | "mine" | "friends";

type Author = {
    id: string;
    name: string | null;
    image: string | null;
};

type GalleryItem = {
    id: string;
    imageUrl: string;
    createdAt: string;
    author: Author;
};

type ApiResponse = {
    items: GalleryItem[];
    nextCursor: string | null;
};

function formatMonthYear(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleString("default", {
        month: "long",
        year: "numeric",
    });
}
const INITIAL_SKELETON_COUNT = 12;
function SkeletonCard() {
    return (
        <div className="aspect-square rounded-md overflow-hidden bg-accent/50 animate-pulse" />
    );
}
export default function ProfileGallery() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [initialLoaded, setInitialLoaded] = useState(false);
    const [sort, setSort] = useState<GallerySort>("NEWEST");
    const [scope, setScope] = useState<GalleryScope>("all");
    const [error, setError] = useState<string | null>(null);

    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    // Fetch page
    const fetchPage = useCallback(
        async (opts?: { cursor?: string | null; reset?: boolean }) => {
            if (loading) return;
            setLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams();
                params.set("sort", sort);
                params.set("scope", scope);
                if (opts?.cursor) params.set("cursor", opts.cursor);

                const res = await fetch(`/api/gallery?${params.toString()}`);
                if (!res.ok) {
                    throw new Error(`Error ${res.status}`);
                }
                const data: ApiResponse = await res.json();

                if (opts?.reset) {
                    setItems(data.items);
                    setInitialLoaded(true);
                } else {
                    setItems((prev) => [...prev, ...data.items]);
                }
                setNextCursor(data.nextCursor);
                
            } catch (err: any) {
                setError(err.message ?? "Failed to load gallery");
            } finally {
                setLoading(false);
            }
        },
        [sort, scope]
    );

    // Initial + when filters change
    useEffect(() => {
        setItems([]);
        setNextCursor(null);
        setInitialLoaded(false);
        fetchPage({ reset: true });
    }, [sort, scope, fetchPage]);

    // Infinite scroll
    useEffect(() => {
        if (!sentinelRef.current) return;
        if (!initialLoaded) return;

        const el = sentinelRef.current;

        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting && nextCursor && !loading) {
                    fetchPage({ cursor: nextCursor });
                }
            },
            {
                rootMargin: "200px",
            }
        );

        observer.observe(el);

        return () => {
            observer.unobserve(el);
        };
    }, [nextCursor, loading, initialLoaded, fetchPage]);

    // Group by month/year
    const grouped = useMemo(() => {
        const map = new Map<string, GalleryItem[]>();
        for (const item of items) {
            const key = formatMonthYear(item.createdAt);
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(item);
        }
        return Array.from(map.entries()); // [ [ "December 2025", [..] ], ... ]
    }, [items]);

    // Lightbox helpers
    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);

    const showPrev = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (lightboxIndex === null) return;
        setLightboxIndex((prev) =>
            prev === null ? prev : (prev - 1 + items.length) % items.length
        );
    };

    const showNext = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (lightboxIndex === null) return;
        setLightboxIndex((prev) =>
            prev === null ? prev : (prev + 1) % items.length
        );
    };

    // Close on ESC
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") showPrev();
            if (e.key === "ArrowRight") showNext();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    });
    const isInitialSkeletonVisible =
        !initialLoaded && items.length === 0 && loading;
    return (
        <div className="space-y-8">
            {/* Header + filters */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold mb-1">Media Gallery</h2>
                    <p className="opacity-75 text-sm">
                        Browse your photos and photos shared by your friends.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 text-sm">
                    <select
                        value={scope}
                        onChange={(e) => setScope(e.target.value as GalleryScope)}
                        className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/60"
                    >
                        <option value="all">All photos</option>
                        <option value="mine">Only my photos</option>
                        <option value="friends">Only friends&apos; photos</option>
                    </select>

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as GallerySort)}
                        className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/60"
                    >
                        <option value="NEWEST">Newest first</option>
                        <option value="OLDEST">Oldest first</option>
                    </select>
                </div>
            </div>

            {/* Content */}
            {error && (
                <p className="text-sm text-red-500">
                    {error} – try refreshing the page.
                </p>
            )}


            {/* Initial skeletons */}
            {isInitialSkeletonVisible && (
                <div className="space-y-8">
                    <section className="space-y-3">
                        <div className="h-4 w-32 rounded bg-accent/60 animate-pulse" />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {Array.from({ length: INITIAL_SKELETON_COUNT }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    </section>
                </div>
            )}

            {initialLoaded && items.length === 0 && !loading && (
                <p className="text-sm opacity-70">
                    No photos yet for this filter selection.
                </p>
            )}

            {/* Grouped by month/year */}
            <div className="space-y-8">
                {grouped.map(([label, groupItems]) => (
                    <section key={label} className="space-y-3">
                        <h3 className="text-sm font-semibold opacity-80">{label}</h3>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {groupItems.map((item, idxInGroup) => {
                                const globalIndex = items.findIndex((i) => i.id === item.id);

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className="group relative aspect-square overflow-hidden rounded-md bg-accent shadow-sm"
                                        onClick={() => openLightbox(globalIndex)}
                                    >
                                        {/* Lazy load + simple blur effect */}
                                        <img
                                            src={item.imageUrl}
                                            alt={item.author?.name ?? "Photo"}
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 blur-[2px] group-hover:blur-0"
                                        />

                                        {/* Overlay: who posted */}
                                        <div className="absolute inset-x-0 bottom-0 p-2 bg-linear-to-t from-black/60 to-transparent text-xs text-white flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {item.author?.image && (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={item.author.image}
                                                    alt={item.author.name ?? "User"}
                                                    className="w-6 h-6 rounded-full object-cover border border-white/40"
                                                />
                                            )}
                                            <span className="truncate">
                                                {item.author?.name ?? "Unknown user"}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="h-8 flex items-center justify-center">
                {loading && items.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 w-full max-w-xl">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                )}
                {!nextCursor && initialLoaded && items.length > 0 && !loading && (
                    <span className="text-xs opacity-60">No more photos.</span>
                )}
            </div>

            {/* Lightbox */}
            {lightboxIndex !== null && items[lightboxIndex] && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center"
                    onClick={closeLightbox}
                >
                    <div
                        className="relative max-w-5xl max-h-[80vh] w-full px-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute -top-10 right-0 text-white text-sm opacity-70 hover:opacity-100"
                        >
                            Close ✕
                        </button>

                        {/* Image */}
                        <div className="w-full max-h-[70vh] flex items-center justify-center">
                            <img
                                src={items[lightboxIndex].imageUrl}
                                alt={items[lightboxIndex].author?.name ?? "Photo"}
                                className="max-h-[70vh] max-w-full object-contain rounded-md"
                            />
                        </div>

                        {/* Meta */}
                        <div className="mt-3 flex items-center justify-between text-xs text-white/80">
                            <div className="flex items-center gap-2">
                                {items[lightboxIndex].author?.image && (
                                    <img
                                        src={items[lightboxIndex].author.image}
                                        alt={items[lightboxIndex].author?.name ?? "User"}
                                        className="w-7 h-7 rounded-full object-cover border border-white/40"
                                    />
                                )}
                                <div className="flex flex-col">
                                    <span className="font-medium">
                                        {items[lightboxIndex].author?.name ?? "Unknown user"}
                                    </span>
                                    <span className="opacity-70">
                                        {new Date(
                                            items[lightboxIndex].createdAt
                                        ).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={showPrev}
                                    className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20"
                                >
                                    ← Prev
                                </button>
                                <button
                                    onClick={showNext}
                                    className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
