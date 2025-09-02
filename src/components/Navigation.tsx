import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Acasă", href: "/" },
    { label: "Mașini în Stoc", href: "/masini-in-stoc" },
    { label: "Vinde mașina", href: "/vinde-masina" },
    { label: "Despre noi", href: "/despre-noi" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-solar rounded-full flex items-center justify-center relative">
              <div className="w-4 h-4 bg-primary-foreground rounded-full"></div>
              <div className="absolute top-0 left-1/2 w-px h-2 bg-primary-foreground transform -translate-x-1/2 -translate-y-1"></div>
              <div className="absolute top-1 right-1 w-px h-1.5 bg-primary-foreground transform rotate-45"></div>
              <div className="absolute right-0 top-1/2 w-2 h-px bg-primary-foreground transform -translate-y-1/2 translate-x-1"></div>
              <div className="absolute bottom-1 right-1 w-px h-1.5 bg-primary-foreground transform -rotate-45"></div>
              <div className="absolute bottom-0 left-1/2 w-px h-2 bg-primary-foreground transform -translate-x-1/2 translate-y-1"></div>
              <div className="absolute bottom-1 left-1 w-px h-1.5 bg-primary-foreground transform rotate-45"></div>
              <div className="absolute left-0 top-1/2 w-2 h-px bg-primary-foreground transform -translate-y-1/2 -translate-x-1"></div>
              <div className="absolute top-1 left-1 w-px h-1.5 bg-primary-foreground transform -rotate-45"></div>
            </div>
            <span className="text-xl font-bold font-heading">SUN AUTOCORECT</span>
          </div>

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
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Link to="/login">
              <Button variant="outline">
                <User className="h-4 w-4 mr-2" />
                Autentificare
              </Button>
            </Link>
            <Button variant="solar">Înregistrare</Button>
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
            isMenuOpen ? "max-h-80 pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col space-y-3 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-foreground hover:text-primary transition-colors duration-300 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-4 border-t border-border">
              <Link to="/login">
                <Button variant="outline" className="justify-start w-full">
                  <User className="h-4 w-4 mr-2" />
                  Autentificare
                </Button>
              </Link>
              <Button variant="solar">Înregistrare</Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;