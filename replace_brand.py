import os
import re

def repl(m):
    match = m.group(0)
    if match.isupper():
        return "STONEO"
    elif match.startswith('KM') or match.startswith('Km'):
        return "Stoneo"
    else:
        return "stoneo"

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = re.sub(r'km\s*stonex', repl, content, flags=re.IGNORECASE)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('c:\\Users\\Yuvraj\\Desktop\\Stoneo'):
    if 'node_modules' in root or 'dist' in root or '.git' in root or '.gemini' in root:
        continue
    for file in files:
        if file.endswith(('.js', '.jsx', '.json', '.html', '.md', '.txt', '.xml')) and file != 'package-lock.json':
            filepath = os.path.join(root, file)
            try:
                replace_in_file(filepath)
            except Exception as e:
                print(f"Error reading {filepath}: {e}")
