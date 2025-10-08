'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Appointment {
  id: string;
  sessionId: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  scheduledTime: string;
  status: string;
  createdAt: Date;
}

interface SessionData {
  id: string;
  messages: Array<{
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
  }>;
  triageResult?: {
    isEmergency: boolean;
    explanation: string;
    suggestedSpecialty?: string;
  };
}

interface CaseUpdate {
  id: string;
  content: string;
  timestamp: Date;
  type: 'symptom' | 'question' | 'concern' | 'improvement';
}

export default function Dashboard() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>('');
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [caseUpdates, setCaseUpdates] = useState<CaseUpdate[]>([]);
  const [newUpdate, setNewUpdate] = useState('');
  const [updateType, setUpdateType] = useState<'symptom' | 'question' | 'concern' | 'improvement'>('symptom');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get session ID from URL or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const sessionParam = urlParams.get('session');
    const storedSession = localStorage.getItem('currentSessionId');
    
    const currentSession = sessionParam || storedSession;
    
    if (currentSession) {
      setSessionId(currentSession);
      loadDashboardData(currentSession);
    } else {
      setError('No session found. Please start a new consultation.');
      setLoading(false);
    }
  }, []);

  const loadDashboardData = async (sessionId: string) => {
    try {
      setLoading(true);
      
      // Load appointment data
      const appointmentResponse = await fetch(`/api/booking?sessionId=${sessionId}`);
      const appointmentData = await appointmentResponse.json();
      
      if (appointmentData.appointments && appointmentData.appointments.length > 0) {
        setAppointment(appointmentData.appointments[0]); // Get the latest appointment
      }
      
      // Load session data
      const sessionResponse = await fetch(`/api/session?sessionId=${sessionId}`);
      const sessionInfo = await sessionResponse.json();
      
      if (sessionInfo.session) {
        setSessionData(sessionInfo.session);
      }
      
      // Load existing case updates (from localStorage for now)
      const savedUpdates = localStorage.getItem(`caseUpdates_${sessionId}`);
      if (savedUpdates) {
        setCaseUpdates(JSON.parse(savedUpdates));
      }
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addCaseUpdate = () => {
    if (!newUpdate.trim()) return;
    
    const update: CaseUpdate = {
      id: Date.now().toString(),
      content: newUpdate.trim(),
      timestamp: new Date(),
      type: updateType
    };
    
    const updatedCaseUpdates = [...caseUpdates, update];
    setCaseUpdates(updatedCaseUpdates);
    
    // Save to localStorage (in a real app, this would be saved to a database)
    localStorage.setItem(`caseUpdates_${sessionId}`, JSON.stringify(updatedCaseUpdates));
    
    setNewUpdate('');
  };

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'symptom': return '🩺';
      case 'question': return '❓';
      case 'concern': return '⚠️';
      case 'improvement': return '✅';
      default: return '📝';
    }
  };

  const getUpdateColor = (type: string) => {
    switch (type) {
      case 'symptom': return 'bg-red-50 border-red-200';
      case 'question': return 'bg-blue-50 border-blue-200';
      case 'concern': return 'bg-yellow-50 border-yellow-200';
      case 'improvement': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const extractSymptoms = () => {
    if (!sessionData?.messages) return 'No symptoms recorded';
    
    const userMessages = sessionData.messages
      .filter(msg => msg.sender === 'user')
      .map(msg => msg.content)
      .join(' ');
    
    return userMessages || 'No symptoms recorded';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Start New Consultation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🏥 Patient Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage your consultation and appointment details
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/')}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                New Consultation
              </button>
              {appointment && (
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Contact Doctor
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Appointment & Doctor Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Appointment Details */}
            {appointment ? (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    📅 Appointment Details
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    appointment.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Doctor</label>
                      <p className="text-lg font-semibold text-gray-900">{appointment.doctorName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Specialty</label>
                      <p className="text-gray-900">{appointment.specialty}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date & Time</label>
                      <p className="text-gray-900">{appointment.scheduledTime}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Appointment ID</label>
                      <p className="text-sm text-gray-600 font-mono">{appointment.id}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">📍 Location & Preparation</h3>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>• <strong>Location:</strong> Cleveland Clinic Main Campus, 9500 Euclid Avenue</p>
                    <p>• <strong>Arrive:</strong> 15 minutes early for check-in</p>
                    <p>• <strong>Bring:</strong> Valid ID, insurance card, current medications list</p>
                    <p>• <strong>Contact:</strong> (216) 444-2200 for changes</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <div className="text-gray-400 text-4xl mb-3">📅</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Appointment Scheduled</h3>
                <p className="text-gray-600">Book an appointment to see details here.</p>
              </div>
            )}

            {/* Patient Problem & Symptoms */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                🩺 Medical Summary
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">Reported Symptoms</label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900">{extractSymptoms()}</p>
                  </div>
                </div>
                
                {sessionData?.triageResult && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-2 block">AI Assessment</label>
                    <div className={`rounded-lg p-4 ${
                      sessionData.triageResult.isEmergency 
                        ? 'bg-red-50 border border-red-200' 
                        : 'bg-green-50 border border-green-200'
                    }`}>
                      <div className="flex items-center mb-2">
                        <span className="text-lg mr-2">
                          {sessionData.triageResult.isEmergency ? '🚨' : '✅'}
                        </span>
                        <span className={`font-medium ${
                          sessionData.triageResult.isEmergency ? 'text-red-800' : 'text-green-800'
                        }`}>
                          {sessionData.triageResult.isEmergency ? 'Emergency Case' : 'Non-Emergency Case'}
                        </span>
                      </div>
                      <p className={`text-sm ${
                        sessionData.triageResult.isEmergency ? 'text-red-700' : 'text-green-700'
                      }`}>
                        {sessionData.triageResult.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Case Updates History */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                📝 Case Updates
              </h2>
              
              <div className="space-y-3 mb-6">
                {caseUpdates.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No updates added yet</p>
                ) : (
                  caseUpdates.map((update) => (
                    <div key={update.id} className={`p-3 rounded-lg border ${getUpdateColor(update.type)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-2 flex-1">
                          <span className="text-lg">{getUpdateIcon(update.type)}</span>
                          <div className="flex-1">
                            <p className="text-gray-900">{update.content}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(update.timestamp)} • {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Add Updates */}
          <div className="space-y-6">
            
            {/* Add New Update */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ➕ Add Case Update
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Type
                  </label>
                  <select
                    value={updateType}
                    onChange={(e) => setUpdateType(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="symptom">🩺 New Symptom</option>
                    <option value="question">❓ Question</option>
                    <option value="concern">⚠️ Concern</option>
                    <option value="improvement">✅ Improvement</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newUpdate}
                    onChange={(e) => setNewUpdate(e.target.value)}
                    placeholder="Describe your update, new symptoms, questions, or concerns..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={4}
                  />
                </div>
                
                <button
                  onClick={addCaseUpdate}
                  disabled={!newUpdate.trim()}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Add Update
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ⚡ Quick Actions
              </h3>
              
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">📞</span>
                    <div>
                      <p className="font-medium text-gray-900">Contact Doctor</p>
                      <p className="text-sm text-gray-600">Call or message your doctor</p>
                    </div>
                  </div>
                </button>
                
                <button className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">📄</span>
                    <div>
                      <p className="font-medium text-gray-900">View Records</p>
                      <p className="text-sm text-gray-600">Access your medical history</p>
                    </div>
                  </div>
                </button>
                
                <button className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">🗓️</span>
                    <div>
                      <p className="font-medium text-gray-900">Reschedule</p>
                      <p className="text-sm text-gray-600">Change appointment time</p>
                    </div>
                  </div>
                </button>
                
                <button className="w-full text-left p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors text-red-700">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">🚨</span>
                    <div>
                      <p className="font-medium">Emergency Contact</p>
                      <p className="text-sm">Call 911 or go to ER</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Session Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ℹ️ Session Info
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Session ID:</span>
                  <span className="font-mono text-gray-900">{sessionId.slice(0, 8)}...</span>
                </div>
                {sessionData && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="text-gray-900">{formatDate(sessionData.messages[0]?.timestamp || new Date())}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Updates:</span>
                  <span className="text-gray-900">{caseUpdates.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-xs text-gray-500 text-center">
            ⚠️ This dashboard is for informational purposes only. For medical emergencies, call 911 immediately.
            Always consult with healthcare professionals for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}