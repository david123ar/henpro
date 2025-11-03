"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function CreatorProfileClient({ user }) {
  const creator = user || {
    username: "Unknown",
    avatar: "/default-avatar.png",
    bio: "No description available.",
  };

  const backgroundImageUrl = "/banner.webp"; // Your background image URL

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[100vh] text-white overflow-hidden bg-[#0b0b0b]">
      {/* 🌆 Background image */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <Image
          src={backgroundImageUrl}
          alt="Background"
          fill
          className="object-cover object-left opacity-30 sm:opacity-20 md:opacity-10 transition-opacity duration-500"
          priority
          sizes="100vw"
        />
      </div>

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>

      {/* 🔝 Top Ad */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-full max-w-4xl flex justify-center z-10 p-3">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px 0",
            backgroundColor: "#201f31",
          }}
        >
          <iframe
            src="/ad"
            title="Sponsored Ad"
            scrolling="no"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{
              width: "100%",
              maxWidth: "728px",
              height: "90px",
              border: "none",
              borderRadius: "10px",
              overflow: "hidden",
              backgroundColor: "#201f31",
            }}
          />
        </div>
      </div>

      {/* 👤 Creator Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 backdrop-blur-xl bg-[#1a1a1a]/80 border border-[#ff9741]/30 
                   shadow-[0_0_25px_rgba(255,151,65,0.25)] rounded-2xl p-8 w-full 
                   max-w-sm text-center flex flex-col items-center justify-center"
      >
        {/* Avatar */}
        <motion.img
          src={creator.avatar || "/default-avatar.png"}
          alt={creator.username}
          className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-[#ff9741] 
                     shadow-[0_0_20px_rgba(255,151,65,0.5)]"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Username */}
        <h2 className="text-2xl font-bold text-[#ff9741] mb-2 tracking-wide">
          {creator.username}
        </h2>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-6 leading-relaxed max-w-xs">
          {creator.bio ||
            "Welcome to Henpro — explore exclusive hentai content from this creator."}
        </p>

        {/* Button */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link
            href={`/?creator=${creator.username}`}
            className="bg-[#ff9741] hover:bg-[#ff7b1f] text-black font-semibold 
                       px-6 py-3 rounded-full shadow-[0_0_20px_rgba(255,151,65,0.5)] 
                       transition-all"
          >
            🍑 Watch Now
          </Link>
        </motion.div>
      </motion.div>

      {/* 🔻 Bottom Ad */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-full max-w-4xl flex justify-center z-10 p-3">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px 0",
            backgroundColor: "#201f31",
          }}
        >
          <iframe
            src="/ad"
            title="Sponsored Ad"
            scrolling="no"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{
              width: "100%",
              maxWidth: "728px",
              height: "90px",
              border: "none",
              borderRadius: "10px",
              overflow: "hidden",
              backgroundColor: "#201f31",
            }}
          />
        </div>
      </div>
    </div>
  );
}
