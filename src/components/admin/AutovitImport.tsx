import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Download, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Car,
  RefreshCw,
  ExternalLink,
  Terminal
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ImportStats {
  total: number
  imported: number
  errors: number
  skipped: number
  current: string
}

const AutovitImport = () => {
  const [isImporting, setIsImporting] = useState(false)
  const [importStats, setImportStats] = useState<ImportStats>({
    total: 0,
    imported: 0,
    errors: 0,
    skipped: 0,
    current: ''
  })
  const [lastImport, setLastImport] = useState<Date | null>(null)
  const [showTerminal, setShowTerminal] = useState(false)
  const [terminalOutput, setTerminalOutput] = useState<string[]>([])
  const { toast } = useToast()

  const handleImport = async () => {
    setIsImporting(true)
    setShowTerminal(true)
    setTerminalOutput([])
    setImportStats({ total: 0, imported: 0, errors: 0, skipped: 0, current: 'Inițializez...' })

    try {
      // Adaug log-uri în terminal
      const addLog = (message: string) => {
        setTerminalOutput(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
      }

      addLog('🚀 Încep importul din Autovit...')
      addLog('📋 Verific conexiunea la Supabase...')

      // Simulez importul real cu progres real
      // În realitate, aici ar trebui să rulezi scriptul de import
      const simulateRealImport = () => {
        return new Promise<void>((resolve, reject) => {
          let current = 0
          const total = 10 // Simulez 10 anunțuri
          
          addLog(`📊 Am găsit ${total} anunțuri în inventory`)
          
          const interval = setInterval(() => {
            current++
            
            // Simulez progresul real
            if (current === 1) {
              addLog('🔍 Analizez anunțul 1: BMW Seria 3 320d...')
              addLog('📸 Descarc 5 imagini...')
              addLog('💾 Salvez în baza de date...')
              addLog('✅ BMW Seria 3 320d importat cu succes!')
            } else if (current === 2) {
              addLog('🔍 Analizez anunțul 2: Mercedes GLC 220d...')
              addLog('📸 Descarc 4 imagini...')
              addLog('💾 Salvez în baza de date...')
              addLog('✅ Mercedes GLC 220d importat cu succes!')
            } else if (current === 3) {
              addLog('🔍 Analizez anunțul 3: Audi A4 2.0 TFSI...')
              addLog('📸 Descarc 6 imagini...')
              addLog('💾 Salvez în baza de date...')
              addLog('✅ Audi A4 2.0 TFSI importat cu succes!')
            } else if (current === 4) {
              addLog('🔍 Analizez anunțul 4: Volkswagen Golf 2.0 TDI...')
              addLog('📸 Descarc 3 imagini...')
              addLog('💾 Salvez în baza de date...')
              addLog('✅ Volkswagen Golf 2.0 TDI importat cu succes!')
            } else if (current === 5) {
              addLog('🔍 Analizez anunțul 5: Skoda Octavia 1.5 TSI...')
              addLog('📸 Descarc 4 imagini...')
              addLog('💾 Salvez în baza de date...')
              addLog('✅ Skoda Octavia 1.5 TSI importat cu succes!')
            } else if (current === 6) {
              addLog('🔍 Analizez anunțul 6: Ford Focus 1.6 TDCi...')
              addLog('📸 Descarc 3 imagini...')
              addLog('💾 Salvez în baza de date...')
              addLog('✅ Ford Focus 1.6 TDCi importat cu succes!')
            } else if (current === 7) {
              addLog('🔍 Analizez anunțul 7: Opel Astra 1.4 Turbo...')
              addLog('📸 Descarc 4 imagini...')
              addLog('💾 Salvez în baza de date...')
              addLog('✅ Opel Astra 1.4 Turbo importat cu succes!')
            } else if (current === 8) {
              addLog('🔍 Analizez anunțul 8: Renault Megane 1.5 dCi...')
              addLog('📸 Descarc 3 imagini...')
              addLog('💾 Salvez în baza de date...')
              addLog('✅ Renault Megane 1.5 dCi importat cu succes!')
            } else if (current === 9) {
              addLog('🔍 Analizez anunțul 9: Peugeot 308 1.6 HDi...')
              addLog('📸 Descarc 4 imagini...')
              addLog('💾 Salvez în baza de date...')
              addLog('✅ Peugeot 308 1.6 HDi importat cu succes!')
            } else if (current === 10) {
              addLog('🔍 Analizez anunțul 10: Citroen C4 1.6 VTi...')
              addLog('📸 Descarc 3 imagini...')
              addLog('⚠️  Eroare la descărcarea imaginilor')
              addLog('❌ Citroen C4 1.6 VTi - EROARE la import')
            }

            // Actualizez statisticile
            const imported = current === 10 ? 9 : current
            const errors = current === 10 ? 1 : 0
            
            setImportStats({
              total,
              imported,
              errors,
              skipped: 0,
              current: `Procesez anunțul ${current}/${total}...`
            })

            if (current >= total) {
              clearInterval(interval)
              
              addLog('🎉 Import finalizat!')
              addLog(`📊 Statistici finale:`)
              addLog(`   - Total anunțuri: ${total}`)
              addLog(`   - Importate cu succes: ${imported}`)
              addLog(`   - Erori: ${errors}`)
              addLog(`   - Sărite (duplicate): 0`)
              
              setLastImport(new Date())
              toast({
                title: "Import finalizat!",
                description: `${imported} mașini importate cu succes, ${errors} erori`,
              })
              resolve()
            }
          }, 3000) // 3 secunde între anunțuri pentru a simula timpul real
        })
      }

      await simulateRealImport()

    } catch (error) {
      console.error('Eroare la import:', error)
      const addLog = (message: string) => {
        setTerminalOutput(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
      }
      addLog(`❌ Eroare generală: ${error}`)
      toast({
        title: "Eroare la import",
        description: "Nu s-a putut importa din Autovit. Încearcă din nou.",
        variant: "destructive"
      })
    } finally {
      setIsImporting(false)
    }
  }

  const runRealImport = async () => {
    setIsImporting(true)
    setShowTerminal(true)
    setTerminalOutput([])
    setImportStats({ total: 0, imported: 0, errors: 0, skipped: 0, current: 'Inițializez...' })

    try {
      const addLog = (message: string) => {
        setTerminalOutput(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
      }

      addLog('🚀 Rulez scriptul real de import...')
      addLog('📋 Pentru a rula importul real, folosește:')
      addLog('   npm run import-autovit-improved')
      addLog('')
      addLog('💡 Sau rulează direct:')
      addLog('   node import-autovit-improved.js')
      addLog('')
      addLog('⚠️  Interfața admin doar simulează importul')
      addLog('🔧 Pentru importul real, folosește terminalul')

      setImportStats({
        total: 0,
        imported: 0,
        errors: 0,
        skipped: 0,
        current: 'Importul real trebuie rulat din terminal'
      })

      toast({
        title: "Informație",
        description: "Pentru importul real, folosește terminalul cu npm run import-autovit-improved",
      })

    } catch (error) {
      console.error('Eroare:', error)
      addLog(`❌ Eroare: ${error}`)
    } finally {
      setIsImporting(false)
    }
  }

  const progress = importStats.total > 0 
    ? ((importStats.imported + importStats.errors) / importStats.total) * 100 
    : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Download className="h-5 w-5" />
          <span>Import Autovit</span>
        </CardTitle>
        <CardDescription>
          Importă anunțurile din inventory-ul Autovit în stocul local
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status și ultimul import */}
        <div className="flex items-center justify-between">
          <div>
            <Badge variant={isImporting ? "default" : "secondary"}>
              {isImporting ? 'În progres' : 'Gata de import'}
            </Badge>
            {lastImport && (
              <p className="text-sm text-muted-foreground mt-1">
                Ultimul import: {lastImport.toLocaleString('ro-RO')}
              </p>
            )}
          </div>
          <a 
            href="https://sunautocorect.autovit.ro/inventory" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Vezi inventory Autovit</span>
          </a>
        </div>

        {/* Progress și stats */}
        {isImporting && (
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Progres total</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-600">
                  {importStats.total}
                </div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-green-600">
                  {importStats.imported}
                </div>
                <div className="text-xs text-muted-foreground">Importate</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-red-600">
                  {importStats.errors}
                </div>
                <div className="text-xs text-muted-foreground">Erori</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-yellow-600">
                  {importStats.skipped}
                </div>
                <div className="text-xs text-muted-foreground">Sărite</div>
              </div>
            </div>

            {importStats.current && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  {importStats.current}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Terminal Output */}
        {showTerminal && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium flex items-center space-x-2">
                <Terminal className="h-4 w-4" />
                <span>Output Terminal</span>
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTerminal(false)}
              >
                Ascunde
              </Button>
            </div>
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
              {terminalOutput.map((line, index) => (
                <div key={index} className="whitespace-pre-wrap">{line}</div>
              ))}
            </div>
          </div>
        )}

        {/* Informații importante */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="space-y-2">
            <div><strong>Important:</strong></div>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Interfața admin doar simulează importul</strong> - nu face importul real</li>
              <li>Pentru importul real, folosește terminalul: <code className="bg-gray-100 px-1 rounded">npm run import-autovit-improved</code></li>
              <li>Importul real poate dura câteva minute</li>
              <li>Se vor importa primele 15-20 de fotografii pentru fiecare mașină</li>
              <li>Anunțurile duplicate nu vor fi importate din nou</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Butoanele de import */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={handleImport} 
            disabled={isImporting}
            className="w-full"
            variant="solar"
            size="lg"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Simulez Importul...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Simulează Importul
              </>
            )}
          </Button>

          <Button 
            onClick={runRealImport} 
            disabled={isImporting}
            className="w-full"
            variant="outline"
            size="lg"
          >
            <Terminal className="h-4 w-4 mr-2" />
            Instrucțiuni Import Real
          </Button>
        </div>

        {/* Statistici rapide */}
        <div className="grid grid-cols-2 gap-4 text-center text-sm">
          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-1">
              <Car className="h-4 w-4" />
              <span>Mașini în stoc</span>
            </div>
            <div className="text-lg font-semibold">
              {/* Aici poți adăuga numărul curent de mașini din baza de date */}
              --
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-1">
              <CheckCircle className="h-4 w-4" />
              <span>Rate succes</span>
            </div>
            <div className="text-lg font-semibold">
              {importStats.total > 0 
                ? `${Math.round((importStats.imported / importStats.total) * 100)}%`
                : '--'
              }
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AutovitImport
