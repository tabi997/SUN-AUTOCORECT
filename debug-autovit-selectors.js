import puppeteer from 'puppeteer';

const AUTOVIT_INVENTORY_URL = 'https://sunautocorect.autovit.ro/inventory';

async function debugAutovitSelectors() {
  let browser;
  
  try {
    console.log('🚀 Inițializez browser-ul pentru debug...');
    browser = await puppeteer.launch({ 
      headless: false, // Afișez browser-ul pentru a vedea ce se întâmplă
      defaultViewport: null,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');

    console.log('📋 Navighez către inventory-ul Autovit...');
    await page.goto(AUTOVIT_INVENTORY_URL, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    console.log('⏳ Aștept încărcarea anunțurilor...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('🔍 Analizez structura paginii...');
    
    // Analizez toate elementele posibile
    const pageAnalysis = await page.evaluate(() => {
      const analysis = {
        title: document.title,
        url: window.location.href,
        bodyClasses: document.body.className,
        possibleSelectors: [],
        allLinks: [],
        allImages: [],
        allDivs: [],
        allArticles: []
      };

      // Caut toate link-urile
      const links = document.querySelectorAll('a[href*="/oferta/"], a[href*="/ad/"], a[href*="/anunt/"]');
      analysis.allLinks = Array.from(links).slice(0, 10).map(link => ({
        href: link.href,
        text: link.textContent?.trim().substring(0, 100),
        className: link.className,
        parentTag: link.parentElement?.tagName,
        parentClass: link.parentElement?.className
      }));

      // Caut toate imaginile
      const images = document.querySelectorAll('img');
      analysis.allImages = Array.from(images).slice(0, 10).map(img => ({
        src: img.src,
        alt: img.alt,
        className: img.className,
        parentTag: img.parentElement?.tagName,
        parentClass: img.parentElement?.className
      }));

      // Caut toate div-urile cu clase relevante
      const divs = document.querySelectorAll('div[class*="ad"], div[class*="offer"], div[class*="listing"], div[class*="item"]');
      analysis.allDivs = Array.from(divs).slice(0, 10).map(div => ({
        className: div.className,
        text: div.textContent?.trim().substring(0, 100),
        children: div.children.length
      }));

      // Caut toate article-urile
      const articles = document.querySelectorAll('article');
      analysis.allArticles = Array.from(articles).slice(0, 10).map(article => ({
        className: article.className,
        text: article.textContent?.trim().substring(0, 100),
        children: article.children.length
      }));

      // Caut toate elementele cu data-testid
      const testElements = document.querySelectorAll('[data-testid]');
      analysis.possibleSelectors = Array.from(testElements).map(el => ({
        tag: el.tagName,
        dataTestId: el.getAttribute('data-testid'),
        className: el.className,
        text: el.textContent?.trim().substring(0, 100)
      }));

      return analysis;
    });

    console.log('📊 Analiza paginii:');
    console.log('Title:', pageAnalysis.title);
    console.log('URL:', pageAnalysis.url);
    console.log('Body classes:', pageAnalysis.bodyClasses);
    
    console.log('\n🔍 Elemente cu data-testid:');
    pageAnalysis.possibleSelectors.forEach((el, index) => {
      console.log(`${index + 1}. <${el.tag} data-testid="${el.dataTestId}" class="${el.className}">`);
      console.log(`   Text: ${el.text}`);
    });

    console.log('\n🔗 Link-uri posibile:');
    pageAnalysis.allLinks.forEach((link, index) => {
      console.log(`${index + 1}. ${link.href}`);
      console.log(`   Text: ${link.text}`);
      console.log(`   Class: ${link.className}`);
      console.log(`   Parent: <${link.parentTag} class="${link.parentClass}">`);
    });

    console.log('\n🖼️  Imagini posibile:');
    pageAnalysis.allImages.forEach((img, index) => {
      console.log(`${index + 1}. ${img.src}`);
      console.log(`   Alt: ${img.alt}`);
      console.log(`   Class: ${img.className}`);
      console.log(`   Parent: <${img.parentTag} class="${img.parentClass}">`);
    });

    console.log('\n📦 Div-uri cu clase relevante:');
    pageAnalysis.allDivs.forEach((div, index) => {
      console.log(`${index + 1}. <div class="${div.className}">`);
      console.log(`   Text: ${div.text}`);
      console.log(`   Children: ${div.children}`);
    });

    console.log('\n📄 Article-uri:');
    pageAnalysis.allArticles.forEach((article, index) => {
      console.log(`${index + 1}. <article class="${article.className}">`);
      console.log(`   Text: ${article.text}`);
      console.log(`   Children: ${article.children}`);
    });

    // Încerc să găsesc anunțurile cu selectorii actuali
    console.log('\n🧪 Testez selectorii actuali...');
    
    const testResults = await page.evaluate(() => {
      const results = {};
      
      // Testez selectorii din scriptul original
      const selectors = [
        '[data-testid="listing-ad"]',
        '.advert-card',
        '.offer-item',
        '.listing-item',
        '.ad-item',
        '.offer-card',
        '.listing-card'
      ];
      
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        results[selector] = elements.length;
      });
      
      // Testez și alte selectorii posibili
      const additionalSelectors = [
        'div[class*="ad"]',
        'div[class*="offer"]',
        'div[class*="listing"]',
        'div[class*="item"]',
        'article[class*="ad"]',
        'article[class*="offer"]',
        'article[class*="listing"]'
      ];
      
      additionalSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        results[selector] = elements.length;
      });
      
      return results;
    });

    console.log('\n📊 Rezultatele testelor cu selectorii:');
    Object.entries(testResults).forEach(([selector, count]) => {
      console.log(`${selector}: ${count} elemente`);
    });

    // Aștept să văd pagina
    console.log('\n⏳ Browser-ul rămâne deschis pentru 30 de secunde...');
    console.log('Poți inspecta manual pagina pentru a vedea structura reală');
    await new Promise(resolve => setTimeout(resolve, 30000));

  } catch (error) {
    console.error('❌ Eroare la debug:', error);
  } finally {
    if (browser) {
      console.log('🔒 Închid browser-ul...');
      await browser.close();
    }
  }
}

debugAutovitSelectors();
