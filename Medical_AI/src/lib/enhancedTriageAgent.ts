import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

interface AITriageResult {
  isEmergency: boolean;
  confidence: number;
  explanation: string;
  reasoning: string;
  suggestedSpecialty?: string;
  redFlags?: string[];
}

/**
 * Enhanced AI-powered triage using Google Gemini
 */
export class EnhancedTriageAgent {
  
  /**
   * Analyze symptoms using Google AI
   */
  async analyzeWithAI(
    symptoms: string, 
    patientAge?: number, 
    medicalHistory?: string[]
  ): Promise<AITriageResult> {
    try {
      const prompt = this.buildMedicalPrompt(symptoms, patientAge, medicalHistory);
      
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Parse AI response
      const aiResult = this.parseAIResponse(responseText);
      
      // Apply safety checks
      return this.applySafetyChecks(aiResult, symptoms);
      
    } catch (error) {
      console.error('AI Triage error:', error);
      // Fallback to rule-based system
      return this.fallbackTriage(symptoms);
    }
  }

  /**
   * Build comprehensive medical prompt based on Cleveland Clinic multi-agent instructions
   */
  private buildMedicalPrompt(
    symptoms: string, 
    age?: number, 
    history?: string[]
  ): string {
    return `
# 🧠 AI MEDICAL TRIAGE — CLEVELAND CLINIC ABU DHABI

You are the **Emergency Detection Agent** for Cleveland Clinic Abu Dhabi Health Assistant.
Your **priority is patient safety** — always act conservatively if unsure.

## PATIENT INFORMATION:
- Age: ${age || 'Not specified'}
- Medical History: ${history?.join(', ') || 'None provided'}
- Current Symptoms: ${symptoms}

## 🚨 CRITICAL RED-FLAG SYMPTOMS (EMERGENCY):
**Cardiac:**
- Chest pain, pressure, tightness (especially with arm/jaw pain)
- Severe difficulty breathing or shortness of breath
- Heart palpitations with dizziness or chest pain

**Neurological:**
- Stroke signs: confusion, slurred speech, facial drooping, sudden weakness
- Severe sudden headache ("worst headache of life")
- Seizures or loss of consciousness
- Sudden vision loss

**Respiratory:**
- Cannot breathe / gasping for air
- Blue lips or fingernails
- Severe asthma attack

**Trauma/Bleeding:**
- Severe uncontrolled bleeding
- Severe trauma or injury

**Mental Health:**
- Suicidal thoughts or self-harm intentions
- Severe psychiatric crisis

**Other:**
- Severe allergic reaction (swelling, difficulty breathing)
- Signs of stroke or heart attack
- Poisoning or overdose

## RISK FACTORS TO CONSIDER:
- Age (older patients = higher risk)
- Chronic conditions (diabetes, hypertension, heart disease)
- Duration and progression of symptoms
- Multiple symptoms occurring together

## 🧬 SPECIALTY CLASSIFICATION (if NOT emergency):
| Symptoms | Specialty |
|----------|-----------|
| Headache, migraine, dizziness, seizure, numbness | Neurology |
| Abdominal pain, nausea, vomiting, diarrhea, heartburn | Gastroenterology |
| Cough, shortness of breath (non-emergency), wheezing | Pulmonology |
| Skin rash, itching, acne, mole, eczema | Dermatology |
| Fever, fatigue, general weakness, body aches | Internal Medicine |
| Joint pain, back pain, swelling, bone pain | Rheumatology/Orthopedics |
| Heart palpitations (non-emergency), chest discomfort | Cardiology |

## RESPONSE FORMAT (JSON):
{
  "isEmergency": boolean,
  "confidence": number (0-100),
  "suggestedSpecialty": "string",
  "explanation": "Patient-friendly explanation",
  "reasoning": "Clinical reasoning",
  "redFlags": ["array", "of", "concerning", "symptoms"],
  "urgency": "low|medium|high|emergency",
  "recommendations": ["immediate", "actions", "to take"]
}

## SAFETY GUIDELINES:
1. **Always err on the side of caution** — if uncertain, mark as emergency
2. Consider age-related risk factors (older = higher risk)
3. Flag any potential emergency symptoms
4. Consider symptom duration, severity, and progression
5. If multiple concerning symptoms → increase urgency
6. For chest pain + age >40 or diabetes/hypertension → emergency
7. For severe symptoms lasting >24 hours → urgent care

## EMERGENCY RESPONSE:
If isEmergency=true, set:
- confidence: 90-100
- urgency: "emergency"
- recommendations: ["Go to Emergency Department immediately", "Call 998 (UAE) or 911"]
- explanation: Clear, urgent message without causing panic

Provide **ONLY** the JSON response, no additional text.
`;
  }

  /**
   * Parse AI response with error handling
   */
  private parseAIResponse(responseText: string): AITriageResult {
    try {
      // Clean the response text
      const cleanedResponse = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      const parsed = JSON.parse(cleanedResponse);
      
      return {
        isEmergency: parsed.isEmergency || false,
        confidence: Math.min(Math.max(parsed.confidence || 0, 0), 100) / 100,
        explanation: parsed.explanation || 'Assessment completed',
        reasoning: parsed.reasoning || 'Based on symptom analysis',
        suggestedSpecialty: parsed.suggestedSpecialty,
        redFlags: parsed.redFlags || []
      };
      
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Failed to parse AI response');
    }
  }

  /**
   * Apply additional safety checks
   */
  private applySafetyChecks(result: AITriageResult, symptoms: string): AITriageResult {
    // Check for emergency keywords that AI might have missed
    const emergencyKeywords = [
      'chest pain', 'can\'t breathe', 'severe bleeding', 'unconscious',
      'heart attack', 'stroke', 'suicide', 'overdose', 'severe trauma',
      'choking', 'severe allergic reaction', 'loss of consciousness'
    ];

    const hasEmergencyKeyword = emergencyKeywords.some(keyword => 
      symptoms.toLowerCase().includes(keyword.toLowerCase())
    );

    if (hasEmergencyKeyword && !result.isEmergency) {
      // Override AI decision for safety
      result.isEmergency = true;
      result.explanation = 'Emergency symptoms detected. Please seek immediate medical attention.';
      result.confidence = Math.max(result.confidence, 0.9);
    }

    return result;
  }

  /**
   * Fallback to rule-based system if AI fails
   */
  private fallbackTriage(symptoms: string): AITriageResult {
    // Import your existing rule-based triage logic
    const ruleBasedResult = this.ruleBasedTriage(symptoms);
    
    return {
      ...ruleBasedResult,
      explanation: ruleBasedResult.explanation + ' (Using backup assessment system)',
      reasoning: 'Rule-based analysis due to AI service unavailability'
    };
  }

  /**
   * Your existing rule-based triage (keep as backup)
   */
  private ruleBasedTriage(symptoms: string): AITriageResult {
    // Your existing implementation from triageAgent.ts
    const lowerSymptoms = symptoms.toLowerCase();
    
    // Emergency detection
    const emergencySymptoms = [
      'chest pain', 'severe bleeding', 'shortness of breath',
      'difficulty breathing', 'severe headache', 'stroke symptoms',
      'loss of consciousness', 'severe allergic reaction'
    ];

    const isEmergency = emergencySymptoms.some(symptom => 
      lowerSymptoms.includes(symptom)
    );

    if (isEmergency) {
      return {
        isEmergency: true,
        confidence: 0.95,
        explanation: 'Emergency symptoms detected. Please go to the emergency room immediately or call 911.',
        reasoning: 'Rule-based detection of emergency keywords',
        redFlags: emergencySymptoms.filter(s => lowerSymptoms.includes(s))
      };
    }

    // Specialty detection (your existing logic)
    const specialtyKeywords = {
      'Dermatology': ['rash', 'skin', 'acne', 'mole', 'eczema', 'itchy'],
      'Cardiology': ['heart', 'palpitations', 'cardiac', 'chest discomfort'],
      'Orthopedics': ['joint pain', 'back pain', 'knee pain', 'bone'],
      'Internal Medicine': ['fever', 'fatigue', 'general symptoms']
    };

    let suggestedSpecialty = 'Internal Medicine'; // Default
    let maxMatches = 0;

    for (const [specialty, keywords] of Object.entries(specialtyKeywords)) {
      const matches = keywords.filter(keyword => lowerSymptoms.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        suggestedSpecialty = specialty;
      }
    }

    return {
      isEmergency: false,
      confidence: maxMatches > 0 ? 0.7 : 0.4,
      explanation: `Based on your symptoms, a consultation with ${suggestedSpecialty} is recommended.`,
      reasoning: `Keyword analysis suggests ${suggestedSpecialty} specialization`,
      suggestedSpecialty
    };
  }
}

// Singleton instance
export const enhancedTriageAgent = new EnhancedTriageAgent();