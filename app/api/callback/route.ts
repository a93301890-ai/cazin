export const runtime = "nodejs"
import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { getHallId, getHallKey, type TBS2CallbackRequest, type TBS2CallbackResponse } from "@/lib/tbs2"
import crypto from "crypto"

/**
 * TBS2 Seamless Wallet Callback Endpoint
 * Handles getBalance and writeBet commands from the game provider
 */
export async function POST(request: NextRequest) {
  try {
    const body: TBS2CallbackRequest = await request.json()
    const { cmd, session_id, player_id, sign } = body

    console.log(`[TBS2 Callback] cmd=${cmd}, player_id=${player_id}, session_id=${session_id}`)

    // Validate required fields
    if (!cmd || !session_id || !player_id || !sign) {
      return NextResponse.json(
        { error: 1, message: "Missing required parameters" } satisfies TBS2CallbackResponse,
        { status: 200 }
      )
    }

    // Verify sign
    const hallId = getHallId()
    const hallKey = getHallKey()
    const expectedSign = crypto
      .createHash("md5")
      .update(hallId + hallKey + player_id + session_id)
      .digest("hex")

    if (sign !== expectedSign) {
      console.log(`[TBS2 Callback] Invalid sign. Expected: ${expectedSign}, Got: ${sign}`)
      return NextResponse.json(
        { error: 3, message: "Invalid sign" } satisfies TBS2CallbackResponse,
        { status: 200 }
      )
    }

    const sql = getDb()

    // Find the game session and associated user
    const sessions = await sql`
      SELECT gs.id, gs.user_id, gs.is_active, u.balance, u.username
      FROM game_sessions gs
      JOIN users u ON u.id = gs.user_id
      WHERE gs.session_id = ${session_id}
        AND gs.is_active = true
    `

    if (sessions.length === 0) {
      console.log(`[TBS2 Callback] Session not found: ${session_id}`)
      return NextResponse.json(
        { error: 2, message: "Session not found or expired" } satisfies TBS2CallbackResponse,
        { status: 200 }
      )
    }

    const session = sessions[0]
    const userId = session.user_id
    const currentBalance = Number(session.balance)

    switch (cmd) {
      case "getBalance": {
        console.log(`[TBS2 Callback] getBalance for user ${userId}: ${currentBalance}`)
        return NextResponse.json(
          { error: 0, balance: currentBalance } satisfies TBS2CallbackResponse,
          { status: 200 }
        )
      }

      case "writeBet": {
        const bet = Number(body.bet || 0)
        const win = Number(body.win || 0)
        const transactionId = body.transaction_id || `tx_${Date.now()}`
        const gameId = body.game_id || ""

        // Check for duplicate transaction
        const existing = await sql`
          SELECT id FROM game_transactions WHERE transaction_id = ${transactionId}
        `
        if (existing.length > 0) {
          // Return current balance for duplicate
          const users = await sql`SELECT balance FROM users WHERE id = ${userId}`
          return NextResponse.json(
            { error: 0, balance: Number(users[0].balance) } satisfies TBS2CallbackResponse,
            { status: 200 }
          )
        }

        const balanceChange = win - bet
        const newBalance = currentBalance + balanceChange

        // Check insufficient funds
        if (newBalance < 0) {
          console.log(`[TBS2 Callback] Insufficient funds: balance=${currentBalance}, bet=${bet}, win=${win}`)
          return NextResponse.json(
            { error: 4, message: "Insufficient funds" } satisfies TBS2CallbackResponse,
            { status: 200 }
          )
        }

        // Update balance and log transaction
        await sql`UPDATE users SET balance = ${newBalance}, updated_at = NOW() WHERE id = ${userId}`

        await sql`
          INSERT INTO game_transactions (user_id, session_id, transaction_id, game_id, action, amount, balance_before, balance_after)
          VALUES (${userId}, ${session_id}, ${transactionId}, ${gameId}, ${cmd}, ${balanceChange}, ${currentBalance}, ${newBalance})
        `

        console.log(`[TBS2 Callback] writeBet: bet=${bet}, win=${win}, balance: ${currentBalance} -> ${newBalance}`)

        return NextResponse.json(
          { error: 0, balance: newBalance } satisfies TBS2CallbackResponse,
          { status: 200 }
        )
      }

      default:
        return NextResponse.json(
          { error: 1, message: `Unknown command: ${cmd}` } satisfies TBS2CallbackResponse,
          { status: 200 }
        )
    }
  } catch (error) {
    console.error("[TBS2 Callback] Error:", error)
    return NextResponse.json(
      { error: 99, message: "Internal server error" } satisfies TBS2CallbackResponse,
      { status: 200 }
    )
  }
}

// Also handle GET for health check
export async function GET() {
  return NextResponse.json({ status: "ok", service: "tbs2-callback" })
}
