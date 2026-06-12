import { NextResponse } from 'next/server';

const privateRoutes = [
  '/add-idea',
  '/my-ideas',
  '/my-interactions',
  '/profile',
];

const authRoutes = ['/login', '/register'];

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  const sessionCookie =
    request.cookies.get('better-auth.session_token') ||
    request.cookies.get('__Secure-better-auth.session_token');

  const isLoggedIn = !!sessionCookie;

  if (isPrivateRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname.startsWith('/ideas/') && pathname !== '/ideas' && !isLoggedIn) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/add-idea/:path*',
    '/my-ideas/:path*',
    '/my-interactions/:path*',
    '/profile/:path*',
    '/ideas/:path*',
    '/login',
    '/register',
  ],
};