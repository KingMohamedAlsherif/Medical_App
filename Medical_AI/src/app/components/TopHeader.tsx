// import React from "react";

// const TopHeader = () => {
//   return (
//     <div className="h-20 flex px-[62.0px] py-[17.8px] items-start min-w-[1366px] bg-white">
//       <div className="w-[748px] h-[42px] relative ml-[494px] mt-[2.19px]">
//         <div className="absolute w-[19.88%] h-full top-0 left-0">
//           <a
//             className="absolute w-[66.59%] h-[45.03%] top-[49.78%] left-[30.72%] [font-family:'Work_Sans-Medium',Helvetica] font-medium text-secondary text-base tracking-[0] leading-[normal] underline whitespace-nowrap"
//             href="tel:800 8 2223"
//             rel="noopener noreferrer"
//             target="_blank"
//           >
//             {" "}
//             800 8 2223
//           </a>

//           <img
//             className="absolute w-[27.04%] h-[90.52%] top-[9.48%] left-0"
//             alt="Group"
//             src="/phone.svg"
//           />

//           <div className="absolute w-[66.59%] h-[45.03%] top-0 left-[30.72%] [font-family:'Work_Sans-Medium',Helvetica] font-medium text-primary text-base tracking-[0] leading-[normal] whitespace-nowrap">
//             EMERGENCY
//           </div>
//         </div>

//         <div className="absolute w-[19.21%] h-[94.81%] top-[2.37%] left-[27.63%]">
//           <div className="absolute w-[25.06%] h-[47.50%] top-[52.50%] left-[27.62%] [font-family:'Work_Sans-Medium',Helvetica] font-medium text-secondary text-base tracking-[0] leading-[normal] whitespace-nowrap">
//             24/7
//           </div>

//           <img
//             className="absolute w-[20.88%] h-[75.00%] top-[7.50%] left-0"
//             alt="Group"
//             src="/clock.svg"
//           />

//           <div className="absolute w-[69.60%] h-[47.50%] top-0 left-[27.62%] [font-family:'Work_Sans-Medium',Helvetica] font-medium text-primary text-base tracking-[0] leading-[normal] whitespace-nowrap">
//             WORK HOUR
//           </div>
//         </div>

//         <div className="absolute w-[40.33%] h-[94.81%] top-[2.37%] left-[60.21%]">
//           <p className="absolute w-[85.52%] h-[47.50%] top-[52.50%] left-[13.15%] [font-family:'Work_Sans-Medium',Helvetica] font-medium text-secondary text-base tracking-[0] leading-[normal] whitespace-nowrap">
//             Abu Dhabi, United Arab Emirates
//           </p>

//           <img
//             className="absolute w-[9.94%] h-[90.00%] top-0 left-0"
//             alt="Group"
//             src="/location.svg"
//           />

//           <div className="absolute w-[26.52%] h-[47.50%] top-0 left-[13.15%] [font-family:'Work_Sans-Medium',Helvetica] font-medium text-primary text-base tracking-[0] leading-[normal] whitespace-nowrap">
//             LOCATION
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopHeader


import React from "react";

const TopHeader = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center md:justify-end gap-4 md:gap-6 lg:gap-8 w-full">
      {/* Emergency */}
      <div className="flex items-center gap-2">
        <img
          className="w-5 h-5"
          alt="Phone"
          src="/phone.svg"
        />
        <div className="flex flex-col">
          <span className="font-medium text-primary text-xs lg:text-sm">
            EMERGENCY
          </span>
          <a
            className="font-medium text-secondary text-sm lg:text-base underline whitespace-nowrap"
            href="tel:80082223"
          >
            800 8 2223
          </a>
        </div>
      </div>

      {/* Work Hour */}
      <div className="flex items-center gap-2">
        <img
          className="w-5 h-5"
          alt="Clock"
          src="/clock.svg"
        />
        <div className="flex flex-col">
          <span className="font-medium text-primary text-xs lg:text-sm">
            WORK HOUR
          </span>
          <span className="font-medium text-secondary text-sm lg:text-base">
            24/7
          </span>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2">
        <img
          className="w-5 h-5"
          alt="Location"
          src="/location.svg"
        />
        <div className="flex flex-col">
          <span className="font-medium text-primary text-xs lg:text-sm">
            LOCATION
          </span>
          <span className="font-medium text-secondary text-sm lg:text-base whitespace-nowrap">
            Abu Dhabi, UAE
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;