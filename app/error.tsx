"use client"

import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">Something Went Wrong</h1>
        <p className="text-muted-foreground text-lg mb-2">{error.message || "An unexpected error occurred"}</p>
        {error.digest && <p className="text-muted-foreground text-sm mb-8">Error ID: {error.digest}</p>}
        <div className="flex gap-4 justify-center">
          <Button onClick={() => reset()}>Try Again</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}
