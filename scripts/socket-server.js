/**
 * Real-time Socket.io server for CineScape
 * Run with: node scripts/socket-server.js
 *
 * This server polls TMDB for trending movies and emits updates to connected clients
 */

const io = require("socket.io")
const axios = require("axios")
const http = require("http")

const PORT = process.env.SOCKET_PORT || 3001
const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

// Create HTTP server for Socket.io
const server = http.createServer()
const socket = io(server, {
  cors: {
    origin: ["http://localhost:3000", process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ""],
    methods: ["GET", "POST"],
  },
})

let lastTrendingMovies = []
let clients = 0

async function getTrendingMovies() {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/day?api_key=${TMDB_API_KEY}`)
    return response.data.results || []
  } catch (error) {
    console.error("[Socket] Error fetching trending:", error.message)
    return []
  }
}

function compareMovies(oldList, newList) {
  // Find movies that are new or have moved up significantly
  const oldIds = new Set(oldList.map((m) => m.id))
  return newList.filter((m) => !oldIds.has(m.id)).slice(0, 3)
}

socket.on("connection", (client) => {
  clients++
  console.log(`[Socket] Client connected: ${client.id} (total: ${clients})`)

  // Send current trending on connection
  client.emit("trending-update", {
    movies: lastTrendingMovies.slice(0, 5),
    timestamp: new Date().toISOString(),
  })

  client.on("disconnect", () => {
    clients--
    console.log(`[Socket] Client disconnected: ${client.id} (total: ${clients})`)
  })
})

// Poll for trending movies every 5 minutes
async function startPolling() {
  console.log("[Socket] Starting trending movies polling...")

  setInterval(
    async () => {
      const currentTrending = await getTrendingMovies()

      if (currentTrending.length === 0) {
        console.log("[Socket] No trending data received")
        return
      }

      // Check for new movies
      const newMovies = compareMovies(lastTrendingMovies, currentTrending)

      if (newMovies.length > 0) {
        console.log(`[Socket] Broadcasting ${newMovies.length} new trending movies to ${clients} clients`)
        socket.emit("trending-update", {
          movies: newMovies,
          timestamp: new Date().toISOString(),
        })
      }

      lastTrendingMovies = currentTrending
    },
    5 * 60 * 1000,
  ) // Poll every 5 minutes
}

server.listen(PORT, () => {
  console.log(`[Socket] Real-time server running on port ${PORT}`)
  startPolling()
})

process.on("SIGINT", () => {
  console.log("[Socket] Shutting down...")
  server.close()
  process.exit(0)
})
