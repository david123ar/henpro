"use client"
import React from "react";
import ReleaseInner from "./ReleaseInner";
import { SessionProvider } from "next-auth/react";

const Release = (props) => {
  return (
    <SessionProvider>
      {" "}
      <ReleaseInner {...props} />
    </SessionProvider>
  );
};

export default Release;
