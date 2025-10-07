import React from "react";

const LogoHead = () => {
  return (
    <div className="relative w-[236px] h-[58px]">
      <div className="absolute w-[14.90%] h-[60.21%] top-[7.89%] left-0">
        <img
          className="absolute w-full h-[47.01%] top-0 left-0"
          alt="Vector"
          src="/ccad_logo_top.svg"
        />

        <img
          className="absolute w-full h-[47.01%] top-[52.99%] left-0"
          alt="Vector"
          src="/ccad_logo_bottom.svg"
        />
      </div>

      <img
        className="absolute w-[79.63%] h-[67.92%] top-0 left-[18.76%]"
        alt="Group"
        src="/ccad_word.svg"
      />
    </div>
  );
};

export default LogoHead