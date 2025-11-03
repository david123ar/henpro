import { connectDB } from "@/lib/mongoClient";
import CreatorProfileClient from "@/components/CreatorProfileClient/CreatorProfileClient";
import NotFound from "@/components/NotFound/NotFound";

export const dynamic = "force-dynamic";

export default async function CreatorPage({ params }) {
  const { id } = params; // this will be the username from the URL
  const db = await connectDB()

  // Fetch user by username only
  const user = await db
    .collection("users")
    .findOne({ username: id }, { projection: { password: 0 } });

  if (!user) {
    return (
      <NotFound/>
    );
  }

  const userData = JSON.parse(JSON.stringify(user));

  return <CreatorProfileClient user={userData} />; 
}
