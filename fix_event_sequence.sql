-- Bu sorguyu Supabase SQL Editöründe çalıştırın
-- Bu işlem, "duplice key value violates unique constraint" hatasını çözer.
-- Event tablosundaki ID sayacını, mevcut en büyük ID'nin bir fazlasına eşitler.

BEGIN;

-- Tabloyu kilitle (güvenlik için)
LOCK TABLE "Event" IN EXCLUSIVE MODE;

-- Diziyi (sequence) güncelle
SELECT setval(
    pg_get_serial_sequence('"Event"', 'id'), 
    COALESCE((SELECT MAX(id) FROM "Event"), 0) + 1, 
    false
);

COMMIT;
