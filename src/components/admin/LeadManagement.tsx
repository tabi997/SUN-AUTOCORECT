import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Users, 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar, 
  Eye, 
  Edit, 
  Trash2,
  Loader2,
  Filter
} from 'lucide-react'
import { leadService } from '@/lib/services'
import { Lead } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { Label } from '@/components/ui/label'

const LeadManagement = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const { toast } = useToast()

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const data = await leadService.getAllLeads()
      setLeads(data)
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca lead-urile",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (leadId: number, newStatus: Lead['status']) => {
    try {
      await leadService.updateLeadStatus(leadId, newStatus)
      toast({
        title: "Succes",
        description: "Statusul lead-ului a fost actualizat"
      })
      fetchLeads()
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza statusul",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Ești sigur că vrei să ștergi acest lead?')) {
      try {
        await leadService.deleteLead(id)
        toast({
          title: "Succes",
          description: "Lead-ul a fost șters cu succes"
        })
        fetchLeads()
      } catch (error) {
        toast({
          title: "Eroare",
          description: "Nu s-a putut șterge lead-ul",
          variant: "destructive"
        })
      }
    }
  }

  const getStatusBadgeVariant = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return 'destructive'
      case 'contacted':
        return 'secondary'
      case 'converted':
        return 'default'
      case 'lost':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const getStatusLabel = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return 'Nou'
      case 'contacted':
        return 'Contactat'
      case 'converted':
        return 'Convertit'
      case 'lost':
        return 'Pierdut'
      default:
        return status
    }
  }

  const getSourceLabel = (source: Lead['source']) => {
    switch (source) {
      case 'contact':
        return 'Formular Contact'
      case 'newsletter':
        return 'Newsletter'
      case 'car_inquiry':
        return 'Întrebare Mașină'
      default:
        return source
    }
  }

  const filteredLeads = leads.filter(lead => 
    statusFilter === 'all' || lead.status === statusFilter
  )

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Lead-uri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lead-uri Noi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {leads.filter(l => l.status === 'new').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Contactate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {leads.filter(l => l.status === 'contacted').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Convertite</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {leads.filter(l => l.status === 'converted').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Lista Lead-uri ({filteredLeads.length})</span>
            </CardTitle>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filtrează după status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toate</SelectItem>
                  <SelectItem value="new">Noi</SelectItem>
                  <SelectItem value="contacted">Contactate</SelectItem>
                  <SelectItem value="converted">Convertite</SelectItem>
                  <SelectItem value="lost">Pierdute</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredLeads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nu există lead-uri {statusFilter !== 'all' ? `cu statusul "${getStatusLabel(statusFilter as Lead['status'])}"` : ''}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Sursa</TableHead>
                  <TableHead>Mesaj</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{lead.email}</span>
                          </div>
                          {lead.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span>{lead.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getSourceLabel(lead.source)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm line-clamp-2">{lead.message}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={lead.status}
                        onValueChange={(value) => handleStatusChange(lead.id, value as Lead['status'])}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Nou</SelectItem>
                          <SelectItem value="contacted">Contactat</SelectItem>
                          <SelectItem value="converted">Convertit</SelectItem>
                          <SelectItem value="lost">Pierdut</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(lead.created_at).toLocaleDateString('ro-RO')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedLead(lead)
                            setIsDetailDialogOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(lead.id)}
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

      {/* Lead Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalii Lead</DialogTitle>
            <DialogDescription>
              Informații complete despre lead
            </DialogDescription>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Nume</Label>
                  <p className="text-sm">{selectedLead.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{selectedLead.email}</p>
                </div>
              </div>
              
              {selectedLead.phone && (
                <div>
                  <Label className="text-sm font-medium">Telefon</Label>
                  <p className="text-sm">{selectedLead.phone}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Sursa</Label>
                  <Badge variant="outline">
                    {getSourceLabel(selectedLead.source)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant={getStatusBadgeVariant(selectedLead.status)}>
                    {getStatusLabel(selectedLead.status)}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Mesaj</Label>
                <p className="text-sm bg-muted p-3 rounded-lg mt-1">
                  {selectedLead.message}
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Data Creării</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedLead.created_at).toLocaleString('ro-RO')}
                </p>
              </div>
              
              {selectedLead.car_id && (
                <div>
                  <Label className="text-sm font-medium">ID Mașină</Label>
                  <p className="text-sm">{selectedLead.car_id}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default LeadManagement
