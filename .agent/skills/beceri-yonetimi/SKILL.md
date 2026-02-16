---
name: beceri-yonetimi
description: Kullanıcı isteklerini analiz eder ve en uygun harici yeteneği (skill) bulup çalıştırır.
---

# Beceri Yönetimi (Skill Router)

## Açıklama
Bu beceri, `.agent/skills/external` altında bulunan yüzlerce yeteneği tarar ve kullanıcının doğal dildeki isteğine en uygun olanı bulur.

## Komutlar

### `/beceri-bul [istek]`
Kullanıcının isteğine uygun becerileri Listeler.
- **Örnek:** `/beceri-bul pdf birleştirme`
- **Nasıl Çalışır:** `SKILL_CATALOG.json` dosyasında anahtar kelime araması yapar.

### `/beceri-detay [skill_id]`
Belirtilen becerinin detaylarını ve kullanım talimatlarını getirir.
- **Örnek:** `/beceri-detay pdf-merger`

## Katalog Güncelleme
Yeni beceriler eklendiğinde kataloğu güncellemek için:
```bash
python .agent/skills/beceri-yonetimi/scripts/update_catalog.py
```
