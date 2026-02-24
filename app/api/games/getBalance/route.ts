import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { login } = body;

  // Здесь ты должен получить баланс из своей БД
  // Пока делаем тестовый ответ:
  return NextResponse.json({
    status: "success",
    error: "",
    login,
    balance: "1000.00",
    currency: "USD"
  });
}
