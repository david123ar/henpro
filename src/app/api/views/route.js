// /app/api/views/route.js
import { NextResponse } from "next/server";
import { adminDB } from "@/lib/firebaseAdmin"; // Firestore instance

const CONTENT_COLLECTION_NAME = "hanimeViews";

/**
 * POST: Increment view count for a contentKey
 * Body: { contentKey }
 */
export async function POST(request) {
  const { contentKey } = await request.json();

  if (!contentKey) {
    return NextResponse.json({ message: "Missing contentKey" }, { status: 400 });
  }

  try {
    const docRef = adminDB.collection(CONTENT_COLLECTION_NAME).doc(contentKey);

    // Atomically increment the views counter
    await docRef.set(
      { views: adminDB.FieldValue.increment(1) },
      { merge: true }
    );

    // Fetch the updated count
    const updatedDoc = await docRef.get();
    const views = updatedDoc.data()?.views || 1;

    return NextResponse.json(
      { message: "View recorded successfully", views },
      { status: 200 }
    );
  } catch (error) {
    console.error("Firestore POST view error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * GET: Retrieve current view count for a contentKey
 * Query: ?contentKey=<contentKey>
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const contentKey = searchParams.get("contentKey");

  if (!contentKey) {
    return NextResponse.json({ message: "Missing contentKey" }, { status: 400 });
  }

  try {
    const docRef = adminDB.collection(CONTENT_COLLECTION_NAME).doc(contentKey);
    const docSnapshot = await docRef.get();

    const views = docSnapshot.exists ? docSnapshot.data()?.views || 0 : 0;

    return NextResponse.json({ views }, { status: 200 });
  } catch (error) {
    console.error("Firestore GET views error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
