import json
import requests
import os

 
INPUT_FILE = 'products.json'
OUTPUT_FILE = 'products_fixed.json'

 
with open(INPUT_FILE, 'r', encoding='utf-8') as f:
    products = json.load(f)

 
corrected_products = []
if os.path.exists(OUTPUT_FILE):
    with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
        corrected_products = json.load(f)

 
processed_brands = {p['foreign_brands'][0] for p in corrected_products}

print(f"Başlatılıyor... {len(processed_brands)} ürün zaten işlendi.")

try:
    for p in products:
        brand = p['foreign_brands'][0]
        
        if brand in processed_brands:
            continue

        prompt = f"Is the brand '{brand}' originally a Turkish founded company? Answer only with 'YES' or 'NO'."
        
        try:
            response = requests.post('http://localhost:11434/api/generate', 
                                     json={"model": "llama3", "prompt": prompt, "stream": False},
                                     timeout=10)
            
            answer = response.json()['response'].strip().upper()
            
             
            p['origin'] = "Türkiye" if "YES" in answer else "Global"
            p['advice'] = "Bu yerli bir üretimdir." if p['origin'] == "Türkiye" else "Bu global bir markadır, yerli alternatifleri seçin."
            
            corrected_products.append(p)
            print(f"Checked {brand}: {p['origin']}")
            
             
            with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
                json.dump(corrected_products, f, ensure_ascii=False, indent=2)

        except Exception as e:
            print(f"Hata oluştu ({brand}): {e}. Ollama açık mı?")
            break # 

except KeyboardInterrupt:
    print("\nProgram durduruldu. İlerleme kaydedildi.")

print(f"Toplam {len(corrected_products)} ürün kaydedildi.")
