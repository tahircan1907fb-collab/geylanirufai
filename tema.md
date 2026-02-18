# Geylani Rufai - Tema Bilgi Rehberi

Bu dosya, Geylani Rufai web sitesinde kullanılan görsel dilli, renk paletini, tipografi ayarlarını ve tasarım prensiplerini detaylandırmaktadır. Yeni bileşenler oluşturulurken bu rehber esas alınmalıdır.

## 🎨 Renk Paleti

Proje, tasavvufi ve premium bir hava oluşturmak için derin yeşiller, altın tonları ve krem zeminler üzerine kurulmuştur.

| Renk | Değişken Adı | HEX Kodu | Kullanım Alanı |
| :--- | :--- | :--- | :--- |
| **Zümrüt Yeşili** | `emerald-900` | `#064e3b` | Ana arka planlar, bölümler |
| **Altın/Gold** | `gold-500` | `#D4AF37` | Vurgular, ikonlar, sınırlar |
| **Lacivert** | `navy-900` | `#0F172A` | Koyu vurgular, alt bilgi (footer) |
| **Krem** | `cream-50` | `#FDFBF7` | Genel arka plan, açık alanlar |
| **Krem Koyu** | `cream-100` | `#F7F3E8` | Kart arka planları |

## Typography (Tipografi)

Üç farklı font ailesi, hiyerarşi ve okunabilirlik için optimize edilmiştir.

- **Başlıklar (`font-heading`):** `Cinzel` (Serif)
  - Klasik ve vakur bir duruş için kullanılır (h1, h2, h3).
- **Metinler (`font-serif`):** `Amiri` (Serif)
  - Klasik İslami yazım diline uygun, akıcı metinler ve alıntılar için.
- **Modern/Hızlı Metinler (`font-sans`):** `Inter` (Sans-serif)
  - Kullanıcı arayüzü, navlinkler ve genel fonksiyonel metinler için.

## ✨ Özel Sınıflar ve Desenler

### 🌙 İslam Deseni (`.islamic-pattern`)
Düşük opaklıklı (0.05) altın rengi bir örüntüden oluşur. Bölüm arka planlarında derinlik sağlamak için kullanılır.

### 📜 Kaydırma Efektleri (Scroll Reveal)
`Intersection Observer` tabanlı animasyon sınıfları:
- `.scroll-reveal`: Aşağıdan yukarıya geliş.
- `.scroll-reveal-left` / `.scroll-reveal-right`: Yanlardan geliş.
- `.scroll-reveal-delay-1...6`: Izgara (grid) elemanları için sıralı gecikme.

## 🛠️ Tasarım Prensipleri (Avant-Garde & Premium)

1. **Vurgu Çizgileri:** Kartlarda veya bölümlerde mutlaka `gold-500` renginde 4px kalınlığında üst veya sol çizgiler kullanılmalıdır.
2. **Yumuşak Geçişler:** `.transition-all duration-300` standart hover süresidir.
3. **Cam Efekti (Glassmorphism):** Koyu arka planlar üzerinde `bg-white/10 backdrop-blur-md` kullanılarak modern bir katmanlaşma sağlanır.
4. **Boşluk Kullanımı:** Bölümler arası dikey boşluklar (`py-24` veya `py-32`) geniş tutularak ferahlık hissi verilir.
