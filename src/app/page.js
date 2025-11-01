// import Hero from "@/components/Hero/Hero";
import Home from "@/components/Home/Home";
import { connectDB } from "@/lib/mongoClient";
import React from "react";

export default async function page() {
  // 🧠 Fetch from API
  const res = await fetch("https://api.henpro.fun/api/homepage", {
    next: { revalidate: 3600 }, // cache for 1 hour
  });
  const recentEpi = await res.json();

  // 🧩 Connect MongoDB
  const db = await connectDB();

  // 🗂️ Fetch latest hompro document
  const homproData = await db
    .collection("hompro")
    .findOne({}, { sort: { createdAt: -1 } });

  // 🧼 Convert to plain object (remove non-serializable fields)
  const hompro = JSON.parse(JSON.stringify(homproData));

  return (
    <div>
      <Home recentEpi={recentEpi} hompro={hompro} />
    </div>
  );
}
