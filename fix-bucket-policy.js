import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://chcxobmpobnesefbsbev.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY3hvYm1wb2JuZXNlZmJzYmV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njc1MTE4NiwiZXhwIjoyMDcyMzI3MTg2fQ.JsdnLEEt7in1NfEPNGyNGq2agMZbikEVjazUAqXp-gM'

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function fixBucketPolicy() {
  try {
    console.log('🔧 Configurez policy-ul pentru listarea bucket-urilor...')
    
    // 1. Verific bucket-urile cu service role
    console.log('📦 Verific bucket-urile cu service role...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ Eroare la listarea bucket-urilor cu service role:', bucketsError)
      return
    }
    
    console.log('✅ Bucket-uri găsite cu service role:', buckets.map(b => b.name))
    
    // 2. Creez policy pentru listarea bucket-urilor
    console.log('📝 Creez policy pentru listarea bucket-urilor...')
    
    const bucketListPolicy = `
      CREATE POLICY "Allow listing buckets" ON storage.buckets
      FOR SELECT USING (true);
    `
    
    try {
      await supabase.rpc('exec_sql', { sql: bucketListPolicy })
      console.log('✅ Policy pentru listarea bucket-urilor creat')
    } catch (error) {
      console.log('ℹ️ Policy-ul există deja sau eroare:', error.message)
    }
    
    // 3. Creez policy pentru listarea obiectelor din bucket
    console.log('📝 Creez policy pentru listarea obiectelor...')
    
    const objectListPolicy = `
      CREATE POLICY "Allow listing objects" ON storage.objects
      FOR SELECT USING (bucket_id = 'car-images');
    `
    
    try {
      await supabase.rpc('exec_sql', { sql: objectListPolicy })
      console.log('✅ Policy pentru listarea obiectelor creat')
    } catch (error) {
      console.log('ℹ️ Policy-ul există deja sau eroare:', error.message)
    }
    
    // 4. Testează cu anon key
    console.log('🧪 Testez cu anon key...')
    
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY3hvYm1wb2JuZXNlZmJzYmV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTExODYsImV4cCI6MjA3MjMyNzE4Nn0.10GVuchHXc56TJJi8-66mfhG6Bz4DutBcgUMc1U6dTM'
    const anonSupabase = createClient(supabaseUrl, anonKey)
    
    const { data: anonBuckets, error: anonError } = await anonSupabase.storage.listBuckets()
    
    if (anonError) {
      console.error('❌ Anon key nu poate accesa bucket-urile:', anonError)
    } else {
      console.log('✅ Anon key poate accesa bucket-urile:', anonBuckets.map(b => b.name))
    }
    
    // 5. Testează listarea obiectelor din bucket
    console.log('🧪 Testez listarea obiectelor din bucket...')
    
    const { data: objects, error: objectsError } = await anonSupabase.storage
      .from('car-images')
      .list('', { limit: 5 })
    
    if (objectsError) {
      console.error('❌ Anon key nu poate lista obiectele:', objectsError)
    } else {
      console.log('✅ Anon key poate lista obiectele:', objects.length, 'obiecte găsite')
    }
    
    console.log('🎉 Configurarea policy-urilor pentru bucket-uri este completă!')
    
  } catch (error) {
    console.error('❌ Eroare la configurarea policy-urilor pentru bucket-uri:', error)
  }
}

fixBucketPolicy()
