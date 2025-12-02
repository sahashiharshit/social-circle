"use client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import CommentButton from "@/components/ui/commentButton";
import LikeButton from "@/components/ui/likeButton";
import { FALLBACK_AVATAR } from "@/lib/fallbackImage";
import { FeedPost } from "@/types/Post";
import Image from "next/image";
import { FaComment, FaLocationArrow, FaThumbsUp } from "react-icons/fa";



export default function PostCard({post}:{post:FeedPost}){
    
    const location = post.fullLocation as {name?:string
        lat?:string|null;
        lon?:string|null;
    }| null;
    return(
        <Card className="mb-4 shadow-sm bg-accent">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Image
            src={post.author.image || FALLBACK_AVATAR}
            width={40}
            height={40}
            className="rounded-full"
            alt="User"
          />
          <div>
            <p className="font-semibold">{post.author.name}</p>
            <p className="text-xs opacity-60">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {post.content && <p>{post.content}</p>}

        {post.imageUrl && (
          <div className="rounded overflow-hidden">
            <Image
              src={post.imageUrl.startsWith("https")
                ? post.imageUrl
                : `${post.imageUrl}`}
              width={600}
              height={400}
              alt="Post image"
              unoptimized
              className="rounded-md"
            />
          </div>
        )}

        {location?.name && (
          <div className="flex items-center gap-2 text-sm opacity-70">
            <FaLocationArrow /> {location.name}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <div className="flex justify-start gap-10 w-full text-sm opacity-70">
          
          <LikeButton/>
          <CommentButton/>
        </div>
      </CardFooter>
    </Card>
    );
}