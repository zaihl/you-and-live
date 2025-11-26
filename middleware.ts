import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define routes that strictly require authentication
// We EXCLUDE generation routes here to allow guests
const isProtectedRoute = createRouteMatcher([
    '/settings(.*)',
    // '/dashboard' is technically public now for guests
]);

export default clerkMiddleware((auth, req) => {
    // Only protect strict routes, let the app logic handle limits for others
    if (isProtectedRoute(req)) {
        auth().protect();
    }
});

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};