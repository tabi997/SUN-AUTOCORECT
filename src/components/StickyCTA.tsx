import { Button } from "@/components/ui/button";
import { Phone, Mail } from "lucide-react";
import { useContact } from "@/lib/contact-context";

interface StickyCTAProps {
  onContact?: () => void;
}

export function StickyCTA({ onContact }: StickyCTAProps) {
  const { contactInfo, loading } = useContact();
  
  const phoneNumber = contactInfo?.phone || "+40 21 123 4567";
  const email = contactInfo?.email || "contact@sunautocorrect.ro";
  const handlePhoneCall = () => {
    window.open(`tel:${phoneNumber}`);
  };

  const handleEmail = () => {
    window.open(`mailto:${email}`);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-t md:hidden">
      <div 
        className="mx-auto max-w-screen-md px-4 sm:px-6 py-3"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
      >
        <div className="flex items-center gap-3">
          <Button 
            className="flex-1 h-11 rounded-xl font-medium shadow-sm bg-primary text-primary-foreground"
            onClick={onContact || handleEmail}
          >
            Cere ofertă
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 rounded-xl border"
            onClick={handlePhoneCall}
            aria-label="Sună acum"
          >
            <Phone className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
