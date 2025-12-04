"use client";

export default function PostSkeleton() {
  return (
    <div className="animate-pulse w-full bg-accent rounded-lg shadow-sm p-4 space-y-4">
      
      {/* HEADER */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gray-300" />

        {/* Name + Time */}
        <div className="space-y-2">
          <div className="h-3 w-32 bg-gray-300 rounded" />
          <div className="h-2 w-20 bg-gray-200 rounded" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="space-y-3">
        {/* Text Lines */}
        <div className="h-3 w-3/4 bg-gray-300 rounded" />
        <div className="h-3 w-1/2 bg-gray-300 rounded" />

        {/* Image Placeholder */}
        <div className="w-full h-56 bg-gray-300 rounded-lg" />
      </div>

      {/* FOOTER */}
      <div className="flex gap-10 opacity-70 pt-2">
        <div className="h-3 w-10 bg-gray-300 rounded" />
        <div className="h-3 w-10 bg-gray-300 rounded" />
      </div>
    </div>
  );
}
