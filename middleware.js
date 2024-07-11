import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define the routes that should be protected
const isProtectedRoute = createRouteMatcher(['/home(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { user } = auth;
  const url = req.nextUrl.clone();
  if (isProtectedRoute(req)) {
    if (user && user.publicMetadata) {
      const { nickname } = user.publicMetadata;
      if (!nickname) {
        console.log('Redirecting to /nickname');
        url.pathname = '/nickname';
        return NextResponse.rewrite(url);
      }
    } else {
      console.log('Redirecting to /home');
      url.pathname = '/home';
      return NextResponse.rewrite(url);
    }
  }
  return NextResponse.next();
});
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};