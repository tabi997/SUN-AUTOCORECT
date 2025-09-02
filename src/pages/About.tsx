import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, CheckCircle, Clock, Heart, MapPin, Phone, Mail, Users, Award, Shield, TrendingUp } from "lucide-react";

const About = () => {
  const companyStats = [
    { number: "15+", label: "Ani de experiență", icon: <Award className="h-6 w-6" /> },
    { number: "5000+", label: "Mașini vândute", icon: <Car className="h-6 w-6" /> },
    { number: "10000+", label: "Clienți mulțumiți", icon: <Heart className="h-6 w-6" /> },
    { number: "24/7", label: "Suport client", icon: <Clock className="h-6 w-6" /> }
  ];

  const values = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Încredere",
      description: "Construim relații de încredere cu clienții noștri prin transparență și profesionalism"
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Calitate",
      description: "Oferim doar mașini de calitate superioară, verificate de experții noștri"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Inovație",
      description: "Adoptăm cele mai noi tehnologii și practici din industria auto"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Orientare client",
      description: "Clientul nostru este în centrul tuturor deciziilor și acțiunilor noastre"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navigation />
      <div className="container mx-auto px-4 py-12 pt-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Despre SUN AUTOCORECT
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Suntem o companie românească cu peste 15 ani de experiență în industria auto, 
            dedicată să ofere clienților noștri cele mai bune servicii și mașini de calitate.
          </p>
        </div>

        {/* Company Stats */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {companyStats.map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-card border border-border">
                <div className="mx-auto mb-3 p-3 rounded-full bg-primary/10 text-primary w-fit">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold font-heading mb-6">Povestea noastră</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                SUN AUTOCORECT a fost înființată în anul 2009 de către Ion Popescu, un pasionat 
                al industriei auto cu peste 20 de ani de experiență în domeniu.
              </p>
              <p>
                Începând ca o mică afacere de familie, am crescut constant, învățând din fiecare 
                experiență și adaptându-ne la nevoile în schimbare ale clienților noștri.
              </p>
              <p>
                Astăzi, suntem recunoscuți ca unul dintre cei mai de încredere dealeri auto din 
                regiune, cu un portofoliu impresionant de mașini și o bază solidă de clienți mulțumiți.
              </p>
              <p>
                Misiunea noastră rămâne aceeași: să oferim clienților noștri mașini de calitate 
                superioară, servicii profesionale și o experiență de cumpărare transparentă și plăcută.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-2xl bg-muted flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Car className="h-16 w-16 mx-auto mb-4" />
                <p>Imagine cu echipa noastră</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold font-heading text-center mb-12">Valorile noastre</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 text-primary w-fit">
                    {value.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold font-heading text-center mb-12">Contactează-ne</h2>
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-6">Informații de contact</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Adresa</p>
                    <p className="text-sm text-muted-foreground">
                      Strada Exemplului, Nr. 123<br />
                      Sector 1, București, România
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Telefon</p>
                    <p className="text-sm text-muted-foreground">+40 21 123 4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">contact@sunautocorrect.ro</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6">Program de funcționare</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Luni - Vineri:</span>
                  <span className="font-medium">09:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sâmbătă:</span>
                  <span className="font-medium">09:00 - 16:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Duminică:</span>
                  <span className="font-medium">Închis</span>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm text-primary font-medium">
                  Pentru programări în afara programului normal, ne poți contacta telefonic 
                  sau prin email și vom găsi o soluție potrivită.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold font-heading mb-4">Vrei să ne cunoști mai bine?</h2>
          <p className="text-muted-foreground mb-6">
            Programează o vizită la showroom-ul nostru sau contactează-ne pentru orice întrebări
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              <MapPin className="h-5 w-5 mr-2" />
              Programează o vizită
            </Button>
            <Button variant="outline" size="lg">
              <Phone className="h-5 w-5 mr-2" />
              Sună-ne acum
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
