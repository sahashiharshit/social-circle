export type GallerySort = "NEWEST" | "OLDEST";
export type GalleryScope = "all" | "mine" | "friends";

export type Author = {
    id: string;
    name: string | null;
    image: string | null;
};

export type GalleryItem = {
    id: string;
    imageUrl: string;
    createdAt: string;
    author: Author;
};

export type ApiResponse = {
    items: GalleryItem[];
    nextCursor: string | null;
};