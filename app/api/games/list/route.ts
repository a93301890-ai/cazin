import { NextResponse } from "next/server"
import { games } from "@/data/games"

export async function GET() {
  return NextResponse.json({ games })
}
