import React from "react";
import "./page.css";
import Footer from "@/components/footer/Footer";
import Link from "next/link";
import Randomo from "@/components/Randomo/Randomo";

export const metadata = {
  title:
    "Random Free Hentai Video Streams Online in 720p , 1080p HD - hanime.tv",
  description: `Enjoy your unlimited hentai & anime
          collection. We are the definitive source for the best curated 720p /
          1080p HD hentai videos, viewable by mobile phone and tablet, for free.`,
};

export default async function page() {
  let data = [];
  try {
    const res = await fetch(`https://vimal-two.vercel.app/api/hen-random`, {
      cache: "no-store",
    });
    data = await res.json();
  } catch (error) {
    console.error("Error fetching document:", error);
  }
  return (
    <Randomo data={data}/>
  );
}