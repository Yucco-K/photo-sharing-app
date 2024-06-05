// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jfnvofbefneggthfzvkx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmbnZvZmJlZm5lZ2d0aGZ6dmt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc1NDQwNzcsImV4cCI6MjAzMzEyMDA3N30.IBnBiMFZWwP5anG0yVJ4nCg_XyCmfrYs58P6tmS0qyY'
export const supabase = createClient(supabaseUrl, supabaseKey)
