"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
}

const DoctorDashboard = () => {
  const { data: messages = [], refetch } = useQuery({
    queryKey: ["messages"],
    queryFn: async () =>
      await fetch("/api/messages").then(async (e) => await e.json()),
    refetchInterval: 5000,
  });

  const { data: reportData } = useQuery({
    queryKey: ["report"],
    queryFn: async () =>
      await fetch("/api/report").then(async (e) => await e.json()),
    refetchInterval: 5000,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (message: string) => {
      await fetch("/api/messages", {
        method: "POST",
        body: JSON.stringify({ message }),
      });
    },
    onSuccess: () => {
      refetch();
    },
  });

  const [inputMessage, setInputMessage] = useState("");

  // Extract patient data from report
  const patientData = reportData?.report || {
    patientName: "Loading...",
    age: 0,
    gender: "Unknown",
    diagnosis: "Analyzing...",
    symptoms: [],
    mentalHealth: [],
    prescribedMedications: [],
    doctorNotes: "Waiting for patient data...",
    followUpDate: "",
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;
    mutate(inputMessage);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Mock vital signs data for visualization
  const vitalSigns = {
    heartRate: 72,
    bloodPressure: "120/80",
    temperature: 98.6,
    oxygenSaturation: 98,
    respiratoryRate: 16,
  };

  // Mock health metrics for chart visualization
  const healthTrend = [
    { date: "Oct 1", value: 85 },
    { date: "Oct 3", value: 78 },
    { date: "Oct 5", value: 82 },
    { date: "Oct 7", value: 88 },
    { date: "Oct 9", value: 90 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-[1800px] mx-auto p-6">
        {/* Doctor Dashboard Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#1f2b6c] mb-2">
            Doctor Dashboard
          </h1>
          <p className="text-gray-600">
            Patient Management & Real-time Communication System
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Patient Information */}
          <div className="lg:col-span-3 space-y-6">
            {/* Patient Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-[#159eec]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#159eec] to-[#1f2b6c] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {patientData.patientName.charAt(0) || "P"}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1f2b6c]">
                    {patientData.patientName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {patientData.age} years • {patientData.gender}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-600 mb-1">Primary Diagnosis</p>
                  <p className="font-semibold text-[#1f2b6c]">
                    {patientData.diagnosis}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 mb-2">Symptoms</p>
                  <div className="flex flex-wrap gap-2">
                    {patientData.symptoms.length > 0 ? (
                      patientData.symptoms.map((symptom: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium"
                        >
                          {symptom}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">No symptoms recorded</span>
                    )}
                  </div>
                </div>

                {patientData.mentalHealth.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Mental Health</p>
                    <div className="flex flex-wrap gap-2">
                      {patientData.mentalHealth.map((condition: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                        >
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Vital Signs Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-[#1f2b6c] mb-4 flex items-center gap-2">
                <span className="text-2xl">💓</span>
                Vital Signs
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg">
                  <span className="text-sm text-gray-700">Heart Rate</span>
                  <span className="font-bold text-red-700">{vitalSigns.heartRate} bpm</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <span className="text-sm text-gray-700">Blood Pressure</span>
                  <span className="font-bold text-blue-700">{vitalSigns.bloodPressure}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                  <span className="text-sm text-gray-700">Temperature</span>
                  <span className="font-bold text-orange-700">{vitalSigns.temperature}°F</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                  <span className="text-sm text-gray-700">O₂ Saturation</span>
                  <span className="font-bold text-green-700">{vitalSigns.oxygenSaturation}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <span className="text-sm text-gray-700">Respiratory Rate</span>
                  <span className="font-bold text-purple-700">{vitalSigns.respiratoryRate}/min</span>
                </div>
              </div>
            </div>

            {/* Medications Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-[#1f2b6c] mb-4 flex items-center gap-2">
                <span className="text-2xl">💊</span>
                Prescribed Medications
              </h3>
              <div className="space-y-3">
                {patientData.prescribedMedications.length > 0 ? (
                  patientData.prescribedMedications.map((med: any, idx: number) => (
                    <div key={idx} className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                      <p className="font-semibold text-[#1f2b6c] text-sm">{med.name}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {med.dosage} • {med.frequency}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No medications prescribed</p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-6 space-y-6">
            {/* Health Trend Visualization */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-[#1f2b6c] mb-6 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Health Progress Trend
              </h3>
              <div className="relative h-64">
                {/* Simple Bar Chart Visualization */}
                <div className="flex items-end justify-around h-full pb-8">
                  {healthTrend.map((point, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                      <div className="relative w-full flex justify-center items-end h-full">
                        <div
                          className="w-16 bg-gradient-to-t from-[#159eec] to-[#02ddcd] rounded-t-lg hover:opacity-80 transition-all cursor-pointer"
                          style={{ height: `${point.value}%` }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#1f2b6c] text-white text-xs px-2 py-1 rounded font-semibold">
                            {point.value}%
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 font-medium">{point.date}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 border-t-2 border-gray-200"></div>
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                Patient recovery progress over the last 9 days
              </p>
            </div>

            {/* Doctor Notes */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-[#1f2b6c] mb-4 flex items-center gap-2">
                <span className="text-2xl">📝</span>
                Clinical Notes
              </h3>
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                <p className="text-gray-700 leading-relaxed">
                  {patientData.doctorNotes}
                </p>
                {patientData.followUpDate && (
                  <div className="mt-4 pt-4 border-t border-yellow-200">
                    <p className="text-sm text-gray-600">
                      <strong>Follow-up Date:</strong> {patientData.followUpDate}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-[#1f2b6c] mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md">
                  <span className="text-2xl mb-2 block">🩺</span>
                  <span className="text-sm font-semibold">Order Tests</span>
                </button>
                <button className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-md">
                  <span className="text-2xl mb-2 block">💊</span>
                  <span className="text-sm font-semibold">Prescribe Meds</span>
                </button>
                <button className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-md">
                  <span className="text-2xl mb-2 block">📅</span>
                  <span className="text-sm font-semibold">Schedule Follow-up</span>
                </button>
                <button className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md">
                  <span className="text-2xl mb-2 block">🚨</span>
                  <span className="text-sm font-semibold">Mark Urgent</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Chat Interface */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col sticky top-6" style={{ height: "calc(100vh - 120px)" }}>
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-[#1f2b6c] to-[#159eec] text-white p-6">
                <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                  <span className="text-2xl">💬</span>
                  Patient Chat
                </h2>
                <p className="text-blue-100 text-sm">
                  Real-time communication
                </p>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages?.data?.map((message: any) => {
                  const isAI = message.flags?.includes("AI_AUTO_REPLY");
                  const isPatient = !isAI;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isPatient ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex gap-2 max-w-[85%] ${isPatient ? "flex-row-reverse" : "flex-row"}`}>
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isPatient 
                            ? "bg-gradient-to-br from-blue-500 to-blue-600" 
                            : "bg-gradient-to-br from-green-500 to-green-600"
                        }`}>
                          <span className="text-white text-sm font-bold">
                            {isPatient ? "P" : "AI"}
                          </span>
                        </div>
                        
                        {/* Message Bubble */}
                        <div>
                          <div
                            className={`rounded-2xl p-4 shadow-md ${
                              isPatient
                                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-none"
                                : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.content.en}</p>
                          </div>
                          
                          {/* Timestamp */}
                          <p className={`text-xs mt-1 px-2 ${
                            isPatient ? "text-right text-gray-500" : "text-left text-gray-500"
                          }`}>
                            {new Date(message.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {isAI && " • AI Assistant"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input */}
              <div className="border-t p-4 bg-white">
                <div className="flex gap-2 mb-3">
                  <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold hover:bg-blue-200 transition-colors">
                    Quick Reply
                  </button>
                  <button className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold hover:bg-green-200 transition-colors">
                    Template
                  </button>
                </div>

                <div className="flex gap-2">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type message..."
                    className="text-black flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#159eec] focus:ring-2 focus:ring-[#159eec]/20 resize-none text-sm"
                    rows={2}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isPending}
                    className="bg-gradient-to-br from-[#159eec] to-[#1f2b6c] text-white px-4 rounded-xl hover:opacity-90 transition-all font-semibold self-end disabled:opacity-50"
                  >
                    {isPending ? "..." : "📤"}
                  </button>
                </div>

                <p className="text-xs text-gray-400 mt-2 text-center">
                  🔒 HIPAA Compliant • End-to-End Encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
