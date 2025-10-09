import { NextRequest, NextResponse } from 'next/server';
import { ConversationalTriageAgent, ConversationState } from '@/lib/conversationalTriageAgent';
import { sessionStore } from '@/lib/sessionStore';
import { ConversationalChatRequest, ConversationalChatResponse } from '@/types';
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
 * POST /api/chat/conversational
 * Handles conversational triage flow with structured patient data collection
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

    const body: ConversationalChatRequest = await request.json();
    const { message, sessionId, conversationState } = body;

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
        conversationState: conversationState || ConversationalTriageAgent.initializeConversation(),
        isComplete: true,
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

    // Store user message
    const userMessage = sessionStore.addMessage(session.id, sanitizedMessage, 'user');
    if (!userMessage) {
      return NextResponse.json(
        { error: 'Failed to store message' },
        { status: 500 }
      );
    }

    // Initialize or use existing conversation state
    const currentState: ConversationState = conversationState || ConversationalTriageAgent.initializeConversation();

    // Process message with conversational triage agent
    const result = await ConversationalTriageAgent.processMessage(sanitizedMessage, currentState);

    // Store AI response
    sessionStore.addMessage(session.id, result.response, 'ai');

    // Store conversation state in session (you might want to enhance sessionStore for this)
    if (session) {
      // @ts-ignore - Adding conversation state to session (enhance sessionStore interface if needed)
      session.conversationState = result.newState;
    }

    // Log triage result if available
    if (result.triageResult) {
      const triageLog = {
        id: nanoid(),
        sessionId: session.id,
        messageId: userMessage.id,
        result: result.triageResult,
        timestamp: new Date()
      };
      sessionStore.addTriageLog(triageLog);
    }

    // Generate patient summary if conversation is complete and not emergency
    let patientSummary: string | undefined;
    if (result.isComplete && result.triageResult && !result.triageResult.isEmergency) {
      patientSummary = generatePatientSummary(result.newState.patientData, result.triageResult);
    }

    // Prepare response
    const chatResponse: ConversationalChatResponse = {
      sessionId: session.id,
      response: result.response,
      conversationState: result.newState,
      isComplete: result.isComplete,
      suggestedActions: result.suggestedActions,
      patientSummary
    };

    // Add triageResult only if it exists
    if (result.triageResult) {
      chatResponse.triageResult = result.triageResult;
    }

    // Add rate limit headers to successful responses
    return NextResponse.json(chatResponse, {
      headers: {
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
      }
    });

  } catch (error) {
    console.error('Conversational Chat API error:', error);
    return NextResponse.json(
      createErrorResponse('Internal server error', 500),
      { status: 500 }
    );
  }
}

/**
 * Generate structured patient summary
 */
function generatePatientSummary(patientData: any, triageResult: any): string {
  const conditions = patientData.chronicConditions && patientData.chronicConditions.length > 0
    ? patientData.chronicConditions.join(', ')
    : 'None reported';

  return `## 📋 **Patient Medical Summary**

**Patient Information:**
- **Name:** ${patientData.name}
- **Age:** ${patientData.age} years
- **Gender:** ${patientData.gender}
- **Chronic Conditions:** ${conditions}

**Symptoms Reported:**
${patientData.symptoms}

**Triage Classification:** ${triageResult.isEmergency ? 'Emergency' : 'Non-Emergency'}
**Recommended Specialist:** ${triageResult.suggestedSpecialty || 'Internal Medicine'}
**Confidence Level:** ${Math.round(triageResult.confidence * 100)}%

**Clinical Reasoning:**
${triageResult.reasoning}

---
*Generated on: ${new Date().toLocaleString()}*
*This summary has been created by AI triage assistant and should be reviewed by medical professionals.*`;
}

/**
 * GET /api/chat/conversational?sessionId=xxx
 * Retrieves conversational chat history with conversation state
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
      triageLogs,
      // @ts-ignore - conversationState might not exist in type
      conversationState: session.conversationState || null
    });

  } catch (error) {
    console.error('Conversational Chat GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}