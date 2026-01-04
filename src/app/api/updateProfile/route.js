import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { adminDB } from "@/lib/firebaseAdmin"; // Firestore instance
import { hash } from "bcryptjs";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 403 });
    }

    const body = await req.json();
    const { userId, email, username, password, avatar } = body;

    // Ensure the user is updating their own profile
    if (session.user.id !== userId) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 403 });
    }

    const updateData = {};
    if (email) updateData.email = email;
    if (username) updateData.username = username;
    if (avatar) updateData.avatar = avatar;
    if (password && password.trim() !== "") {
      updateData.password = await hash(password, 10); // Only hash if password is provided
    }

    // If no changes, return early
    if (Object.keys(updateData).length === 0) {
      return new Response(JSON.stringify({ message: "No changes detected" }), { status: 400 });
    }

    // Firestore: update user document
    const userRef = adminDB.collection("users").doc(userId);
    await userRef.update(updateData);

    // Update session object (optional, only for server-side use)
    if (avatar) session.user.avatar = avatar;
    if (email) session.user.email = email;
    if (username) session.user.username = username;

    return new Response(JSON.stringify({ message: "Profile updated successfully" }), { status: 200 });

  } catch (error) {
    console.error("Firestore profile update error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}
