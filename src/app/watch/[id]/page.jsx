// app/watch/[id]/page.js
import { connectDB } from "@/lib/mongoClient"; // ✨ Import the DB connection utility
import Advertize from "@/components/Advertize/Advertize";
// import Navbar from "@/components/Navbar/Navbar";
import WatchWrapper from "@/components/Watch/WatchWrapper";

export async function generateMetadata({ params }) {
  function capitalizeWords(str) {
    return str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const paramsId = params.id;
  const formattedTitle = capitalizeWords(paramsId);

  return {
    title: `Watch ${formattedTitle} Hentai Video Streams Online in 720p , 1080p HD - Henpro`,
    description: `Enjoy your unlimited hentai & anime
          collection. We are the definitive source for the best curated 720p /
          1080p HD hentai videos, viewable by mobile phone and tablet, for free.`,
  };
}

// ✨ Note: Page component receives both params AND searchParams
export default async function Page({ params, searchParams }) {
  const id = params.id;
  const creatorApiKey = searchParams.creator; // ✨ Get the creator API key

  let watchData = {};
  let infoData = {};

  // --- Start Dynamic Ad Link Logic ---
  const DEFAULT_AD_LINK =
    "https://www.revenuecpmgate.com/d3j8c16q?key=c843c816558b4282950c88ec718cf1ea";
  let dynamicAdLink = DEFAULT_AD_LINK;

  if (creatorApiKey) {
    try {
      // 1. Connect to MongoDB
      const db = await connectDB();
      const collection = db.collection("creators");

      // 2. Fetch the creator data
      const creatorData = await collection.findOne(
        { username: creatorApiKey },
        { projection: { adsterraSmartlink: 1, _id: 0 } }
      );

      // 3. Update the ad link if found
      if (creatorData && creatorData.adsterraSmartlink) {
        dynamicAdLink = creatorData.adsterraSmartlink;
      }
    } catch (error) {
      console.error(
        "MongoDB fetch failed for creator on watch page:",
        creatorApiKey,
        error
      );
      // Fallback to DEFAULT_AD_LINK
    }
  }
  // --- End Dynamic Ad Link Logic ---

  try {
    // If the incoming id already targets an episode, fetch watch first
    if (id.includes("episode")) {
      const watchRes = await fetch(
        `https://api.henpro.fun/api/watch?id=${id}`,
        { cache: "no-store" }
      ); // ... (rest of watch-first logic)
      const watchJson = await watchRes.json();

      if (watchJson.success && watchJson.data) {
        watchData = watchJson.data;
      } else {
        throw new Error("Invalid watch data");
      } // derive series id (fallback) and fetch series info

      const seriesId =
        watchData.seriesId || id.replace(/-episode-.*/, "-id-01");

      const infoRes = await fetch(
        `https://api.henpro.fun/api/info?id=${seriesId}`,
        { cache: "no-store" }
      );
      const infoJson = await infoRes.json();

      if (infoJson.success && infoJson.data) {
        infoData = infoJson.data;
      }
    } // If id doesn't include "episode", fetch info first and then use first episode slug
    else {
      const infoRes = await fetch(`https://api.henpro.fun/api/info?id=${id}`, {
        cache: "no-store",
      });
      const infoJson = await infoRes.json();

      if (infoJson.success && infoJson.data) {
        infoData = infoJson.data; // pick the first episode slug from episodes array

        const firstEpisodeSlug = infoJson.data.episodes?.[0]?.slug;

        if (firstEpisodeSlug) {
          const watchRes = await fetch(
            `https://api.henpro.fun/api/watch?id=${firstEpisodeSlug}`,
            { cache: "no-store" }
          ); // ... (rest of info-first logic)
          const watchJson = await watchRes.json();

          if (watchJson.success && watchJson.data) {
            watchData = watchJson.data;
          } else {
            // couldn't fetch watch for first episode
            console.warn(
              "Failed to fetch watch data for first episode slug:",
              firstEpisodeSlug
            );
          }
        } else {
          // no episodes available in info response
          console.warn("No episodes found in info response for id:", id);
        }
      } else {
        throw new Error("Invalid info data for id: " + id);
      }
    }
  } catch (err) { 
    console.error("Error fetching watch/info data:", err);
  }

  return (
    <>
      <WatchWrapper watchData={watchData} infoData={infoData} id={id} creator={creatorApiKey} />
      <Advertize initialAdLink={dynamicAdLink} />   {" "}
    </>
  );
}
