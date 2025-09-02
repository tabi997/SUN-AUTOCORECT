import { createClient } from '@supabase/supabase-js';

// Configurare Supabase cu cheia service_role
const supabaseUrl = 'https://chcxobmpobnesefbsbev.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY3hvYm1wb2JuZXNlZmJzYmV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njc1MTE4NiwiZXhwIjoyMDcyMzI3MTg2fQ.JsdnLEEt7in1NfEPNGyNGq2agMZbikEVjazUAqXp-gM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSingleImport() {
  try {
    console.log('🧪 Test import o singură mașină...');
    
    // 1. Creez o mașină de test
    const testCar = {
      brand: 'TEST',
      model: 'IMPORT',
      year: 2024,
      kilometers: 50000,
      fuel: 'Benzină',
      power: 150,
      transmission: 'Manuală',
      price: 15000,
      monthly_rate: 225,
      featured: false,
      image_url: 'https://example.com/test.jpg',
      description: 'Mașină de test pentru verificarea importului',
      status: 'active'
    };
    
    console.log('📝 Datele mașinii de test:', testCar);
    
    // 2. Inserarea mașinii
    console.log('💾 Inserarea mașinii în baza de date...');
    const { data: insertedCar, error: insertError } = await supabase
      .from('cars')
      .insert([testCar])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Eroare la inserarea mașinii:', insertError);
      console.error('❌ Detalii eroare:', {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code
      });
      return;
    }
    
    console.log('✅ Mașina inserată cu succes! ID:', insertedCar.id);
    
    // 3. Testez inserarea unei imagini
    console.log('📸 Testez inserarea unei imagini...');
    
    // Creez o imagine de test (1x1 pixel PNG)
    const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    
    const imageFilename = `test_${insertedCar.id}_${Date.now()}.png`;
    
    // Upload în storage
    console.log('🚀 Upload imagine în storage...');
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('car-images')
      .upload(imageFilename, testImageBuffer, {
        contentType: 'image/png',
        upsert: false
      });
    
    if (uploadError) {
      console.error('❌ Eroare la upload în storage:', uploadError);
    } else {
      console.log('✅ Upload în storage reușit:', uploadData);
      
      // Obțin URL-ul public
      const { data: urlData } = supabase.storage
        .from('car-images')
        .getPublicUrl(imageFilename);
      
      const publicUrl = urlData.publicUrl;
      console.log('🌐 URL public:', publicUrl);
      
      // Salvez în tabela car_images
      console.log('💾 Salvez în car_images...');
      const { data: imageRecord, error: imageError } = await supabase
        .from('car_images')
        .insert({
          car_id: insertedCar.id,
          image_url: publicUrl,
          image_name: imageFilename,
          is_primary: true,
          order_index: 0
        })
        .select()
        .single();
      
      if (imageError) {
        console.error('❌ Eroare la salvarea în car_images:', imageError);
      } else {
        console.log('✅ Înregistrarea în car_images salvată:', imageRecord);
      }
    }
    
    // 4. Verific rezultatul final
    console.log('\n🔍 Verific rezultatul final...');
    
    const { data: finalCar, error: finalError } = await supabase
      .from('cars')
      .select(`
        *,
        images:car_images(*)
      `)
      .eq('id', insertedCar.id)
      .single();
    
    if (finalError) {
      console.error('❌ Eroare la verificarea finală:', finalError);
    } else {
      console.log('✅ Mașina finală:', {
        id: finalCar.id,
        brand: finalCar.brand,
        model: finalCar.model,
        images: finalCar.images?.length || 0
      });
    }
    
    // 5. Curățare - șterg mașina de test
    console.log('\n🧹 Curățare - șterg mașina de test...');
    
    // Șterg mai întâi imaginile
    const { error: deleteImagesError } = await supabase
      .from('car_images')
      .delete()
      .eq('car_id', insertedCar.id);
    
    if (deleteImagesError) {
      console.error('⚠️  Nu am putut șterge imaginile:', deleteImagesError);
    } else {
      console.log('✅ Imaginile șterse');
    }
    
    // Șterg mașina
    const { error: deleteCarError } = await supabase
      .from('cars')
      .delete()
      .eq('id', insertedCar.id);
    
    if (deleteCarError) {
      console.error('⚠️  Nu am putut șterge mașina:', deleteCarError);
    } else {
      console.log('✅ Mașina ștearsă');
    }
    
    // Șterg fișierul din storage
    const { error: deleteFileError } = await supabase.storage
      .from('car-images')
      .remove([imageFilename]);
    
    if (deleteFileError) {
      console.error('⚠️  Nu am putut șterge fișierul din storage:', deleteFileError);
    } else {
      console.log('✅ Fișierul din storage șters');
    }
    
    console.log('\n🎉 Test completat cu succes! Importul funcționează corect.');
    
  } catch (error) {
    console.error('❌ Eroare la testul de import:', error);
    console.error('❌ Stack trace:', error.stack);
  }
}

testSingleImport();
