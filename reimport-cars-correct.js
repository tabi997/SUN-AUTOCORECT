import { createClient } from '@supabase/supabase-js';
import puppeteer from 'puppeteer';

const supabaseUrl = 'https://chcxobmpobnesefbsbev.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY3hvYm1wb2JuZXNlZmJzYmV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njc1MTE4NiwiZXhwIjoyMDcyMzI3MTg2fQ.JsdnLEEt7in1NfEPNGyNGq2agMZbikEVjazUAqXp-gM';
const supabase = createClient(supabaseUrl, supabaseKey);

const AUTOVIT_INVENTORY_URL = 'https://sunautocorect.autovit.ro/inventory';

async function reimportCarsWithCorrectDetails() {
  let browser;
  
  try {
    console.log('🚀 Reimportez mașinile cu detaliile corecte...');
    
    // 1. Șterg mașinile existente cu date incomplete
    console.log('🗑️  Șterg mașinile existente cu date incomplete...');
    const { data: existingCars, error: fetchError } = await supabase
      .from('cars')
      .select('id, brand, model, year, kilometers, fuel, transmission, power')
      .eq('year', 2020)
      .eq('kilometers', 0);
    
    if (fetchError) {
      console.error('❌ Eroare la preluarea mașinilor:', fetchError);
      return;
    }
    
    console.log(`📊 Am găsit ${existingCars.length} mașini cu date incomplete`);
    
    if (existingCars.length === 0) {
      console.log('✅ Nu există mașini cu date incomplete de șters');
      return;
    }
    
    // Șterg mașinile cu date incomplete
    for (const car of existingCars) {
      console.log(`🗑️  Șterg mașina ${car.brand} ${car.model} (ID: ${car.id})`);
      
      // Șterg imaginile din storage
      const { data: carImages, error: imagesError } = await supabase
        .from('car_images')
        .select('image_name')
        .eq('car_id', car.id);
      
      if (!imagesError && carImages) {
        for (const image of carImages) {
          const { error: deleteError } = await supabase.storage
            .from('car-images')
            .remove([image.image_name]);
          
          if (deleteError) {
            console.warn(`⚠️  Nu am putut șterge imaginea ${image.image_name}:`, deleteError);
          }
        }
      }
      
      // Șterg înregistrările din car_images
      const { error: deleteImagesError } = await supabase
        .from('car_images')
        .delete()
        .eq('car_id', car.id);
      
      if (deleteImagesError) {
        console.warn(`⚠️  Nu am putut șterge înregistrările din car_images pentru mașina ${car.id}:`, deleteImagesError);
      }
      
      // Șterg mașina
      const { error: deleteCarError } = await supabase
        .from('cars')
        .delete()
        .eq('id', car.id);
      
      if (deleteCarError) {
        console.error(`❌ Nu am putut șterge mașina ${car.id}:`, deleteCarError);
      } else {
        console.log(`✅ Mașina ${car.id} ștearsă cu succes`);
      }
    }
    
    console.log('✅ Toate mașinile cu date incomplete au fost șterse');
    
    // 2. Rulez importul din nou cu scriptul corectat
    console.log('🔄 Rulez importul din nou cu scriptul corectat...');
    console.log('💡 Folosește: npm run import-autovit-improved');
    
  } catch (error) {
    console.error('❌ Eroare la reimport:', error);
  }
}

reimportCarsWithCorrectDetails();
