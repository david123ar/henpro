import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { adminDB } from "@/lib/firebaseAdmin";

const NOTIFICATION_COLLECTION = "userNotifications";

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const notificationId = params.id;
  const userId = session.user.id;

  try {
    const notifRef = adminDB
      .collection(NOTIFICATION_COLLECTION)
      .doc(notificationId);

    const notifSnap = await notifRef.get();

    if (!notifSnap.exists) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const notifData = notifSnap.data();

    // 🔐 Ensure only the recipient can update
    if (notifData.recipientId !== userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await notifRef.update({ read: true });

    return NextResponse.json({ message: "Marked as read" }, { status: 200 });
  } catch (error) {
    console.error("Firestore PATCH error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
