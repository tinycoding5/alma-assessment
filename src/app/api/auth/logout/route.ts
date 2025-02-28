import { NextResponse } from "next/server";

export async function POST() {
  // Remove the token by setting an expired cookie
  const cookie = `token=; Path=/; HttpOnly; Max-Age=0`;

  return NextResponse.json(
    { message: "Logged out successfully" },
    {
      headers: {
        "Set-Cookie": cookie,
      },
    }
  );
}
