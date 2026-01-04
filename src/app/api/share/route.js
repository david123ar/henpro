import { NextResponse } from "next/server";
import { adminDB } from "@/lib/firebaseAdmin"; // Make sure adminDB is your Firestore instance

const COLLECTION_NAME = "shares";

// ✅ GET - fetch share data
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const pageId = searchParams.get("pageId");

    if (!pageId) {
      return NextResponse.json({ error: "Missing pageId" }, { status: 400 });
    }

    const docRef = adminDB.collection(COLLECTION_NAME).doc(pageId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ shares: {}, totalShares: 0 });
    }

    return NextResponse.json(docSnap.data());
  } catch (err) {
    console.error("GET /api/share Firestore error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ POST - increment share count
export async function POST(req) {
  try {
    const { pageId, platform } = await req.json();

    if (!pageId || !platform) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const docRef = adminDB.collection(COLLECTION_NAME).doc(pageId);

    await docRef.set(
      {
        shares: {
          [platform]: adminDB.FieldValue.increment(1),
        },
        totalShares: adminDB.FieldValue.increment(1),
      },
      { merge: true } // upsert behavior
    );

    const updatedDoc = await docRef.get();

    return NextResponse.json(updatedDoc.data());
  } catch (err) {
    console.error("POST /api/share Firestore error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
