import { User, Appointment, UserSession } from '@/types';
import { nanoid } from 'nanoid';

/**
 * Simple in-memory database for MVP
 * In production, this would be replaced with a proper database like PostgreSQL or MongoDB
 */
class SimpleDatabase {
  private users = new Map<string, User>();
  private usersByEmail = new Map<string, User>();
  private appointments = new Map<string, Appointment>();
  private userSessions = new Map<string, UserSession>();

  constructor() {
    // Initialize with mock data
    this.initializeMockData();
  }

  // User management
  createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const user: User = {
      ...userData,
      id: nanoid(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.set(user.id, user);
    this.usersByEmail.set(user.email.toLowerCase(), user);
    
    return user;
  }

  getUserById(id: string): User | null {
    return this.users.get(id) || null;
  }

  getUserByEmail(email: string): User | null {
    return this.usersByEmail.get(email.toLowerCase()) || null;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const user = this.users.get(id);
    if (!user) return null;

    const updatedUser = {
      ...user,
      ...updates,
      id: user.id, // Ensure ID cannot be changed
      updatedAt: new Date()
    };

    this.users.set(id, updatedUser);
    this.usersByEmail.set(updatedUser.email.toLowerCase(), updatedUser);
    
    return updatedUser;
  }

  deleteUser(id: string): boolean {
    const user = this.users.get(id);
    if (!user) return false;

    this.users.delete(id);
    this.usersByEmail.delete(user.email.toLowerCase());
    
    // Clean up user's appointments
    this.getUserAppointments(id).forEach(apt => {
      this.appointments.delete(apt.id);
    });

    return true;
  }

  // Authentication
  authenticateUser(email: string, password: string): User | null {
    const user = this.getUserByEmail(email);
    if (!user) return null;

    // In production, use proper password hashing (bcrypt)
    if (user.password === password) {
      return user;
    }
    
    return null;
  }

  createUserSession(user: User): UserSession {
    const session: UserSession = {
      id: nanoid(),
      userId: user.id,
      user,
      isAuthenticated: true,
      loginTime: new Date(),
      lastActivity: new Date()
    };

    this.userSessions.set(session.id, session);
    return session;
  }

  getUserSession(sessionId: string): UserSession | null {
    const session = this.userSessions.get(sessionId);
    if (!session) return null;

    // Update last activity
    session.lastActivity = new Date();
    this.userSessions.set(sessionId, session);
    
    return session;
  }

  invalidateUserSession(sessionId: string): boolean {
    return this.userSessions.delete(sessionId);
  }

  // Appointment management
  createAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Appointment {
    const appointment: Appointment = {
      ...appointmentData,
      id: nanoid(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.appointments.set(appointment.id, appointment);
    return appointment;
  }

  getAppointmentById(id: string): Appointment | null {
    return this.appointments.get(id) || null;
  }

  getUserAppointments(userId: string): Appointment[] {
    return Array.from(this.appointments.values())
      .filter(apt => apt.userId === userId)
      .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());
  }

  updateAppointment(id: string, updates: Partial<Appointment>): Appointment | null {
    const appointment = this.appointments.get(id);
    if (!appointment) return null;

    const updatedAppointment = {
      ...appointment,
      ...updates,
      id: appointment.id, // Ensure ID cannot be changed
      updatedAt: new Date()
    };

    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  deleteAppointment(id: string): boolean {
    return this.appointments.delete(id);
  }

  // Get all data (for admin purposes)
  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  getAllAppointments(): Appointment[] {
    return Array.from(this.appointments.values());
  }

  // Utility methods
  getUserCount(): number {
    return this.users.size;
  }

  getAppointmentCount(): number {
    return this.appointments.size;
  }

  // Initialize mock data
  private initializeMockData(): void {
    // Mock users
    const mockUsers: Omit<User, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        email: 'john.doe@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1-555-0101',
        dateOfBirth: '1985-06-15',
        gender: 'male',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        },
        emergencyContact: {
          name: 'Jane Doe',
          phone: '+1-555-0102',
          relationship: 'Spouse'
        },
        medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
        allergies: ['Penicillin', 'Shellfish'],
        currentMedications: ['Metformin', 'Lisinopril']
      },
      {
        email: 'jane.smith@example.com',
        password: 'password456',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+1-555-0201',
        dateOfBirth: '1990-09-22',
        gender: 'female',
        address: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210'
        },
        emergencyContact: {
          name: 'Robert Smith',
          phone: '+1-555-0202',
          relationship: 'Father'
        },
        medicalHistory: ['Asthma'],
        allergies: ['Pollen'],
        currentMedications: ['Albuterol inhaler']
      },
      {
        email: 'mike.johnson@example.com',
        password: 'password789',
        firstName: 'Mike',
        lastName: 'Johnson',
        phone: '+1-555-0301',
        dateOfBirth: '1978-03-10',
        gender: 'male',
        address: {
          street: '789 Pine Rd',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601'
        },
        emergencyContact: {
          name: 'Sarah Johnson',
          phone: '+1-555-0302',
          relationship: 'Sister'
        },
        medicalHistory: ['Lower back pain', 'Anxiety'],
        allergies: ['None known'],
        currentMedications: ['Ibuprofen as needed']
      },
      {
        email: 'admin@medical-app.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        phone: '+1-555-0000',
        dateOfBirth: '1980-01-01',
        gender: 'other',
        address: {
          street: '1 Admin Blvd',
          city: 'Admin City',
          state: 'AD',
          zipCode: '00000'
        },
        emergencyContact: {
          name: 'Emergency Admin',
          phone: '+1-555-0001',
          relationship: 'System'
        },
        medicalHistory: [],
        allergies: [],
        currentMedications: []
      }
    ];

    // Create mock users
    mockUsers.forEach(userData => {
      this.createUser(userData);
    });

    console.log(`✅ Initialized database with ${this.getUserCount()} mock users`);
  }

  // Cleanup old sessions
  cleanupExpiredSessions(maxAgeHours: number = 24): number {
    const cutoffTime = new Date(Date.now() - (maxAgeHours * 60 * 60 * 1000));
    let deletedCount = 0;

    for (const [sessionId, session] of this.userSessions.entries()) {
      if (session.lastActivity < cutoffTime) {
        this.userSessions.delete(sessionId);
        deletedCount++;
      }
    }

    return deletedCount;
  }
}

// Singleton instance
export const database = new SimpleDatabase();

export default SimpleDatabase;