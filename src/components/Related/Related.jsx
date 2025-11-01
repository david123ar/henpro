"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlay } from "react-icons/fa";
import "./RelatedGrid.css"; // Import CSS file

export default function RelatedGrid({ related = [] }) {
  const [cssLoaded, setCssLoaded] = useState(false);

  useEffect(() => {
    setCssLoaded(true);
  }, []);

  if (!related || related.length === 0) return null;

  return (
    <div className="related-grid-section">
      <div className="heading-wrapper">
        <h2 className="related-heading">Related Series</h2>
        {/* <p className="total-series">Total: {related.length}</p> */}
      </div>

      <div className="related-grid">
        {related.map((item, index) => (
          <Link href={`/watch/${item.link}`} key={index} className="related-card">
            <div className="related-image-wrapper">
              {cssLoaded && (
                <img src={item.poster} alt={item.title} className="related-img" />
              )}
              <FaPlay className="play-icon" />
            </div>
            <div className="related-info">
              <p className="related-title" title={item.title}>
                {item.title.length > 13
                  ? item.title.slice(0, 13) + "..."
                  : item.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
