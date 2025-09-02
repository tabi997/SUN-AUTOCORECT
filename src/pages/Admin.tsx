import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useNavigate } from 'react-router-dom'
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
  DollarSign
} from 'lucide-react'
import CarManagement from '@/components/admin/CarManagement'
import LeadManagement from '@/components/admin/LeadManagement'
import NewsletterManagement from '@/components/admin/NewsletterManagement'
import DashboardStats from '@/components/admin/DashboardStats'

const Admin = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')

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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto">
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
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4 sm:space-y-6">
            <DashboardStats />
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
            <CarManagement />
          </TabsContent>

          <TabsContent value="leads" className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl font-bold">Gestionare Lead-uri</h2>
              <p className="text-sm text-muted-foreground">
                Gestionează lead-urile primite din formulare
              </p>
            </div>
            <LeadManagement />
          </TabsContent>

          <TabsContent value="newsletter" className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl font-bold">Gestionare Newsletter</h2>
              <p className="text-sm text-muted-foreground">
                Gestionează abonamentele la newsletter
              </p>
            </div>
            <NewsletterManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default Admin
