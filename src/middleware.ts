import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  const path = request.nextUrl.pathname;

  // Protect admin routes
  if (path.startsWith('/admin')) {
    // Redirect root /admin and /admin/ to dashboard
    if (path === '/admin' || path === '/admin/') {
      const dashboardUrl = new URL('/admin/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    const isLoginRoute = path === '/admin/login';

    if (!user) {
      if (!isLoginRoute) {
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
      }
      return supabaseResponse;
    }

    // Initialize Server Client to check DB role using current request session cookies
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // NOP
        },
      },
    });

    let isAdmin = false;
    try {
      const { data: adminData } = await supabase
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      isAdmin = !!adminData;
    } catch (err) {
      console.error('[Middleware Auth Check Error]', err);
    }

    if (!isAdmin && !isLoginRoute) {
      // Not logged in as admin -> redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (isAdmin && isLoginRoute) {
      // Admin trying to access login -> redirect to dashboard
      const dashboardUrl = new URL('/admin/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
