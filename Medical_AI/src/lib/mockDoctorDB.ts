import { Doctor, Appointment } from '@/types';
import { nanoid } from 'nanoid';

/**
 * Mock doctors database for simulated appointment booking
 */
class MockDoctorDatabase {
  private doctors: Doctor[] = [
    // Cardiology
    {
      id: 'card-001',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      availableSlots: [
        'October 9, 2025 10:00 AM',
        'October 9, 2025 2:00 PM',
        'October 10, 2025 9:00 AM',
        'October 10, 2025 3:00 PM',
        'October 11, 2025 11:00 AM'
      ],
      description: 'Board-certified cardiologist specializing in preventive cardiology and heart disease.'
    },
    {
      id: 'card-002',
      name: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      availableSlots: [
        'October 9, 2025 1:00 PM',
        'October 10, 2025 10:00 AM',
        'October 11, 2025 2:00 PM',
        'October 12, 2025 9:00 AM'
      ],
      description: 'Interventional cardiologist with expertise in cardiac catheterization.'
    },

    // Dermatology
    {
      id: 'derm-001',
      name: 'Dr. Sarah Mitchell',
      specialty: 'Dermatology',
      availableSlots: [
        'October 9, 2025 10:30 AM',
        'October 9, 2025 2:30 PM',
        'October 10, 2025 9:30 AM',
        'October 11, 2025 1:30 PM'
      ],
      description: 'Dermatologist specializing in medical and cosmetic dermatology.'
    },
    {
      id: 'derm-002',
      name: 'Dr. James Wilson',
      specialty: 'Dermatology',
      availableSlots: [
        'October 10, 2025 11:00 AM',
        'October 11, 2025 3:00 PM',
        'October 12, 2025 10:00 AM'
      ],
      description: 'Dermatopathologist with focus on skin cancer diagnosis and treatment.'
    },

    // Orthopedics
    {
      id: 'ortho-001',
      name: 'Dr. David Rodriguez',
      specialty: 'Orthopedics',
      availableSlots: [
        'October 9, 2025 8:00 AM',
        'October 9, 2025 4:00 PM',
        'October 10, 2025 8:30 AM',
        'October 11, 2025 2:30 PM'
      ],
      description: 'Orthopedic surgeon specializing in sports medicine and joint replacement.'
    },

    // Neurology
    {
      id: 'neuro-001',
      name: 'Dr. Lisa Thompson',
      specialty: 'Neurology',
      availableSlots: [
        'October 10, 2025 1:00 PM',
        'October 11, 2025 10:00 AM',
        'October 12, 2025 2:00 PM'
      ],
      description: 'Neurologist with expertise in headache disorders and epilepsy.'
    },

    // Gastroenterology
    {
      id: 'gastro-001',
      name: 'Dr. Robert Kim',
      specialty: 'Gastroenterology',
      availableSlots: [
        'October 9, 2025 11:00 AM',
        'October 10, 2025 2:00 PM',
        'October 11, 2025 9:00 AM'
      ],
      description: 'Gastroenterologist specializing in digestive disorders and endoscopy.'
    },

    // Pulmonology
    {
      id: 'pulm-001',
      name: 'Dr. Amanda Foster',
      specialty: 'Pulmonology',
      availableSlots: [
        'October 9, 2025 3:00 PM',
        'October 10, 2025 11:30 AM',
        'October 12, 2025 1:00 PM'
      ],
      description: 'Pulmonologist with focus on asthma and chronic respiratory conditions.'
    },

    // Internal Medicine (General)
    {
      id: 'internal-001',
      name: 'Dr. Jennifer Lee',
      specialty: 'Internal Medicine',
      availableSlots: [
        'October 9, 2025 9:00 AM',
        'October 9, 2025 1:30 PM',
        'October 10, 2025 10:30 AM',
        'October 10, 2025 3:30 PM',
        'October 11, 2025 8:30 AM'
      ],
      description: 'Internal medicine physician providing comprehensive adult healthcare.'
    },
    {
      id: 'internal-002',
      name: 'Dr. Mark Davis',
      specialty: 'Internal Medicine',
      availableSlots: [
        'October 9, 2025 12:00 PM',
        'October 10, 2025 9:00 AM',
        'October 11, 2025 4:00 PM'
      ],
      description: 'Primary care physician with focus on preventive medicine.'
    }
  ];

  private appointments: Appointment[] = [];

  /**
   * Get all doctors by specialty
   */
  getDoctorsBySpecialty(specialty: string): Doctor[] {
    return this.doctors.filter(doctor => 
      doctor.specialty.toLowerCase() === specialty.toLowerCase()
    );
  }

  /**
   * Get doctor by ID
   */
  getDoctorById(doctorId: string): Doctor | null {
    return this.doctors.find(doctor => doctor.id === doctorId) || null;
  }

  /**
   * Get all available specialties
   */
  getAvailableSpecialties(): string[] {
    const specialties = new Set(this.doctors.map(doctor => doctor.specialty));
    return Array.from(specialties).sort();
  }

  /**
   * Book appointment with first available doctor in specialty
   */
  bookAppointment(sessionId: string, specialty: string): Appointment | null {
    const doctors = this.getDoctorsBySpecialty(specialty);
    
    // Find first doctor with available slots
    for (const doctor of doctors) {
      if (doctor.availableSlots.length > 0) {
        const scheduledTime = doctor.availableSlots[0];
        
        // Create appointment
        const appointment: Appointment = {
          id: nanoid(),
          sessionId,
          doctorId: doctor.id,
          doctorName: doctor.name,
          specialty: doctor.specialty,
          scheduledTime,
          status: 'confirmed',
          createdAt: new Date()
        };

        // Remove the booked slot from doctor's availability
        doctor.availableSlots.splice(0, 1);
        
        // Store appointment
        this.appointments.push(appointment);
        
        return appointment;
      }
    }

    return null; // No available appointments
  }

  /**
   * Get appointment by ID
   */
  getAppointment(appointmentId: string): Appointment | null {
    return this.appointments.find(apt => apt.id === appointmentId) || null;
  }

  /**
   * Get all appointments for a session
   */
  getAppointmentsBySession(sessionId: string): Appointment[] {
    return this.appointments.filter(apt => apt.sessionId === sessionId);
  }

  /**
   * Cancel appointment
   */
  cancelAppointment(appointmentId: string): boolean {
    const appointment = this.getAppointment(appointmentId);
    if (!appointment) return false;

    appointment.status = 'cancelled';
    
    // Return the slot back to doctor's availability
    const doctor = this.getDoctorById(appointment.doctorId);
    if (doctor) {
      doctor.availableSlots.push(appointment.scheduledTime);
      // Sort slots to maintain order
      doctor.availableSlots.sort();
    }

    return true;
  }

  /**
   * Get next available slot for specialty
   */
  getNextAvailableSlot(specialty: string): string | null {
    const doctors = this.getDoctorsBySpecialty(specialty);
    let earliestSlot: string | null = null;

    for (const doctor of doctors) {
      if (doctor.availableSlots.length > 0) {
        const slot = doctor.availableSlots[0];
        if (!earliestSlot || new Date(slot) < new Date(earliestSlot)) {
          earliestSlot = slot;
        }
      }
    }

    return earliestSlot;
  }

  /**
   * Get all appointments (for admin)
   */
  getAllAppointments(): Appointment[] {
    return this.appointments;
  }

  /**
   * Get doctor statistics
   */
  getDoctorStats(): {
    totalDoctors: number;
    doctorsBySpecialty: Record<string, number>;
    totalAppointments: number;
    availableSlots: number;
  } {
    const doctorsBySpecialty: Record<string, number> = {};
    let totalSlots = 0;

    for (const doctor of this.doctors) {
      doctorsBySpecialty[doctor.specialty] = (doctorsBySpecialty[doctor.specialty] || 0) + 1;
      totalSlots += doctor.availableSlots.length;
    }

    return {
      totalDoctors: this.doctors.length,
      doctorsBySpecialty,
      totalAppointments: this.appointments.length,
      availableSlots: totalSlots
    };
  }
}

// Singleton instance
export const mockDoctorDB = new MockDoctorDatabase();

export default MockDoctorDatabase;