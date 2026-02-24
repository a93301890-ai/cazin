import { getDb } from "@/lib/db"
import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "royal-fortune-casino-secret-key-change-in-production"
)

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSession(userId: string): Promise<string> {
  const sql = getDb()

  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET)

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  await sql`
    INSERT INTO sessions (user_id, token, expires_at)
    VALUES (${userId}, ${token}, ${expiresAt.toISOString()})
  `

  const cookieStore = await cookies()
  cookieStore.set("session-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  })

  return token
}

export async function getCurrentUser() {
  try {
    const sql = getDb()
    const cookieStore = await cookies()
    const token = cookieStore.get("session-token")?.value

    if (!token) return null

    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userId = payload.userId as string

    const sessions = await sql`
      SELECT s.id as session_id, s.expires_at,
             u.id, u.email, u.username, u.balance
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.token = ${token} AND s.user_id = ${userId}
    `

    if (sessions.length === 0) return null

    const session = sessions[0]

    if (new Date(session.expires_at) < new Date()) {
      await sql`DELETE FROM sessions WHERE id = ${session.session_id}`
      return null
    }

    return {
      id: session.id,
      email: session.email,
      username: session.username,
      balance: Number(session.balance),
    }
  } catch {
    return null
  }
}

export async function destroySession() {
  const sql = getDb()
  const cookieStore = await cookies()
  const token = cookieStore.get("session-token")?.value

  if (token) {
    try {
      await sql`DELETE FROM sessions WHERE token = ${token}`
    } catch {}
    cookieStore.delete("session-token")
  }
}
