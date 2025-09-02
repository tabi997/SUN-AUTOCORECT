import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://chcxobmpobnesefbsbev.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY3hvYm1wb2JuZXNlZmJzYmV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njc1MTE4NiwiZXhwIjoyMDcyMzI3MTg2fQ.JsdnLEEt7in1NfEPNGyNGq2agMZbikEVjazUAqXp-gM'

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function setupStorage() {
  try {
    console.log('🚀 Configurare Supabase Storage...')
    
    // 1. Verifică bucket-urile existente
    console.log('📦 Verific bucket-urile existente...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ Eroare la listarea bucket-urilor:', bucketsError)
      return
    }
    
    console.log('✅ Bucket-uri găsite:', buckets.map(b => b.name))
    
    // 2. Creează bucket-ul car-images dacă nu există
    const carImagesBucket = buckets.find(b => b.name === 'car-images')
    if (!carImagesBucket) {
      console.log('📦 Creez bucket-ul car-images...')
      const { data: newBucket, error: createError } = await supabase.storage.createBucket('car-images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/*']
      })
      
      if (createError) {
        console.error('❌ Eroare la crearea bucket-ului:', createError)
        return
      }
      
      console.log('✅ Bucket-ul car-images a fost creat:', newBucket)
    } else {
      console.log('✅ Bucket-ul car-images există deja')
    }
    
    // 3. Configurează policies pentru bucket-ul car-images
    console.log('🔐 Configurez policies pentru car-images...')
    
    // Policy pentru SELECT (citire publică)
    const selectPolicy = `
      CREATE POLICY "Images are publicly accessible" ON storage.objects
      FOR SELECT USING (bucket_id = 'car-images');
    `
    
    // Policy pentru INSERT (upload pentru utilizatori autentificați)
    const insertPolicy = `
      CREATE POLICY "Authenticated users can upload images" ON storage.objects
      FOR INSERT WITH CHECK (
        bucket_id = 'car-images' 
        AND auth.role() = 'authenticated'
      );
    `
    
    // Policy pentru UPDATE (modificare pentru utilizatori autentificați)
    const updatePolicy = `
      CREATE POLICY "Authenticated users can update images" ON storage.objects
      FOR UPDATE USING (
        bucket_id = 'car-images' 
        AND auth.role() = 'authenticated'
      );
    `
    
    // Policy pentru DELETE (ștergere pentru utilizatori autentificați)
    const deletePolicy = `
      CREATE POLICY "Authenticated users can delete images" ON storage.objects
      FOR DELETE USING (
        bucket_id = 'car-images' 
        AND auth.role() = 'authenticated'
      );
    `
    
    // 4. Rulează policies-urile
    console.log('📝 Rulez policies-urile...')
    
    try {
      await supabase.rpc('exec_sql', { sql: selectPolicy })
      console.log('✅ Policy SELECT creat')
    } catch (error) {
      console.log('ℹ️ Policy SELECT există deja sau eroare:', error.message)
    }
    
    try {
      await supabase.rpc('exec_sql', { sql: insertPolicy })
      console.log('✅ Policy INSERT creat')
    } catch (error) {
      console.log('ℹ️ Policy INSERT există deja sau eroare:', error.message)
    }
    
    try {
      await supabase.rpc('exec_sql', { sql: updatePolicy })
      console.log('✅ Policy UPDATE creat')
    } catch (error) {
      console.log('ℹ️ Policy UPDATE există deja sau eroare:', error.message)
    }
    
    try {
      await supabase.rpc('exec_sql', { sql: deletePolicy })
      console.log('✅ Policy DELETE creat')
    } catch (error) {
      console.log('ℹ️ Policy DELETE există deja sau eroare:', error.message)
    }
    
    // 5. Testează configurația
    console.log('🧪 Testez configurația...')
    
    // Testează listarea bucket-urilor
    const { data: testBuckets, error: testError } = await supabase.storage.listBuckets()
    if (testError) {
      console.error('❌ Eroare la testarea bucket-urilor:', testError)
      return
    }
    
    const carImagesTest = testBuckets.find(b => b.name === 'car-images')
    if (carImagesTest) {
      console.log('✅ Bucket-ul car-images este configurat corect')
      console.log('📊 Detalii bucket:', {
        name: carImagesTest.name,
        public: carImagesTest.public,
        fileSizeLimit: carImagesTest.fileSizeLimit,
        allowedMimeTypes: carImagesTest.allowedMimeTypes
      })
    }
    
    console.log('🎉 Configurarea Supabase Storage este completă!')
    console.log('📋 Următorii pași:')
    console.log('1. Restart aplicația')
    console.log('2. Testează upload-ul de imagini')
    console.log('3. Verifică consola pentru mesaje de succes')
    
  } catch (error) {
    console.error('❌ Eroare la configurarea storage:', error)
  }
}

setupStorage()
