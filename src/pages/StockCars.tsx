import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Car, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  SlidersHorizontal,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Star,
  Eye
} from "lucide-react"
import { carService } from "@/lib/services"
import { CarWithImages } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

const StockCars = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [cars, setCars] = useState<CarWithImages[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    brand: searchParams.get('brand') || '',
    fuel: searchParams.get('fuel') || '',
    transmission: searchParams.get('transmission') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minYear: searchParams.get('minYear') || '',
    maxYear: searchParams.get('maxYear') || ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCars()
  }, [])

  useEffect(() => {
    // Actualizează URL-ul când se schimbă filtrele
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    setSearchParams(params)
  }, [filters, setSearchParams])

  const fetchCars = async () => {
    try {
      setLoading(true)
      const data = await carService.getAllCars()
      setCars(data)
    } catch (error) {
      console.error('Eroare la încărcarea mașinilor:', error)
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca mașinile",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredCars = cars.filter(car => {
    const searchMatch = filters.search === '' || 
      `${car.brand} ${car.model}`.toLowerCase().includes(filters.search.toLowerCase()) ||
      car.description?.toLowerCase().includes(filters.search.toLowerCase())
    
    const brandMatch = filters.brand === '' || car.brand === filters.brand
    const fuelMatch = filters.fuel === '' || car.fuel === filters.fuel
    const transmissionMatch = filters.transmission === '' || car.transmission === filters.transmission
    
    const priceMatch = (!filters.minPrice || car.price >= parseFloat(filters.minPrice)) &&
                      (!filters.maxPrice || car.price <= parseFloat(filters.maxPrice))
    
    const yearMatch = (!filters.minYear || car.year >= parseInt(filters.minYear)) &&
                     (!filters.maxYear || car.year <= parseInt(filters.maxYear))
    
    return searchMatch && brandMatch && fuelMatch && transmissionMatch && priceMatch && yearMatch
  })

  const brands = [...new Set(cars.map(car => car.brand))]
  const fuels = [...new Set(cars.map(car => car.fuel))]
  const transmissions = [...new Set(cars.map(car => car.transmission))]

  const clearFilters = () => {
    setFilters({
      search: '',
      brand: '',
      fuel: '',
      transmission: '',
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: ''
    })
  }

  const getPrimaryImage = (car: CarWithImages) => {
    const primaryImage = car.images.find(img => img.is_primary)
    return primaryImage?.image_url || car.image_url || '/src/assets/placeholder.svg'
  }

  const handleCarClick = (carId: string | number) => {
    navigate(`/masina/${carId}`)
  }

  const handleViewDetails = (e: React.MouseEvent, carId: string | number) => {
    e.stopPropagation() // Previne propagarea click-ului către card
    navigate(`/masina/${carId}`)
  }

  const phoneNumber = "+40 745 123 456"; // Placeholder for the phone number

  const handleContactClick = (e: React.MouseEvent, carId: string | number) => {
    e.stopPropagation() // Previne propagarea click-ului către card
    window.location.href = `tel:${phoneNumber.replace(/\s/g, "")}`;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <Car className="h-16 w-16 mx-auto mb-4 animate-pulse text-primary" />
              <p className="text-lg text-muted-foreground">Se încarcă mașinile...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">
              Mașini în Stoc
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Descoperă colecția noastră completă de vehicule disponibile. 
              Fiecare mașină este verificată și certificată pentru calitate.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Caută după marcă, model sau descriere..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{cars.length}</div>
              <div className="text-sm text-muted-foreground">Mașini în stoc</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{brands.length}</div>
              <div className="text-sm text-muted-foreground">Mărci disponibile</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {cars.filter(c => c.featured).length}
              </div>
              <div className="text-sm text-muted-foreground">Mașini recomandate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {cars.length > 0 ? Math.min(...cars.map(c => c.price)) : 0}
              </div>
              <div className="text-sm text-muted-foreground">Preț de la (€)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtre
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground"
              >
                Resetează
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 p-6 bg-muted/30 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Marcă</label>
                  <Select value={filters.brand} onValueChange={(value) => setFilters({ ...filters, brand: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toate mărcile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toate mărcile</SelectItem>
                      {brands.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Combustibil</label>
                  <Select value={filters.fuel} onValueChange={(value) => setFilters({ ...filters, fuel: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toate tipurile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toate tipurile</SelectItem>
                      {fuels.map(fuel => (
                        <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Transmisie</label>
                  <Select value={filters.transmission} onValueChange={(value) => setFilters({ ...filters, transmission: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toate tipurile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toate tipurile</SelectItem>
                      {transmissions.map(trans => (
                        <SelectItem key={trans} value={trans}>{trans}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Preț (€)</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      className="text-sm"
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Cars Grid/List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredCars.length === 0 ? (
            <div className="text-center py-16">
              <Car className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Nu s-au găsit mașini</h3>
              <p className="text-muted-foreground mb-4">
                Încearcă să modifici filtrele sau să cauți altceva
              </p>
              <Button onClick={clearFilters} variant="outline">
                Resetează filtrele
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <p className="text-muted-foreground">
                  Afișez {filteredCars.length} din {cars.length} mașini
                </p>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCars.map((car) => (
                    <Card 
                      key={car.id} 
                      className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                      onClick={() => handleCarClick(car.id)}
                    >
                      <div className="relative">
                        <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                          <img
                            src={getPrimaryImage(car)}
                            alt={`${car.brand} ${car.model}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        {car.featured && (
                          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                            <Star className="h-3 w-3 mr-1" />
                            Recomandat
                          </Badge>
                        )}
                        <div className="absolute top-3 right-3">
                          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                            {car.images.length} foto
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold mb-2">{car.brand} {car.model}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {car.year}
                            </span>
                            <span className="flex items-center gap-1">
                              <Gauge className="h-4 w-4" />
                              {car.kilometers.toLocaleString()} km
                            </span>
                            <span className="flex items-center gap-1">
                              <Fuel className="h-4 w-4" />
                              {car.fuel}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{car.power} CP</span>
                            <span>•</span>
                            <span>{car.transmission}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="text-2xl font-bold text-primary mb-1">
                            €{car.price.toLocaleString()}
                          </div>
                          {car.monthly_rate && (
                            <div className="text-sm text-muted-foreground">
                              €{car.monthly_rate}/lună
                            </div>
                          )}
                        </div>

                        {car.description && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {car.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-2"
                            onClick={(e) => handleViewDetails(e, car.id)}
                          >
                            <Eye className="h-4 w-4" />
                            Vezi detalii
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex items-center gap-2"
                            onClick={(e) => handleContactClick(e, car.id)}
                          >
                            <Car className="h-4 w-4" />
                            Contactează
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCars.map((car) => (
                    <Card 
                      key={car.id} 
                      className="group hover:shadow-md transition-all duration-300 cursor-pointer"
                      onClick={() => handleCarClick(car.id)}
                    >
                      <div className="flex">
                        <div className="w-48 h-32 relative">
                          <img
                            src={getPrimaryImage(car)}
                            alt={`${car.brand} ${car.model}`}
                            className="w-full h-full object-cover rounded-l-lg"
                          />
                          {car.featured && (
                            <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                              <Star className="h-3 w-3 mr-1" />
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold mb-2">{car.brand} {car.model}</h3>
                              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {car.year}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Gauge className="h-4 w-4" />
                                  {car.kilometers.toLocaleString()} km
                                </span>
                                <span className="flex items-center gap-1">
                                  <Fuel className="h-4 w-4" />
                                  {car.fuel}
                                </span>
                                <span>{car.power} CP</span>
                                <span>{car.transmission}</span>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary mb-1">
                                €{car.price.toLocaleString()}
                              </div>
                              {car.monthly_rate && (
                                <div className="text-sm text-muted-foreground">
                                  €{car.monthly_rate}/lună
                                </div>
                              )}
                            </div>
                          </div>

                          {car.description && (
                            <p className="text-sm text-muted-foreground mb-4">
                              {car.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Badge variant="secondary">
                                {car.images.length} fotografii
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                ID: {car.id}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => handleViewDetails(e, car.id)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Detalii
                              </Button>
                              <Button 
                                size="sm"
                                onClick={(e) => handleContactClick(e, car.id)}
                              >
                                <Car className="h-4 w-4 mr-2" />
                                Contactează
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default StockCars
