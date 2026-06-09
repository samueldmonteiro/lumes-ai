import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { User } from '@/types/user.type';

// Rotas que exigem autenticação
const protectedRoutes = ['/admin'];
// Rotas acessíveis apenas para usuários não autenticados
const publicOnlyRoutes = ['/login', '/cadastro', '/presentation'];

// Middleware de roteamento: protege rotas admin, redireciona usuários logados, etc.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const userCookie = request.cookies.get('user')?.value;

  const isProtected = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  const isPublic = publicOnlyRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublic && token) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  if (pathname.startsWith('/admin') && token && userCookie) {
    try {
      const user: User = JSON.parse(userCookie);
      if (user.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/home', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/chat',
    '/chat/:path*',
    '/admin',
    '/admin/:path*',
    '/home',
    '/home/:path*',
    '/config',
    '/config/:path*',
    '/login',
    '/cadastro',
    '/presentation',
  ],
};
