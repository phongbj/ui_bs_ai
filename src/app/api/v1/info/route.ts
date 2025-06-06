import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { basicInfo } from "@/lib/db/db";

export async function GET() {
  const session = await auth();

  // Check if user is authenticated
  if (!session?.user || !session.user.id) {
    return NextResponse.json(
      { error: "Unauthorized", message: "Authentication required" },
      { status: 401 }
    );
  }

  const info = await basicInfo(session.user.id);

  // Return user info or other authorized data
  return NextResponse.json({
    status: "success",
    info: info
  });
}
