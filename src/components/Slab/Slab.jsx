"use client";
import React from "react";
import { FaBell, FaCog, FaHeart, FaHistory, FaUser } from "react-icons/fa";
import Link from "next/link";
import "./slab.css";
import { useSession } from "next-auth/react";
import { FaSackDollar } from "react-icons/fa6";

export default function Slab(props) {
  const { data: session } = useSession();

  // Use the same avatar replacement logic as the Navbar to ensure the image loads
  const avatarSrc =
    session?.user?.avatar?.replace(
      "https://img.flawlessfiles.com/_r/100x100/100/avatar/",
      "https://cdn.noitatnemucod.net/avatar/100x100/"
    ) || "/default-banner.jpg"; // Fallback to a default banner image

  return (
    <div className="profile-slab-header">
      {/* Background Image: Used for the blurred effect */}
      <img
        className="slab-background-img"
        src={avatarSrc}
        alt="User Profile Background"
      />

      {/* Content Container (sits above the blurred background) */}
      <div className="slab-content">
        <h1 className="slab-greeting">
          Hi, {session?.user?.username || "Guest"}
        </h1>

        {/* Navigation Links */}
        <div className="slab-nav-links">
          <Link
            href={`/user/profile${
              props.refer ? `?refer=${props.refer}` : `?refer=weebsSecret`
            }`}
            className={`nav-link-item ${
              props.slabId === "profile" ? "active-link" : ""
            }`}
          >
            <div className="nav-icon">
              <FaUser />
            </div>
            <div className="nav-label">Profile</div>
          </Link>

          <Link
            href={`/user/continue-watching${
              props.refer ? `?refer=${props.refer}` : `?refer=weebsSecret`
            }`}
            className={`nav-link-item ${
              props.slabId === "continue watching" ? "active-link" : ""
            }`}
          >
            <div className="nav-icon">
              <FaHistory />
            </div>
            <div className="nav-label">Watching</div>
          </Link>

          <Link
            href={`/user/watch-list${
              props.refer ? `?refer=${props.refer}` : `?refer=weebsSecret`
            }`}
            className={`nav-link-item ${
              props.slabId === "watch list" ? "active-link" : ""
            }`}
          >
            <div className="nav-icon">
              <FaHeart />
            </div>
            <div className="nav-label">Watch List</div>
          </Link>

          <Link
            href={`/user/notification${
              props.refer ? `?refer=${props.refer}` : `?refer=weebsSecret`
            }`}
            className={`nav-link-item ${
              props.slabId === "notification" ? "active-link" : ""
            }`}
          >
            <div className="nav-icon">
              <FaBell />
            </div>
            <div className="nav-label">Notifications</div>
          </Link>

          {/* <Link
            href={`/user/settings${
              props.refer ? `?refer=${props.refer}` : `?refer=weebsSecret`
            }`}
            className={`nav-link-item ${
              props.slabId === "settings" ? "active-link" : ""
            }`}
          >
            <div className="nav-icon">
              <FaCog />
            </div>
            <div className="nav-label">Settings</div>
          </Link> */}

          <Link
            href={`/monetize${
              props.refer ? `?refer=${props.refer}` : `?refer=weebsSecret`
            }`}
            className={`nav-link-item ${
              props.slabId === "monetize" ? "active-link" : ""
            }`}
          >
            <div className="nav-icon monetize-icon">
              <FaSackDollar />
            </div>
            <div className="nav-label">Monetize</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
