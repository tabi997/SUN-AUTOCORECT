// Script de testare pentru browser - rulează în consola browser-ului
// Copiază și lipește acest cod în consola browser-ului (F12)

console.log('🔍 Testare sistem de contact în browser...')

// Testează dacă contextul de contact este disponibil
try {
  // Verifică dacă ContactProvider este montat
  const contactProvider = document.querySelector('[data-testid="contact-provider"]')
  console.log('📱 ContactProvider montat:', !!contactProvider)
  
  // Verifică dacă hook-ul useContact este disponibil
  if (window.React && window.React.useContext) {
    console.log('✅ React Context API disponibil')
  } else {
    console.log('❌ React Context API nu este disponibil')
  }
  
  // Verifică dacă există erori în consolă
  console.log('🔍 Verifică consola pentru erori de contact...')
  
  // Testează dacă footer-ul conține informații de contact
  const footer = document.querySelector('footer')
  if (footer) {
    const phoneElements = footer.querySelectorAll('[class*="phone"], [class*="Phone"]')
    const emailElements = footer.querySelectorAll('[class*="email"], [class*="Email"]')
    const addressElements = footer.querySelectorAll('[class*="address"], [class*="Address"]')
    const clockElements = footer.querySelectorAll('[class*="clock"], [class*="Clock"]')
    
    console.log('📱 Elemente telefon găsite:', phoneElements.length)
    console.log('📧 Elemente email găsite:', emailElements.length)
    console.log('📍 Elemente adresă găsite:', addressElements.length)
    console.log('🕒 Elemente ceas găsite:', clockElements.length)
    
    // Verifică conținutul
    if (phoneElements.length > 0) {
      console.log('📱 Conținut telefon:', phoneElements[0].textContent)
    }
    if (emailElements.length > 0) {
      console.log('📧 Conținut email:', emailElements[0].textContent)
    }
    if (addressElements.length > 0) {
      console.log('📍 Conținut adresă:', addressElements[0].textContent)
    }
    if (clockElements.length > 0) {
      console.log('🕒 Conținut ceas:', clockElements[0].textContent)
    }
  } else {
    console.log('❌ Footer-ul nu a fost găsit')
  }
  
  // Verifică dacă există mesaje de loading
  const loadingElements = document.querySelectorAll('[class*="loading"], [class*="animate-pulse"]')
  console.log('⏳ Elemente de loading găsite:', loadingElements.length)
  
  // Verifică dacă există mesaje de eroare
  const errorElements = document.querySelectorAll('[class*="error"], [class*="destructive"]')
  console.log('❌ Elemente de eroare găsite:', errorElements.length)
  
  // Testează dacă poți accesa admin panel-ul
  const adminLink = document.querySelector('a[href="/admin"]')
  if (adminLink) {
    console.log('✅ Link către admin panel găsit')
  } else {
    console.log('⚠️ Link către admin panel nu a fost găsit')
  }
  
} catch (error) {
  console.error('❌ Eroare la testarea sistemului de contact:', error)
}

console.log('\n💡 Pentru a rezolva problemele:')
console.log('1. Verifică dacă ai rulat scriptul supabase-contact-info.sql în Supabase')
console.log('2. Verifică dacă ContactProvider este corect implementat în App.tsx')
console.log('3. Verifică dacă baza de date are permisiunile corecte')
console.log('4. Verifică consola pentru erori de rețea sau autentificare')

// Funcție pentru a testa manual datele de contact
window.testContactData = async () => {
  try {
    console.log('🧪 Testare manuală a datelor de contact...')
    
    // Încearcă să accesezi direct baza de date
    const response = await fetch('https://chcxobmpobnesefbsbev.supabase.co/rest/v1/contact_info?select=*', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY3hvYm1wb2JuZXNlZmJzYmV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTExODYsImV4cCI6MjA3MjMyNzE4Nn0.10GVuchHXc56TJJi8-66mfhG6Bz4DutBcgUMc1U6dTM',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY3hvYm1wb2JuZXNlZmJzYmV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTExODYsImV4cCI6MjA3MjMyNzE4Nn0.10GVuchHXc56TJJi8-66mfhG6Bz4DutBcgUMc1U6dTM'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Date găsite în baza de date:', data)
      
      if (data && data.length > 0) {
        console.log('📱 Telefon:', data[0].phone)
        console.log('📧 Email:', data[0].email)
        console.log('📍 Adresa:', data[0].address)
        console.log('🕒 Program:', data[0].working_hours)
      } else {
        console.log('⚠️ Nu există date în tabelul contact_info')
      }
    } else {
      console.error('❌ Eroare la accesarea bazei de date:', response.status, response.statusText)
    }
  } catch (error) {
    console.error('❌ Eroare la testarea manuală:', error)
  }
}

console.log('\n🧪 Pentru a testa manual datele, rulează: testContactData()')
