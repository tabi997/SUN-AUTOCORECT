import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Car, Zap, Settings } from "lucide-react";
import heroImage from "@/assets/hero-showroom.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Premium Auto Showroom"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/30" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          {/* Hero Text */}
          <div className="mb-12 text-center lg:text-left">
            <p className="text-primary font-medium mb-4 tracking-wide uppercase">
              Premium Second Hand
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading mb-6 leading-tight">
              Mașini rulate alese cu{" "}
              <span className="bg-gradient-premium bg-clip-text text-transparent">
                grijă
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Fiecare autoturism este meticulos testat, verificat și certificat de experți.
              Descoperă colecția noastră exclusivă de vehicule premium cu istoric complet de service.
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-card/95 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-card">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Select>
                <SelectTrigger className="h-12">
                  <Car className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Marcă" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="audi">Audi</SelectItem>
                  <SelectItem value="bmw">BMW</SelectItem>
                  <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                  <SelectItem value="volkswagen">Volkswagen</SelectItem>
                  <SelectItem value="toyota">Toyota</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="h-12">
                  <Settings className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4</SelectItem>
                  <SelectItem value="320d">320d</SelectItem>
                  <SelectItem value="c-class">C-Class</SelectItem>
                  <SelectItem value="passat">Passat</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="An" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2020">2020</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="h-12">
                  <Zap className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Combustibil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="benzina">Benzină</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="premium" size="lg" className="h-12">
                <Search className="h-4 w-4 mr-2" />
                Caută
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4 mt-8">
            <Button variant="accent" size="lg">
              Vezi toate mașinile
            </Button>
            <Button variant="outline" size="lg">
              Vinde mașina ta
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex items-center space-x-8 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">387+</div>
            <div className="text-sm text-muted-foreground">Mașini în stoc</div>
          </div>
          <div className="w-px h-12 bg-border"></div>
          <div>
            <div className="text-2xl font-bold text-primary">2022</div>
            <div className="text-sm text-muted-foreground">Anul înființării</div>
          </div>
          <div className="w-px h-12 bg-border"></div>
          <div>
            <div className="text-2xl font-bold text-primary">100%</div>
            <div className="text-sm text-muted-foreground">Verificate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;