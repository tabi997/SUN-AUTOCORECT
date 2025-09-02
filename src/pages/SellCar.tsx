import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, CheckCircle, Clock, Euro, FileText, Handshake, Shield, TrendingUp, Star, Users, Award, Zap, MapPin, Phone, Mail } from "lucide-react";

const SellCar = () => {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    kilometers: "",
    fuel: "",
    transmission: "",
    condition: "",
    price: "",
    description: "",
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
      icon: <Euro className="h-6 w-6" />,
      title: "Preț corect garantat",
      description: "Evaluare profesională și preț de piață negociat"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Vânzare rapidă",
      description: "Găsim cumpărătorul potrivit în maxim 30 zile"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Siguranță completă",
      description: "Proces transparent și protejat legal"
    },
    {
      icon: <Handshake className="h-6 w-6" />,
      title: "Suport complet",
      description: "Te ajutăm cu toate formalitățile"
    }
  ];

  const sellingProcess = [
    {
      step: 1,
      title: "Evaluare gratuită",
      description: "Vizităm mașina și facem o evaluare profesională detaliată",
      icon: <FileText className="h-5 w-5" />
    },
    {
      step: 2,
      title: "Ofertă fermă",
      description: "Primești o ofertă fermă în maxim 24h cu prețul final",
      icon: <Euro className="h-5 w-5" />
    },
    {
      step: 3,
      title: "Acceptare și verificare",
      description: "Dacă ești mulțumit, verificăm mașina și documentele",
      icon: <CheckCircle className="h-5 w-5" />
    },
    {
      step: 4,
      title: "Finalizare rapidă",
      description: "Semnăm contractul și transferăm banii în aceeași zi",
      icon: <Handshake className="h-5 w-5" />
    }
  ];

  const carConditions = [
    "Excelentă - ca nouă, fără defecte",
    "Foarte bună - uzură minimă, întreținută regulat",
    "Bună - uzură normală pentru vârsta mașinii",
    "Acceptabilă - uzură moderată, necesită atenție",
    "Necesită reparații - defecte minore de repara"
  ];

  const trustSignals = [
    {
      icon: <Award className="h-8 w-8" />,
      title: "15+ ani experiență",
      description: "Pe piața auto românească"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "3000+ mașini vândute",
      description: "Clienți mulțumiți"
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

  const carTypes = [
    "Mașini personale (toate mărcile)",
    "SUV-uri și crossover-uri",
    "Mașini comerciale și utilitare",
    "Mașini sport și lux",
    "Mașini electrice și hibride",
    "Mașini vechi (peste 15 ani)",
    "Mașini cu probleme minore"
  ];

  const advantages = [
    "Evaluare gratuită la domiciliu",
    "Preț negociat și transparent",
    "Verificare completă a mașinii",
    "Asistență în transferul de proprietate",
    "Plată imediată după semnare",
    "Suport pentru toate formalitățile",
    "Transport gratuit (dacă e necesar)",
    "Garanție de satisfacție"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Zap className="h-4 w-4 mr-2" />
            Vânzare Rapidă
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Vinde Mașina Ta Rapid și Sigur
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Vinde mașina rapid, sigur și la cel mai bun preț cu ajutorul echipei noastre profesionale. 
            Evaluare gratuită, ofertă în 24h și vânzare în maxim 30 zile.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              Ofertă în 24h
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Euro className="h-4 w-4 mr-2" />
              Preț negociat
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              100% siguranță
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

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold font-heading text-center mb-12">De ce să vinzi cu noi?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 text-primary w-fit">
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Process Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold font-heading text-center mb-12">Cum funcționează procesul?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sellingProcess.map((step, index) => (
              <Card key={index} className="relative hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {step.step}
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {step.icon}
                      <h3 className="font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* What We Buy */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold font-heading text-center mb-12">Ce mașini cumpărăm?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Tipuri de mașini
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {carTypes.map((type, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{type}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
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
          </div>
        </div>

        {/* Advantages */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold font-heading text-center mb-12">Avantajele noastre</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {advantages.map((advantage, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{advantage}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Evaluation Form */}
        <Card className="max-w-4xl mx-auto mb-16">
          <CardHeader className="text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 w-fit mx-auto">
              <Clock className="h-4 w-4 mr-2" />
              Evaluare gratuită în 24h
            </Badge>
            <CardTitle className="text-2xl">Evaluare gratuită a mașinii tale</CardTitle>
            <CardDescription>
              Completează formularul pentru a primi o evaluare gratuită și o ofertă fermă în maxim 24h
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Marca *</label>
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
                  <label className="text-sm font-medium">Anul de fabricație *</label>
                  <Select value={formData.year} onValueChange={(value) => handleInputChange("year", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează anul" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kilometri *</label>
                  <Input
                    type="number"
                    placeholder="ex: 150000"
                    value={formData.kilometers}
                    onChange={(e) => handleInputChange("kilometers", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Combustibil *</label>
                  <Select value={formData.fuel} onValueChange={(value) => handleInputChange("fuel", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează combustibilul" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Benzină">Benzină</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Hibrid">Hibrid</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="GPL">GPL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Transmisie *</label>
                  <Select value={formData.transmission} onValueChange={(value) => handleInputChange("transmission", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează transmisia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manuală">Manuală</SelectItem>
                      <SelectItem value="Automată">Automată</SelectItem>
                      <SelectItem value="CVT">CVT</SelectItem>
                      <SelectItem value="Semi-automată">Semi-automată</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Starea generală *</label>
                  <Select value={formData.condition} onValueChange={(value) => handleInputChange("condition", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează starea" />
                    </SelectTrigger>
                    <SelectContent>
                      {carConditions.map((condition, index) => (
                        <SelectItem key={index} value={condition}>{condition}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prețul dorit (€) *</label>
                  <Input
                    type="number"
                    placeholder="ex: 15000"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Descriere detaliată</label>
                <Textarea
                  placeholder="Descrie starea mașinii, opțiunile, istoricul de întreținere, accidentele (dacă au fost), dotările speciale, etc."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
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
                  <Car className="h-5 w-5 mr-2" />
                  Trimite pentru evaluare gratuită
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Why Choose Us */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold font-heading mb-6">De ce să ne alegi?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                <div>
                  <h3 className="font-semibold mb-1">Evaluare profesională</h3>
                  <p className="text-sm text-muted-foreground">
                    Echipa noastră de experți evaluează fiecare mașină cu atenție și oferă prețuri corecte de piață
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                <div>
                  <h3 className="font-semibold mb-1">Proces transparent</h3>
                  <p className="text-sm text-muted-foreground">
                    Fiecare pas al procesului este transparent și poți urmări progresul în timp real
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                <div>
                  <h3 className="font-semibold mb-1">Suport legal complet</h3>
                  <p className="text-sm text-muted-foreground">
                    Te ajutăm cu toate formalitățile legale și documentele necesare pentru vânzare
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                <div>
                  <h3 className="font-semibold mb-1">Plată imediată</h3>
                  <p className="text-sm text-muted-foreground">
                    Primești banii imediat după semnarea contractului, fără întârzieri sau comisioane ascunse
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold font-heading mb-6">Servicii incluse</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-card border border-border">
                <h3 className="font-semibold mb-2">Evaluare completă</h3>
                <p className="text-sm text-muted-foreground">
                  Verificare tehnică, evaluare estetică și preț de piață actualizat
                </p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border">
                <h3 className="font-semibold mb-2">Asistență legală</h3>
                <p className="text-sm text-muted-foreground">
                  Suport pentru transferul de proprietate și documentele necesare
                </p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border">
                <h3 className="font-semibold mb-2">Transport opțional</h3>
                <p className="text-sm text-muted-foreground">
                  Transport gratuit dacă mașina nu poate fi condusă
                </p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border">
                <h3 className="font-semibold mb-2">Garanție de satisfacție</h3>
                <p className="text-sm text-muted-foreground">
                  Dacă nu ești mulțumit, nu semnezi contractul
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold font-heading text-center mb-8">Contactează-ne direct</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center p-4 rounded-lg bg-card border border-border">
              <Phone className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">Telefon</h3>
              <p className="text-sm text-muted-foreground">+40 21 123 4567</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-card border border-border">
              <Mail className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">Email</h3>
              <p className="text-sm text-muted-foreground">vanzare@sunautocorrect.ro</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-card border border-border">
              <MapPin className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">Locație</h3>
              <p className="text-sm text-muted-foreground">București, Sector 1</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold font-heading mb-4">Gata să vinzi mașina?</h2>
          <p className="text-muted-foreground mb-6">
            Primește o evaluare gratuită în doar câteva minute și o ofertă fermă în 24h
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              <Car className="h-5 w-5 mr-2" />
              Evaluează mașina gratuit
            </Button>
            <Button variant="outline" size="lg">
              <Clock className="h-5 w-5 mr-2" />
              Programează o vizită
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellCar;
