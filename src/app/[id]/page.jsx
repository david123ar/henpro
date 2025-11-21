import BioClient from "@/components/BioClient/BioClient";
import { connectDB } from "@/lib/mongoClient";

// Helper: Capitalize first letter
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Metadata
export async function generateMetadata({ params }) {
  const db = await connectDB();
  const param = await params;

  const userDoc = await db.collection("users").findOne({ username: param.id });

  // if (!userDoc) {
  //   return {
  //     title: "User Not Found | Bio Link",
  //     description: "The requested creator profile does not exist on Bio Link.",
  //   };
  // }

  const capitalizedUsername = capitalize(userDoc?.username);

  return {
    title: `${capitalizedUsername}'s Profile | Bio Link`,
    description: `Check out ${capitalizedUsername}'s profile and explore their top links, content, and more on Bio Link.`,
  };
}

// Page
export default async function BioPage({ params }) {
  const db = await connectDB();
  const param = await params;
  const username = param.id;

  // 1. Get user by username
  const userDoc = await db
    .collection("users")
    .findOne({ username: username }, { projection: { password: 0 } });

  // Handle non-existent user gracefully
  // if (!userDoc) {
  //   return (
  //     <div className="flex items-center justify-center h-screen text-white bg-black">
  //       <p>User not found</p>
  //     </div>
  //   );
  // }

  const capitalizedUsername = capitalize(userDoc?.username);

  const user = {
    id: userDoc?._id.toString(),
    email: userDoc?.email,
    username: capitalizedUsername,
    avatar: userDoc?.avatar,
    bio: userDoc?.bio || "",
    referredBy: userDoc?.referredBy || null,
  };

  // 2. Get creator details
  const creatorDoc = await db.collection("creators").findOne({ username: username });

  const creator = creatorDoc
    ? {
      username: creatorDoc?.username,
      adsterraSmartlink: creatorDoc?.adsterraSmartlink,
      creatorApiKey: creatorDoc?.creatorApiKey,
      instagramId: creatorDoc?.instagramId,
    }
    : null;

  // 3. Get Hanimelist (Replaces standard Links)
  // We query 'hanimelists' where userId matches the current user's ID string
  const userIdString = userDoc?._id.toString();

  const hanimeDocs = await db
    .collection("hanimelists")
    .find({ userId: "69206ee9338dbc93fe0d93fd" })
    .toArray();

  // Serialize data for the client component
  const hanimeList = hanimeDocs.map((doc) => ({
    ...doc,
    _id: doc._id.toString(),
    createdAt: doc.createdAt ? doc.createdAt.toISOString() : null,
    updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : null,
  }));

  // 4. Get Design (Optional: try to fetch design if it exists in links collection, otherwise default)
  const linksDoc = await db.collection("links").findOne({ _id: username });
  const design = linksDoc?.design || "";

  return (
    <BioClient
      user={user}
      creator={creator}
      hanimeList={hanimeList} // Pass the hanime list
      links={[]} // Pass empty links as fallback since we are using hanimeList
      design={design}
    />
  );
}