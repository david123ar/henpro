import bcrypt from "bcryptjs";
import { adminDB } from "@/lib/firebaseAdmin";

export const POST = async (req) => {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return new Response(
        JSON.stringify({ message: "Token and new password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 🔍 Find user with valid reset token
    const snapshot = await adminDB
      .collection("users")
      .where("resetToken", "==", token)
      .where("resetTokenExpiry", ">", new Date())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return new Response(
        JSON.stringify({ message: "Invalid or expired token" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const userDoc = snapshot.docs[0];
    const userRef = userDoc.ref;

    // 🔐 Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ✅ Update password & remove token
    await userRef.update({
      password: hashedPassword,
      resetToken: adminDB.FieldValue.delete(),
      resetTokenExpiry: adminDB.FieldValue.delete(),
    });

    return new Response(
      JSON.stringify({ message: "Password updated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
