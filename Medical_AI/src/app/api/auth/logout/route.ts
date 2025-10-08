import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        message: 'Session ID is required',
        error: 'MISSING_SESSION_ID'
      }, { status: 400 });
    }

    // Invalidate the session
    const success = database.invalidateUserSession(sessionId);

    if (!success) {
      return NextResponse.json({
        success: false,
        message: 'Invalid session ID',
        error: 'INVALID_SESSION'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: 'SERVER_ERROR'
    }, { status: 500 });
  }
}