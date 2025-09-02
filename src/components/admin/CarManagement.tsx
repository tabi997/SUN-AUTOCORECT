import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Car, 
  Edit, 
  Trash2, 
  Plus, 
  Eye, 
  Star,
  Loader2,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Camera,
  Images
} from 'lucide-react'
import { carService } from '@/lib/services'
import { CarWithImages, CarImage } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import ImageUpload from './ImageUpload'
import AutovitImport from './AutovitImport'

const CarManagement = () => {
  const [cars, setCars] = useState<CarWithImages[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCar, setEditingCar] = useState<CarWithImages | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('details')
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    kilometers: 0,
    fuel: '',
    power: 0,
    transmission: '',
    price: 0,
    monthly_rate: 0,
    featured: false,
    image_url: '',
    description: '',
    status: 'active' as 'active' | 'sold' | 'reserved' | 'inactive'
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      const data = await carService.getAllCars()
      setCars(data)
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca mașinile",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingCar) {
        await carService.updateCar(editingCar.id, formData)
        toast({
          title: "Succes",
          description: "Mașina a fost actualizată cu succes"
        })
      } else {
        await carService.createCar(formData)
        toast({
          title: "Succes",
          description: "Mașina a fost adăugată cu succes"
        })
      }
      
      setIsDialogOpen(false)
      setEditingCar(null)
      resetForm()
      fetchCars()
    } catch (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare la salvare",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (car: CarWithImages) => {
    setEditingCar(car)
    setFormData({
      brand: car.brand,
      model: car.model,
      year: car.year,
      kilometers: car.kilometers,
      fuel: car.fuel,
      power: car.power,
      transmission: car.transmission,
      price: car.price,
      monthly_rate: car.monthly_rate || 0,
      featured: car.featured,
      image_url: car.image_url,
      description: car.description || '',
      status: car.status
    })
    setIsDialogOpen(true)
    setActiveTab('details')
  }

  const handleDelete = async (id: number) => {
    if (confirm('Ești sigur că vrei să ștergi această mașină?')) {
      try {
        await carService.deleteCar(id)
        toast({
          title: "Succes",
          description: "Mașina a fost ștearsă cu succes"
        })
        fetchCars()
      } catch (error) {
        toast({
          title: "Eroare",
          description: "Nu s-a putut șterge mașina",
          variant: "destructive"
        })
      }
    }
  }

  const resetForm = () => {
    setFormData({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      kilometers: 0,
      fuel: '',
      power: 0,
      transmission: '',
      price: 0,
      monthly_rate: 0,
      featured: false,
      image_url: '',
      description: '',
      status: 'active'
    })
  }

  const openNewCarDialog = () => {
    setEditingCar(null)
    resetForm()
    setIsDialogOpen(true)
    setActiveTab('details')
  }

  const handleImagesChange = (newImages: CarImage[]) => {
    if (editingCar) {
      setEditingCar({ ...editingCar, images: newImages })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Import Autovit */}
      <AutovitImport />

      {/* Cars Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Car className="h-5 w-5" />
            <span>Lista Mașini ({cars.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cars.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nu există mașini în baza de date</p>
              <p className="text-sm">Adaugă prima mașină pentru a începe</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagine</TableHead>
                  <TableHead>Detalii</TableHead>
                  <TableHead>Preț</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fotografii</TableHead>
                  <TableHead>Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell>
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-muted">
                        {car.images.length > 0 ? (
                          <img 
                            src={car.images.find(img => img.is_primary)?.image_url || car.image_url} 
                            alt={`${car.brand} ${car.model}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Car className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{car.brand} {car.model}</div>
                        <div className="text-sm text-muted-foreground space-x-2">
                          <span>{car.year}</span>
                          <span>•</span>
                          <span>{car.kilometers.toLocaleString()} km</span>
                          <span>•</span>
                          <span>{car.fuel}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-primary">
                        €{car.price.toLocaleString()}
                      </div>
                      {car.monthly_rate && (
                        <div className="text-sm text-muted-foreground">
                          €{car.monthly_rate}/lună
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant={car.status === 'active' ? 'default' : 'secondary'}>
                          {car.status === 'active' ? 'Activ' : 
                           car.status === 'sold' ? 'Vândut' : 
                           car.status === 'reserved' ? 'Rezervat' : 'Inactiv'}
                        </Badge>
                        {car.featured && (
                          <Badge variant="secondary" className="flex items-center space-x-1 w-fit">
                            <Star className="h-3 w-3" />
                            <span>Featured</span>
                          </Badge>
                        )}
                        <div className="text-xs text-muted-foreground">
                          {new Date(car.created_at).toLocaleDateString('ro-RO')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <Images className="h-3 w-3" />
                          <span>{car.images.length}</span>
                        </Badge>
                        {car.images.length === 0 && (
                          <span className="text-xs text-muted-foreground">Fără foto</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(car)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(car.id)}
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

      {/* Add/Edit Car Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={openNewCarDialog} variant="solar" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Adaugă Mașină</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCar ? 'Editează Mașina' : 'Adaugă Mașină Nouă'}
            </DialogTitle>
            <DialogDescription>
              Completează informațiile despre mașină și gestionează fotografii
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details" className="flex items-center space-x-2">
                <Car className="h-4 w-4" />
                <span>Detalii Mașină</span>
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center space-x-2" disabled={!editingCar}>
                <Camera className="h-4 w-4" />
                <span>Fotografii ({editingCar?.images.length || 0})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Marcă *</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="model">Model *</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">An *</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      min="1990"
                      max={new Date().getFullYear() + 1}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="kilometers">Kilometri *</Label>
                    <Input
                      id="kilometers"
                      type="number"
                      value={formData.kilometers}
                      onChange={(e) => setFormData({ ...formData, kilometers: parseInt(e.target.value) })}
                      min="0"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="power">Putere (CP) *</Label>
                    <Input
                      id="power"
                      type="number"
                      value={formData.power}
                      onChange={(e) => setFormData({ ...formData, power: parseInt(e.target.value) })}
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fuel">Combustibil *</Label>
                    <Select
                      value={formData.fuel}
                      onValueChange={(value) => setFormData({ ...formData, fuel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează combustibilul" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Benzină">Benzină</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="Electric">Electric</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="transmission">Transmisie *</Label>
                    <Select
                      value={formData.transmission}
                      onValueChange={(value) => setFormData({ ...formData, transmission: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează transmisia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manuală">Manuală</SelectItem>
                        <SelectItem value="Automată">Automată</SelectItem>
                        <SelectItem value="Semi-automată">Semi-automată</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Preț (€) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                      min="0"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="monthly_rate">Rată Lunară (€)</Label>
                    <Input
                      id="monthly_rate"
                      type="number"
                      value={formData.monthly_rate}
                      onChange={(e) => setFormData({ ...formData, monthly_rate: parseInt(e.target.value) })}
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: 'active' | 'sold' | 'reserved' | 'inactive') => 
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Activ</SelectItem>
                        <SelectItem value="sold">Vândut</SelectItem>
                        <SelectItem value="reserved">Rezervat</SelectItem>
                        <SelectItem value="inactive">Inactiv</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="image_url">URL Imagine Principală</Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descriere</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descriere detaliată a mașinii..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label htmlFor="featured">Mașină Featured</Label>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Anulează
                  </Button>
                  <Button type="submit" variant="solar">
                    {editingCar ? 'Actualizează' : 'Adaugă'} Mașina
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="images" className="space-y-4">
              {editingCar && (
                <ImageUpload
                  carId={editingCar.id}
                  existingImages={editingCar.images}
                  onImagesChange={handleImagesChange}
                />
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CarManagement
