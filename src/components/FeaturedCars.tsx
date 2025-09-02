import { useState, useEffect } from 'react';
import CarCard from "./CarCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { carService } from "@/lib/services";
import { CarWithImages } from "@/lib/supabase";

const FeaturedCars = () => {
  const [featuredCars, setFeaturedCars] = useState<CarWithImages[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const cars = await carService.getFeaturedCars();
        setFeaturedCars(cars);
      } catch (error) {
        console.error('Eroare la încărcarea mașinilor featured:', error);
        // Fallback la datele hardcodate dacă Supabase nu este disponibil
        setFeaturedCars([
          {
            id: 1,
            brand: "BMW",
            model: "Seria 3 320d",
            year: 2022,
            kilometers: 45000,
            fuel: "Diesel",
            power: 190,
            transmission: "Automată",
            price: 32500,
            monthly_rate: 450,
            featured: true,
            image_url: "/src/assets/bmw-sedan.jpg",
            description: "BMW Seria 3 320d în stare excelentă",
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            images: []
          },
          {
            id: 2,
            brand: "Mercedes-Benz",
            model: "GLC 220d",
            year: 2021,
            kilometers: 52000,
            fuel: "Diesel",
            power: 194,
            transmission: "Automată",
            price: 38900,
            monthly_rate: 520,
            featured: false,
            image_url: "/src/assets/mercedes-suv.jpg",
            description: "Mercedes GLC 220d SUV elegant",
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            images: []
          },
          {
            id: 3,
            brand: "Audi",
            model: "A4 2.0 TFSI",
            year: 2023,
            kilometers: 28000,
            fuel: "Benzină",
            power: 245,
            transmission: "Automată",
            price: 41200,
            monthly_rate: 580,
            featured: true,
            image_url: "/src/assets/audi-sports.jpg",
            description: "Audi A4 2.0 TFSI sportiv",
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            images: []
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCars();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary font-medium mb-4 tracking-wide uppercase">
              Recomandările noastre
            </p>
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
              Descoperă o selecție largă de vehicule disponibile
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fiecare autoturism din colecția noastră este verificat și certificat, 
              oferind garanția calității și a unui istoric transparent.
            </p>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-medium mb-4 tracking-wide uppercase">
            Recomandările noastre
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
            Descoperă o selecție largă de vehicule disponibile
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Fiecare autoturism din colecția noastră este verificat și certificat, 
            oferind garanția calității și a unui istoric transparent.
          </p>
        </div>

        {featuredCars.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Nu există mașini featured momentan</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {featuredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>

            <div className="text-center">
              <Button asChild variant="solar" size="lg" className="group">
                <a href="/masini-in-stoc">
                  Vezi toate mașinile
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedCars;