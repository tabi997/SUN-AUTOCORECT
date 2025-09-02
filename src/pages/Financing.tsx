import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Car, CheckCircle, CreditCard, Euro, Percent, Shield, TrendingUp, Star, Users, Award, Zap, Clock, FileText, Handshake } from "lucide-react";

const Financing = () => {
  const [calculatorData, setCalculatorData] = useState({
    carPrice: "",
    downPayment: "",
    loanTerm: "60",
    interestRate: "8.5"
  });

  const handleCalculatorChange = (field: string, value: string) => {
    setCalculatorData(prev => ({ ...prev, [field]: value }));
  };

  const calculateMonthlyPayment = () => {
    const price = parseFloat(calculatorData.carPrice) || 0;
    const down = parseFloat(calculatorData.downPayment) || 0;
    const term = parseInt(calculatorData.loanTerm) || 60;
    const rate = parseFloat(calculatorData.interestRate) || 8.5;

    if (price <= 0 || down >= price) return 0;

    const principal = price - down;
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = term;

    if (monthlyRate === 0) return principal / numberOfPayments;

    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    return monthlyPayment;
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalCost = monthlyPayment * (parseInt(calculatorData.loanTerm) || 60);
  const totalInterest = totalCost - (parseFloat(calculatorData.carPrice) || 0) + (parseFloat(calculatorData.downPayment) || 0);

  const financingOptions = [
    {
      title: "Credit Auto Premium",
      description: "Credit bancar cu dobândă fixă și termen flexibil",
      features: ["Dobândă fixă de la 6.5%", "Termen 12-84 luni", "Avans minim 10%", "Documentație simplă", "Aprobare în 24h"],
      rate: "de la 6.5%",
      icon: <CreditCard className="h-8 w-8" />,
      badge: "Popular"
    },
    {
      title: "Leasing Operațional",
      description: "Ideal pentru companii și persoane juridice",
      features: ["Dobândă avantajoasă de la 5.9%", "Avans minim 15%", "Opțiunea de cumpărare", "Beneficii fiscale", "Flexibilitate maximă"],
      rate: "de la 5.9%",
      icon: <TrendingUp className="h-8 w-8" />,
      badge: "Recomandat"
    },
    {
      title: "Credit Prima Mașină",
      description: "Program special pentru prima mașină cu condiții avantajoase",
      features: ["Dobândă redusă de la 4.9%", "Avans minim 5%", "Termen extins până la 120 luni", "Asigurări incluse", "Suport dedicat"],
      rate: "de la 4.9%",
      icon: <Shield className="h-8 w-8" />,
      badge: "Special"
    }
  ];

  const requirements = [
    "Vârsta minimă 21 ani",
    "Veniți minime 2000 RON/lună",
    "Experiență de muncă minimă 6 luni",
    "Istoric creditar bun (fără restanțe)",
    "Documente de identitate valabile",
    "Fluturași de salariu ultimele 3 luni",
    "Certificat de muncă sau contract",
    "Domiciliul în România"
  ];

  const documents = [
    "Carte de identitate (copie)",
    "Certificat de muncă sau contract",
    "Fluturași de salariu (ultimele 3 luni)",
    "Extras de cont bancar (ultimele 3 luni)",
    "Declarație de avere",
    "Formular de cerere completat",
    "Extras CF (pentru persoane juridice)",
    "Certificat constatator (dacă e cazul)"
  ];

  const trustSignals = [
    {
      icon: <Award className="h-8 w-8" />,
      title: "15+ ani experiență",
      description: "În finanțarea auto"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "2000+ credite aprobate",
      description: "Clienți mulțumiți"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "100% siguranță",
      description: "Proces transparent"
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "4.8/5 rating",
      description: "Pe Trustpilot"
    }
  ];

  const benefits = [
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Aprobare rapidă",
      description: "Răspuns în maxim 24h"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Documentație simplă",
      description: "Doar documentele esențiale"
    },
    {
      icon: <Handshake className="h-6 w-6" />,
      title: "Suport personalizat",
      description: "Consultanță gratuită"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Garanție completă",
      description: "Proces sigur și transparent"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Zap className="h-4 w-4 mr-2" />
            Finanțare Avantajoasă
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Finanțare Auto Flexibilă
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Realizează-ți visul de a avea mașina perfectă cu opțiunile noastre de finanțare flexibile. 
            Aprobare în 24h, dobânzi de la 4.9% și termene până la 120 luni.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              Aprobare în 24h
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Percent className="h-4 w-4 mr-2" />
              Dobândă de la 4.9%
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

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold font-heading text-center mb-12">De ce să alegi finanțarea noastră?</h2>
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

        {/* Financing Options */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold font-heading text-center mb-12">Opțiuni de Finanțare</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {financingOptions.map((option, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-shadow">
                {option.badge && (
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                    {option.badge}
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 text-primary">
                    {option.icon}
                  </div>
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                  <CardDescription className="text-base">{option.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      Dobândă {option.rate}
                    </Badge>
                  </div>
                  <ul className="space-y-2">
                    {option.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full">
                    Aplică acum
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Calculator Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold font-heading text-center mb-12">Calculator de Rate Personalizat</h2>
          <div className="grid lg:grid-cols-2 gap-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-6 w-6" />
                  Calculează-ți rata
                </CardTitle>
                <CardDescription>
                  Introdu datele pentru a vedea rata lunară estimată și costul total
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prețul mașinii (€) *</label>
                  <Input
                    type="number"
                    placeholder="25000"
                    value={calculatorData.carPrice}
                    onChange={(e) => handleCalculatorChange("carPrice", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Avansul (€) *</label>
                  <Input
                    type="number"
                    placeholder="5000"
                    value={calculatorData.downPayment}
                    onChange={(e) => handleCalculatorChange("downPayment", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Termenul creditului (luni) *</label>
                  <select
                    className="w-full p-2 border border-border rounded-md"
                    value={calculatorData.loanTerm}
                    onChange={(e) => handleCalculatorChange("loanTerm", e.target.value)}
                    required
                  >
                    <option value="12">12 luni</option>
                    <option value="24">24 luni</option>
                    <option value="36">36 luni</option>
                    <option value="48">48 luni</option>
                    <option value="60">60 luni</option>
                    <option value="72">72 luni</option>
                    <option value="84">84 luni</option>
                    <option value="120">120 luni (Prima Mașină)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Dobânda anuală (%) *</label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="8.5"
                    value={calculatorData.interestRate}
                    onChange={(e) => handleCalculatorChange("interestRate", e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rezultatele calculului</CardTitle>
                <CardDescription>
                  Estimarea ratei lunare și costului total
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <div className="text-2xl font-bold text-primary">
                      €{monthlyPayment.toFixed(0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Rată lunară</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <div className="text-2xl font-bold text-primary">
                      €{totalCost.toFixed(0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Cost total</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Preț mașină:</span>
                    <span className="font-semibold">€{parseFloat(calculatorData.carPrice) || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avans:</span>
                    <span className="font-semibold">€{parseFloat(calculatorData.downPayment) || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Credit solicitat:</span>
                    <span className="font-semibold">€{(parseFloat(calculatorData.carPrice) || 0) - (parseFloat(calculatorData.downPayment) || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dobândă totală:</span>
                    <span className="font-semibold text-red-500">€{totalInterest.toFixed(0)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total de plătit:</span>
                    <span className="text-primary">€{totalCost.toFixed(0)}</span>
                  </div>
                </div>
                
                <div className="bg-primary/10 p-4 rounded-lg">
                  <p className="text-sm text-primary font-medium">
                    💡 Sfat: Un avans mai mare reduce rata lunară și costul total al creditului.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Requirements and Documents */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Cerințe de eligibilitate</CardTitle>
              <CardDescription>
                Verifică dacă îndeplinești condițiile pentru credit auto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{requirement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documente necesare</CardTitle>
              <CardDescription>
                Documentele pe care trebuie să le ai pregătite
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {documents.map((document, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                    <span className="text-sm">{document}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Application Process */}
        <Card className="max-w-4xl mx-auto mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Procesul de aplicare simplificat</CardTitle>
            <CardDescription>
              Doar 4 pași simpli până la aprobarea creditului
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  1
                </div>
                <h3 className="font-semibold mb-2">Aplicare online</h3>
                <p className="text-sm text-muted-foreground">Completează formularul în 5 minute</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  2
                </div>
                <h3 className="font-semibold mb-2">Verificare documente</h3>
                <p className="text-sm text-muted-foreground">Analizăm documentele în 24h</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  3
                </div>
                <h3 className="font-semibold mb-2">Aprobare</h3>
                <p className="text-sm text-muted-foreground">Răspuns în maxim 48h</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  4
                </div>
                <h3 className="font-semibold mb-2">Semnare contract</h3>
                <p className="text-sm text-muted-foreground">Primești mașina în aceeași zi</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold font-heading mb-4">Gata să începi?</h2>
          <p className="text-muted-foreground mb-6">
            Aplică pentru credit auto în doar câteva minute și primește răspunsul în 24h
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              <CreditCard className="h-5 w-5 mr-2" />
              Aplică pentru credit
            </Button>
            <Button variant="outline" size="lg">
              <Car className="h-5 w-5 mr-2" />
              Vezi mașinile disponibile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Financing;
