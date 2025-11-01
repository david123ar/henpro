"use client";
import React from "react";
import SeriesInner from "./SeriesInner";
import { SessionProvider } from "next-auth/react";

const Series = (props) => {
  return (
    <div>
      <SessionProvider>
        <SeriesInner {...props} />
      </SessionProvider>
    </div>
  );
};

export default Series;
