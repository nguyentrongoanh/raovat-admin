import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the auth cookie
  const authCookie = request.cookies.get('auth')?.value;

  // Check if the user is authenticated
  const isAuthenticated = authCookie === 'true';

  // Get the path the user is requesting
  const path = request.nextUrl.pathname;

  // Create a response object to modify
  let response = NextResponse.next();

  // Set the currentPath cookie to help with layout decisions
  response.cookies.set('currentPath', path, {
    path: '/',
    httpOnly: false, // Make it accessible from JavaScript
    sameSite: 'strict',
  });

  // If the user is not authenticated and not on the login page, redirect to login
  if (!isAuthenticated && path !== '/login') {
    const loginUrl = new URL('/login', request.url);
    response = NextResponse.redirect(loginUrl);

    // Also set the currentPath cookie on the redirect
    response.cookies.set('currentPath', '/login', {
      path: '/',
      httpOnly: false, // Make it accessible from JavaScript
      sameSite: 'strict',
    });

    return response;
  }

  // If the user is authenticated and on the login page, redirect to dashboard
  if (isAuthenticated && path === '/login') {
    const dashboardUrl = new URL('/dashboard', request.url);
    response = NextResponse.redirect(dashboardUrl);

    // Also set the currentPath cookie on the redirect
    response.cookies.set('currentPath', '/dashboard', {
      path: '/',
      httpOnly: false, // Make it accessible from JavaScript
      sameSite: 'strict',
    });

    return response;
  }

  // If the user is authenticated and on the home page, redirect to dashboard
  if (isAuthenticated && path === '/') {
    const dashboardUrl = new URL('/dashboard', request.url);
    response = NextResponse.redirect(dashboardUrl);

    // Also set the currentPath cookie on the redirect
    response.cookies.set('currentPath', '/dashboard', {
      path: '/',
      httpOnly: false, // Make it accessible from JavaScript
      sameSite: 'strict',
    });

    return response;
  }

  // Otherwise, continue with the request
  return response;
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
