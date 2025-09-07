import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    const session = await auth0.getSession(req);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessToken = session?.tokenSet?.accessToken;
    console.log("🚀 ~ GET ~ accessToken:", accessToken);

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token not available" },
        { status: 401 }
      );
    }

    const response = await axios.get(
      `${process.env.API_BASE_URL}/api/v1/submissions`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("🚀 ~ GET ~ response:", response);

    const data = response.data;

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
