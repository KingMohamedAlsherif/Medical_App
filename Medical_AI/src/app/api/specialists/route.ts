import { NextRequest, NextResponse } from 'next/server';
import { mockDoctorDB } from '@/lib/mockDoctorDB';

/**
 * GET /api/specialists
 * Retrieves available specialties and doctors
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get('specialty');
    const doctorId = searchParams.get('doctorId');

    // Get specific doctor
    if (doctorId) {
      const doctor = mockDoctorDB.getDoctorById(doctorId);
      if (!doctor) {
        return NextResponse.json(
          { error: 'Doctor not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ doctor });
    }

    // Get doctors by specialty
    if (specialty) {
      const doctors = mockDoctorDB.getDoctorsBySpecialty(specialty);
      const nextSlot = mockDoctorDB.getNextAvailableSlot(specialty);
      
      return NextResponse.json({
        specialty,
        doctors,
        count: doctors.length,
        nextAvailableSlot: nextSlot,
        hasAvailability: doctors.some(d => d.availableSlots.length > 0)
      });
    }

    // Get all specialties and stats
    const specialties = mockDoctorDB.getAvailableSpecialties();
    const stats = mockDoctorDB.getDoctorStats();

    // Get availability info for each specialty
    const specialtyInfo = specialties.map(spec => ({
      name: spec,
      doctorCount: stats.doctorsBySpecialty[spec] || 0,
      nextAvailableSlot: mockDoctorDB.getNextAvailableSlot(spec),
      hasAvailability: mockDoctorDB.getDoctorsBySpecialty(spec).some(d => d.availableSlots.length > 0)
    }));

    return NextResponse.json({
      specialties: specialtyInfo,
      totalSpecialties: specialties.length,
      totalDoctors: stats.totalDoctors,
      totalAvailableSlots: stats.availableSlots,
      totalAppointments: stats.totalAppointments
    });

  } catch (error) {
    console.error('Specialists API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}