import type { NextRequest } from "next/server";
import { auth0 } from "@/lib/auth0";
import { jwtDecode } from "jwt-decode";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const session = await auth0.getSession(request);
    const accessToken = session?.tokenSet.accessToken;

    if (!session?.user) {
      return Response.redirect(
        new URL("/auth/login?returnTo=/dashboard", request.url)
      );
    }

    const accessTokenDecoded: any = jwtDecode(accessToken);

    const roles: string[] =
      accessTokenDecoded["https://raga.space/roles"] || [];

    if (roles.length === 0 || !roles.includes("admin")) {
      return Response.redirect(new URL("/approve", request.url));
    }
  }

  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
