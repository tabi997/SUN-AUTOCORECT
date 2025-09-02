import { supabase, Car, Lead, NewsletterSubscription } from './supabase'

// Servicii pentru mașini
export const carService = {
  // Obține toate mașinile
  async getAllCars(): Promise<Car[]> {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Obține mașinile featured
  async getFeaturedCars(): Promise<Car[]> {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(6)
    
    if (error) throw error
    return data || []
  },

  // Obține o mașină după ID
  async getCarById(id: number): Promise<Car | null> {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Creează o mașină nouă
  async createCar(car: Omit<Car, 'id' | 'created_at' | 'updated_at'>): Promise<Car> {
    const { data, error } = await supabase
      .from('cars')
      .insert([car])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Actualizează o mașină
  async updateCar(id: number, updates: Partial<Car>): Promise<Car> {
    const { data, error } = await supabase
      .from('cars')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Șterge o mașină
  async deleteCar(id: number): Promise<void> {
    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Servicii pentru lead-uri
export const leadService = {
  // Obține toate lead-urile
  async getAllLeads(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Creează un lead nou
  async createLead(lead: Omit<Lead, 'id' | 'created_at'>): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .insert([lead])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Actualizează statusul unui lead
  async updateLeadStatus(id: number, status: Lead['status']): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Șterge un lead
  async deleteLead(id: number): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Servicii pentru newsletter
export const newsletterService = {
  // Obține toate abonamentele
  async getAllSubscriptions(): Promise<NewsletterSubscription[]> {
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Creează o abonare nouă
  async createSubscription(email: string): Promise<NewsletterSubscription> {
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .insert([{ email, active: true }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Dezactivează o abonare
  async deactivateSubscription(id: number): Promise<void> {
    const { error } = await supabase
      .from('newsletter_subscriptions')
      .update({ active: false })
      .eq('id', id)
    
    if (error) throw error
  }
}
