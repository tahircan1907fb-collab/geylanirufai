-- ============================================
-- Geylani Rufai - Supabase Table Setup
-- ============================================

-- 1. Admin table
CREATE TABLE IF NOT EXISTS "Admin" (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Activity table
CREATE TABLE IF NOT EXISTS "Activity" (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  "sortOrder" INT DEFAULT 0
);

-- 3. Event table
CREATE TABLE IF NOT EXISTS "Event" (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL
);

-- 4. GalleryImage table
CREATE TABLE IF NOT EXISTS "GalleryImage" (
  id SERIAL PRIMARY KEY,
  src TEXT NOT NULL,
  alt TEXT NOT NULL,
  category TEXT NOT NULL
);

-- 5. SiteSettings table
CREATE TABLE IF NOT EXISTS "SiteSettings" (
  id INT PRIMARY KEY DEFAULT 1,
  "aboutTitle" TEXT DEFAULT '',
  "aboutText1" TEXT DEFAULT '',
  "aboutText2" TEXT DEFAULT '',
  "aboutQuote" TEXT DEFAULT '',
  iban TEXT DEFAULT '',
  "ibanHolder" TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  phone2 TEXT DEFAULT '',
  email TEXT DEFAULT '',
  address TEXT DEFAULT '',
  "workingHoursWeekday" TEXT DEFAULT '09:00 - 18:00',
  "workingHoursSaturday" TEXT DEFAULT '10:00 - 15:00',
  "workingHoursSunday" TEXT DEFAULT 'Kapalı',
  instagram TEXT DEFAULT '',
  facebook TEXT DEFAULT '',
  youtube TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '',
  "heroBadge" TEXT DEFAULT 'Tasavvuf Geleneğinin İzinde',
  "heroTitle1" TEXT DEFAULT 'Geylani Rufai',
  "heroTitle2" TEXT DEFAULT 'İlim, İrfan ve Hizmet Yolu',
  "heroDescription" TEXT DEFAULT 'Tasavvuf geleneğini yaşatmak, gönülleri ilahi aşkla buluşturmak ve gelecek nesillere bu manevi mirası aktarmak amacıyla hizmet ediyoruz.',
  "heroButtonText1" TEXT DEFAULT 'Faaliyetlerimiz',
  "heroButtonLink1" TEXT DEFAULT '#activities',
  "heroButtonText2" TEXT DEFAULT 'Bize Katılın',
  "heroButtonLink2" TEXT DEFAULT '#contact',
  "heroImage" TEXT DEFAULT 'https://picsum.photos/1920/1080?grayscale&blur=2',
  "mapTitle" TEXT DEFAULT 'Dernek Konumu',
  "mapLat" DOUBLE PRECISION DEFAULT 41.0082,
  "mapLng" DOUBLE PRECISION DEFAULT 28.9784,
  "mapZoom" INT DEFAULT 15
);

-- Disable RLS (all access goes through backend API)
ALTER TABLE "Admin" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Activity" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Event" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "GalleryImage" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "SiteSettings" DISABLE ROW LEVEL SECURITY;
