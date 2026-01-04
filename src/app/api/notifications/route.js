import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { adminDB } from "@/lib/firebaseAdmin";

const NOTIFICATION_COLLECTION = "userNotifications";
const USER_COLLECTION = "users";

export async function GET() {
  const session = await getServerSession(authOptions);
  const recipientId = session?.user?.id;

  if (!recipientId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    /* ===============================
       1. Fetch notifications
    =============================== */
    const notificationSnap = await adminDB
      .collection(NOTIFICATION_COLLECTION)
      .where("recipientId", "==", recipientId)
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const notificationsRaw = [];
    const senderIds = new Set();

    notificationSnap.forEach((doc) => {
      const data = doc.data();
      notificationsRaw.push({
        id: doc.id,
        ...data,
      });

      if (data.senderId) senderIds.add(data.senderId);
    });

    /* ===============================
       2. Fetch sender user details
    =============================== */
    const senderMap = {};

    if (senderIds.size > 0) {
      const userQueries = [...senderIds].map((id) =>
        adminDB.collection(USER_COLLECTION).doc(id).get()
      );

      const userDocs = await Promise.all(userQueries);

      userDocs.forEach((doc) => {
        if (doc.exists) {
          senderMap[doc.id] = doc.data();
        }
      });
    }

    /* ===============================
       3. Merge & format response
    =============================== */
    const notifications = notificationsRaw.map((n) => {
      const sender = senderMap[n.senderId] || {};

      return {
        id: n.id,
        type: n.type,
        contentId: n.contentId || null,
        commentId: n.commentId || null,
        replyId: n.replyId || null,
        read: n.read || false,
        createdAt: n.createdAt || null,
        senderId: n.senderId || null,
        senderName: sender.username || null,
        senderImage: sender.image || null,
      };
    });

    return NextResponse.json({ notifications }, { status: 200 });
  } catch (err) {
    console.error("Firestore Error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
