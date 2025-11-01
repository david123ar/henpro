// app/api/content/comments/like/route.js

import { NextResponse } from "next/server";
// Import the core PATCH handler from the main route file
import { PATCH as handleInteractionPatch } from "../route"; 

/**
 * POST: Toggle the 'like' status for a comment.
 * This reuses the logic from the main PATCH handler.
 */
export async function POST(request) {
  try {
    const { commentId } = await request.json();

    if (!commentId) {
      return NextResponse.json(
        { message: "Missing commentId" },
        { status: 400 }
      );
    }

    // Create a mock Request object for the imported PATCH handler
    const mockRequest = {
      ...request,
      json: async () => ({
        commentId,
        action: "like", // Explicitly set the action
      }),
    };

    // Call the existing PATCH logic
    const response = await handleInteractionPatch(mockRequest);
    return response;
  } catch (error) {
    console.error("Like API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error during like operation" },
      { status: 500 }
    );
  }
}