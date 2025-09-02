import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://chcxobmpobnesefbsbev.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY3hvYm1wb2JuZXNlZmJzYmV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njc1MTE4NiwiZXhwIjoyMDcyMzI3MTg2fQ.JsdnLEEt7in1NfEPNGyNGq2agMZbikEVjazUAqXp-gM'

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function fixPolicies() {
  try {
    console.log('🔧 Verific și corectez policies-urile Supabase Storage...')
    
    // 1. Verific bucket-urile
    console.log('📦 Verific bucket-urile...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ Eroare la listarea bucket-urilor:', bucketsError)
      return
    }
    
    console.log('✅ Bucket-uri găsite:', buckets.map(b => b.name))
    
    // 2. Verific policies-urile existente
    console.log('🔍 Verific policies-urile existente...')
    
    // 3. Șterg policies-urile vechi dacă există
    console.log('🗑️ Șterg policies-urile vechi...')
    
    const dropPolicies = `
      DROP POLICY IF EXISTS "Images are publicly accessible" ON storage.objects;
      DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
      DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
      DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
    `
    
    try {
      await supabase.rpc('exec_sql', { sql: dropPolicies })
      console.log('✅ Policies-urile vechi au fost șterse')
    } catch (error) {
      console.log('ℹ️ Nu s-au putut șterge policies-urile vechi:', error.message)
    }
    
    // 4. Creez policies-urile corecte
    console.log('📝 Creez policies-urile corecte...')
    
    // Policy pentru SELECT (citire publică pentru toți)
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
    
    // 5. Rulează policies-urile
    console.log('🚀 Rulez policies-urile...')
    
    try {
      await supabase.rpc('exec_sql', { sql: selectPolicy })
      console.log('✅ Policy SELECT creat')
    } catch (error) {
      console.log('❌ Eroare la crearea policy SELECT:', error.message)
    }
    
    try {
      await supabase.rpc('exec_sql', { sql: insertPolicy })
      console.log('✅ Policy INSERT creat')
    } catch (error) {
      console.log('❌ Eroare la crearea policy INSERT:', error.message)
    }
    
    try {
      await supabase.rpc('exec_sql', { sql: updatePolicy })
      console.log('✅ Policy UPDATE creat')
    } catch (error) {
      console.log('❌ Eroare la crearea policy UPDATE:', error.message)
    }
    
    try {
      await supabase.rpc('exec_sql', { sql: deletePolicy })
      console.log('✅ Policy DELETE creat')
    } catch (error) {
      console.log('❌ Eroare la crearea policy DELETE:', error.message)
    }
    
    // 6. Verific că bucket-ul este public
    console.log('🔓 Verific că bucket-ul este public...')
    
    try {
      const { data: bucketUpdate, error: updateError } = await supabase.storage.updateBucket('car-images', {
        public: true
      })
      
      if (updateError) {
        console.log('ℹ️ Bucket-ul este deja public sau nu s-a putut actualiza:', updateError.message)
      } else {
        console.log('✅ Bucket-ul a fost setat ca public')
      }
    } catch (error) {
      console.log('ℹ️ Nu s-a putut actualiza bucket-ul:', error.message)
    }
    
    // 7. Testează cu anon key
    console.log('🧪 Testez cu anon key...')
    
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY3hvYm1wb2JuZXNlZmJzYmV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTExODYsImV4cCI6MjA3MjMyNzE4Nn0.10GVuchHXc56TJJi8-66mfhG6Bz4DutBcgUMc1U6dTM'
    const anonSupabase = createClient(supabaseUrl, anonKey)
    
    const { data: anonBuckets, error: anonError } = await anonSupabase.storage.listBuckets()
    
    if (anonError) {
      console.error('❌ Anon key nu poate accesa bucket-urile:', anonError)
    } else {
      console.log('✅ Anon key poate accesa bucket-urile:', anonBuckets.map(b => b.name))
    }
    
    console.log('🎉 Configurarea policies-urilor este completă!')
    console.log('📋 Următorii pași:')
    console.log('1. Restart aplicația')
    console.log('2. Testează din nou cu test-auth.js')
    console.log('3. Verifică consola pentru mesaje de succes')
    
  } catch (error) {
    console.error('❌ Eroare la configurarea policies-urilor:', error)
  }
}

fixPolicies()
