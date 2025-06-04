
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://hfafofvfrizgluciriui.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmYWZvZnZmcml6Z2x1Y2lyaXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwMjE5NzEsImV4cCI6MjA2NDU5Nzk3MX0.5KHIBXV__p4bkq9gBuYjHxetyL1S99_F8SyX4ZR8yzU"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
