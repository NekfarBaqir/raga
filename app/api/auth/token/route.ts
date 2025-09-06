import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Create a response object
    const res = new NextResponse();

    // Get the session by passing both the request and response
    const session = await auth0.getSession(req);
    const accessToken = session?.accessToken; // Note: Use 'accessToken', not 'tokenSet.accessToken'

    console.log("Session:", session);
    console.log("Access Token:", accessToken);

    // If no session or token, return unauthorized
    if (!session || !accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Return the access token in the response
    return NextResponse.json({ accessToken }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/auth/token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
