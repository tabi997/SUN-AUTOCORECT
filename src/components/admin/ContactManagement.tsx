import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { ContactInfo, contactService } from '@/lib/services'
import { Phone, Mail, MapPin, Clock, Save, RefreshCw, CheckCircle } from 'lucide-react'

const ContactManagement = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    address: '',
    working_hours: ''
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchContactInfo()
  }, [])

  const fetchContactInfo = async () => {
    try {
      setLoading(true)
      const data = await contactService.getContactInfo()
      if (data) {
        setContactInfo(data)
        setFormData({
          phone: data.phone,
          email: data.email,
          address: data.address,
          working_hours: data.working_hours
        })
      }
    } catch (error) {
      console.error('Error fetching contact info:', error)
      toast({
        title: "Eroare la încărcare",
        description: "Nu s-au putut încărca informațiile de contact",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.phone.trim()) {
      toast({
        title: "Eroare de validare",
        description: "Numărul de telefon este obligatoriu",
        variant: "destructive"
      })
      return false
    }
    
    if (!formData.email.trim()) {
      toast({
        title: "Eroare de validare",
        description: "Email-ul este obligatoriu",
        variant: "destructive"
      })
      return false
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Eroare de validare",
        description: "Email-ul nu este valid",
        variant: "destructive"
      })
      return false
    }
    
    if (!formData.address.trim()) {
      toast({
        title: "Eroare de validare",
        description: "Adresa este obligatorie",
        variant: "destructive"
      })
      return false
    }
    
    if (!formData.working_hours.trim()) {
      toast({
        title: "Eroare de validare",
        description: "Programul de lucru este obligatoriu",
        variant: "destructive"
      })
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setSaving(true)
    
    try {
      await contactService.updateContactInfo(formData)
      await fetchContactInfo() // Refresh data
      toast({
        title: "Salvare reușită!",
        description: "Informațiile de contact au fost actualizate cu succes",
      })
    } catch (error) {
      console.error('Error saving contact info:', error)
      toast({
        title: "Eroare la salvare",
        description: "Nu s-au putut salva informațiile de contact",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (contactInfo) {
      setFormData({
        phone: contactInfo.phone,
        email: contactInfo.email,
        address: contactInfo.address,
        working_hours: contactInfo.working_hours
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Se încarcă informațiile de contact...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Contact Info Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Informații de contact actuale
          </CardTitle>
          <CardDescription>
            Informațiile afișate în footer, pagina de contact și alte locuri din aplicație
          </CardDescription>
        </CardHeader>
        <CardContent>
          {contactInfo && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Telefon</p>
                  <p className="font-semibold">{contactInfo.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="font-semibold break-all">{contactInfo.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg md:col-span-2">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Adresa</p>
                  <p className="font-semibold">{contactInfo.address}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg md:col-span-2">
                <Clock className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Program de lucru</p>
                  <p className="font-semibold whitespace-pre-line">{contactInfo.working_hours}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="h-5 w-5 text-primary" />
            Editează informațiile de contact
          </CardTitle>
          <CardDescription>
            Modifică informațiile de contact care vor fi afișate în toată aplicația
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Număr de telefon *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+40 721 234 567"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="h-10"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="office@sunautocorect.ro"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Adresa completă *
              </Label>
              <Textarea
                id="address"
                name="address"
                placeholder="Strada Exemplului, Nr. 123, Sector 1, București, România"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="resize-none"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="working_hours" className="text-sm font-medium">
                Program de lucru *
              </Label>
              <Textarea
                id="working_hours"
                name="working_hours"
                placeholder="Luni - Vineri: 9:00 - 18:00&#10;Sâmbătă: 9:00 - 14:00&#10;Duminică: Închis"
                value={formData.working_hours}
                onChange={handleInputChange}
                rows={4}
                className="resize-none font-mono"
                required
              />
              <p className="text-xs text-muted-foreground">
                Folosește Enter pentru a crea linii noi. Exemplu: Luni - Vineri: 9:00 - 18:00
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                disabled={saving}
                className="flex-1 sm:flex-none"
                size="lg"
              >
                {saving ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Se salvează...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Salvează modificările
                  </div>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={saving}
                className="flex-1 sm:flex-none"
                size="lg"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Resetează
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Last Updated Info */}
      {contactInfo && (
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground">
              <p>Ultima actualizare: {new Date(contactInfo.updated_at).toLocaleString('ro-RO')}</p>
              <p className="mt-1">ID înregistrare: {contactInfo.id}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ContactManagement
