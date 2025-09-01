import { Badge } from "@/components/ui/badge";
import { Shield, Award, Star, Users } from "lucide-react";

const Benefits = () => {
  const benefits = [
    {
      title: "Transparență Solară",
      description: "Verificări complete ca lumina zilei - fiecare detaliu este clarificat pentru încrederea ta totală.",
      icon: Shield
    },
    {
      title: "Garanție ca o Zi Senină",
      description: "Garanție extinsă care îți oferă liniștea unei zile perfecte - fără griji, doar bucuria condusului.",
      icon: Award
    },
    {
      title: "Energie Pozitivă",
      description: "Echipa noastră luminează fiecare pas al procesului, oferind căldura unui serviciu de încredere.",
      icon: Star,
    },
    {
      title: "Raze de Profesionalism",
      description: "Specialiști care radiază experiența și pasiunea pentru vehicule de calitate superioară.",
      icon: Users
    }
  ];

  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Solar separator elements */}
      <div className="absolute top-10 left-10 w-8 h-8 rounded-full bg-gradient-solar opacity-20"></div>
      <div className="absolute top-32 right-20 w-6 h-6 rounded-full bg-gradient-solar opacity-30"></div>
      <div className="absolute bottom-20 left-1/4 w-4 h-4 rounded-full bg-gradient-solar opacity-25"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            De ce să alegi <span className="bg-gradient-sunrise bg-clip-text text-transparent">SUN AUTOCORECT</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transparența ca lumina soarelui în fiecare tranzacție - liniștea unei zile senine
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-card border border-border rounded-2xl p-8 hover:shadow-sunrise transition-all duration-300 hover:scale-105 relative overflow-hidden"
            >
              {/* Circular solar element behind card */}
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-solar opacity-10"></div>
              <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-6 relative z-10">
                <benefit.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-heading mb-4">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;