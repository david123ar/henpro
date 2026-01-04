// app/api/content/comments/reply/route.js

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { adminDB, FieldValue } from "@/lib/firebaseAdmin";

const COLLECTION_NAME = "contentComments";
const NOTIFICATION_COLLECTION_NAME = "userNotifications";

/**
 * POST: Add a new reply to an existing comment (Firestore)
 * Body: { contentId, text, parentCommentId }
 */
export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "You must be logged in to reply." },
      { status: 401 }
    );
  }

  const { contentId, text, parentCommentId } = await request.json();

  if (!contentId || !text || text.trim().length === 0 || !parentCommentId) {
    return NextResponse.json(
      { message: "Comment text, content ID, and parent ID are required." },
      { status: 400 }
    );
  }

  try {
    const commentsRef = adminDB.collection(COLLECTION_NAME);
    const parentRef = commentsRef.doc(parentCommentId);

    // 1️⃣ Fetch parent comment
    const parentSnap = await parentRef.get();

    if (!parentSnap.exists) {
      return NextResponse.json(
        { message: "Parent comment not found." },
        { status: 404 }
      );
    }

    const parentComment = parentSnap.data();

    const recipientId = parentComment.userId;
    const isSelfReply = recipientId === session.user.id;

    const rootCommentId =
      parentComment.rootCommentId || parentSnap.id;

    // 2️⃣ Create reply document
    const replyRef = commentsRef.doc();

    const newReply = {
      contentId,
      userId: session.user.id,
      userName:
        session.user.username ||
        session.user.name ||
        "Anonymous",
      userImage:
        session.user.avatar ||
        session.user.image ||
        "/default-avatar.png",
      text: text.trim(),
      createdAt: new Date(),
      parentId: parentSnap.id,
      rootCommentId: rootCommentId,
      likes: [],
      dislikes: [],
      replies: [],
    };

    // 3️⃣ Save reply
    await replyRef.set(newReply);

    // 4️⃣ Update parent comment replies (prepend like Mongo `$position: 0`)
    await parentRef.update({
      replies: FieldValue.arrayUnion(replyRef.id),
    });

    // 5️⃣ Create notification (if not self reply)
    if (!isSelfReply) {
      await adminDB
        .collection(NOTIFICATION_COLLECTION_NAME)
        .add({
          recipientId,
          senderId: session.user.id,
          type: "REPLY",
          contentId,
          commentId: parentSnap.id,
          replyId: replyRef.id,
          read: false,
          createdAt: new Date(),
        });
    }

    // 6️⃣ Return reply
    return NextResponse.json(
      {
        message: "Reply posted successfully",
        reply: {
          id: replyRef.id,
          ...newReply,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Firestore Error on POST reply:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
