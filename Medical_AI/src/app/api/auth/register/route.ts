import { NextRequest, NextResponse } from 'next/server';
import { RegisterRequest, RegisterResponse } from '@/types';
import { database } from '@/lib/database';

export async function POST(request: NextRequest): Promise<NextResponse<RegisterResponse>> {
  try {
    const body: RegisterRequest = await request.json();
    const { email, password, firstName, lastName, phone, dateOfBirth, gender } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phone || !dateOfBirth || !gender) {
      return NextResponse.json({
        success: false,
        message: 'All fields are required',
        error: 'MISSING_REQUIRED_FIELDS'
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = database.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'User with this email already exists',
        error: 'USER_EXISTS'
      }, { status: 409 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email format',
        error: 'INVALID_EMAIL'
      }, { status: 400 });
    }

    // Validate password strength (basic validation)
    if (password.length < 6) {
      return NextResponse.json({
        success: false,
        message: 'Password must be at least 6 characters long',
        error: 'WEAK_PASSWORD'
      }, { status: 400 });
    }

    // Create user with default values
    const newUser = database.createUser({
      email: email.toLowerCase(),
      password, // In production, hash this password
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender,
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      },
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      },
      medicalHistory: [],
      allergies: [],
      currentMedications: []
    });

    // Remove sensitive data before sending response
    const { password: _, ...safeUser } = newUser;

    return NextResponse.json({
      success: true,
      user: safeUser,
      message: 'Registration successful'
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: 'SERVER_ERROR'
    }, { status: 500 });
  }
}