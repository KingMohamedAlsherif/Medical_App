"use client";

import React, { useState } from "react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
}

interface AppointmentDetails {
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  doctor: string;
  department: string;
  appointmentType: string;
  status: "scheduled" | "updated" | "emergency";
}

const AppointmentDashboard = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Your appointment has been confirmed! If you need to provide any updates or have concerns before your appointment, feel free to message me here.",
      sender: "ai",
      timestamp: "10:30 AM"
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState("");
  const [appointmentStatus, setAppointmentStatus] = useState<"scheduled" | "updated" | "emergency">("scheduled");

  // Mock appointment data - will come from backend
  const appointment: AppointmentDetails = {
    patientName: "John Doe",
    appointmentDate: "October 15, 2025",
    appointmentTime: "2:30 PM",
    doctor: "Dr. Sarah Johnson",
    department: "Cardiology",
    appointmentType: "Follow-up Consultation",
    status: appointmentStatus
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: "I've received your update. Let me review your information and I'll get back to you shortly.",
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Your Appointment Dashboard</h1>
          <p className="text-gray-600">Manage your appointment and communicate with our AI assistant</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Appointment Details Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-blue-900">Appointment Details</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  appointment.status === "scheduled" ? "bg-green-100 text-green-700" :
                  appointment.status === "updated" ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {appointment.status === "scheduled" ? "Scheduled" :
                   appointment.status === "updated" ? "Updated" : "Emergency"}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">👤</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Patient Name</p>
                    <p className="font-semibold text-blue-900">{appointment.patientName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📅</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                    <p className="font-semibold text-blue-900">{appointment.appointmentDate}</p>
                    <p className="text-sm text-gray-600">{appointment.appointmentTime}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">👨‍⚕️</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Doctor</p>
                    <p className="font-semibold text-blue-900">{appointment.doctor}</p>
                    <p className="text-sm text-gray-600">{appointment.department}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🩺</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Appointment Type</p>
                    <p className="font-semibold text-blue-900">{appointment.appointmentType}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  Reschedule Appointment
                </button>
                <button className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold">
                  Cancel Appointment
                </button>
              </div>
            </div>

            
          </div>

          {/* AI Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[700px]">
              {/* Chat Header */}
              <div className="bg-blue-900 text-white p-6">
                <h2 className="text-xl font-bold mb-2">AI Medical Assistant</h2>
                <p className="text-blue-200 text-sm">
                  Share any updates, symptoms, or concerns before your appointment
                </p>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-4 ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`text-xs mt-2 ${
                          message.sender === "user" ? "text-blue-200" : "text-gray-500"
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="border-t p-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex gap-2 mb-3">
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold hover:bg-blue-200 transition-colors">
                      New Symptoms
                    </button>
                    <button className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold hover:bg-yellow-200 transition-colors">
                      Update Info
                    </button>
                    <button className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold hover:bg-red-200 transition-colors">
                      Emergency
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message here... (Press Enter to send)"
                      className="text-black flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 resize-none"
                      rows={3}
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold self-end"
                    >
                      Send
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-2 text-center">
                  All conversations are encrypted and HIPAA compliant
                </p>
              </div>
            </div>

            {/* Chat History Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-blue-900 mb-4">Previous Interactions Summary</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Initial Booking:</strong> Patient reported chest discomfort during physical activity
                  </p>
                  <p className="text-xs text-gray-500">October 1, 2025</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Follow-up:</strong> Symptoms reduced after medication adjustment
                  </p>
                  <p className="text-xs text-gray-500">October 8, 2025</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDashboard;