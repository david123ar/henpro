// app/series/page.js (or app/page.js)
import Advertize from "@/components/Advertize/Advertize";
import Series from "@/components/Series/Series";
import { adminDB } from "@/lib/firebaseAdmin"; // Firestore instance

export default async function SeriesPage({ searchParams }) {
  const searchParam = await searchParams
  const page = searchParam.page || 1;
  const creatorApiKey = searchParam.creator; // Get the creator API key

  // --- Start Dynamic Ad Link Logic ---
  const DEFAULT_AD_LINK =
    "https://contemplatewaryheadquarter.com/ukqgqrv4n?key=acf2a1b713094b78ec1cc21761e9b149";
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
        "Firestore fetch failed for creator on main series page:",
        creatorApiKey,
        error
      );
      // fallback to DEFAULT_AD_LINK
    }
  }
  // --- End Dynamic Ad Link Logic ---

  // --- Standard Series Data Fetch Logic ---
  const apiUrl = `https://henpro-api.vercel.app/api/series?page=${page}`;

  const res = await fetch(apiUrl, {
    next: { revalidate: 300 }, // revalidate every 5 min
  });

  if (!res.ok) {
    throw new Error("Failed to fetch series");
  }

  const data = await res.json();
  // --- End Standard Series Data Fetch Logic ---

  return (
    <div className="page-wrapper">
      <Series
        data={data || []}
        totalPages={data?.totalPages || 1}
        creator={creatorApiKey}
      />
      {/* 🌟 Pass the dynamic ad link to the Advertize component */}
      <Advertize initialAdLink={dynamicAdLink} />
    </div>
  );
}
