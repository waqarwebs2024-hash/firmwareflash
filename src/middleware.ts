
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of common scraping user-agents and bot identifiers
const BLOCKED_USER_AGENTS = [
    'axios', 'Scrapy', 'python-requests', 'gocolly', 'node-fetch', 
    'got', 'curl', 'wget', 'Go-http-client', 'Java', 'Apache-HttpClient',
    'Nmap', 'masscan', 'sqlmap', 'Googlebot-Image', // Often used for scraping, not just indexing
    'AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot', 'PetalBot'
];

export function middleware(request: NextRequest) {
    const userAgent = request.headers.get('user-agent') || '';
    const secFetchSite = request.headers.get('sec-fetch-site');
    const secFetchMode = request.headers.get('sec-fetch-mode');
    const secFetchDest = request.headers.get('sec-fetch-dest');

    const isBot = BLOCKED_USER_AGENTS.some(bot => userAgent.toLowerCase().includes(bot.toLowerCase()));
    
    // Block requests with a user-agent from the blocklist
    if (isBot) {
        return new NextResponse('Access Denied: Your request appears to be from an automated bot.', { status: 403 });
    }
    
    // Block requests that look like direct navigation but are missing key browser headers.
    // This is a common pattern for simple scripts.
    if (
        request.method === 'GET' &&
        !secFetchSite &&
        !secFetchMode &&
        !sec-fetch-dest &&
        !userAgent.toLowerCase().includes('googlebot') && // Allow Google's main crawler for SEO
        !userAgent.toLowerCase().includes('bingbot')
    ) {
        return new NextResponse('Access Denied: Invalid request headers.', { status: 403 });
    }

    return NextResponse.next();
}

// Configure the middleware to run on all paths except for static assets and API routes
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
};
