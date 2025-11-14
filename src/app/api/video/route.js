import axios from "axios";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return new Response("Missing url query", { status: 400 });
  }

  const videoUrl = decodeURIComponent(url);

  try {
    const headers = {
      Referer: "https://watchhentai.net/",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
    };

    // Handle Range requests (for seeking)
    const range = req.headers.get("range");
    if (range) headers.Range = range;

    const response = await axios({
      method: "GET",
      url: videoUrl,
      responseType: "stream",
      headers,
    });

    // Create response headers
    const newHeaders = new Headers();
    for (const [key, value] of Object.entries(response.headers)) {
      newHeaders.set(key, value);
    }

    // Pipe stream directly through
    return new Response(response.data, {
      status: response.status,
      headers: newHeaders,
    });
  } catch (err) {
    console.error("Video proxy error:", err.message);
    return new Response("Video load error", { status: 500 });
  }
}
