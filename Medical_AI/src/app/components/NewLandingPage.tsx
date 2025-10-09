"use client";

import React, { useState } from "react";
import Image from "next/image";

const NewLandingPage = () => {
  const [isCallLoading, setIsCallLoading] = useState(false);
  const [callStatus, setCallStatus] = useState<string | null>(null);

  const handleWhatsAppClick = () => {
    // Remove all non-numeric characters from the phone number
    const phoneNumber = "971501868376"; // +971 50 186 8376 without spaces and +
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, "_blank");
  };

  const handlePhoneCall = async () => {
    setIsCallLoading(true);
    setCallStatus(null);

    try {
      const response = await fetch(
        "https://gateway.on-demand.io/automation/public/v1/webhook/workflow/68e50311f04c943d87de2a41/execute",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            source: "landing_page",
          }),
        }
      );

      if (response.ok) {
        setCallStatus("success");
      } else {
        setCallStatus("error");
      }
    } catch (error) {
      console.error("Error triggering call webhook:", error);
      setCallStatus("error");
    } finally {
      setIsCallLoading(false);
      setTimeout(() => setCallStatus(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        {/* Logo and Title Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <img
              src="/ccad_logo_top.svg"
              alt="Cleveland Clinic Abu Dhabi"
              className="h-20 md:h-24"
            />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1f2b6c] mb-4">
            Your Health, Our Priority
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Experience world-class healthcare with Cleveland Clinic Abu Dhabi's
            intelligent appointment system
          </p>
        </div>

        {/* About Cleveland Clinic Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1f2b6c] mb-6">
                About Cleveland Clinic Abu Dhabi
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Cleveland Clinic Abu Dhabi is a world-renowned multispecialty
                  hospital on Al Maryah Island, combining the best of U.S.
                  healthcare with a patient-first approach.
                </p>
                <p>
                  We offer comprehensive care across various specialties,
                  ensuring you receive the highest quality treatment with
                  cutting-edge technology and compassionate care.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="text-3xl font-bold text-[#159eec]">50+</div>
                    <div className="text-sm text-gray-600">Specialties</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="text-3xl font-bold text-[#159eec]">24/7</div>
                    <div className="text-sm text-gray-600">Emergency Care</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="text-3xl font-bold text-[#159eec]">200+</div>
                    <div className="text-sm text-gray-600">Expert Doctors</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="text-3xl font-bold text-[#159eec]">5★</div>
                    <div className="text-sm text-gray-600">Rated Service</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="/landing_pic.png"
                alt="Cleveland Clinic"
                className="rounded-2xl shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* AI Assistant Features */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1f2b6c] text-center mb-12">
            Smart Appointment Booking
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#159eec] rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-[#1f2b6c] mb-3">
                AI-Powered Triage
              </h3>
              <p className="text-gray-600">
                Our intelligent system understands your symptoms and guides you
                to the right specialist instantly.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#159eec] rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-[#1f2b6c] mb-3">
                Instant Booking
              </h3>
              <p className="text-gray-600">
                Book appointments in seconds with our streamlined, user-friendly
                interface. No waiting, no hassle.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#159eec] rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-bold text-[#1f2b6c] mb-3">
                24/7 Support
              </h3>
              <p className="text-gray-600">
                Get assistance anytime, anywhere through multiple channels -
                chat, call, or WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="bg-gradient-to-r from-[#1f2b6c] to-[#159eec] rounded-3xl shadow-2xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Get Started Today
          </h2>
          <p className="text-blue-100 text-center mb-10 text-lg">
            Choose your preferred way to connect with us
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* WhatsApp Button */}
            <button 
              onClick={handleWhatsAppClick}
              className="group bg-white hover:bg-green-50 text-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  WhatsApp Chat
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  Quick and convenient messaging
                </p>
              </div>
            </button>

            {/* Phone Call Button */}
            <button 
              onClick={handlePhoneCall}
              disabled={isCallLoading}
              className={`group bg-white hover:bg-blue-50 text-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative ${
                isCallLoading ? "opacity-70 cursor-not-allowed" : ""
              } ${
                callStatus === "success" ? "ring-4 ring-green-300" : ""
              } ${
                callStatus === "error" ? "ring-4 ring-red-300" : ""
              }`}
            >
              <div className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform ${
                  isCallLoading ? "animate-pulse" : "group-hover:scale-110"
                } ${
                  callStatus === "success" ? "bg-green-500" : callStatus === "error" ? "bg-red-500" : "bg-[#159eec]"
                }`}>
                  {isCallLoading ? (
                    <svg
                      className="w-10 h-10 text-white animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : callStatus === "success" ? (
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : callStatus === "error" ? (
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {isCallLoading ? "Calling..." : "Phone Call"}
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  {isCallLoading 
                    ? "Please wait..." 
                    : callStatus === "success"
                    ? "Call initiated!"
                    : callStatus === "error"
                    ? "Please try again"
                    : "Speak directly with our team"}
                </p>
              </div>
            </button>

            {/* Download App Button */}
            <button className="group bg-white hover:bg-purple-50 text-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Download App
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  Get our mobile app for iOS & Android
                </p>
              </div>
            </button>
          </div>

          <div className="text-center mt-8">
            <p className="text-blue-100 text-sm">
              Available on iOS, Android, and Web
            </p>
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-16 text-center">
          <div className="flex justify-center mb-6">
            <img
              src="/ccad_logo_bottom.svg"
              alt="Cleveland Clinic Abu Dhabi"
              className="h-12"
            />
          </div>
          <p className="text-gray-600 text-sm">
            © 2025 Cleveland Clinic Abu Dhabi. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Leading the Way in Medical Excellence
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewLandingPage;
