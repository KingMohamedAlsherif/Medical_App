'use client';

import { useState } from 'react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface TriageResult {
  isEmergency: boolean;
  confidence: number;
  explanation: string;
  reasoning: string;
  suggestedSpecialty?: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [appointmentBooked, setAppointmentBooked] = useState(false);

  const createSession = async () => {
    try {
      const response = await fetch('/api/session', {
        method: 'POST',
      });
      const data = await response.json();
      setSessionId(data.sessionId);
      
      // Add welcome message to UI
      const welcomeMsg: Message = {
        id: 'welcome',
        content: data.message || 'Welcome to Cleveland Clinic AI Triage Assistant',
        sender: 'ai',
        timestamp: new Date()
      };
      
      // Get the actual welcome message from the session
      const sessionResponse = await fetch(`/api/chat?sessionId=${data.sessionId}`);
      const sessionData = await sessionResponse.json();
      
      if (sessionData.messages && sessionData.messages.length > 0) {
        const formattedMessages = sessionData.messages.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(formattedMessages);
      } else {
        setMessages([welcomeMsg]);
      }
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    if (!sessionId) {
      await createSession();
      return;
    }

    setLoading(true);
    
    // Add user message to UI immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          sessionId,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        const aiMessage: Message = {
          id: Date.now().toString() + '_ai',
          content: data.response,
          sender: 'ai',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setTriageResult(data.triageResult);
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: Date.now().toString() + '_error',
        content: 'Sorry, there was an error processing your message. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const bookAppointment = async () => {
    if (!triageResult?.suggestedSpecialty || !sessionId) return;

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          specialty: triageResult.suggestedSpecialty,
        }),
      });

      const data = await response.json();
      
      const bookingMessage: Message = {
        id: Date.now().toString() + '_booking',
        content: data.message,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, bookingMessage]);
      
      // If booking was successful, set state and store session ID
      if (data.success) {
        setAppointmentBooked(true);
        // Store session ID in localStorage for dashboard access
        localStorage.setItem('currentSessionId', sessionId);
      }
    } catch (error) {
      console.error('Failed to book appointment:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            🏥 Cleveland Clinic AI Triage Assistant
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            AI-powered medical triage and appointment booking system
          </p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border h-[600px] flex flex-col">
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-4">🩺</div>
                <h2 className="text-xl font-semibold mb-2">Welcome to AI Triage</h2>
                <p className="text-sm">Click "Start New Chat" to begin your medical consultation</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </div>
                    <div className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <span className="text-sm text-gray-600">AI is analyzing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Triage Result Display */}
          {triageResult && (
            <div className="border-t p-4 bg-gray-50">
              <div className={`rounded-lg p-3 ${
                triageResult.isEmergency 
                  ? 'bg-red-50 border border-red-200' 
                  : 'bg-green-50 border border-green-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg ${
                        triageResult.isEmergency ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {triageResult.isEmergency ? '🚨' : '✅'}
                      </span>
                      <span className="font-semibold text-sm">
                        {triageResult.isEmergency ? 'Emergency Detected' : 'Non-Emergency'}
                      </span>
                      <span className="text-xs text-gray-600">
                        ({Math.round(triageResult.confidence * 100)}% confidence)
                      </span>
                    </div>
                    {triageResult.suggestedSpecialty && !triageResult.isEmergency && (
                      <p className="text-sm text-gray-700 mt-1">
                        Recommended: <strong>{triageResult.suggestedSpecialty}</strong>
                      </p>
                    )}
                  </div>
                  {triageResult.suggestedSpecialty && !triageResult.isEmergency && (
                    <button
                      onClick={bookAppointment}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Book Appointment
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              {!sessionId ? (
                <button
                  onClick={createSession}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start New Chat
                </button>
              ) : (
                <>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe your symptoms or health concerns..."
                    className="text-black flex-1 border rounded-lg px-3 py-2 text-sm resize-none"
                    rows={2}
                    disabled={loading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Send
                  </button>
                </>
              )}
            </div>
            {sessionId && (
              <div className="mt-2 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Session ID: {sessionId} • Press Enter to send
                </div>
                {appointmentBooked && (
                  <button
                    onClick={() => window.location.href = `/dashboard?session=${sessionId}`}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    📊 View Dashboard
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <p className="text-xs text-gray-500 text-center">
            ⚠️ This AI assistant does not replace professional medical advice. 
            Always consult with a healthcare provider for proper diagnosis and treatment.
          </p>
        </div>
      </div>
    </div>
  );
}
