---
description: Yazilan promptu analiz eder, en uygun skillleri secer ve profesyonel uygulama promptu uretir.
---

# /beceri-profesyonel - Promptu Skill Bazli Profesyonellestir

$ARGUMENTS

---

## Gorev

Kullanici promptunu al, `beceri-yonetimi` router ile en uygun skillleri sec ve uygulanabilir profesyonel prompt ciktisi uret.

### Komut

```bash
python ".agent/skills/beceri-yonetimi/scripts/router.py" profesyonel "$ARGUMENTS"
```

---

## Davranis Kurallari

1. Arguman bos ise tek satir hata ver:
   - `Lutfen /beceri-profesyonel komutundan sonra bir istek yazin.`
2. Once secilen skillleri ve nedenlerini goster.
3. Ardindan profesyonel uygulama promptunu tam metin olarak ver.
4. Ciktiyi kisaltma; kullanicinin dogrudan kopyalayip kullanabilecegi formatta sun.

---

## Ornekler

```bash
/beceri-profesyonel React admin paneli icin guvenli API ve test mimarisi kur
/beceri-profesyonel E-ticaret projesi icin performans odakli frontend + backend plani yaz
/beceri-profesyonel Mobil uygulama backend'ini olceklendirilebilir ve izlenebilir yap
```

---

## Beklenen Cikti

- En iyi skill listesi (skor + neden)
- Profesyonel uygulama promptu:
  - Rol
  - Kullanici talebi
  - Secilen skilller
  - Uygulama kurallari
  - Cikti formati
