// app/api/creator/monetization/route.js

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { adminDB } from "@/lib/firebaseAdmin";

const CREATOR_COLLECTION = "creators";

/* ======================================================
   GET: Fetch creator monetization setup
====================================================== */
export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const snap = await adminDB
      .collection(CREATOR_COLLECTION)
      .where("userId", "==", userId)
      .limit(1)
      .get();

    if (snap.empty) {
      return NextResponse.json({ setup: null }, { status: 200 });
    }

    const doc = snap.docs[0].data();

    return NextResponse.json(
      {
        setup: {
          adsterraSmartlink: doc.adsterraSmartlink || "",
          creatorApiKey: doc.creatorApiKey || "",
          instagramId: doc.instagramId || null,
          username: doc.username || "",
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET Creator Setup Firestore Error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* ======================================================
   POST: Create / Update creator monetization setup
====================================================== */
export async function POST(request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const username = session?.user?.username;

  if (!userId || !username) {
    return NextResponse.json(
      { message: "Unauthorized or missing user data" },
      { status: 401 }
    );
  }

  try {
    const { adsterraSmartlink, creatorApiKey, instagramId } =
      await request.json();

    if (!adsterraSmartlink || !creatorApiKey) {
      return NextResponse.json(
        { message: "Smartlink and API Key are required." },
        { status: 400 }
      );
    }

    // Use userId as document ID (best practice)
    const ref = adminDB
      .collection(CREATOR_COLLECTION)
      .doc(userId);

    const now = Date.now();

    await ref.set(
      {
        userId,
        username,
        adsterraSmartlink,
        creatorApiKey,
        instagramId: instagramId || null,
        updatedAt: now,
        createdAt: now,
      },
      { merge: true } // 🔑 Acts like Mongo upsert
    );

    return NextResponse.json(
      {
        message: "Monetization setup saved successfully.",
        setupStatus: "saved",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("POST Creator Setup Firestore Error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
