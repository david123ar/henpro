// app/series/page.js

import Advertize from "@/components/Advertize/Advertize";
import Genre from "@/components/Genre/Genre";
import { adminDB } from "@/lib/firebaseAdmin"; // Firestore instance

export default async function SeriesPage({ searchParams }) {
  const searchParam = await searchParams
  const page = searchParam.page || 1;
  const genre = searchParam.genre;
  const creatorApiKey = searchParam.creator; // Get the creator API key

  // --- Start Creator Ad Link Logic ---
  const DEFAULT_AD_LINK =
    "https://www.effectivegatecpm.com/z67nn0nfnb?key=047c39737c61fbc71ce51ba3d9ff8923";
  let dynamicAdLink = DEFAULT_AD_LINK;

  if (creatorApiKey) {
    try {
      // 1. Reference the creator document in Firestore
      const docRef = adminDB.collection("creators").doc(creatorApiKey);
      const docSnapshot = await docRef.get();

      // 2. Update the ad link if found
      if (docSnapshot.exists) {
        const creatorData = docSnapshot.data();
        if (creatorData?.adsterraSmartlink) {
          dynamicAdLink = creatorData.adsterraSmartlink;
        }
      }
    } catch (error) {
      console.error("Firestore fetch failed for creator:", creatorApiKey, error);
      // Fallback to default link
    }
  }
  // --- End Creator Ad Link Logic ---

  // --- Start Genre Data Fetch Logic ---
  const apiUrl = `https://henpro-api.vercel.app/api/genre?genre=${genre}&page=${page}`;

  const res = await fetch(apiUrl, {
    next: { revalidate: 300 }, // revalidate every 5 min
  });

  if (!res.ok) {
    throw new Error("Failed to fetch series");
  }

  const data = await res.json();
  // --- End Genre Data Fetch Logic ---

  return (
    <div className="page-wrapper">
      <Genre
        data={data || []}
        genre={genre}
        totalPages={data?.totalPages || 1}
        creator={creatorApiKey}
      />
      <Advertize initialAdLink={dynamicAdLink} />{" "}
      {/* Pass the link to the client component */}
    </div>
  );
}
