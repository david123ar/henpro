"use client";

import React, { useEffect, useState } from "react";
import "./bio.css";
import { themeStyles, backgroundToTheme } from "@/styles/themeStyles"; // Adjust path if needed
import Link from "next/link";

const BioClient = ({ user, creator, hanimeList = [], design }) => {
  // Logic to determine the theme
  const designName = design?.split("/").pop()?.split(".")[0]; // "done" from "/done.jpg"
  const themeKey = backgroundToTheme[designName] || "redWhiteBlack";
  const theme = themeStyles[themeKey];

  // Determine the target URL (Smartlink) for the items
  // Fallback to '#' if not set, or you could map to specific item links if available
  const targetUrl = creator?.adsterraSmartlink || "#";

  return (
    <div className="page-wrapper">
      <div className="bio-page">
        <img
          src={design || "/done.jpeg"}
          alt="background"
          className="bio-background"
        />

        <div className="bio-content">
          {/* Top Ad */}
          <div
            className="bio-ad ad-top"
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

          {/* Avatar */}
          <div
            className="bio-avatar"
            style={{
              border: `3px solid ${theme.avatarBorder}`,
              boxShadow: theme.avatarShadow,
              background: "#000",
            }}
          >
            <img
              src={
                user.username.toLowerCase() === "animearenax"
                  ? "/arenax.jpg"
                  : user.avatar?.replace(
                    "https://img.flawlessfiles.com/_r/100x100/100/avatar/",
                    "https://cdn.noitatnemucod.net/avatar/100x100/"
                  ) || "/default-avatar.png"
              }
              alt="avatar"
              className="rounded-full w-24 h-24 object-cover"
            />
          </div>

          {/* Username */}
          <div
            className="bio-username"
            style={{
              background: theme.usernameBg,
              color: theme.usernameColor,
              boxShadow: theme.usernameShadow,
            }}
          >
            {user.username || "username"}
          </div>

          {/* Description */}
          <div
            className="bio-description"
            style={{
              background: theme.descriptionBg,
              color: theme.descriptionColor,
              boxShadow: theme.descriptionShadow,
            }}
          >
            {user.bio || "Check out my sauce below!"}
          </div>

          {/* Hanimelist Links (Replaces standard Links) */}
          <div
            className="bio-links"
            style={{
              scrollbarColor: `${theme.scrollbarThumb} transparent`,
            }}
          >
            {hanimeList.map((item, index) => (
              <Link
                key={item._id || index}
                href={`/watch/${item.contentId}?creator=${user.username}`}
                className="bio-link"
                // target="_blank"
                // rel="noopener noreferrer"
                style={{
                  background: theme.linkBg,
                  color: theme.linkColor,
                  boxShadow: theme.linkShadow,
                  border: "1px solid rgba(255,255,255,0.3)",
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.7)",
                  transition: "all 0.2s ease",
                  // Flex Layout for Image + Text slab
                  display: "flex",
                  alignItems: "center",
                  padding: "4px",
                  height: "64px", // Fixed height for the slab
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = theme.linkHoverBg;
                  e.currentTarget.style.boxShadow = theme.linkHoverShadow;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = theme.linkBg;
                  e.currentTarget.style.boxShadow = theme.linkShadow;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Left Image (Poster) */}
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    flexShrink: 0,
                    borderRadius: "8px",
                    overflow: "hidden",
                    backgroundColor: "#333",
                    marginRight: "12px",
                  }}
                >
                  <img
                    src={item.poster}
                    alt={`Source ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* Middle Text */}
                <div
                  style={{
                    flex: 1,
                    textAlign: "center",
                    // Compensate for the left image to center text visually relative to the whole bar
                    // Or leave as center of remaining space. 'center' usually looks best.
                    paddingRight: "12px",
                    fontWeight: "600",
                    fontSize: "1.1rem",
                  }}
                >
                  #{index + 1} Sause
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom Ads */}
          <div
            className="bio-ad ad-bottom"
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
    </div>
  );
};

export default BioClient;