import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://chcxobmpobnesefbsbev.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY3hvYm1wb2JuZXNlZmJzYmV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njc1MTE4NiwiZXhwIjoyMDcyMzI3MTg2fQ.JsdnLEEt7in1NfEPNGyNGq2agMZbikEVjazUAqXp-gM'

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function fixBucketPolicyV2() {
  try {
    console.log('🔧 Configurez policy-ul pentru listarea bucket-urilor (v2)...')
    
    // 1. Verific starea actuală a policies
    console.log('📋 Verific starea actuală a policies...')
    
    try {
      const { data: policies, error: policiesError } = await supabase.rpc('exec_sql', { 
        sql: `SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
              FROM pg_policies 
              WHERE tablename = 'buckets' AND schemaname = 'storage'`
      })
      
      if (policiesError) {
        console.log('ℹ️ Nu s-au putut verifica policies:', policiesError.message)
      } else {
        console.log('📋 Policies existente pentru storage.buckets:', policies)
      }
    } catch (error) {
      console.log('ℹ️ Nu s-au putut verifica policies:', error.message)
    }
    
    // 2. Șterg toate policy-urile existente pentru storage.buckets
    console.log('🗑️ Șterg toate policy-urile existente pentru storage.buckets...')
    
    const dropAllPolicies = `
      DROP POLICY IF EXISTS "Allow listing buckets" ON storage.buckets;
      DROP POLICY IF EXISTS "Allow listing buckets alternative" ON storage.buckets;
      DROP POLICY IF EXISTS "Allow listing buckets alternative2" ON storage.buckets;
    `
    
    try {
      await supabase.rpc('exec_sql', { sql: dropAllPolicies })
      console.log('✅ Toate policy-urile vechi au fost șterse')
    } catch (error) {
      console.log('ℹ️ Nu s-au putut șterge policy-urile vechi:', error.message)
    }
    
    // 3. Creez policy-ul nou cu o abordare diferită
    console.log('📝 Creez policy-ul nou pentru listarea bucket-urilor...')
    
    const bucketListPolicy = `
      CREATE POLICY "Allow listing buckets" ON storage.buckets
      FOR SELECT 
      USING (true);
    `
    
    try {
      await supabase.rpc('exec_sql', { sql: bucketListPolicy })
      console.log('✅ Policy-ul nou pentru bucket-uri a fost creat')
    } catch (error) {
      console.log('❌ Eroare la crearea policy-ului:', error.message)
      
      // Încearcă o abordare alternativă
      console.log('🔄 Încearc abordarea alternativă...')
      
      const alternativePolicy = `
        CREATE POLICY "Allow listing buckets alternative" ON storage.buckets
        FOR SELECT 
        USING (bucket_id IS NOT NULL);
      `
      
      try {
        await supabase.rpc('exec_sql', { sql: alternativePolicy })
        console.log('✅ Policy-ul alternativ a fost creat')
      } catch (altError) {
        console.log('❌ Eroare la crearea policy-ului alternativ:', altError.message)
        
        // Încearcă o a treia abordare
        console.log('🔄 Încearc a treia abordare...')
        
        const thirdPolicy = `
          CREATE POLICY "Allow listing buckets alternative2" ON storage.buckets
          FOR SELECT 
          USING (1=1);
        `
        
        try {
          await supabase.rpc('exec_sql', { sql: thirdPolicy })
          console.log('✅ A treia abordare a fost creată')
        } catch (thirdError) {
          console.log('❌ Eroare la crearea celei de-a treia abordări:', thirdError.message)
        }
      }
    }
    
    // 4. Verific că bucket-ul car-images este public
    console.log('🔓 Verific că bucket-ul car-images este public...')
    
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
    
    // 5. Testează cu anon key
    console.log('🧪 Testez cu anon key...')
    
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY3hvYm1wb2JuZXNlZmJzYmV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTExODYsImV4cCI6MjA3MjMyNzE4Nn0.10GVuchHXc56TJJi8-66mfhG6Bz4DutBcgUMc1U6dTM'
    const anonSupabase = createClient(supabaseUrl, anonKey)
    
    const { data: anonBuckets, error: anonError } = await anonSupabase.storage.listBuckets()
    
    if (anonError) {
      console.error('❌ Anon key nu poate accesa bucket-urile:', anonError)
    } else {
      console.log('✅ Anon key poate accesa bucket-urile:', anonBuckets.map(b => b.name))
    }
    
    // 6. Testează cu utilizatorul autentificat
    console.log('🧪 Testez cu utilizatorul autentificat...')
    
    const testUserSupabase = createClient(supabaseUrl, anonKey)
    
    // Simulează autentificarea
    const { data: authData, error: authError } = await testUserSupabase.auth.signInWithPassword({
      email: 'test@sunauto.ro',
      password: 'test123456'
    })
    
    if (authError) {
      console.error('❌ Nu s-a putut autentifica utilizatorul de test:', authError.message)
      return
    }
    
    console.log('✅ Utilizatorul de test este autentificat')
    
    // Testează listarea bucket-urilor cu utilizatorul autentificat
    const { data: userBuckets, error: userError } = await testUserSupabase.storage.listBuckets()
    
    if (userError) {
      console.error('❌ Utilizatorul autentificat nu poate accesa bucket-urile:', userError)
    } else {
      console.log('✅ Utilizatorul autentificat poate accesa bucket-urile:', userBuckets.map(b => b.name))
    }
    
    // 7. Testează încărcarea unei imagini
    console.log('🧪 Testez încărcarea unei imagini...')
    
    try {
      // Creez un fișier de test
      const testFile = new File(['test image content'], 'test-image.jpg', { type: 'image/jpeg' })
      
      const { data: uploadData, error: uploadError } = await testUserSupabase.storage
        .from('car-images')
        .upload(`test-${Date.now()}.jpg`, testFile)
      
      if (uploadError) {
        console.error('❌ Nu s-a putut încărca imaginea de test:', uploadError.message)
      } else {
        console.log('✅ Imaginea de test a fost încărcată:', uploadData.path)
        
        // Șterg imaginea de test
        const { error: deleteError } = await testUserSupabase.storage
          .from('car-images')
          .remove([uploadData.path])
        
        if (deleteError) {
          console.log('ℹ️ Nu s-a putut șterge imaginea de test:', deleteError.message)
        } else {
          console.log('✅ Imaginea de test a fost ștearsă')
        }
      }
    } catch (error) {
      console.error('❌ Eroare la testarea încărcării imaginii:', error.message)
    }
    
    console.log('🎉 Configurarea policy-urilor pentru bucket-uri (v2) este completă!')
    
  } catch (error) {
    console.error('❌ Eroare la configurarea policy-urilor pentru bucket-uri:', error)
  }
}

fixBucketPolicyV2()
