import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Clock, CheckCircle, Loader2, Check } from "lucide-react";
import { leadService } from "@/lib/services";
import { useToast } from "@/hooks/use-toast";

const SellCar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validare câmpuri obligatorii
    if (!formData.brand.trim()) newErrors.brand = "Marca este obligatorie";
    
    // Validare brand (trebuie să aibă cel puțin 2 caractere)
    if (formData.brand && formData.brand.trim().length < 2) {
      newErrors.brand = "Marca trebuie să aibă cel puțin 2 caractere";
    }
    
    if (!formData.model.trim()) newErrors.model = "Modelul este obligatoriu";
    
    // Validare model (trebuie să aibă cel puțin 1 caracter)
    if (formData.model && formData.model.trim().length < 1) {
      newErrors.model = "Modelul trebuie să aibă cel puțin 1 caracter";
    }
    if (!formData.year.trim()) newErrors.year = "Anul este obligatoriu";
    if (!formData.kilometers.trim()) newErrors.kilometers = "Kilometrii sunt obligatorii";
    if (!formData.price.trim()) newErrors.price = "Prețul este obligatoriu";
    if (!formData.contactName.trim()) newErrors.contactName = "Numele este obligatoriu";
    
    // Validare nume (trebuie să aibă cel puțin 2 caractere)
    if (formData.contactName && formData.contactName.trim().length < 2) {
      newErrors.contactName = "Numele trebuie să aibă cel puțin 2 caractere";
    }
    if (!formData.contactEmail.trim()) newErrors.contactEmail = "Email-ul este obligatoriu";
    if (!formData.contactPhone.trim()) newErrors.contactPhone = "Telefonul este obligatoriu";
    
    // Validare telefon (trebuie să aibă cel puțin 10 caractere)
    if (formData.contactPhone && formData.contactPhone.trim().length < 10) {
      newErrors.contactPhone = "Telefonul trebuie să aibă cel puțin 10 caractere";
    }

    // Validare email
    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Email invalid";
    }

    // Validare kilometri
    if (formData.kilometers && (isNaN(parseInt(formData.kilometers)) || parseInt(formData.kilometers) < 0 || parseInt(formData.kilometers) > 1000000)) {
      newErrors.kilometers = "Kilometrii trebuie să fie între 0 și 1.000.000";
    }

    // Validare preț
    if (formData.price && (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0 || parseFloat(formData.price) > 1000000)) {
      newErrors.price = "Prețul trebuie să fie între 0 și 1.000.000 €";
    }

    // Validare an
    if (formData.year && (isNaN(parseInt(formData.year)) || parseInt(formData.year) < 1900 || parseInt(formData.year) > new Date().getFullYear() + 1)) {
      newErrors.year = "Anul trebuie să fie între 1900 și " + (new Date().getFullYear() + 1);
    }
    
    // Validare descriere (opțională, dar dacă este completată să aibă o lungime minimă)
    if (formData.description && formData.description.trim().length < 10) {
      newErrors.description = "Descrierea trebuie să aibă cel puțin 10 caractere";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Eroare de validare",
        description: "Te rugăm să completezi toate câmpurile obligatorii corect",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Creez mesajul pentru lead
      const message = `Mașină: ${formData.brand} ${formData.model} (${formData.year})
Kilometri: ${formData.kilometers} km
Combustibil: ${formData.fuel || 'Nespecificat'}
Transmisie: ${formData.transmission || 'Nespecificată'}
Stare: ${formData.condition || 'Nespecificată'}
Preț dorit: ${formData.price} €
Descriere: ${formData.description || 'Fără descriere'}`;

      // Salvez lead-ul în baza de date
      await leadService.createLead({
        name: formData.contactName,
        email: formData.contactEmail,
        phone: formData.contactPhone,
        message: message,
        source: 'car_inquiry',
        status: 'new'
      });

      setIsSubmitted(true);
      
      toast({
        title: "Succes!",
        description: "Formularul a fost trimis cu succes. Vei primi o evaluare în 24h.",
      });

      // Redirecționez după 3 secunde
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare la trimiterea formularului. Te rugăm să încerci din nou.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    "Completează formularul",
    "Primești evaluarea în 24h",
    "Confirmi oferta",
    "Vindezi mașina"
  ];

  const carConditions = [
    "Excelentă - ca nouă",
    "Foarte bună - uzură minimă",
    "Bună - uzură normală",
    "Acceptabilă - uzură moderată",
    "Necesită reparații"
  ];

  // Dacă formularul a fost trimis cu succes, afișez confirmarea
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 pt-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4 text-green-600">
              Formular trimis cu succes!
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Mulțumim pentru interesul tău! Vei primi o evaluare gratuită în maxim 24 de ore.
            </p>
            <div className="bg-muted p-6 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">Ce urmează:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Echipa noastră va analiza informațiile despre mașina ta</li>
                <li>• Vei primi o evaluare detaliată pe email</li>
                <li>• Dacă ești mulțumit de oferta, ne contactăm pentru următorii pași</li>
              </ul>
            </div>
            <Button onClick={() => navigate('/')} className="w-full">
              Înapoi la pagina principală
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-12 pt-20">
        {/* Simple Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Vinde Mașina Ta</h1>
          <p className="text-muted-foreground">
            Primești o evaluare gratuită în 24h
          </p>
        </div>

        {/* Simple Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <span className="ml-2 text-sm text-muted-foreground">{step}</span>
                {index < steps.length - 1 && (
                  <div className="w-8 h-1 bg-border mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Simple Form */}
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Evaluare gratuită</CardTitle>
            <CardDescription>
              Completează formularul pentru a primi o evaluare în 24h
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Car Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Detalii mașină</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Marca *</label>
                    <Input
                      placeholder="BMW, Mercedes, Audi..."
                      value={formData.brand}
                      onChange={(e) => handleInputChange("brand", e.target.value)}
                      className={errors.brand ? "border-red-500" : ""}
                      disabled={isSubmitting}
                    />
                    {errors.brand && (
                      <p className="text-sm text-red-500 mt-1">{errors.brand}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Modelul *</label>
                    <Input
                      placeholder="X5, C-Class, Q7..."
                      value={formData.model}
                      onChange={(e) => handleInputChange("model", e.target.value)}
                      className={errors.model ? "border-red-500" : ""}
                      disabled={isSubmitting}
                    />
                    {errors.model && (
                      <p className="text-sm text-red-500 mt-1">{errors.model}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Anul *</label>
                    <Select 
                      value={formData.year} 
                      onValueChange={(value) => handleInputChange("year", value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className={errors.year ? "border-red-500" : ""}>
                        <SelectValue placeholder="Selectează anul" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.year && (
                      <p className="text-sm text-red-500 mt-1">{errors.year}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Kilometri *</label>
                    <Input
                      type="number"
                      placeholder="150000"
                      value={formData.kilometers}
                      onChange={(e) => handleInputChange("kilometers", e.target.value)}
                      className={errors.kilometers ? "border-red-500" : ""}
                      disabled={isSubmitting}
                      min="0"
                      max="1000000"
                    />
                    {errors.kilometers && (
                      <p className="text-sm text-red-500 mt-1">{errors.kilometers}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Combustibil</label>
                    <Select 
                      value={formData.fuel} 
                      onValueChange={(value) => handleInputChange("fuel", value)}
                      disabled={isSubmitting}
                    >
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
                  
                  <div>
                    <label className="text-sm font-medium">Transmisie</label>
                    <Select 
                      value={formData.transmission} 
                      onValueChange={(value) => handleInputChange("transmission", value)}
                      disabled={isSubmitting}
                    >
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Starea generală</label>
                    <Select 
                      value={formData.condition} 
                      onValueChange={(value) => handleInputChange("condition", value)}
                      disabled={isSubmitting}
                    >
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
                  
                  <div>
                    <label className="text-sm font-medium">Prețul dorit (€) *</label>
                    <Input
                      type="number"
                      placeholder="15000"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      className={errors.price ? "border-red-500" : ""}
                      disabled={isSubmitting}
                      min="0"
                      max="1000000"
                      step="100"
                    />
                    {errors.price && (
                      <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Descriere</label>
                  <Textarea
                    placeholder="Descrie starea mașinii, opțiunile, etc."
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    disabled={isSubmitting}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                  )}
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Date de contact</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Numele *</label>
                    <Input
                      placeholder="Numele complet"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange("contactName", e.target.value)}
                      className={errors.contactName ? "border-red-500" : ""}
                      disabled={isSubmitting}
                    />
                    {errors.contactName && (
                      <p className="text-sm text-red-500 mt-1">{errors.contactName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Email *</label>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                      className={errors.contactEmail ? "border-red-500" : ""}
                      disabled={isSubmitting}
                    />
                    {errors.contactEmail && (
                      <p className="text-sm text-red-500 mt-1">{errors.contactEmail}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Telefon *</label>
                    <Input
                      placeholder="+40 123 456 789"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                      className={errors.contactPhone ? "border-red-500" : ""}
                      disabled={isSubmitting}
                    />
                    {errors.contactPhone && (
                      <p className="text-sm text-red-500 mt-1">{errors.contactPhone}</p>
                    )}
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Se trimite...
                  </>
                ) : (
                  <>
                    <Car className="h-4 w-4 mr-2" />
                    Trimite pentru evaluare
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Simple Info */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Primești o evaluare gratuită în maxim 24h
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellCar;
