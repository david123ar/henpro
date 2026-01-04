import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { adminDB } from "@/lib/firebaseAdmin"; // Firestore instance

const COLLECTION_NAME = "hanimelists";
const ITEMS_PER_PAGE = 12;

const VALID_STATUSES = [
  "Watching",
  "On-Hold",
  "Plan to Watch",
  "Dropped",
  "Completed",
];

/**
 * GET: Fetch a user's watchlist with pagination and optional status filter
 * Query: ?page=<number>&type=<status>
 */
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json([]);

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("type");
  const page = parseInt(searchParams.get("page")) || 1;
  const skip = (page - 1) * ITEMS_PER_PAGE;

  try {
    const collectionRef = adminDB.collection(COLLECTION_NAME)
      .where("userId", "==", session.user.id);

    let queryRef = collectionRef;
    if (statusFilter && VALID_STATUSES.includes(statusFilter)) {
      queryRef = queryRef.where("status", "==", statusFilter);
    }

    // Firestore doesn't have skip(), so we use order + limit with cursors
    const snapshot = await queryRef
      .orderBy("updatedAt", "desc")
      .orderBy("createdAt", "desc")
      .get();

    const allItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const totalItems = allItems.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const paginatedItems = allItems.slice(skip, skip + ITEMS_PER_PAGE);

    return NextResponse.json({
      data: paginatedItems,
      page,
      totalPages,
      total: totalItems,
      perPage: ITEMS_PER_PAGE,
    });
  } catch (error) {
    console.error("Firestore GET watchlist error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * POST: Add or update an item in the user's watchlist
 * Body: { contentId, status, title, poster, contentKey, episodeNo, episodeTitle, totalDuration }
 */
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const {
    contentId,
    status,
    title,
    poster,
    contentKey,
    episodeNo,
    episodeTitle,
    totalDuration,
  } = await request.json();

  if (!contentId) return NextResponse.json({ message: "Missing contentId" }, { status: 400 });
  if (status !== null && !VALID_STATUSES.includes(status))
    return NextResponse.json({ message: "Invalid watchlist status" }, { status: 400 });

  try {
    const docRef = adminDB.collection(COLLECTION_NAME).doc(`${session.user.id}_${contentId}`);

    if (status === null) {
      await docRef.delete();
      return NextResponse.json({ message: "Item removed successfully", status: null });
    } else {
      const updateData = {
        userId: session.user.id,
        status,
        title,
        poster,
        lastEpisodeKey: contentKey,
        lastEpisodeNo: episodeNo,
        lastEpisodeTitle: episodeTitle,
        totalDuration,
        updatedAt: new Date(),
      };

      const docSnapshot = await docRef.get();
      if (!docSnapshot.exists) updateData.createdAt = new Date();

      await docRef.set(updateData, { merge: true });

      return NextResponse.json({ message: "Watchlist updated successfully", status });
    }
  } catch (error) {
    console.error("Firestore POST watchlist error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * DELETE: Remove an item from the watchlist
 * Body: { contentId }
 */
export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { contentId } = await request.json();
  if (!contentId) return NextResponse.json({ message: "Missing contentId" }, { status: 400 });

  try {
    const docRef = adminDB.collection(COLLECTION_NAME).doc(`${session.user.id}_${contentId}`);
    await docRef.delete();

    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Firestore DELETE watchlist error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
