import React from "react";

const TopHeader = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center md:justify-end gap-4 md:gap-6 lg:gap-8 w-full">
      <div className="flex items-center gap-2">
        <img
          className="w-7 h-7"
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

      <div className="flex items-center gap-2">
        <img
          className="w-7 h-7"
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

      <div className="flex items-center gap-2">
        <img
          className="w-7 h-7"
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