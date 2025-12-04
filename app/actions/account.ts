"use server";

import { auth } from "@/lib/auth";
import { deleteFromS3, keyFromImageUrl, uploadProfileImageToS3 } from "@/lib/cloudFunctions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function changePassword(formData: FormData) {

    const currentSession = await auth.api.getSession({
        headers: await headers()
    });
    if (!currentSession) {
        redirect("/signup?redirectTo=/settings/account");
    }
    const currentPassword = formData.get("currentPassword") as string | null;
    const newPassword = formData.get("newPassword") as string | null;
    const confirmPassword = formData.get("confirmPassword") as string | null;

    if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error("All fields are required");
    }

    if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
    }

    // Better Auth handles verifying current password and updating the Account
    await auth.api.changePassword({
        body: {
            currentPassword,
            newPassword,
            revokeOtherSessions: true, // logs out from other devices :contentReference[oaicite:0]{index=0}
        },
        headers: await headers(),
    });

    revalidatePath("/settings/account");

}

//.............Delete Account.......
export async function deleteAccount(formData: FormData) {

    const confirmValue = formData.get("confirm");

    if (confirmValue !== "DELETE") {
        throw new Error("You must type DELETE to confirm.");
    }
    const currentSession = await auth.api.getSession({
        headers: await headers(),
    });
    if (!currentSession) {
        redirect("/signup");
    }

    const userId = currentSession.user.id;
    await auth.api.signOut({
        headers: await headers(),
    });
    // Grab user image + their post images before we delete records
    const [userRecord, postsWithImages] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: { image: true },
        }),
        prisma.post.findMany({
            where: { authorId: userId, NOT: { imageUrl: null } },
            select: { imageUrl: true },
        }),
    ]);

    // Main DB cleanup in a transaction
    await prisma.$transaction(async (tx) => {
        // 1) Find all accepted friendships involving this user
        const acceptedRequests = await tx.friendship.findMany({
            where: {
                OR: [
                    { requesterId: userId, status: "ACCEPTED" },
                    { addresseeId: userId, status: "ACCEPTED" },
                ],
            },
        });

        const friendIds = [
            ...acceptedRequests.map((f) => f.requesterId),
            ...acceptedRequests.map((f) => f.addresseeId),
        ].filter((id) => id !== userId);

        if (friendIds.length > 0) {
            await tx.user.updateMany({
                where: { id: { in: friendIds } },
                data: { friendsCount: { decrement: 1 } },
            });
        }

        // 2) Delete the user.

        await tx.user.delete({
            where: { id: userId },
        });
    });

    // 3) Delete profile image from S3 (if any)
    if (userRecord?.image) {
        const key = keyFromImageUrl(userRecord.image);
        if (key) {
            await deleteFromS3(key).catch(() => { });
        }
    }

    // 4) Delete all post images from S3
    for (const post of postsWithImages) {
        if (!post.imageUrl) continue;
        const key = keyFromImageUrl(post.imageUrl);
        if (key) {
            await deleteFromS3(key).catch(() => { });
        }
    }


    redirect("/");
}
export async function updateProfileImage(formData: FormData) {
    "use server";
    const currentSession = await auth.api.getSession({
        headers: await headers(),
    });
    const currentUser = currentSession?.user;
    if (!currentUser) {
        redirect("/signup?redirectTo=/settings/account");
    }
    const file = formData.get("image") as File | null;
    if (!file || file.size === 0) {
        // nothing to upload
        return;
    }
    const userRecord = await prisma.user.findUnique({
        where: { id: currentUser.id },
        select: { id: true, image: true },
    });
    if (!userRecord) return;

    const oldImageUrl = userRecord.image ?? null;
    // 1. Upload new image
    const { url: newUrl, fileName: key } = await uploadProfileImageToS3(
        file,
        userRecord.id
    );

    // 2. Update DB, rollback upload if update fails
    try {
        await prisma.user.update({
            where: { id: userRecord.id },
            data: {
                image: newUrl,
            },
        });
    } catch (err) {
        // DB update failed – remove the new image to avoid orphan
        await deleteFromS3(key).catch(() => { });
        throw err;
    }
    // 3. Delete old profile image from S3 (if any)
    if (oldImageUrl) {
        const oldKey = keyFromImageUrl(oldImageUrl);
        if (oldKey) {
            await deleteFromS3(oldKey).catch(() => { });
        }
    }

    revalidatePath("/settings/account");
}
