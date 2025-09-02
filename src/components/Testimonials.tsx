import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Maria Popescu",
      rating: 5,
      review: "Serviciu impecabil! Am găsit exact mașina pe care o căutam și toată procedura a fost foarte transparentă. Recomand cu încredere!",
      location: "București"
    },
    {
      id: 2,
      name: "Alexandru Ionescu",
      rating: 5,
      review: "Profesionalism la cel mai înalt nivel. Echipa m-a însoțit pe tot parcursul procesului și m-a sfătuit foarte bine în alegerea vehiculului.",
      location: "Cluj-Napoca"
    },
    {
      id: 3,
      name: "Ana Georgescu",
      rating: 5,
      review: "Am fost plăcut surprinsă de calitatea mașinii și de serviciile post-vânzare. Garanția oferită îmi dă o siguranță în plus.",
      location: "Timișoara"
    }
  ];

  const stats = [
    { number: "500+", label: "Mașini vândute" },
    { number: "20", label: "Ani de experiență" },
    { number: "2008", label: "Anul înființării" },
    { number: "100%", label: "Clienți mulțumiți" }
  ];

  const brands = [
    { name: "PORSCHE" },
    { name: "BMW" },
    { name: "AUDI" },
    { name: "MERCEDES" },
    { name: "DACIA" },
    { name: "VOLKSWAGEN" }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Solar gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-primary font-medium mb-4 tracking-wide uppercase">
            Feedback
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
            Ce spun clienții noștri?
          </h2>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-0 shadow-card bg-card">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary mb-4" />
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>

                {/* Review */}
                <p className="text-muted-foreground mb-6 italic">
                  "{testimonial.review}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-solar rounded-full flex items-center justify-center relative">
                    <div className="w-4 h-4 bg-primary-foreground rounded-full"></div>
                    <div className="absolute top-0 left-1/2 w-px h-2 bg-primary-foreground transform -translate-x-1/2 -translate-y-1"></div>
                    <div className="absolute right-0 top-1/2 w-2 h-px bg-primary-foreground transform -translate-y-1/2 translate-x-1"></div>
                    <div className="absolute bottom-0 left-1/2 w-px h-2 bg-primary-foreground transform -translate-x-1/2 translate-y-1"></div>
                    <div className="absolute left-0 top-1/2 w-2 h-px bg-primary-foreground transform -translate-y-1/2 -translate-x-1"></div>
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Popular Brands */}
        <div>
          <h3 className="text-xl font-bold text-center mb-8">Mărci auto populare</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {brands.map((brand, index) => (
              <div key={index} className="group relative">
                <div className="bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 hover:scale-105">
                  {/* Solar accent line */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Brand name with premium typography */}
                  <div className="font-bold text-lg tracking-wider text-foreground group-hover:text-primary transition-colors duration-300">
                    {brand.name}
                  </div>
                  
                  {/* Subtle sun icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-gradient-solar rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;