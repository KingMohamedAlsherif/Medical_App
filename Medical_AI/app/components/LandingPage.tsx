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

			{/* last edit here. change button size on normal screen */}

          <button className="btn btn-md md:btn-lg bg-[#1f2b6c] hover:bg-[#152047] text-white border-none rounded-full px-8 md:px-12 shadow-lg">
            Our Services
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;