import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Upload, 
  X, 
  Star, 
  GripVertical, 
  Image as ImageIcon,
  Loader2,
  Trash2,
  Camera,
  AlertTriangle,
  CheckCircle,
  User
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { CarImage } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'

interface ImageUploadProps {
  carId: number
  existingImages: CarImage[]
  onImagesChange: (images: CarImage[]) => void
}

const ImageUpload = ({ carId, existingImages, onImagesChange }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [storageReady, setStorageReady] = useState(false)
  const [storageError, setStorageError] = useState<string | null>(null)
  const [checkingStorage, setCheckingStorage] = useState(true)
  const [bucketName, setBucketName] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { user, session } = useAuth()

  const maxImages = 20
  const remainingSlots = maxImages - existingImages.length

  // Verifică dacă storage-ul este configurat
  useEffect(() => {
    console.log('🔍 useEffect ImageUpload - user:', user?.email, 'session:', !!session)
    if (user && session) {
      console.log('✅ Utilizator autentificat, verific storage...')
      checkStorageBucket()
    } else {
      console.log('❌ Utilizator neautentificat sau fără sesiune')
      setStorageError('Utilizatorul nu este autentificat')
      setCheckingStorage(false)
    }
  }, [user, session])

  const checkStorageBucket = async () => {
    if (!user || !session) {
      setStorageError('Utilizatorul nu este autentificat')
      setStorageReady(false)
      setCheckingStorage(false)
      return
    }

    setCheckingStorage(true)
    setStorageError(null)
    
    try {
      console.log('🔍 Verific storage bucket...')
      console.log('👤 Utilizator autentificat:', user.email)
      console.log('🔑 Session valid:', !!session)
      
      // Nu mai încerc să listez bucket-urile - folosesc direct bucket-ul car-images
      console.log('📦 Folosesc direct bucket-ul car-images...')
      
      // Setez bucket-ul direct
      setBucketName('car-images')
      console.log('✅ Bucket-ul car-images a fost setat direct')
      
      // Test 2: Verifică permisiunile de write cu un fișier de test
      console.log('✍️ Testez permisiunile de upload...')
      const testFileName = `test_${Date.now()}.jpg`
      const testFile = new File(['test image content'], testFileName, { type: 'image/jpeg' })
      
      try {
        const { data: testUpload, error: testError } = await supabase.storage
          .from(bucketName)
          .upload(testFileName, testFile, {
            cacheControl: '3600',
            upsert: false
          })
        
        if (testError) {
          console.error('❌ Eroare la testarea upload-ului:', testError)
          setStorageError(`Eroare la testarea permisiunilor de upload: ${testError.message}`)
          setStorageReady(false)
          setCheckingStorage(false)
          return
        }
        
        console.log('✅ Permisiuni de upload OK, test upload reușit:', testUpload)
        
        // Test 3: Șterge fișierul de test
        console.log('🗑️ Șterg fișierul de test...')
        const { error: removeError } = await supabase.storage
          .from(bucketName)
          .remove([testFileName])
        
        if (removeError) {
          console.warn('⚠️ Nu s-a putut șterge fișierul de test:', removeError)
        } else {
          console.log('✅ Fișierul de test a fost șters cu succes')
        }
        
        // Test 4: Verifică dacă tabela car_images există
        console.log('🗄️ Verific dacă tabela car_images există...')
        try {
          const { data: testCar, error: tableError } = await supabase
            .from('car_images')
            .select('id')
            .limit(1)
          
          if (tableError) {
            console.error('❌ Eroare la accesarea tabelei car_images:', tableError)
            setStorageError(`Tabela car_images nu este accesibilă: ${tableError.message}`)
            setStorageReady(false)
            setCheckingStorage(false)
            return
          }
          
          console.log('✅ Tabela car_images este accesibilă')
          
        } catch (tableError) {
          console.error('❌ Eroare la verificarea tabelei car_images:', tableError)
          setStorageError(`Eroare la verificarea bazei de date: ${tableError}`)
          setStorageReady(false)
          setCheckingStorage(false)
          return
        }
        
        setStorageReady(true)
        setStorageError(null)
        console.log('🎉 Storage-ul este configurat corect și gata de utilizare!')
        
      } catch (testUploadError) {
        console.error('❌ Eroare la testarea upload-ului:', testUploadError)
        setStorageError(`Eroare la testarea permisiunilor: ${testUploadError}`)
        setStorageReady(false)
      }
      
    } catch (error) {
      console.error('❌ Eroare generală la verificarea storage:', error)
      setStorageError(`Eroare la verificarea configurației storage: ${error}`)
      setStorageReady(false)
    } finally {
      setCheckingStorage(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFiles = async (files: FileList) => {
    if (!storageReady) {
      toast({
        title: "Storage neconfigurat",
        description: "Bucket-ul de storage nu este configurat corect",
        variant: "destructive"
      })
      return
    }

    if (remainingSlots <= 0) {
      toast({
        title: "Limită atinsă",
        description: "Nu poți încărca mai mult de 20 de fotografii per anunț",
        variant: "destructive"
      })
      return
    }

    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Tip de fișier invalid",
          description: `${file.name} nu este o imagine validă`,
          variant: "destructive"
        })
        return false
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Fișier prea mare",
          description: `${file.name} depășește limita de 5MB`,
          variant: "destructive"
        })
        return false
      }
      
      return true
    })

    if (validFiles.length === 0) return

    setUploading(true)
    
    try {
      const uploadedImages: CarImage[] = []
      
      for (let i = 0; i < Math.min(validFiles.length, remainingSlots); i++) {
        const file = validFiles[i]
        const fileName = `${carId}_${Date.now()}_${i}_${file.name}`
        
        console.log('📤 Încerc să încarc fișierul:', fileName)
        
        // Upload la Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })
        
        if (uploadError) {
          console.error('❌ Eroare la upload în storage:', uploadError)
          throw new Error(`Eroare la upload: ${uploadError.message}`)
        }
        
        console.log('✅ Fișier încărcat în storage:', uploadData)
        
        // Obține URL-ul public
        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(fileName)
        
        console.log('🔗 URL public obținut:', urlData)
        
        const newImage = {
          car_id: carId,
          image_url: urlData.publicUrl,
          image_name: file.name,
          is_primary: existingImages.length === 0 && i === 0, // Prima imagine devine principală
          order_index: existingImages.length + i
        }
        
        uploadedImages.push(newImage as CarImage)
      }
      
      console.log('💾 Încerc să adaug imaginile în baza de date:', uploadedImages)
      
      // Adaugă imaginile în baza de date
      const { data: dbImages, error: dbError } = await supabase
        .from('car_images')
        .insert(uploadedImages)
        .select()
      
      if (dbError) {
        console.error('❌ Eroare la inserarea în baza de date:', dbError)
        throw new Error(`Eroare la salvarea în baza de date: ${dbError.message}`)
      }
      
      console.log('✅ Imagini salvate în baza de date:', dbImages)
      
      // Actualizează lista de imagini
      const updatedImages = [...existingImages, ...(dbImages || [])]
      onImagesChange(updatedImages)
      
      toast({
        title: "Succes",
        description: `${uploadedImages.length} fotografii au fost încărcate cu succes`
      })
      
    } catch (error) {
      console.error('❌ Eroare la upload:', error)
      
      let errorMessage = "A apărut o eroare la încărcarea fotografiilor"
      
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      toast({
        title: "Eroare",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const setPrimaryImage = async (imageId: number) => {
    try {
      // Resetează toate imaginile ca non-primare
      await supabase
        .from('car_images')
        .update({ is_primary: false })
        .eq('car_id', carId)
      
      // Setează imaginea selectată ca primară
      await supabase
        .from('car_images')
        .update({ is_primary: true })
        .eq('id', imageId)
      
      // Actualizează lista locală
      const updatedImages = existingImages.map(img => ({
        ...img,
        is_primary: img.id === imageId
      }))
      onImagesChange(updatedImages)
      
      toast({
        title: "Succes",
        description: "Imaginea principală a fost actualizată"
      })
      
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza imaginea principală",
        variant: "destructive"
      })
    }
  }

  const deleteImage = async (imageId: number) => {
    try {
      const imageToDelete = existingImages.find(img => img.id === imageId)
      if (!imageToDelete) return
      
      // Șterge din baza de date
      await supabase
        .from('car_images')
        .delete()
        .eq('id', imageId)
      
      // Șterge din storage (opțional - poți să păstrezi fișierele)
      // await supabase.storage.from('car-images').remove([imageToDelete.image_name])
      
      // Actualizează lista locală
      const updatedImages = existingImages.filter(img => img.id !== imageId)
      onImagesChange(updatedImages)
      
      toast({
        title: "Succes",
        description: "Imaginea a fost ștearsă cu succes"
      })
      
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut șterge imaginea",
        variant: "destructive"
      })
    }
  }

  const reorderImages = async (fromIndex: number, toIndex: number) => {
    try {
      const newImages = [...existingImages]
      const [movedImage] = newImages.splice(fromIndex, 1)
      newImages.splice(toIndex, 0, movedImage)
      
      // Actualizează ordinea în baza de date
      const updates = newImages.map((img, index) => ({
        id: img.id,
        order_index: index
      }))
      
      await supabase
        .from('car_images')
        .upsert(updates, { onConflict: 'id' })
      
      // Actualizează lista locală
      onImagesChange(newImages)
      
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut reordona imaginile",
        variant: "destructive"
      })
    }
  }

  // Dacă storage-ul nu este configurat, afișează mesaj de eroare
  if (checkingStorage) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Verificare Storage...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/10 border border-muted/20 rounded-lg p-4 text-center">
              <p className="text-muted-foreground font-medium mb-2">
                Verificând configurația storage-ului...
              </p>
              <p className="text-sm text-muted-foreground/80">
                Acest proces poate dura câteva momente.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!storageReady) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Storage Neconfigurat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-destructive font-medium mb-2">
                {storageError || 'Storage-ul Supabase nu este configurat corect'}
              </p>
              <p className="text-sm text-destructive/80 mb-4">
                Pentru a încărca fotografii, trebuie să configurezi storage-ul în Supabase Dashboard.
              </p>
              
              <div className="space-y-2 text-sm">
                <h4 className="font-medium">Pași de configurare:</h4>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Accesează Supabase Dashboard → Storage</li>
                  <li>Creează un bucket nou: <code className="bg-destructive/20 px-1 rounded">car-images</code> (recomandat) sau <code className="bg-destructive/20 px-1 rounded">test-bucket</code></li>
                  <li>Setă bucket-ul ca public</li>
                  <li>Adaugă permisiuni de upload pentru utilizatori autentificați</li>
                  <li>Verifică că policies sunt configurate corect pentru INSERT, SELECT, UPDATE, DELETE</li>
                </ol>
                
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">Bucket-uri găsite:</h5>
                  <p className="text-sm text-blue-700">
                    {bucketName ? `Bucket selectat: ${bucketName}` : 'Nu s-a găsit niciun bucket potrivit'}
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={checkStorageBucket} 
                variant="outline" 
                className="mt-4"
              >
                Verifică din nou
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Gestionare Fotografii
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            Poți încărca până la {maxImages} fotografii pentru această mașină. 
            {remainingSlots > 0 ? ` Mai ai ${remainingSlots} sloturi disponibile.` : ' Ai atins limita maximă.'}
            {bucketName && (
              <span className="block mt-1 text-green-600">
                ✅ Storage configurat: {bucketName}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Zone */}
          {remainingSlots > 0 && (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                {dragActive ? 'Eliberează pentru a încărca' : 'Trage și eliberează fotografii aici'}
              </h3>
              <p className="text-muted-foreground mb-4">
                sau <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary hover:underline font-medium"
                >
                  selectează fișiere
                </button>
              </p>
              <p className="text-sm text-muted-foreground">
                Formate acceptate: JPG, PNG, GIF. Dimensiune maximă: 5MB per fișier.
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Se încarcă fotografii...</span>
            </div>
          )}

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Fotografii încărcate ({existingImages.length})</h4>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {existingImages.map((image, index) => (
                  <div key={image.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors">
                      <img
                        src={image.image_url}
                        alt={image.image_name || `Imagine ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Overlay Controls */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setPrimaryImage(image.id)}
                            disabled={image.is_primary}
                            className="h-8 w-8 p-0"
                          >
                            <Star className={`h-4 w-4 ${image.is_primary ? 'text-yellow-400 fill-current' : ''}`} />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteImage(image.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Primary Badge */}
                      {image.is_primary && (
                        <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Principală
                        </Badge>
                      )}
                      
                      {/* Order Badge */}
                      <Badge variant="secondary" className="absolute top-2 right-2">
                        {image.order_index + 1}
                      </Badge>
                    </div>
                    
                    {/* Drag Handle */}
                    <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    </div>
                    
                    {/* Image Name */}
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {image.image_name || `Imagine ${index + 1}`}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Reorder Instructions */}
              <div className="text-sm text-muted-foreground text-center">
                <p>Poți reordona imaginile prin drag & drop. Prima imagine va fi afișată ca principală.</p>
              </div>
            </div>
          )}

          {/* No Images Message */}
          {existingImages.length === 0 && !uploading && (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nu există fotografii încărcate pentru această mașină</p>
              <p className="text-sm">Încarcă prima fotografie pentru a începe</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ImageUpload

