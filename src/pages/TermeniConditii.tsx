import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Car, Shield, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermeniConditii = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Înapoi
          </Button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-solar rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-heading">Termeni și Condiții</h1>
              <p className="text-muted-foreground">Ultima actualizare: Decembrie 2024</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Introducere
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Acești termeni și condiții guvernează utilizarea site-ului web SUN AUTOCORECT și serviciile 
                oferite prin intermediul acestuia.
              </p>
              <p className="text-muted-foreground">
                Prin accesarea și utilizarea site-ului nostru, acceptați să respectați acești termeni și condiții 
                în totalitate. Dacă nu sunteți de acord cu acești termeni, vă rugăm să nu utilizați site-ul nostru.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informații despre companie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">SUN AUTOCORECT</h4>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                    <li>Adresa: Strada Principală 123, București, România</li>
                    <li>Telefon: +40 721 234 567</li>
                    <li>Email: office@sunautocorect.ro</li>
                    <li>CUI: RO12345678</li>
                    <li>Nr. Reg. Com.: J40/1234/2024</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Autorizații și licențe</h4>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                    <li>Autorizație de comerț cu vehicule rulate</li>
                    <li>Licență de intermediere în vânzări auto</li>
                    <li>Autorizație pentru servicii de evaluare vehicule</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                Serviciile noastre
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Vânzarea vehiculelor</h4>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                    <li>Vehicule second-hand verificate și garantate</li>
                    <li>Evaluare profesională a vehiculelor</li>
                    <li>Asistență în procesul de cumpărare</li>
                    <li>Finanțare prin parteneri autorizați</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Servicii suplimentare</h4>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                    <li>Test drive organizat</li>
                    <li>Inspecție tehnică detaliată</li>
                    <li>Asistență în transferul de proprietate</li>
                    <li>Servicii post-vânzare</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Obligații ale utilizatorilor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Utilizarea corectă</h4>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                    <li>Să furnizați informații corecte și complete</li>
                    <li>Să respectați legislația în vigoare</li>
                    <li>Să nu utilizați site-ul în scopuri ilegale</li>
                    <li>Să respectați drepturile de proprietate intelectuală</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Interdicții</h4>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                    <li>Utilizarea de software-uri malicioase</li>
                    <li>Încercarea de a accesa sistemele noastre</li>
                    <li>Transmiterea de conținut dăunător</li>
                    <li>Spam-ul sau mesajele comerciale nedorite</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Politica de prețuri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground mb-4">
                  Toate prețurile afișate pe site sunt exprimate în RON (Lei românești) și includ TVA-ul, 
                  cu excepția cazurilor în care se specifică altfel.
                </p>
                
                <div>
                  <h4 className="font-semibold mb-2">Modificări ale prețurilor</h4>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                    <li>Prețurile pot fi modificate fără notificare prealabilă</li>
                    <li>Prețul valabil este cel afișat la momentul comenzii</li>
                    <li>Rezervările sunt valabile la prețul din momentul confirmării</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Costuri suplimentare</h4>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                    <li>Taxe de transfer proprietate</li>
                    <li>Costuri de asigurare</li>
                    <li>Taxe de înmatriculare</li>
                    <li>Comisioane bancare (dacă aplicabil)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Garanții și responsabilități
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Garanția legală</h4>
                  <p className="text-muted-foreground text-sm">
                    Toate vehiculele beneficiază de garanția legală conform OUG nr. 21/1992 și 
                    legislației europene privind protecția consumatorilor.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Limitarea responsabilității</h4>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                    <li>SUN AUTOCORECT nu poate fi trasă la răspundere pentru daune indirecte</li>
                    <li>Responsabilitatea este limitată la valoarea tranzacției</li>
                    <li>Nu garantăm disponibilitatea permanentă a vehiculelor</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Rezolvarea disputelor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground mb-4">
                  În cazul apariției unor dispute, SUN AUTOCORECT se angajează să le rezolve 
                  pe cale amiabilă, în spiritul colaborării și al încrederii reciproce.
                </p>
                
                <div>
                  <h4 className="font-semibold mb-2">Procedura de rezolvare</h4>
                  <ol className="list-decimal list-inside text-muted-foreground text-sm space-y-1">
                    <li>Contactarea directă cu serviciul clienți</li>
                    <li>Evaluarea și analiza problemei</li>
                    <li>Propunerea de soluții</li>
                    <li>Implementarea soluției acceptate</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Autorități competente</h4>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                    <li>ANPC - Autoritatea Națională pentru Protecția Consumatorilor</li>
                    <li>ANSPDCP - Autoritatea Națională de Supraveghere a Prelucrării Datelor</li>
                    <li>Instanțele judecătorești competente</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modificări ale termenilor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                SUN AUTOCORECT își rezervă dreptul de a modifica acești termeni și condiții 
                în orice moment, pentru a reflecta schimbările în serviciile noastre sau în legislația aplicabilă.
              </p>
              <p className="text-muted-foreground">
                Modificările vor fi comunicate utilizatorilor prin actualizarea acestei pagini. 
                Utilizarea continuă a site-ului după modificări reprezintă acceptarea noilor termeni.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="mt-12 text-center">
          <Button 
            variant="solar" 
            onClick={() => navigate('/')}
            className="mr-4"
          >
            Înapoi la pagina principală
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/politica-confidentialitate')}
          >
            Vezi Politica de Confidențialitate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TermeniConditii;
