"use client";
import React from "react";
import WatchPageClient from "./Watch";
import { SessionProvider } from "next-auth/react";

const WatchWrapper = (props) => {
  return (
    <div>
      <SessionProvider>
        <WatchPageClient
          watchData={props.watchData}
          infoData={props.infoData}
          id={props.id}
          creat={props.creator}
        />
      </SessionProvider>
    </div>
  );
};

export default WatchWrapper;
