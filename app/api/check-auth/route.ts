import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Check if the auth cookie exists
    const cookieStore = cookies();
    const authCookie = cookieStore.get('auth');
    
    const isAuthenticated = authCookie?.value === 'true';

    return NextResponse.json({ authenticated: isAuthenticated });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { authenticated: false, message: 'An error occurred during auth check' },
      { status: 500 }
    );
  }
}
