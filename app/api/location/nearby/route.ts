import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  if(!lat || !lon){
    return NextResponse.json([]);
  }
  const bbox = [
    parseFloat(lon) - 0.500,
    parseFloat(lat) - 0.500,
    parseFloat(lon) + 0.500,
    parseFloat(lat) + 0.500,
  ].join(',');
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=city&format=json&bounded=1&viewbox=${bbox}`,
    {
      headers: {
        "User-Agent": "SocialCircle/1.0",
      },
      cache:"no-store"
    }
  );
  if (!res.ok) {
      console.warn("Nominatim nearby failed:", res.status);
      return NextResponse.json([]);
    }
  const data = await res.json();
 if (!Array.isArray(data)) {
      console.warn("Nominatim returned object instead of array:", data);
      return NextResponse.json([]);
    }

    return NextResponse.json(data);
}