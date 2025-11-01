"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";
import Navbar from "../Navbar/Navbar";
import Hero from "../Hero/Hero";
import RecentEpisodes from "../RecentEpisodes/RecentEpisodes";
import ShareSlab from "../ShareSlab/ShareSlab";
import Swipe from "../Swipe/Hero";
import Footer from "../footer/Footer";

const Home = (props) => {
  return (
    <SessionProvider>
      <div>
        <Navbar now={true} />
        <Hero recentEpi={props.recentEpi} />

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

        <div>
          <RecentEpisodes recentEpi={props.recentEpi.data.recentEpisodes} />

          <ShareSlab
            pageId={"home"}
            url={`https://henpro.fun/`}
            title={"Watch Hentai on Henpro"}
            pageName="Henpro"
          />

          {/* 🌀 Independent Swipe carousels */}
          <Swipe
            title="Series"
            slides={props.hompro?.series || []}
            slug={`/series`}
          />
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
          <Swipe
            title="Uncensored"
            slides={props.hompro?.genre?.uncensored || []}
            slug={`/genre?genre=uncensored`}
          />

          <Swipe
            title="Harem"
            slides={props.hompro?.genre?.harem || []}
            slug={`/genre?genre=harem`}
          />

          <Swipe
            title="School Girls"
            slides={props.hompro?.genre?.["school-girls"] || []}
            slug={`/genre?genre=school-girls`}
          />

          <Swipe
            title="Large Breasts"
            slides={props.hompro?.genre?.["large-breasts"] || []}
            slug={`/genre?genre=large-breasts`}
          />
        </div>
        <Footer />
      </div>
    </SessionProvider>
  );
};

export default Home;
