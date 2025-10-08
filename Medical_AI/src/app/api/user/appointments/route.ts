import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';
import { sessionStore } from '@/lib/sessionStore';

// Get user appointments
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');
    const userId = url.searchParams.get('userId');

    let userIdToUse = userId;

    // If sessionId is provided, try to get userId from session
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

    const appointments = database.getUserAppointments(userIdToUse);

    return NextResponse.json({
      success: true,
      appointments,
      count: appointments.length
    });

  } catch (error) {
    console.error('Get appointments error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: 'SERVER_ERROR'
    }, { status: 500 });
  }
}

// Create new appointment for authenticated user
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { sessionId, userId, doctorId, doctorName, specialty, scheduledTime, notes, symptoms } = body;

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

    // Validate required fields
    if (!doctorId || !doctorName || !specialty || !scheduledTime) {
      return NextResponse.json({
        success: false,
        message: 'Doctor ID, doctor name, specialty, and scheduled time are required',
        error: 'MISSING_REQUIRED_FIELDS'
      }, { status: 400 });
    }

    // Get chat session to include triage results if available
    const chatSession = sessionId ? sessionStore.getSession(sessionId) : null;
    const triageResults = chatSession ? sessionStore.getTriageLogs(sessionId) : [];
    const latestTriage = triageResults.length > 0 ? triageResults[triageResults.length - 1].result : undefined;

    // Create the appointment
    const appointment = database.createAppointment({
      userId: userIdToUse,
      sessionId: sessionId || '',
      doctorId,
      doctorName,
      specialty,
      scheduledTime,
      status: 'pending',
      notes,
      symptoms,
      triageResult: latestTriage
    });

    return NextResponse.json({
      success: true,
      appointment,
      message: 'Appointment created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Create appointment error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: 'SERVER_ERROR'
    }, { status: 500 });
  }
}

// Update appointment status
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { appointmentId, sessionId, userId, status, notes } = body;

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

    if (!appointmentId) {
      return NextResponse.json({
        success: false,
        message: 'Appointment ID is required',
        error: 'MISSING_APPOINTMENT_ID'
      }, { status: 400 });
    }

    // Get the appointment to verify ownership
    const appointment = database.getAppointmentById(appointmentId);
    if (!appointment) {
      return NextResponse.json({
        success: false,
        message: 'Appointment not found',
        error: 'APPOINTMENT_NOT_FOUND'
      }, { status: 404 });
    }

    // Verify user owns this appointment (if userId is provided)
    if (userIdToUse && appointment.userId !== userIdToUse) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized to modify this appointment',
        error: 'UNAUTHORIZED'
      }, { status: 403 });
    }

    // Update the appointment
    const updates: any = {};
    if (status) updates.status = status;
    if (notes) updates.notes = notes;

    const updatedAppointment = database.updateAppointment(appointmentId, updates);

    return NextResponse.json({
      success: true,
      appointment: updatedAppointment,
      message: 'Appointment updated successfully'
    });

  } catch (error) {
    console.error('Update appointment error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: 'SERVER_ERROR'
    }, { status: 500 });
  }
}