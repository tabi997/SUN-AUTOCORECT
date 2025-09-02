import puppeteer from 'puppeteer';

const TEST_CAR_URL = 'https://www.autovit.ro/autoturisme/anunt/dacia-duster-ID7HFOK2.html';

async function testCarDetailsExtraction() {
  let browser;
  
  try {
    console.log('🚀 Testez extragerea detaliilor mașinii...');
    console.log(`🔗 URL test: ${TEST_CAR_URL}`);
    
    browser = await puppeteer.launch({ 
      headless: false, // Afișez browser-ul pentru a vedea ce se întâmplă
      defaultViewport: null,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');

    console.log('📋 Navighez către pagina mașinii...');
    await page.goto(TEST_CAR_URL, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    console.log('⏳ Aștept încărcarea paginii...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('🔍 Testez extragerea detaliilor...');
    
    const carDetails = await page.evaluate(() => {
      try {
        // Extrag titlul complet
        const titleElement = document.querySelector('[data-testid="ad-title"]') ||
                            document.querySelector('.offer-title') ||
                            document.querySelector('h1') ||
                            document.querySelector('.ad-title') ||
                            document.querySelector('h2') ||
                            document.querySelector('.title');
        const fullTitle = titleElement ? titleElement.textContent.trim() : '';

        console.log('Titlu găsit:', fullTitle);

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

        console.log('Preț găsit:', priceText, '->', price);

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
                console.log('An găsit:', yearMatch[1], 'în textul:', text.substring(0, 100));
              }
              
              // Caut kilometrii
              const kmMatch = text.match(/(?:rulaj|kilometri|km)\s*:?\s*([\d\s]+)/i);
              if (kmMatch && !details['kilometers']) {
                details['kilometers'] = kmMatch[1].replace(/\s/g, '');
                console.log('Kilometri găsiți:', kmMatch[1], 'în textul:', text.substring(0, 100));
              }
              
              // Caut combustibilul
              const fuelMatch = text.match(/(?:combustibil|fuel|motorină|benzină|diesel|gpl|hibrid)\s*:?\s*([a-zA-ZăâîșțĂÂÎȘȚ\s]+)/i);
              if (fuelMatch && !details['fuel']) {
                details['fuel'] = fuelMatch[1].trim();
                console.log('Combustibil găsit:', fuelMatch[1], 'în textul:', text.substring(0, 100));
              }
              
              // Caut cutia de viteze
              const transMatch = text.match(/(?:cutia de viteze|transmisie|transmission)\s*:?\s*([a-zA-ZăâîșțĂÂÎȘȚ\s]+)/i);
              if (transMatch && !details['transmission']) {
                details['transmission'] = transMatch[1].trim();
                console.log('Transmisie găsită:', transMatch[1], 'în textul:', text.substring(0, 100));
              }
              
              // Caut puterea
              const powerMatch = text.match(/(?:puterea motorului|putere|cp|hp)\s*:?\s*(\d+)/i);
              if (powerMatch && !details['power']) {
                details['power'] = powerMatch[1];
                console.log('Putere găsită:', powerMatch[1], 'în textul:', text.substring(0, 100));
              }
            }
          } catch (e) {
            // Ignor erorile pentru elemente individuale
          }
        });

        // Mapez detaliile la structura noastră cu valori default mai realiste
        const year = parseInt(details['year']) || 2018; // Default mai realist
        const kilometers = parseInt(details['kilometers']) || 50000; // Default mai realist
        const fuel = details['fuel'] || 'Benzină';
        const transmission = details['transmission'] || 'Manuală';
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

        console.log('Imagini găsite:', images.length);

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

    console.log('\n📊 Detaliile extrase:');
    console.log('Brand:', carDetails.brand);
    console.log('Model:', carDetails.model);
    console.log('Titlu complet:', carDetails.fullTitle);
    console.log('An:', carDetails.year);
    console.log('Kilometri:', carDetails.kilometers);
    console.log('Combustibil:', carDetails.fuel);
    console.log('Transmisie:', carDetails.transmission);
    console.log('Putere:', carDetails.power);
    console.log('Preț:', carDetails.price);
    console.log('Descriere:', carDetails.description?.substring(0, 200) + '...');
    console.log('Număr imagini:', carDetails.images?.length || 0);

    // Aștept să văd pagina
    console.log('\n⏳ Browser-ul rămâne deschis pentru 30 de secunde...');
    console.log('Poți inspecta manual pagina pentru a vedea structura reală');
    await new Promise(resolve => setTimeout(resolve, 30000));

  } catch (error) {
    console.error('❌ Eroare la test:', error);
  } finally {
    if (browser) {
      console.log('🔒 Închid browser-ul...');
      await browser.close();
    }
  }
}

testCarDetailsExtraction();
