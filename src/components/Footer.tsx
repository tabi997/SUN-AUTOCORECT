import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin, Shield, FileText, Cookie, UserCheck, Sun } from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { label: "Acasă", href: "#" },
    { label: "Mașini în stoc", href: "#stock" },
    { label: "Despre noi", href: "#about" },
  ];

  const services = [
    { label: "Buy-back program", href: "/vinde-masina" },
    { label: "Test drive", href: "#" },
  ];

  const legalLinks = [
    { label: "Politica de confidențialitate", href: "/politica-confidentialitate", icon: Shield },
    { label: "Termeni și condiții", href: "/termeni-conditii", icon: FileText },
    { label: "Politica cookies", href: "/politica-cookies", icon: Cookie },
    { label: "GDPR", href: "/gdpr", icon: UserCheck },
  ];

  const handleANPCForm = () => {
    window.open('https://anpc.ro/ce-este-sal/', '_blank');
  };

  return (
    <footer className="bg-card border-t border-border relative overflow-hidden">
      {/* Enhanced solar gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      
      {/* Floating solar elements */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-solar rounded-full opacity-5 blur-xl"></div>
      <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-gradient-sunrise rounded-full opacity-5 blur-xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content - Compact with ANPC in center */}
        <div className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Company Info - Takes 2 columns */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-solar rounded-full flex items-center justify-center relative shadow-lg">
                  <Sun className="w-5 h-5 text-primary-foreground" />
                  <div className="absolute inset-0 bg-gradient-solar rounded-full opacity-20 animate-pulse"></div>
                </div>
                <span className="text-lg font-bold font-heading bg-gradient-sunrise bg-clip-text text-transparent">
                  SUN AUTOCORECT
                </span>
              </div>
              
              <p className="text-muted-foreground mb-3 leading-relaxed text-xs">
                Transparența soarelui în fiecare vehicul second-hand premium. 
                Oferim claritate, încredere și energia pozitivă în fiecare tranzacție.
              </p>

              {/* Contact Info - Compact */}
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <Phone className="h-3 w-3 text-primary flex-shrink-0" />
                  <span>+40 721 234 567</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Mail className="h-3 w-3 text-primary flex-shrink-0" />
                  <span>office@sunautocorect.ro</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <MapPin className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                  <span>Strada Principală 123, București</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="h-3 w-3 text-primary flex-shrink-0" />
                  <span>Lun-Vin: 9:00-18:00</span>
                </div>
              </div>
            </div>

            {/* Quick Links & Services - Combined */}
            <div>
              <h3 className="font-semibold mb-3 text-foreground flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-gradient-solar rounded-full"></div>
                Navigare & Servicii
              </h3>
              <ul className="space-y-1">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-300 text-xs flex items-center gap-2 group"
                    >
                      <div className="w-1 h-1 bg-muted-foreground rounded-full group-hover:bg-primary transition-colors"></div>
                      {link.label}
                    </a>
                  </li>
                ))}
                {services.map((service, index) => (
                  <li key={`service-${index}`}>
                    <a 
                      href={service.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-300 text-xs flex items-center gap-2 group"
                    >
                      <div className="w-1 h-1 bg-muted-foreground rounded-full group-hover:bg-primary transition-colors"></div>
                      {service.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-semibold mb-3 text-foreground flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-gradient-solar rounded-full"></div>
                Newsletter
              </h3>
              <p className="text-muted-foreground text-xs mb-2 leading-relaxed">
                Abonează-te pentru oferte și vehicule noi.
              </p>
              
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Email-ul tău"
                    className="flex-1 text-xs h-8"
                  />
                  <Button variant="solar" size="sm" className="h-8 px-3 text-xs">
                    Abonează-te
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Prin abonare, accepți termenii și condițiile noastre.
                </p>

                {/* Social Media - Compact */}
                <div className="flex gap-1 pt-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gradient-solar hover:text-primary-foreground transition-all duration-300">
                    <Facebook className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gradient-solar hover:text-primary-foreground transition-all duration-300">
                    <Instagram className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gradient-solar hover:text-primary-foreground transition-all duration-300">
                    <Linkedin className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Legal Links - Compact */}
            <div>
              <h3 className="font-semibold mb-3 text-foreground flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-gradient-solar rounded-full"></div>
                Legal
              </h3>
              
              <div className="space-y-1">
                {legalLinks.map((link, index) => {
                  const IconComponent = link.icon;
                  return (
                    <a 
                      key={index}
                      href={link.href}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 text-xs group"
                    >
                      <IconComponent className="h-3 w-3 group-hover:scale-110 transition-transform" />
                      <span>{link.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ANPC Section - Moved to center below main content */}
          <div className="mt-4 pt-3 border-t border-border/50">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
              {/* ANPC Info */}
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <h3 className="font-semibold mb-2 text-foreground flex items-center justify-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-gradient-solar rounded-full"></div>
                    ANPC
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
                    Respectăm drepturile consumatorilor conform legislației române.
                  </p>
                </div>
                
                {/* ANPC Logo */}
                <div className="flex justify-center">
                  <img 
                    src="https://anpc.ro/wp-content/uploads/brizy/imgs/wp-7af89f9c287bc8c5cecef1fdd442bffc-370x174x0x0x370x174x1701197532.png"
                    alt="ANPC - Autoritatea Națională pentru Protecția Consumatorilor"
                    className="h-10 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Compact */}
        <div className="border-t border-border py-3 relative">
          {/* Enhanced solar rays effect */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
            <div className="w-12 h-6 bg-gradient-sunrise rounded-t-full opacity-20"></div>
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-gradient-sunrise rounded-t-full opacity-30"></div>
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-gradient-sunrise rounded-t-full opacity-40"></div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="text-center md:text-left">
              <p className="text-muted-foreground text-xs">
                © 2024 SUN AUTOCORECT. Toate drepturile rezervate.
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-xs">
                <span className="bg-gradient-sunrise bg-clip-text text-transparent font-medium">
                  Transparența soarelui în fiecare tranzacție
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;