"use client"
import React from "react";
import { MonetizeInner } from "./MonetizeInner";
import { SessionProvider } from "next-auth/react";
// import MonetizeInner from "./MonetizeInner";

const MonetizeContent = () => {
  return (
    <div>
      <SessionProvider>
        <MonetizeInner />
      </SessionProvider>
    </div>
  );
};

export default MonetizeContent;
