import { hash } from "bcryptjs";
import { adminDB } from "@/lib/firebaseAdmin";
import { imageData } from "@/data/imageData";

/* =========================
   Helpers
========================= */
const getRandomImage = () => {
  const categories = Object.keys(imageData.hashtags);
  const randomCategory =
    categories[Math.floor(Math.random() * categories.length)];
  const images = imageData.hashtags[randomCategory].images;
  return images[Math.floor(Math.random() * images.length)];
};

/* =========================
   POST: Register User
========================= */
export async function POST(req) {
  try {
    const { email, username, password } = await req.json();

    if (!email || !username || !password) {
      return Response.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const emailKey = email.toLowerCase().trim();
    const usernameKey = username.trim();

    /* =========================
       1. Email uniqueness
    ========================= */
    const userRef = adminDB.collection("users").doc(emailKey);
    const userSnap = await userRef.get();

    if (userSnap.exists) {
      return Response.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }

    /* =========================
       2. Username uniqueness
    ========================= */
    const usernameQuery = await adminDB
      .collection("users")
      .where("username", "==", usernameKey)
      .limit(1)
      .get();

    if (!usernameQuery.empty) {
      return Response.json(
        { message: "Username already taken" },
        { status: 400 }
      );
    }

    /* =========================
       3. Create User
    ========================= */
    const hashedPassword = await hash(password, 10);
    const avatar = getRandomImage();
    const timeOfJoining = Date.now(); // store as timestamp (ms)

    await userRef.set({
      email: emailKey,
      username: usernameKey,
      password: hashedPassword,
      avatar,
      bio: "",
      timeOfJoining,
    });

    return Response.json(
      {
        message: "User registered successfully",
        avatar,
        timeOfJoining,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);

    return Response.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}
