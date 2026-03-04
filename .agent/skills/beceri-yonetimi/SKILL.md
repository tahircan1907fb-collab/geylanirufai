---
name: beceri-yonetimi
description: Kullanıcı isteklerini analiz eder ve en uygun harici yeteneği (skill) bulup çalıştırır.
---

# Beceri Yönetimi (Skill Router)

## Açıklama
Bu beceri, `.agent/skills/external` altında bulunan yüzlerce yeteneği tarar ve kullanıcının doğal dildeki isteğine en uygun olanı bulur.

Yeni yönlendirme mimarisi ile önce kategori shard dosyalarına (`skill_frontend`, `skill_backend`, `skill_devops` vb.) bakar, güven düşükse genel kataloğa fallback yapar.

## Komutlar

### `/beceri-bul [istek]`
Kullanıcının isteğine uygun becerileri Listeler.
- **Örnek:** `/beceri-bul pdf birleştirme`
- **Nasıl Çalışır:** Gelişmiş skorlamayla isim, açıklama, alan eşleşmesi ve kaynak önceliğine göre en iyi skillleri sıralar.

### `/beceri-profesyonel [istek]`
Yazdığınız promptu analiz eder, en iyi skillleri seçer ve profesyonel uygulanabilir bir çalışma promptu üretir.
- **Örnek:** `/beceri-profesyonel React admin paneli için güvenli API + test altyapısı kur`
- **Nasıl Çalışır:**
  1. İsteğin alanlarını (frontend/backend/testing/security/devops/ai) tespit eder.
  2. En uygun skillleri skorlar ve gerekçeleriyle listeler.
  3. Seçilen skilllere göre profesyonel uygulama promptu üretir.

### `/beceri-detay [skill_id]`
Belirtilen becerinin detaylarını ve kullanım talimatlarını getirir.
- **Örnek:** `/beceri-detay pdf-merger`

## Katalog Güncelleme
Yeni beceriler eklendiğinde kataloğu güncellemek için:
```bash
python .agent/skills/beceri-yonetimi/scripts/update_catalog.py
```
