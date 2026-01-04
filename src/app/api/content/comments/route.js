// app/api/content/comments/route.js

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { adminDB, FieldValue } from "@/lib/firebaseAdmin";

const COLLECTION_NAME = "contentComments";
const NOTIFICATION_COLLECTION_NAME = "userNotifications";
const COMMENTS_PER_PAGE = 10;

/* ======================================================
   Helper: Build nested replies (Firestore)
====================================================== */
function buildNestedTree(comments, parentId = null, sortOrder = "latest") {
  const children = comments
    .filter(c => c.parentId === parentId)
    .sort((a, b) => {
      if (sortOrder === "oldest") return a.createdAt - b.createdAt;
      return b.createdAt - a.createdAt;
    })
    .map(comment => ({
      ...comment,
      replies: buildNestedTree(comments, comment.id, sortOrder),
    }));

  return children;
}

/* ======================================================
   GET COMMENTS
====================================================== */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const contentId = searchParams.get("contentId");
  const page = parseInt(searchParams.get("page")) || 1;
  const sort = searchParams.get("sort") || "latest";

  if (!contentId) {
    return NextResponse.json({ message: "Missing contentId" }, { status: 400 });
  }

  try {
    const snapshot = await adminDB
      .collection(COLLECTION_NAME)
      .where("contentId", "==", contentId)
      .get();

    let allComments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      likesCount: doc.data().likes?.length || 0,
      dislikesCount: doc.data().dislikes?.length || 0,
      repliesCount: doc.data().replies?.length || 0,
    }));

    // Top-level only
    let topLevel = allComments.filter(c => c.parentId === null);

    // Sorting
    if (sort === "oldest") {
      topLevel.sort((a, b) => a.createdAt - b.createdAt);
    } else if (sort === "most_likes") {
      topLevel.sort((a, b) => b.likesCount - a.likesCount);
    } else if (sort === "most_dislikes") {
      topLevel.sort((a, b) => b.dislikesCount - a.dislikesCount);
    } else if (sort === "most_replies") {
      topLevel.sort((a, b) => b.repliesCount - a.repliesCount);
    } else {
      topLevel.sort((a, b) => b.createdAt - a.createdAt);
    }

    const totalPages = Math.ceil(topLevel.length / COMMENTS_PER_PAGE);
    const paginated = topLevel.slice(
      (page - 1) * COMMENTS_PER_PAGE,
      page * COMMENTS_PER_PAGE
    );

    const nested = paginated.map(comment => ({
      ...comment,
      replies: buildNestedTree(allComments, comment.id, sort),
    }));

    return NextResponse.json({
      data: nested,
      page,
      totalPages,
      total: allComments.length,
      perPage: COMMENTS_PER_PAGE,
    });
  } catch (err) {
    console.error("Firestore GET error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/* ======================================================
   POST: TOP-LEVEL COMMENT
====================================================== */
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { contentId, text } = await request.json();
  if (!contentId || !text?.trim()) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  try {
    const ref = adminDB.collection(COLLECTION_NAME).doc();

    const comment = {
      contentId,
      userId: session.user.id,
      userName: session.user.username || session.user.name || "Anonymous",
      userImage: session.user.avatar || session.user.image || "/default-avatar.png",
      text: text.trim(),
      createdAt: Date.now(),
      parentId: null,
      rootCommentId: ref.id,
      likes: [],
      dislikes: [],
      replies: [],
    };

    await ref.set(comment);

    return NextResponse.json(
      { message: "Comment added", comment: { id: ref.id, ...comment } },
      { status: 201 }
    );
  } catch (err) {
    console.error("Firestore POST error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/* ======================================================
   PATCH: LIKE / DISLIKE
====================================================== */
export async function PATCH(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { commentId, action } = await request.json();
  const userId = session.user.id;

  if (!commentId || !["like", "dislike"].includes(action)) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  try {
    const ref = adminDB.collection(COLLECTION_NAME).doc(commentId);
    const snap = await ref.get();

    if (!snap.exists) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 });
    }

    const comment = snap.data();
    const isSelf = comment.userId === userId;

    let update = {};
    let notificationType = null;

    if (action === "like") {
      update = {
        likes: comment.likes?.includes(userId)
          ? FieldValue.arrayRemove(userId)
          : FieldValue.arrayUnion(userId),
        dislikes: FieldValue.arrayRemove(userId),
      };
      if (!isSelf && !comment.likes?.includes(userId)) notificationType = "LIKE";
    }

    if (action === "dislike") {
      update = {
        dislikes: comment.dislikes?.includes(userId)
          ? FieldValue.arrayRemove(userId)
          : FieldValue.arrayUnion(userId),
        likes: FieldValue.arrayRemove(userId),
      };
      if (!isSelf && !comment.dislikes?.includes(userId)) notificationType = "DISLIKE";
    }

    await ref.update(update);

    if (notificationType) {
      await adminDB.collection(NOTIFICATION_COLLECTION_NAME).add({
        recipientId: comment.userId,
        senderId: userId,
        type: notificationType,
        contentId: comment.contentId,
        commentId,
        read: false,
        createdAt: Date.now(),
      });
    }

    return NextResponse.json({ message: "Updated" });
  } catch (err) {
    console.error("Firestore PATCH error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/* ======================================================
   DELETE: COMMENT + ALL REPLIES
====================================================== */
export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { commentId } = await request.json();
  if (!commentId) {
    return NextResponse.json({ message: "Missing commentId" }, { status: 400 });
  }

  try {
    const snapshot = await adminDB
      .collection(COLLECTION_NAME)
      .where("rootCommentId", "==", commentId)
      .get();

    const batch = adminDB.batch();

    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    batch.delete(adminDB.collection(COLLECTION_NAME).doc(commentId));

    await batch.commit();

    return NextResponse.json({ message: "Comment thread deleted" });
  } catch (err) {
    console.error("Firestore DELETE error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
