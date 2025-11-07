"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()

      console.log("[v0] Starting signup process for:", email)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      console.log("[v0] Signup response:", { data, error })

      if (error) {
        console.error("[v0] Signup error:", error)
        setError(error.message)
        return
      }

      if (data.user && data.session) {
        console.log("[v0] User signed up and logged in immediately")
        router.push("/")
        router.refresh()
      } else {
        // Email confirmation still enabled, redirect to success page
        console.log("[v0] Email confirmation required")
        router.push("/auth/sign-up-success")
      }
    } catch (err) {
      console.error("[v0] Signup exception:", err)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8">
          <h1 className="text-2xl font-bold text-foreground mb-6 text-center">Create Account</h1>

          {success ? (
            <div className="p-4 bg-green-500/10 border border-green-500 rounded text-green-500 text-center">
              Account created! Check your email to confirm. Redirecting to login...
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive rounded text-destructive text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          )}

          <p className="text-center text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
