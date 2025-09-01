import CarCard from "./CarCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import bmwSedan from "@/assets/bmw-sedan.jpg";
import mercedesSuv from "@/assets/mercedes-suv.jpg";
import audiSports from "@/assets/audi-sports.jpg";

const FeaturedCars = () => {
  const featuredCars = [
    {
      id: 1,
      image: bmwSedan,
      brand: "BMW",
      model: "Seria 3 320d",
      year: 2022,
      kilometers: 45000,
      fuel: "Diesel",
      power: 190,
      transmission: "Automată",
      price: 32500,
      monthlyRate: 450,
      featured: true
    },
    {
      id: 2,
      image: mercedesSuv,
      brand: "Mercedes-Benz",
      model: "GLC 220d",
      year: 2021,
      kilometers: 52000,
      fuel: "Diesel",
      power: 194,
      transmission: "Automată",
      price: 38900,
      monthlyRate: 520
    },
    {
      id: 3,
      image: audiSports,
      brand: "Audi",
      model: "A4 2.0 TFSI",
      year: 2023,
      kilometers: 28000,
      fuel: "Benzină",
      power: 245,
      transmission: "Automată",
      price: 41200,
      monthlyRate: 580,
      featured: true
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
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

        {/* Car Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredCars.map((car) => (
            <CarCard key={car.id} {...car} />
          ))}
        </div>

        {/* CTA */}
        <Button variant="solar" size="lg" className="mx-auto hover:shadow-sunrise">
          Vezi toate mașinile
        </Button>
      </div>
    </section>
  );
};

export default FeaturedCars;