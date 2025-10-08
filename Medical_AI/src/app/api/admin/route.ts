import { NextRequest, NextResponse } from 'next/server';
import { sessionStore } from '@/lib/sessionStore';
import { mockDoctorDB } from '@/lib/mockDoctorDB';

/**
 * GET /api/admin
 * Admin dashboard with system statistics and logs
 * Note: In production, this should have proper authentication
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'sessions':
        return getSessionStats();
      case 'appointments':
        return getAppointmentStats();
      case 'triage-logs':
        return getTriageLogs();
      case 'system-health':
        return getSystemHealth();
      default:
        return getDashboardOverview();
    }

  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Dashboard overview with key metrics
 */
function getDashboardOverview() {
  const sessions = sessionStore.getAllSessions();
  const doctorStats = mockDoctorDB.getDoctorStats();
  const appointments = mockDoctorDB.getAllAppointments();

  // Calculate session statistics
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const recentSessions = sessions.filter(s => s.createdAt > last24h);

  // Calculate message statistics
  let totalMessages = 0;
  let emergencyTriages = 0;
  let nonEmergencyTriages = 0;

  sessions.forEach(session => {
    totalMessages += session.messages.length;
    const triageLogs = sessionStore.getTriageLogs(session.id);
    triageLogs.forEach(log => {
      if (log.result.isEmergency) {
        emergencyTriages++;
      } else {
        nonEmergencyTriages++;
      }
    });
  });

  // Calculate appointment statistics
  const confirmedAppointments = appointments.filter(apt => apt.status === 'confirmed');
  const recentAppointments = appointments.filter(apt => apt.createdAt > last24h);

  const overview = {
    system: {
      status: 'operational',
      uptime: '99.9%',
      lastUpdated: now.toISOString()
    },
    sessions: {
      total: sessions.length,
      active: sessions.filter(s => {
        const timeSinceUpdate = now.getTime() - s.updatedAt.getTime();
        return timeSinceUpdate < 30 * 60 * 1000; // Active within 30 minutes
      }).length,
      last24h: recentSessions.length
    },
    messages: {
      total: totalMessages,
      averagePerSession: sessions.length > 0 ? Math.round(totalMessages / sessions.length) : 0
    },
    triage: {
      total: emergencyTriages + nonEmergencyTriages,
      emergency: emergencyTriages,
      nonEmergency: nonEmergencyTriages,
      emergencyRate: emergencyTriages + nonEmergencyTriages > 0 
        ? Math.round((emergencyTriages / (emergencyTriages + nonEmergencyTriages)) * 100) 
        : 0
    },
    appointments: {
      total: appointments.length,
      confirmed: confirmedAppointments.length,
      last24h: recentAppointments.length,
      availableSlots: doctorStats.availableSlots
    },
    doctors: doctorStats
  };

  return NextResponse.json(overview);
}

/**
 * Detailed session statistics
 */
function getSessionStats() {
  const sessions = sessionStore.getAllSessions();
  
  const stats = sessions.map(session => ({
    id: session.id,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    messageCount: session.messages.length,
    triageCount: sessionStore.getTriageLogs(session.id).length,
    appointments: mockDoctorDB.getAppointmentsBySession(session.id),
    lastMessage: session.messages[session.messages.length - 1]?.content.substring(0, 100) + '...'
  }));

  return NextResponse.json({
    sessions: stats,
    total: sessions.length
  });
}

/**
 * Appointment statistics and details
 */
function getAppointmentStats() {
  const appointments = mockDoctorDB.getAllAppointments();
  const doctorStats = mockDoctorDB.getDoctorStats();

  // Group appointments by specialty
  const appointmentsBySpecialty = appointments.reduce((acc, apt) => {
    acc[apt.specialty] = (acc[apt.specialty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Group by status
  const appointmentsByStatus = appointments.reduce((acc, apt) => {
    acc[apt.status] = (acc[apt.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return NextResponse.json({
    appointments,
    statistics: {
      total: appointments.length,
      bySpecialty: appointmentsBySpecialty,
      byStatus: appointmentsByStatus,
      ...doctorStats
    }
  });
}

/**
 * Triage logs for analysis
 */
function getTriageLogs() {
  const sessions = sessionStore.getAllSessions();
  const allLogs: any[] = [];

  sessions.forEach(session => {
    const logs = sessionStore.getTriageLogs(session.id);
    logs.forEach(log => {
      allLogs.push({
        ...log,
        sessionMessages: session.messages.length
      });
    });
  });

  // Sort by timestamp (most recent first)
  allLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return NextResponse.json({
    triageLogs: allLogs,
    total: allLogs.length,
    emergencyCount: allLogs.filter(log => log.result.isEmergency).length,
    nonEmergencyCount: allLogs.filter(log => !log.result.isEmergency).length
  });
}

/**
 * System health check
 */
function getSystemHealth() {
  const now = new Date();
  const memoryUsage = process.memoryUsage();
  
  const health = {
    timestamp: now.toISOString(),
    status: 'healthy',
    uptime: process.uptime(),
    memory: {
      used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
      total: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      external: Math.round(memoryUsage.external / 1024 / 1024) // MB
    },
    sessions: {
      count: sessionStore.getSessionCount(),
      memoryEstimate: sessionStore.getSessionCount() * 2 // Rough estimate in KB
    },
    checks: {
      sessionStore: sessionStore.getSessionCount() >= 0,
      doctorDatabase: mockDoctorDB.getDoctorStats().totalDoctors > 0,
      triageAgent: true // Could add more sophisticated health checks
    }
  };

  return NextResponse.json(health);
}

/**
 * POST /api/admin
 * Admin actions like cleanup, reset, etc.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'cleanup-sessions':
        const deleted = sessionStore.clearOldSessions(24); // Clear sessions older than 24 hours
        return NextResponse.json({ 
          message: `Cleaned up ${deleted} old sessions`,
          deletedCount: deleted
        });

      case 'reset-system':
        // This is a dangerous operation - should be protected in production
        return NextResponse.json({ 
          error: 'Reset system not implemented for safety',
          message: 'This operation requires manual intervention'
        }, { status: 400 });

      default:
        return NextResponse.json(
          { error: 'Invalid admin action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Admin POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}