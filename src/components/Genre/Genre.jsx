"use client";
import React from "react";
import GenreInner from "./GenreInner";
import { SessionProvider } from "next-auth/react";

const Genre = (props) => {
  return (
    <SessionProvider>
      {" "}
      <GenreInner {...props} />
    </SessionProvider>
  );
};

export default Genre;
