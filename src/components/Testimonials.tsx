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
    { number: "387+", label: "Mașini în stoc" },
    { number: "5", label: "Ani de experiență" },
    { number: "2022", label: "Anul înființării" },
    { number: "100%", label: "Clienți mulțumiți" }
  ];

  const brands = [
    { name: "BMW", icon: "🚗" },
    { name: "Audi", icon: "🚙" },
    { name: "Mercedes", icon: "🚐" },
    { name: "Volkswagen", icon: "🚕" },
    { name: "Toyota", icon: "🚖" },
    { name: "Hyundai", icon: "🚓" }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
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
                  <div className="w-10 h-10 bg-gradient-premium rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">
                      {testimonial.name.charAt(0)}
                    </span>
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
          <div className="flex flex-wrap justify-center items-center gap-8">
            {brands.map((brand, index) => (
              <div key={index} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <span className="text-2xl">{brand.icon}</span>
                <span className="font-medium">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;