import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Eye, Calendar, Gauge, Fuel, Settings, Images, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { CarWithImages } from "@/lib/supabase";
import { Link } from "react-router-dom";

interface CarCardProps {
  car: CarWithImages;
  className?: string;
}

const CarCard = ({ car, className }: CarCardProps) => {
  const {
    id,
    brand,
    model,
    year,
    kilometers,
    fuel,
    power,
    transmission,
    price,
    monthly_rate,
    featured = false,
    image_url,
    description,
    images
  } = car;

  // Obține imaginea principală sau fallback la image_url
  const primaryImage = images.find(img => img.is_primary)?.image_url || image_url;

  const phoneNumber = "+40 745 123 456"; // Placeholder for the phone number

  const handleContactClick = () => {
    window.location.href = `tel:${phoneNumber.replace(/\s/g, "")}`;
  };

  return (
    <div className={cn(
      "group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-card transition-all duration-300 hover:-translate-y-1",
      featured && "ring-2 ring-primary/20",
      className
    )}>
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <Link to={`/masina/${id}`}>
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={`${brand} ${model}`}
              className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
            />
          ) : (
            <div className="w-full h-40 sm:h-48 bg-muted flex items-center justify-center cursor-pointer">
              <div className="text-muted-foreground text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted-foreground/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Calendar className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <p className="text-xs sm:text-sm">Fără imagine</p>
              </div>
            </div>
          )}
        </Link>
        
        {/* Overlay Actions */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <Button size="sm" variant="secondary" className="h-7 w-7 sm:h-8 sm:w-8 p-0 pointer-events-auto">
            <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Link to={`/masina/${id}`} className="pointer-events-auto">
            <Button size="sm" variant="secondary" className="h-7 w-7 sm:h-8 sm:w-8 p-0">
              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </Link>
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none"></div>

        {/* Featured Badge */}
        {featured && (
          <Badge className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-gradient-solar text-xs sm:text-sm">
            Premium
          </Badge>
        )}

        {/* Images Count Badge */}
        {images.length > 0 && (
          <Badge variant="secondary" className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-background/80 backdrop-blur-sm text-xs">
            <Images className="h-3 w-3 mr-1" />
            {images.length} foto
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Title */}
        <div className="mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-bold font-heading mb-1">
            {brand} {model}
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground">
            {year} • {kilometers.toLocaleString()} km
          </p>
        </div>

        {/* Specifications */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">{year}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
            <Gauge className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">{kilometers.toLocaleString()} km</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
            <Fuel className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">{fuel}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
            <Settings className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">{transmission}</span>
          </div>
        </div>

        {/* Power */}
        <div className="mb-3 sm:mb-4">
          <Badge variant="outline" className="text-xs sm:text-sm">
            {power} CP
          </Badge>
        </div>

        {/* Description */}
        {description && (
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {/* Price */}
        <div className="mb-3 sm:mb-4">
          <div className="text-xl sm:text-2xl font-bold text-primary">
            €{price.toLocaleString()}
          </div>
          {monthly_rate && (
            <div className="text-xs sm:text-sm text-muted-foreground">
              €{monthly_rate}/lună
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Link to={`/masina/${id}`} className="flex-1">
            <Button variant="outline" className="w-full text-xs sm:text-sm py-2 sm:py-2.5">
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Vezi detalii
            </Button>
          </Link>
          <Button onClick={handleContactClick} className="flex-1 text-xs sm:text-sm py-2 sm:py-2.5">
            <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Contactează
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;