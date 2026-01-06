// app/series/page.js (or app/release/page.js)
import Advertize from "@/components/Advertize/Advertize";
import Release from "@/components/Release/Release";
import { adminDB } from "@/lib/firebaseAdmin"; // Firestore instance

export default async function SeriesPage({ searchParams }) {
  const searchParam = await searchParams
  const page = searchParam.page || 1;
  const year = searchParam.year;
  const creatorApiKey = searchParam.creator; // ✨ Get the creator API key

  // --- Start Dynamic Ad Link Logic ---
  const DEFAULT_AD_LINK =
    "https://www.effectivegatecpm.com/z67nn0nfnb?key=047c39737c61fbc71ce51ba3d9ff8923";
  let dynamicAdLink = DEFAULT_AD_LINK;

  if (creatorApiKey) {
    try {
      // 1. Reference the creator document in Firestore
      // Assuming the document ID is the username; if not, we can query by 'username' field
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
  // --- End Dynamic Ad Link Logic ---

  // --- Standard Data Fetch Logic ---
  const apiUrl = `https://henpro-api.vercel.app/api/year?year=${year}&page=${page}`;

  const res = await fetch(apiUrl, {
    next: { revalidate: 300 }, // revalidate every 5 min
  });

  if (!res.ok) {
    throw new Error("Failed to fetch series by year");
  }

  const data = await res.json();
  // --- End Standard Data Fetch Logic ---

  return (
    <div className="page-wrapper">
      <Release
        data={data || []}
        year={year}
        totalPages={data?.totalPages || 1}
        creator={creatorApiKey}
      />
      {/* 🌟 Pass the dynamic ad link to the Advertize component */}
      <Advertize initialAdLink={dynamicAdLink} />
    </div>
  );
}
