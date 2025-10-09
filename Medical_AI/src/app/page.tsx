import React from "react";
import FloatingChat from "./components/FloatingChat";
import FullHeader from "./components/FullHeader";
import Navibar from "./components/NaviBar";

const ChatDash = () => {
  return (
    <>
      <FullHeader />
      <Navibar />
      <FloatingChat />
    </>
  );
};

export default ChatDash;
