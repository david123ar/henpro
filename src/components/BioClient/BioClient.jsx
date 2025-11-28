"use client";

import React, { useMemo } from "react";
import "./bio.css";
import { themeStyles, backgroundToTheme } from "@/styles/themeStyles";
import Link from "next/link";

const BioClient = ({ user, creator, accounts = {}, design }) => {
  // USERNAME ALWAYS LOWERCASE FOR MATCHING
  const uname = user?.username?.toLowerCase() || "";

  // ACCOUNT SELECTED FROM SERVER (already chosen)
  // accounts = { accountName: "account1", batches: [...] }
  const batches = accounts?.batches || [];

  // THEME
  const designName = design?.split("/")?.pop()?.split(".")[0];
  const themeKey = backgroundToTheme[designName] || "redWhiteBlack";
  const theme = themeStyles[themeKey];

  // -----------------------------------------
  // FLATTEN + REVERSE + FILTER + SORT
  // -----------------------------------------
  const displayedPosts = useMemo(() => {
    const now = new Date();

    // 1. Reverse batch order: 3 → 2 → 1
    const reversedBatches = [...batches].reverse();

    // 2. Reverse posts inside batch & flatten
    const allPosts = reversedBatches.flatMap(batch =>
      batch.posts ? [...batch.posts].reverse() : []
    );

    // 3. Remove future posts
    const published = allPosts.filter(p => {
      const time = new Date(p.postingTime);
      return time <= now;
    });

    // 4. Sort by latest postingTime
    published.sort((a, b) => new Date(b.postingTime) - new Date(a.postingTime));

    return published;
  }, [batches]);
  // -----------------------------------------

  return (
    <div className="page-wrapper">
      <div className="bio-page">
        <img
          src={design || "/done.jpeg"}
          alt="background"
          className="bio-background"
        />

        <div className="bio-content">
          {/* TOP AD */}
          <div
            className="bio-ad ad-top"
            style={{
              display: "flex",
              justifyContent: "center",
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
                backgroundColor: "#201f31",
              }}
            />
          </div>

          {/* AVATAR */}
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
                uname === "animearenax"
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

          {/* USERNAME */}
          <div
            className="bio-username"
            style={{
              background: theme.usernameBg,
              color: theme.usernameColor,
              boxShadow: theme.usernameShadow,
            }}
          >
            {user.username}
          </div>

          {/* BIO */}
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

          {/* POSTS */}
          <div
            className="bio-links"
            style={{
              scrollbarColor: `${theme.scrollbarThumb} transparent`,
            }}
          >
            {displayedPosts.map((item, index) => (
              <Link
                key={item.link}
                href={`/watch/${item.link}?creator=${user.username}`}
                className="bio-link"
                style={{
                  background: theme.linkBg,
                  color: theme.linkColor,
                  boxShadow: theme.linkShadow,
                  border: "1px solid rgba(255,255,255,0.3)",
                  display: "flex",
                  alignItems: "center",
                  padding: "4px",
                  height: "64px",
                  transition: "0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = theme.linkHoverBg;
                  e.currentTarget.style.boxShadow = theme.linkHoverShadow;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = theme.linkBg;
                  e.currentTarget.style.boxShadow = theme.linkShadow;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Poster */}
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    background: "#333",
                    marginRight: "12px",
                  }}
                >
                  <img
                    src={item.poster}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* Text */}
                <div
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontWeight: "600",
                    fontSize: "1.1rem",
                  }}
                >
                  #{displayedPosts.length - index} Sauce
                </div>
              </Link>
            ))}

            {displayedPosts.length === 0 && (
              <div
                style={{
                  color: theme.linkColor,
                  textAlign: "center",
                  padding: "20px",
                  opacity: 0.7,
                }}
              >
                No content published yet.
              </div>
            )}
          </div>

          {/* BOTTOM AD */}
          <div
            className="bio-ad ad-bottom"
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "10px 0",
              backgroundColor: "#201f31",
            }}
          >
            <iframe
              src="/ad"
              title="Sponsored Ad"
              scrolling="no"
              style={{
                width: "100%",
                maxWidth: "728px",
                height: "90px",
                border: "none",
                borderRadius: "10px",
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
