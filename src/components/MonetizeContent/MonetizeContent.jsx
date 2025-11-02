"use client"
import React from "react";
import { MonetizeInner } from "./MonetizeInner";
import { SessionProvider } from "next-auth/react";
// import MonetizeInner from "./MonetizeInner";

const MonetizeContent = (props) => {
  return (
    <div>
      <SessionProvider>
        <MonetizeInner {...props}/>
      </SessionProvider>
    </div>
  );
};

export default MonetizeContent;
