import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { adminDB } from "@/lib/firebaseAdmin";

const COLLECTION_NAME = "watchProgress";

/**
 * GET: Fetch the list of watch progress for the current user
 * Used by the 'Continue Watching' component.
 */
export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const progressRef = adminDB
      .collection(COLLECTION_NAME)
      .where("userId", "==", userId)
      .orderBy("updatedAt", "desc");

    const snapshot = await progressRef.get();

    const adaptedList = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        contentKey: data.contentKey,
        userId: data.userId, // Useful for debugging
        currentTime: data.currentTime || 0,
        totalDuration: data.totalDuration || 0,
        title: data.title || "Unknown Title",
        poster: data.poster || "placeholder.jpg",
        parentContentId: data.parentContentId || null,
        episodeNo: data.episodeNo,
      };
    });

    return NextResponse.json(adaptedList, { status: 200 });
  } catch (error) {
    console.error("Firestore GET progress list error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
