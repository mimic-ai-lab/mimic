import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    // Manual cookie parsing since getSessionCookie helper doesn't work reliably with custom cookie names
    const allCookies = request.headers.get('cookie');
    let hasSession = false;

    if (allCookies) {
        const cookies = allCookies.split(';').map(cookie => cookie.trim());
        const mimicCookie = cookies.find(cookie => cookie.startsWith('mimic_session='));
        hasSession = !!mimicCookie;
    }

    // Define protected routes that require authentication
    const isProtectedRoute = request.nextUrl.pathname === "/" ||
        request.nextUrl.pathname.startsWith("/sessions") ||
        request.nextUrl.pathname.startsWith("/personas") ||
        request.nextUrl.pathname.startsWith("/agents") ||
        request.nextUrl.pathname.startsWith("/settings");

    // Define auth pages that authenticated users shouldn't access
    const isAuthPage = request.nextUrl.pathname === "/auth" ||
        request.nextUrl.pathname === "/verify";

    // Redirect unauthenticated users away from protected routes
    if (!hasSession && isProtectedRoute) {
        return NextResponse.redirect(new URL("/auth", request.url));
    }

    // Redirect authenticated users away from auth pages
    if (hasSession && isAuthPage) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Allow the request to proceed
    return NextResponse.next();
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
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
}; 