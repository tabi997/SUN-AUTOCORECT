import { createClient } from '@supabase/supabase-js';

// Configurare Supabase cu cheia service_role
const supabaseUrl = 'https://chcxobmpobnesefbsbev.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY3hvYm1wb2JuZXNlZmJzYmV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njc1MTE4NiwiZXhwIjoyMDcyMzI3MTg2fQ.JsdnLEEt7in1NfEPNGyNGq2agMZbikEVjazUAqXp-gM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugImport() {
  try {
    console.log('🔍 Debug import Autovit...');
    
    // 1. Verific mașinile din baza de date
    console.log('\n1. Verific mașinile din baza de date...');
    const { data: cars, error: carsError } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (carsError) {
      console.error('❌ Eroare la obținerea mașinilor:', carsError);
      return;
    }
    
    console.log(`📊 Mașini găsite în baza de date: ${cars.length}`);
    if (cars.length > 0) {
      cars.forEach(car => {
        console.log(`   - ID: ${car.id}, ${car.brand} ${car.model} (${car.year}), Status: ${car.status}, Creat: ${car.created_at}`);
      });
    }
    
    // 2. Verific imaginile din storage
    console.log('\n2. Verific imaginile din storage...');
    const { data: files, error: filesError } = await supabase.storage
      .from('car-images')
      .list();
    
    if (filesError) {
      console.error('❌ Eroare la listarea fișierelor:', filesError);
      return;
    }
    
    console.log(`📸 Fișiere găsite în storage: ${files.length}`);
    
    // 3. Verific înregistrările din car_images
    console.log('\n3. Verific înregistrările din car_images...');
    const { data: carImages, error: imagesError } = await supabase
      .from('car_images')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (imagesError) {
      console.error('❌ Eroare la obținerea imaginilor:', imagesError);
      return;
    }
    
    console.log(`🖼️  Înregistrări în car_images: ${carImages.length}`);
    if (carImages.length > 0) {
      carImages.forEach(img => {
        console.log(`   - ID: ${img.id}, Car ID: ${img.car_id}, Primary: ${img.is_primary}, Order: ${img.order_index}, URL: ${img.image_url}`);
      });
    }
    
    // 4. Analizez pattern-ul fișierelor pentru a identifica car_id-urile
    console.log('\n4. Analizez pattern-ul fișierelor...');
    const carIdsFromFiles = new Set();
    files.forEach(file => {
      // Pattern: carId_timestamp_orderIndex_filename
      const match = file.name.match(/^(\d+)_/);
      if (match) {
        carIdsFromFiles.add(parseInt(match[1]));
      }
    });
    
    console.log(`🚗 Car ID-uri identificate din fișiere: ${Array.from(carIdsFromFiles).sort((a, b) => a - b).join(', ')}`);
    
    // 5. Verific dacă există discrepanțe între car_id din fișiere și din baza de date
    console.log('\n5. Verific discrepanțele...');
    const carIdsFromDB = new Set(cars.map(car => car.id));
    const carIdsFromImages = new Set(carImages.map(img => img.car_id));
    
    console.log(`📊 Car ID-uri din baza de date: ${Array.from(carIdsFromDB).sort((a, b) => a - b).join(', ')}`);
    console.log(`🖼️  Car ID-uri din car_images: ${Array.from(carIdsFromImages).sort((a, b) => a - b).join(', ')}`);
    
    const missingCars = Array.from(carIdsFromFiles).filter(id => !carIdsFromDB.has(id));
    const orphanedImages = Array.from(carIdsFromImages).filter(id => !carIdsFromDB.has(id));
    
    if (missingCars.length > 0) {
      console.log(`❌ Car ID-uri lipsă din baza de date: ${missingCars.join(', ')}`);
    }
    
    if (orphanedImages.length > 0) {
      console.log(`⚠️  Car ID-uri cu imagini dar fără mașină: ${orphanedImages.join(', ')}`);
    }
    
    // 6. Verific dacă există erori în log-uri sau probleme cu permisiunile
    console.log('\n6. Verific permisiunile și structura...');
    
    // Test inserare mașină simplă
    console.log('🧪 Testez inserarea unei mașini...');
    const testCar = {
      brand: 'TEST',
      model: 'DEBUG',
      year: 2024,
      kilometers: 0,
      fuel: 'Benzină',
      power: 100,
      transmission: 'Manuală',
      price: 1000,
      featured: false,
      image_url: '',
      description: 'Mașină de test pentru debug',
      status: 'active'
    };
    
    const { data: insertedCar, error: insertError } = await supabase
      .from('cars')
      .insert([testCar])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Eroare la inserarea mașinii de test:', insertError);
    } else {
      console.log('✅ Mașina de test a fost inserată cu succes:', insertedCar.id);
      
      // Șterg mașina de test
      const { error: deleteError } = await supabase
        .from('cars')
        .delete()
        .eq('id', insertedCar.id);
      
      if (deleteError) {
        console.error('⚠️  Nu am putut șterge mașina de test:', deleteError);
      } else {
        console.log('✅ Mașina de test a fost ștearsă');
      }
    }
    
    // 7. Recomandări
    console.log('\n📋 Recomandări:');
    if (missingCars.length > 0) {
      console.log(`   - Mașinile cu ID-urile ${missingCars.join(', ')} au imagini dar nu au fost salvate în baza de date`);
      console.log('   - Posibile cauze: eroare la inserarea în tabela cars, rollback al tranzacției, sau problemă cu scriptul de import');
    }
    
    if (files.length > 0 && cars.length === 0) {
      console.log('   - Imaginile au fost uploadate dar mașinile nu au fost salvate');
      console.log('   - Verifică log-urile scriptului de import pentru erori la salvarea mașinilor');
    }
    
    console.log('   - Rulează din nou scriptul de import cu log-uri detaliate');
    console.log('   - Verifică dacă există erori de validare sau constrângeri în baza de date');
    
  } catch (error) {
    console.error('❌ Eroare generală la debug:', error);
  }
}

debugImport();
