-- Add potentially missing columns to SiteSettings table (Hero & Map)
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "heroBadge" TEXT DEFAULT 'Tasavvuf Geleneğinin İzinde';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "heroTitle1" TEXT DEFAULT 'Geylani Rufai';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "heroTitle2" TEXT DEFAULT 'İlim, İrfan ve Hizmet Yolu';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "heroDescription" TEXT DEFAULT 'Tasavvuf geleneğini yaşatmak, gönülleri ilahi aşkla buluşturmak ve gelecek nesillere bu manevi mirası aktarmak amacıyla hizmet ediyoruz.';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "heroButtonText1" TEXT DEFAULT 'Faaliyetlerimiz';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "heroButtonLink1" TEXT DEFAULT '#activities';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "heroButtonText2" TEXT DEFAULT 'Bize Katılın';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "heroButtonLink2" TEXT DEFAULT '#contact';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "heroImage" TEXT DEFAULT 'https://picsum.photos/1920/1080?grayscale&blur=2';

ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "mapTitle" TEXT DEFAULT 'Dernek Konumu';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "mapLat" DOUBLE PRECISION DEFAULT 41.0082;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "mapLng" DOUBLE PRECISION DEFAULT 28.9784;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "mapZoom" INT DEFAULT 15;

-- Add potentially missing columns (Contact)
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "phone" TEXT DEFAULT '';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "phone2" TEXT DEFAULT '';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "email" TEXT DEFAULT '';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "address" TEXT DEFAULT '';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "workingHoursWeekday" TEXT DEFAULT '09:00 - 18:00';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "workingHoursSaturday" TEXT DEFAULT '10:00 - 15:00';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "workingHoursSunday" TEXT DEFAULT 'Kapalı';

-- Add potentially missing columns (Social Media)
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "instagram" TEXT DEFAULT '';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "facebook" TEXT DEFAULT '';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "youtube" TEXT DEFAULT '';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "whatsapp" TEXT DEFAULT '';

-- Add potentially missing columns (Donation)
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "iban" TEXT DEFAULT '';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "ibanHolder" TEXT DEFAULT '';

-- Add potentially missing columns (About)
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "aboutTitle" TEXT DEFAULT '';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "aboutText1" TEXT DEFAULT '';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "aboutText2" TEXT DEFAULT '';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "aboutQuote" TEXT DEFAULT '';


-- Ensure RLS is disabled as per setup
ALTER TABLE "SiteSettings" DISABLE ROW LEVEL SECURITY;
