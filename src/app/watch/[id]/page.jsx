import Navbar from "@/components/Navbar/Navbar";
// import Watch from "../../../components/Watch/Watch";
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

export default async function Page({ params }) {
  let id = params.id;

  let watchData = {};
  let infoData = {};

  try {
    // If the incoming id already targets an episode, fetch watch first
    if (id.includes("episode")) {
      const watchRes = await fetch(
        `https://api.henpro.fun/api/watch?id=${id}`,
        {
          cache: "no-store",
        }
      );
      const watchJson = await watchRes.json();

      if (watchJson.success && watchJson.data) {
        watchData = watchJson.data;
      } else {
        throw new Error("Invalid watch data");
      }

      // derive series id (fallback) and fetch series info
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
    }

    // If id doesn't include "episode", fetch info first and then use first episode slug
    else {
      const infoRes = await fetch(`https://api.henpro.fun/api/info?id=${id}`, {
        cache: "no-store",
      });
      const infoJson = await infoRes.json();

      if (infoJson.success && infoJson.data) {
        infoData = infoJson.data;

        // pick the first episode slug from episodes array
        const firstEpisodeSlug = infoJson.data.episodes?.[0]?.slug;

        if (firstEpisodeSlug) {
          const watchRes = await fetch(
            `https://api.henpro.fun/api/watch?id=${firstEpisodeSlug}`,
            { cache: "no-store" }
          );
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
      <WatchWrapper watchData={watchData} infoData={infoData} id={id} />
    </>
  );
}
