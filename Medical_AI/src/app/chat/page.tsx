'use client';

import { useState } from 'react';
import FullHeader from '../components/FullHeader';

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

export default function ChatPage() {
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
	  
	  const welcomeMsg: Message = {
		id: 'welcome',
		content: data.message || 'Welcome to Cleveland Clinic AI Triage Assistant',
		sender: 'ai',
		timestamp: new Date()
	  };
	  
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
	  
	  if (data.success) {
		setAppointmentBooked(true);
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
	<div className="min-h-screen bg-gray-50">
	  {/* Top Header */}
		<FullHeader />

	  {/* Main Chat Section */}
	  <section className="py-8 md:py-12">
		<div className="max-w-5xl mx-auto px-4">
		  {/* Header */}
		  <div className="text-center mb-8">
			<p className="text-blue-600 font-semibold mb-2 tracking-wider text-sm">AI-POWERED TRIAGE</p>
			<h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
			  AI Medical Assistant
			</h1>
			<p className="text-gray-600 max-w-2xl mx-auto">
			  Describe your symptoms and our AI will help determine the urgency and recommend the appropriate specialist
			</p>
		  </div>

		  {/* Chat Container */}
		  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
			{/* Chat Header */}
			<div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6">
			  <div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
				  <div>
					<h2 className="text-lg font-bold">Cleveland Clinic AI</h2>
					<p className="text-blue-200 text-sm">
					  {sessionId ? 'Online • Ready to help' : 'Click start to begin'}
					</p>
				  </div>
				</div>
				{sessionId && (
				  <div className="text-xs text-blue-200 bg-blue-800 px-3 py-1 rounded-full">
					Session: {sessionId.slice(0, 8)}...
				  </div>
				)}
			  </div>
			</div>

			{/* Messages Area */}
			<div className="h-[500px] md:h-[600px] overflow-y-auto p-6 bg-gray-50">
			  {messages.length === 0 ? (
				<div className="flex flex-col items-center justify-center h-full text-center">
				  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-4xl mb-4">
					🩺
				  </div>
				  <h3 className="text-xl font-bold text-blue-900 mb-2">
					Welcome to AI Medical Triage
				  </h3>
				  <p className="text-gray-600 mb-6 max-w-md">
					Our AI assistant will help assess your symptoms and guide you to the right care
				  </p>
				  <button
					onClick={createSession}
					className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors font-semibold shadow-md"
				  >
					Start Consultation
				  </button>
				</div>
			  ) : (
				<div className="space-y-4">
				  {messages.map((message) => (
					<div
					  key={message.id}
					  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
					>
					  <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
						<div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
						  message.sender === 'user' ? 'bg-blue-600' : 'bg-blue-900'
						}`}>
						  <span className="text-white text-sm">
							{message.sender === 'user' ? '👤' : '🤖'}
						  </span>
						</div>
						<div>
						  <div
							className={`rounded-lg px-4 py-3 ${
							  message.sender === 'user'
								? 'bg-blue-600 text-white'
								: 'bg-white text-gray-800 border border-gray-200'
							}`}
						  >
							<div className="whitespace-pre-wrap text-sm leading-relaxed">
							  {message.content}
							</div>
						  </div>
						  <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'} text-gray-500`}>
							{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
						  </div>
						</div>
					  </div>
					</div>
				  ))}
				  {loading && (
					<div className="flex justify-start">
					  <div className="flex gap-3">
						<div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center">
						  <span className="text-white text-sm">🤖</span>
						</div>
						<div className="bg-white rounded-lg px-4 py-3 border border-gray-200">
						  <div className="flex items-center gap-2">
							<div className="flex gap-1">
							  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
							  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
							  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
							</div>
							<span className="text-sm text-gray-600">AI is analyzing...</span>
						  </div>
						</div>
					  </div>
					</div>
				  )}
				</div>
			  )}
			</div>

			{/* Triage Result Banner */}
			{triageResult && (
			  <div className={`border-t p-4 ${
				triageResult.isEmergency ? 'bg-red-50' : 'bg-green-50'
			  }`}>
				<div className="flex items-center justify-between">
				  <div className="flex items-center gap-3 flex-1">
					<div className={`w-10 h-10 rounded-full flex items-center justify-center ${
					  triageResult.isEmergency ? 'bg-red-100' : 'bg-green-100'
					}`}>
					  <span className="text-2xl">
						{triageResult.isEmergency ? '🚨' : '✅'}
					  </span>
					</div>
					<div>
					  <div className="flex items-center gap-2">
						<span className={`font-bold ${
						  triageResult.isEmergency ? 'text-red-700' : 'text-green-700'
						}`}>
						  {triageResult.isEmergency ? 'Emergency Detected' : 'Non-Emergency Assessment'}
						</span>
						<span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">
						  {Math.round(triageResult.confidence * 100)}% confidence
						</span>
					  </div>
					  {triageResult.suggestedSpecialty && !triageResult.isEmergency && (
						<p className="text-sm text-gray-700 mt-1">
						  Recommended Specialty: <strong>{triageResult.suggestedSpecialty}</strong>
						</p>
					  )}
					</div>
				  </div>
				  {triageResult.suggestedSpecialty && !triageResult.isEmergency && (
					<button
					  onClick={bookAppointment}
					  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-semibold shadow-md"
					>
					  Book Appointment
					</button>
				  )}
				</div>
			  </div>
			)}

			{/* Input Area */}
			<div className="border-t bg-white p-4">
			  {!sessionId ? (
				<button
				  onClick={createSession}
				  className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg shadow-md"
				>
				  Start New Consultation
				</button>
			  ) : (
				<div className="space-y-3">
				  <div className="flex gap-2">
					<textarea
					  value={input}
					  onChange={(e) => setInput(e.target.value)}
					  onKeyPress={handleKeyPress}
					  placeholder="Describe your symptoms or health concerns in detail..."
					  className="text-black flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
					  rows={3}
					  disabled={loading}
					/>
					<button
					  onClick={sendMessage}
					  disabled={loading || !input.trim()}
					  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold self-end shadow-md"
					>
					  <span className="hidden md:inline">Send</span>
					  <span className="md:hidden">➤</span>
					</button>
				  </div>
				  <div className="flex items-center justify-between text-xs text-gray-500">
					<span>💡 Press Enter to send • Shift+Enter for new line</span>
					{appointmentBooked && (
					  <button
						onClick={() => window.location.href = `/dashboard?session=${sessionId}`}
						className="bg-green-600 text-white px-4 py-1 rounded-full hover:bg-green-700 transition-colors font-semibold"
					  >
						📊 Dashboard
					  </button>
					)}
				  </div>
				</div>
			  )}
			</div>
		  </div>

		  {/* Disclaimer */}
		  <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
			<p className="text-sm text-yellow-800">
			  ⚠️ <strong>Disclaimer:</strong> This AI assistant does not replace professional medical advice. 
			  For emergencies, call emergency services immediately. Always consult with a healthcare provider for proper diagnosis and treatment.
			</p>
		  </div>
		</div>
	  </section>

	  {/* Footer */}
	  <footer className="bg-blue-900 text-white py-8 mt-12">
		<div className="max-w-7xl mx-auto px-4 text-center">
		  <p className="text-sm text-blue-200">
			© 2025 Cleveland Clinic Abu Dhabi • All Rights Reserved
		  </p>
		</div>
	  </footer>
	</div>
  );
}