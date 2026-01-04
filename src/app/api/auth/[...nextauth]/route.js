import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
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
   Auth Options
========================= */
export const authOptions = {
  session: {
    strategy: "jwt", // ✅ REQUIRED for Firestore
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        username: { label: "Username", type: "text" },
        avatar: { label: "Avatar", type: "text" },
        bio: { label: "Bio", type: "text" },
        profileUpdate: { label: "Profile Update", type: "checkbox" },
      },

      async authorize(credentials) {
        const email = credentials.email;
        if (!email) throw new Error("EMAIL_REQUIRED");

        const userRef = adminDB.collection("users").doc(email);
        const userSnap = await userRef.get();

        if (!userSnap.exists) {
          const error = new Error("USER_NOT_FOUND");
          error.code = "USER_NOT_FOUND";
          throw error;
        }

        const user = userSnap.data();

        /* =========================
           PROFILE UPDATE FLOW
        ========================= */
        if (credentials.profileUpdate === "true") {
          const updatedUser = {
            username: credentials.username || user.username,
            avatar: credentials.avatar || user.avatar,
            bio: credentials.bio || user.bio,
          };

          await userRef.update(updatedUser);

          const avatar = updatedUser.avatar || getRandomImage();

          return {
            id: userSnap.id,
            email,
            username: updatedUser.username,
            avatar,
            bio: updatedUser.bio || "",
            timeOfJoining: user.timeOfJoining,
          };
        }

        /* =========================
           LOGIN FLOW
        ========================= */
        const isValid = await compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          const error = new Error("INVALID_CREDENTIALS");
          error.code = "INVALID_CREDENTIALS";
          throw error;
        }

        let avatar = user.avatar;
        if (!avatar) {
          avatar = getRandomImage();
          await userRef.update({ avatar });
        }

        return {
          id: userSnap.id,
          email,
          username: user.username,
          avatar,
          bio: user.bio || "",
          timeOfJoining: user.timeOfJoining,
        };
      },
    }),
  ],

  /* =========================
     Callbacks
  ========================= */
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.avatar = user.avatar;
        token.bio = user.bio || "";
        token.timeOfJoining = user.timeOfJoining;
      }

      if (trigger === "update" && session) {
        if (session.username) token.username = session.username;
        if (session.avatar) token.avatar = session.avatar;
        if (session.bio !== undefined) token.bio = session.bio;
        if (session.email) token.email = session.email;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.username = token.username;
      session.user.avatar = token.avatar;
      session.user.bio = token.bio || "";
      session.user.timeOfJoining = token.timeOfJoining;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

/* =========================
   Handler
========================= */
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
