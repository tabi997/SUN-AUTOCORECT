import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowUp, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useContact } from "@/lib/contact-context";

const FloatingButtons = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();
  const { contactInfo } = useContact();

  const phoneNumber = contactInfo?.phone || "+40 745 123 456";
  const whatsappNumber = phoneNumber.replace(/\s/g, "");

  const handleWhatsAppClick = () => {
    const message = "Bună! Am o întrebare despre mașinile voastre.";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleContactClick = () => {
    navigate('/contact');
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-4 hidden md:flex">
      {/* Contact Button - Enhanced with solar theme */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-accent/40 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
        <Button
          onClick={handleContactClick}
          size="lg"
          className="relative h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent hover:from-primary-dark hover:to-accent-dark shadow-2xl hover:shadow-primary/25 transition-all duration-500 hover:scale-110 border-2 border-primary/20"
          title="Pagina de contact"
        >
          <Mail className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* WhatsApp Button - Enhanced with solar theme */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
        <Button
          onClick={handleWhatsAppClick}
          size="lg"
          className="relative h-14 w-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-2xl hover:shadow-green-500/25 transition-all duration-500 hover:scale-110 border-2 border-green-400/20"
          title="Contactează-ne pe WhatsApp"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Scroll to Top Button - Enhanced with solar theme */}
      <Button
        onClick={handleScrollToTop}
        size="lg"
        variant="outline"
        className={cn(
          "relative h-14 w-14 rounded-full bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md border-2 border-yellow-500/30 shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 hover:scale-110 group",
          showScrollTop 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
        title="Scroll to top"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-full blur-sm group-hover:blur-md transition-all duration-500"></div>
        <ArrowUp className="h-6 w-6 text-yellow-400 relative z-10 group-hover:text-yellow-300 transition-colors duration-300" />
      </Button>
    </div>
  );
};

export default FloatingButtons;
