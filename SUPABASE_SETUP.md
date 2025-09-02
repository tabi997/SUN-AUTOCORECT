# Configurarea Supabase pentru SUN AUTOCORECT

## 🚀 Pași de Configurare

### 1. Accesează Supabase Dashboard
- Mergi la [https://supabase.com](https://supabase.com)
- Conectează-te la contul tău
- Accesează proiectul: `chcxobmpobnesefbsbev`

### 2. Configurează Baza de Date
- În Dashboard, mergi la **SQL Editor**
- Copiază și rulează conținutul din `supabase-setup.sql`
- Acest script va crea toate tabelele necesare

### 3. Configurează Autentificarea
- În Dashboard, mergi la **Authentication > Settings**
- Activează **Email Auth** dacă nu este activat
- În **Site URL**, adaugă: `http://localhost:5173` (pentru development)
- Salvează modificările

### 4. Creează Primul Utilizator Admin
- În Dashboard, mergi la **Authentication > Users**
- Creează un utilizator nou cu email-ul tău
- Setează o parolă sigură
- Acest utilizator va avea acces la dashboard-ul de admin

### 5. Testează Integrarea
- Rulează aplicația: `npm run dev`
- Mergi la `/login` și conectează-te cu credențialele create
- Accesează `/admin` pentru a vedea dashboard-ul

## 📊 Structura Tabelelor

### Tabela `cars`
- **id**: ID unic pentru mașină
- **brand**: Marca mașinii (ex: BMW, Mercedes)
- **model**: Modelul mașinii (ex: Seria 3, GLC)
- **year**: Anul de fabricație
- **kilometers**: Kilometrii parcurși
- **fuel**: Tipul de combustibil
- **power**: Puterea în CP
- **transmission**: Tipul de transmisie
- **price**: Prețul în euro
- **monthly_rate**: Rata lunară (opțional)
- **featured**: Dacă mașina este featured
- **image_url**: URL-ul imaginii
- **description**: Descrierea mașinii
- **created_at**: Data creării
- **updated_at**: Data ultimei actualizări

### Tabela `leads`
- **id**: ID unic pentru lead
- **name**: Numele persoanei
- **email**: Email-ul de contact
- **phone**: Numărul de telefon (opțional)
- **message**: Mesajul trimis
- **source**: Sursa lead-ului (contact, newsletter, car_inquiry)
- **car_id**: ID-ul mașinii (opțional, pentru întrebări specifice)
- **status**: Statusul lead-ului (new, contacted, converted, lost)
- **created_at**: Data creării

### Tabela `newsletter_subscriptions`
- **id**: ID unic pentru abonament
- **email**: Email-ul abonatului
- **active**: Dacă abonamentul este activ
- **created_at**: Data abonării

## 🔐 Autentificare

### Rute Protejate
- `/admin` - Dashboard-ul de admin (necesită autentificare)
- `/login` - Pagina de login

### Rute Publice
- `/` - Pagina principală
- Formularele de contact și newsletter

## 🛠️ Funcționalități Implementate

### Dashboard Admin
- **Statistici generale**: Numărul de mașini, lead-uri, abonamente
- **Gestionare mașini**: Adăugare, editare, ștergere anunțuri
- **Gestionare lead-uri**: Vizualizare, actualizare status, ștergere
- **Gestionare newsletter**: Vizualizare abonamente, export CSV

### Frontend
- **Integrare Supabase**: Toate datele sunt preluate din baza de date
- **Fallback**: Dacă Supabase nu este disponibil, se folosesc datele hardcodate
- **Responsive**: Design adaptabil pentru toate dispozitivele

## 🚨 Probleme Comune și Soluții

### 1. Eroare de Conectare la Supabase
- Verifică dacă URL-ul și cheile sunt corecte în `src/lib/supabase.ts`
- Asigură-te că proiectul Supabase este activ

### 2. Tabelele nu sunt create
- Rulează din nou scriptul SQL în Supabase Dashboard
- Verifică dacă ai permisiuni de admin pe proiect

### 3. Autentificarea nu funcționează
- Verifică setările de autentificare în Supabase
- Asigură-te că utilizatorul există în tabela `auth.users`

### 4. CORS Errors
- În Supabase Dashboard, mergi la **Settings > API**
- Adaugă `http://localhost:5173` în **Additional Allowed Origins**

## 📱 Testare

### 1. Testează Dashboard-ul
- Conectează-te la `/admin`
- Adaugă o mașină nouă
- Verifică dacă apare pe pagina principală

### 2. Testează Lead-urile
- Completează un formular de contact
- Verifică dacă lead-ul apare în dashboard

### 3. Testează Newsletter-ul
- Abonează-te la newsletter
- Verifică dacă abonamentul apare în dashboard

## 🔧 Personalizare

### 1. Adaugă Câmpuri Noi
- Modifică scriptul SQL pentru a adăuga coloane noi
- Actualizează interfețele TypeScript în `src/lib/supabase.ts`
- Modifică componentele pentru a afișa noile câmpuri

### 2. Modifică Design-ul
- Toate stilurile sunt în `src/index.css` și `tailwind.config.ts`
- Componentele folosesc shadcn/ui cu temă personalizată

### 3. Adaugă Funcționalități
- Creează noi servicii în `src/lib/services.ts`
- Adaugă noi componente în `src/components/admin/`

## 📞 Suport

Pentru probleme sau întrebări:
1. Verifică log-urile din consola browser-ului
2. Verifică log-urile din Supabase Dashboard
3. Asigură-te că toate dependințele sunt instalate: `npm install`

## 🎯 Următorii Pași

1. **Configurare producție**: Actualizează URL-urile pentru domeniul de producție
2. **Backup**: Configurează backup-uri automate în Supabase
3. **Monitoring**: Adaugă log-uri și monitoring pentru performanță
4. **SEO**: Optimizează meta tag-urile și structura pentru SEO
5. **Analytics**: Integrează Google Analytics sau alte tool-uri de tracking
