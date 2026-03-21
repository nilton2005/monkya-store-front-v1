import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Gate para rutas admin y API admin (excepto login/logout)
  const isAdminPage = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');
  const isAuthRoute = pathname.startsWith('/api/admin/auth/');
  const isLoginPage = pathname === '/admin/login';

  if ((isAdminPage || isAdminApi) && !isAuthRoute && !isLoginPage) {
    const expectedSession = process.env.ADMIN_SESSION_TOKEN;
    const currentSession = request.cookies.get('admin_session')?.value;

    const isAuthorized = Boolean(expectedSession) && currentSession === expectedSession;

    if (!isAuthorized) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Handle placeholder images
  if (pathname.startsWith('/placeholder-')) {
    // Return a simple PNG data URL instead of SVG
    const name = request.nextUrl.pathname.replace('/placeholder-', '').replace('.jpg', '');
    
    // Create a simple 1x1 colored pixel PNG
    const color = request.nextUrl.pathname.includes('black') ? '000000' : 'E5E7EB';
    
    // Simple base64 encoded 1x1 transparent PNG
    const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    return new NextResponse(Buffer.from(pngBase64, 'base64'), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/placeholder-:path*.jpg', '/admin/:path*', '/api/admin/:path*'],
};