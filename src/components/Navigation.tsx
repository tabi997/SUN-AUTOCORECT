import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, User, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Acasă", href: "/" },
    { label: "Mașini în Stoc", href: "/masini-in-stoc" },
    { label: "Vinde mașina", href: "/vinde-masina" },
    { label: "Despre noi", href: "/despre-noi" },
    { label: "Contact", href: "/contact" },
  ];

  const phoneNumber = "+40 745 123 456"; // Placeholder for the phone number

  const handlePhoneClick = () => {
    window.location.href = `tel:${phoneNumber.replace(/\s/g, "")}`;
  };

  // Scroll to top when location changes (including refresh)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-solar rounded-full flex items-center justify-center relative">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-primary-foreground rounded-full"></div>
              <div className="absolute top-0 left-1/2 w-px h-1.5 sm:h-2 bg-primary-foreground transform -translate-x-1/2 -translate-y-1"></div>
              <div className="absolute top-1 right-1 w-px h-1 sm:h-1.5 bg-primary-foreground transform rotate-45"></div>
              <div className="absolute right-0 top-1/2 w-1.5 sm:w-2 h-px bg-primary-foreground transform -translate-y-1/2 translate-x-1"></div>
              <div className="absolute bottom-1 right-1 w-px h-1 sm:h-1.5 bg-primary-foreground transform -rotate-45"></div>
              <div className="absolute bottom-0 left-1/2 w-px h-1.5 sm:h-2 bg-primary-foreground transform -translate-x-1/2 translate-y-1"></div>
              <div className="absolute bottom-1 left-1 w-px h-1 sm:h-1.5 bg-primary-foreground transform rotate-45"></div>
              <div className="absolute left-0 top-1/2 w-1.5 sm:w-2 h-px bg-primary-foreground transform -translate-y-1/2 -translate-x-1"></div>
              <div className="absolute top-1 left-1 w-px h-1 sm:h-1.5 bg-primary-foreground transform -rotate-45"></div>
            </div>
            <span className="text-lg sm:text-xl font-bold font-heading">SUN AUTOCORECT</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-foreground hover:text-primary transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              onClick={handlePhoneClick}
              className="flex items-center gap-2 text-primary hover:text-primary/80"
            >
              <Phone className="h-4 w-4" />
              <span className="font-medium">{phoneNumber}</span>
            </Button>
            <Link to="/login">
              <Button variant="outline">
                <User className="h-4 w-4 mr-2" />
                Autentificare
              </Button>
            </Link>
            <Button variant="solar">Înregistrare</Button>
          </div>

          {/* Tablet Actions - Show phone button on medium screens */}
          <div className="hidden md:flex lg:hidden items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handlePhoneClick}
              className="text-primary hover:text-primary/80"
            >
              <Phone className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isMenuOpen ? "max-h-96 pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col space-y-3 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-foreground hover:text-primary transition-colors duration-300 py-3 px-2 rounded-lg hover:bg-muted/50"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col space-y-3 pt-4 border-t border-border">
              <Button 
                variant="ghost" 
                onClick={handlePhoneClick}
                className="justify-start w-full text-primary hover:text-primary/80 py-3 h-auto"
              >
                <Phone className="h-4 w-4 mr-3" />
                <span className="text-base">{phoneNumber}</span>
              </Button>
              <div className="flex flex-col space-y-2">
                <Link to="/login" className="w-full">
                  <Button variant="outline" className="justify-start w-full py-3 h-auto">
                    <User className="h-4 w-4 mr-3" />
                    <span className="text-base">Autentificare</span>
                  </Button>
                </Link>
                <Button variant="solar" className="py-3 h-auto">
                  <span className="text-base">Înregistrare</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;