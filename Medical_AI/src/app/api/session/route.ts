import { NextRequest, NextResponse } from 'next/server';
import { sessionStore } from '@/lib/sessionStore';
import { database } from '@/lib/database';

/**
 * POST /api/session
 * Creates a new chat session (can be authenticated or anonymous)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { userSessionId } = body;
    
    let userId = undefined;
    let user = undefined;

    // Check if user is authenticated
    if (userSessionId) {
      const userSession = database.getUserSession(userSessionId);
      if (userSession && userSession.isAuthenticated) {
        userId = userSession.userId;
        user = userSession.user;
      }
    }

    // Create chat session
    const session = userId ? sessionStore.createAuthenticatedSession(user!) : sessionStore.createSession();
    
    // Add personalized welcome message
    const userName = user ? user.firstName : 'there';
    const welcomeMessage = `👋 **Welcome${user ? ' back' : ''} ${userName} to Cleveland Clinic AI Triage Assistant**

I'm here to help assess your health concerns and guide you to the appropriate medical care.

**How I can help:**
- Evaluate if your symptoms require emergency care
- Recommend which medical specialist you should see
- Help schedule appointments with available doctors
${user ? `- Access your appointment history and medical information` : ''}

**Important:** This AI assistant does not replace professional medical advice. Always consult with a healthcare provider for proper diagnosis and treatment.

Please describe your symptoms or health concerns, and I'll help guide you to the right care.`;

    sessionStore.addMessage(session.id, welcomeMessage, 'ai');

    return NextResponse.json({
      sessionId: session.id,
      userId: session.userId,
      isAuthenticated: !!session.userId,
      user: user ? { 
        id: user.id, 
        firstName: user.firstName, 
        lastName: user.lastName,
        email: user.email 
      } : undefined,
      createdAt: session.createdAt,
      message: 'New session created successfully'
    });

  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/session/{sessionId}
 * Retrieves session information
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

    // Get the latest triage result for dashboard
    const latestTriageResult = triageLogs.length > 0 ? triageLogs[triageLogs.length - 1].result : null;

    return NextResponse.json({
      session: {
        ...session,
        messages,
        triageResult: latestTriageResult
      },
      messageCount: messages.length,
      triageCount: triageLogs.length,
      lastActivity: session.updatedAt
    });

  } catch (error) {
    console.error('Session GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/session
 * Deletes a session
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const deleted = sessionStore.deleteSession(sessionId);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Session deleted successfully'
    });

  } catch (error) {
    console.error('Session DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}