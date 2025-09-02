import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Mail, 
  Calendar, 
  Users, 
  CheckCircle, 
  XCircle, 
  Trash2,
  Loader2,
  Search,
  Download
} from 'lucide-react'
import { newsletterService } from '@/lib/services'
import { NewsletterSubscription } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

const NewsletterManagement = () => {
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      const data = await newsletterService.getAllSubscriptions()
      setSubscriptions(data)
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca abonamentele",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeactivate = async (id: number) => {
    try {
      await newsletterService.deactivateSubscription(id)
      toast({
        title: "Succes",
        description: "Abonamentul a fost dezactivat"
      })
      fetchSubscriptions()
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut dezactiva abonamentul",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Ești sigur că vrei să ștergi acest abonament?')) {
      try {
        // Notă: newsletterService nu are metoda delete, dar poți adăuga una
        toast({
          title: "Eroare",
          description: "Funcționalitatea de ștergere nu este implementată",
          variant: "destructive"
        })
      } catch (error) {
        toast({
          title: "Eroare",
          description: "Nu s-a putut șterge abonamentul",
          variant: "destructive"
        })
      }
    }
  }

  const exportToCSV = () => {
    const activeSubscriptions = subscriptions.filter(sub => sub.active)
    const csvContent = [
      ['Email', 'Data Abonării', 'Status'],
      ...activeSubscriptions.map(sub => [
        sub.email,
        new Date(sub.created_at).toLocaleDateString('ro-RO'),
        sub.active ? 'Activ' : 'Inactiv'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `newsletter_subscriptions_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activeSubscriptions = subscriptions.filter(sub => sub.active)
  const inactiveSubscriptions = subscriptions.filter(sub => !sub.active)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Abonamente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptions.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Abonamente Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {activeSubscriptions.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Abonamente Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">
              {inactiveSubscriptions.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Gestionare Newsletter</span>
            </CardTitle>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={exportToCSV}
                disabled={activeSubscriptions.length === 0}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Caută după email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista Abonamente ({filteredSubscriptions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSubscriptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nu există abonamente {searchTerm ? `care să conțină "${searchTerm}"` : ''}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Abonării</TableHead>
                  <TableHead>Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{subscription.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={subscription.active ? "default" : "secondary"}
                        className="flex items-center space-x-1"
                      >
                        {subscription.active ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            <span>Activ</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            <span>Inactiv</span>
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(subscription.created_at).toLocaleDateString('ro-RO')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {subscription.active && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeactivate(subscription.id)}
                          >
                            Dezactivează
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(subscription.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Sumar Newsletter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Abonamente Active</h4>
              <div className="space-y-2">
                {activeSubscriptions.slice(0, 5).map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between text-sm">
                    <span className="truncate">{sub.email}</span>
                    <Badge variant="outline" className="text-xs">
                      {new Date(sub.created_at).toLocaleDateString('ro-RO')}
                    </Badge>
                  </div>
                ))}
                {activeSubscriptions.length > 5 && (
                  <p className="text-sm text-muted-foreground">
                    ... și încă {activeSubscriptions.length - 5} abonamente
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Statistici</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total abonamente:</span>
                  <span className="font-medium">{subscriptions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active:</span>
                  <span className="font-medium text-primary">{activeSubscriptions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Inactive:</span>
                  <span className="font-medium text-muted-foreground">{inactiveSubscriptions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rata de activitate:</span>
                  <span className="font-medium">
                    {subscriptions.length > 0 
                      ? Math.round((activeSubscriptions.length / subscriptions.length) * 100) 
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default NewsletterManagement
