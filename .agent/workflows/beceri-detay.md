---
description: Belirtilen skill ID icin detay bilgilerini gosterir.
---

# /beceri-detay - Skill Detayi

$ARGUMENTS

---

## Gorev

Verilen `skill_id` icin katalogdan detay bilgilerini getir.

### Komut

```bash
python ".agent/skills/beceri-yonetimi/scripts/router.py" detail "$ARGUMENTS"
```

---

## Davranis Kurallari

1. `skill_id` bos ise uyar:
   - `Lutfen /beceri-detay komutundan sonra bir skill_id yazin.`
2. Skill bulunduysa su alanlari goster:
   - Name
   - ID
   - Kaynak
   - Yol
   - Aciklama
3. Skill bulunamazsa net hata ver:
   - `Beceri bulunamadi.`

---

## Ornekler

```bash
/beceri-detay webapp-testing
/beceri-detay frontend-design
/beceri-detay security-guidance
```
