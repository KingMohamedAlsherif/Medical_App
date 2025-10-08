import { NextRequest, NextResponse } from 'next/server';
import { LoginRequest, LoginResponse } from '@/types';
import { database } from '@/lib/database';

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Email and password are required',
        error: 'MISSING_CREDENTIALS'
      }, { status: 400 });
    }

    // Authenticate user
    const user = database.authenticateUser(email, password);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email or password',
        error: 'INVALID_CREDENTIALS'
      }, { status: 401 });
    }

    // Create user session
    const userSession = database.createUserSession(user);

    // Remove sensitive data before sending response
    const { password: _, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      sessionId: userSession.id,
      user: safeUser,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: 'SERVER_ERROR'
    }, { status: 500 });
  }
}

// Get current user session
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        message: 'Session ID is required',
        error: 'MISSING_SESSION_ID'
      }, { status: 400 });
    }

    const userSession = database.getUserSession(sessionId);
    
    if (!userSession) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired session',
        error: 'INVALID_SESSION'
      }, { status: 401 });
    }

    // Remove sensitive data
    const { password: _, ...safeUser } = userSession.user;

    return NextResponse.json({
      success: true,
      sessionId: userSession.id,
      user: safeUser,
      isAuthenticated: userSession.isAuthenticated,
      loginTime: userSession.loginTime,
      lastActivity: userSession.lastActivity
    });

  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: 'SERVER_ERROR'
    }, { status: 500 });
  }
}