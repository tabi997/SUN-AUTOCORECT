import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, UserCheck, Mail, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PoliticaConfidentialitate = () => {
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
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-heading">Politica de Confidențialitate</h1>
              <p className="text-muted-foreground">Ultima actualizare: Decembrie 2024</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Introducere
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                SUN AUTOCORECT ("noi", "niște", "compania") se angajează să protejeze confidențialitatea 
                și securitatea datelor personale ale utilizatorilor site-ului nostru.
              </p>
              <p className="text-muted-foreground">
                Această politică de confidențialitate explică cum colectăm, folosim și protejăm informațiile 
                dvs. personale conform Regulamentului General privind Protecția Datelor (GDPR) și legislației române.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Datele pe care le colectăm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Informații de identificare personală</h4>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                    <li>Numele și prenumele</li>
                    <li>Adresa de email</li>
                    <li>Numărul de telefon</li>
                    <li>Adresa fizică</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Informații despre vehicule</h4>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                    <li>Detalii despre mașina pe care o vindeți</li>
                    <li>Preferințe de cumpărare</li>
                    <li>Istoricul de căutare</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Date tehnice</h4>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                    <li>Adresa IP</li>
                    <li>Tipul de browser</li>
                    <li>Dispozitivul folosit</li>
                    <li>Cookies și tehnologii similare</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cum folosim datele dvs.</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Servicii principale</h4>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                    <li>Procesarea cererilor de cumpărare și vânzare</li>
                    <li>Organizarea test drive-urilor</li>
                    <li>Comunicarea despre serviciile noastre</li>
                    <li>Îmbunătățirea experienței utilizatorului</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Marketing și comunicări</h4>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                    <li>Newsletter-uri cu oferte speciale</li>
                    <li>Promovarea noilor vehicule</li>
                    <li>Evenimente și campanii speciale</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Obligații legale</h4>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                    <li>Conformitatea cu legislația fiscală</li>
                    <li>Raportarea către autorități</li>
                    <li>Protecția drepturilor consumatorilor</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Partajarea datelor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                SUN AUTOCORECT nu vinde, nu închiriază și nu partajează datele dvs. personale cu terți 
                în scopuri comerciale, cu excepția cazurilor prevăzute în această politică:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 text-sm">
                <li><strong>Furnizori de servicii:</strong> Pentru procesarea plăților, hosting, analitica</li>
                <li><strong>Autorități:</strong> Când este necesar conform legii</li>
                <li><strong>Protecția drepturilor:</strong> Pentru a proteja drepturile noastre sau ale altora</li>
                <li><strong>Consimțământul dvs.:</strong> Când dați explicit acordul</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                Drepturile GDPR
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Conform GDPR, aveți următoarele drepturi:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Dreptul de acces</h4>
                  <p className="text-muted-foreground">Să știți ce date avem despre dvs.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Dreptul de rectificare</h4>
                  <p className="text-muted-foreground">Să corectați datele incorecte</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Dreptul de ștergere</h4>
                  <p className="text-muted-foreground">Să ștergem datele dvs. (dreptul de a fi uitat)</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Dreptul de portabilitate</h4>
                  <p className="text-muted-foreground">Să primiți datele într-un format portabil</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Dreptul de opoziție</h4>
                  <p className="text-muted-foreground">Să vă opuneți procesării datelor</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Dreptul de restricționare</h4>
                  <p className="text-muted-foreground">Să restricționați procesarea datelor</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Securitatea datelor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Implementăm măsuri tehnice și organizatorice adecvate pentru a proteja datele dvs. personale:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 text-sm">
                <li>Criptarea datelor în tranzit și la repaus</li>
                <li>Accesul restricționat la datele personale</li>
                <li>Monitorizarea continuă a sistemelor</li>
                <li>Formarea personalului privind protecția datelor</li>
                <li>Backup-uri regulate și securizate</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact și reclamații</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Pentru orice întrebări despre această politică sau pentru a vă exercita drepturile GDPR:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>office@sunautocorect.ro</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>+40 721 234 567</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-primary mt-0.5" />
                  <span>Strada Principală 123, București, România</span>
                </div>
              </div>
              <p className="text-muted-foreground mt-4 text-sm">
                Aveți dreptul să depuneți o plângere la Autoritatea Națională de Supraveghere a Prelucrării 
                Datelor cu Caracter Personal (ANSPDCP) dacă considerați că prelucrarea datelor dvs. personale 
                încalcă GDPR-ul.
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
            onClick={() => navigate('/politica-cookies')}
          >
            Vezi Politica Cookies
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PoliticaConfidentialitate;
