import glob
import re
import os

files = glob.glob(r"c:\Users\Yuvraj\Desktop\Stoneo\frontend\src\pages\corousal\*Corousal.jsx")

clean_mobile_css = """  /* Mobile: tighter dots */
  @media (max-width: 480px) {
    .gc-root { padding: 24px 0 32px !important; }
    .gc-title { font-size: 2.2rem !important; margin: 6px 0 !important; }
    .gc-header { margin-bottom: 20px !important; }
    .gc-label { margin-top: 12px !important; }
    .marble-view-all-btn { margin-top: 24px !important; padding: 12px 24px !important; font-size: 1rem !important; }
    .gc-dot { width: 14px !important; height: 14px !important; border-radius: 50% !important; flex-shrink: 0 !important; padding: 0 !important; margin: 0 !important; box-sizing: border-box !important; min-width: 14px !important; min-height: 14px !important; }
    .gc-dot.gc-dot-active { outline: 1.5px solid var(--text-dark) !important; outline-offset: 1.5px !important; transform: scale(1.3) !important; }
    .gc-dots { gap: 8px; max-width: 100%; justify-content: flex-start; align-items: center !important; padding: 6px 0; overflow-x: auto; scroll-behavior: smooth; -ms-overflow-style: none; scrollbar-width: none; }
    .gc-dots::-webkit-scrollbar { display: none; }
    .gc-nav  { gap: 8px; padding: 0 4px; width: 100%; overflow: hidden; margin-top: 16px !important; align-items: center !important; }
  }
`;"""

for file in files:
    if "Reviews" in file:
        continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace from /* Mobile: tighter dots */ up to `;` at the end of the template literal
    content = re.sub(
        r'/\*\s*Mobile:\s*tighter\s*dots\s*\*/.*?`;',
        clean_mobile_css,
        content,
        flags=re.DOTALL
    )
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Fixed dot squishing.")
