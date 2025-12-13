"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useEffect, useRef, useState } from "react";
import { FaLocationArrow, FaMapMarkerAlt, FaSearch } from "react-icons/fa"
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { IoArrowBack, IoCloseCircle, IoRemoveCircle } from "react-icons/io5";
import { createPost } from "@/app/actions/post";
import { compressImage } from "@/lib/compressImage";
import { useSession } from "@/context/SessionContext";
import PrivacySelect  from "@/components/dashboard-components/main/PrivacySelect";
import { FALLBACK_AVATAR } from "@/lib/fallbackImage";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Location, SelectedPhoto } from "@/types/Post";
import { PrivacyValue } from "@/types/Privacy";


function MainModal({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) {
    if (!isOpen) return null
    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-40" />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 " onClick={onClose}>
                <div className="bg-accent rounded-lg max-w-lg w-full max-h-[90vh] overflow-visible p-6 shadow-lg relative" onClick={e => e.stopPropagation()}>
                    {children}
                </div>
            </div>
        </>
    )

}
export default function Post({ image }: { image: string | null | undefined }) {
    const [isMainOpen, setMainOpen] = useState(false);
    const [modalScreen, setModalScreen] = useState<"post" | "location">("post");
    const [content, setContent] = useState("");
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Location[]>([]);
    const [loading, setLoading] = useState(false);
    const [privacy, setPrivacy] = useState<PrivacyValue>("public");
    const [isPosting, setIsPosting] = useState(false);
    
    const photoInputRef = useRef<HTMLInputElement | null>(null);
    const router = useRouter();
    const session = useSession();

    async function loadNearby() {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(async ({ coords }) => {
            const { latitude, longitude } = coords;

            const res = await fetch(
                `/api/location/nearby?lat=${latitude}&lon=${longitude}`);
            const data = await res.json();

            setResults(
                data.map((i: any) => ({
                    name: i.display_name,
                    lat: i.lat,
                    lon: i.lon,
                }))
            );
            setLoading(false);
        });
    }
    useEffect(() => {
        if (modalScreen === "location") loadNearby();
    }, [modalScreen]);

    async function search(q: string) {
        setQuery(q);

        if (!q.trim()) return loadNearby();

        setLoading(true);
        const res = await fetch(`/api/location/search?q=${q}`);
        const data = await res.json();

        setResults(
            data.map((i: any) => ({
                name: i.display_name,
                lat: i.lat,
                lon: i.lon,
            }))
        );
        setLoading(false);
    }
    async function handlePostSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPosting(true);

    // ⭐ Create optimistic post object
    const optimistic = {
      id: "temp-" + Date.now(),
      content,
      imageUrl: photoPreview,
      author: {
        name: session?.user.name,
        image: image || FALLBACK_AVATAR,
      },
      createdAt: new Date().toISOString(),
      fullLocation: selectedLocation ? { name: selectedLocation.name } : null,
      likeCount: 0,
      likedByMe: false,
      commentCount: 0,
    };

    // Show it instantly
    window.dispatchEvent(
      new CustomEvent("new-optimistic-post", { detail: optimistic })
    );

    const formData = new FormData(e.currentTarget);

    const ok = await createPost(formData);

    setIsPosting(false);

    if (ok) {
      toast.success("Post created!");
      router.refresh();
      setTimeout(() => setMainOpen(false), 150);

      // Reset state
      setContent("");
      setSelectedLocation(null);
      setPhotoPreview(null);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  }
    return (
        <div className="w-full mx-auto p-4 bg-accent/40 rounded-lg shadow-md">
            <div className="flex space-x-4">
                <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                    <AvatarImage src={image || FALLBACK_AVATAR} className="object-cover w-full h-full" width={48} height={48} />
                    <AvatarFallback>Image</AvatarFallback>
                </Avatar>
                <div className="flex-1 ">
                    <input
                        placeholder="What's on your mind?"
                        className="w-full bg-accent/80 border-none rounded-3xl p-3 cursor-pointer"
                        value={content}
                        readOnly
                        onClick={() => {
                            setMainOpen(true);
                            setModalScreen('post');
                        }}
                    />

                </div>
            </div>
            {/* Main model Code */}
            <MainModal isOpen={isMainOpen} onClose={() => setMainOpen(false)} >

                <h2 className="text-xl font-semibold mb-4 text-center">Create Post</h2>
                <button
                    className="absolute top-3 right-3"
                    type="button"
                    onClick={() => setMainOpen(false)}
                >
                    <IoCloseCircle size={24} color="red" />
                </button>
                {/* SCREEN WRAPPER */}
                <div className="relative w-full bg-accent/70 ">
                    {/* POST SCREEN */}
                    <div
                        className={`transition-all duration-300 ${modalScreen === "post"
                            ? "block"
                            : "hidden"
                            }`}
                    >
                        <form onSubmit={handlePostSubmit} >
                            <div className="flex gap-3 items-center mb-4">
                                <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                                    <AvatarImage src={image || FALLBACK_AVATAR} className="object-cover w-full h-full" width={48} height={48} />
                                    <AvatarFallback>Image</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col justify-between h-12 min-w-0 flex-1">
                                    <span className=" text-sm leading-tight truncate font-medium">{session?.user.name}</span>
                                    <PrivacySelect
                                        value={privacy}
                                        onChange={setPrivacy}
                                        name="privacy-choice"
                                    />

                                </div>
                            </div>


                            <textarea
                                name="post-text"
                                rows={2}
                                className="w-full bg-black/10  border rounded-md p-3 resize-none "
                                placeholder="What's on your mind?"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            {/* HIDDEN FIELDS */}
                            <input type="hidden" name="location" value={selectedLocation?.name ?? ""} />
                            <input type="hidden" name="lat" value={selectedLocation?.lat ?? ""} />
                            <input type="hidden" name="lon" value={selectedLocation?.lon ?? ""} />

                            {/* HIDDEN FILE INPUT */}
                            <input
                                type="file"
                                name="photo"
                                ref={photoInputRef}
                                className="hidden"
                            />
                            {/* PREVIEWS */}
                            {selectedLocation && (
                                <div className="mt-3 flex items-center gap-2">
                                    <FaLocationArrow /> {selectedLocation.name}
                                </div>
                            )}

                            {photoPreview && (
                                <div className="relative mt-3 inline-block">
                                    <img src={photoPreview} className="rounded mt-3 max-h-40" />
                                    <button type="button" onClick={() => {
                                        setPhotoPreview(null);
                                        if (photoInputRef.current) {
                                            photoInputRef.current.value = "";
                                        }
                                    }}
                                        className="absolute -top-1 -right-3 rounded-full p-1 shadow "
                                    >
                                        <IoRemoveCircle size={24} color="red" />
                                    </button>
                                </div>
                            )}
                            <div className="mt-4 flex justify-start space-x-2">
                                <button
                                    type="button"
                                    className="flex items-center space-x-1 hover:text-blue-600"
                                    aria-label="Add Location"
                                    onClick={() => {
                                        setModalScreen('location')
                                        setResults([])
                                    }}
                                >
                                    <FaMapMarkerAlt color="red" size={24} />
                                </button>
                                <button
                                    type="button"
                                    className="flex items-center space-x-1 rounded-md hover:text-blue-600"
                                    aria-label="Add photo"
                                    onClick={() => selectPhoto(async (photo) => {
                                        const compressed = await compressImage(photo.file);

                                        const compressedPreview = URL.createObjectURL(compressed);
                                        setPhotoPreview(compressedPreview);
                                        if (photoInputRef.current) {
                                            const dt = new DataTransfer();
                                            dt.items.add(compressed);
                                            photoInputRef.current.files = dt.files;
                                        }
                                    })}
                                >
                                    <MdOutlineAddPhotoAlternate color="green" size={24} />

                                </button>
                            </div>
                            <div className="mt-4 flex justify-start space-x-2">
                                <button
                                    className={`px-4 py-2 w-full bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:bg-gray-500`}
                                    disabled={!content.trim() || isPosting}
                                    type="submit"
                                >
                                    {isPosting ? (
                                        <>
                                            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                                            Posting...
                                        </>
                                    ) : (
                                        "Post"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* LOCATION SCREEN */}
                    <div
                        className={` transition-all duration-300 ${modalScreen === "location"
                            ? "block"
                            : "hidden"
                            }`}
                    >
                        <button
                            type="button"
                            className="flex items-center gap-2 mb-4"
                            onClick={() => setModalScreen("post")}
                        >
                            <IoArrowBack /> Back
                        </button>

                        {/* Search Input */}
                        <div className="relative mb-3">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                className="w-full rounded-3xl border px-4 py-2 pl-10"
                                placeholder="Search..."
                                value={query}
                                onChange={(e) => {
                                    setResults([])
                                    search(e.target.value)

                                }}
                            />
                        </div>

                        {loading && <p>Loading...</p>}

                        <div className="space-y-2 pb-4">
                            {results.map((loc, i) => (
                                <div
                                    key={i}
                                    onClick={() => {
                                        setSelectedLocation(loc);
                                        setModalScreen("post");
                                    }}
                                    className="p-3 border-b rounded-lg cursor-pointer "
                                >
                                    {loc.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </MainModal>




        </div>
    );
}

function selectPhoto(onSelect: (photo: SelectedPhoto) => void) {
    const input = document.createElement('input');
    input.type = "file"
    input.accept = "image/*";
    input.onchange = () => {
        const file = input.files?.[0];
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);
        onSelect({
            file,
            previewUrl,
        });
    };
    input.click();
}