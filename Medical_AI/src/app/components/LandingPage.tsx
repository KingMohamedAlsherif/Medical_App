// import React from "react";

// export const LandingPage = () => {
//   return (
//     <div className="relative w-[1472px] h-[664px]">
//       <div className="fixed top-40 -left-3 w-[1472px] h-[664px]">
//         <div className="left-0 w-[1378px] h-[600px] bg-[#02ddcd] rotate-180 absolute top-0" />

//         <img
//           className="left-3 w-[1366px] h-[664px] absolute top-0"
//           alt="Rectangle"
//           src="/landing_pic.png"
//         />

//         <div className="absolute top-0 left-3 w-[1366px] h-[664px] flex gap-[511px] overflow-hidden">
//           <div className="mt-[-573px] ml-[-412px] bg-[#159eec] opacity-30 w-[734px] h-[734px] rounded-[367px]" />

//           <div className="mt-[252px] bg-[#bed2f7] opacity-50 w-[734px] h-[734px] rounded-[367px]" />
//         </div>

//         <div className="absolute top-[375px] left-[940px] w-[536px] h-[159px]">
//           <p className="absolute top-[21px] left-0 w-[532px] [font-family:'Yeseva_One-Regular',Helvetica] font-normal text-[#fcfefe] text-4xl tracking-[0] leading-[normal]">
//             Leading the Way
//             <br />
//             in Medical Excellence
//           </p>

// 			{/* last edit here. change button size */}
//           <button
//             className="!absolute !left-0 !bg-[#1f2b6c] !top-[114px] rounded-full btn btn-xs">Our Services</button>
//           <div className="absolute top-0 left-0 [text-shadow:0px_4px_4px_#00000040] [font-family:'Work_Sans-Bold',Helvetica] font-bold text-[#fcfefe] text-lg tracking-[2.88px] leading-[normal] whitespace-nowrap">
//             CARING FOR LIFE
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LandingPage



import React from "react";

const LandingPage = () => {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[664px] overflow-hidden">
      <div className="absolute inset-0 bg-[#02ddcd] -z-10" />

      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover"
          alt="Medical Background"
          src="/landing_pic.png"
        />
      </div>

      {/* Decorative Circles - Hidden on mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
        <div className="absolute -left-[200px] -top-[200px] bg-[#159eec] opacity-30 w-[500px] h-[500px] lg:w-[734px] lg:h-[734px] rounded-full" />
        <div className="absolute right-[-200px] bottom-[-200px] bg-[#bed2f7] opacity-50 w-[500px] h-[500px] lg:w-[734px] lg:h-[734px] rounded-full" />
      </div>

      <div className="absolute inset-0 flex items-end justify-center lg:items-end lg:justify-end px-4 sm:px-8 lg:px-16 pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-xl lg:max-w-2xl text-center lg:text-left mb-8 lg:mb-0">
          <div className="text-white font-bold text-sm md:text-base lg:text-lg tracking-[2px] md:tracking-[2.88px] mb-3 md:mb-4 drop-shadow-md">
            CARING FOR LIFE
          </div>

          <h1 className="font-['Yeseva_One'] text-white text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl leading-tight mb-4 md:mb-6 drop-shadow-lg/30">
            Leading the Way
            <br />
            in Medical Excellence
          </h1>

			{/* last edit here. change button size */}

          <button className="btn btn-md md:btn-lg bg-[#1f2b6c] hover:bg-[#152047] text-white border-none rounded-full px-8 md:px-12 shadow-lg">
            Our Services
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;