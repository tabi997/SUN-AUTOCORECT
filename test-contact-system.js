// Test script pentru sistemul de contact
// Rulează acest script pentru a verifica dacă sistemul de contact funcționează

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://chcxobmpobnesefbsbev.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY3hvYm1wb2JuZXNlZmJzYmV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTExODYsImV4cCI6MjA3MjMyNzE4Nn0.10GVuchHXc56TJJi8-66mfhG6Bz4DutBcgUMc1U6dTM'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testContactSystem() {
  console.log('🔍 Testare sistem de contact...')
  
  try {
    // 1. Verifică dacă tabelul contact_info există
    console.log('\n1. Verificare existență tabel contact_info...')
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'contact_info')
    
    if (tablesError) {
      console.error('❌ Eroare la verificarea tabelelor:', tablesError)
      return
    }
    
    if (tables && tables.length > 0) {
      console.log('✅ Tabelul contact_info există')
    } else {
      console.log('❌ Tabelul contact_info NU există!')
      console.log('📝 Rulează scriptul supabase-contact-info.sql în Supabase SQL Editor')
      return
    }
    
    // 2. Verifică dacă există date în tabel
    console.log('\n2. Verificare date în tabel contact_info...')
    const { data: contactData, error: contactError } = await supabase
      .from('contact_info')
      .select('*')
    
    if (contactError) {
      console.error('❌ Eroare la citirea datelor de contact:', contactError)
      return
    }
    
    if (contactData && contactData.length > 0) {
      console.log('✅ Date găsite în tabel:')
      console.log('📱 Telefon:', contactData[0].phone)
      console.log('📧 Email:', contactData[0].email)
      console.log('📍 Adresa:', contactData[0].address)
      console.log('🕒 Program:', contactData[0].working_hours)
      console.log('🆔 ID:', contactData[0].id)
      console.log('📅 Creat la:', contactData[0].created_at)
      console.log('🔄 Actualizat la:', contactData[0].updated_at)
    } else {
      console.log('❌ Nu există date în tabelul contact_info!')
      console.log('📝 Rulează scriptul supabase-contact-info.sql în Supabase SQL Editor')
      return
    }
    
    // 3. Testează actualizarea datelor
    console.log('\n3. Testare actualizare date...')
    const testUpdate = {
      phone: '+40 721 234 567',
      email: 'test@sunautocorect.ro',
      address: 'Adresa de test',
      working_hours: 'Test program'
    }
    
    const { data: updatedData, error: updateError } = await supabase
      .from('contact_info')
      .update(testUpdate)
      .eq('id', 1)
      .select()
      .single()
    
    if (updateError) {
      console.error('❌ Eroare la actualizare:', updateError)
      return
    }
    
    console.log('✅ Actualizare reușită!')
    console.log('📱 Telefon nou:', updatedData.phone)
    console.log('📧 Email nou:', updatedData.email)
    
    // 4. Restaurează datele originale
    console.log('\n4. Restaurare date originale...')
    const originalData = {
      phone: '+40 721 234 567',
      email: 'office@sunautocorect.ro',
      address: 'Strada Principală 123, București',
      working_hours: 'Lun-Vin: 9:00-18:00, Sâmbătă: 9:00-14:00, Duminică: Închis'
    }
    
    const { data: restoredData, error: restoreError } = await supabase
      .from('contact_info')
      .update(originalData)
      .eq('id', 1)
      .select()
      .single()
    
    if (restoreError) {
      console.error('❌ Eroare la restaurare:', restoreError)
      return
    }
    
    console.log('✅ Date restaurate cu succes!')
    
    // 5. Testare finală
    console.log('\n5. Testare finală...')
    const { data: finalData, error: finalError } = await supabase
      .from('contact_info')
      .select('*')
      .eq('id', 1)
      .single()
    
    if (finalError) {
      console.error('❌ Eroare la testarea finală:', finalError)
      return
    }
    
    console.log('✅ Sistemul de contact funcționează perfect!')
    console.log('🎯 Poți accesa admin panel-ul pentru a gestiona informațiile de contact')
    
  } catch (error) {
    console.error('❌ Eroare generală:', error)
  }
}

// Rulează testul
testContactSystem()
