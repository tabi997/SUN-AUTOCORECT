import { supabase, Car, CarImage, CarWithImages, Lead, NewsletterSubscription } from './supabase'

// Servicii pentru mașini
export const carService = {
  // Obține toate mașinile cu imagini
  async getAllCars(): Promise<CarWithImages[]> {
    const { data: cars, error: carsError } = await supabase
      .from('cars')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    
    if (carsError) throw carsError
    
    // Obține imaginile pentru fiecare mașină
    const carsWithImages = await Promise.all(
      (cars || []).map(async (car) => {
        const { data: images, error: imagesError } = await supabase
          .from('car_images')
          .select('*')
          .eq('car_id', car.id)
          .order('order_index', { ascending: true })
        
        if (imagesError) throw imagesError
        
        return {
          ...car,
          images: images || []
        }
      })
    )
    
    return carsWithImages
  },

  // Obține mașinile featured cu imagini
  async getFeaturedCars(): Promise<CarWithImages[]> {
    const { data: cars, error: carsError } = await supabase
      .from('cars')
      .select('*')
      .eq('featured', true)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(6)
    
    if (carsError) throw carsError
    
    // Obține imaginile pentru fiecare mașină
    const carsWithImages = await Promise.all(
      (cars || []).map(async (car) => {
        const { data: images, error: imagesError } = await supabase
          .from('car_images')
          .select('*')
          .eq('car_id', car.id)
          .order('order_index', { ascending: true })
        
        if (imagesError) throw imagesError
        
        return {
          ...car,
          images: images || []
        }
      })
    )
    
    return carsWithImages
  },

  // Obține o mașină după ID cu imagini
  async getCarById(id: number): Promise<CarWithImages | null> {
    const { data: car, error: carError } = await supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .single()
    
    if (carError) throw carError
    if (!car) return null
    
    const { data: images, error: imagesError } = await supabase
      .from('car_images')
      .select('*')
      .eq('car_id', id)
      .order('order_index', { ascending: true })
    
    if (imagesError) throw imagesError
    
    return {
      ...car,
      images: images || []
    }
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
  },

  // Adaugă imagini pentru o mașină
  async addCarImages(carId: number, images: Omit<CarImage, 'id' | 'car_id' | 'created_at'>[]): Promise<CarImage[]> {
    const imagesWithCarId = images.map(img => ({ ...img, car_id: carId }))
    
    const { data, error } = await supabase
      .from('car_images')
      .insert(imagesWithCarId)
      .select()
    
    if (error) throw error
    return data || []
  },

  // Șterge o imagine
  async deleteCarImage(imageId: number): Promise<void> {
    const { error } = await supabase
      .from('car_images')
      .delete()
      .eq('id', imageId)
    
    if (error) throw error
  },

  // Actualizează ordinea imaginilor
  async updateImageOrder(images: { id: number; order_index: number }[]): Promise<void> {
    const updates = images.map(img => ({
      id: img.id,
      order_index: img.order_index
    }))
    
    const { error } = await supabase
      .from('car_images')
      .upsert(updates, { onConflict: 'id' })
    
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
