// monetize.js

import MonetizeContent from "@/components/MonetizeContent/MonetizeContent";
// import { SessionProvider } from "next-auth/react";

// ----------------------------------------------------
// THE DEFAULT EXPORT WRAPPED WITH SessionProvider
// This is what you would import if you need the SessionProvider

export async function generateMetadata() {
  return {
    title:
      "Monetize Your Creator Profile | Earn Money from Views & Traffic - Henpro",
    description:
      "Join Henpro's monetization program and start earning from your content. Connect your Adsterra Smart Link and API key, track analytics, and get paid for every view you bring.",
    openGraph: {
      title: "Monetize Your Henpro Creator Profile | Earn from Views & Clicks",
      description:
        "Set up your Adsterra Smart Link and API integration to start earning. Real-time analytics, payout tracking, and easy setup for all creators on Henpro.",
      url: "https://henpro.fun/monetize",
      type: "website",
      siteName: "Henpro",
      // images: [
      //   {
      //     url: "https://henpro.fun/og/monetize-banner.jpg",
      //     width: 1200,
      //     height: 630,
      //     alt: "Henpro Monetization Dashboard",
      //   },
      // ],
    },
    // twitter: {
    //   card: "summary_large_image",
    //   title: "Henpro Creator Monetization | Earn from Your Content",
    //   description:
    //     "Link your Adsterra account and start earning from your Henpro creator profile with live analytics and payouts.",
    //   images: ["https://henpro.fun/og/monetize-banner.jpg"],
    // },
    keywords: [
      "henpro",
      "henpro monetization",
      "creator earnings",
      "adsterra smart link",
      "henpro dashboard",
      "earn money online",
      "creator program",
      "henpro analytics",
    ],
    alternates: {
      canonical: "https://henpro.fun/monetize",
    },
  };
}

// ----------------------------------------------------
export default async function Monetize({searchParams}) {
  const creatorApiKey = searchParams.creator; // ✨ Get the creator API key

  // --- Start Dynamic Ad Link Logic ---
  const DEFAULT_AD_LINK =
    "https://www.revenuecpmgate.com/d3j8c16q?key=c843c816558b4282950c88ec718cf1ea";
  let dynamicAdLink = DEFAULT_AD_LINK;

  if (creatorApiKey) {
    try {
      // 1. Connect to MongoDB
      const db = await connectDB();
      // Assuming your collection is named 'creators'
      const collection = db.collection("creators");

      // 2. Fetch the creator data
      const creatorData = await collection.findOne(
        { username: creatorApiKey },
        // Project to only include the smartlink for efficiency
        { projection: { adsterraSmartlink: 1, _id: 0 } }
      );

      // 3. Update the ad link if found
      if (creatorData && creatorData.adsterraSmartlink) {
        dynamicAdLink = creatorData.adsterraSmartlink;
      }
    } catch (error) {
      console.error("MongoDB fetch failed for creator:", creatorApiKey, error);
      // It will fall back to DEFAULT_AD_LINK
    }
  }
  // --- End Dynamic Ad Link Logic ---
  // You can pass the session prop if you are fetching the session on the server
  // return <SessionProvider session={pageProps.session}> <MonetizeContent /> </SessionProvider>

  // For a simple client-side component, we just wrap it
  return <MonetizeContent creator={creatorApiKey} />;
}
