// app/watch/[id]/page.js
import Advertize from "@/components/Advertize/Advertize";
import WatchWrapper from "@/components/Watch/WatchWrapper";
import { adminDB } from "@/lib/firebaseAdmin"; // Firestore instance

// --- Safe fetch helper ---
async function safeFetchJSON(url) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      return data;
    } catch (e) {
      console.error(`Expected JSON from ${url}, got HTML or invalid JSON:`, text);
      return null;
    }
  } catch (err) {
    console.error(`Fetch failed for ${url}:`, err);
    return null;
  }
}

// --- Metadata generation ---
export async function generateMetadata({ params }) {
  function capitalizeWords(str) {
    return str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  const param = await params;
  const id = param.id

  const formattedTitle = capitalizeWords(id);

  return {
    title: `Watch ${formattedTitle} Hentai Video Streams Online in 720p , 1080p HD - Hanimetv`,
    description: `Enjoy your unlimited hentai & anime collection. We are the definitive source for the best curated 720p / 1080p HD hentai videos, viewable by mobile phone and tablet, for free.`,
  };
}

// --- Main page component ---
export default async function Page({ params, searchParams }) {
  const param = await params;
  const id = param.id
  const searchParam = await searchParams
  const creatorApiKey = searchParam.creator;

  let watchData = null;
  let infoData = null;

  // --- Dynamic Ad Link ---
  const DEFAULT_AD_LINK =
    "https://www.effectivegatecpm.com/z67nn0nfnb?key=047c39737c61fbc71ce51ba3d9ff8923";
  let dynamicAdLink = DEFAULT_AD_LINK;

  if (creatorApiKey) {
    try {
      // Firestore fetch
      const docRef = adminDB.collection("creators").doc(creatorApiKey);
      const docSnapshot = await docRef.get();

      if (docSnapshot.exists) {
        const creatorData = docSnapshot.data();
        if (creatorData?.adsterraSmartlink) {
          dynamicAdLink = creatorData.adsterraSmartlink;
        }
      }
    } catch (err) {
      console.error("Firestore fetch failed for creator:", creatorApiKey, err);
    }
  }

  // --- Fetch Watch & Info Data ---
  try {
    if (id.includes("episode")) {
      const watchJson = await safeFetchJSON(`https://henpro-api.vercel.app/api/watch?id=${id}`);
      if (watchJson?.success) watchData = watchJson.data;

      const seriesId = watchData?.seriesId || id.replace(/-episode-.*/, "-id-01");
      const infoJson = await safeFetchJSON(`https://henpro-api.vercel.app/api/info?id=${seriesId}`);
      if (infoJson?.success) infoData = infoJson.data;

    } else {
      const infoJson = await safeFetchJSON(`https://henpro-api.vercel.app/api/info?id=${id}`);
      if (infoJson?.success) infoData = infoJson.data;

      const firstEpisodeSlug = infoData?.episodes?.[0]?.slug;
      if (firstEpisodeSlug) {
        const watchJson = await safeFetchJSON(`https://henpro-api.vercel.app/api/watch?id=${firstEpisodeSlug}`);
        if (watchJson?.success) watchData = watchJson.data;
      }
    }
  } catch (err) {
    console.error("Error fetching watch/info data:", err);
  }

  // --- Render fallback UI if no data ---
  if (!watchData && !infoData) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Video Unavailable</h1>
        <p className="text-gray-500">
          Sorry, we couldn’t load this video. Please try refreshing the page or check back later.
        </p>
      </div>
    );
  }

  return (
    <>
      <WatchWrapper watchData={watchData} infoData={infoData} id={id} creator={creatorApiKey} />
      <Advertize initialAdLink={dynamicAdLink} />
    </>
  );
}
