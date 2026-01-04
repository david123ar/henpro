// app/page.js

import Advertize from "@/components/Advertize/Advertize";
import Home from "@/components/Home/Home";
import React from "react";
import { adminDB } from "@/lib/firebaseAdmin";

// Force dynamic rendering so searchParams always work
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }) {
  const creatorApiKey = searchParams?.creator;

  /* ==========================
     Dynamic Ad Link Logic
  ========================== */
  const DEFAULT_AD_LINK =
    "https://contemplatewaryheadquarter.com/ukqgqrv4n?key=acf2a1b713094b78ec1cc21761e9b149";

  let dynamicAdLink = DEFAULT_AD_LINK;

  if (creatorApiKey) {
    try {
      const creatorSnap = await adminDB
        .collection("creators")
        .doc(creatorApiKey) // username as document ID
        .get();

      if (creatorSnap.exists) {
        const creatorData = creatorSnap.data();
        if (creatorData?.adsterraSmartlink) {
          dynamicAdLink = creatorData.adsterraSmartlink;
        }
      }
    } catch (error) {
      console.error(
        "Firestore fetch failed for creator on homepage:",
        creatorApiKey,
        error
      );
    }
  }

  /* ==========================
     Fetch Homepage API Data
  ========================== */
  const res = await fetch("https://henpro-api.vercel.app/api/homepage", {
    next: { revalidate: 3600 },
  });
  const recentEpi = await res.json();

  /* ==========================
     Fetch Latest Hompro Doc
  ========================== */
  let hompro = null;

  try {
    const homproSnap = await adminDB
      .collection("hompros")
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (!homproSnap.empty) {
      hompro = {
        id: homproSnap.docs[0].id,
        ...homproSnap.docs[0].data(),
      };
    }
  } catch (error) {
    console.error("Failed to fetch hompro:", error);
  }

  return (
    <div>
      <Home
        recentEpi={recentEpi}
        hompro={hompro}
        creator={creatorApiKey}
      />
      <Advertize initialAdLink={dynamicAdLink} />
    </div>
  );
}
