"use client";
import React from "react";
import { FaChevronLeft } from "react-icons/fa";
import Link from "next/link";
import { IoMdHome } from "react-icons/io";
import "./navSideBar.css";

export default function NavSidebar({ sidebarIsOpen, setSidebarIsOpen }) {
  const genreList = [
    { name: "3D", link: "3d" },
    { name: "Action", link: "action" },
    { name: "Adventure", link: "adventure" },
    { name: "Ahegao", link: "ahegao" },
    { name: "Anal", link: "anal" },
    { name: "Animal Ears", link: "animal-ears" },
    // ... add rest of genres as needed
  ];

  const years = [
    { year: "2025", link: "2025" },
    { year: "2024", link: "2024" },
    { year: "2023", link: "2023" },
    // ... add rest of years as needed
  ];

  return (
    <div
      className="navigation-sidebar f-poppins"
      style={{ zIndex: sidebarIsOpen ? 100 : -1 }}
      onClick={() => setSidebarIsOpen(false)}
    >
      <div
        className="navigation-list flex flex-col"
        style={{
          transform: sidebarIsOpen ? "translateX(250px)" : "translateX(-250px)",
        }}
      >
        <div className="wrap-clos">
          <div
            className="close-menu flex items-center"
            onClick={() => setSidebarIsOpen(false)}
          >
            <FaChevronLeft size={14} />
            Close Menu
          </div>
        </div>

        <div className="navigation-link-list">
          <ul>
            <li>
              <Link href="/" className="homop">
                <div className="icono">
                  <IoMdHome />
                </div>
                Home
              </Link>
            </li>
          </ul>

          <div className="button-group">
            <label>Genres</label>
            {genreList.map((genre) => (
              <Link key={genre.name} href={`/genre?genre=${genre.link}`}>
                {genre.name}
              </Link>
            ))}
          </div>

          <div className="button-group">
            <label>Years</label>
            {years.map((y) => (
              <Link key={y.year} href={`/release?year=${y.link}`}>
                {y.year}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
