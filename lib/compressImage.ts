export async function compressImage(
    file:File,
    quality:number=0.8,
    maxWidth:number=1500
):Promise<File>{
const imageBitmap = await createImageBitmap(file);
const scale = Math.min(maxWidth/imageBitmap.width,1);
const canvas = document.createElement("canvas");
canvas.width = imageBitmap.width*scale;
canvas.height = imageBitmap.height *scale;
const ctx = canvas.getContext("2d");
if(!ctx) throw new Error("Canvas not supported");
ctx.drawImage(imageBitmap,0,0,canvas.width,canvas.height);

return new Promise((resolve)=>{
    canvas.toBlob(
        (blob)=>{
            if(!blob) return resolve(file);
            
            const compressFile = new File([blob],file.name,{
                type:blob.type,
            });
            resolve(compressFile);
        },
        "image/jpeg",
        quality
    );
});

}