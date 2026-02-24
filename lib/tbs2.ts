const API = process.env.TBS2_API_URL
const HALL_ID = process.env.TBS2_HALL_ID
const HALL_KEY = process.env.TBS2_HALL_KEY
const DOMAIN = process.env.TBS2_DOMAIN
const EXIT_URL = process.env.TBS2_EXIT_URL

if (!API || !HALL_ID || !HALL_KEY) {
  throw new Error("TBS2 integration not configured")
}

// Открытие игры
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
