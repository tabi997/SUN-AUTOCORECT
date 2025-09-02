import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Car, 
  Users, 
  Mail, 
  LogOut, 
  Plus, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Phone
} from 'lucide-react'
import CarManagement from '@/components/admin/CarManagement'
import LeadManagement from '@/components/admin/LeadManagement'
import NewsletterManagement from '@/components/admin/NewsletterManagement'
import ContactManagement from '@/components/admin/ContactManagement'
import DashboardStats from '@/components/admin/DashboardStats'
import AdminErrorBoundary from '@/components/admin/AdminErrorBoundary'

const Admin = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('dashboard')

  // Handle URL tab parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabParam = urlParams.get('tab')
    console.log('URL changed, tab param:', tabParam)
    
    if (tabParam && ['dashboard', 'cars', 'leads', 'newsletter', 'contact'].includes(tabParam)) {
      console.log('Setting active tab to:', tabParam)
      setActiveTab(tabParam)
    }
  }, [location.search])

  // Listen for custom tab change events from quick action buttons
  useEffect(() => {
    const handleTabChange = (event: CustomEvent) => {
      const newTab = event.detail
      console.log('Received tab change event:', newTab)
      if (['dashboard', 'cars', 'leads', 'newsletter', 'contact'].includes(newTab)) {
        setActiveTab(newTab)
        console.log('Active tab set to:', newTab)
      }
    }

    window.addEventListener('tabChange', handleTabChange as EventListener)
    
    return () => {
      window.removeEventListener('tabChange', handleTabChange as EventListener)
    }
  }, [])

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    console.log('Tab changed to:', value)
    setActiveTab(value)
    navigate(`/admin?tab=${value}`)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Eroare la deconectare:', error)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acces Restricționat</h1>
          <p className="text-muted-foreground mb-6">Trebuie să te autentifici pentru a accesa panoul de administrare.</p>
          <Button onClick={() => navigate('/login')} variant="solar">
            Mergi la Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <AdminErrorBoundary>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-solar rounded-full flex items-center justify-center">
                  <Car className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold">SUN AUTOCORECT</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground">Admin Dashboard</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs sm:text-sm font-medium">{user.email}</p>
                  <Badge variant="secondary" className="text-xs">Administrator</Badge>
                </div>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="text-xs sm:text-sm">
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Deconectare</span>
                  <span className="sm:hidden">Exit</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="w-full max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 overflow-x-hidden">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-5 h-auto">
              <TabsTrigger value="dashboard" className="flex flex-col items-center space-y-1 text-xs py-3">
                <TrendingUp className="h-4 w-4" />
                <span>Stats</span>
              </TabsTrigger>
              <TabsTrigger value="cars" className="flex flex-col items-center space-y-1 text-xs py-3">
                <Car className="h-4 w-4" />
                <span>Mașini</span>
              </TabsTrigger>
              <TabsTrigger value="leads" className="flex flex-col items-center space-y-1 text-xs py-3">
                <Users className="h-4 w-4" />
                <span>Lead-uri</span>
              </TabsTrigger>
              <TabsTrigger value="newsletter" className="flex flex-col items-center space-y-1 text-xs py-3">
                <Mail className="h-4 w-4" />
                <span>Mail</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex flex-col items-center space-y-1 text-xs py-3">
                <Phone className="h-4 w-4" />
                <span>Contact</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-4 sm:space-y-6">
              <AdminErrorBoundary>
                <DashboardStats />
              </AdminErrorBoundary>
            </TabsContent>

            <TabsContent value="cars" className="space-y-4 sm:space-y-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold">Gestionare Mașini</h2>
                  <p className="text-sm text-muted-foreground">
                    Adaugă, editează și șterge anunțurile de mașini
                  </p>
                </div>
              </div>
              <AdminErrorBoundary>
                <CarManagement />
              </AdminErrorBoundary>
            </TabsContent>

            <TabsContent value="leads" className="space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-xl font-bold">Gestionare Lead-uri</h2>
                <p className="text-sm text-muted-foreground">
                  Gestionează lead-urile primite din formulare
                </p>
              </div>
              <AdminErrorBoundary>
                <LeadManagement />
              </AdminErrorBoundary>
            </TabsContent>

            <TabsContent value="newsletter" className="space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-xl font-bold">Gestionare Newsletter</h2>
                <p className="text-sm text-muted-foreground">
                  Gestionează abonamentele la newsletter
                </p>
              </div>
              <AdminErrorBoundary>
                <NewsletterManagement />
              </AdminErrorBoundary>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-xl font-bold">Gestionare Informații Contact</h2>
                <p className="text-sm text-muted-foreground">
                  Editează informațiile de contact afișate în footer, pagina de contact și alte locuri
                </p>
              </div>
              <AdminErrorBoundary>
                <ContactManagement />
              </AdminErrorBoundary>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AdminErrorBoundary>
  )
}

export default Admin
