// import React from "react";
// import LogoHead from "./LogoHead"; // Assuming LogoHead is in the same directory
// import TopHeader from "./TopHeader"; // Assuming TopHeader is in the same directory

// const FullHeader = () => {
//   return (
//     <header className="flex items-center justify-start h-20 px-[62.0px] py-[17.8px] bg-white">
//       {/* Left side: Logo and Name */}
//       <div className="flex items-center">
//         <LogoHead />
//       </div>

//       {/* Right side: Contact info and Icons */}
//       <div className="flex items-center justify-between w-full max-w-[800px]">
//         <TopHeader />
//       </div>
//     </header>
//   );
// };

// export default FullHeader;



import React from "react";
import LogoHead from "./LogoHead";
import TopHeader from "./TopHeader";

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