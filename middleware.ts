import type { NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const session = await auth0.getSession(request); 
    
    if (!session?.user) {
      return Response.redirect(new URL('/auth/login?returnTo=/dashboard', request.url));
    }

    const roles = session.user['https://raga.space/roles'] || [];
    console.log("roles: " , roles)
    console.log("user: " , session.user)
    // if (!roles.includes('admin')) {
    //   return Response.redirect(new URL('/auth/login?error=unauthorized', request.url));
    // }
  }


  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};