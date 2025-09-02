import { createClient } from '@supabase/supabase-js';

// Configurare Supabase cu cheia service_role
const supabaseUrl = 'https://chcxobmpobnesefbsbev.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY3hvYm1wb2JuZXNlZmJzYmV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njc1MTE4NiwiZXhwIjoyMDcyMzI3MTg2fQ.JsdnLEEt7in1NfEPNGyNGq2agMZbikEVjazUAqXp-gM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function recoverMissingCars() {
  try {
    console.log('🔍 Recuperez mașinile lipsă din import...');
    
    // 1. Verific fișierele din storage
    console.log('📸 Verific fișierele din storage...');
    const { data: files, error: filesError } = await supabase.storage
      .from('car-images')
      .list();
    
    if (filesError) {
      console.error('❌ Eroare la listarea fișierelor:', filesError);
      return;
    }
    
    console.log(`📊 Fișiere găsite în storage: ${files.length}`);
    
    // 2. Analizez pattern-ul fișierelor pentru a identifica car_id-urile
    const carIdsFromFiles = new Set();
    const fileGroups = {};
    
    files.forEach(file => {
      // Pattern: carId_timestamp_orderIndex_filename
      const match = file.name.match(/^(\d+)_/);
      if (match) {
        const carId = parseInt(match[1]);
        carIdsFromFiles.add(carId);
        
        if (!fileGroups[carId]) {
          fileGroups[carId] = [];
        }
        fileGroups[carId].push(file);
      }
    });
    
    console.log(`🚗 Car ID-uri identificate din fișiere: ${Array.from(carIdsFromFiles).sort((a, b) => a - b).join(', ')}`);
    
    // 3. Verific care mașini lipsesc din baza de date
    console.log('\n📊 Verific mașinile lipsă...');
    const { data: existingCars, error: carsError } = await supabase
      .from('cars')
      .select('id');
    
    if (carsError) {
      console.error('❌ Eroare la obținerea mașinilor existente:', carsError);
      return;
    }
    
    const existingCarIds = new Set(existingCars.map(car => car.id));
    const missingCarIds = Array.from(carIdsFromFiles).filter(id => !existingCarIds.has(id));
    
    console.log(`📊 Mașini existente în baza de date: ${Array.from(existingCarIds).sort((a, b) => a - b).join(', ')}`);
    console.log(`❌ Mașini lipsă din baza de date: ${missingCarIds.join(', ')}`);
    
    if (missingCarIds.length === 0) {
      console.log('✅ Nu există mașini lipsă!');
      return;
    }
    
    // 4. Recuperez mașinile lipsă
    console.log(`\n🔄 Încep recuperarea celor ${missingCarIds.length} mașini...`);
    
    for (const carId of missingCarIds) {
      try {
        console.log(`\n🚗 Recuperez mașina cu ID: ${carId}`);
        
        // Creez o mașină de recuperare cu date de bază
        const recoveredCar = {
          brand: 'RECUPERAT',
          model: `ID_${carId}`,
          year: 2020,
          kilometers: 100000,
          fuel: 'Benzină',
          power: 100,
          transmission: 'Manuală',
          price: 5000,
          monthly_rate: 75,
          featured: false,
          image_url: '',
          description: `Mașină recuperată din importul Autovit (ID original: ${carId})`,
          status: 'active'
        };
        
        console.log('📝 Datele mașinii de recuperare:', recoveredCar);
        
        // Inserarea mașinii
        console.log('💾 Inserarea mașinii în baza de date...');
        const { data: insertedCar, error: insertError } = await supabase
          .from('cars')
          .insert([recoveredCar])
          .select()
          .single();
        
        if (insertError) {
          console.error(`❌ Eroare la inserarea mașinii ${carId}:`, insertError);
          continue;
        }
        
        console.log(`✅ Mașina recuperată cu ID nou: ${insertedCar.id}`);
        
        // 5. Creez înregistrările în car_images pentru fișierele existente
        const carFiles = fileGroups[carId];
        if (carFiles && carFiles.length > 0) {
          console.log(`📸 Procesez ${carFiles.length} imagini existente...`);
          
          for (let i = 0; i < carFiles.length; i++) {
            const file = carFiles[i];
            
            try {
              // Obțin URL-ul public pentru fișier
              const { data: urlData } = supabase.storage
                .from('car-images')
                .getPublicUrl(file.name);
              
              const publicUrl = urlData.publicUrl;
              
              // Salvez în tabela car_images
              const { data: imageRecord, error: imageError } = await supabase
                .from('car_images')
                .insert({
                  car_id: insertedCar.id,
                  image_url: publicUrl,
                  image_name: file.name,
                  is_primary: i === 0, // Prima imagine este principală
                  order_index: i
                })
                .select()
                .single();
              
              if (imageError) {
                console.error(`❌ Eroare la salvarea imaginii ${i + 1}:`, imageError);
              } else {
                console.log(`✅ Imaginea ${i + 1} salvată cu succes`);
              }
              
            } catch (imageError) {
              console.error(`❌ Eroare la procesarea imaginii ${i + 1}:`, imageError);
            }
          }
        }
        
        // 6. Actualizez image_url-ul principal al mașinii
        if (carFiles && carFiles.length > 0) {
          const { data: urlData } = supabase.storage
            .from('car-images')
            .getPublicUrl(carFiles[0].name);
          
          const { error: updateError } = await supabase
            .from('cars')
            .update({ image_url: urlData.publicUrl })
            .eq('id', insertedCar.id);
          
          if (updateError) {
            console.error('❌ Eroare la actualizarea image_url:', updateError);
          } else {
            console.log('✅ image_url actualizat cu succes');
          }
        }
        
        console.log(`✅ Mașina ${carId} recuperată complet!`);
        
      } catch (error) {
        console.error(`❌ Eroare la recuperarea mașinii ${carId}:`, error);
      }
    }
    
    // 7. Verific rezultatul final
    console.log('\n🔍 Verific rezultatul final...');
    const { data: finalCars, error: finalError } = await supabase
      .from('cars')
      .select(`
        *,
        images:car_images(*)
      `)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (finalError) {
      console.error('❌ Eroare la verificarea finală:', finalError);
    } else {
      console.log('📊 Mașinile din baza de date:');
      finalCars.forEach(car => {
        console.log(`   - ID: ${car.id}, ${car.brand} ${car.model}, Imagini: ${car.images?.length || 0}`);
      });
    }
    
    console.log('\n🎉 Recuperarea completă!');
    console.log(`✅ ${missingCarIds.length} mașini au fost recuperate`);
    console.log('📋 Următorii pași:');
    console.log('1. Verifică mașinile în interfața admin');
    console.log('2. Editează detaliile mașinilor recuperate cu informațiile corecte');
    console.log('3. Rulează din nou importul complet pentru anunțurile noi');
    
  } catch (error) {
    console.error('❌ Eroare generală la recuperare:', error);
    console.error('❌ Stack trace:', error.stack);
  }
}

recoverMissingCars();
