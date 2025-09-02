import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Eye, Calendar, Gauge, Fuel, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarCardProps {
  id: number;
  brand: string;
  model: string;
  year: number;
  kilometers: number;
  fuel: string;
  power: number;
  transmission: string;
  price: number;
  monthly_rate?: number;
  featured?: boolean;
  image_url?: string;
  description?: string;
  className?: string;
}

const CarCard = ({
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
  className
}: CarCardProps) => {
  return (
    <div className={cn(
      "group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-card transition-all duration-300 hover:-translate-y-1",
      featured && "ring-2 ring-primary/20",
      className
    )}>
      {/* Image Container */}
      <div className="relative overflow-hidden">
        {image_url ? (
          <img
            src={image_url}
            alt={`${brand} ${model}`}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-48 bg-muted flex items-center justify-center">
            <div className="text-muted-foreground text-center">
              <div className="w-16 h-16 bg-muted-foreground/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Calendar className="h-8 w-8" />
              </div>
              <p className="text-sm">Fără imagine</p>
            </div>
          </div>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Featured Badge */}
        {featured && (
          <Badge className="absolute top-4 left-4 bg-gradient-solar">
            Premium
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <div className="mb-4">
          <h3 className="text-xl font-bold font-heading mb-1">
            {brand} {model}
          </h3>
          <p className="text-muted-foreground">
            {year} • {kilometers.toLocaleString()} km
          </p>
        </div>

        {/* Specifications */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{year}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Gauge className="h-4 w-4" />
            <span>{kilometers.toLocaleString()} km</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Fuel className="h-4 w-4" />
            <span>{fuel}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Settings className="h-4 w-4" />
            <span>{transmission}</span>
          </div>
        </div>

        {/* Power */}
        <div className="mb-4">
          <Badge variant="outline">{power} CP</Badge>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="text-2xl font-bold text-primary">
            €{price.toLocaleString()}
          </div>
          {monthly_rate && (
            <div className="text-sm text-muted-foreground">
              de la €{monthly_rate}/lună
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="solar" className="flex-1 hover:shadow-sunrise">
            Vezi detalii
          </Button>
          <Button variant="outline" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;