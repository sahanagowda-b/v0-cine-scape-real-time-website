"use client"

import { io, type Socket } from "socket.io-client"

let socket: Socket | null = null

export function initSocket(): Socket {
  if (socket) return socket

  // For development, connect to localhost; for production, use current domain
  const socketUrl = process.env.NODE_ENV === "development" ? "http://localhost:3001" : window.location.origin

  socket = io(socketUrl, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  })

  socket.on("connect", () => {
    console.log("[v0] Socket connected:", socket?.id)
  })

  socket.on("disconnect", () => {
    console.log("[v0] Socket disconnected")
  })

  socket.on("error", (error) => {
    console.error("[v0] Socket error:", error)
  })

  return socket
}

export function getSocket(): Socket | null {
  return socket
}

export function closeSocket() {
  if (socket) {
    socket.close()
    socket = null
  }
}
