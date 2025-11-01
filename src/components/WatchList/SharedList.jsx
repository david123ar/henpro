"use client";
import React, { useState } from "react";
import InnerList from "./InnerList";
import { SessionProvider } from "next-auth/react";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

const SharedList = (props) => {
  const [selectL, setSelectL] = useState("EN");
  const lang = (lang) => {
    setSelectL(lang);
  }; 
  return (
    <div>
      <SessionProvider>
        <Navbar lang={lang} selectL={selectL} refer={props.refer} />
        <InnerList {...props} />
        <Footer refer={props.refer} />
      </SessionProvider>
    </div>
  );
};

export default SharedList;
