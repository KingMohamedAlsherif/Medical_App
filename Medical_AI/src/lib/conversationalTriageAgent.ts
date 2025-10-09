import { TriageResult } from '@/types';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface PatientData {
  name?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  knownConditions?: string[];
  newPatient?: boolean;
  symptoms?: string;
}

export interface IntakeData {
  symptoms?: string;
  duration?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  redFlagsDetected?: boolean;
}

export interface TriageData {
  isEmergency: boolean;
  reason?: string;
  confidence?: number;
  recommendedSpecialty?: string;
}

export interface BookingData {
  doctorName?: string;
  specialty?: string;
  date?: string;
  confirmationId?: string;
}

export interface AuditEntry {
  timestamp: string;
  agent: string;
  action: string;
  reasoning: string;
  confidence?: number;
}

export interface SessionContext {
  user: PatientData;
  intake: IntakeData;
  triage: TriageData;
  booking: BookingData;
  audit: AuditEntry[];
}

export interface ConversationState {
  sessionContext: SessionContext;
  conversationHistory: Array<{role: 'user' | 'assistant', content: string}>;
  currentPhase: 'intake' | 'emergency' | 'specialty' | 'booking' | 'summary' | 'complete';
  triageResult?: TriageResult;
  isComplete?: boolean;
}

export class ConversationalTriageAgent {
  private static genAI: GoogleGenerativeAI | null = null;
  private static readonly MEDICAL_DISCLAIMER = "\n\n⚠️ **Medical Disclaimer:** This AI assistant provides guidance only and does not replace professional medical advice. Always consult with a healthcare provider for proper diagnosis and treatment.";

  private static initializeAI() {
    if (!this.genAI) {
      const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Google AI API key not found. Please set GOOGLE_AI_API_KEY or GEMINI_API_KEY');
      }
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
    return this.genAI;
  }

  static initializeConversation(): ConversationState {
    return {
      sessionContext: {
        user: {},
        intake: {},
        triage: {
          isEmergency: false
        },
        booking: {},
        audit: []
      },
      conversationHistory: [],
      currentPhase: 'intake'
    };
  }

  private static createSystemPrompt(): string {
    return `You are an empathetic AI Medical Triage Assistant for Cleveland Clinic Abu Dhabi.

CRITICAL RULES:
1. ASK ONLY ONE QUESTION AT A TIME - Never ask multiple questions in one message
2. BE CONVERSATIONAL - Sound natural, warm, and empathetic  
3. ACKNOWLEDGE ANSWERS - Briefly acknowledge their response before asking next question
4. FOLLOW THE SEQUENCE - Complete intake before making recommendations

CONVERSATION FLOW:

STEP 1 - GREETING (First message only):
Say: "Hello! I'm here to help you find the right medical care. I'll ask you a few quick questions to understand your situation better. What brings you here today?"

STEP 2 - GET SYMPTOMS:
After greeting, let them describe symptoms. If they mention emergency keywords (chest pain, can't breathe, severe bleeding, unconscious, stroke, suicide), immediately respond with emergency message and stop.

STEP 3 - GET AGE:
After symptoms, ask: "Thank you for sharing that. Can you tell me your age?"

STEP 4 - GET GENDER:
After age, ask: "And what is your gender?"

STEP 5 - GET MEDICAL HISTORY:
After gender, ask: "Do you have any existing medical conditions like diabetes, hypertension, or heart disease? If none, just say none."

STEP 6 - GET DURATION:
After history, ask: "How long have you been experiencing these symptoms?"

STEP 7 - GET SEVERITY:
After duration, ask: "On a scale, would you describe the severity as mild, moderate, or severe?"

STEP 8 - MAKE RECOMMENDATION:
After collecting all 6 pieces of information, analyze symptoms and recommend specialty:
- Headache, dizziness, numbness → Neurology
- Stomach pain, nausea, vomiting → Gastroenterology
- Cough, wheezing, breathing issues → Pulmonology
- Rash, itching, skin issues → Dermatology
- Fever, fatigue, weakness → Internal Medicine
- Joint pain, back pain, swelling → Rheumatology/Orthopedics
- Heart palpitations (non-emergency) → Cardiology

Say: "Based on your symptoms, I recommend seeing a [SPECIALTY] specialist. [Brief reason]. Would you like help finding an appointment?"

EMERGENCY RESPONSE:
If ANY emergency keyword detected (chest pain, can't breathe, severe bleeding, unconscious, stroke, suicide), immediately say:

"⚠️ MEDICAL EMERGENCY DETECTED

This may be a medical emergency. Please:
🚨 Go to the Emergency Department immediately or
📞 Call 998 (UAE) or 911

Do not wait. Seek immediate medical attention."

Then stop asking questions.

GUIDELINES:
- Ask ONE question at a time
- Acknowledge answers warmly
- Use simple language
- Be empathetic
- Track what you've already asked
- Don't repeat questions

EXAMPLE:
User: "Hi"
You: "Hello! I'm here to help you find the right medical care. I'll ask you a few quick questions to understand your situation better. What brings you here today?"

User: "I have headaches"  
You: "I understand. Headaches can be concerning. Can you tell me your age?"

User: "29"
You: "Thank you. And what is your gender?"

MEDICAL DISCLAIMER:
Include at end: "This AI provides guidance only and does not replace professional medical advice. Always consult with a healthcare provider."`;
  }

  static async processMessage(message: string, state: ConversationState): Promise<{
    response: string;
    newState: ConversationState;
    isComplete: boolean;
    triageResult?: TriageResult;
    suggestedActions?: string[];
  }> {
    try {
      const genAI = this.initializeAI();
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const conversationHistory = [...state.conversationHistory];
      conversationHistory.push({ role: 'user', content: message });

      // Build context-aware prompt
      let prompt = this.createSystemPrompt();
      
      // Add current state context to help AI know what's been collected
      const collectedData = this.getCollectedDataSummary(state.sessionContext);
      if (collectedData) {
        prompt += `\n\nCURRENT SESSION DATA COLLECTED:\n${collectedData}\n`;
      }
      
      prompt += "\n\nCONVERSATION HISTORY:\n";
      
      conversationHistory.forEach((msg) => {
        const role = msg.role === 'user' ? 'Patient' : 'Assistant';
        prompt += `${role}: ${msg.content}\n`;
      });

      // Add specific instruction based on conversation stage
      const nextQuestion = this.determineNextQuestion(state.sessionContext, conversationHistory);
      if (nextQuestion) {
        prompt += `\n\nNEXT ACTION: ${nextQuestion}`;
      } else {
        prompt += `\n\nNEXT ACTION: All data collected. Analyze symptoms and recommend specialty.`;
      }

      const result = await model.generateContent(prompt);
      let aiResponse = result.response.text();

      const newState: ConversationState = {
        ...state,
        conversationHistory: [
          ...conversationHistory,
          { role: 'assistant', content: aiResponse }
        ],
        sessionContext: {
          ...state.sessionContext,
          user: this.extractPatientData(conversationHistory, aiResponse),
          intake: this.extractIntakeData(conversationHistory, aiResponse)
        }
      };

      const emergencyAnalysis = this.analyzeForEmergency(conversationHistory, aiResponse);
      
      // Update triage data in session context
      newState.sessionContext.triage = {
        isEmergency: emergencyAnalysis.isEmergency,
        reason: emergencyAnalysis.reason,
        confidence: emergencyAnalysis.confidence
      };

      // Log to audit
      newState.sessionContext.audit.push({
        timestamp: new Date().toISOString(),
        agent: emergencyAnalysis.isEmergency ? 'Emergency Detection Agent' : 'Intake Agent',
        action: emergencyAnalysis.isEmergency ? 'Emergency detected' : 'Data collection',
        reasoning: emergencyAnalysis.reason || 'Gathering patient information',
        confidence: emergencyAnalysis.confidence
      });

      const isComplete = this.shouldCompleteConversation(conversationHistory, aiResponse);
      newState.isComplete = isComplete;
      
      // Determine current phase
      if (emergencyAnalysis.isEmergency) {
        newState.currentPhase = 'emergency';
      } else if (isComplete) {
        newState.currentPhase = 'summary';
      } else if (conversationHistory.length >= 4) {
        newState.currentPhase = 'specialty';
      }

      let triageResult: TriageResult | undefined;
      let suggestedActions: string[] | undefined;

      if (emergencyAnalysis.isEmergency || isComplete) {
        triageResult = await this.generateTriageResult(conversationHistory, aiResponse, newState.sessionContext.user);
        newState.triageResult = triageResult;
        newState.sessionContext.triage.recommendedSpecialty = triageResult.suggestedSpecialty;
        suggestedActions = this.generateSuggestedActions(triageResult);
      }

      if (isComplete || emergencyAnalysis.isEmergency) {
        aiResponse += this.MEDICAL_DISCLAIMER;
      }

      return { response: aiResponse, newState, isComplete, triageResult, suggestedActions };

    } catch (error: any) {
      console.error('Error processing with Google AI:', error);
      return {
        response: "I apologize, but I'm having trouble right now. For medical emergencies, please call 911.",
        newState: state,
        isComplete: false
      };
    }
  }

  private static extractPatientData(conversationHistory: Array<{role: string, content: string}>, latestResponse: string): PatientData {
    const patientData: PatientData = {};
    const allText = conversationHistory.map(m => m.content).join(' ');
    const allTextLower = allText.toLowerCase();
    
    const nameMatch = allText.match(/(?:my name is|i'm|i am|call me)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    if (nameMatch) patientData.name = nameMatch[1].trim();

    const ageMatch = allTextLower.match(/(?:i'm|i am|age is)\s*(\d{1,3})/i);
    if (ageMatch) {
      const age = parseInt(ageMatch[1]);
      if (age > 0 && age < 120) patientData.age = age;
    }

    if (allTextLower.match(/\b(male|man)\b/i) && !allTextLower.match(/female/i)) {
      patientData.gender = 'male';
    } else if (allTextLower.match(/\b(female|woman)\b/i)) {
      patientData.gender = 'female';
    }

    const conditions: string[] = [];
    const commonConditions = ['diabetes', 'hypertension', 'heart disease', 'asthma', 'copd'];
    for (const condition of commonConditions) {
      if (allTextLower.includes(condition)) conditions.push(condition);
    }
    if (conditions.length > 0) patientData.knownConditions = conditions;

    return patientData;
  }

  private static extractIntakeData(conversationHistory: Array<{role: string, content: string}>, latestResponse: string): IntakeData {
    const intakeData: IntakeData = {};
    const allText = conversationHistory.map(m => m.content).join(' ');
    const allTextLower = allText.toLowerCase();

    // Extract symptoms
    const symptomIndicators = ['symptom', 'feel', 'pain', 'ache', 'hurt', 'sick', 'discomfort'];
    const userMessages = conversationHistory.filter(m => m.role === 'user').map(m => m.content).join(' ');
    if (userMessages) {
      intakeData.symptoms = userMessages.substring(0, 500); // Store full user description
    }

    // Extract duration
    const durationMatch = allTextLower.match(/(?:for|since|past)\s+(\d+)\s+(day|week|month|hour|minute)s?/i);
    if (durationMatch) {
      intakeData.duration = `${durationMatch[1]} ${durationMatch[2]}(s)`;
    }

    // Extract severity
    if (allTextLower.includes('severe') || allTextLower.includes('extreme') || allTextLower.includes('unbearable')) {
      intakeData.severity = 'severe';
    } else if (allTextLower.includes('moderate') || allTextLower.includes('significant')) {
      intakeData.severity = 'moderate';
    } else if (allTextLower.includes('mild') || allTextLower.includes('slight') || allTextLower.includes('minor')) {
      intakeData.severity = 'mild';
    }

    // Check for red flags
    const redFlags = ['chest pain', 'shortness of breath', 'bleeding', 'unconscious', 'severe', 'emergency'];
    intakeData.redFlagsDetected = redFlags.some(flag => allTextLower.includes(flag));

    return intakeData;
  }

  private static getCollectedDataSummary(sessionContext: SessionContext): string | null {
    const collected: string[] = [];
    
    if (sessionContext.user.age) collected.push(`Age: ${sessionContext.user.age}`);
    if (sessionContext.user.gender) collected.push(`Gender: ${sessionContext.user.gender}`);
    if (sessionContext.user.knownConditions && sessionContext.user.knownConditions.length > 0) {
      collected.push(`Conditions: ${sessionContext.user.knownConditions.join(', ')}`);
    }
    if (sessionContext.intake.symptoms) collected.push(`Symptoms described: Yes`);
    if (sessionContext.intake.duration) collected.push(`Duration: ${sessionContext.intake.duration}`);
    if (sessionContext.intake.severity) collected.push(`Severity: ${sessionContext.intake.severity}`);
    
    return collected.length > 0 ? collected.join('\n') : null;
  }

  private static determineNextQuestion(sessionContext: SessionContext, conversationHistory: Array<{role: string, content: string}>): string | null {
    // Check if this is first interaction
    if (conversationHistory.length <= 1) {
      return "Greet the patient warmly and ask what brings them here today.";
    }

    // Check if symptoms have been described
    if (!sessionContext.intake.symptoms || sessionContext.intake.symptoms.length < 10) {
      return "Patient has started conversation. Ask what symptoms or health concerns they are experiencing.";
    }

    // Check for age
    if (!sessionContext.user.age) {
      return "Symptoms described. Now ask for their age.";
    }

    // Check for gender
    if (!sessionContext.user.gender) {
      return "Age collected. Now ask for their gender.";
    }

    // Check for medical history
    const historyMentioned = conversationHistory.some(msg => 
      msg.role === 'assistant' && (msg.content.toLowerCase().includes('medical condition') || msg.content.toLowerCase().includes('existing condition'))
    );
    if (!historyMentioned || (!sessionContext.user.knownConditions && conversationHistory.length < 8)) {
      return "Gender collected. Now ask about existing medical conditions.";
    }

    // Check for duration
    if (!sessionContext.intake.duration) {
      return "Medical history collected. Now ask how long they've been experiencing these symptoms.";
    }

    // Check for severity
    if (!sessionContext.intake.severity) {
      return "Duration collected. Now ask them to rate the severity as mild, moderate, or severe.";
    }

    // All data collected
    return null;
  }

  private static analyzeForEmergency(conversationHistory: Array<{role: string, content: string}>, latestResponse: string): { 
    isEmergency: boolean;
    reason?: string;
    confidence?: number;
  } {
    const allText = (conversationHistory.map(m => m.content).join(' ') + ' ' + latestResponse).toLowerCase();
    
    const emergencyKeywords = [
      { keyword: 'chest pain', reason: 'Possible cardiac emergency' },
      { keyword: "can't breathe", reason: 'Severe respiratory distress' },
      { keyword: 'difficulty breathing', reason: 'Respiratory emergency' },
      { keyword: 'severe bleeding', reason: 'Hemorrhage requiring immediate attention' },
      { keyword: 'unconscious', reason: 'Loss of consciousness' },
      { keyword: 'stroke', reason: 'Possible stroke symptoms' },
      { keyword: 'seizure', reason: 'Neurological emergency' },
      { keyword: 'suicid', reason: 'Mental health crisis' },
      { keyword: 'kill myself', reason: 'Mental health emergency' },
      { keyword: 'severe allergic', reason: 'Anaphylaxis risk' },
      { keyword: 'call 911', reason: 'Emergency situation identified' },
      { keyword: 'emergency room', reason: 'Emergency care needed' }
    ];
    
    for (const { keyword, reason } of emergencyKeywords) {
      if (allText.includes(keyword)) {
        return { 
          isEmergency: true, 
          reason,
          confidence: 0.95
        };
      }
    }
    
    return { 
      isEmergency: false,
      reason: 'No immediate life-threatening symptoms detected',
      confidence: 0.85
    };
  }

  private static shouldCompleteConversation(conversationHistory: Array<{role: string, content: string}>, latestResponse: string): boolean {
    const recommendationKeywords = ['recommend', 'suggest', 'should see', 'appointment', 'specialist'];
    const hasRecommendation = recommendationKeywords.some(keyword => latestResponse.toLowerCase().includes(keyword));
    const hasEnoughExchanges = conversationHistory.length >= 6;
    return hasRecommendation && hasEnoughExchanges;
  }

  private static async generateTriageResult(
    conversationHistory: Array<{role: string, content: string}>, 
    latestResponse: string,
    patientData: PatientData
  ): Promise<TriageResult> {
    try {
      const genAI = this.initializeAI();
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const conversationText = conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n');
      const analysisPrompt = `Analyze this medical conversation and provide JSON:

CONVERSATION: ${conversationText}

Provide JSON with this structure: {"isEmergency": boolean, "confidence": 0-1, "explanation": "text", "reasoning": "text", "suggestedSpecialty": "specialist"}

Respond ONLY with valid JSON, no other text.`;

      const result = await model.generateContent(analysisPrompt);
      const responseText = result.response.text();
      const jsonText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const analysis = JSON.parse(jsonText);

      return {
        isEmergency: analysis.isEmergency || false,
        confidence: analysis.confidence || 0.7,
        explanation: analysis.explanation || 'Assessment completed',
        reasoning: analysis.reasoning || 'Based on conversation',
        suggestedSpecialty: analysis.suggestedSpecialty || 'Internal Medicine'
      };
    } catch (error) {
      console.error('Error generating triage result:', error);
      return {
        isEmergency: false,
        confidence: 0.5,
        explanation: 'Assessment completed',
        reasoning: 'Based on conversation review',
        suggestedSpecialty: 'Internal Medicine'
      };
    }
  }

  private static generateSuggestedActions(triageResult: TriageResult): string[] {
    if (triageResult.isEmergency) {
      return ['🚨 Call 911 immediately', 'Go to Emergency Room'];
    }
    return [`Schedule appointment with ${triageResult.suggestedSpecialty}`, 'Prepare list of symptoms'];
  }
}
