"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
  const [rateLimitCountdown, setRateLimitCountdown] = useState(0)
  const router = useRouter()

  useEffect(() => {
    if (rateLimitCountdown <= 0) return
    const timer = setInterval(() => {
      setRateLimitCountdown((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [rateLimitCountdown])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (rateLimitCountdown > 0) {
      return
    }

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
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
        },
      })

      console.log("[v0] Signup response:", { data, error })

      if (error) {
        console.error("[v0] Signup error:", error)

        if (error.message.includes("rate limit") || error.status === 429) {
          setRateLimitCountdown(60)
          setError(
            "Supabase rate limit reached. This protects against abuse. Please either: (1) Wait 60 seconds and try with a DIFFERENT email address, or (2) Login if you already have an account.",
          )
        } else if (error.message.includes("already registered")) {
          setError("This email is already registered. Please login instead using the button below.")
        } else {
          setError(error.message)
        }
        setIsLoading(false)
        return
      }

      if (data.user) {
        console.log("[v0] User created successfully:", data.user.id)

        try {
          const ensureUserResponse = await fetch("/api/users/ensure", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: data.user.id, email: data.user.email }),
          })

          if (ensureUserResponse.ok) {
            console.log("[v0] User record created in public.users table")
          } else {
            console.error("[v0] Failed to create user record")
          }
        } catch (userRecordError) {
          console.error("[v0] Exception creating user record:", userRecordError)
        }

        if (data.session) {
          console.log("[v0] User logged in immediately, redirecting to home")
          setSuccess(true)
          setTimeout(() => {
            window.location.href = "/"
          }, 1500)
        } else {
          // Email confirmation required
          console.log("[v0] Email confirmation required")
          setSuccess(true)
          setTimeout(() => {
            router.push("/auth/sign-up-success")
          }, 2000)
        }
      } else {
        setError("Signup failed. Please try again.")
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
              <p className="font-medium">Account created successfully!</p>
              <p className="text-sm mt-2">Redirecting...</p>
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
                  disabled={isLoading || rateLimitCountdown > 0}
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
                  disabled={isLoading || rateLimitCountdown > 0}
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground mt-1">At least 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading || rateLimitCountdown > 0}
                />
              </div>

              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive rounded text-destructive text-sm space-y-3">
                  <p>{error}</p>
                  {(error.includes("rate limit") || error.includes("already registered")) && (
                    <Link href="/auth/login">
                      <Button type="button" variant="outline" className="w-full bg-transparent">
                        Go to Login Page
                      </Button>
                    </Link>
                  )}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading || rateLimitCountdown > 0}>
                {isLoading
                  ? "Creating account..."
                  : rateLimitCountdown > 0
                    ? `Try again in ${rateLimitCountdown}s`
                    : "Sign Up"}
              </Button>
            </form>
          )}

          <p className="text-center text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Sign in here
            </Link>
          </p>

          <div className="mt-4 p-3 bg-muted/50 rounded text-xs text-muted-foreground">
            <p className="font-medium mb-1">Tip:</p>
            <p>
              If you're testing, use different email addresses for each signup attempt. Supabase limits signup requests
              to prevent abuse.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
