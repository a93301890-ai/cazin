import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { verifyPassword, createSession } from "@/lib/auth"
import { z } from "zod"

export const dynamic = "force-dynamic"

const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(1, "Введите пароль"),
})

export async function POST(request: Request) {
  try {
    const sql = getDb()
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, password } = parsed.data
    const lowerEmail = email.toLowerCase()

    const users = await sql`
      SELECT id, email, username, password_hash, balance
      FROM users WHERE email = ${lowerEmail}
    `

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      )
    }

    const user = users[0]
    const isValid = await verifyPassword(password, user.password_hash)

    if (!isValid) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      )
    }

    await createSession(user.id)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        balance: Number(user.balance),
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера. Попробуйте ещё раз." },
      { status: 500 }
    )
  }
}
