import { s3Client } from "@/lib/s3";
import { revalidatePath } from "next/cache";
import "dotenv";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";


export type UploadPhotoResult =
    | {
        success: true;
        fileName: string;
        error?: undefined;
    }
    | {
        success: false;
        fileName?: undefined;
        error: string;
    };
const BUCKET_NAME = process.env.AWS_BUCKET_NAME!;
const region = process.env.AWS_REGION!;
const cloudfronturl = process.env.CLOUDFRONT_DOMAIN!;
export async function uploadPhotoToS3(file: File): Promise<UploadPhotoResult> {

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const ext = file.name.split(".").pop() || "jpg";
        const key = `posts/${crypto.randomUUID()}.${ext}`;
       
        const params = {
            Bucket: BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: file.type,

        };
        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        
        revalidatePath("/");

        return { success: true, fileName: key };
    } catch (error: any) {
        console.error("Error uploading image:", error);
        return {
            success: false,
            error: "Image upload failed"
        };
    }
}

export async function uploadProfileImageToS3(file: File, userId: string) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const ext = file.name.split(".").pop() || "jpg";
    const key = `profile-images/${userId}/${crypto.randomUUID()}.${ext}`;
    const params = {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
    };
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    const url = `${cloudfronturl}/${key}`;
    return { url:url,fileName: key };
}
export async function deleteFromS3(key: string) {
    if (!key) return;
    await s3Client.send(
        new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        })
    );
}

export function keyFromImageUrl(url: string): string | null {
    if (!url) return null;
    try {
        const u = new URL(url);
        const base = cloudfronturl.endsWith("/") ?
            cloudfronturl.slice(0, -1) :
            cloudfronturl;

        if(url.startsWith(base)){
            return url.slice(base.length +1);
        }
        return u.pathname.replace(/^\/+/,"");
    } catch {
        return null;
    }
}