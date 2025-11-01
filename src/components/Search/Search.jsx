"use client";
import React from "react";
import SearchInner from "./SearchInner";
import { SessionProvider } from "next-auth/react";

const Search = (props) => {
  return (
    <div>
      <SessionProvider>
        <SearchInner {...props} />
      </SessionProvider>
    </div>
  );
};

export default Search;
