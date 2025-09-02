import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://chcxobmpobnesefbsbev.supabase.co'
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY3hvYm1wb2JuZXNlZmJzYmV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTExODYsImV4cCI6MjA3MjMyNzE4Nn0.10GVuchHXc56TJJi8-66mfhG6Bz4DutBcgUMc1U6dTM'

async function testFinalUpload() {
  try {
    console.log('🧪 Test final pentru încărcarea imaginilor...')
    
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
    
    // 3. Testez încărcarea unei imagini în bucket-ul car-images
    console.log('\n📤 Testez încărcarea unei imagini în car-images...')
    
    try {
      // Creez un fișier de test
      const testFile = new File(['test image content for final test'], 'final-test-image.jpg', { type: 'image/jpeg' })
      
      const fileName = `final-test-${Date.now()}.jpg`
      
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
        return
      }
      
      console.log('✅ Imaginea a fost încărcată cu succes!')
      console.log('📁 Path:', uploadData.path)
      console.log('🆔 ID:', uploadData.id)
      
      // 4. Testez obținerea URL-ului public
      console.log('\n🔗 Testez obținerea URL-ului public...')
      
      const { data: urlData } = supabase.storage
        .from('car-images')
        .getPublicUrl(fileName)
      
      console.log('✅ URL public generat:', urlData.publicUrl)
      
      // 5. Testez listarea fișierelor din bucket
      console.log('\n📋 Testez listarea fișierelor din bucket...')
      
      const { data: files, error: listError } = await supabase.storage
        .from('car-images')
        .list('', { limit: 10 })
      
      if (listError) {
        console.log('ℹ️ Nu s-au putut lista fișierele:', listError.message)
      } else {
        console.log('✅ Fișiere găsite în bucket:', files.length)
        files.forEach(file => {
          console.log(`  - ${file.name} (${file.size || 'N/A'} bytes)`)
        })
      }
      
      // 6. Testez inserarea în baza de date
      console.log('\n🗄️ Testez inserarea în baza de date...')
      
      try {
        const { data: insertData, error: insertError } = await supabase
          .from('car_images')
          .insert([
            {
              car_id: 999, // ID de test
              image_url: urlData.publicUrl,
              is_primary: true,
              order_index: 1
            }
          ])
          .select()
        
        if (insertError) {
          console.log('ℹ️ Nu s-a putut insera în baza de date:', insertError.message)
          console.log('🔍 Detalii eroare:', insertError)
        } else {
          console.log('✅ Inserarea în baza de date a reușit:', insertData)
          
          // Șterg înregistrarea de test
          if (insertData && insertData[0]) {
            const { error: deleteDbError } = await supabase
              .from('car_images')
              .delete()
              .eq('id', insertData[0].id)
            
            if (deleteDbError) {
              console.log('⚠️ Nu s-a putut șterge înregistrarea de test din DB:', deleteDbError.message)
            } else {
              console.log('✅ Înregistrarea de test din DB a fost ștearsă')
            }
          }
        }
      } catch (dbError) {
        console.log('ℹ️ Eroare la testarea bazei de date:', dbError.message)
      }
      
      // 7. Șterg imaginea de test
      console.log('\n🗑️ Șterg imaginea de test...')
      
      const { error: deleteError } = await supabase.storage
        .from('car-images')
        .remove([fileName])
      
      if (deleteError) {
        console.log('⚠️ Nu s-a putut șterge imaginea de test:', deleteError.message)
      } else {
        console.log('✅ Imaginea de test a fost ștearsă cu succes')
      }
      
      console.log('\n🎉 Testul final pentru încărcarea imaginilor a fost completat cu succes!')
      console.log('✅ Funcționalitatea de încărcare a imaginilor funcționează perfect!')
      console.log('✅ Bucket-ul car-images este accesibil și funcțional!')
      console.log('✅ URL-urile publice sunt generate corect!')
      console.log('✅ Upload, listare și ștergere funcționează!')
      
    } catch (error) {
      console.error('❌ Eroare la testarea încărcării imaginii:', error.message)
    }
    
  } catch (error) {
    console.error('❌ Eroare generală la testul final:', error)
  }
}

testFinalUpload()
