import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  // Allow public routes
  const publicRoutes = ['/', '/landing', '/auth', '/onboarding']
  if (publicRoutes.some(route =>
    pathname === route ||
    pathname.startsWith(`${route}/`) ||
    (route === '/auth' && pathname.startsWith('/auth/'))
  )) {
    return NextResponse.next()
  }

  // Check for NextAuth session cookies (avoid initializing NextAuth in Edge)
  const cookieCandidate = request.cookies.get('__Secure-next-auth.session-token') ?? request.cookies.get('next-auth.session-token')

  // If no session cookie, redirect to landing
  if (!cookieCandidate) {
    return NextResponse.redirect(new URL('/landing', request.url))
  }

  // Check trial status via API (since Prisma doesn't work in edge runtime)
  // In development, use relative URL to avoid SSL hostname mismatch
  const trialCheckUrl = process.env.NODE_ENV === 'development'
    ? `http://localhost:3000/api/trial-check`
    : new URL('/api/trial-check', request.url).toString()

  try {
    // Forward the original Cookie header so the server can resolve the session
    const response = await fetch(trialCheckUrl, {
      headers: {
        'x-middleware-check': 'true',
        'cookie': request.headers.get('cookie') || ''
      }
    })

    if (!response.ok) {
      return NextResponse.next()
    }

    const data = await response.json()

    // If onboarding not complete, allow onboarding routes
    if (!data.onboardingComplete && pathname.startsWith('/onboarding')) {
      return NextResponse.next()
    }

    // If onboarding not complete and not on onboarding route, redirect
    if (!data.onboardingComplete && !pathname.startsWith('/onboarding')) {
      // Use relative redirect to avoid SSL issues in development
      return NextResponse.redirect(new URL('/onboarding/welcome', request.url))
    }

    // If user is a member, allow all routes
    if (data.isMember) {
      return NextResponse.next()
    }

    // If trial is active, allow all routes
    if (data.trialActive) {
      return NextResponse.next()
    }

    // Trial expired and not a member - redirect to trial-ended
    if (!pathname.startsWith('/trial-ended') && !pathname.startsWith('/membership')) {
      // Use relative redirect to avoid SSL issues in development
      return NextResponse.redirect(new URL('/trial-ended', request.url))
    }
  } catch (error) {
    console.error('Middleware trial check error:', error)
    // On error, allow the request to proceed
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}