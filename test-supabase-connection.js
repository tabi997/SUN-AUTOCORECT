import { createClient } from '@supabase/supabase-js';

// Configurare Supabase
const supabaseUrl = 'https://chcxobmpobnesefbsbev.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY3hvYm1wb2JuZXNlZmJzYmV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njc1MTE4NiwiZXhwIjoyMDcyMzI3MTg2fQ.JsdnLEEt7in1NfEPNGyNGq2agMZbikEVjazUAqXp-gM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🔍 Testez conexiunea la Supabase...');
    
    // Test 1: Verific conexiunea de bază
    console.log('1. Testez conexiunea de bază...');
    const { data: testData, error: testError } = await supabase
      .from('cars')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Eroare la conexiunea de bază:', testError);
      return;
    }
    console.log('✅ Conexiunea de bază funcționează');
    
    // Test 2: Verific numărul de mașini existente
    console.log('2. Verific numărul de mașini existente...');
    const { count, error: countError } = await supabase
      .from('cars')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Eroare la numărarea mașinilor:', countError);
      return;
    }
    console.log(`✅ Numărul de mașini în baza de date: ${count}`);
    
    // Test 3: Verific dacă există mașini cu status 'active'
    console.log('3. Verific mașinile active...');
    const { data: activeCars, error: activeError } = await supabase
      .from('cars')
      .select('id, brand, model, status, created_at')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (activeError) {
      console.error('❌ Eroare la obținerea mașinilor active:', activeError);
      return;
    }
    
    if (activeCars && activeCars.length > 0) {
      console.log('✅ Mașini active găsite:');
      activeCars.forEach(car => {
        console.log(`   - ${car.brand} ${car.model} (ID: ${car.id}, Status: ${car.status}, Creat: ${car.created_at})`);
      });
    } else {
      console.log('⚠️  Nu există mașini active în baza de date');
    }
    
    // Test 4: Verific tabela car_images
    console.log('4. Verific tabela car_images...');
    const { data: images, error: imagesError } = await supabase
      .from('car_images')
      .select('count')
      .limit(1);
    
    if (imagesError) {
      console.error('❌ Eroare la tabela car_images:', imagesError);
      return;
    }
    console.log('✅ Tabela car_images este accesibilă');
    
    // Test 5: Verific storage bucket
    console.log('5. Verific storage bucket...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Eroare la listarea bucket-urilor:', bucketsError);
      return;
    }
    
    console.log('✅ Bucket-uri disponibile:');
    buckets.forEach(bucket => {
      console.log(`   - ${bucket.name} (public: ${bucket.public})`);
    });
    
    // Test 6: Verific dacă există bucket-ul car-images
    const carImagesBucket = buckets.find(b => b.name === 'car-images');
    if (carImagesBucket) {
      console.log('✅ Bucket-ul car-images există');
      
      // Verific conținutul bucket-ului
      const { data: files, error: filesError } = await supabase.storage
        .from('car-images')
        .list();
      
      if (filesError) {
        console.error('❌ Eroare la listarea fișierelor din bucket:', filesError);
      } else {
        console.log(`✅ Bucket-ul conține ${files.length} fișiere`);
        if (files.length > 0) {
          console.log('   Primele 5 fișiere:');
          files.slice(0, 5).forEach(file => {
            console.log(`     - ${file.name} (${file.metadata?.size || 'N/A'} bytes)`);
          });
        }
      }
    } else {
      console.log('❌ Bucket-ul car-images NU există!');
      console.log('   Trebuie să creezi bucket-ul în Supabase Dashboard');
    }
    
  } catch (error) {
    console.error('❌ Eroare generală la testare:', error);
  }
}

testConnection();
