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

  const backgroundImageUrl = "/banner.webp";

  return (
    <div className="relative flex flex-col h-screen text-white overflow-hidden bg-[#0b0b0b]">
      {/* 🌆 Background */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src={backgroundImageUrl}
          alt="Background"
          fill
          className="object-cover object-left opacity-25 sm:opacity-20 md:opacity-10"
          priority
          sizes="100vw"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

      {/* 🔝 Top Ad (15%) */}
      <div className="flex justify-center items-center flex-[0.15] z-10">
        <div
          className="flex justify-center items-center w-full max-w-4xl h-full"
          style={{ backgroundColor: "#201f31" }}
        >
          <iframe
            src="/ad"
            title="Top Ad"
            scrolling="no"
            referrerPolicy="no-referrer-when-downgrade"
            style={{
              width: "100%",
              maxWidth: "728px",
              height: "100%",
              border: "none",
              borderRadius: "0",
              backgroundColor: "#201f31",
            }}
          />
        </div>
      </div>

      {/* 👤 Creator Card (70%) */}
      <div className="flex justify-center items-center flex-[0.7] z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative backdrop-blur-xl bg-[#1a1a1a]/80 border border-[#ff9741]/30 
                     shadow-[0_0_25px_rgba(255,151,65,0.25)] rounded-2xl p-4 sm:p-6 
                     w-[90%] max-w-sm h-[85%] text-center flex flex-col items-center justify-center"
        >
          {/* Avatar */}
          <motion.img
            src={creator.avatar || "/default-avatar.png"}
            alt={creator.username}
            className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover mb-3 border-4 border-[#ff9741] 
                       shadow-[0_0_20px_rgba(255,151,65,0.5)]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Username */}
          <h2 className="text-lg sm:text-2xl font-bold text-[#ff9741] mb-2 tracking-wide">
            {creator.username}
          </h2>

          {/* Description */}
          <p className="text-gray-300 text-xs sm:text-sm mb-4 leading-relaxed max-w-xs">
            {creator.bio ||
              "Welcome to Henpro — explore exclusive hentai content from this creator."}
          </p>

          {/* Button */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              href={`/?creator=${creator.username}`}
              className="bg-[#ff9741] hover:bg-[#ff7b1f] text-black font-semibold 
                         px-5 py-2 sm:px-6 sm:py-3 rounded-full shadow-[0_0_20px_rgba(255,151,65,0.5)] 
                         transition-all text-sm sm:text-base"
            >
              🍑 Watch Now
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* 🔻 Bottom Ad (15%) */}
      <div className="flex justify-center items-center flex-[0.15] z-10">
        <div
          className="flex justify-center items-center w-full max-w-4xl h-full"
          style={{ backgroundColor: "#201f31" }}
        >
          <iframe
            src="/ad"
            title="Bottom Ad"
            scrolling="no"
            referrerPolicy="no-referrer-when-downgrade"
            style={{
              width: "100%",
              maxWidth: "728px",
              height: "100%",
              border: "none",
              borderRadius: "0",
              backgroundColor: "#201f31",
            }}
          />
        </div>
      </div>
    </div>
  );
}
