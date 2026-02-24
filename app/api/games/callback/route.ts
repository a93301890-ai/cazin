import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  // GET BALANCE
  if (body.cmd === "getBalance") {
    return NextResponse.json({
      status: "success",
      error: "",
      login: body.login || "demo",
      balance: "1000.00",
      currency: "USD"
    });
  }

  // WRITE BET
  if (body.cmd === "writeBet") {
    return NextResponse.json({
      status: "success",
      error: "",
      login: body.login || "demo",
      balance: "1000.00",
      currency: "USD"
    });
  }

  return NextResponse.json({
    status: "fail",
    error: "unknown_cmd"
  });
}
