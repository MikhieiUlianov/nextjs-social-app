import { getUser } from "@/utils/getUser";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { user } = await getUser();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}
