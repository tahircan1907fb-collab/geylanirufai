# Troubleshooting — Bilinen Hatalar ve Çözümleri

---

## 1. `/api/settings` 500 Internal Server Error + JSON.parse Hatası

**Tarih:** 2026-02-18  
**Belirtiler:**
- `GET /api/settings` → `500 Internal Server Error`
- Frontend konsolda: `SyntaxError: JSON.parse: unexpected character at line 1 column 1`
- `Hero.tsx` ve `Contact.tsx` bileşenlerinde ayarlar yüklenemiyor
- Backend HTML hata sayfası dönüyor (JSON yerine)

**Kök Neden:**  
Prisma schema'ya yeni alanlar eklendi ama `prisma db push` çalıştırılmadı. DB ile schema uyumsuzluğu → `PrismaClientKnownRequestError`. GET handler'da try-catch olmadığı için Express varsayılan HTML hata sayfası döndü, frontend bunu JSON olarak parse etmeye çalıştı.

**Çözüm Adımları:**

```bash
# 1. Çalışan sunucuyu durdur
taskkill /F /IM node.exe

# 2. DB şemasını senkronize et
npx prisma db push

# 3. Sunucuyu yeniden başlat
npm run dev

# 4. Test et
curl -s http://localhost:3001/api/settings
# JSON dönmeli, HTML değil
```

**Kontrol Listesi (bu hata tekrarlarsa):**
1. `prisma/schema.prisma` dosyasında yeni alan var mı? → `npx prisma db push` çalıştır
2. Sunucu çalışırken `db push` hata veriyorsa → önce `taskkill /F /IM node.exe` ile durdur
3. Route handler'larında try-catch var mı? → Yoksa ekle (HTML yerine JSON hata dönmesi için)
4. `.env` dosyasında `DATABASE_URL` doğru mu? → `file:./dev.db` olmalı

**Önlem:**  
Schema'ya her yeni alan eklendiğinde **mutlaka** `npx prisma db push` çalıştırılmalı.

---

## 2. "Geçersiz kullanıcı adı veya şifre" — Admin Giriş Hatası

**Tarih:** 2026-02-18  
**Belirtiler:**
- Admin paneline giriş yapılamıyor
- "Geçersiz kullanıcı adı veya şifre" hatası

**Kök Neden:**  
`prisma db push` çalıştırıldığında tablolar yeniden oluşturulabilir ve mevcut veriler (Admin kaydı dahil) silinebilir.

**Çözüm:**

```bash
# Seed verisini tekrar yükle
npx tsx server/seed.ts
```

**Varsayılan giriş bilgileri:**
- **Kullanıcı adı:** `admin`
- **Şifre:** `admin123`

**Önemli Not:**  
`prisma db push` her çalıştırıldığında `npx tsx server/seed.ts` ile verileri tekrar yükle.

---
