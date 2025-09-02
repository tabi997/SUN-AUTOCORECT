import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Car, Users, Mail, TrendingUp, Eye, DollarSign } from 'lucide-react'
import { carService, leadService, newsletterService } from '@/lib/services'
import { Car as CarType, Lead, NewsletterSubscription } from '@/lib/supabase'

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    featuredCars: 0,
    totalLeads: 0,
    newLeads: 0,
    totalSubscriptions: 0,
    activeSubscriptions: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [cars, leads, subscriptions] = await Promise.all([
          carService.getAllCars(),
          leadService.getAllLeads(),
          newsletterService.getAllSubscriptions()
        ])

        const featuredCars = cars.filter(car => car.featured).length
        const newLeads = leads.filter(lead => lead.status === 'new').length
        const activeSubscriptions = subscriptions.filter(sub => sub.active).length

        setStats({
          totalCars: cars.length,
          featuredCars,
          totalLeads: leads.length,
          newLeads,
          totalSubscriptions: subscriptions.length,
          activeSubscriptions
        })
      } catch (error) {
        console.error('Eroare la încărcarea statisticilor:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-6 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">
          Prezentare generală a activității SUN AUTOCORECT
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Mașini */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mașini</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCars}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="secondary" className="mr-2">
                {stats.featuredCars} Featured
              </Badge>
              în stoc
            </p>
          </CardContent>
        </Card>

        {/* Total Lead-uri */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lead-uri</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="destructive" className="mr-2">
                {stats.newLeads} Noi
              </Badge>
              în așteptare
            </p>
          </CardContent>
        </Card>

        {/* Newsletter */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Newsletter</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="outline" className="mr-2">
                {stats.activeSubscriptions} Active
              </Badge>
              abonamente
            </p>
          </CardContent>
        </Card>

        {/* Performanță */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performanță</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalCars > 0 ? Math.round((stats.featuredCars / stats.totalCars) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Mașini featured din total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acțiuni Rapide</CardTitle>
          <CardDescription>
            Accesează rapid funcțiile principale
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer">
              <Car className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Adaugă Mașină</p>
                <p className="text-sm text-muted-foreground">Publică un anunț nou</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Vezi Lead-uri</p>
                <p className="text-sm text-muted-foreground">Gestionează contactele</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Newsletter</p>
                <p className="text-sm text-muted-foreground">Gestionare abonamente</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardStats
