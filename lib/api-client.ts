const API_BASE = "/api"

export async function fetchTrendingMovies(timeWindow: "day" | "week" = "day") {
  const res = await fetch(`${API_BASE}/trending?time=${timeWindow}`)
  if (!res.ok) throw new Error("Failed to fetch trending")
  return res.json()
}

export async function fetchRecommendations() {
  const res = await fetch(`${API_BASE}/recommendations`)
  if (!res.ok) throw new Error("Failed to fetch recommendations")
  return res.json()
}

export async function rateMovie(movieId: number, rating: number, review?: string) {
  const res = await fetch(`${API_BASE}/movies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "rate",
      movieId,
      rating,
      review,
    }),
  })
  if (!res.ok) throw new Error("Failed to rate movie")
  return res.json()
}

export async function getWatchlist() {
  const res = await fetch(`${API_BASE}/movies?action=watchlist`)
  if (!res.ok) throw new Error("Failed to fetch watchlist")
  return res.json()
}

export async function signUp(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, action: "signup" }),
  })
  if (!res.ok) throw new Error("Failed to sign up")
  return res.json()
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, action: "login" }),
  })
  if (!res.ok) throw new Error("Failed to login")
  return res.json()
}
