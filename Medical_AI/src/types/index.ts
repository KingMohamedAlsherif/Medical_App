// Core types for the AI Triage System

export interface Message {
  id: string;
  sessionId: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface User {
  id: string;
  email: string;
  password: string; // In production, this should be hashed
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: string[];
  allergies: string[];
  currentMedications: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  id: string;
  userId: string;
  user: User;
  isAuthenticated: boolean;
  loginTime: Date;
  lastActivity: Date;
}

export interface ChatSession {
  id: string;
  userId?: string;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

export interface TriageResult {
  isEmergency: boolean;
  confidence: number;
  explanation: string;
  reasoning: string;
  suggestedSpecialty?: string;
  redFlags?: string[];
}

export interface MedicalSpecialty {
  id: string;
  name: string;
  keywords: string[];
  description: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  availableSlots: string[];
  description?: string;
}

export interface Appointment {
  id: string;
  userId: string;
  sessionId: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  scheduledTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  symptoms?: string[];
  triageResult?: TriageResult;
  createdAt: Date;
  updatedAt: Date;
}

export interface TriageLog {
  id: string;
  sessionId: string;
  messageId: string;
  result: TriageResult;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
}

export interface ChatResponse {
  sessionId: string;
  response: string;
  triageResult: TriageResult;
  suggestedActions?: string[];
}

export interface BookingRequest {
  sessionId: string;
  specialty: string;
  preferredTime?: string;
}

export interface BookingResponse {
  success: boolean;
  appointment?: Appointment;
  message: string;
  error?: string;
}

// Emergency symptoms that always trigger emergency classification
export const EMERGENCY_SYMPTOMS = [
  'chest pain',
  'severe bleeding',
  'shortness of breath',
  'difficulty breathing',
  'severe headache',
  'stroke symptoms',
  'loss of consciousness',
  'severe allergic reaction',
  'severe burns',
  'choking',
  'severe abdominal pain',
  'severe trauma',
  'suicide',
  'overdose',
  'heart attack',
  'seizure',
  'severe vomiting blood',
  'cannot breathe',
  'unconscious',
  'severe head injury'
];

// Specialty mapping based on symptoms/keywords
export const SPECIALTY_KEYWORDS: Record<string, string[]> = {
  'Cardiology': [
    'heart', 'palpitations', 'cardiac', 'chest discomfort', 'irregular heartbeat',
    'high blood pressure', 'hypertension', 'heart murmur', 'chest tightness'
  ],
  'Dermatology': [
    'rash', 'skin', 'acne', 'mole', 'eczema', 'psoriasis', 'dermatitis',
    'skin condition', 'itchy skin', 'skin lesion', 'birthmark'
  ],
  'Orthopedics': [
    'joint pain', 'back pain', 'knee pain', 'shoulder pain', 'arthritis',
    'bone', 'fracture', 'sprain', 'muscle pain', 'sports injury'
  ],
  'Neurology': [
    'headache', 'migraine', 'dizziness', 'numbness', 'tingling',
    'memory problems', 'nerve pain', 'neurological', 'brain'
  ],
  'Gastroenterology': [
    'stomach pain', 'digestive', 'nausea', 'vomiting', 'diarrhea',
    'constipation', 'acid reflux', 'heartburn', 'abdominal pain'
  ],
  'Pulmonology': [
    'cough', 'breathing problems', 'asthma', 'lung', 'respiratory',
    'wheezing', 'bronchitis', 'pneumonia'
  ],
  'Ophthalmology': [
    'eye', 'vision', 'blurry vision', 'eye pain', 'eye infection',
    'glasses', 'contacts', 'visual problems'
  ],
  'ENT': [
    'ear', 'nose', 'throat', 'sinus', 'hearing', 'tinnitus',
    'sore throat', 'ear infection', 'nasal congestion'
  ],
  'Psychiatry': [
    'depression', 'anxiety', 'stress', 'mental health', 'panic',
    'mood', 'sleep problems', 'insomnia', 'therapy'
  ],
  'Gynecology': [
    'women health', 'period', 'menstrual', 'pregnancy', 'gynecological',
    'pelvic pain', 'reproductive health'
  ],
  'Urology': [
    'urinary', 'bladder', 'kidney', 'prostate', 'urination problems',
    'kidney stones', 'urinary tract infection'
  ],
  'Endocrinology': [
    'diabetes', 'thyroid', 'hormone', 'blood sugar', 'metabolism',
    'insulin', 'endocrine'
  ]
};

// Authentication interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export type SafeUser = Omit<User, 'password'>;

export interface LoginResponse {
  success: boolean;
  sessionId?: string;
  user?: SafeUser;
  message: string;
  error?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
}

export interface RegisterResponse {
  success: boolean;
  user?: SafeUser;
  message: string;
  error?: string;
}