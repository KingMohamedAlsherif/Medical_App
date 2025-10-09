'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ConversationState, ConversationalChatResponse } from '@/types';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function ConversationalTriagePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [conversationState, setConversationState] = useState<ConversationState | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add initial greeting
    const initialMessage: Message = {
      id: '1',
      content: "👋 Welcome to our AI Medical Triage System! I'll help assess your symptoms and guide you to appropriate care. Let's start by getting to know you better.",
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat/conversational', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          sessionId: sessionId || undefined,
          conversationState: conversationState
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ConversationalChatResponse = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setSessionId(data.sessionId);
      setConversationState(data.conversationState);
      setIsComplete(data.isComplete);

      // Show patient summary if available
      if (data.patientSummary && data.isComplete) {
        setTimeout(() => {
          const summaryMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: data.patientSummary!,
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, summaryMessage]);
        }, 1000);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, there was an error processing your message. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetConversation = () => {
    setMessages([{
      id: '1',
      content: "👋 Welcome to our AI Medical Triage System! I'll help assess your symptoms and guide you to appropriate care. Let's start by getting to know you better.",
      sender: 'ai',
      timestamp: new Date()
    }]);
    setInput('');
    setSessionId('');
    setConversationState(null);
    setIsComplete(false);
  };

  const getStageDisplay = () => {
    if (!conversationState) return 'Starting';
    
    const stageMap = {
      greeting: 'Starting Conversation',
      collecting_basic_info: 'Collecting Personal Information',
      collecting_symptoms: 'Describing Symptoms',
      follow_up_questions: 'Answering Follow-up Questions',
      specialist_recommendation: 'Reviewing Recommendations',
      booking: 'Booking Appointment'
    };
    
    return stageMap[conversationState.stage] || conversationState.stage;
  };

  const getProgressPercentage = () => {
    if (!conversationState) return 0;
    
    const progressMap = {
      greeting: 10,
      collecting_basic_info: 30,
      collecting_symptoms: 50,
      follow_up_questions: 70,
      specialist_recommendation: 90,
      booking: 100
    };
    
    return progressMap[conversationState.stage] || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🩺 Conversational Medical Triage
          </h1>
          <p className="text-gray-600">
            AI-powered medical assessment with structured data collection
          </p>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress: {getStageDisplay()}</span>
              <span>{getProgressPercentage()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>

          {/* Patient Info Display */}
          {conversationState?.patientData && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Patient Information:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                {conversationState.patientData.name && (
                  <div><strong>Name:</strong> {conversationState.patientData.name}</div>
                )}
                {conversationState.patientData.age && (
                  <div><strong>Age:</strong> {conversationState.patientData.age}</div>
                )}
                {conversationState.patientData.gender && (
                  <div><strong>Gender:</strong> {conversationState.patientData.gender}</div>
                )}
                {conversationState.suggestedSpecialty && (
                  <div><strong>Specialty:</strong> {conversationState.suggestedSpecialty}</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-lg shadow-lg flex flex-col h-96">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-bounce">●</div>
                    <div className="animate-bounce" style={{ animationDelay: '0.1s' }}>●</div>
                    <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isComplete ? "Conversation completed. Start a new one!" : "Type your message..."}
                disabled={loading || isComplete}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim() || isComplete}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-between mt-3">
              <button
                onClick={resetConversation}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Start New Conversation
              </button>
              
              {isComplete && (
                <div className="text-sm text-green-600 font-medium">
                  ✅ Assessment Complete
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">How it works:</h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-700">
            <li>The AI will greet you and collect basic information (name, age, gender)</li>
            <li>You'll be asked about any chronic conditions you may have</li>
            <li>Describe your current symptoms in detail</li>
            <li>The AI will analyze for emergency indicators based on your profile</li>
            <li>If not an emergency, you'll answer follow-up questions</li>
            <li>You'll receive a specialist recommendation and option to book</li>
            <li>A complete medical summary will be generated</li>
          </ol>
        </div>
      </div>
    </div>
import Link from "next/link";
import TopHeader from "@/app/components/TopHeader";
import LogoHead from "@/app/components/LogoHead";
import FullHeader from "@/app/components/FullHeader";
import Navibar from "@/app/components/NaviBar";
import LandingPage from "@/app/components/LandingPage";
import HomePage from "@/app/components/HomePage";

export default function Home() {
  return (
  <main>
	{/* <FullHeader />
	<Navibar />
	<LandingPage />
	<h1>Banana Ooyu</h1> */}

	<HomePage />
</main>
  );
}