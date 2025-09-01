import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { label: "Acasă", href: "#" },
    { label: "Mașini în stoc", href: "#stock" },
    { label: "Finanțare", href: "#financing" },
    { label: "Despre noi", href: "#about" },
  ];

  const services = [
    { label: "Vânzare vehicule", href: "#" },
    { label: "Buy-back program", href: "#" },
    { label: "Test drive", href: "#" },
    { label: "Service auto", href: "#" },
  ];

  const legalLinks = [
    { label: "Politica de confidențialitate", href: "#" },
    { label: "Termeni și condiții", href: "#" },
    { label: "GDPR", href: "#" },
    { label: "Cookies", href: "#" },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4">
        {/* Main Footer */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-premium rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">P</span>
                </div>
                <span className="text-xl font-bold font-heading">PremiumAuto</span>
              </div>
              
              <p className="text-muted-foreground mb-6">
                Specialiști în vânzarea de vehicule second-hand premium. 
                Oferim transparență, calitate și servicii complete.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>+40 721 234 567</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>office@premiumauto.ro</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-primary mt-0.5" />
                  <span>Strada Principală 123<br />București, România</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Lun-Vin: 9:00-18:00</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-6">Link-uri rapide</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold mb-6">Servicii</h3>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index}>
                    <a 
                      href={service.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      {service.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-semibold mb-6">Newsletter</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Abonează-te pentru a primi cele mai noi oferte și vehicule disponibile.
              </p>
              
              <div className="flex gap-2 mb-4">
                <Input 
                  placeholder="Email-ul tău"
                  className="flex-1"
                />
                <Button variant="premium">
                  Abonează-te
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mb-6">
                Prin abonare, accepți termenii și condițiile noastre.
              </p>

              {/* Social Media */}
              <div className="flex gap-3">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-sm text-muted-foreground">
              © 2024 PremiumAuto. Toate drepturile rezervate.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap gap-6">
              {legalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;