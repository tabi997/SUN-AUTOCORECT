import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-sunrise-road.jpg";

const Hero = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleViewAllCars = () => {
    navigate("/masini-in-stoc");
  };

  const handleSellCar = () => {
    navigate("/vinde-masina");
  };

  const handleSearch = () => {
    // Navighează către pagina de stoc cu query-ul de căutare
    if (searchQuery.trim()) {
      navigate(`/masini-in-stoc?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/masini-in-stoc");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      {/* Search Form - Imediat după navbar */}
      <div className="w-full bg-background/20 backdrop-blur-sm border-b border-white/20 shadow-lg pt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
              <Input
                placeholder="Caută după marcă, model sau descriere..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 pr-4 py-3 text-lg h-12 bg-white/10 border-white/30 text-white placeholder:text-white/70 focus:bg-white/20 focus:border-white/50 w-full"
              />
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <Button 
                variant="solar" 
                size="lg" 
                onClick={handleSearch}
                className="hover:shadow-sunrise flex-1 lg:flex-none"
              >
                <Search className="h-4 w-4 mr-2" />
                Caută mașini
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleViewAllCars}
                className="flex-1 lg:flex-none"
              >
                Vezi toate mașinile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Urban sunrise over road - SUN AUTOCORECT"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/30" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">

          {/* Hero Text */}
          <div className="mb-12 text-center lg:text-left -mt-24">
            <p className="text-primary font-medium mb-4 tracking-wide uppercase">
              Transparență și Încredere
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading mb-6 leading-tight">
              Mașini rulate{" "}
              <span className="bg-gradient-sunrise bg-clip-text text-transparent">
                luminate
              </span>{" "}
              de încredere
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Alege transparența sub soarele SUN AUTOCORECT. Fiecare vehicul este verificat cu atenție,
              oferind claritatea unei zile senine în fiecare tranzacție.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4 mt-8">
            <Button variant="outline" size="lg" onClick={handleSellCar}>
              Vinde mașina ta
            </Button>
          </div>


        </div>
      </div>

      {/* Stats */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex items-center space-x-8 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">500+</div>
            <div className="text-sm text-muted-foreground">Mașini vândute</div>
          </div>
          <div className="w-px h-12 bg-border"></div>
          <div>
            <div className="text-2xl font-bold text-primary">2008</div>
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
    </>
  );
};

export default Hero;