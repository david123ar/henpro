"use client";
import React from "react";
import TrendingInner from "./TrendingInner";
import { SessionProvider } from "next-auth/react";

const Trending = (props) => {
  return (
    <div>
      <SessionProvider>
        <TrendingInner {...props} />
      </SessionProvider>
    </div>
  );
};

export default Trending;
