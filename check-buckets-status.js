import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://chcxobmpobnesefbsbev.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY3hvYm1wb2JuZXNlZmJzYmV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njc1MTE4NiwiZXhwIjoyMDcyMzI3MTg2fQ.JsdnLEEt7in1NfEPNGyNGq2agMZbikEVjazUAqXp-gM'

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function checkBucketsStatus() {
  try {
    console.log('🔍 Verific starea bucket-urilor în Supabase...')
    
    // 1. Verific bucket-urile cu service role
    console.log('📦 Verific bucket-urile cu service role...')
    
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ Eroare la listarea bucket-urilor cu service role:', bucketsError)
      return
    }
    
    console.log('✅ Bucket-uri găsite cu service role:', buckets.map(b => b.name))
    
    // 2. Verific fiecare bucket în detaliu
    for (const bucket of buckets) {
      console.log(`\n📋 Detalii pentru bucket-ul: ${bucket.name}`)
      console.log('  - ID:', bucket.id)
      console.log('  - Public:', bucket.public)
      console.log('  - File size limit:', bucket.file_size_limit)
      console.log('  - Allowed mime types:', bucket.allowed_mime_types)
      console.log('  - Created at:', bucket.created_at)
      console.log('  - Updated at:', bucket.updated_at)
      
      // Verific dacă bucket-ul este accesibil
      try {
        const { data: files, error: listError } = await supabase.storage
          .from(bucket.name)
          .list('', { limit: 1 })
        
        if (listError) {
          console.log(`  ❌ Nu se pot lista fișierele: ${listError.message}`)
        } else {
          console.log(`  ✅ Se pot lista fișierele: ${files.length} fișiere găsite`)
        }
      } catch (error) {
        console.log(`  ❌ Eroare la accesarea bucket-ului: ${error.message}`)
      }
    }
    
    // 3. Verific dacă bucket-ul car-images există și este configurat corect
    const carImagesBucket = buckets.find(b => b.name === 'car-images')
    
    if (!carImagesBucket) {
      console.log('\n❌ Bucket-ul car-images NU există!')
      console.log('🔧 Creez bucket-ul car-images...')
      
      try {
        const { data: newBucket, error: createError } = await supabase.storage.createBucket('car-images', {
          public: true,
          file_size_limit: 52428800, // 50MB
          allowed_mime_types: ['image/*']
        })
        
        if (createError) {
          console.error('❌ Nu s-a putut crea bucket-ul car-images:', createError.message)
        } else {
          console.log('✅ Bucket-ul car-images a fost creat cu succes!')
          console.log('  - ID:', newBucket.id)
          console.log('  - Public:', newBucket.public)
        }
      } catch (error) {
        console.error('❌ Eroare la crearea bucket-ului car-images:', error.message)
      }
    } else {
      console.log('\n✅ Bucket-ul car-images există și este configurat corect!')
      
      // Verific dacă este public
      if (!carImagesBucket.public) {
        console.log('🔧 Setez bucket-ul ca public...')
        
        try {
          const { data: updateData, error: updateError } = await supabase.storage.updateBucket('car-images', {
            public: true
          })
          
          if (updateError) {
            console.error('❌ Nu s-a putut seta bucket-ul ca public:', updateError.message)
          } else {
            console.log('✅ Bucket-ul a fost setat ca public')
          }
        } catch (error) {
          console.error('❌ Eroare la setarea bucket-ului ca public:', error.message)
        }
      }
    }
    
    // 4. Testez cu anon key
    console.log('\n🧪 Testez cu anon key...')
    
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY3hvYm1wb2JuZXNlZmJzYmV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTExODYsImV4cCI6MjA3MjMyNzE4Nn0.10GVuchHXc56TJJi8-66mfhG6Bz4DutBcgUMc1U6dTM'
    const anonSupabase = createClient(supabaseUrl, anonKey)
    
    const { data: anonBuckets, error: anonError } = await anonSupabase.storage.listBuckets()
    
    if (anonError) {
      console.error('❌ Anon key nu poate accesa bucket-urile:', anonError)
    } else {
      console.log('✅ Anon key poate accesa bucket-urile:', anonBuckets.map(b => b.name))
    }
    
    // 5. Testez accesul direct la bucket-ul car-images
    console.log('\n🧪 Testez accesul direct la bucket-ul car-images...')
    
    try {
      const { data: files, error: listError } = await anonSupabase.storage
        .from('car-images')
        .list('', { limit: 1 })
      
      if (listError) {
        console.error('❌ Nu se poate accesa bucket-ul car-images:', listError.message)
      } else {
        console.log('✅ Bucket-ul car-images este accesibil:', files.length, 'fișiere găsite')
      }
    } catch (error) {
      console.error('❌ Eroare la accesarea bucket-ului car-images:', error.message)
    }
    
    console.log('\n🎉 Verificarea stării bucket-urilor este completă!')
    
  } catch (error) {
    console.error('❌ Eroare la verificarea stării bucket-urilor:', error)
  }
}

checkBucketsStatus()
