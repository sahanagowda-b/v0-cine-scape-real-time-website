"use client"

import { createBrowserClient } from "@supabase/ssr"

let instance: any = null

export function createClientSupabaseClient() {
  if (instance) return instance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  try {
    instance = createBrowserClient(supabaseUrl, supabaseAnonKey)
    return instance
  } catch (error) {
    console.error("[v0] Failed to create Supabase client:", error)
    return null
  }
}
