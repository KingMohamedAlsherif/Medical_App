import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';

// Get user profile
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');
    const userId = url.searchParams.get('userId');

    let userIdToUse = userId;

    // If sessionId is provided, get userId from session
    if (sessionId && !userId) {
      const userSession = database.getUserSession(sessionId);
      if (userSession) {
        userIdToUse = userSession.userId;
      } else {
        return NextResponse.json({
          success: false,
          message: 'Invalid session',
          error: 'INVALID_SESSION'
        }, { status: 401 });
      }
    }

    if (!userIdToUse) {
      return NextResponse.json({
        success: false,
        message: 'User ID or session ID is required',
        error: 'MISSING_USER_ID'
      }, { status: 400 });
    }

    const user = database.getUserById(userIdToUse);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      }, { status: 404 });
    }

    // Remove sensitive data
    const { password: _, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      user: safeUser
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: 'SERVER_ERROR'
    }, { status: 500 });
  }
}

// Update user profile
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { sessionId, userId, updates } = body;

    let userIdToUse = userId;

    // If sessionId is provided, get userId from session
    if (sessionId && !userId) {
      const userSession = database.getUserSession(sessionId);
      if (userSession) {
        userIdToUse = userSession.userId;
      } else {
        return NextResponse.json({
          success: false,
          message: 'Invalid session',
          error: 'INVALID_SESSION'
        }, { status: 401 });
      }
    }

    if (!userIdToUse) {
      return NextResponse.json({
        success: false,
        message: 'User ID or session ID is required',
        error: 'MISSING_USER_ID'
      }, { status: 400 });
    }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json({
        success: false,
        message: 'Updates object is required',
        error: 'MISSING_UPDATES'
      }, { status: 400 });
    }

    // Don't allow updating sensitive fields
    const { id, password, email, createdAt, ...safeUpdates } = updates;

    const updatedUser = database.updateUser(userIdToUse, safeUpdates);
    if (!updatedUser) {
      return NextResponse.json({
        success: false,
        message: 'User not found or update failed',
        error: 'UPDATE_FAILED'
      }, { status: 404 });
    }

    // Remove sensitive data
    const { password: _, ...safeUser } = updatedUser;

    return NextResponse.json({
      success: true,
      user: safeUser,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: 'SERVER_ERROR'
    }, { status: 500 });
  }
}