import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("Callback:", body);

  return NextResponse.json({ status: "ok" });
}
