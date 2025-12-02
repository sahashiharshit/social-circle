import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGalleryPage } from "@/lib/database-operations/getGalleryPage";
import { headers } from "next/headers";

export async function GET(req: Request) {
  const session = await auth.api.getSession({
    headers:await headers()
  });
  const user = session?.user;

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const sort = (searchParams.get("sort") as "NEWEST" | "OLDEST") || "NEWEST";
  const scope =
    (searchParams.get("scope") as "all" | "mine" | "friends") || "all";

  const data = await getGalleryPage(user.id, {
    cursor,
    sort,
    scope,
  });

  return NextResponse.json(data);
}
