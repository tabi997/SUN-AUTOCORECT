import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart, 
  Share2, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Gauge, 
  Fuel, 
  Settings, 
  Car, 
  Shield, 
  CheckCircle,
  Star
} from "lucide-react";
import { CarWithImages } from "@/lib/supabase";
import { carService } from "@/lib/services";
import { useToast } from "@/hooks/use-toast";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<CarWithImages | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch car data based on ID from URL
  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const carData = await carService.getCarById(parseInt(id));
        if (carData) {
          setCar(carData);
        } else {
          toast({
            title: "Eroare",
            description: "Mașina nu a fost găsită",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Eroare la încărcarea mașinii:', error);
        toast({
          title: "Eroare",
          description: "Nu s-a putut încărca mașina",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCar();
  }, [id, toast]);

  // Keyboard navigation for images
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!car || car.images.length <= 1) return;
      
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePreviousImage();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [car]);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handlePreviousImage = () => {
    if (car && car.images.length > 0) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? car.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (car && car.images.length > 0) {
      setSelectedImageIndex((prev) => 
        prev === car.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Eliminat din favorite" : "Adăugat la favorite",
      description: isFavorite ? "Mașina a fost eliminată din lista ta de favorite" : "Mașina a fost adăugată la lista ta de favorite",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${car?.brand} ${car?.model}`,
        text: `Verifică această mașină: ${car?.brand} ${car?.model} ${car?.year}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copiat",
        description: "Link-ul mașinii a fost copiat în clipboard",
      });
    }
  };

  const handleContact = (method: 'phone' | 'email' | 'whatsapp') => {
    switch (method) {
      case 'phone':
        window.open('tel:+40211234567');
        break;
      case 'email':
        window.open('mailto:contact@sunautocorrect.ro');
        break;
      case 'whatsapp':
        window.open('https://wa.me/40211234567');
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 pt-20">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="h-96 bg-muted rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 pt-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Mașina nu a fost găsită</h1>
          <Button onClick={() => navigate('/masini-in-stoc')}>
            Înapoi la mașini
          </Button>
        </div>
      </div>
    );
  }

  const primaryImage = car.images.find(img => img.is_primary)?.image_url || car.image_url;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/masini-in-stoc')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Înapoi la mașini
          </Button>
          <span>/</span>
          <span>{car.brand}</span>
          <span>/</span>
          <span>{car.model}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {car.featured && (
                <Badge className="bg-gradient-solar">
                  <Star className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
              <Badge variant="secondary">
                {car.year}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-2">
              {car.brand} {car.model}
            </h1>
            <p className="text-xl text-muted-foreground">
              {car.kilometers.toLocaleString()} km • {car.fuel} • {car.transmission}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={handleFavorite}>
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 group">
                <img
                  src={car.images[selectedImageIndex]?.image_url || primaryImage}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                {car.images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                      onClick={handlePreviousImage}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                      onClick={handleNextImage}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </>
                )}
                
                {/* Image Counter */}
                {car.images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    {selectedImageIndex + 1} / {car.images.length}
                  </div>
                )}
              </div>
              
              {car.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {car.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => handleImageClick(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === selectedImageIndex 
                          ? 'border-primary' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={image.image_url}
                        alt={`${car.brand} ${car.model} - Imagine ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description" className="mb-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Descriere</TabsTrigger>
                <TabsTrigger value="specifications">Specificații</TabsTrigger>
                <TabsTrigger value="features">Caracteristici</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {car.description || "Nu există o descriere disponibilă pentru această mașină."}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="specifications" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg mb-4">Informații tehnice</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Marca</span>
                            <span className="font-medium">{car.brand}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Modelul</span>
                            <span className="font-medium">{car.model}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Anul</span>
                            <span className="font-medium">{car.year}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Kilometri</span>
                            <span className="font-medium">{car.kilometers.toLocaleString()} km</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Combustibil</span>
                            <span className="font-medium">{car.fuel}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Transmisie</span>
                            <span className="font-medium">{car.transmission}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Putere</span>
                            <span className="font-medium">{car.power} CP</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg mb-4">Caracteristici</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Primul proprietar</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Întreținut la reprezentanță</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Fără accidente</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Istoric complet</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Garantie</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="features" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-4">Confort</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Aer condiționat</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Încălzire în scaune</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Navigație</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Sistem audio premium</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg mb-4">Siguranță</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Airbag-uri multiple</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">ABS</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">ESP</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Senzori de parcare</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <Card className="sticky top-24 mb-6">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">
                  €{car.price.toLocaleString()}
                </CardTitle>
                {car.monthly_rate && (
                  <CardDescription>
                    €{car.monthly_rate}/lună cu finanțare
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg" onClick={() => handleContact('phone')}>
                  <Phone className="h-5 w-5 mr-2" />
                  Sună acum
                </Button>
                <Button variant="outline" className="w-full" size="lg" onClick={() => navigate('/contact')}>
                  <Mail className="h-5 w-5 mr-2" />
                  Solicită ofertă
                </Button>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Informații contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-sm">+40 21 123 4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-sm">contact@sunautocorrect.ro</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm">București, Sector 1</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acțiuni rapide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => handleContact('whatsapp')}>
                  <Phone className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleContact('phone')}>
                  <Phone className="h-4 w-4 mr-2" />
                  Programează test drive
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleContact('email')}>
                  <Mail className="h-4 w-4 mr-2" />
                  Solicită mai multe poze
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Cars */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold font-heading mb-6">Mașini similare</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* TODO: Add similar cars component */}
            <div className="text-center p-8 bg-muted rounded-lg">
              <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Mașini similare vor fi afișate aici</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
