import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    const user = session?.user;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const result = await prisma.user.findUnique({
      where: {
        id: user.id
      },

    });
    const imageUrl = result?.image;
    if (imageUrl) {

    }

    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);


    const filename = `${user.id}-${Date.now()}-${file.name}`;
    const filepath = `./public/uploads/${filename}`;




    await import("fs").then(fs =>
      fs.writeFileSync(filepath, buffer)
    );


    await prisma.user.update({
      where: { id: user.id },
      data: {
        image: `/uploads/${filename}`,
      },
    });

    return NextResponse.json({ success: true, url: `/uploads/${filename}` });
  } catch (error) {
    console.error("Image upload failed:", error);
    return new NextResponse("Server error", { status: 500 });
  }
}
