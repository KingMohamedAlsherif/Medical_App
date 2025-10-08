import { NextRequest, NextResponse } from 'next/server';
import { mockDoctorDB } from '@/lib/mockDoctorDB';
import { sessionStore } from '@/lib/sessionStore';
import { database } from '@/lib/database';
import { BookingRequest, BookingResponse } from '@/types';

export async function POST(request: NextRequest) {
  console.log('Booking API called');
  try {
    const body: BookingRequest = await request.json();
    console.log('Request body:', body);
    const { sessionId, specialty, preferredTime } = body;

    // Validate input
    if (!sessionId || !specialty) {
      console.log('Missing sessionId or specialty');
      return NextResponse.json(
        { 
          success: false,
          error: 'Session ID and specialty are required',
          message: 'Session ID and specialty are required'
        },
        { status: 400 }
      );
    }

    // Verify session exists
    const session = sessionStore.getSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Session not found',
          message: 'Session not found'
        },
        { status: 404 }
      );
    }

    // Check if user is authenticated
    let userId = session.userId;
    if (!userId) {
      // For backward compatibility, create anonymous appointment
      console.log('Creating anonymous appointment (no authenticated user)');
    }

    // Attempt to book appointment
    const mockAppointment = mockDoctorDB.bookAppointment(sessionId, specialty);

    if (!mockAppointment) {
      // No available appointments
      const nextSlot = mockDoctorDB.getNextAvailableSlot(specialty);
      
      const response: BookingResponse = {
        success: false,
        message: nextSlot 
          ? `No immediate availability for ${specialty}. Next available appointment is ${nextSlot}.`
          : `Sorry, no appointments are currently available for ${specialty}. Please call our scheduling department at (216) 444-2200 for assistance.`,
        error: 'No available appointments'
      };

      return NextResponse.json(response);
    }

    // If user is authenticated, also save to our database
    let dbAppointment = null;
    if (userId) {
      // Get triage results if available
      const triageResults = sessionStore.getTriageLogs(sessionId);
      const latestTriage = triageResults.length > 0 ? triageResults[triageResults.length - 1].result : undefined;

      dbAppointment = database.createAppointment({
        userId,
        sessionId,
        doctorId: mockAppointment.doctorId,
        doctorName: mockAppointment.doctorName,
        specialty: mockAppointment.specialty,
        scheduledTime: mockAppointment.scheduledTime,
        status: 'confirmed',
        triageResult: latestTriage
      });
    }

    // Successful booking
    const response: BookingResponse = {
      success: true,
      appointment: dbAppointment || mockAppointment,
      message: `🎉 **Appointment Confirmed!**

**Details:**
- **Doctor:** ${mockAppointment.doctorName}
- **Specialty:** ${mockAppointment.specialty}
- **Date & Time:** ${mockAppointment.scheduledTime}
- **Appointment ID:** ${mockAppointment.id}

**Next Steps:**
- You will receive a confirmation email shortly
- Arrive 15 minutes early for check-in
- Bring a valid ID and insurance card
- Prepare a list of current medications

**Contact Information:**
- To reschedule or cancel: (216) 444-2200
- For questions about your visit: (216) 444-2273

**Location:** Cleveland Clinic Main Campus
9500 Euclid Avenue, Cleveland, OH 44195

Thank you for choosing Cleveland Clinic!`
    };

    // Add booking confirmation to session
    sessionStore.addMessage(
      sessionId,
      `✅ Appointment booked successfully with ${mockAppointment.doctorName} (${mockAppointment.specialty}) on ${mockAppointment.scheduledTime}`,
      'ai'
    );

    return NextResponse.json(response);

  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: 'Unable to process booking request at this time. Please try again later or call (216) 444-2200.'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ 
        message: 'Booking API is working!',
        error: 'Session ID required for booking history' 
      });
    }

    // Verify session exists
    const session = sessionStore.getSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    let appointments = [];
    
    // If user is authenticated, get appointments from database
    if (session.userId) {
      appointments = database.getUserAppointments(session.userId);
    } else {
      // Fallback to mock appointments for anonymous sessions
      appointments = mockDoctorDB.getAppointmentsBySession(sessionId);
    }

    return NextResponse.json({
      sessionId,
      userId: session.userId,
      appointments,
      count: appointments.length,
      isAuthenticated: !!session.userId
    });

  } catch (error) {
    console.error('Booking GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get('appointmentId');

    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    const cancelled = mockDoctorDB.cancelAppointment(appointmentId);

    if (!cancelled) {
      return NextResponse.json(
        { error: 'Appointment not found or already cancelled' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Appointment cancelled successfully',
      appointmentId
    });

  } catch (error) {
    console.error('Booking DELETE API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}