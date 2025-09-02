import puppeteer from 'puppeteer';
import fetch from 'node-fetch';
import fs from 'fs-extra';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Configurare Supabase
const supabaseUrl = 'https://chcxobmpobnesefbsbev.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY3hvYm1wb2JuZXNlZmJzYmV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njc1MTE4NiwiZXhwIjoyMDcyMzI3MTg2fQ.JsdnLEEt7in1NfEPNGyNGq2agMZbikEVjazUAqXp-gM';
const supabase = createClient(supabaseUrl, supabaseKey);

// URL-ul inventory-ului Autovit
const AUTOVIT_INVENTORY_URL = 'https://sunautocorect.autovit.ro/inventory';

// Directorul pentru salvarea imaginilor temporare
const TEMP_IMAGES_DIR = './temp-images';

class AutovitScraper {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async init() {
    console.log('🚀 Inițializez browser-ul...');
    this.browser = await puppeteer.launch({
      headless: false, // Schimbă la true pentru producție
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    // Setez un user agent realist
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
    
    // Setez viewport
    await this.page.setViewport({ width: 1366, height: 768 });
    
    console.log('✅ Browser inițializat cu succes');
  }

  async scrapeInventory() {
    try {
      console.log('📋 Navighez către inventory-ul Autovit...');
      await this.page.goto(AUTOVIT_INVENTORY_URL, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      console.log('⏳ Aștept încărcarea anunțurilor...');
      await this.page.waitForTimeout(3000);

      // Selectez anunțurile din pagină
      const carListings = await this.page.evaluate(() => {
        // Adaptez selectorii CSS în funcție de structura reală a paginii Autovit
        const listings = document.querySelectorAll('[data-testid="listing-ad"]') || 
                         document.querySelectorAll('.advert-card') ||
                         document.querySelectorAll('.offer-item') ||
                         document.querySelectorAll('.listing-item');
        
        return Array.from(listings).map((listing, index) => {
          try {
            // Extrag link-ul către anunț
            const linkElement = listing.querySelector('a[href*="/oferta/"]') || 
                               listing.querySelector('a[href*="/ad/"]') ||
                               listing.querySelector('a');
            const detailUrl = linkElement ? linkElement.href : null;

            // Extrag titlul
            const titleElement = listing.querySelector('[data-testid="offer-title"]') ||
                                listing.querySelector('.offer-title') ||
                                listing.querySelector('h2') ||
                                listing.querySelector('h3') ||
                                listing.querySelector('.title');
            const title = titleElement ? titleElement.textContent.trim() : `Anunț ${index + 1}`;

            // Extrag prețul
            const priceElement = listing.querySelector('[data-testid="offer-price"]') ||
                                listing.querySelector('.offer-price') ||
                                listing.querySelector('.price') ||
                                listing.querySelector('[class*="price"]');
            const priceText = priceElement ? priceElement.textContent.trim() : '0';

            // Extrag imaginea principală
            const imageElement = listing.querySelector('img');
            const mainImage = imageElement ? imageElement.src : null;

            return {
              title,
              detailUrl,
              priceText,
              mainImage,
              index
            };
          } catch (error) {
            console.warn(`Eroare la extragerea anunțului ${index}:`, error);
            return null;
          }
        }).filter(Boolean);
      });

      console.log(`📊 Am găsit ${carListings.length} anunțuri în inventory`);
      return carListings;

    } catch (error) {
      console.error('❌ Eroare la scraping-ul inventory-ului:', error);
      throw error;
    }
  }

  async scrapeCarDetails(carUrl) {
    try {
      console.log(`🔍 Analizez detaliile pentru: ${carUrl}`);
      
      const detailPage = await this.browser.newPage();
      await detailPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
      
      await detailPage.goto(carUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      await detailPage.waitForTimeout(2000);

      const carDetails = await detailPage.evaluate(() => {
        try {
          // Extrag titlul complet
          const titleElement = document.querySelector('[data-testid="ad-title"]') ||
                              document.querySelector('.offer-title') ||
                              document.querySelector('h1') ||
                              document.querySelector('.ad-title');
          const fullTitle = titleElement ? titleElement.textContent.trim() : '';

          // Încerc să extrag marca și modelul din titlu
          const titleParts = fullTitle.split(' ');
          const brand = titleParts[0] || '';
          const model = titleParts.slice(1, 3).join(' ') || '';

          // Extrag prețul
          const priceElement = document.querySelector('[data-testid="price"]') ||
                              document.querySelector('.offer-price') ||
                              document.querySelector('.price-value') ||
                              document.querySelector('[class*="price"]');
          const priceText = priceElement ? priceElement.textContent.trim() : '0';
          const price = parseInt(priceText.replace(/[^\d]/g, '')) || 0;

          // Extrag detaliile tehnice
          const details = {};
          const detailElements = document.querySelectorAll('[data-testid="parameter-row"]') ||
                                document.querySelectorAll('.param-item') ||
                                document.querySelectorAll('.parameter') ||
                                document.querySelectorAll('.offer-params li');

          detailElements.forEach(element => {
            try {
              const label = element.querySelector('.param-label, .parameter-label, .param-name')?.textContent?.trim();
              const value = element.querySelector('.param-value, .parameter-value, .param-value')?.textContent?.trim();
              
              if (label && value) {
                details[label.toLowerCase()] = value;
              }
            } catch (e) {
              // Ignor erorile pentru parametri individuali
            }
          });

          // Mapez detaliile la structura noastră
          const year = parseInt(details['anul'] || details['an'] || details['year'] || '2020');
          const kilometers = parseInt((details['rulaj'] || details['kilometri'] || '0').replace(/[^\d]/g, '')) || 0;
          const fuel = details['combustibil'] || details['fuel'] || details['motorină'] || 'Benzină';
          const transmission = details['cutia de viteze'] || details['transmisie'] || details['transmission'] || 'Manuală';
          const power = parseInt((details['puterea motorului'] || details['putere'] || '0').replace(/[^\d]/g, '')) || 150;

          // Extrag descrierea
          const descriptionElement = document.querySelector('[data-testid="description"]') ||
                                    document.querySelector('.offer-description') ||
                                    document.querySelector('.description') ||
                                    document.querySelector('.ad-description');
          const description = descriptionElement ? descriptionElement.textContent.trim() : '';

          // Extrag toate imaginile
          const imageElements = document.querySelectorAll('img[src*="otomoto"], img[src*="autovit"], img[data-testid="photo"], .gallery img');
          const images = Array.from(imageElements)
            .map(img => img.src)
            .filter(src => src && !src.includes('logo') && !src.includes('icon'))
            .slice(0, 20); // Limitez la 20 de imagini

          return {
            brand: brand || 'Necunoscut',
            model: model || 'Necunoscut',
            fullTitle,
            year,
            kilometers,
            fuel,
            transmission,
            power,
            price,
            description,
            images
          };
        } catch (error) {
          console.error('Eroare la extragerea detaliilor:', error);
          return null;
        }
      });

      await detailPage.close();
      return carDetails;

    } catch (error) {
      console.error(`❌ Eroare la analiza detaliilor pentru ${carUrl}:`, error);
      return null;
    }
  }

  async downloadImage(imageUrl, filename) {
    try {
      if (!imageUrl || imageUrl.includes('data:image')) {
        return null;
      }

      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const buffer = await response.buffer();
      const imagePath = path.join(TEMP_IMAGES_DIR, filename);
      
      await fs.ensureDir(TEMP_IMAGES_DIR);
      await fs.writeFile(imagePath, buffer);
      
      return imagePath;
    } catch (error) {
      console.warn(`⚠️  Nu am putut descărca imaginea ${imageUrl}:`, error.message);
      return null;
    }
  }

  async uploadImageToSupabase(imagePath, carId, isMain = false, orderIndex = 0) {
    try {
      console.log(`📤 Încep upload-ul imaginii pentru mașina ${carId}, order ${orderIndex}...`);
      
      const imageBuffer = await fs.readFile(imagePath);
      const filename = `car_${carId}_${Date.now()}_${orderIndex}.jpg`;
      
      console.log(`📁 Numele fișierului: ${filename}`);
      console.log(`📏 Dimensiunea imaginii: ${(imageBuffer.length / 1024 / 1024).toFixed(2)} MB`);
      
      // Upload în storage
      console.log('🚀 Upload în Supabase Storage...');
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(filename, imageBuffer, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ Eroare la upload în storage:', uploadError);
        throw uploadError;
      }

      console.log('✅ Upload în storage reușit:', uploadData);

      // Obțin URL-ul public
      console.log('🔗 Obțin URL-ul public...');
      const { data: urlData } = supabase.storage
        .from('car-images')
        .getPublicUrl(filename);

      const publicUrl = urlData.publicUrl;
      console.log('🌐 URL public obținut:', publicUrl);

      // Salvez în tabela car_images
      console.log('💾 Salvez înregistrarea în tabela car_images...');
      const { data, error } = await supabase
        .from('car_images')
        .insert({
          car_id: carId,
          image_url: publicUrl,
          image_name: filename,
          is_primary: isMain,
          order_index: orderIndex
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Eroare la salvarea în car_images:', error);
        console.error('❌ Detalii eroare:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('✅ Înregistrarea în car_images salvată cu succes:', data);
      return publicUrl;
    } catch (error) {
      console.error('❌ Eroare la upload-ul imaginii:', error);
      console.error('❌ Stack trace:', error.stack);
      return null;
    }
  }

  async saveCarToDatabase(carData, images = []) {
    try {
      console.log(`💾 Salvez în baza de date: ${carData.brand} ${carData.model}`);
      console.log(`📋 Detalii mașină:`, {
        brand: carData.brand,
        model: carData.model,
        year: carData.year,
        kilometers: carData.kilometers,
        fuel: carData.fuel,
        power: carData.power,
        transmission: carData.transmission,
        price: carData.price,
        description: carData.description?.substring(0, 100) + '...'
      });

      // Verific dacă mașina există deja
      console.log('🔍 Verific dacă mașina există deja...');
      const { data: existingCar, error: checkError } = await supabase
        .from('cars')
        .select('id')
        .eq('brand', carData.brand)
        .eq('model', carData.model)
        .eq('year', carData.year)
        .eq('kilometers', carData.kilometers);

      if (checkError) {
        console.error('❌ Eroare la verificarea duplicatei:', checkError);
        throw checkError;
      }

      if (existingCar && existingCar.length > 0) {
        console.log('⚠️  Mașina există deja în baza de date, o sar');
        return null;
      }

      // Pregătesc datele pentru inserare
      const carInsertData = {
        brand: carData.brand || 'Necunoscut',
        model: carData.model || 'Necunoscut',
        year: carData.year || 2020,
        kilometers: carData.kilometers || 0,
        fuel: carData.fuel || 'Benzină',
        power: carData.power || 100,
        transmission: carData.transmission || 'Manuală',
        price: carData.price || 1000,
        monthly_rate: Math.round((carData.price || 1000) * 0.015), // Estimez 1.5% din preț
        featured: false,
        image_url: images[0] || '', // Prima imagine ca imagine principală
        description: carData.description || 'Importat din Autovit',
        status: 'active'
      };

      console.log('📝 Datele pentru inserare:', carInsertData);

      // Creez înregistrarea pentru mașină
      console.log('💾 Inserarea mașinii în baza de date...');
      const { data: car, error: carError } = await supabase
        .from('cars')
        .insert([carInsertData])
        .select()
        .single();

      if (carError) {
        console.error('❌ Eroare la inserarea mașinii:', carError);
        console.error('❌ Detalii eroare:', {
          message: carError.message,
          details: carError.details,
          hint: carError.hint,
          code: carError.code
        });
        throw carError;
      }

      console.log(`✅ Mașina salvată cu succes! ID: ${car.id}`);

      // Proces imaginile dacă există
      if (images.length > 0) {
        console.log(`📸 Procesez ${images.length} imagini...`);
        
        for (let i = 0; i < Math.min(images.length, 20); i++) {
          const imageUrl = images[i];
          const filename = `temp_${car.id}_${i}.jpg`;
          
          try {
            console.log(`📥 Descarc imaginea ${i + 1}/${images.length}: ${imageUrl.substring(0, 50)}...`);
            
            // Descarc imaginea
            const imagePath = await this.downloadImage(imageUrl, filename);
            if (imagePath) {
              console.log(`📤 Upload imaginea ${i + 1} la Supabase...`);
              
              // Upload la Supabase
              const uploadedUrl = await this.uploadImageToSupabase(imagePath, car.id, i === 0, i);
              
              if (uploadedUrl) {
                console.log(`✅ Imaginea ${i + 1} uploadată cu succes: ${uploadedUrl.substring(0, 50)}...`);
              } else {
                console.error(`❌ Eroare la upload-ul imaginii ${i + 1}`);
              }
              
              // Șterg fișierul temporar
              await fs.remove(imagePath);
              console.log(`🗑️  Fișierul temporar șters: ${filename}`);
            } else {
              console.warn(`⚠️  Nu am putut descărca imaginea ${i + 1}`);
            }
          } catch (imageError) {
            console.error(`❌ Eroare la procesarea imaginii ${i + 1}:`, imageError);
            // Continu cu următoarea imagine
          }
        }
      } else {
        console.log('ℹ️  Nu există imagini de procesat');
      }

      return car;
    } catch (error) {
      console.error('❌ Eroare la salvarea în baza de date:', error);
      console.error('❌ Stack trace:', error.stack);
      throw error;
    }
  }

  async importAllCars() {
    try {
      await this.init();
      
      console.log('🔄 Încep importul mașinilor din Autovit...');
      
      // Obțin lista anunțurilor
      const listings = await this.scrapeInventory();
      
      if (listings.length === 0) {
        console.log('⚠️  Nu am găsit anunțuri de importat');
        return;
      }

      console.log(`📋 Procesez ${listings.length} anunțuri...`);
      
      let importedCount = 0;
      let errorCount = 0;

      for (let i = 0; i < listings.length; i++) {
        const listing = listings[i];
        
        try {
          console.log(`\n🔄 ${i + 1}/${listings.length} - Procesez: ${listing.title}`);
          
          if (!listing.detailUrl) {
            console.log('⚠️  Nu am găsit URL pentru acest anunț, îl sar');
            continue;
          }

          // Obțin detaliile complete
          const carDetails = await this.scrapeCarDetails(listing.detailUrl);
          
          if (!carDetails) {
            console.log('⚠️  Nu am putut extrage detaliile, trec la următorul');
            errorCount++;
            continue;
          }

          // Salvez în baza de date
          const savedCar = await this.saveCarToDatabase(carDetails, carDetails.images);
          
          if (savedCar) {
            importedCount++;
            console.log(`✅ ${savedCar.brand} ${savedCar.model} importat cu succes`);
          }

          // Pauză între cereri pentru a fi respectuos cu serverul
          await this.page.waitForTimeout(2000);

        } catch (error) {
          console.error(`❌ Eroare la procesarea anunțului ${listing.title}:`, error);
          errorCount++;
        }
      }

      console.log(`\n🎉 Import finalizat!`);
      console.log(`✅ Mașini importate cu succes: ${importedCount}`);
      console.log(`❌ Erori întâlnite: ${errorCount}`);

    } catch (error) {
      console.error('❌ Eroare generală la import:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
      
      // Curăț directorul temporar
      try {
        await fs.remove(TEMP_IMAGES_DIR);
      } catch (e) {
        // Ignor erorile de cleanup
      }
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Executarea scriptului
async function main() {
  const scraper = new AutovitScraper();
  
  try {
    await scraper.importAllCars();
  } catch (error) {
    console.error('❌ Eroare la executarea scriptului:', error);
  }
}

// Verific dacă scriptul este rulat direct
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default AutovitScraper;
