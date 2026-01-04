import BioClient from "@/components/BioClient/BioClient";
import { adminDB } from "@/lib/firebaseAdmin";

/* =========================
   Helpers
========================= */
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* =========================
   Metadata
========================= */
export async function generateMetadata({ params }) {
  const username = params.id;

  try {
    const userSnap = await adminDB
      .collection("users")
      .doc(username)
      .get();

    if (userSnap.exists) {
      const userData = userSnap.data();
      const capitalized = capitalize(userData?.username || username);

      return {
        title: `${capitalized}'s Profile | Bio Link`,
        description: `Check out ${capitalized}'s profile and explore their content.`,
      };
    }
  } catch (_) {
    // silent fallback
  }

  return {
    title: `${capitalize(username)}'s Profile | Bio Link`,
    description: "Explore this user's Bio Link page.",
  };
}

/* =========================
   Page
========================= */
export default async function BioPage({ params }) {
  const username = params.id;

  /* =========================
     1. USER
  ========================= */
  let userSnap = null;
  try {
    userSnap = await adminDB
      .collection("users")
      .doc(username)
      .get();
  } catch (_) {}

  const userData = userSnap?.exists ? userSnap.data() : null;

  const user = userData
    ? {
        id: userSnap.id,
        email: userData.email || "",
        username: capitalize(userData.username),
        avatar: userData.avatar || "",
        bio: userData.bio || "",
        referredBy: userData.referredBy || null,
      }
    : {
        id: "",
        email: "",
        username: capitalize(username),
        avatar: "",
        bio: "",
        referredBy: null,
      };

  /* =========================
     2. CREATOR
  ========================= */
  let creator = null;

  try {
    const creatorSnap = await adminDB
      .collection("creators")
      .doc(username)
      .get();

    if (creatorSnap.exists) {
      const data = creatorSnap.data();
      creator = {
        username,
        adsterraSmartlink: data.adsterraSmartlink || "",
        creatorApiKey: data.creatorApiKey || "",
        instagramId: data.instagramId || "",
      };
    }
  } catch (_) {}

  /* =========================
     3. ACCOUNTS
  ========================= */
  let accountsDoc = null;

  try {
    const snap = await adminDB
      .collection("accounts")
      .doc("main") // single document pattern
      .get();

    if (snap.exists) {
      accountsDoc = snap.data();
    }
  } catch (_) {}

  let selectedAccount = "account1";
  if (username === "SauseKing") selectedAccount = "account2";
  if (username === "SauseLord") selectedAccount = "account3";

  const accountData = accountsDoc?.[selectedAccount] || [];

  const accounts = {
    accountName: selectedAccount,
    batches: accountData.map((batch) => ({
      batch: batch.batch || "",
      startDate: batch.startDate || null,
      posts: (batch.posts || [])
        .map((post) => ({
          ...post,
          postingTime: post.postingTime
            ? new Date(post.postingTime).toISOString()
            : null,
        }))
        .reverse(),
    })),
  };

  /* =========================
     4. DESIGN
  ========================= */
  let design = "";

  try {
    const linksSnap = await adminDB
      .collection("links")
      .doc(username)
      .get();

    if (linksSnap.exists) {
      design = linksSnap.data()?.design || "";
    }
  } catch (_) {}

  /* =========================
     Render
  ========================= */
  return (
    <BioClient
      user={user}
      creator={creator}
      accounts={accounts}
      design={design}
    />
  );
}
