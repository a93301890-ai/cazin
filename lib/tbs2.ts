import crypto from "crypto"

const TBS2_API_URL = process.env.TBS2_API_URL || "https://tbs2api.lvslot.net"
const TBS2_HALL_ID = process.env.TBS2_HALL_ID || ""
const TBS2_HALL_KEY = process.env.TBS2_HALL_KEY || ""

/**
 * Generate MD5 sign for TBS2 API requests
 * sign = md5(hall_id + hall_key + ...params)
 */
export function generateSign(...parts: string[]): string {
  const raw = parts.join("")
  return crypto.createHash("md5").update(raw).digest("hex")
}

/**
 * Verify incoming callback sign from TBS2
 * The sign is typically md5(hall_id + hall_key + other_params)
 */
export function verifyCallbackSign(sign: string, ...parts: string[]): boolean {
  const expected = generateSign(...parts)
  return expected === sign
}

/**
 * Get the list of available games from TBS2
 */
export async function getGamesList(): Promise<TBS2Game[]> {
  const sign = generateSign(TBS2_HALL_ID, TBS2_HALL_KEY)

  const params = new URLSearchParams({
    hall: TBS2_HALL_ID,
    key: TBS2_HALL_KEY,
  })

  const response = await fetch(`${TBS2_API_URL}/api/games?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  if (!response.ok) {
    // Try POST method as fallback
    const postResponse = await fetch(`${TBS2_API_URL}/api/games`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hall: TBS2_HALL_ID,
        key: TBS2_HALL_KEY,
        sign,
      }),
    })
    if (!postResponse.ok) {
      throw new Error(`TBS2 API error: ${postResponse.status}`)
    }
    return postResponse.json()
  }

  return response.json()
}

/**
 * Open/launch a game - get game URL from TBS2
 */
export async function openGame(params: {
  gameId: string
  sessionId: string
  playerId: string
  lang?: string
  demo?: boolean
}): Promise<{ url: string }> {
  const { gameId, sessionId, playerId, lang = "ru", demo = false } = params

  const sign = generateSign(TBS2_HALL_ID, TBS2_HALL_KEY, gameId, playerId)

  const body: Record<string, string | number | boolean> = {
    hall: TBS2_HALL_ID,
    key: TBS2_HALL_KEY,
    game: gameId,
    session: sessionId,
    player: playerId,
    lang,
    sign,
  }

  if (demo) {
    body.demo = 1
  }

  const response = await fetch(`${TBS2_API_URL}/api/open`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`TBS2 open game error: ${response.status} - ${text}`)
  }

  return response.json()
}

export function getHallId(): string {
  return TBS2_HALL_ID
}

export function getHallKey(): string {
  return TBS2_HALL_KEY
}

export interface TBS2Game {
  id: string
  name: string
  img?: string
  type?: string
  provider?: string
  category?: string
  [key: string]: unknown
}

export interface TBS2CallbackRequest {
  cmd: "getBalance" | "writeBet"
  hall_id: string
  session_id: string
  player_id: string
  sign: string
  // writeBet specific
  bet?: string | number
  win?: string | number
  transaction_id?: string
  game_id?: string
  round_id?: string
  finished?: string | number | boolean
  [key: string]: unknown
}

export interface TBS2CallbackResponse {
  error: number
  balance?: number
  message?: string
}
