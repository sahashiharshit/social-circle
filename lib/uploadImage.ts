import { s3Client } from "@/lib/s3";
import { revalidatePath } from "next/cache";
import "dotenv";
import { PutObjectCommand } from "@aws-sdk/client-s3";

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
export async function uploadPhotoToS3(file: File): Promise<UploadPhotoResult> {

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const ext = file.name.split(".").pop() || "jpg";
        const key = `posts/${crypto.randomUUID()}.${ext}`;
        // Define upload parameters
        const params = {
            Bucket: BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: file.type,
            
        };
        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        // Optional: Revalidate paths if needed
        revalidatePath("/");

        return { success: true, fileName:key };
    } catch (error:any) {
        console.error("Error uploading image:", error);
        return { success:false,
            error: "Image upload failed" 
        };
    }
}