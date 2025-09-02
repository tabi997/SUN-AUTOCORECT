import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://chcxobmpobnesefbsbev.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY3hvYm1wb2JuZXNlZmJzYmV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTExODYsImV4cCI6MjA3MjMyNzE4Nn0.10GVuchHXc56TJJi8-66mfhG6Bz4DutBcgUMc1U6dTM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'sun-autocorrect-web'
    }
  }
})

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
  status: 'active' | 'sold' | 'reserved' | 'inactive'
  created_at: string
  updated_at: string
}

export interface CarImage {
  id: number
  car_id: number
  image_url: string
  image_name?: string
  is_primary: boolean
  order_index: number
  created_at: string
}

export interface CarWithImages extends Car {
  images: CarImage[]
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

export interface ContactInfo {
  id: number
  phone: string
  email: string
  address: string
  working_hours: string
  created_at: string
  updated_at: string
}
