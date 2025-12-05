import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json([]);
  }

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      q
    )}`,
    {
      headers: {
        "User-Agent": "SocialCircle/1.0 (harshitsah96@gmail.com)",
      },
    }
  );

  const data = await res.json();
  return NextResponse.json(data);
}
