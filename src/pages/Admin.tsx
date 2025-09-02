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
    navigate('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-solar rounded-full flex items-center justify-center">
                <Car className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">SUN AUTOCORECT</h1>
                <p className="text-sm text-muted-foreground">Admin Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user.email}</p>
                <Badge variant="secondary">Administrator</Badge>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Deconectare
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="cars" className="flex items-center space-x-2">
              <Car className="h-4 w-4" />
              <span>Mașini</span>
            </TabsTrigger>
            <TabsTrigger value="leads" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Lead-uri</span>
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Newsletter</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardStats />
          </TabsContent>

          <TabsContent value="cars" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Gestionare Mașini</h2>
                <p className="text-muted-foreground">
                  Adaugă, editează și șterge anunțurile de mașini
                </p>
              </div>
              <Button variant="solar" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Adaugă Mașină</span>
              </Button>
            </div>
            <CarManagement />
          </TabsContent>

          <TabsContent value="leads" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Gestionare Lead-uri</h2>
              <p className="text-muted-foreground">
                Gestionează lead-urile primite din formulare
              </p>
            </div>
            <LeadManagement />
          </TabsContent>

          <TabsContent value="newsletter" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Gestionare Newsletter</h2>
              <p className="text-muted-foreground">
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
