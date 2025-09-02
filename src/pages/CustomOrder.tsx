import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Car, CheckCircle, Clock, Euro, Settings, Truck, Shield, Star, Users, Award, Zap } from "lucide-react";

const CustomOrder = () => {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    fuel: "",
    transmission: "",
    budget: "",
    timeline: "",
    requirements: "",
    contactName: "",
    contactEmail: "",
    contactPhone: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log("Form submitted:", formData);
  };

  const benefits = [
    {
      icon: <Car className="h-6 w-6" />,
      title: "Mașini noi și SH premium",
      description: "Acces exclusiv la modelele cele mai noi și mașini second-hand verificate"
    },
    {
      icon: <Euro className="h-6 w-6" />,
      title: "Prețuri competitive garantate",
      description: "Negociem direct cu dealerii pentru cele mai bune prețuri"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Garantie și verificare",
      description: "Toate mașinile sunt verificate și au garanție"
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Livrare la ușă",
      description: "Îți aducem mașina direct la tine, oriunde în România"
    }
  ];

  const steps = [
    {
      step: 1,
      title: "Cerere personalizată",
      description: "Completează formularul cu cerințele tale specifice",
      icon: <Calendar className="h-5 w-5" />
    },
    {
      step: 2,
      title: "Consultare expert",
      description: "Echipa noastră analizează cerințele și găsește opțiunile potrivite",
      icon: <Users className="h-5 w-5" />
    },
    {
      step: 3,
      title: "Propunere personalizată",
      description: "Primești opțiunile cu prețuri, termene și garanții",
      icon: <Euro className="h-5 w-5" />
    },
    {
      step: 4,
      title: "Comandă și confirmare",
      description: "Confirmi comanda și începem procesul de achiziție",
      icon: <CheckCircle className="h-5 w-5" />
    },
    {
      step: 5,
      title: "Livrare și predare",
      description: "Îți livrăm mașina în termenul stabilit cu documentele complete",
      icon: <Truck className="h-5 w-5" />
    }
  ];

  const trustSignals = [
    {
      icon: <Award className="h-8 w-8" />,
      title: "15+ ani experiență",
      description: "Pe piața auto românească"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "5000+ clienți mulțumiți",
      description: "Referințe verificate"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "100% siguranță",
      description: "Proces transparent și protejat"
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "4.9/5 rating",
      description: "Pe platformele de review"
    }
  ];

  const popularBrands = [
    "BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Skoda", "Renault", 
    "Dacia", "Ford", "Opel", "Toyota", "Honda", "Nissan", "Hyundai", "Kia"
  ];

  const popularModels = [
    "SUV: X5, GLE, Q7, Touareg, Kodiaq", 
    "Sedan: 3 Series, C-Class, A4, Passat, Octavia",
    "Break: 5 Series, E-Class, A6, Superb, Mondeo",
    "Hatchback: 1 Series, A-Class, A3, Golf, Fabia"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Zap className="h-4 w-4 mr-2" />
            Serviciu Premium
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Mașină la Comandă Personalizată
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Nu ai găsit mașina perfectă în stocul nostru? Comandă exact ce vrei și o găsim pentru tine în maxim 30 de zile!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              Răspuns în 24h
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              Garanție inclusă
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Euro className="h-4 w-4 mr-2" />
              Preț negociat
            </Badge>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustSignals.map((signal, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-3 p-3 rounded-full bg-primary/10 text-primary w-fit">
                  {signal.icon}
                </div>
                <h3 className="font-semibold mb-1">{signal.title}</h3>
                <p className="text-sm text-muted-foreground">{signal.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Benefits */}
          <div>
            <h2 className="text-2xl font-bold font-heading mb-6">De ce să comanzi o mașină personalizată?</h2>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border hover:shadow-md transition-shadow">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Process Steps */}
          <div>
            <h2 className="text-2xl font-bold font-heading mb-6">Cum funcționează procesul?</h2>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {step.icon}
                      <h3 className="font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Options */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold font-heading text-center mb-8">Opțiuni populare</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Mărci populare
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularBrands.map((brand, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      {brand}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Modele populare
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {popularModels.map((model, index) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      {model}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Form Section */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 w-fit mx-auto">
              <Clock className="h-4 w-4 mr-2" />
              Răspuns în 24h
            </Badge>
            <CardTitle className="text-2xl">Completează cererea ta personalizată</CardTitle>
            <CardDescription>
              Spune-ne exact ce vrei și vom găsi mașina perfectă pentru tine în maxim 30 de zile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Marca preferată *</label>
                  <Input
                    placeholder="ex: BMW, Mercedes, Audi..."
                    value={formData.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Modelul *</label>
                  <Input
                    placeholder="ex: X5, C-Class, Q7..."
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Anul de fabricație</label>
                  <Select value={formData.year} onValueChange={(value) => handleInputChange("year", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează anul" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Orice an</SelectItem>
                      {Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Combustibil</label>
                  <Select value={formData.fuel} onValueChange={(value) => handleInputChange("fuel", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează combustibilul" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Orice combustibil</SelectItem>
                      <SelectItem value="Benzină">Benzină</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Hibrid">Hibrid</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="GPL">GPL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Transmisie</label>
                  <Select value={formData.transmission} onValueChange={(value) => handleInputChange("transmission", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează transmisia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Orice transmisie</SelectItem>
                      <SelectItem value="Manuală">Manuală</SelectItem>
                      <SelectItem value="Automată">Automată</SelectItem>
                      <SelectItem value="CVT">CVT</SelectItem>
                      <SelectItem value="Semi-automată">Semi-automată</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bugetul maxim (€) *</label>
                  <Input
                    type="number"
                    placeholder="ex: 25000"
                    value={formData.budget}
                    onChange={(e) => handleInputChange("budget", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Termenul dorit *</label>
                  <Select value={formData.timeline} onValueChange={(value) => handleInputChange("timeline", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează termenul" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Urgent (1-2 săptămâni)</SelectItem>
                      <SelectItem value="1-2 luni">1-2 luni</SelectItem>
                      <SelectItem value="3-4 luni">3-4 luni</SelectItem>
                      <SelectItem value="5-6 luni">5-6 luni</SelectItem>
                      <SelectItem value="6+ luni">6+ luni</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Cerințe specifice</label>
                <Textarea
                  placeholder="Descrie cerințele tale specifice: opțiunile dorite, culoarea preferată, dotări speciale, istoricul de întreținere dorit, etc."
                  rows={4}
                  value={formData.requirements}
                  onChange={(e) => handleInputChange("requirements", e.target.value)}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Numele tău *</label>
                  <Input
                    placeholder="Numele complet"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange("contactName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email *</label>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Telefon *</label>
                  <Input
                    placeholder="+40 123 456 789"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <Button type="submit" size="lg" className="px-8">
                  <Clock className="h-5 w-5 mr-2" />
                  Trimite cererea personalizată
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold font-heading mb-4">Ai întrebări sau vrei să discuți?</h2>
          <p className="text-muted-foreground mb-6">
            Echipa noastră de experți este aici să te ajute să găsești mașina perfectă
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Programează o consultație gratuită
            </Button>
            <Button>
              <Car className="h-4 w-4 mr-2" />
              Vezi mașinile în stoc
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomOrder;
