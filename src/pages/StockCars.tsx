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
import { useContact } from "@/lib/contact-context"

const StockCars = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [cars, setCars] = useState<CarWithImages[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    brand: searchParams.get('brand') || '',
    model: searchParams.get('model') || '',
    fuel: searchParams.get('fuel') || '',
    transmission: searchParams.get('transmission') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minYear: searchParams.get('minYear') || searchParams.get('year') || '',
    maxYear: searchParams.get('maxYear') || ''
  })
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'year-asc' | 'year-desc' | 'default'>('default')
  const { toast } = useToast()
  const navigate = useNavigate()
  const { contactInfo } = useContact()

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
    const modelMatch = filters.model === '' || car.model === filters.model
    const fuelMatch = filters.fuel === '' || car.fuel === filters.fuel
    const transmissionMatch = filters.transmission === '' || car.transmission === filters.transmission
    
    const priceMatch = (!filters.minPrice || car.price >= parseFloat(filters.minPrice)) &&
                      (!filters.maxPrice || car.price <= parseFloat(filters.maxPrice))
    
    const yearMatch = (!filters.minYear || car.year >= parseInt(filters.minYear)) &&
                     (!filters.maxYear || car.year <= parseInt(filters.maxYear))
    
    return searchMatch && brandMatch && modelMatch && fuelMatch && transmissionMatch && priceMatch && yearMatch
  })

  // Sort cars based on selected criteria
  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'year-asc':
        return a.year - b.year
      case 'year-desc':
        return b.year - a.year
      default:
        return 0 // Keep original order
    }
  })

  const brands = [...new Set(cars.map(car => car.brand))]
  const fuels = [...new Set(cars.map(car => car.fuel))]
  const transmissions = [...new Set(cars.map(car => car.transmission))]

  const clearFilters = () => {
    setFilters({
      search: '',
      brand: '',
      model: '',
      fuel: '',
      transmission: '',
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: ''
    })
    setSortBy('default')
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

  const phoneNumber = contactInfo?.phone || "+40 745 123 456";

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
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4 sm:mb-6">
              Mașini în Stoc
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
              Descoperă colecția noastră completă de vehicule disponibile. 
              Fiecare mașină este verificată și certificată pentru calitate.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
              <Input
                placeholder="Caută după marcă, model sau descriere..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10 pr-4 py-2.5 sm:py-3 text-base sm:text-lg"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-primary">{cars.length}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Mașini în stoc</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-primary">{brands.length}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Mărci disponibile</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-primary">
                {cars.filter(c => c.featured).length}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Mașini recomandate</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-primary">
                {cars.length > 0 ? Math.min(...cars.map(c => c.price)) : 0}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Preț de la (€)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-4 sm:py-6 lg:py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground text-xs sm:text-sm"
              >
                Resetează
              </Button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-32 sm:w-40 h-8 sm:h-9 text-xs sm:text-sm">
                  <SelectValue placeholder="Sortează" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Implicit</SelectItem>
                  <SelectItem value="price-asc">Preț ↑</SelectItem>
                  <SelectItem value="price-desc">Preț ↓</SelectItem>
                  <SelectItem value="year-asc">An ↑</SelectItem>
                  <SelectItem value="year-desc">An ↓</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 sm:h-9 sm:w-9 p-0"
              >
                <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 w-8 sm:h-9 sm:w-9 p-0"
              >
                <List className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>


        </div>
      </section>

      {/* Cars Grid/List */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          {sortedCars.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <Car className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Nu s-au găsit mașini</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                Încearcă să modifici filtrele sau să cauți altceva
              </p>
              <Button onClick={clearFilters} variant="outline" className="text-sm">
                Resetează filtrele
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 sm:mb-8">
                <p className="text-sm sm:text-base text-muted-foreground">
                  Afișez {sortedCars.length} din {cars.length} mașini
                </p>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {sortedCars.map((car) => (
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
                      
                      <CardContent className="p-4 sm:p-6">
                        <div className="mb-3 sm:mb-4">
                          <h3 className="text-lg sm:text-xl font-bold mb-2">{car.brand} {car.model}</h3>
                          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                              {car.year}
                            </span>
                            <span className="flex items-center gap-1">
                              <Gauge className="h-3 w-3 sm:h-4 sm:w-4" />
                              {car.kilometers.toLocaleString()} km
                            </span>
                            <span className="flex items-center gap-1">
                              <Fuel className="h-3 w-3 sm:h-4 sm:w-4" />
                              {car.fuel}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                            <span>{car.power} CP</span>
                            <span>•</span>
                            <span>{car.transmission}</span>
                          </div>
                        </div>

                        <div className="mb-3 sm:mb-4">
                          <div className="text-xl sm:text-2xl font-bold text-primary mb-1">
                            €{car.price.toLocaleString()}
                          </div>
                          {car.monthly_rate && (
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              €{car.monthly_rate}/lună
                            </div>
                          )}
                        </div>

                        {car.description && (
                          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
                            {car.description}
                          </p>
                        )}

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-2 text-xs sm:text-sm"
                            onClick={(e) => handleViewDetails(e, car.id)}
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            Vezi detalii
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex items-center gap-2 text-xs sm:text-sm"
                            onClick={(e) => handleContactClick(e, car.id)}
                          >
                            <Car className="h-3 w-3 sm:h-4 sm:w-4" />
                            Contactează
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {sortedCars.map((car) => (
                    <Card 
                      key={car.id} 
                      className="group hover:shadow-md transition-all duration-300 cursor-pointer"
                      onClick={() => handleCarClick(car.id)}
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-48 h-48 sm:h-32 relative">
                          <img
                            src={getPrimaryImage(car)}
                            alt={`${car.brand} ${car.model}`}
                            className="w-full h-full object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
                          />
                          {car.featured && (
                            <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs">
                              <Star className="h-3 w-3 mr-1" />
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex-1 p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg sm:text-xl font-bold mb-2">{car.brand} {car.model}</h3>
                              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                  {car.year}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Gauge className="h-3 w-3 sm:h-4 sm:w-4" />
                                  {car.kilometers.toLocaleString()} km
                                </span>
                                <span className="flex items-center gap-1">
                                  <Fuel className="h-3 w-3 sm:h-4 sm:w-4" />
                                  {car.fuel}
                                </span>
                                <span>{car.power} CP</span>
                                <span>{car.transmission}</span>
                              </div>
                            </div>
                            
                            <div className="text-left sm:text-right mt-2 sm:mt-0">
                              <div className="text-xl sm:text-2xl font-bold text-primary mb-1">
                                €{car.price.toLocaleString()}
                              </div>
                              {car.monthly_rate && (
                                <div className="text-xs sm:text-sm text-muted-foreground">
                                  €{car.monthly_rate}/lună
                                </div>
                              )}
                            </div>
                          </div>

                          {car.description && (
                            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                              {car.description}
                            </p>
                          )}

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <Badge variant="secondary" className="text-xs">
                                {car.images.length} fotografii
                              </Badge>
                              <span className="text-xs sm:text-sm text-muted-foreground">
                                ID: {car.id}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => handleViewDetails(e, car.id)}
                                className="text-xs sm:text-sm"
                              >
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                Detalii
                              </Button>
                              <Button 
                                size="sm"
                                onClick={(e) => handleContactClick(e, car.id)}
                                className="text-xs sm:text-sm"
                              >
                                <Car className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
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
