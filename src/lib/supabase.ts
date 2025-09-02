import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://chcxobmpobnesefbsbev.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY3hvYm1wb2JuZXNlZmJzYmV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTExODYsImV4cCI6MjA3MjMyNzE4Nn0.10GVuchHXc56TJJi8-66mfhG6Bz4DutBcgUMc1U6dTM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipuri pentru baza de date
export interface Car {
  id: number
  brand: string
  model: string
  year: number
  kilometers: number
  fuel: string
  power: number
  transmission: string
  price: number
  monthly_rate?: number
  featured: boolean
  image_url: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Lead {
  id: number
  name: string
  email: string
  phone?: string
  message: string
  source: 'contact' | 'newsletter' | 'car_inquiry'
  car_id?: number
  created_at: string
  status: 'new' | 'contacted' | 'converted' | 'lost'
}

export interface NewsletterSubscription {
  id: number
  email: string
  created_at: string
  active: boolean
}
