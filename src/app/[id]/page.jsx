import BioClient from "@/components/BioClient/BioClient";
import { connectDB } from "@/lib/mongoClient";

// Capitalize helper
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Metadata
export async function generateMetadata({ params }) {
  const db = await connectDB();
  const param = await params;

  const userDoc = await db.collection("users").findOne({ username: param.id });

  const capitalizedUsername = capitalize(userDoc?.username);

  return {
    title: `${capitalizedUsername || "User"}'s Profile | Bio Link`,
    description: `Check out ${capitalizedUsername}'s profile and explore their best content and links on Bio Link.`,
  };
}

// PAGE
export default async function BioPage({ params }) {
  const db = await connectDB();
  const username = params.id;

  // 1. User
  const userDoc = await db
    .collection("users")
    .findOne({ username }, { projection: { password: 0 } });

  if (!userDoc) {
    return (
      <div className="flex items-center justify-center h-screen text-white bg-black">
        <p>User not found</p>
      </div>
    );
  }

  const user = {
    id: userDoc._id.toString(),
    email: userDoc.email,
    username: capitalize(userDoc.username),
    avatar: userDoc.avatar,
    bio: userDoc.bio || "",
    referredBy: userDoc.referredBy || null,
  };

  // 2. Creator
  const creatorDoc = await db.collection("creators").findOne({ username });

  const creator = creatorDoc
    ? {
        username: creatorDoc.username,
        adsterraSmartlink: creatorDoc.adsterraSmartlink,
        creatorApiKey: creatorDoc.creatorApiKey,
        instagramId: creatorDoc.instagramId,
      }
    : null;

  // 3. Accounts
  const accountsDoc = await db.collection("accounts").findOne({});

  // Select account
  let selectedAccount = "account1";
  if (username === "SauseKing") selectedAccount = "account2";
  if (username === "SauseLord") selectedAccount = "account3";

  // Extract that account data
  const accountData = accountsDoc?.[selectedAccount] || [];

  // Format posts
  const accounts = {
    accountName: selectedAccount,
    batches: accountData.map((batch) => ({
      batch: batch.batch,
      startDate: batch.startDate,
      posts: batch.posts
        .map((post) => ({
          ...post,
          postingTime: post.postingTime
            ? new Date(post.postingTime).toISOString()
            : null,
        }))
        .reverse(), // REVERSED FIX
    })),
  };

  // 4. Design
  const linksDoc = await db.collection("links").findOne({ _id: username });
  const design = linksDoc?.design || "";

  return (
    <BioClient
      user={user}
      creator={creator}
      accounts={accounts}
      design={design}
    />
  );
}
