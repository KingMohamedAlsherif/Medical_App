import { NextRequest, NextResponse } from 'next/server';
import { TriageAgent } from '@/lib/triageAgent';
import { enhancedTriageAgent } from '@/lib/enhancedTriageAgent';
import { sessionStore } from '@/lib/sessionStore';
import { ChatRequest, ChatResponse, TriageLog } from '@/types';
import { 
  chatRateLimiter, 
  getClientIdentifier, 
  sanitizeInput, 
  isValidSessionId,
  validateMedicalContent,
  createErrorResponse 
} from '@/lib/security';
import { nanoid } from 'nanoid';

/**
 * POST /api/chat
 * Handles user-AI message exchange and triage analysis
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimitResult = chatRateLimiter.isAllowed(clientId);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        createErrorResponse('Rate limit exceeded. Please try again later.', 429),
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
          }
        }
      );
    }

    const body: ChatRequest = await request.json();
    const { message, sessionId } = body;

    // Validate input
    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        createErrorResponse('Message is required'),
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedMessage = sanitizeInput(message);
    
    if (sanitizedMessage.length === 0) {
      return NextResponse.json(
        createErrorResponse('Invalid message content'),
        { status: 400 }
      );
    }

    // Check for harmful content
    const contentSafety = validateMedicalContent(sanitizedMessage);
    if (!contentSafety.safe) {
      const emergencyResponse = `🚨 **IMMEDIATE MENTAL HEALTH SUPPORT NEEDED**

If you're having thoughts of self-harm or suicide, please reach out for immediate help:

**Crisis Resources:**
- **National Suicide Prevention Lifeline:** 988 or 1-800-273-8255
- **Crisis Text Line:** Text HOME to 741741
- **Emergency Services:** Call 911

**You are not alone. Professional help is available 24/7.**

Please contact a mental health professional or go to your nearest emergency room immediately.`;

      return NextResponse.json({
        sessionId: sessionId || 'crisis-session',
        response: emergencyResponse,
        triageResult: {
          isEmergency: true,
          confidence: 1.0,
          explanation: "Mental health crisis detected. Immediate professional help recommended.",
          reasoning: "Content indicates potential self-harm or suicidal ideation."
        },
        suggestedActions: [
          "Call 988 (Suicide Prevention Lifeline)",
          "Call 911",
          "Go to Emergency Room",
          "Contact Crisis Text Line: Text HOME to 741741"
        ]
      });
    }

    // Validate session ID format if provided
    if (sessionId && !isValidSessionId(sessionId)) {
      return NextResponse.json(
        createErrorResponse('Invalid session ID format'),
        { status: 400 }
      );
    }

    // Create or get session
    let session = sessionId ? sessionStore.getSession(sessionId) : null;
    if (!session) {
      session = sessionStore.createSession();
    }

    // Store user message (use sanitized version)
    const userMessage = sessionStore.addMessage(session.id, sanitizedMessage, 'user');
    if (!userMessage) {
      return NextResponse.json(
        { error: 'Failed to store message' },
        { status: 500 }
      );
    }

    // Validate that the message is health-related
    if (!TriageAgent.isHealthRelated(sanitizedMessage)) {
      const response = "I'm a medical triage assistant. Please describe your health symptoms or medical concerns so I can help direct you to the appropriate care.";
      
      sessionStore.addMessage(session.id, response, 'ai');
      
      return NextResponse.json({
        sessionId: session.id,
        response,
        triageResult: {
          isEmergency: false,
          confidence: 0,
          explanation: "Please provide health-related information for proper assistance.",
          reasoning: "Input does not appear to be health-related."
        },
        suggestedActions: [
          "Describe your symptoms",
          "Ask about a medical condition",
          "Request help with health concerns"
        ]
      });
    }

    // Analyze symptoms with AI triage agent
    // Use enhanced AI if API key is available, otherwise fall back to rule-based
    const useEnhancedAI = process.env.GOOGLE_AI_API_KEY ? true : false;
    
    const triageResult = useEnhancedAI 
      ? await enhancedTriageAgent.analyzeWithAI(sanitizedMessage)
      : await TriageAgent.analyzeSymptoms(sanitizedMessage);

    // Generate appropriate response
    let response: string;
    let suggestedActions: string[] = [];

    if (triageResult.isEmergency) {
      response = `🚨 **EMERGENCY DETECTED**

${triageResult.explanation}

**IMMEDIATE ACTION REQUIRED:**
- Call 911 or go to the nearest emergency room immediately
- Do not delay seeking medical attention
- If possible, have someone accompany you

**Emergency symptoms detected:** ${triageResult.redFlags?.join(', ')}

${triageResult.reasoning}`;

      suggestedActions = [
        "Call 911",
        "Go to Emergency Room",
        "Contact Emergency Services"
      ];
    } else {
      const specialty = triageResult.suggestedSpecialty || 'Internal Medicine';
      
      response = `📋 **Medical Triage Assessment**

${triageResult.explanation}

**Recommended next steps:**
- Schedule an appointment with a ${specialty} specialist
- Continue monitoring your symptoms
- Seek medical attention if symptoms worsen

**Analysis:** ${triageResult.reasoning}

Would you like me to help you find available appointments with ${specialty} specialists?`;

      suggestedActions = [
        `Book ${specialty} appointment`,
        "Ask follow-up questions",
        "Get more information about symptoms"
      ];

      // Generate follow-up questions
      const followUpQuestions = TriageAgent.generateFollowUpQuestions(specialty);
      if (followUpQuestions.length > 0) {
        response += `\n\n**Additional questions to help with your care:**\n${followUpQuestions.map(q => `• ${q}`).join('\n')}`;
      }
    }

    // Store AI response
    sessionStore.addMessage(session.id, response, 'ai');

    // Log triage result
    const triageLog: TriageLog = {
      id: nanoid(),
      sessionId: session.id,
      messageId: userMessage.id,
      result: triageResult,
      timestamp: new Date()
    };
    sessionStore.addTriageLog(triageLog);

    // Prepare response
    const chatResponse: ChatResponse = {
      sessionId: session.id,
      response,
      triageResult,
      suggestedActions
    };

    // Add rate limit headers to successful responses
    return NextResponse.json(chatResponse, {
      headers: {
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
      }
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      createErrorResponse('Internal server error', 500),
      { status: 500 }
    );
  }
}

/**
 * GET /api/chat?sessionId=xxx
 * Retrieves chat history for a session
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const session = sessionStore.getSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    const messages = sessionStore.getMessages(sessionId);
    const triageLogs = sessionStore.getTriageLogs(sessionId);

    return NextResponse.json({
      session,
      messages,
      triageLogs
    });

  } catch (error) {
    console.error('Chat GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}