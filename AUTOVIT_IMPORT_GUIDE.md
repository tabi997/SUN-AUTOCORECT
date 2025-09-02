# Ghid Import Autovit

Acest ghid explică cum să folosești funcționalitatea de import a anunțurilor din Autovit în stocul local.

## 🚀 Funcționalități

- **Web Scraping automat** - Preia anunțurile din inventory-ul Autovit
- **Import complet** - Extrage toate detaliile (marcă, model, an, km, combustibil, etc.)
- **Gestionarea imaginilor** - Descarcă și salvează primele 15-20 de fotografii
- **Evită duplicatele** - Verifică dacă mașina există deja înainte de import
- **Interfață admin** - Buton pentru import direct din panoul de administrare

## 📋 Cerințe

- Node.js v18 sau mai nou
- Acces la internet
- Cont Supabase configurat
- Storage bucket `car-images` creat în Supabase

## 🛠️ Instalare

1. **Instalează dependențele:**
```bash
npm install
```

2. **Verifică configurarea Supabase:**
   - Asigură-te că variabilele de mediu sunt setate corect
   - Verifică că bucket-ul `car-images` există în storage

## 🎯 Utilizare

### Metoda 1: Din interfața Admin

1. Accesează panoul de administrare
2. Navighează la secțiunea "Car Management"
3. Apasă butonul "Începe Importul" din cardul "Import Autovit"
4. Monitorizează progresul în timp real

### Metoda 2: Din linia de comandă

```bash
npm run import-autovit
```

## ⚙️ Configurare

### URL-ul Inventory-ului

Scriptul este configurat să preia anunțurile de la:
```
https://sunautocorect.autovit.ro/inventory
```

Pentru a schimba URL-ul, editează variabila `AUTOVIT_INVENTORY_URL` din `import-autovit-cars.js`.

### Configurare Browser

Pentru a rula în mod headless (fără interfață grafică), schimbă în `import-autovit-cars.js`:

```javascript
this.browser = await puppeteer.launch({
  headless: true, // Schimbă de la false la true
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
```

## 📊 Structura Datelor

### Tabela `cars`
- `brand` - Marca mașinii
- `model` - Modelul mașinii
- `year` - Anul de fabricație
- `kilometers` - Kilometrajul
- `fuel` - Tipul de combustibil
- `power` - Puterea motorului (CP)
- `transmission` - Tipul transmisiei
- `price` - Prețul
- `monthly_rate` - Rata lunară (estimată automat)
- `description` - Descrierea mașinii
- `status` - Statusul (active/sold/reserved/inactive)

### Tabela `car_images`
- `car_id` - ID-ul mașinii
- `image_url` - URL-ul imaginii în Supabase Storage
- `is_primary` - Dacă este imaginea principală
- `order_index` - Ordinea imaginii

## 🔧 Personalizare

### Selectori CSS

Dacă structura paginii Autovit se schimbă, poți actualiza selectorii CSS din funcția `scrapeInventory()`:

```javascript
const listings = document.querySelectorAll('[data-testid="listing-ad"]') || 
                 document.querySelectorAll('.advert-card') ||
                 document.querySelectorAll('.offer-item') ||
                 document.querySelectorAll('.listing-item');
```

### Mapearea Detaliilor

Pentru a adapta extragerea detaliilor, modifică funcția `scrapeCarDetails()`:

```javascript
const year = parseInt(details['anul'] || details['an'] || details['year'] || '2020');
const kilometers = parseInt((details['rulaj'] || details['kilometri'] || '0').replace(/[^\d]/g, '')) || 0;
```

## 🚨 Limitări și Considerații

### Rate Limiting
- Scriptul include pauze de 2 secunde între cereri
- Respectă termenii de utilizare ale Autovit

### Erori Comune
- **Timeout la încărcare**: Mărește timeout-ul în `page.goto()`
- **Imagini nu se descarcă**: Verifică accesul la URL-urile imaginilor
- **Duplicate**: Scriptul verifică automat duplicatele

### Performanță
- Importul poate dura câteva minute pentru multe anunțuri
- Fiecare imagine este descărcată și uploadată individual
- Folosește storage temporar pentru imagini

## 🔍 Debugging

### Log-uri Detaliate
Scriptul afișează log-uri detaliate pentru fiecare pas:
- 🚀 Inițializare browser
- 📋 Navigare către inventory
- 🔍 Analizare detalii anunț
- 💾 Salvare în baza de date
- 📸 Procesare imagini

### Verificare Rezultate
După import, verifică:
1. Tabela `cars` pentru mașinile importate
2. Tabela `car_images` pentru imaginile asociate
3. Storage bucket `car-images` pentru fișierele uploadate

## 🆘 Suport

Pentru probleme sau întrebări:
1. Verifică log-urile pentru erori specifice
2. Asigură-te că toate dependențele sunt instalate
3. Verifică configurarea Supabase
4. Testează cu un singur anunț mai întâi

## 📝 Changelog

### v1.0.0
- Implementare inițială
- Web scraping cu Puppeteer
- Import complet cu imagini
- Interfață admin integrată
- Verificare duplicate
- Gestionare erori robustă
