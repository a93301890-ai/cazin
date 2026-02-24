import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDb } from "@/lib/db"
import crypto from "crypto"

const TBS2_HALL_ID = process.env.TBS2_HALL_ID || ""
const TBS2_HALL_KEY = process.env.TBS2_HALL_KEY || ""

/**
 * Test API - Simulates TBS2 callback requests locally
 * to verify getBalance and writeBet responses
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { cmd, playerId, sessionId } = await request.json()

    if (!cmd) {
      return NextResponse.json({ error: "cmd is required" }, { status: 400 })
    }

    const sql = getDb()

    // Use the current user as the player if not specified
    const targetPlayerId = playerId || user.id

    // Find or create a test game session
    let testSessionId = sessionId
    if (!testSessionId) {
      // Check for existing active session
      const existing = await sql`
        SELECT session_id FROM game_sessions
        WHERE user_id = ${targetPlayerId} AND is_active = true
        ORDER BY created_at DESC LIMIT 1
      `
      if (existing.length > 0) {
        testSessionId = existing[0].session_id
      } else {
        // Create a test session
        testSessionId = `test_${crypto.randomUUID()}`
        await sql`
          INSERT INTO game_sessions (user_id, session_id, game_id)
          VALUES (${targetPlayerId}, ${testSessionId}, ${"test"})
        `
      }
    }

    // Generate the sign like TBS2 would
    const sign = crypto
      .createHash("md5")
      .update(TBS2_HALL_ID + TBS2_HALL_KEY + targetPlayerId + testSessionId)
      .digest("hex")

    // Build the callback body
    const callbackBody: Record<string, unknown> = {
      cmd,
      hall_id: TBS2_HALL_ID,
      session_id: testSessionId,
      player_id: targetPlayerId,
      sign,
    }

    if (cmd === "writeBet") {
      callbackBody.bet = "1.00"
      callbackBody.win = "0.00"
      callbackBody.transaction_id = `test_tx_${Date.now()}`
      callbackBody.game_id = "test_game"
    }

    // Call our own callback endpoint
    const origin = request.nextUrl.origin
    const callbackResponse = await fetch(`${origin}/api/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(callbackBody),
    })

    const result = await callbackResponse.json()

    return NextResponse.json({
      request: callbackBody,
      response: result,
      sessionId: testSessionId,
    })
  } catch (error) {
    console.error("[Test Callback] Error:", error)
    return NextResponse.json({ error: "Test failed" }, { status: 500 })
  }
}
