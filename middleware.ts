import { auth0 } from "@/lib/auth0";
import { jwtDecode } from "jwt-decode";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/admin-dashboard") ||
    pathname.startsWith("/user-dashboard") || 
    pathname.startsWith("/apply")
  ) {
    const session = await auth0.getSession(request);
    const accessToken = session?.tokenSet.accessToken;

    if (!session?.user || !accessToken) {
      const returnTo = pathname;
      return Response.redirect(
        new URL(`/auth/login?returnTo=${returnTo}`, request.url)
      );
    }
  

    const accessTokenDecoded: any = jwtDecode(accessToken);
    const roles: string[] =
      accessTokenDecoded["https://raga.space/roles"] || [];

    if (pathname.startsWith("/admin-dashboard")) {
      if (!roles.includes("admin")) {
        return Response.redirect(new URL("/approve", request.url));
      }
    }
  }

  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
