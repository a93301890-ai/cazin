// lib/tbs2.ts

// Основные переменные окружения
const API = process.env.TBS2_API_URL || ""
const HALL_ID = process.env.TBS2_HALL_ID || ""
const HALL_KEY = process.env.TBS2_HALL_KEY || ""
const DOMAIN = process.env.TBS2_DOMAIN || ""
const EXIT_URL = process.env.TBS2_EXIT_URL || ""

// Если конфигурация не полная — просто предупреждаем
if (!API || !HALL_ID || !HALL_KEY) {
  console.warn("⚠️ TBS2 integration not fully configured")
}

// ---------------------------------------------------------
// 🔥 Заглушки — чтобы сборка НЕ падала
// ---------------------------------------------------------

export function getHallId() {
  return HALL_ID
}

export function getHallKey() {
  return HALL_KEY
}

export type TBS2CallbackRequest = any
export type TBS2CallbackResponse = any

// ---------------------------------------------------------
// 🔥 Реальная функция открытия игры
// ---------------------------------------------------------

export async function openTbs2Game(gameId: string, login: string, demo: boolean) {
  const url =
    `${API}/OpenGame/?hall=${HALL_ID}` +
    `&key=${HALL_KEY}` +
    `&gameid=${gameId}` +
    `&login=${login}` +
    `&domain=${DOMAIN}` +
    `&exitUrl=${EXIT_URL}` +
    `&demo=${demo ? 1 : 0}`

  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to open game")

  return res.json()
}
