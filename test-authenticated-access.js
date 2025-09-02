import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://chcxobmpobnesefbsbev.supabase.co'
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY3hvYm1wb2JuZXNlZmJzYmV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTExODYsImV4cCI6MjA3MjMyNzE4Nn0.10GVuchHXc56TJJi8-66mfhG6Bz4DutBcgUMc1U6dTM'

async function testAuthenticatedAccess() {
  try {
    console.log('🧪 Testez accesul autentificat la bucket-ul car-images...')
    
    // 1. Creez client-ul Supabase
    const supabase = createClient(supabaseUrl, anonKey)
    
    // 2. Autentific utilizatorul de test
    console.log('🔐 Autentific utilizatorul de test...')
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'test@sunauto.ro',
      password: 'test123456'
    })
    
    if (authError) {
      console.error('❌ Nu s-a putut autentifica utilizatorul de test:', authError.message)
      return
    }
    
    console.log('✅ Utilizatorul de test este autentificat:', authData.user.email)
    console.log('🔑 Session ID:', authData.session.access_token.substring(0, 20) + '...')
    
    // 3. Testez listarea bucket-urilor cu utilizatorul autentificat
    console.log('\n📦 Testez listarea bucket-urilor cu utilizatorul autentificat...')
    
    try {
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
      
      if (bucketsError) {
        console.error('❌ Eroare la listarea bucket-urilor:', bucketsError.message)
        console.log('🔍 Detalii eroare:', bucketsError)
      } else {
        console.log('✅ Bucket-uri găsite:', buckets.map(b => b.name))
      }
    } catch (error) {
      console.error('❌ Eroare la listarea bucket-urilor:', error.message)
    }
    
    // 4. Testez accesul direct la bucket-ul car-images
    console.log('\n📁 Testez accesul direct la bucket-ul car-images...')
    
    try {
      const { data: files, error: listError } = await supabase.storage
        .from('car-images')
        .list('', { limit: 5 })
      
      if (listError) {
        console.error('❌ Eroare la listarea fișierelor din car-images:', listError.message)
        console.log('🔍 Detalii eroare:', listError)
      } else {
        console.log('✅ Fișiere găsite în car-images:', files.length)
        files.forEach(file => {
          console.log(`  - ${file.name} (${file.size} bytes)`)
        })
      }
    } catch (error) {
      console.error('❌ Eroare la accesarea bucket-ului car-images:', error.message)
    }
    
    // 5. Testez încărcarea unei imagini
    console.log('\n📤 Testez încărcarea unei imagini...')
    
    try {
      // Creez un fișier de test
      const testFile = new File(['test image content for authenticated user'], 'test-auth-image.jpg', { type: 'image/jpeg' })
      
      const fileName = `test-auth-${Date.now()}.jpg`
      
      console.log('📁 Încerc să încarc:', fileName)
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(fileName, testFile, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (uploadError) {
        console.error('❌ Nu s-a putut încărca imaginea:', uploadError.message)
        console.log('🔍 Detalii eroare:', uploadError)
      } else {
        console.log('✅ Imaginea a fost încărcată cu succes!')
        console.log('📁 Path:', uploadData.path)
        console.log('🆔 ID:', uploadData.id)
        
        // Testez obținerea URL-ului public
        const { data: urlData } = supabase.storage
          .from('car-images')
          .getPublicUrl(fileName)
        
        console.log('🔗 URL public:', urlData.publicUrl)
        
        // Șterg imaginea de test
        const { error: deleteError } = await supabase.storage
          .from('car-images')
          .remove([fileName])
        
        if (deleteError) {
          console.log('⚠️ Nu s-a putut șterge imaginea de test:', deleteError.message)
        } else {
          console.log('✅ Imaginea de test a fost ștearsă')
        }
      }
    } catch (error) {
      console.error('❌ Eroare la testarea încărcării imaginii:', error.message)
    }
    
    // 6. Testez cu bucket-ul test-bucket ca fallback
    console.log('\n🔄 Testez cu bucket-ul test-bucket ca fallback...')
    
    try {
      const { data: files, error: listError } = await supabase.storage
        .from('test-bucket')
        .list('', { limit: 5 })
      
      if (listError) {
        console.error('❌ Eroare la listarea fișierelor din test-bucket:', listError.message)
      } else {
        console.log('✅ Fișiere găsite în test-bucket:', files.length)
      }
      
      // Testez încărcarea în test-bucket
      const testFile2 = new File(['test content'], 'test-fallback.txt', { type: 'text/plain' })
      const fileName2 = `test-fallback-${Date.now()}.txt`
      
      const { data: uploadData2, error: uploadError2 } = await supabase.storage
        .from('test-bucket')
        .upload(fileName2, testFile2)
      
      if (uploadError2) {
        console.error('❌ Nu s-a putut încărca în test-bucket:', uploadError2.message)
      } else {
        console.log('✅ Fișierul a fost încărcat în test-bucket:', uploadData2.path)
        
        // Șterg fișierul de test
        await supabase.storage.from('test-bucket').remove([fileName2])
        console.log('✅ Fișierul de test din test-bucket a fost șters')
      }
      
    } catch (error) {
      console.error('❌ Eroare la testarea test-bucket:', error.message)
    }
    
    console.log('\n🎉 Testul de acces autentificat este complet!')
    
  } catch (error) {
    console.error('❌ Eroare generală la testul de acces autentificat:', error)
  }
}

testAuthenticatedAccess()
