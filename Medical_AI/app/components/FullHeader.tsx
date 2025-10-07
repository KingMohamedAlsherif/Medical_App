import React from "react";
import LogoHead from "./LogoHead";
import TopHeader from "./TopHeader";

// combine logo and header info into 1
const FullHeader = () => {
  return (
    <header className="w-full bg-white">
      {/* Mobile & Tablet: Stack vertically */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between px-4 sm:px-8 lg:px-16 py-4 gap-4">
        {/* Logo */}
        <div className="flex items-center justify-center lg:justify-start">
          <LogoHead />
        </div>

        {/* Contact Info - Hidden on mobile, visible on tablet+ */}
        <div className="hidden md:flex items-center justify-center lg:justify-end flex-1">
          <TopHeader />
        </div>
      </div>
    </header>
  );
};

export default FullHeader;