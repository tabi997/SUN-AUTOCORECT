import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { leadService } from "@/lib/services";
import { Mail, Phone, MapPin, Clock, Send, Sun } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Eroare de validare",
        description: "Numele este obligatoriu",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.email.trim()) {
      toast({
        title: "Eroare de validare",
        description: "Email-ul este obligatoriu",
        variant: "destructive"
      });
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Eroare de validare",
        description: "Email-ul nu este valid",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.message.trim()) {
      toast({
        title: "Eroare de validare",
        description: "Mesajul este obligatoriu",
        variant: "destructive"
      });
      return false;
    }
    
    if (formData.message.trim().length < 10) {
      toast({
        title: "Eroare de validare",
        description: "Mesajul trebuie să aibă cel puțin 10 caractere",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await leadService.createLead({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        message: formData.message.trim(),
        source: 'contact',
        status: 'new'
      });
      
      toast({
        title: "Mesaj trimis cu succes!",
        description: "Vă mulțumim pentru mesaj. Vă vom contacta în cel mai scurt timp.",
        variant: "default"
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
      
    } catch (error) {
      console.error("Error creating lead:", error);
      toast({
        title: "Eroare la trimiterea mesajului",
        description: "A apărut o eroare. Vă rugăm să încercați din nou.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <div className="bg-gradient-to-br from-background via-background to-secondary/20">
          {/* Hero Section */}
          <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-solar opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/30" />
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-full mb-4 sm:mb-6">
                  <Sun className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4 sm:mb-6">
                  Contactează-ne
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8">
                  Suntem aici să te ajutăm să găsești mașina perfectă. 
                  Luminează-ți viitorul cu SUN AUTOCORECT.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Content */}
          <section className="py-8 sm:py-12 lg:py-16">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
                {/* Contact Form */}
                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold font-heading mb-3 sm:mb-4">
                      Trimite-ne un mesaj
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Completează formularul de mai jos și te vom contacta în cel mai scurt timp.
                    </p>
                  </div>

                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-4 sm:pb-6">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <Send className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        Formular de contact
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Toate câmpurile marcate cu * sunt obligatorii
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs sm:text-sm font-medium">
                              Nume complet *
                            </Label>
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              placeholder="Introdu numele tău"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="h-10 sm:h-11 border-border/50 focus:border-primary focus:ring-primary/20 text-sm sm:text-base"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs sm:text-sm font-medium">
                              Email *
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="email@exemplu.com"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="h-10 sm:h-11 border-border/50 focus:border-primary focus:ring-primary/20 text-sm sm:text-base"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-xs sm:text-sm font-medium">
                            Telefon (opțional)
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+40 123 456 789"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="h-10 sm:h-11 border-border/50 focus:border-primary focus:ring-primary/20 text-sm sm:text-base"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="message" className="text-xs sm:text-sm font-medium">
                            Mesajul tău *
                          </Label>
                          <Textarea
                            id="message"
                            name="message"
                            placeholder="Scrie-ne mesajul tău aici..."
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={4}
                            className="border-border/50 focus:border-primary focus:ring-primary/20 resize-none text-sm sm:text-base"
                            required
                          />
                        </div>
                        
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full h-11 sm:h-12 bg-gradient-solar hover:shadow-sunrise transition-all duration-300 text-sm sm:text-base"
                          size="lg"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Se trimite...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Send className="w-4 h-4" />
                              Trimite mesajul
                            </div>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Information */}
                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold font-heading mb-3 sm:mb-4">
                      Informații de contact
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Găsește-ne ușor și contactează-ne pentru orice întrebare ai avea.
                    </p>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-base sm:text-lg mb-2">Adresa noastră</h3>
                            <p className="text-sm sm:text-base text-muted-foreground">
                              Strada Exemplului, Nr. 123<br />
                              Sectorul 1, București<br />
                              România
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-base sm:text-lg mb-2">Telefon</h3>
                            <p className="text-sm sm:text-base text-muted-foreground">
                              <a href="tel:+40123456789" className="hover:text-primary transition-colors">
                                +40 123 456 789
                              </a>
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-base sm:text-lg mb-2">Email</h3>
                            <p className="text-sm sm:text-base text-muted-foreground">
                              <a href="mailto:contact@sunautocorect.ro" className="hover:text-primary transition-colors break-all">
                                contact@sunautocorect.ro
                              </a>
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-base sm:text-lg mb-2">Program de lucru</h3>
                            <p className="text-sm sm:text-base text-muted-foreground">
                              <strong>Luni - Vineri:</strong> 9:00 - 18:00<br />
                              <strong>Sâmbătă:</strong> 9:00 - 14:00<br />
                              <strong>Duminică:</strong> Închis
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose Us Banner - Full Width */}
          <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <Card className="border-border/50 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 backdrop-blur-sm shadow-xl">
                  <CardContent className="p-6 sm:p-8 lg:p-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary/20 rounded-full mb-6 sm:mb-8">
                      <Sun className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4 sm:mb-6 text-foreground">
                      De ce să alegi SUN AUTOCORECT?
                    </h2>
                    <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                      Transparență totală în fiecare tranzacție, verificare amănunțită a fiecărui vehicul, 
                      și servicii de calitate superioară. Luminează-ți viitorul cu încrederea noastră.
                    </p>
                    
                    {/* Additional Benefits Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12">
                      <div className="text-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="font-semibold text-base sm:text-lg mb-2">Transparență Totală</h3>
                        <p className="text-sm sm:text-base text-muted-foreground">Fiecare vehicul este verificat și documentat cu amănunțime</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <h3 className="font-semibold text-base sm:text-lg mb-2">Calitate Superioară</h3>
                        <p className="text-sm sm:text-base text-muted-foreground">Servicii profesionale și suport post-vânzare excepțional</p>
                      </div>
                      
                      <div className="text-center sm:col-span-2 lg:col-span-1">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <h3 className="font-semibold text-base sm:text-lg mb-2">Încredere Garantată</h3>
                        <p className="text-sm sm:text-base text-muted-foreground">Relații pe termen lung bazate pe încredere și satisfacție</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
