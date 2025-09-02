import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCheck, Shield, Database, Lock, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GDPR = () => {
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
              <UserCheck className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-heading">Politica GDPR</h1>
              <p className="text-muted-foreground">Conformitate cu Regulamentul General privind Protecția Datelor</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Ce este GDPR-ul?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Regulamentul General privind Protecția Datelor (GDPR) este o regulamentare europeană 
                care protejează drepturile fundamentale ale persoanelor fizice în ceea ce privește 
                prelucrarea datelor personale.
              </p>
              <p className="text-muted-foreground">
                SUN AUTOCORECT se angajează să respecte toate prevederile GDPR-ului și să protejeze 
                confidențialitatea datelor dvs. personale.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Ce date prelucrăm?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Date de identificare</h4>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                    <li>Numele și prenumele</li>
                    <li>Adresa de email</li>
                    <li>Numărul de telefon</li>
                    <li>Adresa fizică</li>
                    <li>Data nașterii (dacă necesar)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Date despre vehicule</h4>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                    <li>Detalii despre mașina pe care o vindeți</li>
                    <li>Preferințe de cumpărare</li>
                    <li>Istoricul de căutare pe site</li>
                    <li>Interacțiunile cu serviciile noastre</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Date tehnice</h4>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                    <li>Adresa IP</li>
                    <li>Tipul de browser și dispozitiv</li>
                    <li>Cookies și tehnologii similare</li>
                    <li>Log-uri de acces și utilizare</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Baza legală pentru prelucrare</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Executarea contractului</h4>
                  <p className="text-muted-foreground text-sm">
                    Prelucrăm datele pentru a vă oferi serviciile solicitate (cumpărare, vânzare, 
                    evaluare vehicule).
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Interesul legitim</h4>
                  <p className="text-muted-foreground text-sm">
                    Pentru îmbunătățirea serviciilor, securitatea site-ului și comunicările de marketing 
                    (cu consimțământul dvs.).
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Consimțământul</h4>
                  <p className="text-muted-foreground text-sm">
                    Pentru newsletter-uri, cookies non-esențiale și comunicări de marketing.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Obligația legală</h4>
                  <p className="text-muted-foreground text-sm">
                    Pentru conformitatea cu legislația fiscală, contabilă și de protecție a consumatorilor.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                Drepturile dvs. GDPR
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Dreptul de acces (Art. 15)</h4>
                  <p className="text-muted-foreground text-sm">
                    Puteți solicita informații despre ce date avem despre dvs. și cum le folosim.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Dreptul de rectificare (Art. 16)</h4>
                  <p className="text-muted-foreground text-sm">
                    Puteți corecta datele incorecte sau incomplete despre dvs.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Dreptul de ștergere (Art. 17)</h4>
                  <p className="text-muted-foreground text-sm">
                    Puteți solicita ștergerea datelor dvs. personale ("dreptul de a fi uitat").
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Dreptul de portabilitate (Art. 20)</h4>
                  <p className="text-muted-foreground text-sm">
                    Puteți primi datele într-un format structurat și portabil.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Dreptul de opoziție (Art. 21)</h4>
                  <p className="text-muted-foreground text-sm">
                    Puteți vă opune procesării datelor pentru marketing direct.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Dreptul de restricționare (Art. 18)</h4>
                  <p className="text-muted-foreground text-sm">
                    Puteți restricționa procesarea datelor în anumite circumstanțe.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cum să vă exercitați drepturile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground mb-4">
                  Pentru a vă exercita drepturile GDPR, puteți contacta SUN AUTOCORECT prin:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>office@sunautocorect.ro</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>+40 721 234 567</span>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Procedura de solicitare:</h4>
                  <ol className="list-decimal list-inside text-muted-foreground text-sm space-y-1">
                    <li>Trimiteți o cerere scrisă prin email sau telefon</li>
                    <li>Specificați dreptul pe care doriți să îl exercitați</li>
                    <li>Vom răspunde în maximum 30 de zile</li>
                    <li>În cazuri complexe, perioada poate fi extinsă cu 60 de zile</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Securitatea datelor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground mb-4">
                  Implementăm măsuri tehnice și organizatorice adecvate pentru a proteja datele dvs. personale:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Măsuri tehnice</h4>
                    <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                      <li>Criptarea datelor în tranzit (HTTPS/TLS)</li>
                      <li>Criptarea datelor la repaus</li>
                      <li>Firewall-uri și sisteme de securitate</li>
                      <li>Backup-uri regulate și securizate</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Măsuri organizatorice</h4>
                    <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                      <li>Accesul restricționat la date</li>
                      <li>Formarea personalului</li>
                      <li>Politici de confidențialitate</li>
                      <li>Audit-uri regulate de securitate</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transferuri internaționale</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Datele dvs. personale sunt procesate în România, în cadrul Uniunii Europene. 
                În cazul în care este necesar să transferăm date în afara UE, vom asigura:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 text-sm">
                <li>Transferul se face către țări cu nivel adecvat de protecție</li>
                <li>Sau folosim garanții contractuale standardizate</li>
                <li>Sau obținem consimțământul dvs. explicit</li>
                <li>Monitorizăm și evaluăm în mod regulat aceste transferuri</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Retenția datelor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground mb-4">
                  Păstrăm datele dvs. personale doar cât timp este necesar pentru scopurile 
                  pentru care au fost colectate:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Date de contact</h4>
                    <p className="text-muted-foreground">3 ani după ultima interacțiune</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Date despre tranzacții</h4>
                    <p className="text-muted-foreground">10 ani (conform legislației fiscale)</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Cookies și analitica</h4>
                    <p className="text-muted-foreground">2 ani</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Newsletter</h4>
                    <p className="text-muted-foreground">Până la dezabonare</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact și reclamații</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground mb-4">
                  Pentru orice întrebări despre această politică GDPR sau pentru a vă exercita drepturile:
                </p>
                
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Responsabilul cu protecția datelor (DPO)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>dpo@sunautocorect.ro</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>+40 721 234 567</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm">
                  Aveți dreptul să depuneți o plângere la Autoritatea Națională de Supraveghere a 
                  Prelucrării Datelor cu Caracter Personal (ANSPDCP) dacă considerați că prelucrarea 
                  datelor dvs. personale încalcă GDPR-ul.
                </p>
              </div>
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

export default GDPR;
