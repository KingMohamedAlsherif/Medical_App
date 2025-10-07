"use client";
import React, { useState } from "react";

const Navibar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm px-4 lg:px-8 relative z-50">
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="btn btn-ghost"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* navbar make link later */}
        <div className="hidden lg:flex flex-1 gap-2">
          <a className="btn btn-ghost text-base xl:text-lg">Home</a>
          <a className="btn btn-ghost text-base xl:text-lg">About Us</a>
          <a className="btn btn-ghost text-base xl:text-lg">Services</a>
          <a className="btn btn-ghost text-base xl:text-lg">Doctors</a>
          <a className="btn btn-ghost text-base xl:text-lg">News</a>
          <a className="btn btn-ghost text-base xl:text-lg">Contact</a>
        </div>

        <div className="flex-1 lg:flex-none flex items-center justify-end gap-4">
          <button className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
            //   viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>
          <button className="btn btn-sm md:btn-md lg:btn-lg rounded-full bg-primary text-white hover:bg-primary-focus">
            Appointment
          </button>

        </div>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMenu}
        />
      )}

     {/* responsive navbar menu */}
      <div
        className={`fixed inset-0 bg-base-100 z-50 transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}>
        <div className="absolute top-4 right-4">
          <button
            onClick={closeMenu}
            className="btn btn-ghost btn-circle"
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col items-center justify-center h-full gap-8 p-8">
          <a
            onClick={closeMenu}
            className="text-3xl font-semibold hover:text-primary transition-colors cursor-pointer"
          >
            Home
          </a>
          <a
            onClick={closeMenu}
            className="text-3xl font-semibold hover:text-primary transition-colors cursor-pointer"
          >
            About Us
          </a>
          <a
            onClick={closeMenu}
            className="text-3xl font-semibold hover:text-primary transition-colors cursor-pointer"
          >
            Services
          </a>
          <a
            onClick={closeMenu}
            className="text-3xl font-semibold hover:text-primary transition-colors cursor-pointer"
          >
            Doctors
          </a>
          <a
            onClick={closeMenu}
            className="text-3xl font-semibold hover:text-primary transition-colors cursor-pointer"
          >
            News
          </a>
          <a
            onClick={closeMenu}
            className="text-3xl font-semibold hover:text-primary transition-colors cursor-pointer"
          >
            Contact
          </a>
          <button
            onClick={closeMenu}
            className="btn btn-lg rounded-full bg-primary text-white hover:bg-primary-focus mt-8 px-12"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </>
  );
};

export default Navibar;