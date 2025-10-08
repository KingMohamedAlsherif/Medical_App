import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Booking API is working!' });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ 
      message: 'Booking POST received', 
      received: body,
      success: true 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to parse request body',
      success: false 
    }, { status: 400 });
  }
}