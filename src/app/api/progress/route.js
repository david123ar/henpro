import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { adminDB } from "@/lib/firebaseAdmin";

const COLLECTION_NAME = "watchProgress";

/**
 * GET: Fetch watch progress for a specific video.
 * Query: ?contentKey=<video-id>
 */
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const contentKey = searchParams.get("contentKey");

  if (!contentKey) {
    return NextResponse.json(
      { message: "Missing contentKey" },
      { status: 400 }
    );
  }

  try {
    const progressRef = adminDB
      .collection(COLLECTION_NAME)
      .where("userId", "==", session.user.id)
      .where("contentKey", "==", contentKey)
      .limit(1);

    const snapshot = await progressRef.get();

    const progress = snapshot.docs[0]?.data() || {};

    return NextResponse.json({
      currentTime: progress.currentTime || 0,
      totalDuration: progress.totalDuration || 0,
      title: progress.title || null,
      poster: progress.poster || null,
      parentContentId: progress.parentContentId || null,
      episodeNo: progress.episodeNo || null,
    });
  } catch (error) {
    console.error("Firestore GET progress error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * POST: Saves or updates watch progress and metadata.
 */
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const {
    contentKey,
    currentTime,
    totalDuration,
    title,
    poster,
    parentContentId,
    episodeNo,
  } = await request.json();

  if (
    !contentKey ||
    currentTime === undefined ||
    totalDuration === undefined ||
    !title ||
    !poster
  ) {
    return NextResponse.json(
      {
        message:
          "Missing required metadata (contentKey, currentTime, totalDuration, title, poster)",
      },
      { status: 400 }
    );
  }

  try {
    const progressRef = adminDB
      .collection(COLLECTION_NAME)
      .doc(`${session.user.id}_${contentKey}`); // Unique ID per user+video

    await progressRef.set(
      {
        userId: session.user.id,
        contentKey,
        currentTime: Number(currentTime),
        totalDuration: Number(totalDuration),
        title,
        poster,
        parentContentId: parentContentId || null,
        episodeNo: episodeNo || null,
        updatedAt: new Date(),
      },
      { merge: true } // Upsert behavior
    );

    return NextResponse.json({ message: "Progress saved successfully" });
  } catch (error) {
    console.error("Firestore POST progress error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Clears watch progress for a specific video.
 */
export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { contentKey } = await request.json();

  if (!contentKey) {
    return NextResponse.json(
      { message: "Missing contentKey" },
      { status: 400 }
    );
  }

  try {
    const progressRef = adminDB
      .collection(COLLECTION_NAME)
      .doc(`${session.user.id}_${contentKey}`);

    await progressRef.delete();

    return NextResponse.json({ message: "Progress cleared successfully" });
  } catch (error) {
    console.error("Firestore DELETE progress error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
