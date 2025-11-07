let mockClient: any = null

export function createClient() {
  if (mockClient) return mockClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://demo.supabase.co"
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "demo-key"

  // Mock Supabase client for v0 environment
  mockClient = {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signUp: async (credentials: any) => ({ data: null, error: { message: "Auth not configured" } }),
      signInWithPassword: async (credentials: any) => ({ data: null, error: { message: "Auth not configured" } }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: (callback: any) => {
        return { data: { subscription: { unsubscribe: () => {} } } }
      },
    },
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          single: async () => ({ data: null, error: null }),
          maybeSingle: async () => ({ data: null, error: null }),
        }),
        order: (column: string, options?: any) => ({
          limit: (count: number) => ({
            then: async (resolve: any) => resolve({ data: [], error: null }),
          }),
        }),
        then: async (resolve: any) => resolve({ data: [], error: null }),
      }),
      insert: (data: any) => ({
        then: async (resolve: any) => resolve({ data: null, error: null }),
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          then: async (resolve: any) => resolve({ data: null, error: null }),
        }),
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          then: async (resolve: any) => resolve({ data: null, error: null }),
        }),
      }),
    }),
  }

  console.log("[v0] Using mock Supabase client")
  return mockClient
}
