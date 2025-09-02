// Script de inițializare pentru baza de date de contact
// Rulează acest script pentru a crea tabelul contact_info și a insera datele implicite

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://chcxobmpobnesefbsbev.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY3hvYm1wb2JuZXNlZmJzYmV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTExODYsImV4cCI6MjA3MjMyNzE4Nn0.10GVuchHXc56TJJi8-66mfhG6Bz4DutBcgUMc1U6dTM'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function setupContactDatabase() {
  console.log('🚀 Inițializare baza de date pentru sistemul de contact...')
  
  try {
    // 1. Verifică dacă tabelul există deja
    console.log('\n1. Verificare existență tabel contact_info...')
    const { data: existingTables, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'contact_info')
    
    if (checkError) {
      console.error('❌ Eroare la verificarea tabelelor:', checkError)
      return
    }
    
    if (existingTables && existingTables.length > 0) {
      console.log('✅ Tabelul contact_info există deja')
      
      // Verifică dacă există date
      const { data: existingData, error: dataError } = await supabase
        .from('contact_info')
        .select('*')
      
      if (dataError) {
        console.error('❌ Eroare la verificarea datelor existente:', dataError)
        return
      }
      
      if (existingData && existingData.length > 0) {
        console.log('✅ Datele de contact există deja:')
        console.log('📱 Telefon:', existingData[0].phone)
        console.log('📧 Email:', existingData[0].email)
        console.log('📍 Adresa:', existingData[0].address)
        console.log('🕒 Program:', existingData[0].working_hours)
        console.log('🎯 Sistemul este gata de utilizare!')
        return
      } else {
        console.log('⚠️ Tabelul există dar nu are date. Se vor insera datele implicite...')
      }
    } else {
      console.log('📝 Tabelul contact_info nu există. Se va crea...')
    }
    
    // 2. Creează tabelul contact_info (dacă nu există)
    console.log('\n2. Creare tabel contact_info...')
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS contact_info (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        working_hours TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    
    const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL })
    
    if (createError) {
      console.log('⚠️ Nu s-a putut crea tabelul prin RPC. Se va încerca inserarea directă...')
    } else {
      console.log('✅ Tabelul contact_info creat cu succes!')
    }
    
    // 3. Creează funcția pentru actualizarea timestamp-ului (dacă nu există)
    console.log('\n3. Creare funcție update_updated_at_column...')
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `
    
    try {
      await supabase.rpc('exec_sql', { sql: createFunctionSQL })
      console.log('✅ Funcția update_updated_at_column creată cu succes!')
    } catch (error) {
      console.log('⚠️ Nu s-a putut crea funcția prin RPC. Se va continua...')
    }
    
    // 4. Creează trigger-ul (dacă nu există)
    console.log('\n4. Creare trigger update_contact_info_updated_at...')
    const createTriggerSQL = `
      DROP TRIGGER IF EXISTS update_contact_info_updated_at ON contact_info;
      CREATE TRIGGER update_contact_info_updated_at 
          BEFORE UPDATE ON contact_info 
          FOR EACH ROW 
          EXECUTE FUNCTION update_updated_at_column();
    `
    
    try {
      await supabase.rpc('exec_sql', { sql: createTriggerSQL })
      console.log('✅ Trigger-ul creat cu succes!')
    } catch (error) {
      console.log('⚠️ Nu s-a putut crea trigger-ul prin RPC. Se va continua...')
    }
    
    // 5. Inserează datele implicite
    console.log('\n5. Inserare date implicite de contact...')
    const defaultContactData = {
      phone: '+40 721 234 567',
      email: 'office@sunautocorect.ro',
      address: 'Strada Principală 123, București',
      working_hours: 'Lun-Vin: 9:00-18:00, Sâmbătă: 9:00-14:00, Duminică: Închis'
    }
    
    // Încearcă să inserezi datele
    const { data: insertedData, error: insertError } = await supabase
      .from('contact_info')
      .upsert([defaultContactData], { onConflict: 'id' })
      .select()
    
    if (insertError) {
      console.error('❌ Eroare la inserarea datelor:', insertError)
      
      // Încearcă să inserezi fără upsert
      const { data: simpleInsert, error: simpleError } = await supabase
        .from('contact_info')
        .insert([defaultContactData])
        .select()
      
      if (simpleError) {
        console.error('❌ Eroare la inserarea simplă:', simpleError)
        return
      } else {
        console.log('✅ Datele au fost inserate cu succes!')
      }
    } else {
      console.log('✅ Datele au fost inserate/actualizate cu succes!')
    }
    
    // 6. Verificare finală
    console.log('\n6. Verificare finală...')
    const { data: finalData, error: finalError } = await supabase
      .from('contact_info')
      .select('*')
      .order('id', { ascending: true })
      .limit(1)
    
    if (finalError) {
      console.error('❌ Eroare la verificarea finală:', finalError)
      return
    }
    
    if (finalData && finalData.length > 0) {
      console.log('🎉 Sistemul de contact a fost inițializat cu succes!')
      console.log('\n📊 Datele de contact:')
      console.log('📱 Telefon:', finalData[0].phone)
      console.log('📧 Email:', finalData[0].email)
      console.log('📍 Adresa:', finalData[0].address)
      console.log('🕒 Program:', finalData[0].working_hours)
      console.log('🆔 ID:', finalData[0].id)
      console.log('📅 Creat la:', finalData[0].created_at)
      
      console.log('\n🎯 Următorii pași:')
      console.log('1. Accesează aplicația în browser')
      console.log('2. Mergi la /admin și loghează-te')
      console.log('3. Click pe tab-ul "Contact" pentru a gestiona informațiile')
      console.log('4. Informațiile vor apărea automat în footer și alte pagini')
      
    } else {
      console.log('❌ Nu s-au putut verifica datele finale')
    }
    
  } catch (error) {
    console.error('❌ Eroare generală la inițializare:', error)
    console.log('\n💡 Soluții alternative:')
    console.log('1. Rulează manual scriptul supabase-contact-info.sql în Supabase SQL Editor')
    console.log('2. Verifică permisiunile în Supabase Dashboard')
    console.log('3. Asigură-te că ai acces la baza de date')
  }
}

// Rulează inițializarea
setupContactDatabase()
