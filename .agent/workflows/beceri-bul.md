---
description: Kullanici istegine gore en uygun skillleri skorlayip listeler.
---

# /beceri-bul - Skill Ara

$ARGUMENTS

---

## Gorev

Kullanici istegine gore en uygun skillleri bul ve gerekceli sekilde sirala.

### Komut

```bash
python ".agent/skills/beceri-yonetimi/scripts/router.py" search "$ARGUMENTS"
```

---

## Davranis Kurallari

1. Arguman bos ise tek satir uyar:
   - `Lutfen /beceri-bul komutundan sonra bir istek yazin.`
2. Cikti her skill icin su alanlari icermeli:
   - skill adi ve ID
   - skor
   - secilme nedeni
   - kaynak ve yol
   - kisa aciklama

---

## Ornekler

```bash
/beceri-bul React admin panel test otomasyon
/beceri-bul API guvenligi ve kimlik dogrulama
/beceri-bul deploy ve docker pipeline
```
