-- Bu sorguyu Supabase SQL Editöründe çalıştırın
-- Bu işlem, yanlışlıkla "2026-02-22" veya hatalı girilen tarihleri düzeltir.

BEGIN;

-- 2026-02-22 olan kayıtları 2023-10-15 (15 Ekim 2023) olarak güncelle
UPDATE "Event" 
SET date = '2023-10-15' 
WHERE date = '2026-02-22';

-- Alternatif: Tüm 2026 yılındaki kayıtları 2023'e çekmek isterseniz:
-- UPDATE "Event" SET date = REPLACE(date, '2026-', '2023-') WHERE date LIKE '2026-%';

COMMIT;
