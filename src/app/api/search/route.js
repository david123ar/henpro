import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ error: "Missing search query" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://watchhentai.net/wp-json/dooplay/search/?keyword=${encodeURIComponent(
        query
      )}&nonce=a78f393b43`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error(`External API error: ${res.status}`);
    }

    const data = await res.json();

    // Convert object to array with clean structure
    const results = Object.entries(data).map(([id, item]) => ({
      id,
      title: item.title,
      url: item.url,
      img: item.img,
      date: item.extra?.date || null,
    }));

    return NextResponse.json({ results });
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 500 }
    );
  }
}
