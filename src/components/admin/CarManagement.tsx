import { useState, useEffect, useRef } from 'react'
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
  Images,
  Upload,
  X
} from 'lucide-react'
import { carService } from '@/lib/services'
import { CarWithImages, CarImage } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import ImageUpload from './ImageUpload'
import AutovitImport from './AutovitImport'
import SafeImage from '@/components/ui/safe-image'
import ClientFileUpload from './ClientFileUpload'
import { uploadCarImages } from '@/lib/image-upload'

const CarManagement = () => {
  const [cars, setCars] = useState<CarWithImages[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCar, setEditingCar] = useState<CarWithImages | null>(null)
  const [uploadingImages, setUploadingImages] = useState(false)
  
  console.log('🔍 CarManagement: Component rendering, loading:', loading, 'cars count:', cars.length)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('details')
  const [tempImages, setTempImages] = useState<File[]>([])
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
    console.log('🔍 CarManagement: useEffect triggered, calling fetchCars')
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      console.log('🔍 CarManagement: Starting fetchCars...')
      const data = await carService.getAllCars()
      console.log('🔍 CarManagement: Cars fetched:', data?.length || 0)
      setCars(data || [])
    } catch (error) {
      console.error('❌ CarManagement: Error fetching cars:', error)
      setCars([])
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca mașinile",
        variant: "destructive"
      })
    } finally {
      console.log('🔍 CarManagement: fetchCars completed, setting loading to false')
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
        setIsDialogOpen(false)
        setEditingCar(null)
        resetForm()
      } else {
        const newCar = await carService.createCar(formData)
        
        // If there are temporary images, upload them
        if (tempImages.length > 0) {
          try {
            setUploadingImages(true)
            const uploadResult = await uploadCarImages({
              carId: newCar.id,
              files: tempImages
            })
            
            if (uploadResult.success) {
              toast({
                title: "Succes",
                description: `Mașina a fost adăugată cu succes cu ${tempImages.length} fotografii`
              })
            } else {
              toast({
                title: "Avertisment",
                description: `Mașina a fost salvată, dar a apărut o eroare la upload-ul imaginilor: ${uploadResult.error}`,
                variant: "destructive"
              })
            }
          } catch (uploadError) {
            console.error('Upload error:', uploadError)
            toast({
              title: "Avertisment",
              description: "Mașina a fost salvată, dar a apărut o eroare la upload-ul imaginilor. Poți adăuga imaginile manual din editare.",
              variant: "destructive"
            })
          } finally {
            setUploadingImages(false)
          }
        } else {
          toast({
            title: "Succes",
            description: "Mașina a fost adăugată cu succes"
          })
        }
        
        setIsDialogOpen(false)
        setEditingCar(null)
        resetForm()
      }
      
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
      brand: car.brand || '',
      model: car.model || '',
      year: car.year || new Date().getFullYear(),
      kilometers: car.kilometers || 0,
      fuel: car.fuel || '',
      power: car.power || 0,
      transmission: car.transmission || '',
      price: car.price || 0,
      monthly_rate: car.monthly_rate || 0,
      featured: car.featured || false,
      image_url: car.image_url || '',
      description: car.description || '',
      status: car.status || 'active'
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
    setTempImages([])
  }

  const openNewCarDialog = () => {
    setEditingCar(null)
    resetForm()
    setIsDialogOpen(true)
    setActiveTab('details')
  }

  const handleImagesChange = (newImages: CarImage[]) => {
    if (editingCar) {
      setEditingCar({ ...editingCar, images: newImages || [] })
    }
  }

  const handleTempFilesChange = (files: File[]) => {
    setTempImages(files)
  }

  if (loading) {
    console.log('🔍 CarManagement: Rendering loading state')
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Se încarcă mașinile...</span>
      </div>
    )
  }

  console.log('🔍 CarManagement: Rendering main component with', cars.length, 'cars')
  
  return (
    <div className="space-y-4">
      {/* Import Autovit */}
      {/* <AutovitImport /> */}

      {/* Add Car Button */}
      <div className="flex justify-end">
        <Button onClick={openNewCarDialog} variant="solar" className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Adaugă Mașină</span>
        </Button>
      </div>

      {/* Cars List - Mobile Cards / Desktop Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Car className="h-5 w-5" />
            <span>Lista Mașini ({cars.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!cars || cars.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nu există mașini în baza de date</p>
              <p className="text-sm">Adaugă prima mașină pentru a începe</p>
            </div>
          ) : (
            <>
              {/* Mobile Cards View */}
              <div className="block md:hidden space-y-4">
                {cars?.map((car) => car ? (
                  <Card key={car.id} className="p-4">
                    <div className="flex space-x-4">
                      <div className="w-20 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <SafeImage
                          src={car.images?.find(img => img?.is_primary)?.image_url || car.image_url}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full"
                          fallbackIcon={<Car className="h-6 w-6 text-muted-foreground" />}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{car.brand} {car.model}</div>
                        <div className="text-sm text-muted-foreground space-x-2">
                          <span>{car.year || 'N/A'}</span>
                          <span>•</span>
                          <span>{(car.kilometers || 0).toLocaleString()} km</span>
                        </div>
                        <div className="font-bold text-primary text-sm">
                          €{(car.price || 0).toLocaleString()}
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant={car.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                            {car.status === 'active' ? 'Activ' : 
                             car.status === 'sold' ? 'Vândut' : 
                             car.status === 'reserved' ? 'Rezervat' : 'Inactiv'}
                          </Badge>
                          {car.featured && (
                            <Badge variant="secondary" className="text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(car)}
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(car.id)}
                            className="flex-1"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Șterge
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ) : null) || []}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
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
                {cars?.map((car) => car ? (
                  <TableRow key={car.id}>
                    <TableCell>
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-muted">
                        <SafeImage
                          src={car.images?.find(img => img?.is_primary)?.image_url || car.image_url}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full"
                          fallbackIcon={<Car className="h-6 w-6 text-muted-foreground" />}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{car.brand} {car.model}</div>
                        <div className="text-sm text-muted-foreground space-x-2">
                          <span>{car.year || 'N/A'}</span>
                          <span>•</span>
                          <span>{(car.kilometers || 0).toLocaleString()} km</span>
                          <span>•</span>
                          <span>{car.fuel || 'N/A'}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-primary">
                        €{(car.price || 0).toLocaleString()}
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
                          {car.created_at ? new Date(car.created_at).toLocaleDateString('ro-RO') : 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <Images className="h-3 w-3" />
                          <span>{car.images?.length || 0}</span>
                        </Badge>
                        {(!car.images || car.images.length === 0) && (
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
                ) : null) || []}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Car Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-screen-md max-h-[90vh] overflow-y-auto mx-4">
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
              <TabsTrigger value="images" className="flex items-center space-x-2">
                <Camera className="h-4 w-4" />
                <span>Fotografii ({editingCar?.images?.length || 0})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    Anulează
                  </Button>
                  <Button 
                    type="submit" 
                    variant="solar" 
                    className="w-full sm:w-auto"
                    disabled={uploadingImages}
                  >
                    {uploadingImages ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Se încarcă...
                      </>
                    ) : (
                      `${editingCar ? 'Actualizează' : 'Adaugă'} Mașina`
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="images" className="space-y-4">
              {editingCar ? (
                <div className="space-y-4">
                  <ImageUpload
                    carId={editingCar.id}
                    existingImages={editingCar.images || []}
                    onImagesChange={handleImagesChange}
                  />
                  <div className="flex justify-end pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false)
                        setEditingCar(null)
                        resetForm()
                      }}
                    >
                      Închide
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">Adaugă Fotografii</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Poți adăuga până la 20 imagini. Prima imagine va fi cea principală.
                    </p>
                  </div>
                  
                  <ClientFileUpload
                    onFilesChange={handleTempFilesChange}
                    maxFiles={20}
                    maxFileSize={10}
                    acceptedTypes={['image/*']}
                    existingFiles={tempImages}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CarManagement