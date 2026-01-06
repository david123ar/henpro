// app/search/page.js (or app/series/page.js if using search routing)
import Advertize from "@/components/Advertize/Advertize";
import Search from "@/components/Search/Search";
import { adminDB } from "@/lib/firebaseAdmin"; // Firestore instance

export default async function SearchPage({ searchParams }) {
  const searchParam = await searchParams
  const q = searchParam.q || ""; // The search query
  const creatorApiKey = searchParam.creator; // ✨ Get the creator API key

  // --- Start Dynamic Ad Link Logic ---
  const DEFAULT_AD_LINK =
    "https://www.effectivegatecpm.com/z67nn0nfnb?key=047c39737c61fbc71ce51ba3d9ff8923";
  let dynamicAdLink = DEFAULT_AD_LINK;

  if (creatorApiKey) {
    try {
      // 1. Reference the creator document in Firestore
      // Assuming document ID is the username; otherwise use a query
      const docRef = adminDB.collection("creators").doc(creatorApiKey);
      const docSnapshot = await docRef.get();

      if (docSnapshot.exists) {
        const creatorData = docSnapshot.data();
        if (creatorData?.adsterraSmartlink) {
          dynamicAdLink = creatorData.adsterraSmartlink;
        }
      }
    } catch (error) {
      console.error(
        "Firestore fetch failed for creator on search page:",
        creatorApiKey,
        error
      );
      // fallback to DEFAULT_AD_LINK
    }
  }
  // --- End Dynamic Ad Link Logic ---

  // --- Standard Search Data Fetch Logic ---
  const encodedQ = encodeURIComponent(q);
  const apiUrl = `https://henpro-api.vercel.app/api/search?q=${encodedQ}`;

  const res = await fetch(apiUrl, {
    next: { revalidate: 300 }, // revalidate every 5 min
  });

  if (!res.ok) {
    throw new Error("Failed to fetch series");
  }

  const data = await res.json();
  // --- End Standard Data Fetch Logic ---

  return (
    <div className="page-wrapper">
      <Search data={data || []} keyword={q} creator={creatorApiKey} />
      <Advertize initialAdLink={dynamicAdLink} />
    </div>
  );
}
