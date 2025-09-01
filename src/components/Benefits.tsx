import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, RefreshCw, Users, ArrowRight } from "lucide-react";

const Benefits = () => {
  const benefits = [
    {
      icon: Shield,
      title: "Verificare completă",
      description: "Fiecare vehicul trece prin 387 de puncte de control pentru a asigura calitatea maximă."
    },
    {
      icon: CheckCircle,
      title: "Garanție extinsă",
      description: "Oferim garanție de minimum 12 luni la toate vehiculele din stoc."
    },
    {
      icon: RefreshCw,
      title: "Program Buy-Back",
      description: "Posibilitatea de a vinde înapoi vehiculul în primii 2 ani cu condiții avantajoase."
    },
    {
      icon: Users,
      title: "Suport complet",
      description: "Echipa noastră de specialiști te însoțește pe tot parcursul procesului."
    }
  ];

  const certifications = [
    { name: "DEKRA", logo: "🛡️" },
    { name: "CEBIA", logo: "📋" },
    { name: "AutoCheck", logo: "✅" }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <p className="text-primary font-medium mb-4 tracking-wide uppercase">
              De ce să ne alegi pe noi?
            </p>
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
              Finanțare avantajoasă
            </h2>
            <p className="text-muted-foreground mb-8">
              Oferim soluții complete de finanțare prin partenerii noștri financiari. 
              Avantaje exclusive pentru clienții noștri cu rate începând de la 0% dobândă 
              pentru perioade limitate și fără avans inițial.
            </p>

            {/* Benefits List */}
            <div className="space-y-6 mb-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Certifications */}
            <div className="mb-8">
              <p className="text-sm text-muted-foreground mb-4">Certificări și parteneriate:</p>
              <div className="flex items-center gap-6">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-2xl">{cert.logo}</span>
                    <span className="font-medium">{cert.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Button variant="premium" size="lg" className="group">
              Solicită finanțare
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Visual */}
          <div className="bg-gradient-card rounded-2xl p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl font-bold text-primary mb-2">0%</div>
              <p className="text-xl font-semibold">Dobândă pe primele 6 luni</p>
              <p className="text-muted-foreground">pentru vehicule selectate</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-background/50 rounded-xl p-4">
                <div className="text-2xl font-bold text-accent">24-84</div>
                <div className="text-sm text-muted-foreground">luni perioada</div>
              </div>
              <div className="bg-background/50 rounded-xl p-4">
                <div className="text-2xl font-bold text-accent">Fără</div>
                <div className="text-sm text-muted-foreground">avans inițial</div>
              </div>
            </div>

            <Badge className="bg-gradient-premium mb-4">
              Ofertă limitată
            </Badge>
            
            <p className="text-sm text-muted-foreground">
              *Oferta este valabilă pentru vehiculele marcate corespunzător și este supusă aprobării financiare.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;