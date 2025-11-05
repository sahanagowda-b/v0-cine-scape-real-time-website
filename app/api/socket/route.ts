import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

const clients: Set<Response> = new Set()

export async function GET(request: NextRequest) {
  // For SSE (Server-Sent Events) fallback if Socket.io is not available
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue(encoder.encode('data: {"type":"connected"}\n\n'))

      // Keep connection alive with heartbeat
      const interval = setInterval(() => {
        controller.enqueue(encoder.encode(": heartbeat\n\n"))
      }, 30000)

      const onClose = () => {
        clearInterval(interval)
        controller.close()
      }

      request.signal.addEventListener("abort", onClose)
    },
  })

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
