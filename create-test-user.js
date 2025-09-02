import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://chcxobmpobnesefbsbev.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY3hvYm1wb2JuZXNlZmJzYmV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njc1MTE4NiwiZXhwIjoyMDcyMzI3MTg2fQ.JsdnLEEt7in1NfEPNGyNGq2agMZbikEVjazUAqXp-gM'

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function createTestUser() {
  try {
    console.log('👤 Creez utilizator de test...')
    
    const email = 'test@sunauto.ro'
    const password = 'test123456'
    
    // 1. Creez utilizatorul
    console.log(`📧 Creez utilizatorul: ${email}`)
    
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: 'Test User',
        role: 'admin'
      }
    })
    
    if (userError) {
      console.error('❌ Eroare la crearea utilizatorului:', userError.message)
      return
    }
    
    console.log('✅ Utilizator creat cu succes!')
    console.log('👤 User ID:', userData.user.id)
    console.log('📧 Email:', userData.user.email)
    
    // 2. Testez autentificarea cu noul utilizator
    console.log('🔐 Testez autentificarea cu noul utilizator...')
    
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY3hvYm1wb2JuZXNlZmJzYmV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTExODYsImV4cCI6MjA3MjMyNzE4Nn0.10GVuchHXc56TJJi8-66mfhG6Bz4DutBcgUMc1U6dTM'
    const anonSupabase = createClient(supabaseUrl, anonKey)
    
    const { data: authData, error: authError } = await anonSupabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (authError) {
      console.error('❌ Eroare la autentificarea cu noul utilizator:', authError.message)
      return
    }
    
    console.log('✅ Autentificare reușită cu noul utilizator!')
    console.log('🔑 Session token:', authData.session?.access_token ? 'Valid' : 'Invalid')
    
    // 3. Testez storage-ul cu utilizatorul autentificat
    console.log('📦 Testez storage-ul cu utilizatorul autentificat...')
    
    const { data: objects, error: objectsError } = await anonSupabase.storage
      .from('car-images')
      .list('', { limit: 5 })
    
    if (objectsError) {
      console.error('❌ Eroare la listarea obiectelor:', objectsError)
    } else {
      console.log('✅ Listarea obiectelor funcționează:', objects.length, 'obiecte găsite')
    }
    
    console.log('🎉 Utilizatorul de test a fost creat cu succes!')
    console.log('📋 Credențiale:')
    console.log(`📧 Email: ${email}`)
    console.log(`🔑 Parolă: ${password}`)
    console.log('💡 Folosește aceste credențiale pentru a testa aplicația!')
    
  } catch (error) {
    console.error('❌ Eroare la crearea utilizatorului de test:', error)
  }
}

createTestUser()
