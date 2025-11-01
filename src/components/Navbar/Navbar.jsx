"use client";
import React, { useEffect, useState, useRef } from "react";
import { FaBars, FaSearch, FaTimes } from "react-icons/fa";
import "./navbar.css";
import NavSidebar from "../NavSideBar/NavSideBar";
import Image from "next/image";
import Link from "next/link";
import SignInSignUpModal from "../SignSignup/SignInSignUpModal";
import { useSession } from "next-auth/react";
import Profilo from "../Profilo/Profilo";

const Navbar = (props) => {
  const [focused, setFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [profiIsOpen, setProfiIsOpen] = useState(false);
  // const [profiIsOpen, setProfiIsOpen] = useState(false);

  const timeoutRef = useRef(null);
  const searchInputRef = useRef(null);

  const { data: session } = useSession();

  const toggleProfile = () => setProfiIsOpen(true);

  // 🧭 Handle scroll effect for 'dark' background
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔍 Fetch search suggestions with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}`
        );
        const data = await res.json();
        setSearchResults(data.results || []);
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500); // debounce 0.5s
  }, [searchQuery]);

  const [logIsOpen, setLogIsOpen] = useState(false);
  const sign = (sign) => {
    setLogIsOpen(sign);
  };

  const handleBlur = () => {
    // Only unfocus if the user isn't clicking on the search dropdown itself
    // Use a timeout to allow clicks on the dropdown children to register
    setTimeout(() => {
      if (!document.activeElement.closest(".search-dropdown")) {
        setFocused(false);
      }
    }, 100);
  };

  const handleMobileClose = () => {
    setShowMobileSearch(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <>
      {/* Sign In / Sign Up Modal */}
      {logIsOpen && (
        <SignInSignUpModal
          logIsOpen={logIsOpen}
          setLogIsOpen={setLogIsOpen}
          sign={sign}
        />
      )}

      {profiIsOpen ? (
        <Profilo
          setProfiIsOpen={setProfiIsOpen}
          profiIsOpen={profiIsOpen}
          // refer={refer}
        />
      ) : (
        ""
      )}

      {/* Navigation Sidebar */}
      <NavSidebar
        sidebarIsOpen={sidebarIsOpen}
        setSidebarIsOpen={setSidebarIsOpen}
      />

      {/* 📱 Floating mobile search bar + dropdown */}
      {showMobileSearch && (
        <div className="floating-search-wrapper">
          <div className="floating-search">
            <FaSearch className="mobile-search-icon" />
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaTimes className="close-icon" onClick={handleMobileClose} />
          </div>

          {/* ⬇️ Dropdown for mobile search */}
          {searchQuery && (
            <div className="floating-search-dropdown">
              {isLoading && <div className="search-loading">Loading...</div>}
              {!isLoading && searchResults.length === 0 && (
                <div className="search-empty">No results found</div>
              )}

              {searchResults.slice(0, 6).map((result, idx) => {
                const safeUrl = result?.url
                  ? result.url.replace("https://watchhentai.net/series/", "")
                  : "#";
                return (
                  <Link
                    key={idx}
                    href={`/watch/${safeUrl}`}
                    className="search-item"
                    onClick={handleMobileClose}
                  >
                    <img
                      src={result?.img || "/placeholder.jpg"}
                      alt={result?.title || "No title"}
                      className="search-thumb"
                    />
                    <div className="search-info">
                      <p className="search-title">
                        {result?.title || "Untitled"}
                      </p>
                      <span className="search-date">
                        {result?.date || "N/A"}
                      </span>
                    </div>
                  </Link>
                );
              })}

              {searchResults.length > 0 && (
                <Link
                  href={`/search?q=${encodeURIComponent(searchQuery)}`}
                  className="search-view-all"
                  onClick={handleMobileClose}
                >
                  View all results
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {/* 🧭 Main Navbar */}
      <div
        className={`navbar ${
          isScrolled || !props.now ? "dark" : "transparent"
        }`}
      >
        <div className="nav-1">
          <div className="bars" onClick={() => setSidebarIsOpen(true)}>
            <FaBars />
          </div>

          <Link href={"/"} className="logo">
            <Image
              src="/logo.png" // Assumes this is a high-contrast logo
              alt="Logo"
              width={150}
              height={50}
              priority
              style={{
                height: "auto",
                maxHeight: "100%",
                width: "auto",
              }}
            />
          </Link>

          {/* 🧠 Desktop Search */}
          <div
            className={`search ${focused ? "focused" : ""}`}
            // Inline styles simplified as most are moved to CSS
          >
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search hentai..."
              value={searchQuery}
              onFocus={() => setFocused(true)}
              onBlur={handleBlur}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="search-icon" />

            {/* 🔽 Desktop Dropdown */}
            {focused && searchQuery && (
              <div className="search-dropdown">
                {isLoading && <div className="search-loading">Loading...</div>}
                {!isLoading && searchResults.length === 0 && (
                  <div className="search-empty">No results found</div>
                )}
                {searchResults.slice(0, 6).map((result, idx) => {
                  const safeUrl = result?.url
                    ? result.url.replace("https://watchhentai.net/series/", "")
                    : "#";
                  return (
                    <Link
                      key={idx}
                      href={`/watch/${safeUrl}`}
                      className="search-item"
                      onClick={() => setSearchQuery("")}
                    >
                      <img
                        src={result?.img || "/placeholder.jpg"}
                        alt={result?.title || "No title"}
                        className="search-thumb"
                      />
                      <div className="search-info">
                        <p className="search-title">
                          {result?.title || "Untitled"}
                        </p>
                        <span className="search-date">
                          {result?.date || "N/A"}
                        </span>
                      </div>
                    </Link>
                  );
                })}
                {searchResults.length > 0 && (
                  <Link
                    href={`/search?q=${encodeURIComponent(searchQuery)}`}
                    className="search-view-all"
                  >
                    View all results
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="nav-2">
          {/* 🔍 Mobile Search Button */}
          <div
            className="mobile-search-btn"
            onClick={() => setShowMobileSearch(true)}
          >
            <FaSearch />
          </div>
          {session ? (
            <img
              src={
                // Replace the dynamic URL parts with placeholders or consistent base URL
                session.user.avatar?.replace(
                  "https://img.flawlessfiles.com/_r/100x100/100/avatar/",
                  "https://cdn.noitatnemucod.net/avatar/100x100/"
                ) || "/default-avatar.png" // Added a default placeholder
              }
              className="profile-ico"
              onClick={toggleProfile}
              alt={session.user.username || "User Profile"}
            />
          ) : (
            <div className="login" onClick={() => sign(true)}>
              Login
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
