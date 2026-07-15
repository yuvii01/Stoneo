import urllib.request
from bs4 import BeautifulSoup
import json
import re

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}

products = []

def scrape_natural_stone_depot():
    url = "https://naturalstonedepot.com/product-category/product/cobbles/"
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        html = urllib.request.urlopen(req).read().decode('utf-8')
        soup = BeautifulSoup(html, 'html.parser')
        
        # WooCommerce products usually in ul.products li.product
        items = soup.select('li.product')
        for item in items:
            title_el = item.select_one('.woocommerce-loop-product__title')
            img_el = item.select_one('img')
            if title_el and img_el:
                products.append({
                    "name": title_el.text.strip(),
                    "image": img_el.get('src') or img_el.get('data-src') or "",
                    "category": "Cobbles"
                })
        print(f"Scraped {len(items)} from naturalstonedepot")
    except Exception as e:
        print("Error naturalstonedepot:", e)

def scrape_vyara_tiles():
    url = "https://vyaratiles.in/products/paving-blocks/high-strength-pavers/brick"
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        html = urllib.request.urlopen(req).read().decode('utf-8')
        soup = BeautifulSoup(html, 'html.parser')
        
        items = soup.select('.elementor-widget-image')
        # Custom logic for vyara
        for item in items:
            img = item.select_one('img')
            if img:
                src = img.get('src')
                if src and 'brick' in src.lower() and 'logo' not in src.lower():
                    products.append({
                        "name": "Vyara Brick Paver",
                        "image": src,
                        "category": "Pavers"
                    })
        print(f"Scraped vyaratiles")
    except Exception as e:
        print("Error vyaratiles:", e)

def scrape_ganesh_stone():
    url = "https://www.ganeshstone.in/paving-stones"
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        html = urllib.request.urlopen(req).read().decode('utf-8')
        soup = BeautifulSoup(html, 'html.parser')
        
        items = soup.select('.product-item, .item')
        if not items:
             items = soup.select('img')
             for img in items:
                 src = img.get('src')
                 if src and ('paving' in src.lower() or 'stone' in src.lower()) and 'logo' not in src.lower():
                     products.append({
                         "name": img.get('alt') or "Ganesh Paving Stone",
                         "image": src if src.startswith('http') else "https://www.ganeshstone.in" + src,
                         "category": "Pavers"
                     })
                     if len(products) > 30: break
        print("Scraped ganeshstone")
    except Exception as e:
        print("Error ganeshstone:", e)

def scrape_belgard():
    # Hardcoded fallback since it's blocked by 403
    products.append({
        "name": "Travertino Paver Ivory",
        "image": "https://www.belgard.com/wp-content/uploads/2022/01/Travertino-Ivory-1-800x800.jpg",
        "category": "Pavers"
    })
    products.append({
        "name": "Travertino Paver Noce",
        "image": "https://www.belgard.com/wp-content/uploads/2022/01/Travertino-Noce-1-800x800.jpg",
        "category": "Pavers"
    })
    print("Added belgard fallback")

def scrape_royal_pebbles():
    url = "https://www.royalindianstones.com/stone-pebbles"
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        html = urllib.request.urlopen(req).read().decode('utf-8')
        soup = BeautifulSoup(html, 'html.parser')
        
        # Royal Indian Stones usually has product grids
        items = soup.select('.product-image-wrapper, .single-products, .productinfo')
        if not items:
            items = soup.select('.portfolio-item')
            
        if not items:
            items = soup.select('img')
            for img in items:
                src = img.get('src')
                if src and ('pebble' in src.lower() or 'stone' in src.lower()) and 'logo' not in src.lower():
                    products.append({
                        "name": img.get('alt') or "Landscape Pebble",
                        "image": src if src.startswith('http') else "https://www.royalindianstones.com/" + src,
                        "category": "Stones"
                    })
        else:
            for item in items:
                img = item.select_one('img')
                p = item.select_one('p')
                if img:
                    products.append({
                        "name": p.text.strip() if p else (img.get('alt') or "Landscape Pebble"),
                        "image": img.get('src') if img.get('src').startswith('http') else "https://www.royalindianstones.com/" + img.get('src'),
                        "category": "Stones"
                    })
        print("Scraped royal pebbles")
    except Exception as e:
        print("Error royal pebbles:", e)

def scrape_royal_stepping():
    url = "https://www.royalindianstones.com/index-stone-stepping"
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        html = urllib.request.urlopen(req).read().decode('utf-8')
        soup = BeautifulSoup(html, 'html.parser')
        
        items = soup.select('.portfolio-item, .product-image-wrapper')
        if not items:
            items = soup.select('img')
            for img in items:
                src = img.get('src')
                if src and 'stepping' in src.lower() and 'logo' not in src.lower():
                    products.append({
                        "name": img.get('alt') or "Stepping Stone",
                        "image": src if src.startswith('http') else "https://www.royalindianstones.com/" + src,
                        "category": "Stones"
                    })
        else:
            for item in items:
                img = item.select_one('img')
                p = item.select_one('p') or item.select_one('h2')
                if img:
                    products.append({
                        "name": p.text.strip() if p else (img.get('alt') or "Stepping Stone"),
                        "image": img.get('src') if img.get('src').startswith('http') else "https://www.royalindianstones.com/" + img.get('src'),
                        "category": "Stones"
                    })
        print("Scraped royal stepping")
    except Exception as e:
        print("Error royal stepping:", e)

def clean_data():
    unique_products = []
    seen = set()
    for p in products:
        # filter out invalid images or logos
        if not p["image"] or 'logo' in p["image"].lower() or p["image"] in seen:
            continue
        if len(p["name"]) < 3:
            p["name"] = p["category"] + " Stone"
            
        seen.add(p["image"])
        unique_products.append(p)
        
    import os
    os.makedirs('c:/Users/yuvra/OneDrive/Desktop/Stoneo/frontend/scripts', exist_ok=True)
    os.makedirs('c:/Users/yuvra/OneDrive/Desktop/Stoneo/frontend/src/utils', exist_ok=True)
    with open('c:/Users/yuvra/OneDrive/Desktop/Stoneo/frontend/src/utils/paving_landscape.json', 'w') as f:
        json.dump(unique_products, f, indent=4)
        print(f"Saved {len(unique_products)} products to paving_landscape.json")

scrape_natural_stone_depot()
scrape_vyara_tiles()
scrape_ganesh_stone()
scrape_belgard()
scrape_royal_pebbles()
scrape_royal_stepping()
clean_data()
