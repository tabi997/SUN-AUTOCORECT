import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Cookie, Shield, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PoliticaCookies = () => {
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
              <Cookie className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-heading">Politica Cookies</h1>
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
                Ce sunt cookies-urile?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Cookies-urile sunt fișiere text mici care sunt stocate pe dispozitivul dvs. când vizitați site-ul nostru. 
                Acestea ne ajută să îmbunătățim experiența dvs. și să oferim servicii personalizate.
              </p>
              <p className="text-muted-foreground">
                SUN AUTOCORECT folosește cookies-uri pentru a vă oferi cea mai bună experiență posibilă pe site-ul nostru.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Tipuri de cookies folosite
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Cookies esențiale</h4>
                  <p className="text-muted-foreground text-sm">
                    Necesare pentru funcționarea de bază a site-ului. Nu pot fi dezactivate.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Cookies de performanță</h4>
                  <p className="text-muted-foreground text-sm">
                    Ne ajută să înțelegem cum interacționați cu site-ul pentru a îl îmbunătăți.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Cookies de funcționalitate</h4>
                  <p className="text-muted-foreground text-sm">
                    Permit site-ului să-și amintească alegerile dvs. și să ofere funcții îmbunătățite.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Cookies de marketing</h4>
                  <p className="text-muted-foreground text-sm">
                    Folosite pentru a vă arăta reclame relevante și pentru a măsura eficacitatea campaniilor.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookies de terți</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Site-ul nostru poate folosi servicii de terți care pot seta propriile cookies-uri:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 text-sm">
                <li>Google Analytics - pentru analiza traficului</li>
                <li>Facebook Pixel - pentru publicitate personalizată</li>
                <li>YouTube - pentru conținut video embedded</li>
                <li>Servicii de plată - pentru procesarea tranzacțiilor</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestionarea cookies-urilor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Puteți gestiona preferințele pentru cookies-uri în setările browserului dvs.:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Chrome</h4>
                  <p className="text-muted-foreground">Setări → Confidențialitate și securitate → Cookies</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Firefox</h4>
                  <p className="text-muted-foreground">Opțiuni → Confidențialitate → Cookies</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Safari</h4>
                  <p className="text-muted-foreground">Preferințe → Confidențialitate → Cookies</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Edge</h4>
                  <p className="text-muted-foreground">Setări → Cookies și permisiuni site</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conformitatea GDPR</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                SUN AUTOCORECT respectă Regulamentul General privind Protecția Datelor (GDPR) și legislația română 
                privind protecția datelor personale.
              </p>
              <p className="text-muted-foreground">
                Pentru orice întrebări despre politica noastră de cookies sau pentru a exercita drepturile GDPR, 
                ne puteți contacta la: <span className="text-primary">office@sunautocorect.ro</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actualizări ale politicii</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Această politică poate fi actualizată periodic pentru a reflecta schimbările în practicile noastre 
                sau în legislația aplicabilă. Vă recomandăm să verificați această pagină în mod regulat.
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
            onClick={() => navigate('/gdpr')}
          >
            Vezi Politica GDPR
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PoliticaCookies;
