import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ContactInfo, contactService } from './services'
import { useToast } from '@/hooks/use-toast'

interface ContactContextType {
  contactInfo: ContactInfo | null
  loading: boolean
  updateContactInfo: (updates: Partial<Omit<ContactInfo, 'id' | 'created_at' | 'updated_at'>>) => Promise<void>
  refreshContactInfo: () => Promise<void>
}

const ContactContext = createContext<ContactContextType | undefined>(undefined)

export const useContact = () => {
  const context = useContext(ContactContext)
  if (context === undefined) {
    throw new Error('useContact must be used within a ContactProvider')
  }
  return context
}

interface ContactProviderProps {
  children: ReactNode
}

export const ContactProvider: React.FC<ContactProviderProps> = ({ children }) => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchContactInfo = async () => {
    try {
      setLoading(true)
      const data = await contactService.getContactInfo()
      setContactInfo(data)
    } catch (error) {
      console.error('Error fetching contact info:', error)
      toast({
        title: "Eroare la încărcarea informațiilor de contact",
        description: "Nu s-au putut încărca informațiile de contact",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const updateContactInfo = async (updates: Partial<Omit<ContactInfo, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const updatedInfo = await contactService.updateContactInfo(updates)
      setContactInfo(updatedInfo)
      toast({
        title: "Informații actualizate cu succes!",
        description: "Informațiile de contact au fost actualizate",
      })
    } catch (error) {
      console.error('Error updating contact info:', error)
      toast({
        title: "Eroare la actualizare",
        description: "Nu s-au putut actualiza informațiile de contact",
        variant: "destructive"
      })
      throw error
    }
  }

  const refreshContactInfo = async () => {
    await fetchContactInfo()
  }

  useEffect(() => {
    fetchContactInfo()
  }, [])

  const value: ContactContextType = {
    contactInfo,
    loading,
    updateContactInfo,
    refreshContactInfo
  }

  return (
    <ContactContext.Provider value={value}>
      {children}
    </ContactContext.Provider>
  )
}
