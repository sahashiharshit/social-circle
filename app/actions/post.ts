"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { type UploadPhotoResult, uploadPhotoToS3 } from "@/lib/cloudFunctions";
import { headers } from "next/headers";
import 'dotenv';

export async function createPost(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session || !session.user) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;
    const privacyRaw = formData.get("privacy-choice");
    console.log(privacyRaw)
    const privacy = privacyRaw === "private" ? "PRIVATE" : privacyRaw === "friends" ? "FRIENDS_ONLY" : "PUBLIC";

    const contentRaw = formData.get("post-text");
    const content =
        typeof contentRaw === 'string' && contentRaw.trim().length > 0
            ? contentRaw.trim()
            : null;
    const locationName = formData.get('location');
    const lat = formData.get('lat');
    const lon = formData.get('lon');
    const locationPresent = typeof locationName === "string" && locationName.trim().length > 0;
    const latStr = typeof lat === "string" && lat.trim() ? lat.trim() : null;
    const lonStr = typeof lon === "string" && lon.trim() ? lon.trim() : null;
    const file = formData.get("photo") as File | null;
 
    const hasImage = file && file.size > 0;
    if (!content && !hasImage) {
        throw new Error("Post must have either text or image.");
    }
    let imageUrl: string | null = null;
    if (hasImage && file) {
        const uploaded: UploadPhotoResult = await uploadPhotoToS3(file);
        if (!uploaded.success) {
            console.error("Image upload failed:", uploaded.error);
            throw new Error(uploaded.error || "Failed to upload image");
        }
        imageUrl = `${process.env.CLOUDFRONT_DOMAIN}/${uploaded.fileName}`;
    }

    let fullLocation: any = null;
    if (locationPresent || latStr || lonStr) {
        fullLocation = {
            name: typeof locationName === "string" ? locationName : null,
            lat: latStr,
            lon: lonStr,
        };
    }



    const post = await prisma.post.create({
        data: {
            authorId: userId,
            content,
            imageUrl,
            fullLocation,
            privacy,
        }
    });
    return !!post;
}