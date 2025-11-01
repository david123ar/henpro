import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path as necessary
import { connectDB } from "@/lib/mongoClient"; // Adjust path as necessary

// Define the collection for storing monetization details
const CREATOR_COLLECTION = "creators";

/**
 * GET handler: Retrieves the creator's monetization setup data.
 * Used by the frontend (MonetizeContent component) to check setup status.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    // If no session, they shouldn't even reach the authenticated part of the dashboard
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await connectDB();
    const creatorSetup = await db.collection(CREATOR_COLLECTION).findOne(
      { userId: userId }, // Query by the authenticated user's ID
      { projection: { _id: 0, adsterraSmartlink: 1, creatorApiKey: 1, instagramId: 1 } }
    );

    // If data is found, return it. If not found (null), it means setup hasn't been done yet.
    return NextResponse.json({ setup: creatorSetup }, { status: 200 });

  } catch (err) {
    console.error("GET Creator Setup DB Error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * POST handler: Saves or updates the creator's monetization setup data.
 * Called when the user clicks 'Complete Setup & Save' in the frontend.
 */
export async function POST(request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { adsterraSmartlink, creatorApiKey, instagramId } = await request.json();

    // Basic Validation
    if (!adsterraSmartlink || !creatorApiKey) {
      return NextResponse.json(
        { message: "Smartlink and API Key are required." },
        { status: 400 }
      );
    }

    const db = await connectDB();
    
    // Data to be inserted/updated
    const updateData = {
      $set: {
        userId: userId, // Link to the user
        adsterraSmartlink: adsterraSmartlink,
        creatorApiKey: creatorApiKey,
        instagramId: instagramId || null, // Allow Instagram ID to be optional
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    };

    // Use upsert to either update an existing document or insert a new one
    const result = await db.collection(CREATOR_COLLECTION).updateOne(
      { userId: userId },
      updateData,
      { upsert: true }
    );

    return NextResponse.json(
      { message: "Monetization setup saved successfully.", setupStatus: result.upsertedId ? "created" : "updated" },
      { status: 200 }
    );
  } catch (err) {
    console.error("POST Creator Setup DB Error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}