import { TriageResult, EMERGENCY_SYMPTOMS, SPECIALTY_KEYWORDS } from '@/types';

export class TriageAgent {
  private static readonly EMERGENCY_THRESHOLD = 0.7;
  private static readonly MEDICAL_DISCLAIMER = "⚠️ This AI assistant does not replace professional medical advice. Always consult with a healthcare provider for proper diagnosis and treatment.";

  /**
   * Main triage function that analyzes user input and determines:
   * 1. If it's an emergency
   * 2. Which specialty to recommend (if not emergency)
   */
  static async analyzeSymptoms(message: string): Promise<TriageResult> {
    const normalizedMessage = message.toLowerCase().trim();
    
    // Step 1: Check for emergency symptoms
    const emergencyCheck = this.detectEmergency(normalizedMessage);
    
    if (emergencyCheck.isEmergency) {
      return {
        isEmergency: true,
        confidence: emergencyCheck.confidence,
        explanation: "🚨 EMERGENCY DETECTED: Please seek immediate medical attention at the nearest emergency room or call 911.",
        reasoning: `Emergency indicators found: ${emergencyCheck.redFlags.join(', ')}. ${this.MEDICAL_DISCLAIMER}`,
        redFlags: emergencyCheck.redFlags
      };
    }

    // Step 2: Classify specialty for non-emergency cases
    const specialtyResult = this.classifySpecialty(normalizedMessage);
    
    return {
      isEmergency: false,
      confidence: specialtyResult.confidence,
      explanation: `Based on your symptoms, you may benefit from seeing a ${specialtyResult.specialty} specialist.`,
      reasoning: `Analysis suggests ${specialtyResult.specialty} based on: ${specialtyResult.matchedKeywords.join(', ')}. ${this.MEDICAL_DISCLAIMER}`,
      suggestedSpecialty: specialtyResult.specialty
    };
  }

  /**
   * Detects if the message contains emergency symptoms
   */
  private static detectEmergency(message: string): {
    isEmergency: boolean;
    confidence: number;
    redFlags: string[];
  } {
    const redFlags: string[] = [];
    
    // Check for direct emergency symptom matches
    for (const symptom of EMERGENCY_SYMPTOMS) {
      if (message.includes(symptom)) {
        redFlags.push(symptom);
      }
    }

    // Additional emergency pattern detection
    const emergencyPatterns = [
      /can'?t breathe/i,
      /severe pain/i,
      /losing consciousness/i,
      /blood/i,
      /emergency/i,
      /911/i,
      /urgent/i,
      /life threatening/i,
      /critical/i
    ];

    for (const pattern of emergencyPatterns) {
      if (pattern.test(message)) {
        const match = message.match(pattern);
        if (match) {
          redFlags.push(match[0]);
        }
      }
    }

    const isEmergency = redFlags.length > 0;
    const confidence = isEmergency ? Math.min(0.9, 0.5 + (redFlags.length * 0.2)) : 0;

    return {
      isEmergency,
      confidence,
      redFlags
    };
  }

  /**
   * Classifies which medical specialty the patient should see
   */
  private static classifySpecialty(message: string): {
    specialty: string;
    confidence: number;
    matchedKeywords: string[];
  } {
    const specialtyScores: Record<string, { score: number; keywords: string[] }> = {};
    
    // Calculate scores for each specialty based on keyword matches
    for (const [specialty, keywords] of Object.entries(SPECIALTY_KEYWORDS)) {
      const matchedKeywords: string[] = [];
      let score = 0;
      
      for (const keyword of keywords) {
        if (message.includes(keyword)) {
          matchedKeywords.push(keyword);
          // Weight longer, more specific keywords higher
          score += keyword.length > 8 ? 2 : 1;
        }
      }
      
      if (matchedKeywords.length > 0) {
        specialtyScores[specialty] = { score, keywords: matchedKeywords };
      }
    }

    // Find the specialty with the highest score
    let bestSpecialty = 'Internal Medicine'; // Default specialty
    let bestScore = 0;
    let bestKeywords: string[] = [];

    for (const [specialty, data] of Object.entries(specialtyScores)) {
      if (data.score > bestScore) {
        bestSpecialty = specialty;
        bestScore = data.score;
        bestKeywords = data.keywords;
      }
    }

    // Calculate confidence based on match strength
    const confidence = Math.min(0.9, bestScore * 0.1);

    return {
      specialty: bestSpecialty,
      confidence: confidence > 0 ? confidence : 0.3, // Minimum confidence for default
      matchedKeywords: bestKeywords
    };
  }

  /**
   * Generates follow-up questions to gather more information
   */
  static generateFollowUpQuestions(specialty: string): string[] {
    const questionMap: Record<string, string[]> = {
      'Cardiology': [
        "How long have you been experiencing these symptoms?",
        "Do you have any family history of heart disease?",
        "Are you currently taking any medications?"
      ],
      'Dermatology': [
        "When did you first notice this skin condition?",
        "Has the area changed in size or color recently?",
        "Do you have any known allergies?"
      ],
      'Orthopedics': [
        "Did this pain start after an injury or gradually?",
        "On a scale of 1-10, how would you rate your pain?",
        "Does the pain worsen with movement or rest?"
      ],
      'Default': [
        "How long have you been experiencing these symptoms?",
        "Have you tried any treatments or medications?",
        "Is there anything that makes the symptoms better or worse?"
      ]
    };

    return questionMap[specialty] || questionMap['Default'];
  }

  /**
   * Validates that the input is health-related
   */
  static isHealthRelated(message: string): boolean {
    const healthKeywords = [
      'pain', 'symptom', 'hurt', 'ache', 'feel', 'sick', 'doctor', 'medical',
      'health', 'diagnosis', 'treatment', 'medication', 'hospital', 'clinic',
      'fever', 'headache', 'nausea', 'tired', 'fatigue', 'dizzy', 'rash',
      'cough', 'sore', 'infection', 'injury', 'broken', 'swollen', 'bleeding'
    ];

    const normalizedMessage = message.toLowerCase();
    return healthKeywords.some(keyword => normalizedMessage.includes(keyword));
  }
}