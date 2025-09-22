import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cyibvhdhzirhulgdqtk.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5aWJ2aGhkaHppcmh1bGdkcXRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MzA5MTMsImV4cCI6MjA3MTMwNjkxM30.5wbHG-9bsqWPOX12xqJt4t0AvezAi2Ccd2_CJHvbWDk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations that require elevated permissions
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5aWJ2aGhkaHppcmh1bGdkcXRrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTczMDkxMywiZXhwIjoyMDcxMzA2OTEzfQ.hofIDJR8-viqRQQgOp0s9uqXCsmCszik3aNJ_rK04tA',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)