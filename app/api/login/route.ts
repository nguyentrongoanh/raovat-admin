import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Hardcoded credentials (for pet project only)
const VALID_USERNAME = 'admin';
const VALID_PASSWORD = 'password123';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Check if credentials match
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      // Set a simple auth cookie
      const cookieStore = cookies();
      cookieStore.set('auth', 'true', { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
