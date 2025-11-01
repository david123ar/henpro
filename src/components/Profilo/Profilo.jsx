"use client";
import React, { useState } from "react";
import "./profilo.css";
import {
  FaArrowRight,
  FaBell,
  FaCog,
  FaHeart,
  FaHistory,
  FaUser,
} from "react-icons/fa";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaSackDollar } from "react-icons/fa6";

export default function Profilo(props) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    setLoading(true);
    router.refresh();
    try {
      await signOut({ redirect: false });
      // Close the profile dropdown after successful sign out
      props.setProfiIsOpen(false);
    } catch (err) {
      setError("Error signing out: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Prevent closing the dropdown when clicking inside it
  const handleDropdownClick = (e) => {
    e.stopPropagation();
  };

  // Use a sensible default avatar if session or avatar is missing
  const avatarSrc =
    session?.user?.avatar?.replace(
      "https://img.flawlessfiles.com/_r/100x100/100/avatar/",
      "https://cdn.noitatnemucod.net/avatar/100x100/"
    ) || "/default-avatar.png";

  return (
    <div
      className={`profip-overlay ${props.profiIsOpen ? "open" : ""}`}
      onClick={() => props.setProfiIsOpen(false)}
    >
      <div className="profip-list-dropdown" onClick={handleDropdownClick}>
        {/* User Info Header */}
        <div className="profip-header">
          <img
            src={avatarSrc}
            alt={session?.user.username || "User"}
            className="profip-avatar"
          />
          <div className="profip-info">
            <div className="profip-username">
              {session?.user.username || "Guest"}
            </div>
            <div className="profip-email">{session?.user.email}</div>
          </div>
        </div>

        <div className="profip-menu-items">
          {/* Menu Items */}
          <Link
            href={`/user/profile${
              props.refer ? `?refer=${props.refer}` : `?refer=weebsSecret`
            }`}
            className="profip-menu-item"
          >
            <FaUser className="menu-icon" />
            <span className="menu-text">Profile</span>
          </Link>
          <Link
            href={`/user/continue-watching${
              props.refer ? `?refer=${props.refer}` : `?refer=weebsSecret`
            }`}
            className="profip-menu-item"
          >
            <FaHistory className="menu-icon" />
            <span className="menu-text">Continue Watching</span>
          </Link>
          <Link
            href={`/user/watch-list${
              props.refer ? `?refer=${props.refer}` : `?refer=weebsSecret`
            }`}
            className="profip-menu-item"
          >
            <FaHeart className="menu-icon" />
            <span className="menu-text">Watch List</span>
          </Link>
          <Link
            href={`/user/notification${
              props.refer ? `?refer=${props.refer}` : `?refer=weebsSecret`
            }`}
            className="profip-menu-item"
          >
            <FaBell className="menu-icon" />
            <span className="menu-text">Notification</span>
          </Link>
          {/* <Link
            href={`/user/settings${
              props.refer ? `?refer=${props.refer}` : `?refer=weebsSecret`
            }`}
            className="profip-menu-item"
          >
            <FaCog className="menu-icon" />
            <span className="menu-text">Settings</span>
          </Link> */}
          <Link
            href={`/monetize${
              props.refer ? `?refer=${props.refer}` : `?refer=weebsSecret`
            }`}
            className="profip-menu-item monetize"
          >
            <FaSackDollar className="menu-icon" />
            <span className="menu-text">Monetize</span>
          </Link>
        </div>

        {/* Logout Button */}
        <div className="profip-footer">
          {error && <div className="logout-error">{error}</div>}
          <button
            className="logout-btn"
            onClick={handleSignOut}
            disabled={loading}
          >
            {loading ? "Logging Out..." : "Logout"}
            <FaArrowRight className="logout-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}
