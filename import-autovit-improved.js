import puppeteer from 'puppeteer';
import fetch from 'node-fetch';
import fs from 'fs-extra';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Configurare Supabase cu cheia service_role
const supabaseUrl = 'https://chcxobmpobnesefbsbev.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY3hvYm1wb2JuZXNlZmJzYmV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njc1MTE4NiwiZXhwIjoyMDcyMzI3MTg2fQ.JsdnLEEt7in1NfEPNGyNGq2agMZbikEVjazUAqXp-gM';
const supabase = createClient(supabaseUrl, supabaseKey);

// URL-ul inventory-ului Autovit
const AUTOVIT_INVENTORY_URL = 'https://sunautocorect.autovit.ro/inventory';

// Directorul pentru salvarea imaginilor temporare
const TEMP_IMAGES_DIR = './temp-images';

class AutovitScraperImproved {
  constructor() {
    this.browser = null;
    this.page = null;
    this.importStats = {
      total: 0,
      processed: 0,
      imported: 0,
      errors: 0,
      skipped: 0
    };
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
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Selectez anunțurile din pagină
      const carListings = await this.page.evaluate(() => {
        // Selectorii corecți pentru structura reală a paginii Autovit
        const listings = document.querySelectorAll('article.ooa-c2v88x.ehorq5j0') || 
                         document.querySelectorAll('article[class*="ooa-c2v88x"]') ||
                         document.querySelectorAll('article');
        
        return Array.from(listings).map((listing, index) => {
          try {
            // Extrag link-ul către anunț
            const linkElement = listing.querySelector('a[href*="/anunt/"]') || 
                               listing.querySelector('a[href*="/oferta/"]') ||
                               listing.querySelector('a');
            const detailUrl = linkElement ? linkElement.href : null;

            // Extrag titlul din textul articolului
            const fullText = listing.textContent.trim();
            let title = `Anunț ${index + 1}`;
            
            // Încerc să extrag titlul din text (ex: "Dacia DusterDiesel2016181 000 km9 990EUR")
            if (fullText) {
              // Caut primul cuvânt care pare să fie marca (prima literă mare)
              const words = fullText.split(/\s+/);
              const brandWord = words.find(word => /^[A-Z][a-z]+/.test(word));
              if (brandWord) {
                title = brandWord;
                // Încerc să găsesc și modelul
                const nextWord = words[words.indexOf(brandWord) + 1];
                if (nextWord && /^[A-Z][a-z]+/.test(nextWord)) {
                  title += ` ${nextWord}`;
                }
              }
            }

            // Extrag prețul din text (caut EUR la sfârșit)
            let priceText = '0';
            const priceMatch = fullText.match(/(\d+)\s*EUR/);
            if (priceMatch) {
              priceText = priceMatch[1];
            }

            // Extrag imaginea principală
            const imageElement = listing.querySelector('img.ooa-1xl3ae6.e1g5u0ky6');
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
      this.importStats.total = carListings.length;
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

      await new Promise(resolve => setTimeout(resolve, 2000));

      const carDetails = await detailPage.evaluate(() => {
        try {
          // Extrag titlul complet
          const titleElement = document.querySelector('[data-testid="ad-title"]') ||
                              document.querySelector('.offer-title') ||
                              document.querySelector('h1') ||
                              document.querySelector('.ad-title') ||
                              document.querySelector('h2') ||
                              document.querySelector('.title');
          const fullTitle = titleElement ? titleElement.textContent.trim() : '';

          // Încerc să extrag marca și modelul din titlu
          let brand = '';
          let model = '';
          
          if (fullTitle) {
            const titleParts = fullTitle.split(' ');
            brand = titleParts[0] || '';
            
            // Caut al doilea cuvânt care pare să fie modelul
            for (let i = 1; i < titleParts.length; i++) {
              if (titleParts[i] && /^[A-Z][a-z]+/.test(titleParts[i])) {
                model = titleParts[i];
                // Încerc să găsesc și al treilea cuvânt pentru modelul complet
                if (i + 1 < titleParts.length && /^[A-Z][a-z]+/.test(titleParts[i + 1])) {
                  model += ' ' + titleParts[i + 1];
                }
                break;
              }
            }
          }

          // Extrag prețul
          const priceElement = document.querySelector('[data-testid="price"]') ||
                              document.querySelector('.offer-price') ||
                              document.querySelector('.price-value') ||
                              document.querySelector('.price') ||
                              document.querySelector('[class*="price"]') ||
                              document.querySelector('[class*="Price"]');
          const priceText = priceElement ? priceElement.textContent.trim() : '0';
          const price = parseInt(priceText.replace(/[^\d]/g, '')) || 0;

          // Extrag detaliile tehnice - caut în toate elementele posibile
          const details = {};
          
          // Caut în toate elementele care ar putea conține detalii
          const allElements = document.querySelectorAll('*');
          
          allElements.forEach(element => {
            try {
              const text = element.textContent?.trim();
              if (text) {
                // Caut anul
                const yearMatch = text.match(/(?:an|anul|year)\s*:?\s*(\d{4})/i);
                if (yearMatch && !details['year']) {
                  details['year'] = yearMatch[1];
                }
                
                // Caut kilometrii
                const kmMatch = text.match(/(?:rulaj|kilometri|km)\s*:?\s*([\d\s]+)/i);
                if (kmMatch && !details['kilometers']) {
                  details['kilometers'] = kmMatch[1].replace(/\s/g, '');
                }
                
                // Caut combustibilul
                const fuelMatch = text.match(/(?:combustibil|fuel|motorină|benzină|diesel|gpl|hibrid)\s*:?\s*([a-zA-ZăâîșțĂÂÎȘȚ\s]+)/i);
                if (fuelMatch && !details['fuel']) {
                  details['fuel'] = fuelMatch[1].trim();
                }
                
                // Caut cutia de viteze
                const transMatch = text.match(/(?:cutia de viteze|transmisie|transmission)\s*:?\s*([a-zA-ZăâîșțĂÂÎȘȚ\s]+)/i);
                if (transMatch && !details['transmission']) {
                  details['transmission'] = transMatch[1].trim();
                }
                
                // Caut puterea
                const powerMatch = text.match(/(?:puterea motorului|putere|cp|hp)\s*:?\s*(\d+)/i);
                if (powerMatch && !details['power']) {
                  details['power'] = powerMatch[1];
                }
              }
            } catch (e) {
              // Ignor erorile pentru elemente individuale
            }
          });

                  // Mapez detaliile la structura noastră cu valori default mai realiste
        const year = parseInt(details['year']) || 2018; // Default mai realist
        const kilometers = parseInt(details['kilometers']) || 50000; // Default mai realist
        
        // Curăț combustibilul de text extra
        let cleanFuel = details['fuel'] || 'Benzină';
        if (cleanFuel.includes('Cutie de viteze')) {
          cleanFuel = cleanFuel.split('Cutie de viteze')[0].trim();
        }
        
        // Curăț transmisia de text extra
        let cleanTransmission = details['transmission'] || 'Manuală';
        if (cleanTransmission.includes('Tip Caroserie')) {
          cleanTransmission = cleanTransmission.split('Tip Caroserie')[0].trim();
        }
        
        const fuel = cleanFuel || 'Benzină';
        const transmission = cleanTransmission || 'Manuală';
        const power = parseInt(details['power']) || 120; // Default mai realist

          // Extrag descrierea
          const descriptionElement = document.querySelector('[data-testid="description"]') ||
                                    document.querySelector('.offer-description') ||
                                    document.querySelector('.description') ||
                                    document.querySelector('.ad-description') ||
                                    document.querySelector('.content') ||
                                    document.querySelector('p');
          const description = descriptionElement ? descriptionElement.textContent.trim() : '';

          // Extrag toate imaginile - caut în toate locurile posibile
          let images = [];
          
          // Caut imagini în galerie
          const galleryImages = document.querySelectorAll('img[src*="ireland.apollo.olxcdn.com"], img[src*="statics.autovit.ro"], img[src*="otomoto"], img[src*="autovit"]');
          if (galleryImages.length > 0) {
            images = Array.from(galleryImages)
              .map(img => img.src)
              .filter(src => src && !src.includes('logo') && !src.includes('icon') && !src.includes('banner'))
              .slice(0, 20);
          }
          
          // Dacă nu am găsit imagini, caut în toate imaginile
          if (images.length === 0) {
            const allImages = document.querySelectorAll('img');
            images = Array.from(allImages)
              .map(img => img.src)
              .filter(src => src && !src.includes('logo') && !src.includes('icon') && !src.includes('banner'))
              .slice(0, 20);
          }

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
        this.importStats.skipped++;
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

      this.importStats.imported++;
      return car;
    } catch (error) {
      console.error('❌ Eroare la salvarea în baza de date:', error);
      console.error('❌ Stack trace:', error.stack);
      this.importStats.errors++;
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
      
      for (let i = 0; i < listings.length; i++) {
        const listing = listings[i];
        
        try {
          this.importStats.processed = i + 1;
          console.log(`\n🔄 ${i + 1}/${listings.length} - Procesez: ${listing.title}`);
          console.log(`📊 Progres: ${this.importStats.processed}/${this.importStats.total} | Importate: ${this.importStats.imported} | Erori: ${this.importStats.errors} | Sărite: ${this.importStats.skipped}`);
          
          if (!listing.detailUrl) {
            console.log('⚠️  Nu am găsit URL pentru acest anunț, îl sar');
            this.importStats.skipped++;
            continue;
          }

          // Obțin detaliile complete
          const carDetails = await this.scrapeCarDetails(listing.detailUrl);
          
          if (!carDetails) {
            console.log('⚠️  Nu am putut extrage detaliile, trec la următorul');
            this.importStats.errors++;
            continue;
          }

          // Salvez în baza de date
          const savedCar = await this.saveCarToDatabase(carDetails, carDetails.images);
          
          if (savedCar) {
            console.log(`✅ ${savedCar.brand} ${savedCar.model} importat cu succes`);
          }

          // Pauză între cereri pentru a fi respectuos cu serverul
          await new Promise(resolve => setTimeout(resolve, 2000));

        } catch (error) {
          console.error(`❌ Eroare la procesarea anunțului ${listing.title}:`, error);
          this.importStats.errors++;
        }
      }

      console.log(`\n🎉 Import finalizat!`);
      console.log(`📊 Statistici finale:`);
      console.log(`   - Total anunțuri: ${this.importStats.total}`);
      console.log(`   - Procesate: ${this.importStats.processed}`);
      console.log(`   - Importate cu succes: ${this.importStats.imported}`);
      console.log(`   - Erori: ${this.importStats.errors}`);
      console.log(`   - Sărite (duplicate): ${this.importStats.skipped}`);

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
  const scraper = new AutovitScraperImproved();
  
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

export default AutovitScraperImproved;
