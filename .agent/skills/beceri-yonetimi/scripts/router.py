import json
import sys
import re
from pathlib import Path

# Set encoding for Turkish characters
sys.stdout.reconfigure(encoding='utf-8')

# Configuration
# router.py is at .agent/skills/beceri-yonetimi/scripts/router.py
# Catalog is at .agent/skills/external/SKILL_CATALOG_RAW.json
# Relative path: ../../../external/SKILL_CATALOG_RAW.json (from file), ../../external (from scripts dir)
BASE_DIR = Path(__file__).resolve().parent
CATALOG_PATH = BASE_DIR.parent.parent / "external/SKILL_CATALOG_RAW.json"

def load_catalog():
    if not CATALOG_PATH.exists():
        # Fallback to absolute check or debug print
        # print(f"DEBUG: Looking for catalog at {CATALOG_PATH}")
        pass
        
    if not CATALOG_PATH.exists():
        print(f"Hata: Katalog bulunamadı: {CATALOG_PATH}")
        return []
    try:
        with open(CATALOG_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Hata: Katalog okunamadı: {e}")
        return []

def search_skills(query, catalog):
    query = query.lower()
    results = []
    
    # Simple keyword scoring
    keywords = query.split()
    
    for skill in catalog:
        score = 0
        text = (skill.get("name", "") + " " + skill.get("description_en", "")).lower()
        
        # Exact match bonus
        if query in skill.get("name", "").lower():
            score += 10
            
        for word in keywords:
            if word in text:
                score += 1
        
        if score > 0:
            results.append((score, skill))
            
    # Sort by score desc
    results.sort(key=lambda x: x[0], reverse=True)
    return results[:5] # Return top 5

def main():
    if len(sys.argv) < 2:
        print("Kullanım: python router.py [komut] [parametreler]")
        print("Komutlar: search, detail")
        return

    command = sys.argv[1]
    
    if command == "search":
        query = " ".join(sys.argv[2:])
        if not query:
            print("Lütfen bir arama terimi girin.")
            return
            
        catalog = load_catalog()
        matches = search_skills(query, catalog)
        
        if not matches:
            print("Eşleşen beceri bulunamadı.")
            return
            
        print(f"'{query}' için bulunan sonuçlar:\n")
        for score, skill in matches:
            desc = skill.get('description_en', 'Açıklama yok.')[:100] + "..."
            print(f"- **{skill['name']}** (ID: {skill['id']})")
            print(f"  {desc}")
            print(f"  Yol: {skill['path']}")
            print()
            
    elif command == "detail":
        skill_id = sys.argv[2]
        catalog = load_catalog()
        skill = next((s for s in catalog if s["id"] == skill_id), None)
        
        if not skill:
            print("Beceri bulunamadı.")
            return
            
        print(f"# {skill['name']}")
        print(f"**ID:** {skill['id']}")
        print(f"**Kaynak:** {skill['source']}")
        print(f"**Yol:** {skill['path']}")
        print(f"\n## Açıklama\n{skill.get('description_en', 'Açıklama yok.')}")
        
    else:
        print("Bilinmeyen komut.")

if __name__ == "__main__":
    main()
