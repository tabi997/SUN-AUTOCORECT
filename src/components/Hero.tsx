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
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col gap-4 items-center">
            <div className="relative w-full max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-4 w-4 sm:h-5 sm:w-5" />
              <Input
                placeholder="Caută după marcă, model sau descriere..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 pr-4 py-3 text-base sm:text-lg h-11 sm:h-12 bg-white/10 border-white/30 text-white placeholder:text-white/70 focus:bg-white/20 focus:border-white/50 w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl">
              <Button 
                variant="solar" 
                size="lg" 
                onClick={handleSearch}
                className="hover:shadow-sunrise w-full sm:flex-1"
              >
                <Search className="h-4 w-4 mr-2" />
                Caută mașini
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleViewAllCars}
                className="w-full sm:flex-1"
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
          <div className="mb-8 sm:mb-12 text-center lg:text-left -mt-16 sm:-mt-24">
            <p className="text-primary font-medium mb-3 sm:mb-4 tracking-wide uppercase text-sm sm:text-base">
              Transparență și Încredere
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold font-heading mb-4 sm:mb-6 leading-tight">
              Mașini rulate{" "}
              <span className="bg-gradient-sunrise bg-clip-text text-transparent">
                luminate
              </span>{" "}
              de încredere
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0">
              Alege transparența sub soarele SUN AUTOCORECT. Fiecare vehicul este verificat cu atenție,
              oferind claritatea unei zile senine în fiecare tranzacție.
            </p>
          </div>




        </div>
      </div>

      {/* Stats */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex items-center space-x-4 sm:space-x-8 text-center">
          <div>
            <div className="text-xl sm:text-2xl font-bold text-primary">500+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Mașini vândute</div>
          </div>
          <div className="w-px h-8 sm:h-12 bg-border"></div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-primary">2008</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Anul înființării</div>
          </div>
          <div className="w-px h-8 sm:h-12 bg-border"></div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-primary">100%</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Verificate</div>
          </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;