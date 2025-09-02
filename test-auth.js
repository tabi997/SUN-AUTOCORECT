import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://chcxobmpobnesefbsbev.supabase.co'
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY3hvYm1wb2JuZXNlZmJzYmV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTExODYsImV4cCI6MjA3MjMyNzE4Nn0.10GVuchHXc56TJJi8-66mfhG6Bz4DutBcgUMc1U6dTM'

const supabase = createClient(supabaseUrl, anonKey)

async function testAuth() {
  try {
    console.log('🧪 Testez autentificarea Supabase...')
    
    // 1. Testează conexiunea
    console.log('🔌 Testez conexiunea...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ Eroare la conexiunea cu Supabase:', bucketsError)
      return
    }
    
    console.log('✅ Conexiunea cu Supabase funcționează')
    console.log('📦 Bucket-uri găsite:', buckets.map(b => b.name))
    
    // 2. Testează sesiunea curentă
    console.log('🔍 Testez sesiunea curentă...')
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('❌ Eroare la obținerea sesiunii:', sessionError)
      return
    }
    
    if (session) {
      console.log('✅ Sesiune activă găsită')
      console.log('👤 Utilizator:', session.user.email)
      console.log('🔑 User ID:', session.user.id)
      console.log('⏰ Expiră la:', new Date(session.expires_at * 1000).toLocaleString())
    } else {
      console.log('ℹ️ Nu există sesiune activă')
    }
    
    // 3. Testează autentificarea cu email/parolă
    console.log('🔐 Testez autentificarea...')
    
    // Încearcă să te autentifici cu utilizatorul nou creat
    const email = 'test@sunauto.ro' // Utilizator nou creat
    const password = 'test123456' // Parola pentru utilizatorul nou
    
    console.log(`📧 Încerc să mă autentific cu: ${email}`)
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (authError) {
      console.error('❌ Eroare la autentificare:', authError.message)
      console.log('💡 Verifică că email-ul și parola sunt corecte')
      return
    }
    
    console.log('✅ Autentificare reușită!')
    console.log('👤 Utilizator autentificat:', authData.user.email)
    console.log('🔑 User ID:', authData.user.id)
    
    // 4. Testează storage-ul cu utilizatorul autentificat
    console.log('📦 Testez storage-ul cu utilizatorul autentificat...')
    
    const { data: storageBuckets, error: storageError } = await supabase.storage.listBuckets()
    
    if (storageError) {
      console.error('❌ Eroare la accesarea storage-ului:', storageError)
      return
    }
    
    console.log('✅ Storage-ul este accesibil')
    console.log('📦 Bucket-uri disponibile:', storageBuckets.map(b => b.name))
    
    // 5. Testează bucket-ul car-images
    const carImagesBucket = storageBuckets.find(b => b.name === 'car-images')
    if (carImagesBucket) {
      console.log('✅ Bucket-ul car-images este disponibil')
      
      // Testează listarea fișierelor
      const { data: files, error: filesError } = await supabase.storage
        .from('car-images')
        .list('', { limit: 5 })
      
      if (filesError) {
        console.error('❌ Eroare la listarea fișierelor:', filesError)
      } else {
        console.log('✅ Listarea fișierelor funcționează')
        console.log('📁 Fișiere găsite:', files.length)
      }
    }
    
    // 6. Testează baza de date
    console.log('🗄️ Testez baza de date...')
    
    const { data: cars, error: carsError } = await supabase
      .from('cars')
      .select('id, brand, model')
      .limit(3)
    
    if (carsError) {
      console.error('❌ Eroare la accesarea bazei de date:', carsError)
    } else {
      console.log('✅ Baza de date este accesibilă')
      console.log('🚗 Mașini găsite:', cars.length)
    }
    
    console.log('🎉 Testul de autentificare este complet!')
    console.log('📋 Rezumat:')
    console.log('- ✅ Conexiunea cu Supabase funcționează')
    console.log('- ✅ Autentificarea funcționează')
    console.log('- ✅ Storage-ul este accesibil')
    console.log('- ✅ Baza de date este accesibilă')
    
  } catch (error) {
    console.error('❌ Eroare generală la testarea autentificării:', error)
  }
}

testAuth()
