import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { hashPassword, createSession } from "@/lib/auth"
import { z } from "zod"

export const dynamic = "force-dynamic"

const registerSchema = z.object({
  email: z.string().email("Введите корректный email"),
  username: z
    .string()
    .min(3, "Имя должно содержать минимум 3 символа")
    .max(20, "Имя должно содержать максимум 20 символов")
    .regex(/^[a-zA-Z0-9_]+$/, "Имя может содержать только буквы, цифры и _"),
  password: z
    .string()
    .min(6, "Пароль должен содержать минимум 6 символов"),
})

export async function POST(request: Request) {
  try {
    const sql = getDb()
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, username, password } = parsed.data
    const lowerEmail = email.toLowerCase()

    const existingEmail = await sql`
      SELECT id FROM users WHERE email = ${lowerEmail}
    `
    if (existingEmail.length > 0) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 409 }
      )
    }

    const existingUsername = await sql`
      SELECT id FROM users WHERE username = ${username}
    `
    if (existingUsername.length > 0) {
      return NextResponse.json(
        { error: "Это имя пользователя уже занято" },
        { status: 409 }
      )
    }

    const hashedPassword = await hashPassword(password)

    const newUser = await sql`
      INSERT INTO users (username, email, password_hash, balance)
      VALUES (${username}, ${lowerEmail}, ${hashedPassword}, 1000)
      RETURNING id, email, username, balance
    `

    await createSession(newUser[0].id)

    return NextResponse.json({
      user: {
        id: newUser[0].id,
        email: newUser[0].email,
        username: newUser[0].username,
        balance: Number(newUser[0].balance),
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера. Попробуйте ещё раз." },
      { status: 500 }
    )
  }
}
